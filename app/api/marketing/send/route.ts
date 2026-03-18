import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { marketingCampaigns, users, orders } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth-middleware';
import { eq, and, sql, lt, gte } from 'drizzle-orm';
import { sendBulkMarketingEmails } from '@/lib/email';
import { getMarketingEmailTemplate } from '@/lib/email-templates';

// POST - Envoyer une campagne
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  let campaignId: number | undefined;

  try {
    const body = await request.json();
    campaignId = body.campaignId;

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // Récupérer la campagne
    const [campaign] = await db
      .select()
      .from(marketingCampaigns)
      .where(eq(marketingCampaigns.id, campaignId));

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Vérifier le statut
    if (campaign.status === 'sent') {
      return NextResponse.json(
        { error: 'Campaign already sent' },
        { status: 400 }
      );
    }

    if (campaign.status === 'sending') {
      return NextResponse.json(
        { error: 'Campaign is currently being sent' },
        { status: 400 }
      );
    }

    // Marquer comme en cours d'envoi
    await db
      .update(marketingCampaigns)
      .set({ status: 'sending' })
      .where(eq(marketingCampaigns.id, campaignId));

    // Récupérer les destinataires selon le segment
    let recipients: Array<{ email: string; name: string }> = [];

    const allUsers = await db.select().from(users).where(eq(users.status, 'active'));
    const allOrders = await db.select().from(orders);

    switch (campaign.targetSegment) {
      case 'all':
        recipients = allUsers
          .filter(u => u.email && u.role !== 'admin')
          .map(u => ({ email: u.email, name: u.name }));
        break;

      case 'vip':
        // Clients avec plus de 5 commandes ou total > 1,000,000 GNF
        recipients = allUsers
          .filter(u => {
            if (!u.email || u.role === 'admin') return false;
            const userOrders = allOrders.filter(o => o.userId === u.id);
            const totalSpent = userOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
            return userOrders.length >= 5 || totalSpent >= 1000000;
          })
          .map(u => ({ email: u.email, name: u.name }));
        break;

      case 'inactive':
        // Clients sans commande depuis 30 jours
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        recipients = allUsers
          .filter(u => {
            if (!u.email || u.role === 'admin') return false;
            const userOrders = allOrders.filter(o => o.userId === u.id);
            if (userOrders.length === 0) return false;
            const lastOrder = userOrders.sort((a, b) => 
              new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
            )[0];
            return new Date(lastOrder.createdAt!) < thirtyDaysAgo;
          })
          .map(u => ({ email: u.email, name: u.name }));
        break;

      case 'new':
        // Clients inscrits dans les 7 derniers jours
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        recipients = allUsers
          .filter(u => {
            if (!u.email || u.role === 'admin') return false;
            return new Date(u.createdAt!) >= sevenDaysAgo;
          })
          .map(u => ({ email: u.email, name: u.name }));
        break;

      default:
        recipients = allUsers
          .filter(u => u.email && u.role !== 'admin')
          .map(u => ({ email: u.email, name: u.name }));
    }

    if (recipients.length === 0) {
      await db
        .update(marketingCampaigns)
        .set({ status: 'draft' })
        .where(eq(marketingCampaigns.id, campaignId));

      return NextResponse.json(
        { error: 'No recipients found for this segment' },
        { status: 400 }
      );
    }

    // Générer le HTML de l'email
    const htmlContent = getMarketingEmailTemplate({
      type: campaign.type as any,
      subject: campaign.subject,
      content: campaign.content,
      customerName: '{{customerName}}', // Sera remplacé pour chaque destinataire
    });

    // Envoyer les emails
    const results = await sendBulkMarketingEmails(
      recipients,
      campaign.subject,
      htmlContent
    );

    // Mettre à jour la campagne
    await db
      .update(marketingCampaigns)
      .set({
        status: 'sent',
        sentAt: new Date(),
        recipientCount: results.sent,
      })
      .where(eq(marketingCampaigns.id, campaignId));

    return NextResponse.json({
      success: true,
      results: {
        total: results.total,
        sent: results.sent,
        failed: results.failed,
      },
    });
  } catch (error) {
    console.error('Error sending campaign:', error);
    
    // Remettre le statut à draft en cas d'erreur
    if (campaignId) {
      await db
        .update(marketingCampaigns)
        .set({ status: 'draft' })
        .where(eq(marketingCampaigns.id, campaignId));
    }

    return NextResponse.json(
      { error: 'Failed to send campaign' },
      { status: 500 }
    );
  }
}

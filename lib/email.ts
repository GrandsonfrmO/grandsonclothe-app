import { Resend } from 'resend';
import { emailStyles, getEmailHeader, getEmailFooter, formatCurrency, formatDate, EMAIL_CONFIG } from './email-templates';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Fonction pour convertir les URLs d'images en URLs absolues
function getAbsoluteImageUrl(imageUrl: string | null | undefined, productName: string = 'Produit'): string {
  if (!imageUrl) {
    // Si pas d'image, utiliser un placeholder
    const encodedName = encodeURIComponent(productName.substring(0, 20));
    return `https://placehold.co/200x200/4A90E2/white?text=${encodedName}`;
  }
  
  // Si l'URL est déjà absolue et publique (commence par http:// ou https://)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // Vérifier si c'est localhost (ne fonctionnera pas dans les emails)
    if (imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1')) {
      console.warn(`⚠️  Image locale détectée (${imageUrl}), elle ne s'affichera pas dans l'email`);
      const encodedName = encodeURIComponent(productName.substring(0, 20));
      return `https://placehold.co/200x200/4A90E2/white?text=${encodedName}`;
    }
    // URL publique valide
    return imageUrl;
  }
  
  // Si c'est un chemin relatif, essayer de construire l'URL absolue
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.VERCEL_URL || 'http://localhost:3000';
  
  // En développement local, utiliser un placeholder car l'image ne sera pas accessible
  if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
    console.warn(`⚠️  Environnement local détecté, utilisation d'un placeholder pour ${productName}`);
    const encodedName = encodeURIComponent(productName.substring(0, 20));
    return `https://placehold.co/200x200/4A90E2/white?text=${encodedName}`;
  }
  
  // En production, construire l'URL absolue
  const cleanPath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
  return `${baseUrl}/${cleanPath}`;
}

// Template pour la confirmation de commande client
function getOrderConfirmationTemplate(orderData: any) {
  const { orderId, customerName, items, totalAmount, deliveryAddress, paymentMethod, createdAt } = orderData;
  
  // Générer la liste des produits avec images
  const productsHtml = items.map((item: any) => {
    const imageUrl = getAbsoluteImageUrl(item.image);
    return `
    <div style="display: table; width: 100%; margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 8px; border-left: 4px solid ${EMAIL_CONFIG.accentColor};">
      <div style="display: table-row;">
        <div style="display: table-cell; width: 100px; vertical-align: top;">
          <img src="${imageUrl}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; display: block;" />
        </div>
        <div style="display: table-cell; padding-left: 15px; vertical-align: top;">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #000;">${item.name}</div>
          <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Quantité: ${item.quantity}</div>
          <div style="font-size: 14px; color: #666; margin-bottom: 8px;">Prix unitaire: ${formatCurrency(item.price)}</div>
          <div style="font-size: 16px; font-weight: bold; color: ${EMAIL_CONFIG.accentColor};">
            Sous-total: ${formatCurrency(item.price * item.quantity)}
          </div>
        </div>
      </div>
    </div>
  `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${emailStyles}</style>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); color: white; padding: 40px 20px; text-align: center; border-bottom: 4px solid ${EMAIL_CONFIG.accentColor};">
          <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: bold;">✓ Commande Confirmée</h1>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">Commande #${orderId}</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          
          <!-- Greeting -->
          <p style="font-size: 16px; margin-bottom: 20px;">
            Bonjour <strong>${customerName}</strong>,
          </p>
          
          <p style="font-size: 14px; color: #666; margin-bottom: 25px;">
            Merci pour votre commande! Nous avons bien reçu votre demande et nous la préparons avec soin.
          </p>

          <!-- Success Badge -->
          <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
            <span style="display: inline-block; background-color: #28a745; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 8px;">
              ✓ CONFIRMÉE
            </span>
            <p style="margin: 8px 0 0 0; font-size: 13px; color: #155724;">
              Votre commande a été enregistrée le ${formatDate(createdAt || new Date())}
            </p>
          </div>

          <!-- Products Section -->
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #000; border-bottom: 2px solid ${EMAIL_CONFIG.accentColor}; padding-bottom: 10px;">
              📦 Détails de votre commande
            </h2>
            ${productsHtml}
          </div>

          <!-- Order Summary -->
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; color: #000;">Récapitulatif</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #666;">Sous-total:</td>
                <td style="padding: 8px 0; text-align: right; font-size: 14px; font-weight: 500;">${formatCurrency(totalAmount)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #666;">Livraison:</td>
                <td style="padding: 8px 0; text-align: right; font-size: 14px; font-weight: 500;">Incluse</td>
              </tr>
              <tr style="border-top: 2px solid #dee2e6;">
                <td style="padding: 12px 0 0 0; font-size: 18px; font-weight: bold; color: #000;">Total:</td>
                <td style="padding: 12px 0 0 0; text-align: right; font-size: 20px; font-weight: bold; color: ${EMAIL_CONFIG.accentColor};">${formatCurrency(totalAmount)}</td>
              </tr>
            </table>
          </div>

          <!-- Delivery Info -->
          <div style="background-color: #e7f3ff; border-left: 4px solid ${EMAIL_CONFIG.accentColor}; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
            <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; color: #000;">📍 Adresse de livraison</h3>
            <p style="margin: 0; font-size: 13px; color: #333;">${deliveryAddress}</p>
          </div>

          <!-- Payment Method -->
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
            <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; color: #000;">💳 Mode de paiement</h3>
            <p style="margin: 0; font-size: 13px; color: #333;">
              ${paymentMethod === 'cash_on_delivery' ? 'Paiement à la livraison' : 'Paiement en ligne'}
            </p>
          </div>

          <!-- Next Steps -->
          <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; color: #000;">📋 Prochaines étapes</h3>
            <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: #666; line-height: 1.8;">
              <li>Nous préparons votre commande</li>
              <li>Vous recevrez un email de confirmation d'expédition</li>
              <li>Votre commande sera livrée à l'adresse indiquée</li>
            </ol>
          </div>

        </div>

        <!-- Footer -->
        <div style="color: #999; font-size: 12px; padding: 20px; border-top: 1px solid #eee; text-align: center; background-color: #f9f9f9;">
          <p style="margin: 10px 0;">© ${new Date().getFullYear()} ${EMAIL_CONFIG.brandName}. Tous droits réservés.</p>
          <p style="margin: 5px 0; color: #999; font-size: 11px;">
            Besoin d'aide? Contactez-nous à support@example.com
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

// Template pour la notification admin
function getAdminOrderNotificationTemplate(orderData: any) {
  const { orderId, customerName, customerEmail, items, totalAmount, deliveryAddress, phoneNumber, createdAt } = orderData;
  
  const productsHtml = items.map((item: any) => {
    const imageUrl = getAbsoluteImageUrl(item.image);
    return `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <img src="${imageUrl}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; display: block;" />
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 13px;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-size: 13px;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-size: 13px;">${formatCurrency(item.price)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-size: 13px; font-weight: bold;">${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>${emailStyles}</style>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
        
        <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0 0 10px 0; font-size: 24px;">🔔 Nouvelle Commande</h1>
          <p style="margin: 0; font-size: 14px;">Commande #${orderId}</p>
        </div>

        <div style="padding: 30px 20px;">
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #856404;">
              ⚡ Action requise: Nouvelle commande à traiter
            </p>
          </div>

          <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">Informations client</h2>
          <table style="width: 100%; margin-bottom: 25px; font-size: 13px;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 120px;">Nom:</td>
              <td style="padding: 8px 0; font-weight: bold;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Email:</td>
              <td style="padding: 8px 0;">${customerEmail || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Téléphone:</td>
              <td style="padding: 8px 0;">${phoneNumber || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Adresse:</td>
              <td style="padding: 8px 0;">${deliveryAddress}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Date:</td>
              <td style="padding: 8px 0;">${formatDate(createdAt || new Date())}</td>
            </tr>
          </table>

          <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">Produits commandés</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: bold;">Image</th>
                <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: bold;">Produit</th>
                <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: bold;">Qté</th>
                <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold;">Prix</th>
                <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${productsHtml}
              <tr style="background-color: #f0f0f0;">
                <td colspan="4" style="padding: 15px; text-align: right; font-weight: bold; font-size: 16px;">TOTAL:</td>
                <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: ${EMAIL_CONFIG.accentColor};">${formatCurrency(totalAmount)}</td>
              </tr>
            </tbody>
          </table>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/2tact/orders" style="display: inline-block; padding: 12px 30px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px;">
              Voir la commande
            </a>
          </div>

        </div>

        <div style="color: #999; font-size: 11px; padding: 20px; border-top: 1px solid #eee; text-align: center; background-color: #f9f9f9;">
          <p style="margin: 5px 0;">Email automatique - Ne pas répondre</p>
        </div>

      </div>
    </body>
    </html>
  `;
}

export const sendOrderConfirmationEmail = async (
  email: string,
  orderData: any
) => {
  try {
    if (!resend) {
      console.warn(`⚠️  Email service not configured. Skipping email to ${email}`);
      return { success: true, skipped: true };
    }

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: `✓ Confirmation de commande #${orderData.orderId} - ${EMAIL_CONFIG.brandName}`,
      html: getOrderConfirmationTemplate(orderData),
    });
    console.log(`✓ Order confirmation email sent to ${email}`);
    return response;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error };
  }
};

export const sendOrderConfirmedByAdminEmail = async (
  email: string,
  orderData: any
) => {
  try {
    if (!resend) {
      console.warn(`⚠️  Email service not configured. Skipping email to ${email}`);
      return { success: true, skipped: true };
    }

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: `✓ Votre commande #${orderData.orderId} a été confirmée - ${EMAIL_CONFIG.brandName}`,
      html: getOrderConfirmedByAdminTemplate(orderData),
    });
    console.log(`✓ Order confirmed by admin email sent to ${email}`);
    return response;
  } catch (error) {
    console.error('Error sending order confirmed by admin email:', error);
    return { success: false, error };
  }
};

export const sendOrderRejectedEmail = async (
  email: string,
  orderData: any
) => {
  try {
    if (!resend) {
      console.warn(`⚠️  Email service not configured. Skipping email to ${email}`);
      return { success: true, skipped: true };
    }

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: `⚠️ Votre commande #${orderData.orderId} a été refusée - ${EMAIL_CONFIG.brandName}`,
      html: getOrderRejectedTemplate(orderData),
    });
    console.log(`✓ Order rejected email sent to ${email}`);
    return response;
  } catch (error) {
    console.error('Error sending order rejected email:', error);
    return { success: false, error };
  }
};

export const sendPaymentConfirmationEmail = async (
  email: string,
  paymentData: any
) => {
  try {
    if (!resend) {
      console.warn(`⚠️  Email service not configured. Skipping email to ${email}`);
      return { success: true, skipped: true };
    }

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
      to: email,
      subject: `Confirmation de paiement - Commande #${paymentData.orderId}`,
      html: `<h1>Paiement confirmé</h1><p>Commande #${paymentData.orderId}</p>`,
    });
    console.log(`✓ Payment confirmation email sent to ${email}`);
    return response;
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    return { success: false, error };
  }
};

export const sendShippingNotificationEmail = async (
  email: string,
  shippingData: any
) => {
  try {
    if (!resend) {
      console.warn(`⚠️  Email service not configured. Skipping email to ${email}`);
      return { success: true, skipped: true };
    }

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: `Votre commande #${shippingData.orderId} est en route`,
      html: `<h1>Commande en route</h1><p>Commande #${shippingData.orderId}</p>`,
    });
    console.log(`✓ Shipping notification email sent to ${email}`);
    return response;
  } catch (error) {
    console.error('Error sending shipping notification email:', error);
    return { success: false, error };
  }
};

export const sendAdminOrderNotificationEmail = async (
  adminEmail: string,
  orderData: any
) => {
  try {
    if (!resend) {
      console.warn(`⚠️  Email service not configured. Skipping admin email to ${adminEmail}`);
      return { success: true, skipped: true };
    }

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: adminEmail,
      subject: `🔔 [ADMIN] Nouvelle commande #${orderData.orderId} - ${formatCurrency(orderData.totalAmount)}`,
      html: getAdminOrderNotificationTemplate(orderData),
    });
    console.log(`✓ Admin notification email sent to ${adminEmail}`);
    return response;
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error };
  }
};

// Marketing email functions
export const sendMarketingEmail = async (
  email: string,
  subject: string,
  htmlContent: string
) => {
  try {
    if (!resend) {
      console.warn(`⚠️  Email service not configured. Skipping marketing email to ${email}`);
      return { success: true, skipped: true };
    }

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: subject,
      html: htmlContent,
    });
    
    console.log(`✓ Marketing email sent to ${email}`);
    return response;
  } catch (error) {
    console.error('Error sending marketing email:', error);
    return { success: false, error };
  }
};

export const sendBulkMarketingEmails = async (
  recipients: Array<{ email: string; name: string }>,
  subject: string,
  htmlContent: string,
  onProgress?: (sent: number, total: number) => void
) => {
  const results = {
    total: recipients.length,
    sent: 0,
    failed: 0,
    errors: [] as Array<{ email: string; error: any }>,
  };

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    try {
      // Remplacer le nom du client dans le contenu
      const personalizedContent = htmlContent.replace(/\{\{customerName\}\}/g, recipient.name);
      
      await sendMarketingEmail(recipient.email, subject, personalizedContent);
      results.sent++;
      
      if (onProgress) {
        onProgress(results.sent, results.total);
      }
      
      // Petit délai pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      results.failed++;
      results.errors.push({ email: recipient.email, error });
      console.error(`Failed to send to ${recipient.email}:`, error);
    }
  }

  return results;
};

// Template pour le refus de commande par l'admin
function getOrderRejectedTemplate(orderData: any) {
  const { orderId, customerName, totalAmount, reason } = orderData;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${emailStyles}</style>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 40px 20px; text-align: center; border-bottom: 4px solid #dc3545;">
          <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: bold;">⚠️ Commande Refusée</h1>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">Commande #${orderId}</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          
          <!-- Greeting -->
          <p style="font-size: 16px; margin-bottom: 20px;">
            Bonjour <strong>${customerName}</strong>,
          </p>
          
          <p style="font-size: 14px; color: #666; margin-bottom: 25px;">
            Nous regrettons de vous informer que votre commande a été refusée.
          </p>

          <!-- Rejection Badge -->
          <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
            <span style="display: inline-block; background-color: #dc3545; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 8px;">
              ✗ REFUSÉE
            </span>
            <p style="margin: 8px 0 0 0; font-size: 13px; color: #721c24;">
              Votre commande a été refusée le ${new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <!-- Reason -->
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
            <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; color: #000;">Raison du Refus</h3>
            <p style="margin: 0; font-size: 13px; color: #333; line-height: 1.6;">
              ${reason || 'Aucune raison spécifiée'}
            </p>
          </div>

          <!-- Order Summary -->
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; color: #000;">Détails de la Commande</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;">Numéro de commande:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">#${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Montant:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">${totalAmount.toFixed(0)} GNF</td>
              </tr>
            </table>
          </div>

          <!-- Next Steps -->
          <div style="margin-top: 30px; padding: 20px; background-color: #e7f3ff; border-radius: 8px; border-left: 4px solid #0066cc;">
            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; color: #000;">Prochaines Étapes</h3>
            <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: #333; line-height: 1.8;">
              <li>Aucun paiement n'a été effectué</li>
              <li>Vous pouvez passer une nouvelle commande à tout moment</li>
              <li>Contactez-nous si vous avez des questions</li>
            </ol>
          </div>

          <!-- Contact -->
          <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
              Besoin d'aide ou d'explications?
            </p>
            <p style="margin: 0; font-size: 14px;">
              <a href="mailto:support@example.com" style="color: #0066cc; text-decoration: none; font-weight: bold;">
                Contactez notre support
              </a>
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="color: #999; font-size: 12px; padding: 20px; border-top: 1px solid #eee; text-align: center; background-color: #f9f9f9;">
          <p style="margin: 10px 0;">© ${new Date().getFullYear()} ${EMAIL_CONFIG.brandName}. Tous droits réservés.</p>
          <p style="margin: 5px 0; color: #999; font-size: 11px;">
            Email automatique - Ne pas répondre
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

// Template pour la confirmation de commande par l'admin
function getOrderConfirmedByAdminTemplate(orderData: any) {
  const { orderId, customerName, items, totalAmount, deliveryAddress, estimatedDelivery } = orderData;
  
  const productsHtml = items.map((item: any) => {
    const imageUrl = getAbsoluteImageUrl(item.image);
    return `
    <div style="display: table; width: 100%; margin-bottom: 15px; padding: 12px; background-color: #f9f9f9; border-radius: 6px;">
      <div style="display: table-row;">
        <div style="display: table-cell; width: 80px; vertical-align: top;">
          <img src="${imageUrl}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px; display: block;" />
        </div>
        <div style="display: table-cell; padding-left: 12px; vertical-align: top;">
          <div style="font-weight: bold; font-size: 15px; margin-bottom: 5px; color: #000;">${item.name}</div>
          <div style="font-size: 13px; color: #666;">Quantité: ${item.quantity} × ${formatCurrency(item.price)}</div>
        </div>
      </div>
    </div>
  `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>${emailStyles}</style>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 40px 20px; text-align: center; border-bottom: 4px solid ${EMAIL_CONFIG.accentColor};">
          <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: bold;">✓ Commande Confirmée</h1>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">Commande #${orderId}</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          
          <!-- Greeting -->
          <p style="font-size: 16px; margin-bottom: 20px;">
            Bonjour <strong>${customerName}</strong>,
          </p>
          
          <p style="font-size: 14px; color: #666; margin-bottom: 25px;">
            Bonne nouvelle! Votre commande a été confirmée par notre équipe et est en cours de préparation.
          </p>

          <!-- Success Badge -->
          <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
            <span style="display: inline-block; background-color: #28a745; color: white; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 8px;">
              ✓ CONFIRMÉE PAR L'ADMIN
            </span>
            <p style="margin: 8px 0 0 0; font-size: 13px; color: #155724;">
              Votre commande est maintenant en traitement et sera expédiée très bientôt.
            </p>
          </div>

          <!-- Products Section -->
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #000; border-bottom: 2px solid ${EMAIL_CONFIG.accentColor}; padding-bottom: 10px;">
              📦 Récapitulatif de votre commande
            </h2>
            ${productsHtml}
          </div>

          <!-- Order Summary -->
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; color: #000;">Montant total</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 2px solid #dee2e6;">
                <td style="padding: 12px 0; font-size: 18px; font-weight: bold; color: #000;">Total:</td>
                <td style="padding: 12px 0; text-align: right; font-size: 20px; font-weight: bold; color: ${EMAIL_CONFIG.accentColor};">${formatCurrency(totalAmount)}</td>
              </tr>
            </table>
          </div>

          <!-- Delivery Info -->
          <div style="background-color: #e7f3ff; border-left: 4px solid ${EMAIL_CONFIG.accentColor}; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
            <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; color: #000;">📍 Adresse de livraison</h3>
            <p style="margin: 0; font-size: 13px; color: #333;">${deliveryAddress}</p>
          </div>

          <!-- Estimated Delivery -->
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
            <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; color: #000;">🚚 Livraison estimée</h3>
            <p style="margin: 0; font-size: 13px; color: #333;">
              ${estimatedDelivery || '24-48 heures'}
            </p>
          </div>

          <!-- Next Steps -->
          <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
            <h3 style="font-size: 16px; font-weight: bold; margin: 0 0 15px 0; color: #000;">📋 Prochaines étapes</h3>
            <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: #666; line-height: 1.8;">
              <li>Votre commande est en cours de préparation</li>
              <li>Vous recevrez un email d'expédition avec le numéro de suivi</li>
              <li>Votre commande sera livrée à l'adresse indiquée</li>
            </ol>
          </div>

        </div>

        <!-- Footer -->
        <div style="color: #999; font-size: 12px; padding: 20px; border-top: 1px solid #eee; text-align: center; background-color: #f9f9f9;">
          <p style="margin: 10px 0;">© ${new Date().getFullYear()} ${EMAIL_CONFIG.brandName}. Tous droits réservés.</p>
          <p style="margin: 5px 0; color: #999; font-size: 11px;">
            Besoin d'aide? Contactez-nous à support@example.com
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

// Template pour notification de connexion admin
function getAdminLoginNotificationTemplate(data: any) {
  const { adminName, adminEmail, loginTime, ipAddress, userAgent, location } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>${emailStyles}</style>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0 0 10px 0; font-size: 24px;">🔐 Connexion Admin Détectée</h1>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">Notification de sécurité</p>
        </div>

        <div style="padding: 30px 20px;">
          
          <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #155724;">
              ✓ Connexion réussie à votre compte administrateur
            </p>
          </div>

          <h2 style="font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #000;">Détails de la connexion</h2>
          
          <table style="width: 100%; margin-bottom: 25px; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; color: #666; width: 140px; border-bottom: 1px solid #eee;">
                <strong>👤 Utilisateur:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                ${adminName}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #666; border-bottom: 1px solid #eee;">
                <strong>📧 Email:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                ${adminEmail}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #666; border-bottom: 1px solid #eee;">
                <strong>🕐 Date et heure:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                ${loginTime}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #666; border-bottom: 1px solid #eee;">
                <strong>🌐 Adresse IP:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                ${ipAddress || 'Non disponible'}
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #666; border-bottom: 1px solid #eee;">
                <strong>💻 Appareil:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
                ${userAgent || 'Non disponible'}
              </td>
            </tr>
            ${location ? `
            <tr>
              <td style="padding: 12px 0; color: #666;">
                <strong>📍 Localisation:</strong>
              </td>
              <td style="padding: 12px 0;">
                ${location}
              </td>
            </tr>
            ` : ''}
          </table>

          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
            <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; color: #856404;">
              ⚠️ Ce n'était pas vous?
            </h3>
            <p style="margin: 0; font-size: 13px; color: #856404; line-height: 1.6;">
              Si vous n'êtes pas à l'origine de cette connexion, veuillez changer votre mot de passe immédiatement et contacter le support.
            </p>
          </div>

          <div style="background-color: #e7f3ff; border-left: 4px solid #0066cc; padding: 15px; border-radius: 4px;">
            <h3 style="font-size: 14px; font-weight: bold; margin: 0 0 10px 0; color: #004085;">
              🔒 Conseils de sécurité
            </h3>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #004085; line-height: 1.8;">
              <li>Ne partagez jamais vos identifiants</li>
              <li>Utilisez un mot de passe fort et unique</li>
              <li>Déconnectez-vous après chaque session</li>
              <li>Activez l'authentification à deux facteurs si disponible</li>
            </ul>
          </div>

        </div>

        <div style="color: #999; font-size: 12px; padding: 20px; border-top: 1px solid #eee; text-align: center; background-color: #f9f9f9;">
          <p style="margin: 10px 0;">© ${new Date().getFullYear()} ${EMAIL_CONFIG.brandName}. Tous droits réservés.</p>
          <p style="margin: 5px 0; color: #999; font-size: 11px;">
            Email automatique de sécurité - Ne pas répondre
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

// Fonction pour envoyer notification de connexion admin
export const sendAdminLoginNotification = async (
  adminEmail: string,
  adminName: string,
  request: any
) => {
  try {
    if (!resend) {
      console.warn(`⚠️  Email service not configured. Skipping admin login notification to ${adminEmail}`);
      return { success: true, skipped: true };
    }

    // Extraire les informations de la requête
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'Non disponible';
    
    const userAgent = request.headers.get('user-agent') || 'Non disponible';
    
    // Simplifier le user agent pour l'affichage
    let deviceInfo = userAgent;
    if (userAgent.includes('Windows')) deviceInfo = '🖥️ Windows';
    else if (userAgent.includes('Mac')) deviceInfo = '🍎 Mac';
    else if (userAgent.includes('Linux')) deviceInfo = '🐧 Linux';
    else if (userAgent.includes('Android')) deviceInfo = '📱 Android';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) deviceInfo = '📱 iOS';

    const loginTime = new Date().toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Africa/Conakry'
    });

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: adminEmail,
      subject: `🔐 Connexion à votre compte admin - ${EMAIL_CONFIG.brandName}`,
      html: getAdminLoginNotificationTemplate({
        adminName,
        adminEmail,
        loginTime,
        ipAddress,
        userAgent: deviceInfo,
        location: null, // Peut être ajouté avec un service de géolocalisation
      }),
    });
    
    console.log(`✓ Admin login notification sent to ${adminEmail}`);
    return response;
  } catch (error) {
    console.error('Error sending admin login notification:', error);
    return { success: false, error };
  }
};


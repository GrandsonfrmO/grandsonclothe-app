'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Mail, 
  Send, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';

interface Campaign {
  id: number;
  name: string;
  subject: string;
  content: string;
  type: 'newsletter' | 'promotion' | 'reactivation' | 'announcement';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  targetSegment: string;
  scheduledAt: string | null;
  sentAt: string | null;
  recipientCount: number;
  openedCount: number;
  clickedCount: number;
  createdAt: string;
}

const statusConfig = {
  draft: { label: 'Brouillon', color: 'bg-gray-500', icon: Edit },
  scheduled: { label: 'Planifiée', color: 'bg-blue-500', icon: Calendar },
  sending: { label: 'En cours', color: 'bg-yellow-500', icon: Clock },
  sent: { label: 'Envoyée', color: 'bg-green-500', icon: CheckCircle2 },
  cancelled: { label: 'Annulée', color: 'bg-red-500', icon: XCircle },
};

const typeConfig = {
  newsletter: { label: 'Newsletter', icon: '📰', color: 'bg-blue-100 text-blue-800' },
  promotion: { label: 'Promotion', icon: '🎉', color: 'bg-purple-100 text-purple-800' },
  reactivation: { label: 'Réactivation', icon: '💝', color: 'bg-pink-100 text-pink-800' },
  announcement: { label: 'Annonce', icon: '📢', color: 'bg-orange-100 text-orange-800' },
};

const segmentConfig = {
  all: { label: 'Tous les clients', icon: Users },
  vip: { label: 'Clients VIP', icon: TrendingUp },
  inactive: { label: 'Clients inactifs', icon: Clock },
  new: { label: 'Nouveaux clients', icon: Plus },
};

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [sending, setSending] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'newsletter' as Campaign['type'],
    targetSegment: 'all',
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/marketing/campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Erreur lors du chargement des campagnes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.subject || !formData.content) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const response = await fetch('/api/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Campagne créée avec succès');
        setShowCreateDialog(false);
        setFormData({
          name: '',
          subject: '',
          content: '',
          type: 'newsletter',
          targetSegment: 'all',
        });
        fetchCampaigns();
      } else {
        toast.error('Erreur lors de la création');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Erreur lors de la création');
    }
  };

  const handleSend = async (campaignId: number) => {
    setSending(true);
    try {
      const response = await fetch('/api/marketing/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Campagne envoyée à ${data.results.sent} destinataires`);
        fetchCampaigns();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCampaign) return;

    try {
      const response = await fetch(`/api/marketing/campaigns/${selectedCampaign.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Campagne supprimée');
        setShowDeleteDialog(false);
        setSelectedCampaign(null);
        fetchCampaigns();
      } else {
        toast.error('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  // Statistiques
  const stats = {
    total: campaigns.length,
    sent: campaigns.filter(c => c.status === 'sent').length,
    draft: campaigns.filter(c => c.status === 'draft').length,
    totalRecipients: campaigns.reduce((sum, c) => sum + c.recipientCount, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campagnes Marketing</h1>
          <p className="text-gray-600 mt-1">Gérez vos campagnes d'emailing</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle campagne
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total campagnes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Envoyées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.sent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Brouillons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Destinataires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalRecipients}</div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 gap-4">
        {campaigns.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Aucune campagne</h3>
              <p className="mt-2 text-gray-600">Créez votre première campagne marketing</p>
              <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Créer une campagne
              </Button>
            </CardContent>
          </Card>
        ) : (
          campaigns.map((campaign) => {
            const StatusIcon = statusConfig[campaign.status].icon;
            const SegmentIcon = segmentConfig[campaign.targetSegment as keyof typeof segmentConfig]?.icon || Users;
            
            return (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{typeConfig[campaign.type].icon}</span>
                        <CardTitle>{campaign.name}</CardTitle>
                      </div>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {campaign.subject}
                        </span>
                        <span className="flex items-center gap-1">
                          <SegmentIcon className="h-4 w-4" />
                          {segmentConfig[campaign.targetSegment as keyof typeof segmentConfig]?.label || campaign.targetSegment}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={typeConfig[campaign.type].color}>
                        {typeConfig[campaign.type].label}
                      </Badge>
                      <Badge className={statusConfig[campaign.status].color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusConfig[campaign.status].label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-6 text-sm text-gray-600">
                      {campaign.status === 'sent' && (
                        <>
                          <span>📧 {campaign.recipientCount} envoyés</span>
                          <span>📅 {new Date(campaign.sentAt!).toLocaleDateString('fr-FR')}</span>
                        </>
                      )}
                      {campaign.status === 'draft' && (
                        <span>📅 Créée le {new Date(campaign.createdAt).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setShowPreviewDialog(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleSend(campaign.id)}
                            disabled={sending}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Envoyer
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedCampaign(campaign);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle campagne marketing</DialogTitle>
            <DialogDescription>
              Créez une campagne d'emailing pour vos clients
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom de la campagne *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Newsletter Janvier 2024"
              />
            </div>
            <div>
              <Label htmlFor="type">Type de campagne *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as Campaign['type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.icon} {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="segment">Destinataires *</Label>
              <Select
                value={formData.targetSegment}
                onValueChange={(value) => setFormData({ ...formData, targetSegment: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(segmentConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject">Objet de l'email *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Ex: Découvrez nos nouveautés!"
              />
            </div>
            <div>
              <Label htmlFor="content">Contenu de l'email *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Écrivez votre message ici... Vous pouvez utiliser {{customerName}} pour personnaliser"
                rows={10}
              />
              <p className="text-xs text-gray-500 mt-1">
                Variables disponibles: {'{'}{'{'} customerName {'}'}{'}'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreate}>
              Créer la campagne
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu de la campagne</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              <div>
                <Label>Nom</Label>
                <p className="text-sm">{selectedCampaign.name}</p>
              </div>
              <div>
                <Label>Objet</Label>
                <p className="text-sm">{selectedCampaign.subject}</p>
              </div>
              <div>
                <Label>Type</Label>
                <Badge className={typeConfig[selectedCampaign.type].color}>
                  {typeConfig[selectedCampaign.type].icon} {typeConfig[selectedCampaign.type].label}
                </Badge>
              </div>
              <div>
                <Label>Contenu</Label>
                <div className="bg-gray-50 p-4 rounded-md text-sm whitespace-pre-wrap">
                  {selectedCampaign.content}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowPreviewDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la campagne?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La campagne sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

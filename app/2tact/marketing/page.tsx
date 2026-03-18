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
  BarChart3,
  Target,
  Zap,
  MousePointer2,
  Loader2,
  Sparkles
} from 'lucide-react';
import { PageHeader } from '@/components/2tact/page-header';
import { cn } from '@/lib/utils';

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

const statusConfig: Record<string, any> = {
  draft: { label: 'Brouillon', color: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: Edit },
  scheduled: { label: 'Planifiée', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Calendar },
  sending: { label: 'Éjection...', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: Loader2 },
  sent: { label: 'Propagée', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: CheckCircle2 },
  cancelled: { label: 'Neutralisée', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20', icon: XCircle },
};

const typeConfig: Record<string, any> = {
  newsletter: { label: 'Newsletter', icon: '📰', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  promotion: { label: 'Offre Élite', icon: '🎉', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  reactivation: { label: 'Rappel d\'Appartenance', icon: '💝', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  announcement: { label: 'Manifeste Urgent', icon: '📢', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
};

const segmentConfig = {
  all: { label: 'Tous les clients', icon: Users },
  vip: { label: 'Membres Élite', icon: TrendingUp },
  inactive: { label: 'Membres Latents', icon: Clock },
  new: { label: 'Nouveaux Adhérents', icon: Plus },
};

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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
      setLoading(true);
      const response = await fetch('/api/marketing/campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Échec de la récupération des manifestes marketing.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.subject || !formData.content) {
      toast.warning('Tous les champs du manifeste doivent être renseignés.');
      return;
    }

    setActionLoading(true);
    const actionToast = toast.loading("Archivement du manifeste...");
    try {
      const response = await fetch('/api/marketing/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Manifeste prêt pour éjection.', { id: actionToast });
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
        toast.error('Erreur système lors de l\'archivage.', { id: actionToast });
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Lien serveur rompu.', { id: actionToast });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSend = async (campaignId: number) => {
    setSending(true);
    const sendToast = toast.loading("Éjection des ondes marketing...");
    try {
      const response = await fetch('/api/marketing/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Propagation réussie : ${data.results.sent} terminaux atteints.`, { id: sendToast });
        fetchCampaigns();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Propagation interrompue.', { id: sendToast });
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      toast.error('Échec de transmission critique.', { id: sendToast });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCampaign) return;

    const delToast = toast.loading("Neutralisation de la campagne...");
    try {
      const response = await fetch(`/api/marketing/campaigns/${selectedCampaign.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Campagne neutralisée définitivement.', { id: delToast });
        setShowDeleteDialog(false);
        setSelectedCampaign(null);
        fetchCampaigns();
      } else {
        toast.error('Défense système : impossible de supprimer.', { id: delToast });
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Erreur réseau fatale.', { id: delToast });
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
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-6 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 animate-pulse">Scan des ondes marketing...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader 
          title="STRATÉGIE MARKETING" 
          description="Gérez la propagation de l'identité Grandson."
        />
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="rounded-full bg-accent hover:bg-accent/90 text-white font-black text-xs uppercase tracking-[0.2em] px-8 py-6 shadow-2xl shadow-accent/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Manifeste
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'MANIFESTES', value: stats.total, icon: Mail, color: 'blue' },
          { label: 'PROPAGÉS', value: stats.sent, icon: Zap, color: 'emerald' },
          { label: 'DESSINS', value: stats.draft, icon: Edit, color: 'gray' },
          { label: 'AUDIENCE', value: stats.totalRecipients, icon: Target, color: 'purple' },
        ].map((stat, i) => (
           <Card key={i} className="bg-secondary/5 border-white/5 rounded-[2rem] overflow-hidden group hover:border-accent/30 transition-all duration-500">
             <CardContent className="p-6">
               <div className="flex items-center gap-4">
                  <div className={cn("p-3 rounded-2xl bg-secondary/10 text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-colors")}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black opacity-30 tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-black italic tracking-tighter">{stat.value}</p>
                  </div>
               </div>
             </CardContent>
           </Card>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="grid grid-cols-1 gap-6">
        {campaigns.length === 0 ? (
          <div className="h-[40vh] flex flex-col items-center justify-center space-y-8 border border-dashed border-white/10 rounded-[3rem] bg-secondary/5">
             <Mail className="h-16 w-16 opacity-5" />
             <div className="text-center space-y-2">
                <p className="text-xl font-black tracking-tight uppercase italic opacity-40">Silence Radio</p>
                <p className="text-sm text-muted-foreground">Aucune campagne n'a encore été émise.</p>
             </div>
             <Button 
                variant="outline" 
                className="rounded-full px-8 opacity-40 hover:opacity-100"
                onClick={() => setShowCreateDialog(true)}
             >
                Lancer Premier Manifeste
             </Button>
          </div>
        ) : (
          campaigns.map((campaign) => {
            const StatusIcon = statusConfig[campaign.status]?.icon || Clock;
            const SegmentIcon = segmentConfig[campaign.targetSegment as keyof typeof segmentConfig]?.icon || Users;
            
            return (
              <Card key={campaign.id} className="group overflow-hidden rounded-[2.5rem] bg-secondary/5 border-white/5 border hover:border-accent/40 shadow-xl transition-all duration-700">
                <CardHeader className="p-8 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl h-10 w-10 flex items-center justify-center bg-secondary/10 rounded-xl border border-white/5 group-hover:bg-accent/10 transition-colors">
                          {typeConfig[campaign.type].icon}
                        </span>
                        <div>
                           <CardTitle className="text-2xl font-black italic tracking-tighter uppercase leading-none">{campaign.name}</CardTitle>
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mt-1">Manifeste ID #{campaign.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 mt-6">
                         <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-accent" />
                            <span className="text-xs font-bold text-muted-foreground italic truncate max-w-[200px]">{campaign.subject}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <SegmentIcon className="h-3 w-3 text-accent" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                               {segmentConfig[campaign.targetSegment as keyof typeof segmentConfig]?.label || campaign.targetSegment}
                            </span>
                         </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={cn("rounded-full border text-[8px] font-black uppercase tracking-widest px-4 h-6", typeConfig[campaign.type].color)}>
                        {typeConfig[campaign.type].label}
                      </Badge>
                      <Badge className={cn("rounded-full border text-[8px] font-black uppercase tracking-widest px-4 h-6 shadow-2xl", statusConfig[campaign.status].color)}>
                        <StatusIcon className={cn("mr-2 h-3 w-3", campaign.status === 'sending' && "animate-spin")} />
                        {statusConfig[campaign.status].label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex gap-8">
                      {campaign.status === 'sent' ? (
                        <>
                          <div className="flex flex-col">
                             <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Atteints</span>
                             <span className="text-sm font-black flex items-center gap-2">
                                <Users className="h-3 w-3 text-accent" /> {campaign.recipientCount}
                             </span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Ouverture</span>
                             <span className="text-sm font-black flex items-center gap-2">
                                <Eye className="h-3 w-3 text-accent" /> {campaign.openedCount}
                             </span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Interaction</span>
                             <span className="text-sm font-black flex items-center gap-2">
                                <MousePointer2 className="h-3 w-3 text-accent" /> {campaign.clickedCount}
                             </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Date d'Archive</span>
                           <span className="text-xs font-bold italic opacity-60">Créée le {new Date(campaign.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-12 w-12 border border-white/5 hover:bg-accent hover:text-white"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setShowPreviewDialog(true);
                        }}
                      >
                        <Eye className="h-5 w-5" />
                      </Button>
                      {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                        <>
                          <Button
                            className="rounded-full h-12 px-8 font-black text-[10px] uppercase tracking-widest bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20"
                            onClick={() => handleSend(campaign.id)}
                            disabled={sending}
                          >
                            <Send className="mr-2 h-3.5 w-3.5" />
                            Propager
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full h-12 w-12 text-destructive/40 hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20"
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background/90 backdrop-blur-2xl border-white/10 rounded-[3rem] p-10 shadow-2xl">
          <DialogHeader className="mb-8 text-left">
            <div className="flex items-center gap-4 mb-2">
                 <div className="w-1.5 h-10 bg-accent rounded-full" />
                 <DialogTitle className="text-4xl font-black italic tracking-tighter uppercase">Rédiger Manifeste</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground uppercase text-[10px] font-black tracking-widest ml-5">
              Définissez votre stratégie de communication visuelle et textuelle.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <div className="space-y-2">
                 <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Identifiant Campagne</Label>
                 <Input
                   id="name"
                   value={formData.name}
                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                   placeholder="Ex: ÉJECTION HIVER 2026"
                   className="rounded-2xl h-14 bg-secondary/5 border-white/5 focus:border-accent/40 text-xs font-black uppercase"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Type d'Onde</Label>
                 <Select
                   value={formData.type}
                   onValueChange={(value) => setFormData({ ...formData, type: value as Campaign['type'] })}
                 >
                   <SelectTrigger className="rounded-2xl h-14 bg-secondary/5 border-white/5 focus:border-accent/40 font-bold">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent className="rounded-2xl bg-background/95 backdrop-blur-xl border-white/10 p-2">
                     {Object.entries(typeConfig).map(([key, config]) => (
                       <SelectItem key={key} value={key} className="rounded-xl h-12 focus:bg-accent/10 focus:text-accent font-bold">
                         <span className="mr-2">{config.icon}</span> {config.label}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="segment" className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Cible de Propagation</Label>
                 <Select
                   value={formData.targetSegment}
                   onValueChange={(value) => setFormData({ ...formData, targetSegment: value })}
                 >
                   <SelectTrigger className="rounded-2xl h-14 bg-secondary/5 border-white/5 focus:border-accent/40 font-bold">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent className="rounded-2xl bg-background/95 backdrop-blur-xl border-white/10 p-2">
                     {Object.entries(segmentConfig).map(([key, config]) => (
                       <SelectItem key={key} value={key} className="rounded-xl h-12 focus:bg-accent/10 focus:text-accent font-bold">
                         {config.label}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                 <Label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Objet du Manifeste</Label>
                 <Input
                   id="subject"
                   value={formData.subject}
                   onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                   placeholder="L'Élite se réveille..."
                   className="rounded-2xl h-14 bg-secondary/5 border-white/5 focus:border-accent/40 text-xs italic"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="content" className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Cœur du Message</Label>
                 <Textarea
                   id="content"
                   value={formData.content}
                   onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                   placeholder="Transmettez l'héritage ici..."
                   rows={6}
                   className="rounded-[2.5rem] bg-secondary/5 border-white/5 focus:border-accent/40 text-sm p-6 resize-none italic"
                 />
                 <div className="flex items-center gap-2 mt-2 px-2">
                    <Sparkles className="h-3 w-3 text-accent" />
                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                      Utilisez {'{'}{'{'} customerName {'}'}{'}'} pour fusionner l'identité.
                    </p>
                 </div>
               </div>
            </div>
          </div>
          <DialogFooter className="mt-10 pt-8 border-t border-white/5 gap-4">
            <Button variant="ghost" onClick={() => setShowCreateDialog(false)} className="rounded-full px-8 font-black uppercase text-[10px] tracking-widest opacity-40">
              Abandonner
            </Button>
            <Button 
               onClick={handleCreate}
               disabled={actionLoading}
               className="rounded-full bg-accent hover:bg-accent/90 text-white font-black text-[10px] uppercase tracking-widest px-12 h-14 shadow-xl shadow-accent/20"
            >
               {actionLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Archiver Manifeste'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-2xl border-white/10 rounded-[3rem] p-12">
          <DialogHeader className="mb-10 text-center">
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em] mb-4">Visualisation Prioritaire</p>
            <DialogTitle className="text-4xl font-black italic tracking-tighter uppercase">{selectedCampaign?.name}</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 rounded-[2rem] bg-secondary/5 border border-white/5">
                    <Label className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-2 block">Objet Transmis</Label>
                    <p className="text-sm font-bold italic">"{selectedCampaign.subject}"</p>
                 </div>
                 <div className="p-6 rounded-[2rem] bg-secondary/5 border border-white/5">
                    <Label className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-2 block">Onde Stratégique</Label>
                    <Badge className={cn("rounded-full border text-[8px] font-black uppercase tracking-widest px-4 h-6", typeConfig[selectedCampaign.type].color)}>
                      {typeConfig[selectedCampaign.type].icon} {typeConfig[selectedCampaign.type].label}
                    </Badge>
                 </div>
              </div>
              <div className="relative group">
                 <div className="absolute -top-4 -left-4 p-3 bg-accent rounded-2xl shadow-2xl z-10">
                    <BarChart3 className="h-4 w-4 text-white" />
                 </div>
                 <div className="bg-secondary/5 border border-white/5 p-10 rounded-[2.5rem] text-sm whitespace-pre-wrap italic opacity-80 leading-relaxed font-medium">
                   {selectedCampaign.content}
                 </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-10 justify-center">
            <Button 
               onClick={() => setShowPreviewDialog(false)}
               className="rounded-full px-12 h-14 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-white/90"
            >
              Fermer l'Oeil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-2xl border-white/10 rounded-[3rem] p-10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl font-black italic uppercase tracking-tighter">Neutraliser Manifeste ?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground italic">
              Cette opération est irréversible. Les ondes de cette campagne seront définitivement étouffées dans les archives.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-4">
            <AlertDialogCancel className="rounded-full h-12 px-8 font-black uppercase text-[10px] tracking-widest opacity-40">Surseoir</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-full h-12 px-8 bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-widest">
              Confirmer Neutralisation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

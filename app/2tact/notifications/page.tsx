'use client';

import { useNotifications } from '@/hooks/use-notifications';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Bell, Trash2, Check, ArrowLeft, Filter, Package, AlertTriangle, Truck, CheckCircle, XCircle, DollarSign, Star, Info, Inbox, Settings, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/2tact/page-header';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const notificationIcons: Record<string, any> = {
  new_order_admin: Package,
  low_stock_admin: AlertTriangle,
  order_shipped: Truck,
  order_delivered: CheckCircle,
  order_cancelled: XCircle,
  payment_received: DollarSign,
  product_review: Star,
};

const notificationColors: Record<string, string> = {
  new_order_admin: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  low_stock_admin: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  order_shipped: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  order_delivered: 'text-green-500 bg-green-500/10 border-green-500/20',
  order_cancelled: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  payment_received: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  product_review: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
};

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { notifications, markAsRead, markAllAsRead, deleteNotification, loading } = useNotifications();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') return null;

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  
  const filteredNotifications = notifications
    .filter((n) => filterType === 'all' || n.type === filterType)
    .filter((n) => 
      searchTerm === '' || 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const notificationTypes = Array.from(new Set(notifications.map((n) => n.type)));

  const handleMarkAllAsRead = async () => {
    const actionToast = toast.loading("Nettoyage de l'esprit...");
    try {
      await markAllAsRead();
      toast.success("Tout est en ordre.", { id: actionToast });
    } catch {
      toast.error("Échec de la synchronisation.", { id: actionToast });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <PageHeader
          title="CENTRE D'ALERTES"
          description={`${unreadNotifications.length} notification${unreadNotifications.length !== 1 ? 's' : ''} en attente de traitement.`}
        />
        
        <div className="flex gap-4">
           {unreadNotifications.length > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="outline"
                className="rounded-full border-accent/20 text-accent hover:bg-accent/10 font-black text-[10px] uppercase tracking-widest px-8"
              >
                <Check className="w-4 h-4 mr-2" />
                Tout Archiver
              </Button>
           )}
           <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-12 w-12 border border-white/5"
           >
              <Settings className="w-5 h-5 opacity-40" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-8">
           <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Filtre Rapide</p>
              <div className="flex flex-col gap-2">
                 <Button
                    variant={filterType === 'all' ? 'secondary' : 'ghost'}
                    onClick={() => setFilterType('all')}
                    className={cn(
                       "justify-start rounded-2xl h-14 px-6 font-bold text-xs uppercase tracking-widest",
                       filterType === 'all' ? "bg-accent/10 text-accent border border-accent/20" : "opacity-40"
                    )}
                 >
                    <Inbox className="w-4 h-4 mr-3" />
                    Toutes les Alertes
                 </Button>
                 {notificationTypes.map((type) => {
                    const Icon = notificationIcons[type] || Info;
                    return (
                       <Button
                          key={type}
                          variant={filterType === type ? 'secondary' : 'ghost'}
                          onClick={() => setFilterType(type)}
                          className={cn(
                             "justify-start rounded-2xl h-14 px-6 font-bold text-xs uppercase tracking-widest",
                             filterType === type ? "bg-accent/10 text-accent border border-accent/20" : "opacity-40"
                          )}
                       >
                          <Icon className="w-4 h-4 mr-3" />
                          {type.replace(/_/g, ' ')}
                       </Button>
                    );
                 })}
              </div>
           </div>

           <div className="p-6 rounded-[2rem] bg-secondary/5 border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-accent rounded-full" />
                 <p className="text-[10px] font-black uppercase tracking-widest">Résumé d'Activité</p>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-40">
                    <span>Non lues</span>
                    <span className="text-accent font-black">{unreadNotifications.length}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest opacity-40">
                    <span>Aujourd'hui</span>
                    <span>{notifications.filter(n => new Date(n.createdAt).toDateString() === new Date().toDateString()).length}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Notifications Main List */}
        <div className="lg:col-span-3 space-y-6">
           {/* Search Bar */}
           <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/40 group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                placeholder="Rechercher dans les archives d'activité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-secondary/5 border border-white/10 rounded-[2rem] h-16 pl-16 pr-8 text-sm focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all"
              />
           </div>

           {loading ? (
             <div className="h-[40vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Scan des fréquences...</p>
             </div>
           ) : filteredNotifications.length === 0 ? (
             <div className="h-[40vh] flex flex-col items-center justify-center space-y-6 border border-dashed border-white/10 rounded-[3rem] bg-secondary/5">
                <Bell className="w-16 h-16 opacity-5" />
                <div className="text-center space-y-1">
                   <h3 className="text-xl font-bold uppercase italic tracking-tight">Zone de Silence</h3>
                   <p className="text-muted-foreground text-sm">Aucune activité détectée pour ce filtre.</p>
                </div>
             </div>
           ) : (
             <div className="space-y-4">
                {filteredNotifications.map((notification) => {
                  const Icon = notificationIcons[notification.type] || Info;
                  return (
                    <Card
                      key={notification.id}
                      className={cn(
                        "group overflow-hidden rounded-[2.5rem] bg-secondary/5 border-white/5 border hover:border-accent/40 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5",
                        !notification.isRead && "bg-accent/5 border-accent/20"
                      )}
                    >
                      <CardContent className="p-8">
                        <div className="flex gap-8">
                          <div className={cn(
                            "flex-shrink-0 w-16 h-16 rounded-[1.5rem] flex items-center justify-center border shadow-inner transition-transform duration-500 group-hover:scale-110",
                            notificationColors[notification.type] || 'text-muted-foreground bg-secondary/20 border-white/10'
                          )}>
                            <Icon className="w-8 h-8" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <h3 className="font-black text-xl italic tracking-tighter uppercase leading-none group-hover:text-accent transition-colors">
                                  {notification.title}
                                </h3>
                                <div className="flex items-center gap-3 mt-2">
                                   <p className="text-muted-foreground/60 text-sm italic line-clamp-2">{notification.message}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">
                                  {formatDistanceToNow(new Date(notification.createdAt), {
                                    addSuffix: true,
                                    locale: fr,
                                  })}
                                </span>
                                {!notification.isRead && (
                                   <Badge className="bg-accent text-white border-0 text-[8px] font-black tracking-widest px-3 h-5 animate-pulse">NOUVEAU</Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                               <div className="flex gap-2">
                                  <Badge variant="outline" className="rounded-full border-white/10 text-[8px] font-black uppercase tracking-widest h-6 px-3 opacity-40">
                                     {notification.type.replace(/_/g, ' ')}
                                  </Badge>
                               </div>
                               
                               <div className="flex gap-2">
                                 {notification.actionUrl && (
                                   <Button
                                     size="sm"
                                     variant="ghost"
                                     onClick={() => router.push(notification.actionUrl!)}
                                     className="rounded-full h-10 px-6 text-[9px] font-black uppercase tracking-widest hover:bg-accent hover:text-white"
                                   >
                                     Intervenir
                                   </Button>
                                 )}
                                 {!notification.isRead && (
                                   <Button
                                     size="sm"
                                     variant="ghost"
                                     onClick={() => markAsRead(notification.id)}
                                     className="rounded-full h-10 w-10 p-0 border border-accent/20 text-accent hover:bg-accent hover:text-white"
                                   >
                                     <Check className="w-4 h-4" />
                                   </Button>
                                 )}
                                 <Button
                                   size="sm"
                                   variant="ghost"
                                   onClick={() => {
                                      const delToast = toast.loading("Suppression...");
                                      deleteNotification(notification.id).then(() => toast.success("Éliminé.", { id: delToast }));
                                   }}
                                   className="rounded-full h-10 w-10 p-0 text-destructive/40 hover:text-destructive hover:bg-destructive/10"
                                 >
                                   <Trash2 className="w-4 h-4" />
                                 </Button>
                               </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

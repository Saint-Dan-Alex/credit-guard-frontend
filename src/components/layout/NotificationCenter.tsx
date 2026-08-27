"use client";

import * as React from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ShieldAlert,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: "info" | "warning" | "success" | "critical";
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Dossier prêt à décaisser",
    description: "Demande APP-2026-8941 approuvée par le comité de crédit.",
    timestamp: "Il y a 5 min",
    read: false,
    type: "success",
  },
  {
    id: "2",
    title: "Alerte Retard DPD > 30j",
    description: "Prêt LN-2026-4892 (Boulangerie Victoire) est passé en Stage 2 PAR30.",
    timestamp: "Il y a 25 min",
    read: false,
    type: "warning",
  },
  {
    id: "3",
    title: "Vérification OCR réussie",
    description: "Pièce d'identité analysée avec un score d'authenticité de 98.4%.",
    timestamp: "Il y a 1 h",
    read: true,
    type: "info",
  },
  {
    id: "4",
    title: "Connexion sécurisée OTP",
    description: "Session authentifiée pour saintdanalex@gmail.com.",
    timestamp: "Il y a 3 h",
    read: true,
    type: "info",
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [open, setOpen] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success("Toutes les notifications ont été marquées comme lues.");
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
      case "critical":
        return <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground hover:text-foreground"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 shadow-2xl rounded-2xl">
        <div className="flex items-center justify-between p-3.5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-foreground">Notifications</h4>
            {unreadCount > 0 && (
              <Badge variant="info" className="px-1.5 py-0 text-[10px]">
                {unreadCount} non lues
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-6 text-[10px] text-muted-foreground hover:text-foreground px-2"
            >
              <Check className="h-3 w-3 mr-1" />
              Tout lire
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="px-3 pt-2">
            <TabsList className="w-full grid grid-cols-2 h-7 p-0.5">
              <TabsTrigger value="all" className="text-[10px]">
                Toutes ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-[10px]">
                Non lues ({unreadCount})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="m-0 mt-2">
            <ScrollArea className="h-72">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Aucune notification
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className={`p-3 text-xs flex gap-2.5 transition-colors cursor-pointer hover:bg-muted/40 ${
                        !item.read ? "bg-blue-50/30 dark:bg-blue-950/20" : ""
                      }`}
                    >
                      <div className="mt-0.5">{getIcon(item.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p
                            className={`font-bold truncate ${
                              !item.read
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {item.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground/70 shrink-0">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="m-0 mt-2">
            <ScrollArea className="h-72">
              {unreadCount === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Toutes les notifications ont été lues
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {notifications
                    .filter((n) => !n.read)
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => markAsRead(item.id)}
                        className="p-3 text-xs flex gap-2.5 transition-colors cursor-pointer bg-blue-50/30 dark:bg-blue-950/20 hover:bg-muted/40"
                      >
                        <div className="mt-0.5">{getIcon(item.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-bold text-foreground truncate">
                              {item.title}
                            </p>
                            <span className="text-[10px] text-muted-foreground/70 shrink-0">
                              {item.timestamp}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

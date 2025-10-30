import { Bell, Check, CheckCheck, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CentralNotificacoes() {
  const [, setLocation] = useLocation();
  
  const { data: notificacoes = [], refetch } = trpc.notificacoes.minhas.useQuery();
  const { data: naoLidas = 0, refetch: refetchContador } = trpc.notificacoes.contarNaoLidas.useQuery();
  
  const marcarLidaMutation = trpc.notificacoes.marcarLida.useMutation({
    onSuccess: () => {
      refetch();
      refetchContador();
    },
  });
  
  const marcarTodasLidasMutation = trpc.notificacoes.marcarTodasLidas.useMutation({
    onSuccess: () => {
      toast.success("Todas as notificações foram marcadas como lidas");
      refetch();
      refetchContador();
    },
  });
  
  const handleClickNotificacao = (notificacao: any) => {
    // Marcar como lida
    if (!notificacao.lida) {
      marcarLidaMutation.mutate({ id: notificacao.id });
    }
    
    // Navegar para o link se existir
    if (notificacao.link) {
      setLocation(notificacao.link);
    }
  };
  
  const getIconeNotificacao = (tipo: string) => {
    switch (tipo) {
      case "forum_resposta":
      case "forum_mencao":
        return "💬";
      case "meta_vencendo":
      case "meta_atrasada":
        return "⏰";
      case "aula_nova":
        return "🎥";
      case "material_novo":
        return "📚";
      case "aviso_geral":
        return "📢";
      case "conquista":
        return "🏆";
      case "sistema":
        return "⚙️";
      default:
        return "🔔";
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {naoLidas > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {naoLidas > 99 ? "99+" : naoLidas}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/configuracoes/notificacoes")}
              title="Configurações de notificações"
            >
              <Settings className="h-4 w-4" />
            </Button>
            {naoLidas > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => marcarTodasLidasMutation.mutate()}
                title="Marcar todas como lidas"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-96">
          {notificacoes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mb-2 opacity-20" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            notificacoes.map((notif: any) => (
              <DropdownMenuItem
                key={notif.id}
                className={`flex flex-col items-start gap-1 p-4 cursor-pointer ${
                  !notif.lida ? "bg-blue-50 dark:bg-blue-950/20" : ""
                }`}
                onClick={() => handleClickNotificacao(notif)}
              >
                <div className="flex items-start gap-3 w-full">
                  <span className="text-2xl flex-shrink-0">
                    {getIconeNotificacao(notif.tipo)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm leading-tight">
                        {notif.titulo}
                      </p>
                      {!notif.lida && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notif.mensagem}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        {notificacoes.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center text-sm text-muted-foreground cursor-pointer"
              onClick={() => setLocation("/notificacoes")}
            >
              Ver todas as notificações
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

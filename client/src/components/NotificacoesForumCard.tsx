import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageSquare, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function NotificacoesForumCard() {
  const [, setLocation] = useLocation();
  const [notificacoesVisiveis, setNotificacoesVisiveis] = useState<number[]>([]);

  // Buscar notificações de respostas do fórum
  const { data: notificacoes = [], refetch } = trpc.forum.notificacoesRespostas.useQuery();

  // Mutation para marcar como lida
  const marcarLidaMutation = trpc.forum.marcarNotificacaoLida.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleClickNotificacao = async (topicoId: number, respostaId: number) => {
    // Marcar como lida
    await marcarLidaMutation.mutateAsync({ respostaId });
    
    // Redirecionar para o tópico
    setLocation(`/forum/${topicoId}`);
  };

  const handleDismiss = async (e: React.MouseEvent, respostaId: number) => {
    e.stopPropagation();
    
    // Ocultar visualmente
    setNotificacoesVisiveis(prev => [...prev, respostaId]);
    
    // Marcar como lida no backend
    await marcarLidaMutation.mutateAsync({ respostaId });
    
    toast.success("Notificação dispensada");
  };

  const notificacoesFiltradas = notificacoes.filter(
    n => !notificacoesVisiveis.includes(n.id)
  );

  const totalNaoLidas = notificacoesFiltradas.length;

  // Se não houver notificações, mostrar card vazio
  if (totalNaoLidas === 0) {
    return (
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                Notificações do Fórum
              </h3>
              <p className="text-sm text-muted-foreground">
                Nenhuma resposta nova no momento
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Se houver notificações, mostrar a primeira com contador
  const primeiraNotificacao = notificacoesFiltradas[0];

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer h-full relative group"
      onClick={() => handleClickNotificacao(primeiraNotificacao.topicoId, primeiraNotificacao.id)}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg relative">
            <Bell className="h-6 w-6 text-blue-600" />
            {totalNaoLidas > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {totalNaoLidas}
              </Badge>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold flex items-center gap-2">
                Notificações do Fórum
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDismiss(e, primeiraNotificacao.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground truncate">
                {primeiraNotificacao.topicoTitulo}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                <span>
                  {primeiraNotificacao.respondidoPor} respondeu
                </span>
                {primeiraNotificacao.respondidoPorRole !== "aluno" && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    {primeiraNotificacao.respondidoPorRole}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {primeiraNotificacao.respostaConteudo}
              </p>
              
              {totalNaoLidas > 1 && (
                <p className="text-xs text-blue-600 font-medium mt-2">
                  + {totalNaoLidas - 1} {totalNaoLidas - 1 === 1 ? "outra resposta" : "outras respostas"}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

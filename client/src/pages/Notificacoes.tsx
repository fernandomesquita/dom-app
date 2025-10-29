import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";
import { ArrowLeft, Bell, MessageSquare, X } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Notificacoes() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  
  const { data: notificacoes, refetch } = trpc.forum.notificacoesRespostas.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  
  const marcarComoLidaMutation = trpc.forum.marcarNotificacaoLida.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleMarcarLida = async (respostaId: number) => {
    try {
      await marcarComoLidaMutation.mutateAsync({ respostaId });
    } catch (error) {
      toast.error("Erro ao marcar notificação como lida");
    }
  };

  const handleVerTopico = (topicoId: number, respostaId: number) => {
    handleMarcarLida(respostaId);
    setLocation(`/forum?topico=${topicoId}`);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "master":
        return "bg-purple-500 text-white";
      case "mentor":
        return "bg-blue-500 text-white";
      case "professor":
        return "bg-green-500 text-white";
      case "administrativo":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "master":
        return "Master";
      case "mentor":
        return "Mentor";
      case "professor":
        return "Professor";
      case "administrativo":
        return "Admin";
      default:
        return "Aluno";
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumb items={[{ label: "Notificações do Fórum" }]} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Bell className="h-8 w-8" />
            Notificações do Fórum
          </h1>
          <p className="text-muted-foreground mt-2">
            Acompanhe as respostas às suas perguntas
          </p>
        </div>
        {notificacoes && notificacoes.length > 0 && (
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {notificacoes.length} {notificacoes.length === 1 ? "nova" : "novas"}
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {!notificacoes || notificacoes.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Bell className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma notificação nova</h3>
              <p className="text-muted-foreground">
                Quando alguém responder suas perguntas no fórum, você será notificado aqui.
              </p>
            </CardContent>
          </Card>
        ) : (
          notificacoes.map((notif) => (
            <Card key={notif.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      {notif.topicoTitulo}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Respondido por{" "}
                      <Badge className={getRoleBadgeColor(notif.respondidoPorRole)}>
                        {notif.respondidoPor} • {getRoleLabel(notif.respondidoPorRole)}
                      </Badge>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMarcarLida(notif.id)}
                    title="Dispensar notificação"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg mb-4">
                  <p className="text-sm line-clamp-3">{notif.respostaConteudo}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(notif.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <Button onClick={() => handleVerTopico(notif.topicoId, notif.id)}>
                    Ver Tópico Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

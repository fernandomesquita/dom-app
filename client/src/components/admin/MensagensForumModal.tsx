import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, MessageCircle, MessageSquare } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format } from "date-fns";

interface MensagensForumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  userName: string;
}

export default function MensagensForumModal({ open, onOpenChange, userId, userName }: MensagensForumModalProps) {
  const { data, isLoading, refetch } = trpc.forum.getMensagensUsuario.useQuery(
    { userId },
    { enabled: open }
  );

  const deletarTopico = trpc.forum.deletarTopico.useMutation({
    onSuccess: () => {
      toast.success("Tópico excluído com sucesso");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao excluir tópico");
    },
  });

  const deletarResposta = trpc.forum.deletarResposta.useMutation({
    onSuccess: () => {
      toast.success("Resposta excluída com sucesso");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao excluir resposta");
    },
  });

  const handleDeletarTopico = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este tópico?")) {
      deletarTopico.mutate({ id });
    }
  };

  const handleDeletarResposta = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta resposta?")) {
      deletarResposta.mutate({ id });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mensagens do Fórum - {userName}</DialogTitle>
          <DialogDescription>
            Visualize e gerencie todas as participações deste usuário no fórum
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            Carregando mensagens...
          </div>
        )}

        {!isLoading && data && (
          <div className="space-y-6">
            {/* Tópicos Criados */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg">Tópicos Criados ({data.topicos.length})</h3>
              </div>
              
              {data.topicos.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhum tópico criado</p>
              ) : (
                <div className="space-y-3">
                  {data.topicos.map((topico) => (
                    <Card key={topico.id} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base">{topico.titulo}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{topico.categoria}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(topico.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletarTopico(topico.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {topico.conteudo}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span>👁️ {topico.visualizacoes} visualizações</span>
                          <span>❤️ {topico.curtidas} curtidas</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Respostas */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-lg">Respostas ({data.respostas.length})</h3>
              </div>
              
              {data.respostas.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhuma resposta enviada</p>
              ) : (
                <div className="space-y-3">
                  {data.respostas.map((resposta) => (
                    <Card key={resposta.id} className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {resposta.solucao === 1 && (
                              <Badge className="bg-green-100 text-green-800">
                                ✓ Melhor Resposta
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(resposta.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletarResposta(resposta.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          {resposta.conteudo}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span>❤️ {resposta.curtidas} curtidas</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Resumo */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Resumo de Participação</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total de Tópicos:</span>
                  <span className="ml-2 font-semibold">{data.topicos.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total de Respostas:</span>
                  <span className="ml-2 font-semibold">{data.respostas.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Melhores Respostas:</span>
                  <span className="ml-2 font-semibold text-green-600">
                    {data.respostas.filter(r => r.solucao === 1).length}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total de Mensagens:</span>
                  <span className="ml-2 font-semibold">
                    {data.topicos.length + data.respostas.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

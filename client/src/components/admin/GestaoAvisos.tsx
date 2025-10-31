import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Trash2, Eye, EyeOff, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface Aviso {
  id: number;
  titulo: string;
  conteudo: string;
  tipo: "info" | "alerta" | "urgente";
  destinatarios: "todos" | "plano_especifico";
  planoId?: number;
  dataEnvio: Date;
  ativo: boolean;
  visualizacoes: number;
}

export default function GestaoAvisos() {
  const { data: avisos = [], refetch } = trpc.avisos.list.useQuery();
  const criarMutation = trpc.avisos.criar.useMutation({
    onSuccess: () => {
      toast.success("Aviso criado com sucesso!");
      refetch();
      setDialogOpen(false);
      setNovoAviso({
        titulo: "",
        conteudo: "",
        tipo: "info",
        destinatarios: "todos",
        planoId: undefined,
      });
    },
    onError: (error) => {
      toast.error(`Erro ao criar aviso: ${error.message}`);
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [novoAviso, setNovoAviso] = useState({
    titulo: "",
    conteudo: "",
    tipo: "info" as const,
    destinatarios: "todos" as const,
    planoId: undefined as number | undefined,
  });

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "alerta":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "urgente":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "info":
        return "Informação";
      case "alerta":
        return "Alerta";
      case "urgente":
        return "Urgente";
      default:
        return tipo;
    }
  };

  const handleCriarAviso = () => {
    if (!novoAviso.titulo || !novoAviso.conteudo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    criarMutation.mutate({
      titulo: novoAviso.titulo,
      mensagem: novoAviso.conteudo,
      tipo: novoAviso.tipo,
    });
  };

  const handleToggleAtivo = (id: number) => {
    // TODO: Implementar mutation para ativar/desativar aviso
    toast.info("Funcionalidade em desenvolvimento");
  };

  const handleExcluirAviso = (id: number) => {
    // TODO: Implementar mutation para excluir aviso
    toast.info("Funcionalidade em desenvolvimento");
  };

  return (
    <div className="space-y-6">
      {/* Header com botão de criar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sistema de Avisos</h2>
          <p className="text-muted-foreground">
            Envie comunicados e notificações para os alunos
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Aviso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Aviso</DialogTitle>
              <DialogDescription>
                Preencha as informações abaixo para enviar um aviso aos alunos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={novoAviso.titulo}
                  onChange={(e) => setNovoAviso({ ...novoAviso, titulo: e.target.value })}
                  placeholder="Ex: Atualização importante"
                />
              </div>

              <div>
                <Label htmlFor="conteudo">Conteúdo *</Label>
                <Textarea
                  id="conteudo"
                  value={novoAviso.conteudo}
                  onChange={(e) => setNovoAviso({ ...novoAviso, conteudo: e.target.value })}
                  placeholder="Digite o conteúdo do aviso..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo">Tipo de Aviso</Label>
                  <Select
                    value={novoAviso.tipo}
                    onValueChange={(v) => setNovoAviso({ ...novoAviso, tipo: v as typeof novoAviso.tipo })}
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Informação</SelectItem>
                      <SelectItem value="alerta">Alerta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="destinatarios">Destinatários</Label>
                  <Select
                    value={novoAviso.destinatarios}
                    onValueChange={(v) => setNovoAviso({ ...novoAviso, destinatarios: v as typeof novoAviso.destinatarios })}
                  >
                    <SelectTrigger id="destinatarios">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Alunos</SelectItem>
                      <SelectItem value="plano_especifico">Plano Específico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(novoAviso.destinatarios as string) === "plano_especifico" && (
                <div>
                  <Label htmlFor="plano">Selecione o Plano</Label>
                  <Select
                    value={novoAviso.planoId?.toString()}
                    onValueChange={(v) => setNovoAviso({ ...novoAviso, planoId: parseInt(v) })}
                  >
                    <SelectTrigger id="plano">
                      <SelectValue placeholder="Escolha um plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">TJ-SP 2025</SelectItem>
                      <SelectItem value="2">OAB XXXIX</SelectItem>
                      <SelectItem value="3">Magistratura Federal</SelectItem>
                      <SelectItem value="4">MPF 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={handleCriarAviso} className="flex-1">
                  <Bell className="h-4 w-4 mr-2" />
                  Enviar Aviso
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Avisos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avisos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avisos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {avisos.filter(a => a.ativo).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Visualizações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {avisos.reduce((sum, a) => sum + a.visualizacoes, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Média de Visualizações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(avisos.reduce((sum, a) => sum + a.visualizacoes, 0) / avisos.length)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Avisos */}
      <div className="space-y-4">
        {avisos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Nenhum aviso criado</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando seu primeiro aviso para os alunos
              </p>
            </CardContent>
          </Card>
        ) : (
          avisos.map((aviso) => (
            <Card key={aviso.id} className={!aviso.ativo ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{aviso.titulo}</CardTitle>
                      <Badge className={getTipoColor(aviso.tipo)}>
                        {getTipoLabel(aviso.tipo)}
                      </Badge>
                      {!aviso.ativo && (
                        <Badge variant="outline" className="bg-gray-100">
                          Inativo
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-base">
                      {aviso.conteudo}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {aviso.dataEnvio.toLocaleDateString("pt-BR")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {aviso.visualizacoes} visualizações
                      </span>
                      <span>
                        {aviso.destinatarios === "todos" ? "Todos os alunos" : "Plano específico"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleAtivo(aviso.id)}
                    >
                      {aviso.ativo ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Ativar
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExcluirAviso(aviso.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

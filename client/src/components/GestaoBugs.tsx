import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  Bug,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

export default function GestaoBugs() {
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroPrioridade, setFiltroPrioridade] = useState<string>("todos");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos");
  const [busca, setBusca] = useState("");
  const [bugSelecionado, setBugSelecionado] = useState<any | null>(null);
  const [modalDetalhes, setModalDetalhes] = useState(false);
  const [modalAlterarStatus, setModalAlterarStatus] = useState(false);
  const [novoStatus, setNovoStatus] = useState<string>("");
  const [observacoes, setObservacoes] = useState("");

  // Queries
  const { data: bugs, isLoading, refetch } = trpc.bugs.listar.useQuery({
    status: filtroStatus !== "todos" ? filtroStatus : undefined,
    prioridade: filtroPrioridade !== "todos" ? filtroPrioridade : undefined,
    categoria: filtroCategoria !== "todos" ? filtroCategoria : undefined,
  });

  const { data: contadores } = trpc.bugs.contadores.useQuery();

  // Mutations
  const atualizarStatusMutation = trpc.bugs.atualizarStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      refetch();
      setModalAlterarStatus(false);
      setObservacoes("");
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deletarMutation = trpc.bugs.deletar.useMutation({
    onSuccess: () => {
      toast.success("Bug deletado com sucesso!");
      refetch();
      setModalDetalhes(false);
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const bugsFiltrados = bugs?.filter((bug) => {
    if (!busca) return true;
    const buscaLower = busca.toLowerCase();
    return (
      bug.titulo.toLowerCase().includes(buscaLower) ||
      bug.descricao.toLowerCase().includes(buscaLower) ||
      bug.userName?.toLowerCase().includes(buscaLower)
    );
  });

  const getStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
      pendente: {
        label: "Pendente",
        className: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="h-3 w-3" />,
      },
      em_analise: {
        label: "Em Análise",
        className: "bg-blue-100 text-blue-800",
        icon: <RefreshCw className="h-3 w-3" />,
      },
      resolvido: {
        label: "Resolvido",
        className: "bg-green-100 text-green-800",
        icon: <CheckCircle2 className="h-3 w-3" />,
      },
      fechado: {
        label: "Fechado",
        className: "bg-gray-100 text-gray-800",
        icon: <XCircle className="h-3 w-3" />,
      },
    };

    const config = configs[status] || configs.pendente;
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getPrioridadeBadge = (prioridade: string) => {
    const configs: Record<string, { label: string; className: string }> = {
      baixa: { label: "Baixa", className: "bg-green-100 text-green-800" },
      media: { label: "Média", className: "bg-yellow-100 text-yellow-800" },
      alta: { label: "Alta", className: "bg-orange-100 text-orange-800" },
      critica: { label: "Crítica", className: "bg-red-100 text-red-800" },
    };

    const config = configs[prioridade] || configs.media;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getCategoriaNome = (categoria: string) => {
    const nomes: Record<string, string> = {
      interface: "Interface/Visual",
      funcionalidade: "Funcionalidade",
      performance: "Performance",
      dados: "Dados Incorretos",
      mobile: "Mobile",
      outro: "Outro",
    };
    return nomes[categoria] || categoria;
  };

  const handleVerDetalhes = (bug: any) => {
    setBugSelecionado(bug);
    setModalDetalhes(true);
  };

  const handleAlterarStatus = (bug: any) => {
    setBugSelecionado(bug);
    setNovoStatus(bug.status);
    setObservacoes(bug.observacoesAdmin || "");
    setModalAlterarStatus(true);
  };

  const handleSalvarStatus = async () => {
    if (!bugSelecionado) return;

    await atualizarStatusMutation.mutateAsync({
      bugId: bugSelecionado.id,
      status: novoStatus as any,
      observacoes: observacoes || undefined,
    });
  };

  const handleDeletar = async (bugId: number) => {
    if (!confirm("Tem certeza que deseja deletar este bug?")) return;
    await deletarMutation.mutateAsync({ bugId });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contadores?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-600">
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {contadores?.pendente || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-600">
              Em Análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {contadores?.em_analise || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-600">
              Resolvidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {contadores?.resolvido || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Fechados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {contadores?.fechado || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Título, descrição ou usuário..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_analise">Em Análise</SelectItem>
                  <SelectItem value="resolvido">Resolvido</SelectItem>
                  <SelectItem value="fechado">Fechado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Prioridade</Label>
              <Select value={filtroPrioridade} onValueChange={setFiltroPrioridade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="critica">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Categoria</Label>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="interface">Interface</SelectItem>
                  <SelectItem value="funcionalidade">Funcionalidade</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="dados">Dados</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listagem de Bugs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Bugs Reportados ({bugsFiltrados?.length || 0})
          </CardTitle>
          <CardDescription>
            Gerencie todos os bugs e problemas reportados pelos usuários
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando bugs...
            </div>
          ) : bugsFiltrados && bugsFiltrados.length > 0 ? (
            <div className="space-y-3">
              {bugsFiltrados.map((bug) => (
                <div
                  key={bug.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{bug.titulo}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {bug.descricao}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(bug.status)}
                        {getPrioridadeBadge(bug.prioridade)}
                        <Badge variant="outline">{getCategoriaNome(bug.categoria)}</Badge>
                        {bug.screenshots && JSON.parse(bug.screenshots).length > 0 && (
                          <Badge variant="outline" className="bg-blue-50">
                            📷 {JSON.parse(bug.screenshots).length} screenshot(s)
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>👤 {bug.userName || "Usuário desconhecido"}</span>
                        <span>📅 {new Date(bug.createdAt).toLocaleString("pt-BR")}</span>
                        {bug.paginaUrl && (
                          <span className="truncate max-w-xs">🔗 {bug.paginaUrl}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerDetalhes(bug)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAlterarStatus(bug)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletar(bug.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum bug encontrado
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      {bugSelecionado && (
        <Dialog open={modalDetalhes} onOpenChange={setModalDetalhes}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Bug #{bugSelecionado.id}</DialogTitle>
              <DialogDescription>
                Reportado por {bugSelecionado.userName} em{" "}
                {new Date(bugSelecionado.createdAt).toLocaleString("pt-BR")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Título</Label>
                <p className="text-sm mt-1">{bugSelecionado.titulo}</p>
              </div>

              <div>
                <Label className="font-semibold">Descrição</Label>
                <p className="text-sm mt-1 whitespace-pre-wrap">{bugSelecionado.descricao}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Status</Label>
                  <div className="mt-1">{getStatusBadge(bugSelecionado.status)}</div>
                </div>
                <div>
                  <Label className="font-semibold">Prioridade</Label>
                  <div className="mt-1">{getPrioridadeBadge(bugSelecionado.prioridade)}</div>
                </div>
              </div>

              <div>
                <Label className="font-semibold">Categoria</Label>
                <p className="text-sm mt-1">{getCategoriaNome(bugSelecionado.categoria)}</p>
              </div>

              {bugSelecionado.paginaUrl && (
                <div>
                  <Label className="font-semibold">Página</Label>
                  <p className="text-sm mt-1 break-all">{bugSelecionado.paginaUrl}</p>
                </div>
              )}

              {bugSelecionado.navegador && (
                <div>
                  <Label className="font-semibold">Navegador</Label>
                  <p className="text-sm mt-1">{bugSelecionado.navegador}</p>
                </div>
              )}

              {bugSelecionado.resolucao && (
                <div>
                  <Label className="font-semibold">Resolução</Label>
                  <p className="text-sm mt-1">{bugSelecionado.resolucao}</p>
                </div>
              )}

              {bugSelecionado.screenshots && bugSelecionado.screenshots.length > 0 && (
                <div>
                  <Label className="font-semibold">Screenshots</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {bugSelecionado.screenshots.map((url: string, index: number) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={url}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-48 object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {bugSelecionado.observacoesAdmin && (
                <div>
                  <Label className="font-semibold">Observações do Admin</Label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">
                    {bugSelecionado.observacoesAdmin}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setModalDetalhes(false)}>
                Fechar
              </Button>
              <Button onClick={() => {
                setModalDetalhes(false);
                handleAlterarStatus(bugSelecionado);
              }}>
                Alterar Status
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Alterar Status */}
      {bugSelecionado && (
        <Dialog open={modalAlterarStatus} onOpenChange={setModalAlterarStatus}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Alterar Status do Bug</DialogTitle>
              <DialogDescription>
                Bug #{bugSelecionado.id}: {bugSelecionado.titulo}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Novo Status</Label>
                <Select value={novoStatus} onValueChange={setNovoStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_analise">Em Análise</SelectItem>
                    <SelectItem value="resolvido">Resolvido</SelectItem>
                    <SelectItem value="fechado">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Observações (opcional)</Label>
                <Textarea
                  placeholder="Adicione observações sobre a resolução ou análise..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setModalAlterarStatus(false)}
                disabled={atualizarStatusMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSalvarStatus}
                disabled={atualizarStatusMutation.isPending}
              >
                {atualizarStatusMutation.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Video, Plus, Search, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export default function GestaoAulas() {
  const [busca, setBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState<string>("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [aulaEditando, setAulaEditando] = useState<any>(null);

  // Form state
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [tipoConteudo, setTipoConteudo] = useState("videoaula");
  const [urlConteudo, setUrlConteudo] = useState("");

  const utils = trpc.useUtils();
  const { data: aulas = [], isLoading } = trpc.aulas.list.useQuery();
  const criarAula = trpc.aulas.criar.useMutation({
    onSuccess: () => {
      toast.success("Aula criada com sucesso!");
      utils.aulas.list.invalidate();
      fecharModal();
    },
    onError: (error: unknown) => {
      toast.error(`Erro ao criar aula: ${getErrorMessage(error)}`);
    },
  });

  const atualizarAula = trpc.aulas.atualizar.useMutation({
    onSuccess: () => {
      toast.success("Aula atualizada com sucesso!");
      utils.aulas.list.invalidate();
      fecharModal();
    },
    onError: (error: unknown) => {
      toast.error(`Erro ao atualizar aula: ${getErrorMessage(error)}`);
    },
  });

  const toggleAtivoMutation = trpc.aulas.toggleAtivo.useMutation({
    onSuccess: () => {
      toast.success("Status da aula atualizado!");
      utils.aulas.list.invalidate();
    },
    onError: (error: unknown) => {
      toast.error(`Erro: ${getErrorMessage(error)}`);
    },
  });

  const deletarAula = trpc.aulas.deletar.useMutation({
    onSuccess: () => {
      toast.success("Aula deletada com sucesso!");
      utils.aulas.list.invalidate();
    },
    onError: (error: unknown) => {
      toast.error(`Erro ao deletar aula: ${getErrorMessage(error)}`);
    },
  });

  const fecharModal = () => {
    setModalAberto(false);
    setAulaEditando(null);
    setTitulo("");
    setDescricao("");
    setDisciplina("");
    setTipoConteudo("videoaula");
    setUrlConteudo("");
  };

  const abrirModalEdicao = (aula: any) => {
    setAulaEditando(aula);
    setTitulo(aula.titulo);
    setDescricao(aula.descricao || "");
    setDisciplina(aula.disciplina);
    setTipoConteudo(aula.tipoConteudo);
    setUrlConteudo(aula.urlConteudo);
    setModalAberto(true);
  };

  const handleSubmit = () => {
    if (!titulo || !disciplina || !urlConteudo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const dados = {
      titulo,
      descricao,
      disciplina,
      tipoConteudo,
      urlConteudo,
    };

    if (aulaEditando) {
      atualizarAula.mutate({ id: aulaEditando.id, ...dados });
    } else {
      criarAula.mutate(dados);
    }
  };

  const handleToggleAtivo = (id: number, ativoAtual: number) => {
    toggleAtivoMutation.mutate({ id, ativo: ativoAtual ? 0 : 1 });
  };

  const handleDeletar = (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta aula?")) {
      deletarAula.mutate({ id });
    }
  };

  // Filtrar aulas
  const aulasFiltradas = aulas.filter((aula: any) => {
    const matchBusca = aula.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      aula.disciplina.toLowerCase().includes(busca.toLowerCase());
    const matchAtivo = filtroAtivo === "todos" ||
      (filtroAtivo === "ativos" && aula.ativo === 1) ||
      (filtroAtivo === "inativos" && aula.ativo === 0);
    return matchBusca && matchAtivo;
  });

  const tiposConteudo = [
    { value: "videoaula", label: "Videoaula", icon: "🎥" },
    { value: "pdf", label: "PDF", icon: "📄" },
    { value: "audio", label: "Áudio/Podcast", icon: "🎧" },
    { value: "slides", label: "Slides", icon: "📊" },
    { value: "texto", label: "Texto/Artigo", icon: "📝" },
    { value: "exercicio", label: "Exercício", icon: "✏️" },
    { value: "outro", label: "Outro", icon: "📦" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Aulas</h2>
          <p className="text-muted-foreground">Gerencie o conteúdo disponível para os alunos</p>
        </div>
        <Dialog open={modalAberto} onOpenChange={setModalAberto}>
          <DialogTrigger asChild>
            <Button onClick={() => setAulaEditando(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Aula
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{aulaEditando ? "Editar Aula" : "Nova Aula"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Introdução ao Direito Constitucional"
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva o conteúdo da aula..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="disciplina">Disciplina *</Label>
                <Input
                  id="disciplina"
                  value={disciplina}
                  onChange={(e) => setDisciplina(e.target.value)}
                  placeholder="Ex: Direito Constitucional"
                />
              </div>

              <div>
                <Label htmlFor="tipoConteudo">Tipo de Conteúdo</Label>
                <Select value={tipoConteudo} onValueChange={setTipoConteudo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposConteudo.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.icon} {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="urlConteudo">URL do Conteúdo *</Label>
                <Input
                  id="urlConteudo"
                  value={urlConteudo}
                  onChange={(e) => setUrlConteudo(e.target.value)}
                  placeholder="https://..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Cole a URL do vídeo (YouTube, Vimeo) ou arquivo hospedado
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={fecharModal}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit} disabled={criarAula.isPending || atualizarAula.isPending}>
                  {aulaEditando ? "Salvar Alterações" : "Criar Aula"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou disciplina..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filtroAtivo} onValueChange={setFiltroAtivo}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas</SelectItem>
            <SelectItem value="ativos">Ativas</SelectItem>
            <SelectItem value="inativos">Inativas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Aulas */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Carregando aulas...</div>
      ) : aulasFiltradas.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma aula encontrada
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {aulasFiltradas.map((aula: any) => (
            <Card key={aula.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{aula.titulo}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{aula.disciplina}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={aula.ativo ? "default" : "secondary"}
                      className={aula.ativo ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {aula.ativo ? "Ativa" : "Inativa"}
                    </Badge>
                    <Badge variant="outline">
                      {tiposConteudo.find(t => t.value === aula.tipoConteudo)?.icon} {tiposConteudo.find(t => t.value === aula.tipoConteudo)?.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {aula.descricao && (
                  <p className="text-sm text-muted-foreground mb-4">{aula.descricao}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleAtivo(aula.id, aula.ativo)}
                  >
                    {aula.ativo ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {aula.ativo ? "Desativar" : "Ativar"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => abrirModalEdicao(aula)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletar(aula.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Deletar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

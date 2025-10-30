import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Breadcrumb from "@/components/Breadcrumb";
import { ArrowLeft, MessageSquare, ThumbsUp, Eye, Plus, Search, CheckCircle, User, Trash2, Edit } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
// import { mockForumTopicos } from "@/lib/mockData";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import UserBadge from "@/components/UserBadge";

interface Resposta {
  id: number;
  topicoId: number;
  autor: string;
  autorRole: string;
  conteudo: string;
  curtidas: number;
  melhorResposta: boolean;
  createdAt: Date;
}

export default function Forum() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const isMentorOrMaster = user?.role === "mentor" || user?.role === "master";
  
  // Buscar tópicos do banco
  const { data: topicosData, refetch: refetchTopicos } = trpc.forum.listTopicos.useQuery();
  const topicos = topicosData || [];
  
  const [topicoSelecionado, setTopicoSelecionado] = useState<any | null>(null);
  const [respostas, setRespostas] = useState<Resposta[]>([
    {
      id: 1,
      topicoId: 1,
      autor: "Prof. Carlos Mentor",
      autorRole: "mentor",
      conteudo: "O princípio da legalidade estabelece que a Administração Pública só pode fazer o que a lei permite. É diferente do particular, que pode fazer tudo que a lei não proíbe. Esse é um dos pilares do Direito Administrativo!",
      curtidas: 12,
      melhorResposta: true,
      createdAt: new Date("2025-01-25T10:30:00"),
    },
    {
      id: 2,
      topicoId: 1,
      autor: "Ana Paula",
      autorRole: "aluno",
      conteudo: "Complementando a resposta do professor: na prática, isso significa que todo ato administrativo precisa ter base legal. Sem lei autorizando, o administrador não pode agir.",
      curtidas: 5,
      melhorResposta: false,
      createdAt: new Date("2025-01-25T11:00:00"),
    },
  ]);
  
  const [novoTopico, setNovoTopico] = useState({
    titulo: "",
    categoria: "duvidas",
    conteudo: "",
  });
  
  const [novaResposta, setNovaResposta] = useState("");
  const [dialogNovoTopicoAberto, setDialogNovoTopicoAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");
  const [ordenacao, setOrdenacao] = useState("recentes");
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);
  const [editandoTopico, setEditandoTopico] = useState(false);
  const [conteudoEditado, setConteudoEditado] = useState("");

  const disciplinasUnicas = Array.from(new Set(topicos.map(t => t.disciplina)));

  const criarTopicoMutation = trpc.forum.criarTopico.useMutation({
    onSuccess: () => {
      toast.success("Tópico criado com sucesso!");
      setNovoTopico({ titulo: "", categoria: "duvidas", conteudo: "" });
      setDialogNovoTopicoAberto(false);
      // Recarregar tópicos do banco
      refetchTopicos();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar tópico");
    },
  });

  const deletarTopicoMutation = trpc.forum.deletarTopico.useMutation({
    onSuccess: () => {
      toast.success("Tópico deletado com sucesso!");
      setTopicoSelecionado(null);
      refetchTopicos();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao deletar tópico");
    },
  });

  const editarTopicoMutation = trpc.forum.editarTopico.useMutation({
    onSuccess: () => {
      toast.success("Tópico editado com sucesso!");
      setEditandoTopico(false);
      refetchTopicos();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao editar tópico");
    },
  });

  const handleCriarTopico = () => {
    if (!novoTopico.titulo || !novoTopico.conteudo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    criarTopicoMutation.mutate({
      titulo: novoTopico.titulo,
      conteudo: novoTopico.conteudo,
      categoria: getCategoriaLabel(novoTopico.categoria),
    });
  };

  const handleCurtirTopico = (id: number) => {
    setTopicos(topicos.map(t => 
      t.id === id ? { ...t, curtidas: t.curtidas + 1 } : t
    ));
    toast.success("Curtida adicionada!");
  };

  const handleCurtirResposta = (id: number) => {
    setRespostas(respostas.map(r => 
      r.id === id ? { ...r, curtidas: r.curtidas + 1 } : r
    ));
    toast.success("Curtida adicionada!");
  };

  const handleMarcarMelhorResposta = (id: number) => {
    setRespostas(respostas.map(r => ({
      ...r,
      melhorResposta: r.id === id,
    })));
    toast.success("Melhor resposta marcada!");
  };

  const handleEnviarResposta = () => {
    if (!novaResposta.trim() || !topicoSelecionado) return;

    const resposta: Resposta = {
      id: respostas.length + 1,
      topicoId: topicoSelecionado.id,
      autor: user?.name || "Usuário",
      autorRole: user?.role || "aluno",
      conteudo: novaResposta,
      curtidas: 0,
      melhorResposta: false,
      createdAt: new Date(),
    };

    setRespostas([...respostas, resposta]);
    setTopicos(topicos.map(t => 
      t.id === topicoSelecionado.id ? { ...t, respostas: t.respostas + 1 } : t
    ));
    setNovaResposta("");
    toast.success("Resposta enviada!");
  };

  const getCategoriaLabel = (cat: string) => {
    const labels: Record<string, string> = {
      duvidas: "Dúvidas",
      discussao: "Discussão",
      questoes: "Questões",
      avisos: "Avisos",
    };
    return labels[cat] || cat;
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case "dúvidas":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "discussão":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "questões":
        return "bg-green-100 text-green-800 border-green-300";
      case "avisos":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "master":
        return <Badge className="bg-red-100 text-red-800">Master</Badge>;
      case "mentor":
        return <Badge className="bg-purple-100 text-purple-800">Mentor</Badge>;
      case "professor":
        return <Badge className="bg-blue-100 text-blue-800">Professor</Badge>;
      case "administrativo":
        return <Badge className="bg-yellow-100 text-yellow-800">Admin</Badge>;
      default:
        return null;
    }
  };

  const topicosFiltrados = topicos
    .filter(t => {
      const buscaMatch = t.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                        t.conteudo.toLowerCase().includes(busca.toLowerCase());
      const categoriaMatch = filtroCategoria === "todas" || t.categoria === filtroCategoria;
      const disciplinaMatch = filtroDisciplina === "todas" || t.disciplina === filtroDisciplina;
      return buscaMatch && categoriaMatch && disciplinaMatch;
    })
    .sort((a, b) => {
      switch (ordenacao) {
        case "populares":
          return b.curtidas - a.curtidas;
        case "respondidos":
          return b.respostas - a.respostas;
        case "recentes":
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  const respostasDoTopico = topicoSelecionado
    ? respostas.filter(r => r.topicoId === topicoSelecionado.id)
    : [];

  if (topicoSelecionado) {
    return (
      <div className="container py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setTopicoSelecionado(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Breadcrumb items={[
            { label: "Fórum", href: "/forum" },
            { label: topicoSelecionado.titulo }
          ]} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getCategoriaColor(topicoSelecionado.categoria)}>
                    {topicoSelecionado.categoria}
                  </Badge>
                  <Badge variant="outline">{topicoSelecionado.disciplina}</Badge>
                </div>
                <CardTitle className="text-2xl">{topicoSelecionado.titulo}</CardTitle>
                <CardDescription className="mt-2">
                  Por {topicoSelecionado.autor} • {topicoSelecionado.createdAt.toLocaleDateString("pt-BR")}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleCurtirTopico(topicoSelecionado.id)}>
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  {topicoSelecionado.curtidas}
                </Button>
                {(() => {
                  const now = new Date();
                  const created = new Date(topicoSelecionado.createdAt);
                  const minutesSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60);
                  const isAuthor = user?.id === topicoSelecionado.userId;
                  const canEdit = isAuthor && minutesSinceCreated <= 5;
                  
                  return canEdit && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setConteudoEditado(topicoSelecionado.conteudo);
                        setEditandoTopico(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  );
                })()}
                {(user?.role === "master" || user?.role === "administrativo") && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      if (confirm("Tem certeza que deseja deletar este tópico?")) {
                        deletarTopicoMutation.mutate({ id: topicoSelecionado.id });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap">{topicoSelecionado.conteudo}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {topicoSelecionado.respostas} respostas
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {topicoSelecionado.visualizacoes} visualizações
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{respostasDoTopico.length} Respostas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {respostasDoTopico.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Seja o primeiro a responder este tópico!
              </p>
            ) : (
              respostasDoTopico.map((resposta) => (
                <div
                  key={resposta.id}
                  className={`p-4 rounded-lg border-2 ${
                    resposta.melhorResposta
                      ? "bg-green-50 border-green-300"
                      : "bg-accent border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{resposta.autor}</span>
                          {getRoleBadge(resposta.autorRole)}
                          {resposta.melhorResposta && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Melhor Resposta
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {resposta.createdAt.toLocaleString("pt-BR")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleCurtirResposta(resposta.id)}>
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {resposta.curtidas}
                      </Button>
                      {isMentorOrMaster && !resposta.melhorResposta && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarcarMelhorResposta(resposta.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar como melhor
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-foreground whitespace-pre-wrap">{resposta.conteudo}</p>
                </div>
              ))
            )}

            <div className="pt-4 border-t">
              <Label className="text-base font-semibold mb-2 block">Sua Resposta</Label>
              <Textarea
                placeholder="Escreva sua resposta aqui..."
                value={novaResposta}
                onChange={(e) => setNovaResposta(e.target.value)}
                rows={4}
                className="mb-3"
              />
              <Button onClick={handleEnviarResposta} disabled={!novaResposta.trim()}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Enviar Resposta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumb items={[{ label: "Fórum da Comunidade" }]} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fórum da Comunidade</h1>
          <p className="text-muted-foreground mt-2">
            Compartilhe conhecimento, tire dúvidas e conecte-se com a comunidade
          </p>
        </div>
        <Dialog open={dialogNovoTopicoAberto} onOpenChange={setDialogNovoTopicoAberto}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Tópico
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Tópico</DialogTitle>
              <DialogDescription>
                Compartilhe sua dúvida ou inicie uma discussão
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Título *</Label>
                <Input
                  placeholder="Ex: Dúvida sobre Princípio da Legalidade"
                  value={novoTopico.titulo}
                  onChange={(e) => setNovoTopico({ ...novoTopico, titulo: e.target.value })}
                />
              </div>
              <div>
                <Label>Categoria *</Label>
                <Select
                  value={novoTopico.categoria}
                  onValueChange={(v) => setNovoTopico({ ...novoTopico, categoria: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="duvidas">Dúvidas</SelectItem>
                    <SelectItem value="discussao">Discussão</SelectItem>
                    <SelectItem value="questoes">Questões</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Conteúdo *</Label>
                <Textarea
                  placeholder="Descreva sua dúvida ou discussão em detalhes..."
                  value={novoTopico.conteudo}
                  onChange={(e) => setNovoTopico({ ...novoTopico, conteudo: e.target.value })}
                  rows={6}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogNovoTopicoAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCriarTopico}>Criar Tópico</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Dialog Editar Tópico */}
        <Dialog open={editandoTopico} onOpenChange={setEditandoTopico}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Tópico</DialogTitle>
              <DialogDescription>
                Você tem 5 minutos para editar após a publicação
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Conteúdo</Label>
                <Textarea
                  value={conteudoEditado}
                  onChange={(e) => setConteudoEditado(e.target.value)}
                  rows={8}
                  placeholder="Descreva sua dúvida ou discussão..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditandoTopico(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  if (!conteudoEditado.trim()) {
                    toast.error("O conteúdo não pode estar vazio");
                    return;
                  }
                  if (topicoSelecionado) {
                    editarTopicoMutation.mutate({
                      id: topicoSelecionado.id,
                      conteudo: conteudoEditado,
                    });
                  }
                }}>Salvar Alterações</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar e Filtrar
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFiltrosVisiveis(!filtrosVisiveis)}
            >
              {filtrosVisiveis ? "Ocultar" : "Mostrar"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Buscar por título ou conteúdo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full"
          />
          {filtrosVisiveis && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm mb-2 block">Categoria</Label>
                <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="Dúvidas">Dúvidas</SelectItem>
                    <SelectItem value="Discussão">Discussão</SelectItem>
                    <SelectItem value="Questões">Questões</SelectItem>
                    <SelectItem value="Avisos">Avisos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm mb-2 block">Disciplina</Label>
                <Select value={filtroDisciplina} onValueChange={setFiltroDisciplina}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {disciplinasUnicas.map((disc) => (
                      <SelectItem key={disc} value={disc}>
                        {disc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm mb-2 block">Ordenar por</Label>
                <Select value={ordenacao} onValueChange={setOrdenacao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recentes">Mais Recentes</SelectItem>
                    <SelectItem value="populares">Mais Populares</SelectItem>
                    <SelectItem value="respondidos">Mais Respondidos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {topicosFiltrados.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhum tópico encontrado. Seja o primeiro a criar um!
            </CardContent>
          </Card>
        ) : (
          topicosFiltrados.map((topico) => (
            <Card
              key={topico.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setTopicoSelecionado(topico)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoriaColor(topico.categoria)}>
                        {topico.categoria}
                      </Badge>
                      <Badge variant="outline">{topico.disciplina}</Badge>
                      {(() => {
                        const now = new Date();
                        const created = new Date(topico.createdAt);
                        const updated = new Date(topico.updatedAt);
                        const hoursSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
                        const hoursSinceUpdated = (now.getTime() - updated.getTime()) / (1000 * 60 * 60);
                        
                        if (hoursSinceCreated <= 48) {
                          return <Badge className="bg-green-100 text-green-800 border-green-300">Novo</Badge>;
                        } else if (hoursSinceUpdated <= 48 && updated.getTime() > created.getTime()) {
                          return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Atualizado</Badge>;
                        }
                        return null;
                      })()}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{topico.titulo}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {topico.conteudo}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span>Por {topico.autor}</span>
                        {topico.autorPontos !== undefined && topico.autorPontos !== null && (
                          <UserBadge pontos={topico.autorPontos} size="sm" />
                        )}
                      </div>
                      <span>•</span>
                      <span>
                        {new Date(topico.createdAt).toLocaleDateString("pt-BR")} às {new Date(topico.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {topico.respostas}
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {topico.curtidas}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {topico.visualizacoes}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Plus, Search, Edit, Trash2, Eye, Filter,
  FileSpreadsheet, CheckCircle, XCircle 
} from "lucide-react";

interface NovaQuestao {
  enunciado: string;
  alternativas: string[];
  gabarito: "A" | "B" | "C" | "D" | "E";
  banca?: string;
  concurso?: string;
  ano?: number;
  disciplina: string;
  assuntos?: string[];
  nivelDificuldade: "facil" | "medio" | "dificil";
  comentario?: string;
  urlVideoResolucao?: string;
  textoMotivador?: string;
}

export default function GestaoQuestoes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState<string>("");
  const [filtroBanca, setFiltroBanca] = useState<string>("");
  const [filtroDificuldade, setFiltroDificuldade] = useState<string>("");
  
  const [modalCriar, setModalCriar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [questaoSelecionada, setQuestaoSelecionada] = useState<any>(null);
  
  const [novaQuestao, setNovaQuestao] = useState<NovaQuestao>({
    enunciado: "",
    alternativas: ["", "", "", "", ""],
    gabarito: "A",
    disciplina: "",
    nivelDificuldade: "medio",
  });
  
  // Queries
  const { data: questoes, isLoading, refetch } = trpc.questoes.list.useQuery();
  
  // Mutations
  const criarQuestao = trpc.questoes.criarQuestao.useMutation({
    onSuccess: () => {
      toast.success("Questão criada com sucesso!");
      setModalCriar(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao criar questão: ${error.message}`);
    },
  });
  
  const editarQuestao = trpc.questoes.editarQuestao.useMutation({
    onSuccess: () => {
      toast.success("Questão atualizada com sucesso!");
      setModalEditar(false);
      setQuestaoSelecionada(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar questão: ${error.message}`);
    },
  });
  
  const deletarQuestao = trpc.questoes.deletarQuestao.useMutation({
    onSuccess: () => {
      toast.success("Questão deletada com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao deletar questão: ${error.message}`);
    },
  });
  
  // Handlers
  const resetForm = () => {
    setNovaQuestao({
      tipo: "multipla_escolha",
      enunciado: "",
      alternativas: ["", "", "", "", ""],
      gabarito: "A",
      disciplina: "",
      nivelDificuldade: "medio",
    });
  };
  
  const handleCriarQuestao = () => {
    // Validações
    if (!novaQuestao.enunciado.trim()) {
      toast.error("Enunciado é obrigatório");
      return;
    }
    
    if (!novaQuestao.disciplina.trim()) {
      toast.error("Disciplina é obrigatória");
      return;
    }
    
    const alternativasValidas = novaQuestao.alternativas.filter(a => a.trim() !== "");
    if (alternativasValidas.length < 2) {
      toast.error("Adicione pelo menos 2 alternativas");
      return;
    }
    
    criarQuestao.mutate({
      ...novaQuestao,
      alternativas: alternativasValidas,
      assuntos: novaQuestao.assuntos?.filter(a => a.trim() !== ""),
    });
  };
  
  const handleEditarQuestao = () => {
    if (!questaoSelecionada) return;
    
    editarQuestao.mutate({
      id: questaoSelecionada.id,
      enunciado: questaoSelecionada.enunciado,
      alternativas: questaoSelecionada.alternativas,
      gabarito: questaoSelecionada.gabarito,
      banca: questaoSelecionada.banca,
      concurso: questaoSelecionada.concurso,
      ano: questaoSelecionada.ano,
      disciplina: questaoSelecionada.disciplina,
      assuntos: questaoSelecionada.assuntos,
      nivelDificuldade: questaoSelecionada.nivelDificuldade,
      comentario: questaoSelecionada.comentario,
      urlVideoResolucao: questaoSelecionada.urlVideoResolucao,
    });
  };
  
  const handleDeletarQuestao = (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta questão? Ela será movida para a lixeira.")) {
      deletarQuestao.mutate({ id, motivo: "Deletado pelo admin" });
    }
  };
  
  const handleVisualizarQuestao = (questao: any) => {
    setQuestaoSelecionada(questao);
    setModalVisualizar(true);
  };
  
  const handleAbrirEdicao = (questao: any) => {
    setQuestaoSelecionada({
      ...questao,
      alternativas: typeof questao.alternativas === 'string' 
        ? JSON.parse(questao.alternativas) 
        : questao.alternativas,
      assuntos: typeof questao.assuntos === 'string' 
        ? JSON.parse(questao.assuntos) 
        : questao.assuntos,
    });
    setModalEditar(true);
  };
  
  // Filtros
  const questoesFiltradas = questoes?.filter(q => {
    const matchSearch = !searchTerm || 
      q.enunciado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.disciplina.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchDisciplina = !filtroDisciplina || filtroDisciplina === "all" || q.disciplina === filtroDisciplina;
    const matchBanca = !filtroBanca || filtroBanca === "all" || q.banca === filtroBanca;
    const matchDificuldade = !filtroDificuldade || filtroDificuldade === "all" || q.nivelDificuldade === filtroDificuldade;
    
    return matchSearch && matchDisciplina && matchBanca && matchDificuldade;
  });
  
  // Listas únicas para filtros
  const disciplinas = [...new Set(questoes?.map(q => q.disciplina) || [])];
  const bancas = [...new Set(questoes?.map(q => q.banca).filter(Boolean) || [])];
  
  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case "facil": return "bg-green-100 text-green-800";
      case "medio": return "bg-yellow-100 text-yellow-800";
      case "dificil": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Questões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questoes?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Disciplinas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{disciplinas.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bancas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bancas.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Filtradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questoesFiltradas?.length || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Barra de Ações */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por enunciado ou disciplina..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filtros */}
            <Select value={filtroDisciplina} onValueChange={setFiltroDisciplina}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Disciplina" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {disciplinas.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filtroBanca} onValueChange={setFiltroBanca}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Banca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {bancas.map(b => (
                  <SelectItem key={b} value={b!}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filtroDificuldade} onValueChange={setFiltroDificuldade}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="facil">Fácil</SelectItem>
                <SelectItem value="medio">Médio</SelectItem>
                <SelectItem value="dificil">Difícil</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Botões de Ação */}
            <Button onClick={() => setModalCriar(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Questão
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabela de Questões */}
      <Card>
        <CardHeader>
          <CardTitle>Questões Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : questoesFiltradas && questoesFiltradas.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Enunciado</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Banca</TableHead>
                    <TableHead>Ano</TableHead>
                    <TableHead>Dificuldade</TableHead>
                    <TableHead>Gabarito</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questoesFiltradas.map((questao) => (
                    <TableRow key={questao.id}>
                      <TableCell className="font-medium">{questao.id}</TableCell>
                      <TableCell className="max-w-md">
                        <div className="line-clamp-2">{questao.enunciado}</div>
                      </TableCell>
                      <TableCell>{questao.disciplina}</TableCell>
                      <TableCell>{questao.banca || "-"}</TableCell>
                      <TableCell>{questao.ano || "-"}</TableCell>
                      <TableCell>
                        <Badge className={getDificuldadeColor(questao.nivelDificuldade)}>
                          {questao.nivelDificuldade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{questao.gabarito}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleVisualizarQuestao(questao)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAbrirEdicao(questao)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletarQuestao(questao.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma questão encontrada
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Modal Criar Questão */}
      <Dialog open={modalCriar} onOpenChange={setModalCriar}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Questão</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para criar uma nova questão
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Seletor de Tipo de Questão */}
            <div>
              <Label>Tipo de Questão *</Label>
              <Select
                value={novaQuestao.tipo || "multipla_escolha"}
                onValueChange={(value: any) => {
                  const isCertoErrado = value === "certo_errado";
                  setNovaQuestao({ 
                    ...novaQuestao, 
                    tipo: value,
                    alternativas: isCertoErrado ? ["Certo", "Errado"] : ["", "", "", "", ""],
                    gabarito: isCertoErrado ? "Certo" : "A"
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multipla_escolha">Múltipla Escolha (A, B, C, D, E)</SelectItem>
                  <SelectItem value="certo_errado">Certo ou Errado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Enunciado *</Label>
              <Textarea
                value={novaQuestao.enunciado}
                onChange={(e) => setNovaQuestao({ ...novaQuestao, enunciado: e.target.value })}
                rows={4}
                placeholder="Digite o enunciado da questão..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Disciplina *</Label>
                <Input
                  value={novaQuestao.disciplina}
                  onChange={(e) => setNovaQuestao({ ...novaQuestao, disciplina: e.target.value })}
                  placeholder="Ex: Direito Constitucional"
                />
              </div>
              
              <div>
                <Label>Dificuldade</Label>
                <Select
                  value={novaQuestao.nivelDificuldade}
                  onValueChange={(value: any) => setNovaQuestao({ ...novaQuestao, nivelDificuldade: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facil">Fácil</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="dificil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Banca</Label>
                <Input
                  value={novaQuestao.banca || ""}
                  onChange={(e) => setNovaQuestao({ ...novaQuestao, banca: e.target.value })}
                  placeholder="Ex: CESPE"
                />
              </div>
              
              <div>
                <Label>Ano</Label>
                <Input
                  type="number"
                  value={novaQuestao.ano || ""}
                  onChange={(e) => setNovaQuestao({ ...novaQuestao, ano: parseInt(e.target.value) || undefined })}
                  placeholder="Ex: 2024"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Entidade</Label>
                <Input
                  value={novaQuestao.entidade || ""}
                  onChange={(e) => setNovaQuestao({ ...novaQuestao, entidade: e.target.value })}
                  placeholder="Ex: TRF 1ª Região"
                />
              </div>
              
              <div>
                <Label>Cargo</Label>
                <Input
                  value={novaQuestao.cargo || ""}
                  onChange={(e) => setNovaQuestao({ ...novaQuestao, cargo: e.target.value })}
                  placeholder="Ex: Analista Judiciário"
                />
              </div>
            </div>
            
            <div>
              <Label>Alternativas * (mínimo 2)</Label>
              {novaQuestao.tipo === "certo_errado" ? (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-20">Certo:</span>
                    <Input
                      value={novaQuestao.alternativas[0] || "Certo"}
                      onChange={(e) => {
                        const newAlts = [...novaQuestao.alternativas];
                        newAlts[0] = e.target.value;
                        setNovaQuestao({ ...novaQuestao, alternativas: newAlts });
                      }}
                      placeholder="Certo"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-20">Errado:</span>
                    <Input
                      value={novaQuestao.alternativas[1] || "Errado"}
                      onChange={(e) => {
                        const newAlts = [...novaQuestao.alternativas];
                        newAlts[1] = e.target.value;
                        setNovaQuestao({ ...novaQuestao, alternativas: newAlts });
                      }}
                      placeholder="Errado"
                    />
                  </div>
                </div>
              ) : (
                novaQuestao.alternativas.map((alt, index) => (
                  <div key={index} className="flex items-center gap-2 mt-2">
                    <span className="font-medium w-8">{String.fromCharCode(65 + index)})</span>
                    <Input
                      value={alt}
                      onChange={(e) => {
                        const newAlts = [...novaQuestao.alternativas];
                        newAlts[index] = e.target.value;
                        setNovaQuestao({ ...novaQuestao, alternativas: newAlts });
                      }}
                      placeholder={`Alternativa ${String.fromCharCode(65 + index)}`}
                    />
                  </div>
                ))
              )}
            </div>
            
            <div>
              <Label>Gabarito *</Label>
              <Select
                value={novaQuestao.gabarito}
                onValueChange={(value: any) => setNovaQuestao({ ...novaQuestao, gabarito: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {novaQuestao.tipo === "certo_errado" ? (
                    <>
                      <SelectItem value="Certo">Certo</SelectItem>
                      <SelectItem value="Errado">Errado</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Comentário / Explicação</Label>
              <Textarea
                value={novaQuestao.comentario || ""}
                onChange={(e) => setNovaQuestao({ ...novaQuestao, comentario: e.target.value })}
                rows={3}
                placeholder="Explicação da resposta correta..."
              />
            </div>
            
            <div>
              <Label>Texto-Base da Questão (Opcional)</Label>
              <Textarea
                value={novaQuestao.textoMotivador || ""}
                onChange={(e) => setNovaQuestao({ ...novaQuestao, textoMotivador: e.target.value })}
                rows={4}
                placeholder="Texto de apoio, artigo, gráfico ou contexto necessário para responder a questão..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Texto que o aluno precisa ler para responder (ex: artigo de lei, notícia, gráfico)
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalCriar(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCriarQuestao} disabled={criarQuestao.isPending}>
              {criarQuestao.isPending ? "Criando..." : "Criar Questão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal Visualizar Questão */}
      <Dialog open={modalVisualizar} onOpenChange={setModalVisualizar}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Visualizar Questão #{questaoSelecionada?.id}</DialogTitle>
          </DialogHeader>
          
          {questaoSelecionada && (
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Enunciado</Label>
                <p className="mt-1">{questaoSelecionada.enunciado}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground">Alternativas</Label>
                <div className="mt-2 space-y-2">
                  {(typeof questaoSelecionada.alternativas === 'string' 
                    ? JSON.parse(questaoSelecionada.alternativas) 
                    : questaoSelecionada.alternativas
                  ).map((alt: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className={`font-medium ${
                        String.fromCharCode(65 + index) === questaoSelecionada.gabarito 
                          ? 'text-green-600' 
                          : ''
                      }`}>
                        {String.fromCharCode(65 + index)})
                      </span>
                      <span className={
                        String.fromCharCode(65 + index) === questaoSelecionada.gabarito 
                          ? 'text-green-600 font-medium' 
                          : ''
                      }>
                        {alt}
                      </span>
                      {String.fromCharCode(65 + index) === questaoSelecionada.gabarito && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Disciplina</Label>
                  <p className="mt-1">{questaoSelecionada.disciplina}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Dificuldade</Label>
                  <p className="mt-1">
                    <Badge className={getDificuldadeColor(questaoSelecionada.nivelDificuldade)}>
                      {questaoSelecionada.nivelDificuldade}
                    </Badge>
                  </p>
                </div>
              </div>
              
              {questaoSelecionada.comentario && (
                <div>
                  <Label className="text-muted-foreground">Comentário</Label>
                  <p className="mt-1 text-sm">{questaoSelecionada.comentario}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalVisualizar(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

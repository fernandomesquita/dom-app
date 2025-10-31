import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import RichTextEditor from "@/components/RichTextEditor";
import SeletorAula from "./SeletorAula";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  BookOpen,
  RotateCcw,
  HelpCircle,
  Clock,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface Meta {
  id: number;
  disciplina: string;
  assunto: string;
  tipo: "estudo" | "revisao" | "questoes";
  duracao: number;
  prioridade: number;
  ordem: number;
  dicaEstudo?: string;
  orientacaoEstudos?: string;
}

interface GestaoMetasProps {
  planoId: number;
  planoNome: string;
  aberto: boolean;
  onFechar: () => void;
}

export default function GestaoMetas({ planoId, planoNome, aberto, onFechar }: GestaoMetasProps) {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [modalMeta, setModalMeta] = useState(false);
  const [metaEditando, setMetaEditando] = useState<Meta | null>(null);
  
  const [formData, setFormData] = useState({
    disciplina: "",
    assunto: "",
    tipo: "estudo" as "estudo" | "revisao" | "questoes",
    duracao: 60,
    prioridade: 3,
    dicaEstudo: "",
    orientacaoEstudos: "",
    aulaId: null as number | null,
    planosIds: [planoId] as number[], // Plano atual selecionado por padrão
  });

  // Buscar lista de todos os planos
  const { data: todosPlanos } = trpc.adminPanel.listarPlanos.useQuery();

  // Buscar metas do plano
  const { data: metasData, refetch } = trpc.metas.listByPlano.useQuery(
    { planoId },
    { enabled: aberto }
  );

  useEffect(() => {
    if (metasData) {
      setMetas(metasData as Meta[]);
    }
  }, [metasData]);

  const criarMetaMutation = trpc.metas.create.useMutation({
    onSuccess: () => {
      toast.success("Meta criada com sucesso!");
      refetch();
      setModalMeta(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar meta");
    },
  });

  const atualizarMetaMutation = trpc.metas.update.useMutation({
    onSuccess: () => {
      toast.success("Meta atualizada com sucesso!");
      refetch();
      setModalMeta(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar meta");
    },
  });

  const excluirMetaMutation = trpc.metas.delete.useMutation({
    onSuccess: () => {
      toast.success("Meta excluída com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao excluir meta");
    },
  });

  const moverParaCimaMutation = trpc.adminPanel.moverMetaParaCima.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        refetch();
      } else {
        toast.info(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao mover meta");
    },
  });

  const moverParaBaixoMutation = trpc.adminPanel.moverMetaParaBaixo.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        refetch();
      } else {
        toast.info(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao mover meta");
    },
  });

  const resetForm = () => {
    setFormData({
      disciplina: "",
      assunto: "",
      tipo: "estudo",
      duracao: 60,
      prioridade: 3,
      dicaEstudo: "",
      orientacaoEstudos: "",
      aulaId: null,
      planosIds: [planoId],
    });
    setMetaEditando(null);
  };

  const handleNovaMeta = () => {
    resetForm();
    setModalMeta(true);
  };

  const handleEditarMeta = (meta: Meta) => {
    setMetaEditando(meta);
    // Converter string de IDs separados por vírgula para array de números
    const planosIds = (meta as any).planoId 
      ? String((meta as any).planoId).split(',').map((id: string) => parseInt(id.trim()))
      : [planoId];
    
    setFormData({
      disciplina: meta.disciplina,
      assunto: meta.assunto,
      tipo: meta.tipo,
      duracao: meta.duracao,
      prioridade: meta.prioridade,
      dicaEstudo: meta.dicaEstudo || "",
      orientacaoEstudos: meta.orientacaoEstudos || "",
      aulaId: (meta as any).aulaId || null,
      planosIds,
    });
    setModalMeta(true);
  };

  const handleSalvarMeta = () => {
    if (!formData.disciplina || !formData.assunto) {
      toast.error("Preencha disciplina e assunto");
      return;
    }

    if (formData.planosIds.length === 0) {
      toast.error("Selecione pelo menos um plano");
      return;
    }

    // Converter array de IDs para string separada por vírgula
    const planoIdString = formData.planosIds.join(',');

    if (metaEditando) {
      atualizarMetaMutation.mutate({
        id: metaEditando.id,
        ...formData,
        planoId: planoIdString,
      });
    } else {
      criarMetaMutation.mutate({
        planoId: planoIdString,
        ...formData,
        ordem: metas.length + 1,
      });
    }
  };

  const handleExcluirMeta = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta meta?")) {
      excluirMetaMutation.mutate({ id });
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "estudo":
        return <BookOpen className="h-4 w-4" />;
      case "revisao":
        return <RotateCcw className="h-4 w-4" />;
      case "questoes":
        return <HelpCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "estudo":
        return "bg-blue-100 text-blue-800";
      case "revisao":
        return "bg-green-100 text-green-800";
      case "questoes":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Metas - {planoNome}</DialogTitle>
          <DialogDescription>
            Adicione, edite ou remova metas do plano de estudos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {metas.length} {metas.length === 1 ? "meta" : "metas"} cadastrada{metas.length !== 1 ? "s" : ""}
            </div>
            <Button onClick={handleNovaMeta}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Meta
            </Button>
          </div>

          <div className="space-y-2">
            {metas.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">
                    Nenhuma meta cadastrada ainda
                  </p>
                  <Button variant="outline" className="mt-4" onClick={handleNovaMeta}>
                    Criar Primeira Meta
                  </Button>
                </CardContent>
              </Card>
            ) : (
              metas.map((meta, index) => (
                <Card key={meta.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2 text-muted-foreground cursor-move">
                        <GripVertical className="h-5 w-5" />
                        <span className="text-sm font-semibold">#{index + 1}</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{meta.disciplina}</h4>
                            <p className="text-sm text-muted-foreground">{meta.assunto}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => moverParaCimaMutation.mutate({ metaId: meta.id })}
                              disabled={index === 0 || moverParaCimaMutation.isPending}
                              title="Mover para cima"
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => moverParaBaixoMutation.mutate({ metaId: meta.id })}
                              disabled={index === metas.length - 1 || moverParaBaixoMutation.isPending}
                              title="Mover para baixo"
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditarMeta(meta)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleExcluirMeta(meta.id)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <Badge className={getTipoColor(meta.tipo)}>
                            <span className="mr-1">{getTipoIcon(meta.tipo)}</span>
                            {meta.tipo.charAt(0).toUpperCase() + meta.tipo.slice(1)}
                          </Badge>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {meta.duracao} min
                          </Badge>
                          <Badge variant="outline">
                            Prioridade {meta.prioridade}
                          </Badge>
                        </div>

                        {(meta.dicaEstudo || meta.orientacaoEstudos) && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            {meta.dicaEstudo && <p>💡 {meta.dicaEstudo}</p>}
                            {meta.orientacaoEstudos && (
                              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: meta.orientacaoEstudos }} />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>

      {/* Modal de Criação/Edição de Meta */}
      <Dialog open={modalMeta} onOpenChange={setModalMeta}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {metaEditando ? "Editar Meta" : "Nova Meta"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações da meta de estudo
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-[1fr,1.5fr] gap-6 py-4">
            {/* Coluna Esquerda - Campos Básicos */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="disciplina">Disciplina *</Label>
                  <Input
                    id="disciplina"
                    placeholder="Ex: Direito Constitucional"
                    value={formData.disciplina}
                    onChange={(e) => setFormData({ ...formData, disciplina: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value: "estudo" | "revisao" | "questoes") =>
                      setFormData({ ...formData, tipo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estudo">Estudo</SelectItem>
                      <SelectItem value="revisao">Revisão</SelectItem>
                      <SelectItem value="questoes">Questões</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assunto">Assunto *</Label>
                <Textarea
                  id="assunto"
                  placeholder="Ex: Princípios Fundamentais da República"
                  value={formData.assunto}
                  onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duracao">Duração (min)</Label>
                  <Input
                    id="duracao"
                    type="number"
                    min="1"
                    value={formData.duracao}
                    onChange={(e) =>
                      setFormData({ ...formData, duracao: parseInt(e.target.value) || 60 })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Input
                    id="prioridade"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.prioridade}
                    onChange={(e) =>
                      setFormData({ ...formData, prioridade: parseInt(e.target.value) || 3 })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dicaEstudo">Dica de Estudo</Label>
                <Textarea
                  id="dicaEstudo"
                  placeholder="Ex: Fazer resumo dos artigos 1º ao 4º"
                  value={formData.dicaEstudo}
                  onChange={(e) => setFormData({ ...formData, dicaEstudo: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aulaId">Aula Vinculada</Label>
                <SeletorAula
                  value={formData.aulaId}
                  onChange={(aulaId) => setFormData({ ...formData, aulaId })}
                  disciplina={formData.disciplina}
                />
                <p className="text-xs text-muted-foreground">
                  Vincule uma aula para acesso direto
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="planos">Planos Vinculados *</Label>
                <div className="border rounded-md p-2 max-h-32 overflow-y-auto space-y-1">
                  {todosPlanos?.map((plano: any) => (
                    <label key={plano.id} className="flex items-center gap-2 p-1 hover:bg-accent rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.planosIds.includes(plano.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, planosIds: [...formData.planosIds, plano.id] });
                          } else {
                            setFormData({ ...formData, planosIds: formData.planosIds.filter(id => id !== plano.id) });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{plano.nome}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Selecione os planos onde esta meta aparecerá
                </p>
              </div>
            </div>

            {/* Coluna Direita - Editor de Orientação (Destaque) */}
            <div className="space-y-2">
              <Label htmlFor="orientacaoEstudos" className="text-base font-semibold">
                📚 Orientação de Estudos
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                Use este espaço para fornecer orientações detalhadas, links úteis e vídeos do YouTube
              </p>
              <RichTextEditor
                content={formData.orientacaoEstudos}
                onChange={(content) => setFormData({ ...formData, orientacaoEstudos: content })}
                placeholder="Ex: Focar em jurisprudência do STF sobre o tema. Use a barra de ferramentas para formatar o texto, adicionar links e vídeos do YouTube."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalMeta(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarMeta}>
              {metaEditando ? "Salvar Alterações" : "Criar Meta"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

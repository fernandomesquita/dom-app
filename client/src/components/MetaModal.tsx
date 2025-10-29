import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, BookOpen, HelpCircle, CheckCircle, Play, Pause, RotateCcw, Edit, Mic, Square, Save, StickyNote, Plus, Minus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

interface Meta {
  id: number;
  disciplina: string;
  assunto: string;
  tipo: "estudo" | "revisao" | "questoes";
  duracao: number;
  incidencia?: "baixa" | "media" | "alta";
  dicaEstudo?: string;
  aulaId?: number | null;
  orientacaoEstudos?: string;
  anotacoes?: string;
}

interface MetaModalProps {
  meta: Meta | null;
  open: boolean;
  onClose: () => void;
  onConcluir?: () => void;
  onNeedMoreTime?: () => void;
  onSaveAnotacao?: (metaId: number, anotacao: string) => void;
}

export default function MetaModal({ meta, open, onClose, onConcluir, onNeedMoreTime, onSaveAnotacao }: MetaModalProps) {
  const { user } = useAuth();
  const isMaster = user?.role === "master";
  const [, setLocation] = useLocation();
  
  // Mutations tRPC
  const marcarConcluida = trpc.metas.marcarConcluida.useMutation();
  const adicionarAnotacao = trpc.metas.adicionarAnotacao.useMutation();
  const atualizarMeta = trpc.metas.update.useMutation({
    onSuccess: () => {
      toast.success("Meta atualizada com sucesso!");
      setEditMode(false);
      // Recarregar a página para atualizar os dados
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar meta");
    },
  });
  
  const [tempoRestante, setTempoRestante] = useState(0);
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [rodando, setRodando] = useState(false);
  const [showFinalizarModal, setShowFinalizarModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Estados para edição
  const [editDisciplina, setEditDisciplina] = useState("");
  const [editAssunto, setEditAssunto] = useState("");
  const [editTipo, setEditTipo] = useState<"estudo" | "revisao" | "questoes">("estudo");
  const [editDuracao, setEditDuracao] = useState(0);
  const [editIncidencia, setEditIncidencia] = useState<"baixa" | "media" | "alta" | "">("");
  const [editDicaEstudo, setEditDicaEstudo] = useState("");
  const [editOrientacaoEstudos, setEditOrientacaoEstudos] = useState("");
  const [editAnotacoes, setEditAnotacoes] = useState("");
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (meta) {
      setTempoRestante(meta.duracao * 60);
      setTempoDecorrido(0);
      setRodando(false);
      setShowFinalizarModal(false);
      setEditMode(false);
      
      // Inicializar campos de edição
      setEditDisciplina(meta.disciplina);
      setEditAssunto(meta.assunto);
      setEditTipo(meta.tipo);
      setEditDuracao(meta.duracao);
      setEditIncidencia(meta.incidencia || "");
      setEditDicaEstudo(meta.dicaEstudo || "");
      setEditOrientacaoEstudos(meta.orientacaoEstudos || "");
      setEditAnotacoes(meta.anotacoes || "");
    }
  }, [meta]);

  useEffect(() => {
    if (rodando && tempoRestante > 0) {
      intervalRef.current = setInterval(() => {
        setTempoRestante(prev => {
          if (prev <= 1) {
            setRodando(false);
            setShowFinalizarModal(true);
            return 0;
          }
          return prev - 1;
        });
        setTempoDecorrido(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [rodando, tempoRestante]);

  if (!meta) return null;

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "estudo":
        return "Estudo";
      case "revisao":
        return "Revisão";
      case "questoes":
        return "Questões";
      default:
        return tipo;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "estudo":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "revisao":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "questoes":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getIncidenciaInfo = (incidencia?: string) => {
    switch (incidencia) {
      case "alta":
        return { icon: "🔥", label: "Alta Incidência", color: "text-red-600" };
      case "media":
        return { icon: "⚡", label: "Média Incidência", color: "text-yellow-600" };
      case "baixa":
        return { icon: "💧", label: "Baixa Incidência", color: "text-blue-600" };
      default:
        return null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setRodando(!rodando);
  };

  const resetTimer = () => {
    setTempoRestante(editDuracao * 60);
    setTempoDecorrido(0);
    setRodando(false);
  };

  const handleEstudoFinalizado = async () => {
    if (!meta || !user) return;
    
    try {
      await marcarConcluida.mutateAsync({
        metaId: meta.id,
        concluida: true,
        tempoDedicado: Math.floor(tempoDecorrido / 60),
      });
      
      setShowFinalizarModal(false);
      onConcluir?.();
      toast.success("Parabéns! Meta concluída! 🎉");
      onClose();
    } catch (error) {
      toast.error("Erro ao marcar meta como concluída");
    }
  };

  const handlePrecisoMaisTempo = () => {
    setShowFinalizarModal(false);
    onNeedMoreTime?.();
    toast.info("Meta reagendada para redistribuição");
    onClose();
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    toast.info("Gravação de áudio iniciada");
    // TODO: Implementar gravação real de áudio
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast.success("Áudio gravado com sucesso!");
    // TODO: Implementar salvamento do áudio
  };

  const handleSaveChanges = () => {
    if (!meta) return;
    
    atualizarMeta.mutate({
      id: meta.id,
      disciplina: editDisciplina,
      assunto: editAssunto,
      tipo: editTipo,
      duracao: editDuracao,
      incidencia: editIncidencia || undefined,
      dicaEstudo: editDicaEstudo,
      orientacaoEstudos: editOrientacaoEstudos,
    });
  };

  const salvarAnotacaoMutation = trpc.metas.salvarAnotacao.useMutation({
    onSuccess: () => {
      toast.success("Anotação salva com sucesso!");
      if (onSaveAnotacao && meta) {
        onSaveAnotacao(meta.id, editAnotacoes);
      }
    },
    onError: (error) => {
      toast.error(`Erro ao salvar anotação: ${error.message}`);
    },
  });

  const handleSaveAnotacao = () => {
    if (meta) {
      salvarAnotacaoMutation.mutate({
        metaId: meta.id,
        anotacao: editAnotacoes,
      });
    }
  };

  const incidenciaInfo = getIncidenciaInfo(editMode ? editIncidencia : meta.incidencia);
  const duracaoTotal = (editMode ? editDuracao : meta.duracao) * 60;
  const progressoPercentual = duracaoTotal > 0 ? (tempoDecorrido / duracaoTotal) * 100 : 0;

  // Modal de finalização
  if (showFinalizarModal) {
    return (
      <Dialog open={true} onOpenChange={() => setShowFinalizarModal(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">⏰ Tempo Finalizado!</DialogTitle>
            <DialogDescription className="text-center text-base">
              Você finalizou os estudos desta meta?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Button
              className="w-full"
              size="lg"
              variant="default"
              onClick={handleEstudoFinalizado}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Estudo Finalizado
            </Button>
            <Button
              className="w-full"
              size="lg"
              variant="outline"
              onClick={handlePrecisoMaisTempo}
            >
              <Clock className="h-5 w-5 mr-2" />
              Preciso de Mais Tempo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {editMode ? (
                <div className="space-y-3">
                  <div>
                    <Label>Disciplina</Label>
                    <Input
                      value={editDisciplina}
                      onChange={(e) => setEditDisciplina(e.target.value)}
                      placeholder="Ex: Direito Constitucional"
                    />
                  </div>
                  <div>
                    <Label>Assunto</Label>
                    <Input
                      value={editAssunto}
                      onChange={(e) => setEditAssunto(e.target.value)}
                      placeholder="Ex: Direitos Fundamentais"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <DialogTitle className="text-2xl mb-2">{meta.disciplina}</DialogTitle>
                  <DialogDescription className="text-base">{meta.assunto}</DialogDescription>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {editMode ? (
                <Select value={editTipo} onValueChange={(v) => setEditTipo(v as typeof editTipo)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estudo">Estudo</SelectItem>
                    <SelectItem value="revisao">Revisão</SelectItem>
                    <SelectItem value="questoes">Questões</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={getTipoColor(meta.tipo)}>
                  {getTipoLabel(meta.tipo)}
                </Badge>
              )}
              {isMaster && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMode(!editMode)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {editMode ? "Cancelar" : "Editar"}
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Cronômetro e Barra de Progresso */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6 space-y-4">
              {/* Cronômetro */}
              <div className="text-center">
                <div className="text-5xl font-bold font-mono text-primary mb-2">
                  {formatTime(tempoRestante)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Tempo decorrido: {formatTime(tempoDecorrido)}
                </div>
              </div>

              {/* Barra de Progresso */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-semibold">{Math.round(progressoPercentual)}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300" 
                    style={{ width: `${progressoPercentual}%` }}
                  />
                </div>
              </div>

              {/* Controles do Cronômetro */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant={rodando ? "destructive" : "default"}
                    size="lg"
                    onClick={toggleTimer}
                    disabled={editMode}
                  >
                    {rodando ? (
                      <>
                        <Pause className="h-5 w-5 mr-2" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Iniciar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={resetTimer}
                    disabled={editMode}
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reiniciar
                  </Button>
                </div>
                
                {/* Ajuste Rápido de Tempo */}
                {!editMode && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Ajustar tempo:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditDuracao(Math.max(5, editDuracao - 5));
                        setTempoRestante(Math.max(5, editDuracao - 5) * 60);
                        toast.info(`Tempo ajustado para ${Math.max(5, editDuracao - 5)} minutos`);
                      }}
                      disabled={rodando}
                    >
                      <Minus className="h-3 w-3 mr-1" />
                      5 min
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditDuracao(editDuracao + 5);
                        setTempoRestante((editDuracao + 5) * 60);
                        toast.info(`Tempo ajustado para ${editDuracao + 5} minutos`);
                      }}
                      disabled={rodando}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      5 min
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditDuracao(editDuracao + 15);
                        setTempoRestante((editDuracao + 15) * 60);
                        toast.info(`Tempo ajustado para ${editDuracao + 15} minutos`);
                      }}
                      disabled={rodando}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      15 min
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações Principais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                {editMode ? (
                  <div>
                    <Label className="text-xs">Duração (minutos)</Label>
                    <Input
                      type="number"
                      value={editDuracao}
                      onChange={(e) => setEditDuracao(Number(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-muted-foreground">Duração</div>
                    <div className="font-semibold">{meta.duracao} minutos</div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
              {editMode ? (
                <div className="flex-1">
                  <Label className="text-xs">Incidência</Label>
                  <Select value={editIncidencia} onValueChange={(v) => setEditIncidencia(v as typeof editIncidencia)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">💧 Baixa</SelectItem>
                      <SelectItem value="media">⚡ Média</SelectItem>
                      <SelectItem value="alta">🔥 Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : incidenciaInfo ? (
                <>
                  <span className="text-2xl">{incidenciaInfo.icon}</span>
                  <div>
                    <div className="text-sm text-muted-foreground">Incidência</div>
                    <div className={`font-semibold ${incidenciaInfo.color}`}>
                      {incidenciaInfo.label}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Dica de Estudo */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              💡 Dica de Estudo
            </h4>
            {editMode ? (
              <Textarea
                value={editDicaEstudo}
                onChange={(e) => setEditDicaEstudo(e.target.value)}
                placeholder="Adicione uma dica de estudo..."
                className="min-h-[80px]"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                {meta.dicaEstudo || "Nenhuma dica cadastrada"}
              </p>
            )}
          </div>

          {/* Orientação de Estudos */}
          <div className="p-4 bg-accent/50 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold flex items-center gap-2">
                📚 Orientação de Estudos
              </h4>
              {isMaster && editMode && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                  >
                    {isRecording ? (
                      <>
                        <Square className="h-4 w-4 mr-1" />
                        Parar Gravação
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-1" />
                        Gravar Áudio
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
            {editMode ? (
              <Textarea
                value={editOrientacaoEstudos}
                onChange={(e) => setEditOrientacaoEstudos(e.target.value)}
                placeholder="Adicione orientações de estudo, links de vídeos (YouTube/Vimeo), ou grave um áudio..."
                className="min-h-[150px]"
              />
            ) : (
              <div className="prose prose-sm max-w-none">
                {meta.orientacaoEstudos ? (
                  <div dangerouslySetInnerHTML={{ __html: meta.orientacaoEstudos }} />
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma orientação cadastrada</p>
                )}
              </div>
            )}
          </div>

          {/* Anotações do Aluno */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-yellow-600" />
                Minhas Anotações
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveAnotacao}
              >
                <Save className="h-4 w-4 mr-1" />
                Salvar Anotação
              </Button>
            </div>
            <Textarea
              value={editAnotacoes}
              onChange={(e) => setEditAnotacoes(e.target.value)}
              placeholder="Adicione suas anotações pessoais sobre esta meta..."
              className="min-h-[120px] bg-white"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Suas anotações aparecerão no menu "Anotações de Meta" no dashboard
            </p>
          </div>

          {/* Ações */}
          {!editMode && (
            <div className="space-y-3">
              {meta.aulaId && (
                <Button 
                  className="w-full" 
                  variant="default" 
                  size="lg"
                  onClick={() => {
                    setLocation(`/aulas?aulaId=${meta.aulaId}`);
                    onClose();
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Assistir Aula Relacionada
                </Button>
              )}

              {meta.tipo === "questoes" && (
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    setLocation(`/questoes?disciplina=${encodeURIComponent(meta.disciplina)}&assunto=${encodeURIComponent(meta.assunto)}`);
                    onClose();
                  }}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Resolver Questões
                </Button>
              )}

              {meta.tipo === "estudo" && (
                <Button 
                  className="w-full" 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    setLocation(`/materiais?disciplina=${encodeURIComponent(meta.disciplina)}`);
                    onClose();
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Ver Materiais Complementares
                </Button>
              )}
            </div>
          )}

          {/* Botão de Conclusão */}
          {!editMode && (
            <div className="pt-4 border-t">
              <Button
                className="w-full"
                variant="default"
                size="lg"
                onClick={() => {
                  onConcluir?.();
                  onClose();
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Concluída
              </Button>
            </div>
          )}

          {/* Botões de Edição (Master) */}
          {editMode && (
            <div className="pt-4 border-t flex gap-3">
              <Button
                className="flex-1"
                variant="default"
                size="lg"
                onClick={handleSaveChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                size="lg"
                onClick={() => setEditMode(false)}
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

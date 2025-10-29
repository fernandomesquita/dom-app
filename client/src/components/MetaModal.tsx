import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, BookOpen, HelpCircle, CheckCircle, Play, Pause, RotateCcw, Edit, Mic, Square } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

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
}

interface MetaModalProps {
  meta: Meta | null;
  open: boolean;
  onClose: () => void;
  onConcluir?: () => void;
  onNeedMoreTime?: () => void;
}

export default function MetaModal({ meta, open, onClose, onConcluir, onNeedMoreTime }: MetaModalProps) {
  const { user } = useAuth();
  const isMaster = user?.role === "master";
  
  const [tempoRestante, setTempoRestante] = useState(0);
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [rodando, setRodando] = useState(false);
  const [showFinalizarModal, setShowFinalizarModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (meta) {
      setTempoRestante(meta.duracao * 60); // Converte minutos para segundos
      setTempoDecorrido(0);
      setRodando(false);
      setShowFinalizarModal(false);
      setEditMode(false);
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
    setTempoRestante(meta.duracao * 60);
    setTempoDecorrido(0);
    setRodando(false);
  };

  const handleEstudoFinalizado = () => {
    setShowFinalizarModal(false);
    onConcluir?.();
    toast.success("Parabéns! Meta concluída! 🎉");
    onClose();
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

  const incidenciaInfo = getIncidenciaInfo(meta.incidencia);
  const duracaoTotal = meta.duracao * 60;
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{meta.disciplina}</DialogTitle>
              <DialogDescription className="text-base">{meta.assunto}</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getTipoColor(meta.tipo)}>
                {getTipoLabel(meta.tipo)}
              </Badge>
              {isMaster && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMode(!editMode)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
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
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant={rodando ? "destructive" : "default"}
                  size="lg"
                  onClick={toggleTimer}
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
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reiniciar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Informações Principais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Duração</div>
                <div className="font-semibold">{meta.duracao} minutos</div>
              </div>
            </div>

            {incidenciaInfo && (
              <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                <span className="text-2xl">{incidenciaInfo.icon}</span>
                <div>
                  <div className="text-sm text-muted-foreground">Incidência</div>
                  <div className={`font-semibold ${incidenciaInfo.color}`}>
                    {incidenciaInfo.label}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dica de Estudo */}
          {meta.dicaEstudo && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                💡 Dica de Estudo
              </h4>
              <p className="text-sm text-muted-foreground">{meta.dicaEstudo}</p>
            </div>
          )}

          {/* Orientação de Estudos (Rich Text) */}
          {(meta.orientacaoEstudos || editMode) && (
            <div className="p-4 bg-accent/50 border border-border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center gap-2">
                  📚 Orientação de Estudos
                </h4>
                {isMaster && (
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
                <textarea
                  className="w-full min-h-[150px] p-3 border border-border rounded-lg resize-y"
                  placeholder="Adicione orientações de estudo, links de vídeos (YouTube/Vimeo), ou grave um áudio..."
                  defaultValue={meta.orientacaoEstudos || ""}
                />
              ) : (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: meta.orientacaoEstudos || "" }}
                />
              )}
            </div>
          )}

          {/* Ações */}
          <div className="space-y-3">
            {meta.aulaId && (
              <Button className="w-full" variant="default" size="lg">
                <Play className="h-4 w-4 mr-2" />
                Assistir Aula Relacionada
              </Button>
            )}

            {meta.tipo === "questoes" && (
              <Button className="w-full" variant="outline" size="lg">
                <HelpCircle className="h-4 w-4 mr-2" />
                Resolver Questões
              </Button>
            )}

            {meta.tipo === "estudo" && meta.aulaId && (
              <Button className="w-full" variant="outline" size="lg">
                <BookOpen className="h-4 w-4 mr-2" />
                Ver Materiais Complementares
              </Button>
            )}
          </div>

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
                onClick={() => {
                  toast.success("Meta atualizada com sucesso!");
                  setEditMode(false);
                }}
              >
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

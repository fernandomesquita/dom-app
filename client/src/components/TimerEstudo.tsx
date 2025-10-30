import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  SkipForward,
  Clock,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface TimerEstudoProps {
  metaId: number;
  disciplina: string;
  assunto: string;
  duracaoMinutos: number;
  tipo: "estudo" | "revisao" | "questoes";
  onConcluir: (tempoGasto: number) => void;
  onPular: () => void;
  onAdiar: () => void;
}

export default function TimerEstudo({
  metaId,
  disciplina,
  assunto,
  duracaoMinutos,
  tipo,
  onConcluir,
  onPular,
  onAdiar,
}: TimerEstudoProps) {
  const [segundosRestantes, setSegundosRestantes] = useState(duracaoMinutos * 60);
  const [rodando, setRodando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [tempoGasto, setTempoGasto] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const duracaoTotal = duracaoMinutos * 60;
  const progresso = ((duracaoTotal - segundosRestantes) / duracaoTotal) * 100;

  useEffect(() => {
    // Criar áudio de notificação
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8bllHAU2jdXxy3YpBSh+zPLaizsKFGCy6OyrWBQLSKDf87tnHgU0iNPx0H4tBSh+zPLaizsKFGCy6OyrWBQLSKDf87tnHgU0iNPx0H4tBSh+zPLaizsKFGCy6OyrWBQLSKDf87tnHgU0iNPx0H4tBSh+zPLaizsKFGCy6OyrWBQLSKDf87tnHgU0iNPx0H4tBQ==");
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (rodando && !pausado) {
      intervalRef.current = setInterval(() => {
        setSegundosRestantes((prev) => {
          if (prev <= 1) {
            handleConcluirAutomatico();
            return 0;
          }
          return prev - 1;
        });
        setTempoGasto((prev) => prev + 1);
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
  }, [rodando, pausado]);

  const handleConcluirAutomatico = () => {
    setRodando(false);
    setPausado(false);
    
    // Tocar som de conclusão
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignorar erro se o navegador bloquear
      });
    }
    
    toast.success("Meta concluída! Parabéns! 🎉");
    onConcluir(Math.ceil(tempoGasto / 60)); // converter para minutos
  };

  const handleIniciar = () => {
    setRodando(true);
    setPausado(false);
  };

  const handlePausar = () => {
    setPausado(true);
  };

  const handleContinuar = () => {
    setPausado(false);
  };

  const handleReiniciar = () => {
    setSegundosRestantes(duracaoTotal);
    setTempoGasto(0);
    setRodando(false);
    setPausado(false);
  };

  const handleConcluirManual = () => {
    if (tempoGasto < 60) {
      toast.error("Estude pelo menos 1 minuto antes de concluir");
      return;
    }

    setRodando(false);
    setPausado(false);
    onConcluir(Math.ceil(tempoGasto / 60));
  };

  const handlePular = () => {
    if (rodando) {
      toast.error("Pause o timer antes de pular");
      return;
    }
    onPular();
  };

  const handleAdiar = () => {
    if (rodando) {
      toast.error("Pause o timer antes de adiar");
      return;
    }
    onAdiar();
  };

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    if (horas > 0) {
      return `${horas}:${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
    }
    return `${minutos}:${segs.toString().padStart(2, "0")}`;
  };

  const getTipoBadge = () => {
    const badges = {
      estudo: { label: "Estudo", className: "bg-blue-100 text-blue-800" },
      revisao: { label: "Revisão", className: "bg-green-100 text-green-800" },
      questoes: { label: "Questões", className: "bg-orange-100 text-orange-800" },
    };
    return badges[tipo];
  };

  const tipoBadge = getTipoBadge();

  return (
    <Card className="border-2">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge className={tipoBadge.className}>{tipoBadge.label}</Badge>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{duracaoMinutos} min</span>
            </div>
          </div>
          <h3 className="font-bold text-lg text-gray-900">{disciplina}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{assunto}</p>
        </div>

        {/* Timer Display */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl font-bold text-gray-900 font-mono">
              {formatarTempo(segundosRestantes)}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Tempo gasto: {formatarTempo(tempoGasto)}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progresso} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{Math.round(progresso)}% concluído</span>
              <span>{formatarTempo(segundosRestantes)} restantes</span>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="space-y-3">
          {/* Botões principais */}
          <div className="flex gap-2">
            {!rodando && !pausado && (
              <Button onClick={handleIniciar} className="flex-1" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Iniciar
              </Button>
            )}

            {rodando && !pausado && (
              <Button onClick={handlePausar} variant="outline" className="flex-1" size="lg">
                <Pause className="w-5 h-5 mr-2" />
                Pausar
              </Button>
            )}

            {pausado && (
              <Button onClick={handleContinuar} className="flex-1" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Continuar
              </Button>
            )}

            <Button
              onClick={handleReiniciar}
              variant="outline"
              size="lg"
              disabled={!rodando && !pausado && tempoGasto === 0}
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>

          {/* Botões secundários */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={handleConcluirManual}
              variant="outline"
              size="sm"
              disabled={tempoGasto < 60}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Concluir
            </Button>

            <Button
              onClick={handlePular}
              variant="outline"
              size="sm"
              disabled={rodando}
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              <SkipForward className="w-4 h-4 mr-1" />
              Pular
            </Button>

            <Button
              onClick={handleAdiar}
              variant="outline"
              size="sm"
              disabled={rodando}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              Adiar
            </Button>
          </div>
        </div>

        {/* Avisos */}
        {segundosRestantes < 300 && rodando && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <strong>Atenção!</strong> Menos de 5 minutos restantes. Finalize seu estudo.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

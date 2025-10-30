import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronLeft, 
  Flag,
  Clock,
  Trophy,
  Star
} from "lucide-react";

export default function ResolverQuestoes() {
  const [, navigate] = useLocation();
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<string>("");
  const [mostrarFeedback, setMostrarFeedback] = useState(false);
  const [acertou, setAcertou] = useState(false);
  const [tempoInicio, setTempoInicio] = useState<Date>(new Date());

  // Buscar questões sugeridas
  const { data: questoes, isLoading } = trpc.questoes.sugerirProximasQuestoes.useQuery({
    quantidade: 10,
  });

  // Mutation para responder
  const responderMutation = trpc.questoes.responder.useMutation({
    onSuccess: (data) => {
      setAcertou(data.acertou);
      setMostrarFeedback(true);
      
      if (data.acertou) {
        toast.success("Parabéns! Resposta correta! 🎉");
      } else {
        toast.error("Ops! Resposta incorreta. Continue tentando!");
      }
    },
  });

  // Mutation para verificar conquistas
  const verificarConquistasMutation = trpc.questoes.verificarConquistas.useMutation({
    onSuccess: (data) => {
      if (data.novasConquistas.length > 0) {
        toast.success(`🏆 Nova conquista desbloqueada: ${data.novasConquistas.join(", ")}!`);
      }
      
      if (data.streak > 0) {
        toast.info(`🔥 Streak de ${data.streak} dias consecutivos!`);
      }
    },
  });

  const questaoAtualData = questoes?.[questaoAtual];

  const handleResponder = () => {
    if (!respostaSelecionada || !questaoAtualData) return;

    const tempoGasto = Math.floor((new Date().getTime() - tempoInicio.getTime()) / 1000);

    responderMutation.mutate({
      questaoId: questaoAtualData.id,
      alternativaSelecionada: respostaSelecionada,
      tempoGasto,
    });

    // Verificar conquistas após responder
    setTimeout(() => {
      verificarConquistasMutation.mutate();
    }, 500);
  };

  const handleProxima = () => {
    if (questaoAtual < (questoes?.length || 0) - 1) {
      setQuestaoAtual(questaoAtual + 1);
      setRespostaSelecionada("");
      setMostrarFeedback(false);
      setTempoInicio(new Date());
    } else {
      toast.success("Parabéns! Você completou todas as questões!");
      navigate("/questoes");
    }
  };

  const handleAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(questaoAtual - 1);
      setRespostaSelecionada("");
      setMostrarFeedback(false);
      setTempoInicio(new Date());
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando questões...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!questoes || questoes.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma questão disponível</CardTitle>
            <CardDescription>
              Não há questões para resolver no momento. Tente ajustar os filtros ou volte mais tarde.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/questoes")}>
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progresso = ((questaoAtual + 1) / questoes.length) * 100;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header com progresso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">Resolver Questões</h1>
          <Badge variant="outline" className="text-lg">
            {questaoAtual + 1} / {questoes.length}
          </Badge>
        </div>
        <Progress value={progresso} className="h-2" />
      </div>

      {/* Card da questão */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-2">
              <Badge>{questaoAtualData?.disciplina}</Badge>
              <Badge variant="outline">{questaoAtualData?.banca}</Badge>
              {questaoAtualData?.ano && (
                <Badge variant="secondary">{questaoAtualData.ano}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {Math.floor((new Date().getTime() - tempoInicio.getTime()) / 1000)}s
              </span>
            </div>
          </div>
          <CardTitle className="text-lg leading-relaxed">
            {questaoAtualData?.enunciado}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Alternativas */}
          <RadioGroup
            value={respostaSelecionada}
            onValueChange={setRespostaSelecionada}
            disabled={mostrarFeedback}
            className="space-y-3"
          >
            {["A", "B", "C", "D", "E"].map((letra) => {
              const alternativa = questaoAtualData?.[`alternativa${letra}` as keyof typeof questaoAtualData] as string;
              if (!alternativa) return null;

              const isCorreta = letra === questaoAtualData.gabarito;
              const isSelecionada = letra === respostaSelecionada;
              const mostrarStatus = mostrarFeedback && (isCorreta || isSelecionada);

              return (
                <div
                  key={letra}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                    mostrarStatus
                      ? isCorreta
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : isSelecionada
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={letra} id={letra} />
                  <Label
                    htmlFor={letra}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    <span className="font-semibold mr-2">{letra})</span>
                    {alternativa}
                  </Label>
                  {mostrarStatus && (
                    isCorreta ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )
                  )}
                </div>
              );
            })}
          </RadioGroup>

          {/* Feedback */}
          {mostrarFeedback && (
            <div className={`mt-6 p-4 rounded-lg ${acertou ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}`}>
              <div className="flex items-center gap-2 mb-2">
                {acertou ? (
                  <>
                    <Trophy className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-900">Resposta Correta!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-900">Resposta Incorreta</span>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Gabarito: <span className="font-semibold">{questaoAtualData?.gabarito}</span>
              </p>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleAnterior}
              disabled={questaoAtual === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            {!mostrarFeedback ? (
              <Button
                onClick={handleResponder}
                disabled={!respostaSelecionada || responderMutation.isPending}
                size="lg"
              >
                {responderMutation.isPending ? "Enviando..." : "Responder"}
              </Button>
            ) : (
              <Button onClick={handleProxima} size="lg">
                {questaoAtual < questoes.length - 1 ? (
                  <>
                    Próxima
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  "Finalizar"
                )}
              </Button>
            )}

            <Button variant="ghost" size="icon">
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

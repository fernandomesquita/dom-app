import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface QuestaoCardProps {
  questao: {
    id: number;
    tipo: "multipla_escolha" | "certo_errado";
    enunciado: string;
    alternativas: string;
    gabarito: string;
    disciplina: string;
    banca?: string;
    entidade?: string;
    cargo?: string;
    ano?: number;
    nivelDificuldade: "facil" | "medio" | "dificil";
    comentario?: string;
    textoMotivador?: string;
  };
  metaId?: number;
  onResolvida?: () => void;
}

export default function QuestaoCard({ questao, metaId, onResolvida }: QuestaoCardProps) {
  const [respostaSelecionada, setRespostaSelecionada] = useState<string>("");
  const [respondida, setRespondida] = useState(false);
  const [acertou, setAcertou] = useState<boolean | null>(null);
  const [mostrarComentario, setMostrarComentario] = useState(false);
  
  const utils = trpc.useUtils();
  
  // Mutation para salvar resposta
  const salvarResposta = trpc.questoes.responder.useMutation({
    onSuccess: (data) => {
      setRespondida(true);
      setAcertou(data.acertou);
      setMostrarComentario(true);
      
      if (data.acertou) {
        toast.success("Resposta correta! 🎉");
      } else {
        toast.error(`Resposta incorreta. A resposta correta é: ${questao.gabarito}`);
      }
      
      // Invalidar queries para atualizar estatísticas
      utils.questoes.minhasEstatisticas.invalidate();
      utils.dashboard.estatisticas.invalidate();
      
      if (onResolvida) {
        onResolvida();
      }
    },
    onError: (error) => {
      toast.error(`Erro ao salvar resposta: ${error.message}`);
    },
  });
  
  const handleResponder = () => {
    if (!respostaSelecionada) {
      toast.error("Selecione uma alternativa");
      return;
    }
    
    salvarResposta.mutate({
      questaoId: questao.id,
      respostaAluno: respostaSelecionada,
      metaId,
    });
  };
  
  const alternativasArray = JSON.parse(questao.alternativas);
  
  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case "facil": return "bg-green-500";
      case "medio": return "bg-yellow-500";
      case "dificil": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };
  
  const getDificuldadeLabel = (dificuldade: string) => {
    switch (dificuldade) {
      case "facil": return "Fácil";
      case "medio": return "Médio";
      case "dificil": return "Difícil";
      default: return dificuldade;
    }
  };
  
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">#{questao.id}</Badge>
            <Badge>{questao.disciplina}</Badge>
            {questao.banca && <Badge variant="secondary">{questao.banca}</Badge>}
            <Badge className={getDificuldadeColor(questao.nivelDificuldade)}>
              {getDificuldadeLabel(questao.nivelDificuldade)}
            </Badge>
            {questao.tipo === "certo_errado" && (
              <Badge variant="outline">Certo/Errado</Badge>
            )}
          </div>
          
          {respondida && (
            <div className="flex items-center gap-2">
              {acertou ? (
                <Badge className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Acertou
                </Badge>
              ) : (
                <Badge className="bg-red-500">
                  <XCircle className="h-3 w-3 mr-1" />
                  Errou
                </Badge>
              )}
            </div>
          )}
        </div>
        
        {(questao.entidade || questao.cargo || questao.ano) && (
          <div className="text-sm text-muted-foreground mt-2">
            {questao.entidade} {questao.cargo && `- ${questao.cargo}`} {questao.ano && `(${questao.ano})`}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Texto-Base da Questão */}
          {questao.textoMotivador && (
            <div className="p-4 bg-muted/50 border border-border rounded-md">
              <p className="text-sm font-medium text-muted-foreground mb-2">Texto-Base:</p>
              <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {questao.textoMotivador}
              </div>
            </div>
          )}
          
          {/* Enunciado */}
          <div className="text-base leading-relaxed whitespace-pre-wrap">
            {questao.enunciado}
          </div>
          
          {/* Alternativas */}
          <RadioGroup
            value={respostaSelecionada}
            onValueChange={setRespostaSelecionada}
            disabled={respondida}
          >
            {alternativasArray.map((alternativa: string, index: number) => {
              const letra = questao.tipo === "certo_errado" 
                ? (index === 0 ? "Certo" : "Errado")
                : String.fromCharCode(65 + index); // A, B, C, D, E
              
              const isGabarito = respondida && letra === questao.gabarito;
              const isRespostaErrada = respondida && letra === respostaSelecionada && !acertou;
              
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-3 rounded-md border ${
                    isGabarito ? "border-green-500 bg-green-50" :
                    isRespostaErrada ? "border-red-500 bg-red-50" :
                    "border-border"
                  }`}
                >
                  <RadioGroupItem value={letra} id={`alt-${questao.id}-${index}`} />
                  <Label
                    htmlFor={`alt-${questao.id}-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    <span className="font-semibold mr-2">{letra})</span>
                    {alternativa}
                  </Label>
                  {isGabarito && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {isRespostaErrada && <XCircle className="h-5 w-5 text-red-500" />}
                </div>
              );
            })}
          </RadioGroup>
          
          {/* Botão de responder */}
          {!respondida && (
            <Button
              onClick={handleResponder}
              disabled={salvarResposta.isPending}
              className="w-full"
            >
              {salvarResposta.isPending ? "Salvando..." : "Responder"}
            </Button>
          )}
          
          {/* Comentário */}
          {respondida && questao.comentario && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4" />
                <span className="font-semibold">Comentário:</span>
              </div>
              <div className="text-sm whitespace-pre-wrap">{questao.comentario}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

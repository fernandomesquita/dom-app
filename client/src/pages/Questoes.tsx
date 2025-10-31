import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Breadcrumb from "@/components/Breadcrumb";
import { ArrowLeft, Search, CheckCircle, XCircle, TrendingUp, Clock, Target, Award, ChevronLeft, ChevronRight, Star, BookmarkPlus, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { mockQuestoes, type Questao } from "@/lib/mockQuestoes";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Plus } from "lucide-react";

export default function Questoes() {
  const { user } = useAuth();
  const isAdmin = user && ["master", "administrativo"].includes(user.role || "");
  const [, setLocation] = useLocation();
  const [questaoAtual, setQuestaoAtual] = useState<Questao | null>(null);
  const [respostaSelecionada, setRespostaSelecionada] = useState<string>("");
  const [respondida, setRespondida] = useState(false);
  const [acertou, setAcertou] = useState<boolean | null>(null);
  
  const [busca, setBusca] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");
  const [filtroBanca, setFiltroBanca] = useState("todas");
  const [filtroDificuldade, setFiltroDificuldade] = useState("todas");
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);

  // Buscar estatísticas reais do backend
  const { data: estatisticasData } = trpc.questoes.estatisticas.useQuery();
  const estatisticas = estatisticasData || {
    total: 0,
    corretas: 0,
    taxaAcerto: 0,
  };
  
  // Mutation para salvar resposta
  const responderMutation = trpc.questoes.responder.useMutation();

  const disciplinasUnicas = Array.from(new Set(mockQuestoes.map(q => q.disciplina)));
  const bancasUnicas = Array.from(new Set(mockQuestoes.map(q => q.banca)));

  const questoesFiltradas = mockQuestoes.filter(q => {
    const buscaMatch = q.enunciado.toLowerCase().includes(busca.toLowerCase()) ||
                      q.assunto.toLowerCase().includes(busca.toLowerCase());
    const disciplinaMatch = filtroDisciplina === "todas" || q.disciplina === filtroDisciplina;
    const bancaMatch = filtroBanca === "todas" || q.banca === filtroBanca;
    const dificuldadeMatch = filtroDificuldade === "todas" || q.dificuldade === filtroDificuldade;
    return buscaMatch && disciplinaMatch && bancaMatch && dificuldadeMatch;
  });

  const handleResponder = async () => {
    if (!respostaSelecionada || !questaoAtual) {
      toast.error("Selecione uma alternativa");
      return;
    }

    const acertouQuestao = respostaSelecionada === questaoAtual.gabarito;
    setAcertou(acertouQuestao);
    setRespondida(true);
    
    try {
      await responderMutation.mutateAsync({
        questaoId: questaoAtual.id,
        alternativaSelecionada: respostaSelecionada,
        correta: acertouQuestao,
      });
      
      if (acertouQuestao) {
        toast.success("Parabéns! Resposta correta! 🎉");
      } else {
        toast.error("Resposta incorreta. Veja a explicação abaixo.");
      }
    } catch (error) {
      toast.error("Erro ao salvar resposta");
    }
  };

  const handleProximaQuestao = () => {
    const indexAtual = mockQuestoes.findIndex(q => q.id === questaoAtual?.id);
    if (indexAtual < mockQuestoes.length - 1) {
      setQuestaoAtual(mockQuestoes[indexAtual + 1]);
      setRespostaSelecionada("");
      setRespondida(false);
      setAcertou(null);
    } else {
      toast.info("Você chegou ao final do banco de questões!");
    }
  };

  const handleQuestaoAnterior = () => {
    const indexAtual = mockQuestoes.findIndex(q => q.id === questaoAtual?.id);
    if (indexAtual > 0) {
      setQuestaoAtual(mockQuestoes[indexAtual - 1]);
      setRespostaSelecionada("");
      setRespondida(false);
      setAcertou(null);
    }
  };

  const handleSelecionarQuestao = (questao: Questao) => {
    setQuestaoAtual(questao);
    setRespostaSelecionada("");
    setRespondida(false);
    setAcertou(null);
  };

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case "Fácil":
        return "bg-green-100 text-green-800";
      case "Média":
        return "bg-yellow-100 text-yellow-800";
      case "Difícil":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (questaoAtual) {
    const indexAtual = mockQuestoes.findIndex(q => q.id === questaoAtual.id);
    const totalQuestoes = mockQuestoes.length;

    return (
      <div className="container py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setQuestaoAtual(null)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Breadcrumb items={[
            { label: "Questões", href: "/questoes" },
            { label: `Questão ${indexAtual + 1} de ${totalQuestoes}` }
          ]} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={getDificuldadeColor(questaoAtual.dificuldade)}>
              {questaoAtual.dificuldade}
            </Badge>
            <Badge variant="outline">{questaoAtual.banca}</Badge>
            <Badge variant="outline">{questaoAtual.ano}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-2" />
              Favoritar
            </Button>
            <Button variant="outline" size="sm">
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Revisar depois
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{questaoAtual.disciplina}</CardTitle>
                <CardDescription>{questaoAtual.assunto}</CardDescription>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>Taxa de acerto: {questaoAtual.taxaAcerto}%</div>
                <div>{questaoAtual.totalRespostas.toLocaleString()} respostas</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-foreground whitespace-pre-wrap">{questaoAtual.enunciado}</p>
            </div>

            <RadioGroup
              value={respostaSelecionada}
              onValueChange={setRespostaSelecionada}
              disabled={respondida}
            >
              {questaoAtual.alternativas.map((alt) => {
                const isGabarito = alt.letra === questaoAtual.gabarito;
                const isSelecionada = alt.letra === respostaSelecionada;
                
                let bgColor = "";
                if (respondida) {
                  if (isGabarito) {
                    bgColor = "bg-green-50 border-green-300";
                  } else if (isSelecionada && !acertou) {
                    bgColor = "bg-red-50 border-red-300";
                  }
                }

                return (
                  <div
                    key={alt.letra}
                    onClick={() => !respondida && setRespostaSelecionada(alt.letra)}
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                      bgColor || (isSelecionada ? "bg-green-50 border-green-400" : "border-border hover:border-gray-400")
                    } ${respondida ? "cursor-default" : ""}`}
                  >
                    <RadioGroupItem value={alt.letra} id={alt.letra} className="pointer-events-none" />
                    <Label
                      htmlFor={alt.letra}
                      className="flex-1 cursor-pointer font-normal pointer-events-none"
                    >
                      <span className="font-semibold mr-2">{alt.letra})</span>
                      {alt.texto}
                      {respondida && isGabarito && (
                        <CheckCircle className="inline-block ml-2 h-4 w-4 text-green-600" />
                      )}
                      {respondida && isSelecionada && !acertou && (
                        <XCircle className="inline-block ml-2 h-4 w-4 text-red-600" />
                      )}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>

            {!respondida ? (
              <Button onClick={handleResponder} className="w-full" size="lg">
                Responder
              </Button>
            ) : (
              <div className="space-y-4">
                <Card className={acertou ? "border-green-300 bg-green-50" : "border-red-300 bg-red-50"}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {acertou ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Resposta Correta!
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-600" />
                          Resposta Incorreta
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm"><strong>Gabarito:</strong> {questaoAtual.gabarito}</p>
                    <p className="mt-3 text-foreground">{questaoAtual.comentario}</p>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleQuestaoAnterior}
                    disabled={indexAtual === 0}
                    className="flex-1"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>
                  <Button
                    onClick={handleProximaQuestao}
                    disabled={indexAtual === totalQuestoes - 1}
                    className="flex-1"
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
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
        <Breadcrumb items={[{ label: "Questões" }]} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Banco de Questões</h1>
          <p className="text-muted-foreground mt-2">
            Pratique com questões de concursos anteriores
          </p>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button onClick={() => setLocation("/admin")} variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Incluir Questão
            </Button>
          )}
          <Button onClick={() => setLocation("/questoes/estatisticas")} variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Estatísticas Avançadas
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Respondidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total}</div>
            <Progress value={(estatisticas.total / 500) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Taxa de Acerto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.taxaAcerto}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {estatisticas.corretas} acertos / {estatisticas.total - estatisticas.corretas} erros
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="h-4 w-4" />
              Sequência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">-</div>
            <p className="text-xs text-muted-foreground mt-1">acertos seguidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tempo Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 15s</div>
            <p className="text-xs text-muted-foreground mt-1">por questão</p>
          </CardContent>
        </Card>
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
            placeholder="Buscar por enunciado ou assunto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {filtrosVisiveis && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label className="text-sm mb-2 block">Banca</Label>
                <Select value={filtroBanca} onValueChange={setFiltroBanca}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {bancasUnicas.map((banca) => (
                      <SelectItem key={banca} value={banca}>
                        {banca}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm mb-2 block">Dificuldade</Label>
                <Select value={filtroDificuldade} onValueChange={setFiltroDificuldade}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="Fácil">Fácil</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Difícil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        {questoesFiltradas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhuma questão encontrada com os filtros selecionados.
            </CardContent>
          </Card>
        ) : (
          questoesFiltradas.map((questao, index) => (
            <Card
              key={questao.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleSelecionarQuestao(questao)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-muted-foreground">#{index + 1}</span>
                      <Badge className={getDificuldadeColor(questao.dificuldade)}>
                        {questao.dificuldade}
                      </Badge>
                      <Badge variant="outline">{questao.disciplina}</Badge>
                      <Badge variant="outline">{questao.banca} - {questao.ano}</Badge>
                    </div>
                    <h3 className="font-medium mb-1">{questao.assunto}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {questao.enunciado}
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="font-semibold text-green-600">{questao.taxaAcerto}%</div>
                    <div className="text-xs">{questao.totalRespostas} respostas</div>
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

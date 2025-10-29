import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Breadcrumb from "@/components/Breadcrumb";
import { ArrowLeft, Play, Pause, CheckCircle, BookOpen, FileText, Clock, Star } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AulaView() {
  const [, setLocation] = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [anotacoes, setAnotacoes] = useState("");
  const [novaAnotacao, setNovaAnotacao] = useState("");

  // Mock data - substituir por dados reais da API
  const aula = {
    id: 1,
    titulo: "Introdução ao Direito Constitucional",
    disciplina: "Direito Constitucional",
    professor: "Prof. Dr. Carlos Silva",
    duracao: "1h 45min",
    descricao: "Nesta aula, vamos abordar os princípios fundamentais do Direito Constitucional brasileiro, incluindo a estrutura da Constituição Federal de 1988 e seus principais artigos.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    materiais: [
      { nome: "Slides da Aula", tipo: "PDF", url: "#" },
      { nome: "Resumo", tipo: "PDF", url: "#" },
      { nome: "Exercícios", tipo: "PDF", url: "#" },
    ],
    topicos: [
      "Conceitos básicos de Direito Constitucional",
      "Estrutura da Constituição Federal",
      "Princípios fundamentais",
      "Direitos e garantias fundamentais",
    ],
  };

  const marcarConcluida = trpc.aulas.marcarConcluida.useMutation({
    onSuccess: () => {
      toast.success("Aula marcada como concluída!");
    },
  });

  const salvarProgresso = trpc.aulas.salvarProgresso.useMutation();

  const handleMarcarConcluida = () => {
    marcarConcluida.mutate({ aulaId: aula.id });
  };

  const handleSalvarAnotacao = () => {
    if (novaAnotacao.trim()) {
      const timestamp = new Date().toLocaleTimeString('pt-BR');
      setAnotacoes(prev => prev + `\n[${timestamp}] ${novaAnotacao}`);
      setNovaAnotacao("");
      toast.success("Anotação salva!");
    }
  };

  // Salvar progresso a cada 30 segundos
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          salvarProgresso.mutate({ aulaId: aula.id, posicao: newTime, percentual: duration > 0 ? Math.round((newTime / duration) * 100) : 0 });
          return newTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/aulas")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Breadcrumb items={[
            { label: "Aulas", href: "/aulas" },
            { label: aula.titulo }
          ]} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna Principal - Vídeo */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
                  <iframe
                    src={aula.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold">{aula.titulo}</h1>
                      <p className="text-muted-foreground mt-1">{aula.professor}</p>
                    </div>
                    <Button onClick={handleMarcarConcluida} size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como Concluída
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{aula.disciplina}</Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {aula.duracao}
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed">{aula.descricao}</p>
                </div>
              </CardContent>
            </Card>

            {/* Tópicos Abordados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Tópicos Abordados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {aula.topicos.map((topico, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Star className="h-4 w-4 mt-1 text-yellow-500" />
                      <span>{topico}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Anotações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Minhas Anotações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {anotacoes && (
                  <div className="p-4 bg-secondary rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap font-sans">{anotacoes}</pre>
                  </div>
                )}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Adicione suas anotações aqui..."
                    value={novaAnotacao}
                    onChange={(e) => setNovaAnotacao(e.target.value)}
                    rows={4}
                  />
                  <Button onClick={handleSalvarAnotacao} className="w-full">
                    Salvar Anotação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral - Materiais */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Materiais de Apoio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aula.materiais.map((material, index) => (
                  <a
                    key={index}
                    href={material.url}
                    className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{material.nome}</p>
                        <p className="text-xs text-muted-foreground">{material.tipo}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Baixar
                    </Button>
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Progresso */}
            <Card>
              <CardHeader>
                <CardTitle>Seu Progresso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tempo assistido</span>
                    <span className="font-medium">{formatTime(currentTime)}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Seu progresso é salvo automaticamente
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

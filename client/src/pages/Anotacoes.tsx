import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Breadcrumb from "@/components/Breadcrumb";
import { ArrowLeft, BookOpen, Calendar, Clock, Search, FileText } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Anotacoes() {
  const [, setLocation] = useLocation();
  const [busca, setBusca] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState<string>("todas");

  // Buscar anotações do aluno
  const { data: anotacoes, isLoading } = trpc.metas.minhasAnotacoes.useQuery();

  // Filtrar anotações
  const anotacoesFiltradas = anotacoes?.filter((anotacao) => {
    const buscaMatch = busca === "" || 
      anotacao.assunto.toLowerCase().includes(busca.toLowerCase()) ||
      anotacao.disciplina.toLowerCase().includes(busca.toLowerCase()) ||
      anotacao.anotacao?.toLowerCase().includes(busca.toLowerCase());
    
    const disciplinaMatch = filtroDisciplina === "todas" || anotacao.disciplina === filtroDisciplina;
    
    return buscaMatch && disciplinaMatch;
  }) || [];

  // Disciplinas únicas
  const disciplinasUnicas = Array.from(new Set(anotacoes?.map(a => a.disciplina) || []));

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

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins.toString().padStart(2, "0")}`;
  };

  const getIncidenciaIcon = (incidencia: string) => {
    switch (incidencia) {
      case "alta":
        return (
          <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-red-500" title="Incidência Alta">
            <span className="sr-only">Alta</span>
          </span>
        );
      case "media":
        return (
          <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-yellow-500" title="Incidência Média">
            <span className="sr-only">Média</span>
          </span>
        );
      case "baixa":
        return (
          <span className="inline-flex items-center justify-center w-3 h-3 rounded-full bg-green-500" title="Incidência Baixa">
            <span className="sr-only">Baixa</span>
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">Carregando anotações...</div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumb items={[{ label: "Anotações de Metas" }]} />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <FileText className="h-8 w-8" />
          Minhas Anotações
        </h1>
        <p className="text-muted-foreground mt-2">
          Todas as suas anotações de estudo em um só lugar
        </p>
      </div>

      {/* Barra de Busca e Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por assunto, disciplina ou conteúdo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filtroDisciplina === "todas" ? "default" : "outline"}
                size="sm"
                onClick={() => setFiltroDisciplina("todas")}
              >
                Todas
              </Button>
              {disciplinasUnicas.map((disc) => (
                <Button
                  key={disc}
                  variant={filtroDisciplina === disc ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroDisciplina(disc)}
                >
                  {disc}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contador de Resultados */}
      <div className="text-sm text-muted-foreground">
        {anotacoesFiltradas.length} {anotacoesFiltradas.length === 1 ? "anotação encontrada" : "anotações encontradas"}
      </div>

      {/* Lista de Anotações */}
      {anotacoesFiltradas.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {busca || filtroDisciplina !== "todas" 
                    ? "Nenhuma anotação encontrada" 
                    : "Você ainda não tem anotações"}
                </h3>
                <p className="text-muted-foreground">
                  {busca || filtroDisciplina !== "todas"
                    ? "Tente ajustar os filtros de busca"
                    : "Adicione anotações nas suas metas para acompanhar seu progresso"}
                </p>
              </div>
              {!busca && filtroDisciplina === "todas" && (
                <Button onClick={() => setLocation("/plano")}>
                  Ir para Meu Plano
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {anotacoesFiltradas.map((anotacao) => (
            <Card key={anotacao.progressoId} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{anotacao.assunto}</CardTitle>
                      {getIncidenciaIcon(anotacao.incidencia)}
                    </div>
                    <CardDescription className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {anotacao.disciplina}
                      </span>
                      <Badge className={getTipoColor(anotacao.tipo)}>
                        {getTipoLabel(anotacao.tipo)}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(anotacao.duracao)}
                      </span>
                      {anotacao.dataAgendada && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(anotacao.dataAgendada).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  {anotacao.concluida === 1 && (
                    <Badge className="bg-green-100 text-green-800">
                      ✓ Concluída
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Dica de Estudo */}
                {anotacao.dicaEstudo && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-semibold text-blue-900 mb-1">💡 Dica de Estudo:</div>
                    <div className="text-sm text-blue-800">{anotacao.dicaEstudo}</div>
                  </div>
                )}

                {/* Anotação */}
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-sm font-semibold text-yellow-900 mb-2">📝 Minha Anotação:</div>
                  <div className="text-sm text-yellow-900 whitespace-pre-wrap">{anotacao.anotacao}</div>
                </div>

                {/* Botão para ir para a meta */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation("/plano")}
                  >
                    Ver Meta no Plano
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

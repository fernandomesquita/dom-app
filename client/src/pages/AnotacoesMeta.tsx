import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";
import { StickyNote, ArrowLeft, ExternalLink, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { mockMetas } from "@/lib/mockData";

export default function AnotacoesMeta() {
  const [, setLocation] = useLocation();
  
  // Simular metas com anotações
  const metasComAnotacoes = mockMetas
    .filter(meta => meta.id % 3 === 0) // Simular apenas algumas com anotações
    .map(meta => ({
      ...meta,
      anotacoes: `Anotação de exemplo para ${meta.disciplina} - ${meta.assunto}. 
      
Esta é uma anotação pessoal que o aluno fez durante o estudo desta meta. Pode conter observações importantes, dúvidas, insights ou qualquer informação relevante que o estudante queira registrar.

Exemplo de conteúdo:
- Ponto importante sobre ${meta.assunto}
- Dúvida a esclarecer com o mentor
- Conexão com outro assunto estudado`,
      dataAnotacao: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    }));

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

  const handleNavigateToMeta = (metaId: number) => {
    // TODO: Implementar navegação para a meta específica
    setLocation(`/plano?meta=${metaId}`);
  };

  return (
    <div className="container py-8 space-y-6">
      {/* Breadcrumb e Botão Voltar */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumb items={[{ label: "Anotações de Meta" }]} />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <StickyNote className="h-8 w-8 text-yellow-600" />
          Minhas Anotações
        </h1>
        <p className="text-muted-foreground mt-2">
          Visualize todas as anotações que você fez nas suas metas de estudo
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Anotações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metasComAnotacoes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Última Anotação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {metasComAnotacoes.length > 0
                ? new Date(Math.max(...metasComAnotacoes.map(m => m.dataAnotacao.getTime()))).toLocaleDateString("pt-BR")
                : "Nenhuma"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Disciplinas Anotadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Set(metasComAnotacoes.map(m => m.disciplina)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Anotações */}
      {metasComAnotacoes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <StickyNote className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma anotação ainda</h3>
            <p className="text-muted-foreground mb-4">
              Comece a adicionar anotações nas suas metas de estudo
            </p>
            <Button onClick={() => setLocation("/plano")}>
              Ir para Plano de Estudos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {metasComAnotacoes
            .sort((a, b) => b.dataAnotacao.getTime() - a.dataAnotacao.getTime())
            .map((meta) => (
              <Card key={meta.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{meta.disciplina}</CardTitle>
                        <Badge className={getTipoColor(meta.tipo)}>
                          {getTipoLabel(meta.tipo)}
                        </Badge>
                      </div>
                      <CardDescription className="text-base">
                        {meta.assunto}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {meta.dataAnotacao.toLocaleDateString("pt-BR")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {meta.duracao} min
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleNavigateToMeta(meta.id)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Ir para Meta
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-yellow-800">
                      <StickyNote className="h-4 w-4" />
                      Anotação
                    </h4>
                    <div className="text-sm whitespace-pre-wrap text-foreground">
                      {meta.anotacoes}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}

import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Play, Search, Star } from "lucide-react";
import { useState } from "react";

export default function Aulas() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: aulas, isLoading } = trpc.aulas.list.useQuery();

  const filteredAulas = aulas?.filter((aula) =>
    aula.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aula.disciplina.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "videoaula":
        return "bg-blue-100 text-blue-800";
      case "pdf":
        return "bg-red-100 text-red-800";
      case "audio":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Repositório de Aulas</h1>
        <p className="text-muted-foreground mt-2">
          Acesse todo o conteúdo educacional disponível
        </p>
      </div>

      {/* Barra de Pesquisa */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar aulas por título ou disciplina..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando aulas...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!filteredAulas || filteredAulas.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma aula encontrada</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "Tente ajustar sua busca ou limpar os filtros."
                : "Ainda não há aulas disponíveis no sistema."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Lista de Aulas */}
      {!isLoading && filteredAulas && filteredAulas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAulas.map((aula) => (
            <Card key={aula.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-base line-clamp-2">{aula.titulo}</CardTitle>
                    <CardDescription className="mt-1">{aula.disciplina}</CardDescription>
                  </div>
                  <Button size="icon" variant="ghost" className="shrink-0">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {aula.descricao && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {aula.descricao}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{aula.duracao} min</span>
                </div>

                {aula.assuntoNivel1 && (
                  <div className="text-xs text-muted-foreground">
                    {aula.assuntoNivel1}
                    {aula.assuntoNivel2 && ` > ${aula.assuntoNivel2}`}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getTipoColor(aula.tipoConteudo)}`}
                  >
                    {aula.tipoConteudo}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      aula.nivelDificuldade === "basico"
                        ? "bg-green-100 text-green-800"
                        : aula.nivelDificuldade === "intermediario"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {aula.nivelDificuldade}
                  </span>
                </div>

                <Button className="w-full" variant="default">
                  <Play className="h-4 w-4 mr-2" />
                  Assistir Aula
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Estatísticas */}
      {!isLoading && filteredAulas && filteredAulas.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Exibindo {filteredAulas.length} {filteredAulas.length === 1 ? "aula" : "aulas"}
              </span>
              {searchTerm && (
                <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>
                  Limpar busca
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

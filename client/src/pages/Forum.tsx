import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Search, Plus, ThumbsUp, MessageCircle, Eye } from "lucide-react";
import { useState } from "react";

export default function Forum() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: topicos, isLoading } = trpc.forum.listTopicos.useQuery();

  const filteredTopicos = topicos?.filter((topico) =>
    topico.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (topico: any) => {
    if (topico.resolvido) {
      return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">Resolvido</span>;
    }
    if (topico.fixado) {
      return <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Fixado</span>;
    }
    if (topico.fechado) {
      return <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">Fechado</span>;
    }
    return null;
  };

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fórum de Dúvidas</h1>
          <p className="text-muted-foreground mt-2">
            Tire suas dúvidas e interaja com mentores e outros alunos
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Pergunta
        </Button>
      </div>

      {/* Barra de Pesquisa */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar tópicos..."
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
            <p className="mt-4 text-muted-foreground">Carregando tópicos...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!filteredTopicos || filteredTopicos.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum tópico encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "Tente ajustar sua busca."
                : "Seja o primeiro a fazer uma pergunta!"}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Tópico
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Lista de Tópicos */}
      {!isLoading && filteredTopicos && filteredTopicos.length > 0 && (
        <div className="space-y-4">
          {filteredTopicos.map((topico) => (
            <Card key={topico.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{topico.titulo}</CardTitle>
                      {getStatusBadge(topico)}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {topico.conteudo}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{topico.visualizacoes} visualizações</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>0 respostas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{topico.curtidas} curtidas</span>
                  </div>
                  {topico.categoria && (
                    <span className="ml-auto text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {topico.categoria}
                    </span>
                  )}
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Criado em {new Date(topico.createdAt).toLocaleDateString("pt-BR")} às{" "}
                  {new Date(topico.createdAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Estatísticas */}
      {!isLoading && filteredTopicos && filteredTopicos.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Exibindo {filteredTopicos.length}{" "}
                {filteredTopicos.length === 1 ? "tópico" : "tópicos"}
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

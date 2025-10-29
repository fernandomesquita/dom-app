import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import { HelpCircle, Play, BookOpen, Target, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Questoes() {
  const [, setLocation] = useLocation();

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
        <Breadcrumb items={[{ label: "Questões" }]} />
      </div>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Banco de Questões</h1>
        <p className="text-muted-foreground mt-2">
          Pratique com questões de concursos anteriores
        </p>
      </div>

      {/* Modos de Estudo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Play className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">Modo Livre</CardTitle>
                <CardDescription className="text-xs">Resolva sem filtros</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-base">Modo Simulado</CardTitle>
                <CardDescription className="text-xs">Simule uma prova</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-base">Por Assunto</CardTitle>
                <CardDescription className="text-xs">Foque em um tema</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <HelpCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-base">Modo Inteligente</CardTitle>
                <CardDescription className="text-xs">IA recomenda</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total de Questões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Disponíveis no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Questões Resolvidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Por você</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground mt-1">Média geral</p>
          </CardContent>
        </Card>
      </div>

      {/* Em Desenvolvimento */}
      <Card>
        <CardContent className="py-12 text-center">
          <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Módulo em Desenvolvimento</h3>
          <p className="text-muted-foreground mb-6">
            O banco de questões está sendo preparado. Em breve você poderá praticar com milhares de questões de concursos.
          </p>
          <Button variant="outline">Voltar ao Dashboard</Button>
        </CardContent>
      </Card>
    </div>
  );
}

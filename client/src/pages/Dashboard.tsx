import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Calendar, BookOpen, MessageSquare, HelpCircle, TrendingUp, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const { data: matriculaAtiva } = trpc.matriculas.ativa.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Bem-vindo ao DOM</CardTitle>
            <CardDescription>
              Plataforma de Mentoria com Metodologia Ciclo EARA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Faça login para acessar seus estudos, aulas e acompanhar seu progresso.
            </p>
            <Button
              className="w-full"
              size="lg"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Olá, {user?.name?.split(" ")[0] || "Aluno"}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Bem-vindo de volta. Continue seus estudos de onde parou.
        </p>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Horas Estudadas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0h 00m</div>
            <p className="text-xs text-muted-foreground mt-1">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Metas Concluídas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 / 0</div>
            <p className="text-xs text-muted-foreground mt-1">Esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aulas Assistidas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Questões Resolvidas</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/plano">
            <a>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Meu Plano de Estudos</CardTitle>
                      <CardDescription>Visualize suas metas da semana</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </a>
          </Link>

          <Link href="/aulas">
            <a>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Repositório de Aulas</CardTitle>
                      <CardDescription>Acesse todo o conteúdo disponível</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </a>
          </Link>

          <Link href="/questoes">
            <a>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <HelpCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Banco de Questões</CardTitle>
                      <CardDescription>Pratique com questões de concursos</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </a>
          </Link>

          <Link href="/forum">
            <a>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Fórum de Dúvidas</CardTitle>
                      <CardDescription>Tire suas dúvidas com mentores</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </a>
          </Link>

          <Link href="/revisao">
            <a>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Revisão Estratégica</CardTitle>
                      <CardDescription>Revise assuntos importantes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </a>
          </Link>
        </div>
      </div>

      {/* Informações do Plano Ativo */}
      {matriculaAtiva && (
        <Card>
          <CardHeader>
            <CardTitle>Seu Plano Atual</CardTitle>
            <CardDescription>Informações sobre sua matrícula ativa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plano ID:</span>
                <span className="font-medium">{matriculaAtiva.planoId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Início:</span>
                <span className="font-medium">
                  {new Date(matriculaAtiva.dataInicio).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Término:</span>
                <span className="font-medium">
                  {new Date(matriculaAtiva.dataTermino).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Horas diárias:</span>
                <span className="font-medium">{matriculaAtiva.horasDiarias}h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

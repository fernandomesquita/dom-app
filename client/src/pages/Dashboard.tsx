import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLoginUrl } from "@/const";
import { PontosCard, RankingCard, ConquistasCard } from "@/components/GamificacaoCard";

import { Calendar, BookOpen, MessageSquare, HelpCircle, TrendingUp, Clock, Award, Target, Eye, StickyNote, Bell } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [visualizarComo, setVisualizarComo] = useState<string>("proprio");
  
  const isAdmin = user && ["master", "mentor", "administrativo", "professor"].includes(user.role || "");
  
  // Buscar estatísticas reais do backend
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.estatisticas.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  
  // Buscar notificações não lidas do fórum
  const { data: notificacoes } = trpc.forum.notificacoesRespostas.useQuery(
    undefined,
    { enabled: isAuthenticated && !isAdmin }
  );
  
  const notificacoesNaoLidas = notificacoes?.length || 0;

  if (loading || statsLoading) {
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
            <CardTitle className="text-2xl">Bem-vindo ao DOM / EARA</CardTitle>
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Olá, {user?.name?.split(" ")[0] || "Aluno"}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Bem-vindo de volta. Continue seus estudos de onde parou.
          </p>
        </div>
        
        {/* Sino de Notificações do Fórum */}
        {!isAdmin && (
          <Link href="/notificacoes">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificacoesNaoLidas > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {notificacoesNaoLidas > 9 ? '9+' : notificacoesNaoLidas}
                </span>
              )}
              <span className="sr-only">Notificações ({notificacoesNaoLidas})</span>
            </Button>
          </Link>
        )}
        
        {/* Visualizar Como (apenas para admins) */}
        {isAdmin && (
          <Card className="w-64">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visualizar como
                </label>
                <Select value={visualizarComo} onValueChange={setVisualizarComo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proprio">Próprio ({user?.role})</SelectItem>
                    <SelectItem value="aluno">Aluno</SelectItem>
                    <SelectItem value="professor">Professor</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                    <SelectItem value="administrativo">Administrativo</SelectItem>
                    {user?.role === "master" && (
                      <SelectItem value="master">Master</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {visualizarComo !== "proprio" && (
                  <p className="text-xs text-muted-foreground">
                    Visualizando como: <span className="font-semibold">{visualizarComo}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Estatísticas Rápidas */}
      {!stats ? (
        <div className="col-span-full text-center py-8">
          <p className="text-muted-foreground">Carregando estatísticas...</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <PontosCard />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Horas Estudadas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.horasEstudadas || 0}h</div>
            <p className="text-xs text-muted-foreground mt-1">Esta semana</p>
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all" 
                style={{ width: `${((stats?.horasEstudadas || 0) / 40) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Metas Concluídas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.metasConcluidas || 0} / {stats?.totalMetas || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.totalMetas ? Math.round(((stats?.metasConcluidas || 0) / stats.totalMetas) * 100) : 0}% concluído
            </p>
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all" 
                style={{ width: `${stats?.totalMetas ? ((stats?.metasConcluidas || 0) / stats.totalMetas) * 100 : 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aulas Assistidas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.aulasAssistidas || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Questões Resolvidas</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.questoesResolvidas || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Taxa de acerto: {stats?.taxaAcerto || 0}%
            </p>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Conquistas Recentes */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Parabéns! 🎉</h3>
              <p className="text-muted-foreground">
                Você está em uma sequência de <span className="font-bold text-primary">{stats?.sequenciaDias || 0} dias</span> consecutivos de estudo!
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{stats?.sequenciaDias || 0}</div>
              <div className="text-xs text-muted-foreground">dias</div>
            </div>
          </div>
        </CardContent>
      </Card>

        {/* Acesso Rápido */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <Link href="/anotacoes">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <StickyNote className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Anotações de Meta</h3>
                    <p className="text-sm text-muted-foreground">
                      Visualize suas anotações pessoais
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/plano">
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Meu Plano de Estudos</CardTitle>
                      <CardDescription>Visualize suas metas da semana</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
          </Link>

          <Link href="/aulas">
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Repositório de Aulas</CardTitle>
                      <CardDescription>Acesse todo o conteúdo disponível</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
          </Link>

          <Link href="/questoes">
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <HelpCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Banco de Questões</CardTitle>
                      <CardDescription>Pratique com questões de concursos</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
          </Link>

          <Link href="/forum">
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Fórum de Dúvidas</CardTitle>
                      <CardDescription>Tire suas dúvidas com mentores</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
          </Link>

          <Link href="/revisao">
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Revisão Estratégica</CardTitle>
                      <CardDescription>Revise assuntos importantes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
          </Link>
        </div>
      </div>

      {/* Gamificação: Ranking e Conquistas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RankingCard />
        <ConquistasCard />
      </div>

      {/* Progresso Semanal */}
      <Card>
        <CardHeader>
          <CardTitle>Seu Progresso Esta Semana</CardTitle>
          <CardDescription>Acompanhe seu desempenho nos últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Média diária de estudo</span>
                <span className="font-medium">{((stats?.horasEstudadas || 0) / 7).toFixed(1)}h / dia</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all" 
                  style={{ width: `${(((stats?.horasEstudadas || 0) / 7) / 6) * 100}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats?.horasEstudadas || 0}h</div>
                <div className="text-xs text-muted-foreground">Horas totais</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats?.metasConcluidas || 0}</div>
                <div className="text-xs text-muted-foreground">Metas concluídas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats?.aulasAssistidas || 0}</div>
                <div className="text-xs text-muted-foreground">Aulas assistidas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats?.questoesResolvidas || 0}</div>
                <div className="text-xs text-muted-foreground">Questões resolvidas</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Breadcrumb from "@/components/Breadcrumb";
import { useAuth } from "@/_core/hooks/useAuth";
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  Target, 
  Bell, 
  BarChart3,
  UserPlus,
  Settings,
  Shield
} from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import GestaoAvisos from "@/components/admin/GestaoAvisos";
import RelatoriosAnalytics from "@/components/admin/RelatoriosAnalytics";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  // Verificar se o usuário tem permissão
  const isAdmin = user && ["master", "mentor", "administrativo", "professor"].includes(user.role || "");

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Acesso Negado</h3>
            <p className="text-muted-foreground mb-4">
              Você não tem permissão para acessar esta área
            </p>
            <Button onClick={() => setLocation("/")}>
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <Breadcrumb items={[{ label: "Administração" }]} />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          Painel Administrativo
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie usuários, planos, conteúdos e configurações do sistema
        </p>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">247</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12 este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Planos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              3 em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Metas Criadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground mt-1">
              89% concluídas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Avisos Enviados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45</div>
            <p className="text-xs text-muted-foreground mt-1">
              Este mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Gestão */}
      <Tabs defaultValue="usuarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="planos">Planos</TabsTrigger>
          <TabsTrigger value="metas">Metas</TabsTrigger>
          <TabsTrigger value="aulas">Aulas</TabsTrigger>
          <TabsTrigger value="avisos">Avisos</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        {/* Tab: Gestão de Usuários */}
        <TabsContent value="usuarios" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestão de Usuários</CardTitle>
                  <CardDescription>
                    Gerencie alunos, professores, mentores e administradores
                  </CardDescription>
                </div>
                <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Lista de usuários */}
                <div className="border rounded-lg divide-y">
                  {[
                    { nome: "João Silva", email: "joao@email.com", role: "aluno", status: "ativo" },
                    { nome: "Maria Santos", email: "maria@email.com", role: "professor", status: "ativo" },
                    { nome: "Pedro Costa", email: "pedro@email.com", role: "mentor", status: "ativo" },
                    { nome: "Ana Lima", email: "ana@email.com", role: "aluno", status: "inativo" },
                  ].map((usuario, index) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-accent transition-colors">
                      <div className="flex-1">
                        <div className="font-semibold">{usuario.nome}</div>
                        <div className="text-sm text-muted-foreground">{usuario.email}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                            {usuario.role}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            usuario.status === "ativo" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {usuario.status}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Gestão de Planos */}
        <TabsContent value="planos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gestão de Planos de Estudo</CardTitle>
                  <CardDescription>
                    Crie e gerencie planos de estudo para diferentes concursos
                  </CardDescription>
                </div>
                <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
                  <Target className="h-4 w-4 mr-2" />
                  Novo Plano
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { nome: "TJ-SP 2025", concurso: "Tribunal de Justiça de SP", alunos: 45, metas: 320 },
                    { nome: "OAB XXXIX", concurso: "Exame da Ordem", alunos: 78, metas: 180 },
                    { nome: "Magistratura Federal", concurso: "Juiz Federal", alunos: 23, metas: 450 },
                    { nome: "MPF 2025", concurso: "Ministério Público Federal", alunos: 34, metas: 380 },
                  ].map((plano, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{plano.nome}</CardTitle>
                        <CardDescription>{plano.concurso}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-2xl font-bold text-primary">{plano.alunos}</div>
                            <div className="text-xs text-muted-foreground">Alunos matriculados</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">{plano.metas}</div>
                            <div className="text-xs text-muted-foreground">Metas criadas</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Ver Metas
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Gestão de Metas */}
        <TabsContent value="metas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Metas</CardTitle>
              <CardDescription>
                Visualize e edite metas de todos os planos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Selecione um plano para visualizar e gerenciar suas metas
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Gestão de Aulas */}
        <TabsContent value="aulas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Repositório de Aulas</CardTitle>
                  <CardDescription>
                    Gerencie o conteúdo educacional disponível
                  </CardDescription>
                </div>
                <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Nova Aula
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Sistema de gestão de aulas em desenvolvimento
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Avisos */}
        <TabsContent value="avisos" className="space-y-4">
          <GestaoAvisos />
        </TabsContent>

        {/* Tab: Relatórios */}
        <TabsContent value="relatorios" className="space-y-4">
          <RelatoriosAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}

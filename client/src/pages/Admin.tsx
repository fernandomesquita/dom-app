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
  Shield,
  Upload,
  Key,
  Palette,
  Menu,
  GraduationCap,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import GestaoAvisos from "@/components/admin/GestaoAvisos";
import RelatoriosAnalytics from "@/components/admin/RelatoriosAnalytics";
import GestaoUsuarios from "@/components/admin/GestaoUsuarios";
import GestaoPlanos from "@/components/admin/GestaoPlanos";
import AtribuirPlano from "@/components/admin/AtribuirPlano";
import GestaoMatriculas from "@/components/admin/GestaoMatriculas";
import DashboardAlunoAdmin from "@/components/admin/DashboardAlunoAdmin";
import RelatorioComparativo from "@/components/admin/RelatorioComparativo";
import CentroComando from "@/components/admin/CentroComando";
import ControleFuncionalidades from "@/components/admin/ControleFuncionalidades";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("");

  // Verificar permissões por perfil
  const isMaster = user?.role === "master";
  const isMentor = user?.role === "mentor";
  const isAdministrativo = user?.role === "administrativo";
  const isProfessor = user?.role === "professor";
  
  const hasAccess = isMaster || isMentor || isAdministrativo || isProfessor;

  if (!hasAccess) {
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

  // Definir tabs disponíveis por perfil
  const availableTabs = {
    usuarios: isMaster || isAdministrativo,
    planos: isMaster || isMentor || isAdministrativo,
    atribuirPlanos: isMaster || isMentor || isAdministrativo,
    matriculas: isMaster || isMentor || isAdministrativo,
    metas: isMaster || isMentor,
    aulas: isMaster || isAdministrativo || isProfessor,
    materiais: isMaster || isMentor || isProfessor,
    avisos: isMaster || isMentor || isAdministrativo,
    relatorios: isMaster || isMentor,
    personalizacao: isMaster,
    configuracoes: isMaster,
    tokens: isMaster || isAdministrativo,
  };

  const tabs = [
    { value: "usuarios", label: "Usuários", show: availableTabs.usuarios },
    { value: "planos", label: "Planos", show: availableTabs.planos },
    { value: "atribuirPlanos", label: "Atribuir Planos", show: availableTabs.atribuirPlanos },
    { value: "matriculas", label: "Matrículas", show: availableTabs.matriculas },
    { value: "metas", label: "Metas", show: availableTabs.metas },
    { value: "aulas", label: "Aulas", show: availableTabs.aulas },
    { value: "materiais", label: "Materiais", show: availableTabs.materiais },
    { value: "avisos", label: "Avisos", show: availableTabs.avisos },
    { value: "relatorios", label: "Relatórios", show: availableTabs.relatorios },
    { value: "personalizacao", label: "Personalização", show: availableTabs.personalizacao },
    { value: "configuracoes", label: "Configurações", show: availableTabs.configuracoes },
    { value: "tokens", label: "Tokens", show: availableTabs.tokens },
  ].filter(tab => tab.show);

  const getPerfilDescricao = () => {
    if (isMaster) return "Controle total da plataforma - Master";
    if (isMentor) return "Gestão pedagógica - Mentor";
    if (isAdministrativo) return "Suporte operacional - Administrativo";
    if (isProfessor) return "Gestão de conteúdo - Professor";
    return "";
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
        <Breadcrumb items={[{ label: "Administração" }]} />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          Painel Administrativo
        </h1>
        <p className="text-muted-foreground mt-2">
          {getPerfilDescricao()}
        </p>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(isMaster || isAdministrativo) && (
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
        )}

        {(isMaster || isMentor || isAdministrativo) && (
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
                {isMentor ? "Sob sua mentoria" : "3 em andamento"}
              </p>
            </CardContent>
          </Card>
        )}

        {(isMaster || isMentor) && (
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
        )}

        {(isMaster || isMentor || isAdministrativo) && (
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
        )}
      </div>

      {/* Tabs de Gestão */}
      <Tabs defaultValue={tabs[0]?.value} value={activeTab || tabs[0]?.value} onValueChange={setActiveTab} className="space-y-6">
        {/* Desktop: TabsList horizontal */}
        <div className="hidden lg:block">
          <TabsList className="flex w-full overflow-x-auto">
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Mobile/Tablet: Dropdown Menu */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Menu className="h-4 w-4" />
                  {tabs.find(t => t.value === (activeTab || tabs[0]?.value))?.label || "Menu"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[calc(100vw-2rem)] max-h-[60vh] overflow-y-auto">
              {tabs.map(tab => (
                <DropdownMenuItem
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={activeTab === tab.value ? "bg-accent" : ""}
                >
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tab: Gestão de Usuários (Master, Administrativo) */}
        {availableTabs.usuarios && (
          <TabsContent value="usuarios" className="space-y-4">
            <GestaoUsuarios />
          </TabsContent>
        )}

        {/* Tab: Gestão de Planos (Master, Mentor, Administrativo) */}
        {availableTabs.planos && (
          <TabsContent value="planos" className="space-y-4">
            <GestaoPlanos />
          </TabsContent>
        )}

        {/* Tab: Atribuir Planos (Master, Mentor, Administrativo) */}
        {availableTabs.atribuirPlanos && (
          <TabsContent value="atribuirPlanos" className="space-y-4">
            <AtribuirPlano />
          </TabsContent>
        )}

        {/* Tab: Gestão de Matrículas (Master, Mentor, Administrativo) */}
        {availableTabs.matriculas && (
          <TabsContent value="matriculas" className="space-y-4">
            <GestaoMatriculas />
          </TabsContent>
        )}

        {/* Tab: Gestão de Metas (Master, Mentor) */}
        {availableTabs.metas && (
          <TabsContent value="metas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Metas</CardTitle>
                <CardDescription>
                  {isMaster && "Criar, editar, excluir, publicar e configurar cores de metas"}
                  {isMentor && "Inserir, editar, remover, habilitar/desabilitar e reordenar metas"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Selecione um plano para visualizar e gerenciar suas metas
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Tab: Gestão de Aulas (Master, Administrativo, Professor) */}
        {availableTabs.aulas && (
          <TabsContent value="aulas" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Repositório de Aulas</CardTitle>
                    <CardDescription>
                      {isMaster && "Gerencie todo o conteúdo educacional"}
                      {isAdministrativo && "Fazer upload de vídeos, PDFs e materiais. Associar conteúdos ao repositório"}
                      {isProfessor && "Gerencie aulas e materiais didáticos"}
                    </CardDescription>
                  </div>
                  <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload de Conteúdo
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
        )}

        {/* Tab: Gestão de Materiais (Master, Mentor, Professor) */}
        {availableTabs.materiais && (
          <TabsContent value="materiais" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestão de Materiais</CardTitle>
                    <CardDescription>
                      {isMaster && "Gerencie todo o repositório de materiais de apoio"}
                      {isMentor && "Faça upload de PDFs, documentos e apresentações"}
                      {isProfessor && "Compartilhe materiais didáticos com os alunos"}
                    </CardDescription>
                  </div>
                  <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
                    <Upload className="h-4 w-4 mr-2" />
                    Adicionar Material
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Sistema de gestão de materiais em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Tab: Avisos (Master, Mentor, Administrativo) */}
        {availableTabs.avisos && (
          <TabsContent value="avisos" className="space-y-4">
            <GestaoAvisos />
          </TabsContent>
        )}

        {/* Tab: Relatórios (Master, Mentor) */}
        {availableTabs.relatorios && (
          <TabsContent value="relatorios" className="space-y-4">
            <RelatoriosAnalytics />
            <DashboardAlunoAdmin />
            <RelatorioComparativo />
          </TabsContent>
        )}

        {/* Tab: Personalização (Master only) */}
        {availableTabs.personalizacao && (
          <TabsContent value="personalizacao" className="space-y-4">
            <CentroComando />
          </TabsContent>
        )}

        {/* Tab: Configurações (Master only) */}
        {availableTabs.configuracoes && (
          <TabsContent value="configuracoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações do Sistema
                </CardTitle>
                <CardDescription>
                  Controle total: cores, temas, DMR, validação de CPF, segurança e parâmetros gerais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ControleFuncionalidades />
                  
                  <div className="p-4 border rounded-lg mt-4">
                    <h4 className="font-semibold mb-2">DMR e Segurança</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Gerenciar configurações de DMR, validação de CPF e controle de logs
                    </p>
                    <Button variant="outline" size="sm">
                      Configurar Segurança
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Parâmetros Gerais</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Tempo de expiração de tokens, backups automáticos, etc.
                    </p>
                    <Button variant="outline" size="sm">
                      Ajustar Parâmetros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Tab: Tokens (Master, Administrativo) */}
        {availableTabs.tokens && (
          <TabsContent value="tokens" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Gestão de Tokens
                    </CardTitle>
                    <CardDescription>
                      Gerar e invalidar tokens de cadastro e acesso
                    </CardDescription>
                  </div>
                  <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
                    <Key className="h-4 w-4 mr-2" />
                    Gerar Token
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Sistema de gestão de tokens em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DOMLayout from "./components/DOMLayout";
import Dashboard from "./pages/Dashboard";
import Plano from "./pages/Plano";
import Aulas from "./pages/Aulas";
import AulaView from "./pages/AulaView";
import Materiais from "./pages/Materiais";
import Questoes from "./pages/Questoes";
import EstatisticasQuestoes from "./pages/EstatisticasQuestoes";
import ResolverQuestoes from "./pages/ResolverQuestoes";
import Forum from "./pages/Forum";
import Revisao from "./pages/Revisao";
import AnotacoesMeta from "./pages/AnotacoesMeta";
import Admin from "./pages/Admin";
import GestaoMetas from "./pages/admin/GestaoMetas";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import VerificarEmail from "./pages/VerificarEmail";
import RecuperarSenha from "./pages/RecuperarSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import Perfil from "./pages/Perfil";
import Conquistas from "./pages/Conquistas";

// Wrapper para rotas com layout
function LayoutRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <DOMLayout>
      <Component />
    </DOMLayout>
  );
}

function Router() {
  return (
    <Switch>
      {/* Rotas públicas de autenticação (sem layout) */}
      <Route path="/cadastro" component={Cadastro} />
      <Route path="/login" component={Login} />
      <Route path="/verificar-email/:token" component={VerificarEmail} />
      <Route path="/recuperar-senha" component={RecuperarSenha} />
      <Route path="/redefinir-senha/:token" component={RedefinirSenha} />
      
      {/* Rotas protegidas (com layout) */}
      <Route path="/" component={() => <LayoutRoute component={Dashboard} />} />
      <Route path="/plano" component={() => <LayoutRoute component={Plano} />} />
      <Route path="/aulas" component={() => <LayoutRoute component={Aulas} />} />
      <Route path="/aulas/:id" component={() => <LayoutRoute component={AulaView} />} />
      <Route path="/materiais" component={() => <LayoutRoute component={Materiais} />} />
      <Route path="/questoes" component={() => <LayoutRoute component={Questoes} />} />
      <Route path="/questoes/resolver" component={() => <LayoutRoute component={ResolverQuestoes} />} />
      <Route path="/questoes/estatisticas" component={() => <LayoutRoute component={EstatisticasQuestoes} />} />
      <Route path="/forum" component={() => <LayoutRoute component={Forum} />} />
      <Route path="/revisao" component={() => <LayoutRoute component={Revisao} />} />
      <Route path="/anotacoes" component={() => <LayoutRoute component={AnotacoesMeta} />} />
      <Route path="/perfil" component={() => <LayoutRoute component={Perfil} />} />
      <Route path="/conquistas" component={() => <LayoutRoute component={Conquistas} />} />
      <Route path="/admin" component={() => <LayoutRoute component={Admin} />} />
      <Route path="/admin/planos/:id/metas" component={() => <LayoutRoute component={GestaoMetas} />} />
      <Route path="/404" component={() => <LayoutRoute component={NotFound} />} />
      
      {/* Final fallback route */}
      <Route component={() => <LayoutRoute component={NotFound} />} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

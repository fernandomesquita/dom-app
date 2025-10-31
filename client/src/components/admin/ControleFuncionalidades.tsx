import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, MessageSquare, BookOpen, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ControleFuncionalidades() {
  const { data: config, refetch } = trpc.adminPanel.getConfigFuncionalidades.useQuery();
  
  const atualizarMutation = trpc.adminPanel.atualizarConfigFuncionalidades.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Configuração atualizada com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar configura\u00e7\u00e3o: " + error.message);
    },
  });

  const handleToggle = (campo: "questoesHabilitado" | "forumHabilitado" | "materiaisHabilitado", valor: boolean) => {
    atualizarMutation.mutate({ [campo]: valor ? 1 : 0 });
  };

  if (!config) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando configurações...</p>
        </CardContent>
      </Card>
    );
  }

  const funcionalidades = [
    {
      id: "questoesHabilitado" as const,
      nome: "Banco de Questões",
      descricao: "Permite que alunos pratiquem com questões de concursos",
      icon: HelpCircle,
      habilitado: config.questoesHabilitado === 1,
      cor: "text-purple-500",
    },
    {
      id: "forumHabilitado" as const,
      nome: "Fórum de Dúvidas",
      descricao: "Espaço para alunos tirarem dúvidas com mentores e colegas",
      icon: MessageSquare,
      habilitado: config.forumHabilitado === 1,
      cor: "text-orange-500",
    },
    {
      id: "materiaisHabilitado" as const,
      nome: "Repositório de Materiais",
      descricao: "Acesso a PDFs, vídeos e outros materiais de estudo",
      icon: BookOpen,
      habilitado: config.materiaisHabilitado === 1,
      cor: "text-purple-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Controle de Funcionalidades
        </CardTitle>
        <CardDescription>
          Habilite ou desabilite módulos da plataforma. Funcionalidades desabilitadas ficam ocultas para os alunos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {funcionalidades.map((func) => {
          const Icon = func.icon;
          return (
            <div
              key={func.id}
              className={`flex items-start justify-between p-4 rounded-lg border-2 transition-all ${
                func.habilitado 
                  ? "bg-white border-border" 
                  : "bg-gray-50 border-gray-300 opacity-60"
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-lg ${func.habilitado ? "bg-primary/10" : "bg-gray-200"}`}>
                  <Icon className={`h-6 w-6 ${func.habilitado ? func.cor : "text-gray-500"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{func.nome}</h4>
                    <Badge variant={func.habilitado ? "default" : "secondary"}>
                      {func.habilitado ? "Habilitado" : "Desabilitado"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{func.descricao}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Switch
                  id={func.id}
                  checked={func.habilitado}
                  onCheckedChange={(checked) => handleToggle(func.id, checked)}
                  disabled={atualizarMutation.isPending}
                />
                <Label htmlFor={func.id} className="sr-only">
                  {func.habilitado ? "Desabilitar" : "Habilitar"} {func.nome}
                </Label>
              </div>
            </div>
          );
        })}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-blue-900 mb-1">Impacto das alterações</p>
              <ul className="text-blue-700 space-y-1 list-disc list-inside">
                <li>Funcionalidades desabilitadas ficam <strong>ocultas</strong> no menu dos alunos</li>
                <li>No painel administrativo, aparecem em <strong>cinza</strong> para visualização</li>
                <li>As alterações são aplicadas <strong>imediatamente</strong> para todos os usuários</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

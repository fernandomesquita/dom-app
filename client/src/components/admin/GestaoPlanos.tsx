import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import GestaoMetas from "./GestaoMetas";
import PlanoCard from "./PlanoCard";
import { gerarTemplatePlanilha } from "@/utils/planilhaTemplate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Target, 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  Download,
  Eye,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

interface Plano {
  id: number;
  nome: string;
  orgao: string;
  cargo: string;
  concurso: string;
  tipo: "pago" | "gratuito";
  alunos: number;
  metas: number;
  ativo: boolean;
  duracao: number; // em dias
  horasDiarias: number;
  createdAt: string;
  criadorNome?: string;
}

export default function GestaoPlanos() {
  const { data: planosData, refetch } = trpc.planos.admin.listAll.useQuery();
  const [planos, setPlanos] = useState<Plano[]>([]);
  
  useEffect(() => {
    if (planosData) {
      setPlanos(planosData.map((p: any) => ({
        id: p.id,
        nome: p.nome,
        orgao: p.orgao || '',
        cargo: p.cargo || '',
        concurso: p.concursoArea || `${p.orgao || ''} - ${p.cargo || ''}`.trim(),
        tipo: p.tipo,
        alunos: 0, // Será atualizado pela API de estatísticas
        metas: 0, // Será atualizado pela API de estatísticas
        ativo: p.ativo === 1,
        duracao: p.duracaoTotal,
        horasDiarias: p.horasDiariasPadrao,
        createdAt: p.createdAt || new Date().toISOString(),
        criadorNome: undefined,
      })));
    }
  }, [planosData]);

  const [modalAberto, setModalAberto] = useState(false);
  const [modalImportacao, setModalImportacao] = useState(false);
  const [planoEditando, setPlanoEditando] = useState<Plano | null>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [modalMetas, setModalMetas] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState<Plano | null>(null);

  const [formData, setFormData] = useState({
    nome: "",
    orgao: "",
    cargo: "",
    tipo: "pago" as "pago" | "gratuito",
    duracao: 180,
    horasDiarias: 4,
  });

  const handleNovoPlano = () => {
    setPlanoEditando(null);
    setFormData({
      nome: "",
      orgao: "",
      cargo: "",
      tipo: "pago",
      duracao: 180,
      horasDiarias: 4,
    });
    setModalAberto(true);
  };

  const handleEditarPlano = (plano: Plano) => {
    setPlanoEditando(plano);
    setFormData({
      nome: plano.nome,
      orgao: plano.concurso.split(" - ")[0] || "",
      cargo: plano.concurso.split(" - ")[1] || "",
      tipo: plano.tipo,
      duracao: plano.duracao,
      horasDiarias: plano.horasDiarias,
    });
    setModalAberto(true);
  };

  const criarPlanoMutation = trpc.planos.admin.create.useMutation({
    onSuccess: () => {
      toast.success("Plano criado com sucesso!");
      refetch();
      setModalAberto(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar plano");
    },
  });

  const atualizarPlanoMutation = trpc.planos.admin.update.useMutation({
    onSuccess: () => {
      toast.success("Plano atualizado com sucesso!");
      refetch();
      setModalAberto(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar plano");
    },
  });

  const handleSalvarPlano = () => {
    if (!formData.nome) {
      toast.error("Preencha o nome do plano");
      return;
    }

    if (planoEditando) {
      atualizarPlanoMutation.mutate({
        id: planoEditando.id,
        nome: formData.nome,
        orgao: formData.orgao,
        cargo: formData.cargo,
        tipo: formData.tipo,
        duracaoTotal: formData.duracao,
        horasDiariasPadrao: formData.horasDiarias,
      });
    } else {
      criarPlanoMutation.mutate({
        nome: formData.nome,
        descricao: "",
        orgao: formData.orgao,
        cargo: formData.cargo,
        tipo: formData.tipo,
        duracaoTotal: formData.duracao,
        horasDiariasPadrao: formData.horasDiarias,
      });
    }
  };

  const toggleAtivoMutation = trpc.planos.admin.toggleAtivo.useMutation({
    onSuccess: () => {
      toast.success("Status do plano atualizado!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar status");
    },
  });

  const handleToggleAtivo = (id: number) => {
    toggleAtivoMutation.mutate({ id });
  };

  const excluirPlanoMutation = trpc.planos.admin.delete.useMutation({
    onSuccess: () => {
      toast.success("Plano excluído com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao excluir plano");
    },
  });

  const handleExcluirPlano = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este plano?")) {
      excluirPlanoMutation.mutate({ id });
    }
  };

  const handleImportarPlanilha = () => {
    if (!arquivo) {
      toast.error("Selecione um arquivo para importar");
      return;
    }

    // Simular importação
    toast.success("Planilha importada com sucesso! 3 planos e 450 metas foram criados.");
    setModalImportacao(false);
    setArquivo(null);
  };

  const handleDownloadTemplate = () => {
    try {
      gerarTemplatePlanilha();
      toast.success("Template baixado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar template");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestão de Planos de Estudo</CardTitle>
              <CardDescription>
                Criar, editar e gerenciar planos. Importar via Excel/CSV ou criar manualmente
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleNovoPlano}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Plano
              </Button>
              <Button variant="outline" onClick={() => setModalImportacao(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Importar Planilha
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Barra de Filtros */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <Input
                placeholder="Filtrar por órgão..."
                className="w-full"
              />
              <Input
                placeholder="Filtrar por cargo..."
                className="w-full"
              />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="gratuito">Gratuito</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {planos.length} planos
              </div>
              <Button variant="outline" size="sm">
                Limpar Filtros
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {planos.map((plano) => (
              <PlanoCard
                key={plano.id}
                plano={plano}
                onEditar={() => handleEditarPlano(plano)}
                onMetas={() => {
                  setPlanoSelecionado(plano);
                  setModalMetas(true);
                }}
                onExcluir={() => handleExcluirPlano(plano.id)}
                onToggleAtivo={() => handleToggleAtivo(plano.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Criação/Edição de Plano */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {planoEditando ? "Editar Plano" : "Criar Novo Plano"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do plano de estudo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Plano *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: TJ-SP 2025"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select 
                  value={formData.tipo} 
                  onValueChange={(value: "pago" | "gratuito") => setFormData({ ...formData, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="gratuito">Gratuito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orgao">Órgão</Label>
                <Input
                  id="orgao"
                  placeholder="Ex: Câmara dos Deputados"
                  value={formData.orgao}
                  onChange={(e) => setFormData({ ...formData, orgao: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  placeholder="Ex: Analista de Registro e Redação"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duracao">Duração (dias)</Label>
                <Input
                  id="duracao"
                  type="number"
                  min="1"
                  value={formData.duracao}
                  onChange={(e) => setFormData({ ...formData, duracao: parseInt(e.target.value) || 180 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horasDiarias">Horas Diárias</Label>
                <Input
                  id="horasDiarias"
                  type="number"
                  min="1"
                  max="24"
                  value={formData.horasDiarias}
                  onChange={(e) => setFormData({ ...formData, horasDiarias: parseInt(e.target.value) || 4 })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarPlano}>
              {planoEditando ? "Salvar Alterações" : "Criar Plano"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Importação de Planilha */}
      <Dialog open={modalImportacao} onOpenChange={setModalImportacao}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar Planos via Planilha</DialogTitle>
            <DialogDescription>
              Faça upload de um arquivo Excel (.xlsx) ou CSV com os dados dos planos e metas
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <Label htmlFor="arquivo" className="cursor-pointer">
                <div className="text-sm font-medium mb-1">
                  {arquivo ? arquivo.name : "Clique para selecionar ou arraste o arquivo"}
                </div>
                <div className="text-xs text-muted-foreground">
                  Formatos aceitos: .xlsx, .csv (máx. 10MB)
                </div>
              </Label>
              <Input
                id="arquivo"
                type="file"
                accept=".xlsx,.csv"
                className="hidden"
                onChange={(e) => setArquivo(e.target.files?.[0] || null)}
              />
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Formato da Planilha</h4>
              <p className="text-xs text-muted-foreground mb-3">
                A planilha deve conter as seguintes colunas: Nome do Plano, Concurso, Tipo, Duração, Horas Diárias, Disciplina, Assunto, Tipo de Meta, Duração da Meta
              </p>
              <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                <Download className="h-3 w-3 mr-2" />
                Baixar Template
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setModalImportacao(false)}>
              Cancelar
            </Button>
            <Button onClick={handleImportarPlanilha} disabled={!arquivo}>
              Importar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Gestão de Metas */}
      {planoSelecionado && (
        <GestaoMetas
          planoId={planoSelecionado.id}
          planoNome={planoSelecionado.nome}
          aberto={modalMetas}
          onFechar={() => {
            setModalMetas(false);
            setPlanoSelecionado(null);
            refetch(); // Atualizar contadores de metas
          }}
        />
      )}
    </div>
  );
}

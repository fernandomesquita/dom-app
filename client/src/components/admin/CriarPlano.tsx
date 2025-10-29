import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar, Clock, Building2, Briefcase } from "lucide-react";

interface CriarPlanoProps {
  aberto: boolean;
  onFechar: () => void;
  onSucesso?: () => void;
}

export default function CriarPlano({ aberto, onFechar, onSucesso }: CriarPlanoProps) {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    duracaoTotal: 30, // em dias
    orgao: "",
    cargo: "",
    tipo: "pago" as "pago" | "gratuito",
    horasDiariasPadrao: 4,
  });

  const [showPreview, setShowPreview] = useState(false);

  const criarPlanoMutation = trpc.planos.create.useMutation({
    onSuccess: () => {
      toast.success("Plano criado com sucesso!");
      resetForm();
      onFechar();
      onSucesso?.();
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar plano: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      duracaoTotal: 30,
      orgao: "",
      cargo: "",
      tipo: "pago",
      horasDiariasPadrao: 4,
    });
    setShowPreview(false);
  };

  const handleSubmit = () => {
    // Validações
    if (!formData.nome.trim()) {
      toast.error("Nome do plano é obrigatório");
      return;
    }

    if (!formData.descricao.trim()) {
      toast.error("Descrição do plano é obrigatória");
      return;
    }

    if (formData.duracaoTotal <= 0) {
      toast.error("Duração do plano deve ser maior que zero");
      return;
    }

    criarPlanoMutation.mutate({
      nome: formData.nome,
      descricao: formData.descricao,
      duracaoTotal: formData.duracaoTotal,
      orgao: formData.orgao || undefined,
      cargo: formData.cargo || undefined,
      tipo: formData.tipo,
      ativo: 1,
      horasDiariasPadrao: formData.horasDiariasPadrao,
      diasEstudoPadrao: "1,2,3,4,5", // Segunda a sexta
    });
  };

  const handlePreview = () => {
    if (!formData.nome.trim() || !formData.descricao.trim()) {
      toast.error("Preencha nome e descrição para visualizar o preview");
      return;
    }
    setShowPreview(true);
  };

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Plano de Estudos</DialogTitle>
          <DialogDescription>
            Preencha as informações do plano. Após criar, você poderá adicionar metas.
          </DialogDescription>
        </DialogHeader>

        {!showPreview ? (
          <div className="space-y-6 py-4">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Informações Básicas</h3>
              
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Plano *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Preparação OAB 2025"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva o objetivo e conteúdo do plano..."
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            {/* Duração e Tipo */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Duração e Tipo
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duracaoTotal">Duração Total (dias) *</Label>
                  <Input
                    id="duracaoTotal"
                    type="number"
                    min="1"
                    value={formData.duracaoTotal}
                    onChange={(e) => setFormData({ ...formData, duracaoTotal: parseInt(e.target.value) || 30 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo do Plano</Label>
                  <select
                    id="tipo"
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as "pago" | "gratuito" })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="pago">Pago</option>
                    <option value="gratuito">Gratuito</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="horasDiariasPadrao">Horas Diárias Padrão</Label>
                <Input
                  id="horasDiariasPadrao"
                  type="number"
                  min="1"
                  max="24"
                  value={formData.horasDiariasPadrao}
                  onChange={(e) => setFormData({ ...formData, horasDiariasPadrao: parseInt(e.target.value) || 4 })}
                />
                <p className="text-xs text-muted-foreground">
                  Sugestão de horas diárias de estudo para os alunos
                </p>
              </div>
            </div>

            {/* Concurso/Órgão */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações do Concurso (opcional)
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgao">Órgão</Label>
                  <Input
                    id="orgao"
                    placeholder="Ex: OAB, TRF, TJ-SP"
                    value={formData.orgao}
                    onChange={(e) => setFormData({ ...formData, orgao: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input
                    id="cargo"
                    placeholder="Ex: Advogado, Juiz, Promotor"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Preview do Plano */
          <div className="space-y-4 py-4">
            <h3 className="font-semibold text-lg">Preview do Plano</h3>
            
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h4 className="font-bold text-xl">{formData.nome}</h4>
                  <p className="text-muted-foreground mt-2">{formData.descricao}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-semibold">Duração</p>
                      <p className="text-muted-foreground">{formData.duracaoTotal} dias</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-semibold">Tipo</p>
                      <p className="text-muted-foreground capitalize">{formData.tipo}</p>
                    </div>
                  </div>

                  {formData.orgao && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-semibold">Órgão</p>
                        <p className="text-muted-foreground">{formData.orgao}</p>
                      </div>
                    </div>
                  )}

                  {formData.cargo && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p className="font-semibold">Cargo</p>
                        <p className="text-muted-foreground">{formData.cargo}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-semibold">Horas Diárias</p>
                      <p className="text-muted-foreground">{formData.horasDiariasPadrao}h/dia</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" onClick={() => setShowPreview(false)} className="w-full">
              Voltar para Edição
            </Button>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onFechar}>
            Cancelar
          </Button>
          {!showPreview && (
            <Button variant="outline" onClick={handlePreview}>
              Visualizar Preview
            </Button>
          )}
          <Button 
            onClick={handleSubmit} 
            disabled={criarPlanoMutation.isPending}
          >
            {criarPlanoMutation.isPending ? "Criando..." : "Criar Plano"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

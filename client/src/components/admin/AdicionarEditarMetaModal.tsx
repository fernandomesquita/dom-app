import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Clock, BookOpen, RefreshCw, HelpCircle, Palette, Video } from "lucide-react";
import SeletorAula from './SeletorAula';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Meta {
  id?: number;
  planoId: number;
  disciplina: string;
  assunto: string;
  tipo: "estudo" | "revisao" | "questoes";
  duracao: number;
  incidencia: "baixa" | "media" | "alta" | null;
  prioridade: number;
  ordem?: number;
  dicaEstudo: string | null;
  cor: string | null;
  aulaId?: number | null;
  orientacaoEstudos?: string | null;
}

interface AdicionarEditarMetaModalProps {
  aberto: boolean;
  onFechar: () => void;
  onSalvar: (meta: Partial<Meta>) => void;
  metaInicial?: Meta | null;
  planoId: number;
  proximaOrdem: number;
}

const CORES_SUGERIDAS = [
  "#E3F2FD", // Azul claro
  "#F3E5F5", // Roxo claro
  "#E8F5E9", // Verde claro
  "#FFF3E0", // Laranja claro
  "#FCE4EC", // Rosa claro
  "#F1F8E9", // Verde limão claro
  "#E0F2F1", // Ciano claro
  "#FFF9C4", // Amarelo claro
  "#FFEBEE", // Vermelho claro
  "#F5F5F5", // Cinza claro
];

export default function AdicionarEditarMetaModal({
  aberto,
  onFechar,
  onSalvar,
  metaInicial,
  planoId,
  proximaOrdem,
}: AdicionarEditarMetaModalProps) {
  const [formData, setFormData] = useState<Partial<Meta>>({
    planoId,
    disciplina: "",
    assunto: "",
    tipo: "estudo",
    duracao: 60,
    incidencia: null,
    prioridade: 3,
    ordem: proximaOrdem,
    dicaEstudo: "",
    cor: CORES_SUGERIDAS[0],
    aulaId: null,
    orientacaoEstudos: "",
  });

  const [mostrarCorPersonalizada, setMostrarCorPersonalizada] = useState(false);

  useEffect(() => {
    if (metaInicial) {
      setFormData(metaInicial);
    } else {
      setFormData({
        planoId,
        disciplina: "",
        assunto: "",
        tipo: "estudo",
        duracao: 60,
        incidencia: null,
        prioridade: 3,
        ordem: proximaOrdem,
        dicaEstudo: "",
        cor: CORES_SUGERIDAS[0],
        aulaId: null,
        orientacaoEstudos: "",
      });
    }
  }, [metaInicial, planoId, proximaOrdem, aberto]);

  const handleSubmit = () => {
    // Validações
    if (!formData.disciplina?.trim()) {
      toast.error("Disciplina é obrigatória");
      return;
    }

    if (!formData.assunto?.trim()) {
      toast.error("Assunto é obrigatório");
      return;
    }

    if (!formData.duracao || formData.duracao <= 0) {
      toast.error("Duração deve ser maior que zero");
      return;
    }

    onSalvar(formData);
    onFechar();
  };

  const getTipoBadge = (tipo: string) => {
    const badges = {
      estudo: { label: "Estudo", icon: BookOpen, className: "bg-blue-100 text-blue-800" },
      revisao: { label: "Revisão", icon: RefreshCw, className: "bg-green-100 text-green-800" },
      questoes: { label: "Questões", icon: HelpCircle, className: "bg-orange-100 text-orange-800" },
    };
    return badges[tipo as keyof typeof badges] || badges.estudo;
  };

  const tipoBadge = getTipoBadge(formData.tipo || "estudo");
  const TipoIcon = tipoBadge.icon;

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {metaInicial ? "Editar Meta" : "Adicionar Nova Meta"}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações da meta de estudo
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna Esquerda - Formulário */}
          <div className="space-y-4">
            {/* Disciplina */}
            <div className="space-y-2">
              <Label htmlFor="disciplina">
                Disciplina <span className="text-red-500">*</span>
              </Label>
              <Input
                id="disciplina"
                placeholder="Ex: Direito Constitucional"
                value={formData.disciplina || ""}
                onChange={(e) =>
                  setFormData({ ...formData, disciplina: e.target.value })
                }
              />
            </div>

            {/* Assunto */}
            <div className="space-y-2">
              <Label htmlFor="assunto">
                Assunto <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="assunto"
                placeholder="Ex: Princípios Fundamentais da República"
                rows={3}
                value={formData.assunto || ""}
                onChange={(e) =>
                  setFormData({ ...formData, assunto: e.target.value })
                }
              />
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="tipo">
                Tipo <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: "estudo" | "revisao" | "questoes") =>
                  setFormData({ ...formData, tipo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="estudo">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      Estudo
                    </div>
                  </SelectItem>
                  <SelectItem value="revisao">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-green-600" />
                      Revisão
                    </div>
                  </SelectItem>
                  <SelectItem value="questoes">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-orange-600" />
                      Questões
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duração */}
            <div className="space-y-2">
              <Label htmlFor="duracao">
                Duração (minutos) <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="duracao"
                  type="number"
                  min="1"
                  value={formData.duracao || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, duracao: parseInt(e.target.value) || 0 })
                  }
                  className="flex-1"
                />
                <div className="flex gap-1">
                  {[30, 45, 60, 90, 120].map((min) => (
                    <Button
                      key={min}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, duracao: min })}
                    >
                      {min}
                    </Button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {formData.duracao ? `${(formData.duracao / 60).toFixed(1)} hora(s)` : ""}
              </p>
            </div>

            {/* Incidência */}
            <div className="space-y-2">
              <Label htmlFor="incidencia">Incidência</Label>
              <Select
                value={formData.incidencia || "nenhuma"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    incidencia: value === "nenhuma" ? null : (value as "baixa" | "media" | "alta"),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nenhuma">Não especificada</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prioridade */}
            <div className="space-y-2">
              <Label htmlFor="prioridade">Prioridade (1-5)</Label>
              <Input
                id="prioridade"
                type="number"
                min="1"
                max="5"
                value={formData.prioridade || 3}
                onChange={(e) =>
                  setFormData({ ...formData, prioridade: parseInt(e.target.value) || 3 })
                }
              />
            </div>
          </div>

          {/* Coluna Direita - Detalhes e Preview */}
          <div className="space-y-4">
            {/* Aula Vinculada */}
            <div className="space-y-2">
              <Label htmlFor="aulaId">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Aula Vinculada (Opcional)
                </div>
              </Label>
              <SeletorAula
                value={formData.aulaId}
                onChange={(aulaId) => setFormData({ ...formData, aulaId })}
                disciplina={formData.disciplina}
              />
              <p className="text-xs text-gray-500">
                Vincule uma aula para que o aluno possa acessá-la diretamente
              </p>
            </div>

            {/* Dica de Estudo */}
            <div className="space-y-2">
              <Label htmlFor="dicaEstudo">Dica de Estudo</Label>
              <Textarea
                id="dicaEstudo"
                placeholder="Dicas, observações ou orientações para o estudo deste tópico..."
                rows={4}
                value={formData.dicaEstudo || ""}
                onChange={(e) =>
                  setFormData({ ...formData, dicaEstudo: e.target.value })
                }
              />
              <p className="text-sm text-gray-500">
                {formData.dicaEstudo?.length || 0} caracteres
              </p>
            </div>

            {/* Orientação de Estudos (Rich Text) */}
            <div className="space-y-2">
              <Label htmlFor="orientacaoEstudos">Orientação de Estudos (Opcional)</Label>
              <ReactQuill
                theme="snow"
                value={formData.orientacaoEstudos || ""}
                onChange={(value) => setFormData({ ...formData, orientacaoEstudos: value })}
                placeholder="Orientações detalhadas com formatação rica..."
                className="bg-white"
              />
              <p className="text-xs text-gray-500">
                Use este campo para orientações mais elaboradas com formatação (negrito, itálico, listas, etc.)
              </p>
            </div>

            {/* Cor */}
            <div className="space-y-2">
              <Label>
                <Palette className="w-4 h-4 inline mr-2" />
                Cor da Meta
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {CORES_SUGERIDAS.map((cor) => (
                  <button
                    key={cor}
                    type="button"
                    className={`w-full h-10 rounded border-2 ${
                      formData.cor === cor ? "border-blue-500" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: cor }}
                    onClick={() => setFormData({ ...formData, cor })}
                  />
                ))}
              </div>

              {mostrarCorPersonalizada && (
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={formData.cor || "#E3F2FD"}
                    onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={formData.cor || ""}
                    onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                    placeholder="#HEXCODE"
                    className="flex-1"
                  />
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMostrarCorPersonalizada(!mostrarCorPersonalizada)}
              >
                {mostrarCorPersonalizada ? "Ocultar" : "Cor Personalizada"}
              </Button>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <Card
                className="border-2"
                style={{ backgroundColor: formData.cor || "#E3F2FD" }}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className={tipoBadge.className}>
                      <TipoIcon className="w-3 h-3 mr-1" />
                      {tipoBadge.label}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {formData.duracao || 0} min
                    </div>
                  </div>
                  <div className="font-bold text-gray-900">
                    {formData.disciplina || "Disciplina"}
                  </div>
                  <div className="text-sm text-gray-700 line-clamp-2">
                    {formData.assunto || "Assunto da meta"}
                  </div>
                  {formData.incidencia && (
                    <Badge
                      className={
                        formData.incidencia === "alta"
                          ? "bg-red-100 text-red-800"
                          : formData.incidencia === "media"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      Incidência: {formData.incidencia}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onFechar}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {metaInicial ? "Salvar Alterações" : "Adicionar Meta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

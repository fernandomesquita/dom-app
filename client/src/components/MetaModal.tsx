import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, HelpCircle, CheckCircle, Play } from "lucide-react";

interface Meta {
  id: number;
  disciplina: string;
  assunto: string;
  tipo: "estudo" | "revisao" | "questoes";
  duracao: number;
  incidencia?: "baixa" | "media" | "alta";
  dicaEstudo?: string;
  aulaId?: number | null;
}

interface MetaModalProps {
  meta: Meta | null;
  open: boolean;
  onClose: () => void;
  onConcluir?: () => void;
}

export default function MetaModal({ meta, open, onClose, onConcluir }: MetaModalProps) {
  if (!meta) return null;

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "estudo":
        return "Estudo";
      case "revisao":
        return "Revisão";
      case "questoes":
        return "Questões";
      default:
        return tipo;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "estudo":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "revisao":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "questoes":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getIncidenciaInfo = (incidencia?: string) => {
    switch (incidencia) {
      case "alta":
        return { icon: "🔥", label: "Alta Incidência", color: "text-red-600" };
      case "media":
        return { icon: "⚡", label: "Média Incidência", color: "text-yellow-600" };
      case "baixa":
        return { icon: "💧", label: "Baixa Incidência", color: "text-blue-600" };
      default:
        return null;
    }
  };

  const incidenciaInfo = getIncidenciaInfo(meta.incidencia);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{meta.disciplina}</DialogTitle>
              <DialogDescription className="text-base">{meta.assunto}</DialogDescription>
            </div>
            <Badge className={getTipoColor(meta.tipo)}>
              {getTipoLabel(meta.tipo)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações Principais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Duração</div>
                <div className="font-semibold">{meta.duracao} minutos</div>
              </div>
            </div>

            {incidenciaInfo && (
              <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
                <span className="text-2xl">{incidenciaInfo.icon}</span>
                <div>
                  <div className="text-sm text-muted-foreground">Incidência</div>
                  <div className={`font-semibold ${incidenciaInfo.color}`}>
                    {incidenciaInfo.label}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dica de Estudo */}
          {meta.dicaEstudo && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                💡 Dica de Estudo
              </h4>
              <p className="text-sm text-muted-foreground">{meta.dicaEstudo}</p>
            </div>
          )}

          {/* Ações */}
          <div className="space-y-3">
            {meta.aulaId && (
              <Button className="w-full" variant="default" size="lg">
                <Play className="h-4 w-4 mr-2" />
                Assistir Aula Relacionada
              </Button>
            )}

            {meta.tipo === "questoes" && (
              <Button className="w-full" variant="outline" size="lg">
                <HelpCircle className="h-4 w-4 mr-2" />
                Resolver Questões
              </Button>
            )}

            {meta.tipo === "estudo" && meta.aulaId && (
              <Button className="w-full" variant="outline" size="lg">
                <BookOpen className="h-4 w-4 mr-2" />
                Ver Materiais Complementares
              </Button>
            )}
          </div>

          {/* Botão de Conclusão */}
          <div className="pt-4 border-t">
            <Button
              className="w-full"
              variant="default"
              size="lg"
              onClick={() => {
                onConcluir?.();
                onClose();
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar como Concluída
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

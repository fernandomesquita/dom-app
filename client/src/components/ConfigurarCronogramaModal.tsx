import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface ConfigurarCronogramaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  configuracaoAtual?: {
    horasDiarias: number;
    diasSemana: string;
  };
}

export default function ConfigurarCronogramaModal({
  open,
  onClose,
  onSave,
  configuracaoAtual,
}: ConfigurarCronogramaModalProps) {
  const [horasDiarias, setHorasDiarias] = useState(4);
  const [diasSelecionados, setDiasSelecionados] = useState<number[]>([1, 2, 3, 4, 5]); // Seg-Sex

  const diasSemana = [
    { num: 0, nome: "Dom" },
    { num: 1, nome: "Seg" },
    { num: 2, nome: "Ter" },
    { num: 3, nome: "Qua" },
    { num: 4, nome: "Qui" },
    { num: 5, nome: "Sex" },
    { num: 6, nome: "Sáb" },
  ];

  useEffect(() => {
    if (configuracaoAtual) {
      setHorasDiarias(configuracaoAtual.horasDiarias);
      const dias = configuracaoAtual.diasSemana.split(',').map(d => parseInt(d));
      setDiasSelecionados(dias);
    }
  }, [configuracaoAtual]);

  const atualizarMutation = trpc.metas.atualizarConfiguracoes.useMutation({
    onSuccess: () => {
      toast.success("Configurações salvas com sucesso!");
      onSave();
      onClose();
    },
    onError: (error) => {
      toast.error(`Erro ao salvar configurações: ${error.message}`);
    },
  });

  const redistribuirMutation = trpc.metas.redistribuir.useMutation({
    onSuccess: () => {
      toast.success("Metas redistribuídas com sucesso!");
      onSave();
    },
    onError: (error) => {
      toast.error(`Erro ao redistribuir metas: ${error.message}`);
    },
  });

  const toggleDia = (dia: number) => {
    if (diasSelecionados.includes(dia)) {
      // Não permitir desmarcar todos os dias
      if (diasSelecionados.length === 1) {
        toast.error("Você precisa estudar em pelo menos 1 dia da semana");
        return;
      }
      setDiasSelecionados(diasSelecionados.filter(d => d !== dia));
    } else {
      setDiasSelecionados([...diasSelecionados, dia].sort());
    }
  };

  const handleSalvar = async () => {
    if (diasSelecionados.length === 0) {
      toast.error("Selecione pelo menos 1 dia da semana");
      return;
    }

    const diasString = diasSelecionados.join(',');

    // Salvar configurações
    await atualizarMutation.mutateAsync({
      horasDiarias,
      diasSemana: diasString,
    });

    // Redistribuir metas automaticamente
    await redistribuirMutation.mutateAsync({
      horasDiarias,
      diasSemana: diasString,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurar Cronograma de Estudos</DialogTitle>
          <DialogDescription>
            Defina quantas horas você quer estudar por dia e em quais dias da semana.
            As metas serão redistribuídas automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Horas Diárias */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Horas de Estudo por Dia</Label>
              <span className="text-2xl font-bold text-primary">{horasDiarias}h</span>
            </div>
            <Slider
              value={[horasDiarias]}
              onValueChange={([value]) => setHorasDiarias(value)}
              min={1}
              max={12}
              step={1}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1h (mínimo)</span>
              <span>12h (máximo)</span>
            </div>
          </div>

          {/* Dias da Semana */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Dias de Estudo</Label>
            <div className="grid grid-cols-7 gap-2">
              {diasSemana.map((dia) => (
                <Button
                  key={dia.num}
                  variant={diasSelecionados.includes(dia.num) ? "default" : "outline"}
                  className="h-16 flex flex-col items-center justify-center"
                  onClick={() => toggleDia(dia.num)}
                  type="button"
                >
                  <span className="text-xs">{dia.nome}</span>
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {diasSelecionados.length} {diasSelecionados.length === 1 ? "dia selecionado" : "dias selecionados"}
            </p>
          </div>

          {/* Resumo */}
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="text-sm font-semibold">Resumo:</p>
            <p className="text-sm text-muted-foreground">
              • {horasDiarias}h de estudo por dia
            </p>
            <p className="text-sm text-muted-foreground">
              • {diasSelecionados.length} dias por semana
            </p>
            <p className="text-sm text-muted-foreground">
              • Total semanal: <span className="font-bold text-primary">{horasDiarias * diasSelecionados.length}h</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={atualizarMutation.isPending || redistribuirMutation.isPending}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSalvar}
            disabled={atualizarMutation.isPending || redistribuirMutation.isPending}
          >
            {atualizarMutation.isPending || redistribuirMutation.isPending ? "Salvando..." : "Salvar e Redistribuir"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

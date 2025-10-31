import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Calendar, Clock } from "lucide-react";

interface AtribuirPlanoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuarioId: number;
  usuarioNome?: string;
  onSuccess?: () => void;
}

export default function AtribuirPlanoModal({ 
  open, 
  onOpenChange, 
  usuarioId, 
  usuarioNome,
  onSuccess 
}: AtribuirPlanoModalProps) {
  const [planoSelecionado, setPlanoSelecionado] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<string>("");
  const [horasDiarias, setHorasDiarias] = useState<string>("4");
  const [diasEstudo, setDiasEstudo] = useState<string[]>(["1", "2", "3", "4", "5"]); // Seg-Sex

  // Queries
  const { data: planos } = trpc.planos.list.useQuery();

  // Mutation
  const atribuirMutation = trpc.admin.atribuirPlano.useMutation({
    onSuccess: () => {
      toast.success("Plano atribuído com sucesso!");
      setPlanoSelecionado("");
      setDataInicio("");
      setHorasDiarias("4");
      setDiasEstudo(["1", "2", "3", "4", "5"]);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Erro ao atribuir plano: ${error.message}`);
    },
  });

  const handleAtribuir = async () => {
    if (!planoSelecionado || !dataInicio) {
      toast.error("Selecione um plano e a data de início.");
      return;
    }

    if (diasEstudo.length === 0) {
      toast.error("Selecione pelo menos um dia de estudo.");
      return;
    }

    atribuirMutation.mutate({
      usuarioId,
      planoId: parseInt(planoSelecionado),
      dataInicio,
      horasDiarias: parseFloat(horasDiarias),
      diasSemana: diasEstudo.join(","),
    });
  };

  const toggleDia = (dia: string) => {
    setDiasEstudo(prev => 
      prev.includes(dia) 
        ? prev.filter(d => d !== dia)
        : [...prev, dia].sort()
    );
  };

  const diasSemana = [
    { valor: "0", nome: "Dom" },
    { valor: "1", nome: "Seg" },
    { valor: "2", nome: "Ter" },
    { valor: "3", nome: "Qua" },
    { valor: "4", nome: "Qui" },
    { valor: "5", nome: "Sex" },
    { valor: "6", nome: "Sáb" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Atribuir Plano</DialogTitle>
          {usuarioNome && (
            <p className="text-sm text-muted-foreground">
              Atribuindo plano para: <span className="font-semibold">{usuarioNome}</span>
            </p>
          )}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Seleção de Plano */}
          <div className="space-y-2">
            <Label htmlFor="plano">Plano de Estudos *</Label>
            <Select value={planoSelecionado} onValueChange={setPlanoSelecionado}>
              <SelectTrigger id="plano">
                <SelectValue placeholder="Selecione um plano..." />
              </SelectTrigger>
              <SelectContent>
                {planos?.map((plano: any) => {
                  const nomeCompleto = `${plano.nome} - ${plano.orgao} (${plano.cargo})`;
                  return (
                    <SelectItem 
                      key={plano.id} 
                      value={plano.id.toString()}
                      title={nomeCompleto}
                    >
                      <span className="block truncate max-w-[500px]">
                        {nomeCompleto}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Data de Início */}
          <div className="space-y-2">
            <Label htmlFor="dataInicio">Data de Início *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Horas Diárias */}
          <div className="space-y-2">
            <Label htmlFor="horasDiarias">Horas de Estudo por Dia *</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="horasDiarias"
                type="number"
                min="1"
                max="12"
                step="0.5"
                value={horasDiarias}
                onChange={(e) => setHorasDiarias(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Entre 1 e 12 horas por dia
            </p>
          </div>

          {/* Dias da Semana */}
          <div className="space-y-2">
            <Label>Dias de Estudo *</Label>
            <div className="flex gap-2">
              {diasSemana.map((dia) => (
                <Button
                  key={dia.valor}
                  type="button"
                  variant={diasEstudo.includes(dia.valor) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDia(dia.valor)}
                  className="flex-1"
                >
                  {dia.nome}
                </Button>
              ))}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={atribuirMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleAtribuir}
              disabled={atribuirMutation.isPending}
            >
              {atribuirMutation.isPending ? "Atribuindo..." : "Atribuir Plano"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

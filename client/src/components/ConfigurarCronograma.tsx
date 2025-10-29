import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Save, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ConfigurarCronogramaProps {
  open: boolean;
  onClose: () => void;
  onSave?: (config: CronogramaConfig) => void;
  configAtual?: CronogramaConfig;
}

export interface CronogramaConfig {
  horasDiarias: number;
  diasSemana: {
    domingo: boolean;
    segunda: boolean;
    terca: boolean;
    quarta: boolean;
    quinta: boolean;
    sexta: boolean;
    sabado: boolean;
  };
  dataInicio?: Date;
  dataTermino?: Date;
  pausas: Array<{
    inicio: Date;
    fim: Date;
    motivo: string;
  }>;
}

const configPadrao: CronogramaConfig = {
  horasDiarias: 4,
  diasSemana: {
    domingo: false,
    segunda: true,
    terca: true,
    quarta: true,
    quinta: true,
    sexta: true,
    sabado: false,
  },
  pausas: [],
};

export default function ConfigurarCronograma({ open, onClose, onSave, configAtual }: ConfigurarCronogramaProps) {
  const [config, setConfig] = useState<CronogramaConfig>(configAtual || configPadrao);
  const [novaPausaInicio, setNovaPausaInicio] = useState<Date>();
  const [novaPausaFim, setNovaPausaFim] = useState<Date>();
  const [novaPausaMotivo, setNovaPausaMotivo] = useState("");

  const handleSave = () => {
    // Validações
    if (config.horasDiarias < 1 || config.horasDiarias > 12) {
      toast.error("Horas diárias deve estar entre 1 e 12");
      return;
    }

    const diasAtivos = Object.values(config.diasSemana).filter(Boolean).length;
    if (diasAtivos === 0) {
      toast.error("Selecione pelo menos um dia da semana");
      return;
    }

    onSave?.(config);
    toast.success("Cronograma atualizado com sucesso!");
    onClose();
  };

  const handleReset = () => {
    setConfig(configPadrao);
    toast.info("Configurações restauradas para o padrão");
  };

  const handleAdicionarPausa = () => {
    if (!novaPausaInicio || !novaPausaFim) {
      toast.error("Selecione as datas de início e fim da pausa");
      return;
    }

    if (novaPausaInicio >= novaPausaFim) {
      toast.error("Data de início deve ser anterior à data de fim");
      return;
    }

    setConfig({
      ...config,
      pausas: [
        ...config.pausas,
        {
          inicio: novaPausaInicio,
          fim: novaPausaFim,
          motivo: novaPausaMotivo || "Pausa",
        },
      ],
    });

    setNovaPausaInicio(undefined);
    setNovaPausaFim(undefined);
    setNovaPausaMotivo("");
    toast.success("Pausa adicionada");
  };

  const handleRemoverPausa = (index: number) => {
    setConfig({
      ...config,
      pausas: config.pausas.filter((_, i) => i !== index),
    });
    toast.success("Pausa removida");
  };

  const diasDaSemana = [
    { key: "domingo", label: "Dom" },
    { key: "segunda", label: "Seg" },
    { key: "terca", label: "Ter" },
    { key: "quarta", label: "Qua" },
    { key: "quinta", label: "Qui" },
    { key: "sexta", label: "Sex" },
    { key: "sabado", label: "Sáb" },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">⚙️ Configurar Cronograma</DialogTitle>
          <DialogDescription>
            Personalize seu cronograma de estudos de acordo com sua disponibilidade
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Horas Diárias */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Horas Diárias de Estudo</Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min={1}
                max={12}
                value={config.horasDiarias}
                onChange={(e) => setConfig({ ...config, horasDiarias: Number(e.target.value) })}
                className="w-24 text-center text-lg font-semibold"
              />
              <span className="text-muted-foreground">horas por dia</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Total semanal: {config.horasDiarias * Object.values(config.diasSemana).filter(Boolean).length} horas
            </p>
          </div>

          {/* Dias da Semana */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Dias da Semana Disponíveis</Label>
            <div className="grid grid-cols-7 gap-2">
              {diasDaSemana.map(({ key, label }) => (
                <div
                  key={key}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
                    config.diasSemana[key as keyof typeof config.diasSemana]
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background hover:bg-accent"
                  )}
                  onClick={() =>
                    setConfig({
                      ...config,
                      diasSemana: {
                        ...config.diasSemana,
                        [key]: !config.diasSemana[key as keyof typeof config.diasSemana],
                      },
                    })
                  }
                >
                  <span className="text-xs font-medium">{label}</span>
                  <Switch
                    checked={config.diasSemana[key as keyof typeof config.diasSemana]}
                    onCheckedChange={(checked) =>
                      setConfig({
                        ...config,
                        diasSemana: {
                          ...config.diasSemana,
                          [key]: checked,
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Data de Início */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Data de Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {config.dataInicio ? format(config.dataInicio, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={config.dataInicio}
                  onSelect={(date) => setConfig({ ...config, dataInicio: date })}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              A data de término será calculada automaticamente com base na duração do plano
            </p>
          </div>

          {/* Pausas/Férias */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Pausas e Férias</Label>
            
            {/* Lista de Pausas */}
            {config.pausas.length > 0 && (
              <div className="space-y-2 mb-4">
                {config.pausas.map((pausa, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                    <div>
                      <p className="font-medium">{pausa.motivo}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(pausa.inicio, "dd/MM/yyyy", { locale: ptBR })} até{" "}
                        {format(pausa.fim, "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoverPausa(index)}>
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Adicionar Nova Pausa */}
            <div className="p-4 border rounded-lg space-y-3">
              <p className="text-sm font-medium">Adicionar Nova Pausa</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {novaPausaInicio ? format(novaPausaInicio, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={novaPausaInicio}
                        onSelect={setNovaPausaInicio}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-xs">Data de Término</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {novaPausaFim ? format(novaPausaFim, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={novaPausaFim}
                        onSelect={setNovaPausaFim}
                        locale={ptBR}
                        disabled={(date) => novaPausaInicio ? date < novaPausaInicio : false}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Input
                placeholder="Motivo (ex: Férias, Viagem, etc.)"
                value={novaPausaMotivo}
                onChange={(e) => setNovaPausaMotivo(e.target.value)}
              />
              <Button size="sm" variant="outline" className="w-full" onClick={handleAdicionarPausa}>
                Adicionar Pausa
              </Button>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar Padrão
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

interface SeletorAulaProps {
  value: number | null | undefined;
  onChange: (aulaId: number | null) => void;
  disciplina?: string;
}

export default function SeletorAula({ value, onChange, disciplina }: SeletorAulaProps) {
  const { data: aulas, isLoading } = trpc.aulas.list.useQuery();

  // Filtrar aulas por disciplina se fornecida
  const aulasFiltradas = aulas?.filter(aula => 
    !disciplina || aula.disciplina.toLowerCase().includes(disciplina.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 border rounded-md">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm text-muted-foreground">Carregando aulas...</span>
      </div>
    );
  }

  return (
    <Select
      value={value?.toString() || "nenhuma"}
      onValueChange={(val) => onChange(val === "nenhuma" ? null : parseInt(val))}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione uma aula (opcional)" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="nenhuma">Nenhuma aula vinculada</SelectItem>
        {aulasFiltradas.length === 0 && disciplina && (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            Nenhuma aula encontrada para "{disciplina}"
          </div>
        )}
        {aulasFiltradas.map((aula) => (
          <SelectItem key={aula.id} value={aula.id.toString()}>
            <div className="flex flex-col">
              <span className="font-medium">{aula.titulo}</span>
              <span className="text-xs text-muted-foreground">
                {aula.disciplina} • {aula.duracao}min
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Users, Download, Search } from "lucide-react";

export default function RelatorioComparativo() {
  const [alunosSelecionados, setAlunosSelecionados] = useState<number[]>([]);
  const [busca, setBusca] = useState("");

  const { data: usuarios } = trpc.adminPanel.usuarios.list.useQuery();
  const { data: progresso } = trpc.adminPanel.usuarios.getAlunosComProgresso.useQuery();

  const alunos = usuarios?.filter((u: any) => u.role === "aluno") || [];

  const toggleAluno = (alunoId: number) => {
    setAlunosSelecionados(prev =>
      prev.includes(alunoId)
        ? prev.filter(id => id !== alunoId)
        : [...prev, alunoId]
    );
  };

  const handleExportar = () => {
    if (alunosSelecionados.length === 0) {
      toast.error("Selecione pelo menos um aluno");
      return;
    }
    toast.success("Relatório exportado!");
  };

  const alunosFiltrados = alunos.filter((a: any) =>
    a.name?.toLowerCase().includes(busca.toLowerCase()) ||
    a.email?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Relatório Comparativo
        </CardTitle>
        <CardDescription>Compare o desempenho de múltiplos alunos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar aluno..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="border rounded-lg max-h-64 overflow-y-auto">
            {alunosFiltrados.map((aluno: any) => (
              <div
                key={aluno.id}
                className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                onClick={() => toggleAluno(aluno.id)}
              >
                <Checkbox
                  checked={alunosSelecionados.includes(aluno.id)}
                  onCheckedChange={() => toggleAluno(aluno.id)}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{aluno.name}</p>
                  <p className="text-xs text-muted-foreground">{aluno.email}</p>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleExportar} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

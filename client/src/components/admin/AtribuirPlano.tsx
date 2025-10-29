import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Users, Calendar, CheckCircle } from "lucide-react";

export default function AtribuirPlano() {
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<string>("");
  const [planoSelecionado, setPlanoSelecionado] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<string>("");

  // Queries
  const { data: usuarios } = trpc.admin.getUsuarios.useQuery();
  const { data: planos } = trpc.planos.list.useQuery();
  const { data: matriculas, refetch } = trpc.admin.getMatriculas.useQuery();

  // Mutation
  const atribuirMutation = trpc.admin.atribuirPlano.useMutation({
    onSuccess: () => {
      toast.success("Plano atribuído ao aluno com sucesso!");
      setUsuarioSelecionado("");
      setPlanoSelecionado("");
      setDataInicio("");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao atribuir plano: ${error.message}`);
    },
  });

  const handleAtribuir = () => {
    if (!usuarioSelecionado || !planoSelecionado || !dataInicio) {
      toast.error("Preencha todos os campos antes de atribuir o plano.");
      return;
    }

    atribuirMutation.mutate({
      userId: parseInt(usuarioSelecionado),
      planoId: parseInt(planoSelecionado),
      dataInicio: new Date(dataInicio).toISOString(),
    });
  };

  // Filtrar apenas alunos (role = "aluno")
  const alunos = usuarios?.filter((u: any) => u.role === "aluno") || [];

  return (
    <div className="space-y-6">
      {/* Formulário de Atribuição */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Atribuir Plano a Aluno
          </CardTitle>
          <CardDescription>
            Vincule um plano de estudos a um aluno específico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Selecionar Aluno */}
            <div className="space-y-2">
              <Label htmlFor="aluno">Aluno *</Label>
              <Select value={usuarioSelecionado} onValueChange={setUsuarioSelecionado}>
                <SelectTrigger id="aluno">
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  {alunos.map((aluno: any) => (
                    <SelectItem key={aluno.id} value={aluno.id.toString()}>
                      {aluno.name} ({aluno.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selecionar Plano */}
            <div className="space-y-2">
              <Label htmlFor="plano">Plano de Estudos *</Label>
              <Select value={planoSelecionado} onValueChange={setPlanoSelecionado}>
                <SelectTrigger id="plano">
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {planos?.map((plano) => (
                    <SelectItem key={plano.id} value={plano.id.toString()}>
                      {plano.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data de Início */}
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data de Início *</Label>
              <input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Botão Atribuir */}
            <Button 
              onClick={handleAtribuir} 
              disabled={atribuirMutation.isPending}
              className="w-full"
            >
              {atribuirMutation.isPending ? "Atribuindo..." : "Atribuir Plano"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Matrículas Ativas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Planos Atribuídos
          </CardTitle>
          <CardDescription>
            Lista de alunos com planos ativos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!matriculas || matriculas.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum plano atribuído ainda
            </p>
          ) : (
            <div className="space-y-4">
              {matriculas.map((matricula: any) => (
                <div 
                  key={matricula.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{matricula.usuario?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {matricula.plano?.nome}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(matricula.dataInicio).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

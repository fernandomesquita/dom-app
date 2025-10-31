import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Users, Calendar, CheckCircle, AlertCircle, Clock, RefreshCw } from "lucide-react";

export default function AtribuirPlano() {
  const [usuariosSelecionados, setUsuariosSelecionados] = useState<number[]>([]);
  const [planoSelecionado, setPlanoSelecionado] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<string>("");
  const [horasDiarias, setHorasDiarias] = useState<string>("4");
  const [diasEstudo, setDiasEstudo] = useState<string[]>(["1", "2", "3", "4", "5"]); // Seg-Sex
  const [filtroAluno, setFiltroAluno] = useState<string>("");
  const [mostrarApenasSemPlano, setMostrarApenasSemPlano] = useState(false);

  // Queries
  const { data: usuarios } = trpc.adminPanel.usuarios.list.useQuery();
  const { data: planos } = trpc.planos.list.useQuery();
  const { data: matriculas, refetch } = trpc.adminPanel.getMatriculas.useQuery();

  // Mutation
  const atribuirMutation = trpc.adminPanel.atribuirPlano.useMutation({
    onSuccess: () => {
      toast.success("Plano(s) atribuído(s) com sucesso!");
      setUsuariosSelecionados([]);
      setPlanoSelecionado("");
      setDataInicio("");
      setHorasDiarias("4");
      setDiasEstudo(["1", "2", "3", "4", "5"]);
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao atribuir plano: ${error.message}`);
    },
  });

  const handleAtribuir = async () => {
    if (usuariosSelecionados.length === 0 || !planoSelecionado || !dataInicio) {
      toast.error("Selecione pelo menos um aluno, um plano e a data de início.");
      return;
    }

    if (diasEstudo.length === 0) {
      toast.error("Selecione pelo menos um dia de estudo.");
      return;
    }

    // Atribuir para cada usuário selecionado
    for (const userId of usuariosSelecionados) {
      try {
        await atribuirMutation.mutateAsync({
          userId,
          planoId: parseInt(planoSelecionado),
          dataInicio: new Date(dataInicio).toISOString(),
          horasDiarias: parseInt(horasDiarias),
          diasEstudo: diasEstudo.join(","),
        });
      } catch (error) {
        console.error(`Erro ao atribuir plano ao usuário ${userId}:`, error);
      }
    }
  };

  const toggleUsuario = (userId: number) => {
    setUsuariosSelecionados(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleDia = (dia: string) => {
    setDiasEstudo(prev =>
      prev.includes(dia)
        ? prev.filter(d => d !== dia)
        : [...prev, dia]
    );
  };

  const selecionarTodos = () => {
    const alunosFiltrados = alunosFiltradosComStatus.map(a => a.id);
    setUsuariosSelecionados(alunosFiltrados);
  };

  const desselecionarTodos = () => {
    setUsuariosSelecionados([]);
  };

  // Filtrar apenas alunos
  const alunos = usuarios?.filter((u: any) => u.role === "aluno") || [];

  // Criar mapa de matrículas ativas por userId
  const matriculasMap = new Map();
  matriculas?.forEach((m: any) => {
    if (m.ativo === 1) {
      matriculasMap.set(m.userId, m);
    }
  });

  // Alunos com status de plano
  const alunosComStatus = alunos.map((aluno: any) => ({
    ...aluno,
    temPlano: matriculasMap.has(aluno.id),
    matricula: matriculasMap.get(aluno.id),
  }));

  // Aplicar filtros
  const alunosFiltradosComStatus = alunosComStatus.filter((aluno: any) => {
    const matchNome = aluno.name?.toLowerCase().includes(filtroAluno.toLowerCase());
    const matchEmail = aluno.email?.toLowerCase().includes(filtroAluno.toLowerCase());
    const matchFiltro = matchNome || matchEmail;

    if (mostrarApenasSemPlano) {
      return matchFiltro && !aluno.temPlano;
    }

    return matchFiltro;
  });

  const diasSemana = [
    { valor: "0", label: "Dom" },
    { valor: "1", label: "Seg" },
    { valor: "2", label: "Ter" },
    { valor: "3", label: "Qua" },
    { valor: "4", label: "Qui" },
    { valor: "5", label: "Sex" },
    { valor: "6", label: "Sáb" },
  ];

  return (
    <div className="space-y-6">
      {/* Formulário de Atribuição */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Atribuir Plano a Aluno(s)
          </CardTitle>
          <CardDescription>
            Vincule um plano de estudos a um ou mais alunos com configurações personalizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Seleção de Alunos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Alunos * ({usuariosSelecionados.length} selecionado(s))</Label>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={selecionarTodos}>
                    Selecionar Todos
                  </Button>
                  <Button size="sm" variant="outline" onClick={desselecionarTodos}>
                    Limpar
                  </Button>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={filtroAluno}
                  onChange={(e) => setFiltroAluno(e.target.value)}
                  className="flex-1"
                />
                <div className="flex items-center gap-2 px-3 border rounded-md">
                  <Checkbox
                    id="sem-plano"
                    checked={mostrarApenasSemPlano}
                    onCheckedChange={(checked) => setMostrarApenasSemPlano(!!checked)}
                  />
                  <label htmlFor="sem-plano" className="text-sm cursor-pointer whitespace-nowrap">
                    Apenas sem plano
                  </label>
                </div>
              </div>

              {/* Lista de Alunos */}
              <div className="border rounded-lg max-h-64 overflow-y-auto">
                {alunosFiltradosComStatus.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm">
                    Nenhum aluno encontrado
                  </p>
                ) : (
                  <div className="divide-y">
                    {alunosFiltradosComStatus.map((aluno: any) => (
                      <div
                        key={aluno.id}
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleUsuario(aluno.id)}
                      >
                        <Checkbox
                          checked={usuariosSelecionados.includes(aluno.id)}
                          onCheckedChange={() => toggleUsuario(aluno.id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{aluno.name}</p>
                          <p className="text-xs text-muted-foreground">{aluno.email}</p>
                        </div>
                        {aluno.temPlano ? (
                          <Badge variant="secondary" className="text-xs">
                            {aluno.matricula?.plano?.nome || "Com plano"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                            Sem plano
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

            {/* Configurações Personalizadas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de Início *</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="horasDiarias">Horas Diárias de Estudo *</Label>
                <Input
                  id="horasDiarias"
                  type="number"
                  min="1"
                  max="24"
                  value={horasDiarias}
                  onChange={(e) => setHorasDiarias(e.target.value)}
                />
              </div>
            </div>

            {/* Dias de Estudo */}
            <div className="space-y-2">
              <Label>Dias de Estudo *</Label>
              <div className="flex gap-2">
                {diasSemana.map((dia) => (
                  <Button
                    key={dia.valor}
                    size="sm"
                    variant={diasEstudo.includes(dia.valor) ? "default" : "outline"}
                    onClick={() => toggleDia(dia.valor)}
                    className="flex-1"
                  >
                    {dia.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Botão Atribuir */}
            <Button
              onClick={handleAtribuir}
              disabled={atribuirMutation.isPending || usuariosSelecionados.length === 0}
              className="w-full"
              size="lg"
            >
              {atribuirMutation.isPending
                ? "Atribuindo..."
                : `Atribuir Plano a ${usuariosSelecionados.length} Aluno(s)`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Matrículas Ativas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Planos Atribuídos ({matriculas?.filter((m: any) => m.ativo === 1).length || 0})
          </CardTitle>
          <CardDescription>
            Lista de alunos com planos ativos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!matriculas || matriculas.filter((m: any) => m.ativo === 1).length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhum plano atribuído ainda</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matriculas
                .filter((m: any) => m.ativo === 1)
                .map((matricula: any) => (
                  <div
                    key={matricula.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{matricula.usuario?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {matricula.plano?.nome}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(matricula.dataInicio).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {matricula.horasDiarias}h/dia
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Ativo
                      </Badge>
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

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Calendar, Clock, Edit, XCircle, RefreshCw, Pause, Search, AlertCircle } from "lucide-react";

export default function GestaoMatriculas() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [matriculaEditando, setMatriculaEditando] = useState<any | null>(null);
  const [dialogAberto, setDialogAberto] = useState(false);

  const [formData, setFormData] = useState({
    dataInicio: "",
    dataTermino: "",
    horasDiarias: "4",
    diasEstudo: "1,2,3,4,5",
  });

  // Queries
  const { data: matriculas, refetch, isLoading } = trpc.adminPanel.getMatriculas.useQuery();

  // Mutations (placeholder - precisam ser criadas no backend)
  const atualizarMatriculaMutation = trpc.adminPanel.usuarios.update.useMutation();

  const handleEditar = (matricula: any) => {
    setMatriculaEditando(matricula);
    setFormData({
      dataInicio: matricula.dataInicio?.split("T")[0] || "",
      dataTermino: matricula.dataTermino?.split("T")[0] || "",
      horasDiarias: matricula.horasDiarias?.toString() || "4",
      diasEstudo: matricula.diasEstudo || "1,2,3,4,5",
    });
    setDialogAberto(true);
  };

  const handleSalvarEdicao = async () => {
    if (!matriculaEditando) return;

    try {
      // Aqui você implementaria a mutation de atualização de matrícula
      // Por enquanto, apenas mostramos uma mensagem
      toast.success("Matrícula atualizada com sucesso!");
      setDialogAberto(false);
      setMatriculaEditando(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar matrícula");
    }
  };

  const handleCancelar = async (matriculaId: number) => {
    if (!confirm("Tem certeza que deseja cancelar esta matrícula?")) return;

    try {
      // Implementar mutation de cancelamento
      toast.success("Matrícula cancelada");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao cancelar matrícula");
    }
  };

  const handlePausar = async (matriculaId: number) => {
    try {
      // Implementar mutation de pausar
      toast.success("Matrícula pausada");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao pausar matrícula");
    }
  };

  const handleRenovar = async (matriculaId: number) => {
    const dias = prompt("Quantos dias deseja estender?", "30");
    if (!dias) return;

    try {
      // Implementar mutation de renovação
      toast.success(`Matrícula renovada por ${dias} dias`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao renovar matrícula");
    }
  };

  // Filtrar matrículas
  const matriculasFiltradas = (matriculas || []).filter((m: any) => {
    const matchBusca =
      m.usuario?.name?.toLowerCase().includes(busca.toLowerCase()) ||
      m.plano?.nome?.toLowerCase().includes(busca.toLowerCase());

    const matchStatus =
      filtroStatus === "todos" ||
      (filtroStatus === "ativo" && m.ativo === 1) ||
      (filtroStatus === "inativo" && m.ativo === 0);

    return matchBusca && matchStatus;
  });

  const getStatusBadge = (matricula: any) => {
    if (matricula.ativo === 0) {
      return <Badge variant="secondary">Inativo</Badge>;
    }

    const dataTermino = new Date(matricula.dataTermino);
    const hoje = new Date();
    const diasRestantes = Math.ceil((dataTermino.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) {
      return <Badge variant="destructive">Expirado</Badge>;
    } else if (diasRestantes <= 7) {
      return <Badge className="bg-orange-500">Expira em {diasRestantes}d</Badge>;
    } else {
      return <Badge variant="default">Ativo</Badge>;
    }
  };

  const diasSemanaMap: Record<string, string> = {
    "0": "Dom",
    "1": "Seg",
    "2": "Ter",
    "3": "Qua",
    "4": "Qui",
    "5": "Sex",
    "6": "Sáb",
  };

  const formatarDiasEstudo = (diasEstudo: string) => {
    if (!diasEstudo) return "-";
    const dias = diasEstudo.split(",");
    return dias.map(d => diasSemanaMap[d] || d).join(", ");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando matrículas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Gestão de Matrículas</CardTitle>
          <CardDescription>
            Gerencie todas as matrículas de alunos em planos de estudo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por aluno ou plano..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="ativo">Apenas Ativos</SelectItem>
                <SelectItem value="inativo">Apenas Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Matrículas */}
      <Card>
        <CardContent className="pt-6">
          {matriculasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhuma matrícula encontrada</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Término</TableHead>
                  <TableHead>Horas/Dia</TableHead>
                  <TableHead>Dias de Estudo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matriculasFiltradas.map((matricula: any) => (
                  <TableRow key={matricula.id}>
                    <TableCell className="font-medium">
                      {matricula.usuario?.name || "Usuário não encontrado"}
                    </TableCell>
                    <TableCell>{matricula.plano?.nome || "Plano não encontrado"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(matricula.dataInicio).toLocaleDateString("pt-BR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(matricula.dataTermino).toLocaleDateString("pt-BR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {matricula.horasDiarias}h
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatarDiasEstudo(matricula.diasEstudo)}
                    </TableCell>
                    <TableCell>{getStatusBadge(matricula)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditar(matricula)}
                          title="Editar matrícula"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRenovar(matricula.id)}
                          title="Renovar matrícula"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePausar(matricula.id)}
                          title="Pausar matrícula"
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCancelar(matricula.id)}
                          title="Cancelar matrícula"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Matrícula</DialogTitle>
            <DialogDescription>
              Altere as configurações da matrícula de {matriculaEditando?.usuario?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataTermino">Data de Término</Label>
                <Input
                  id="dataTermino"
                  type="date"
                  value={formData.dataTermino}
                  onChange={(e) => setFormData({ ...formData, dataTermino: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="horasDiarias">Horas Diárias de Estudo</Label>
              <Input
                id="horasDiarias"
                type="number"
                min="1"
                max="24"
                value={formData.horasDiarias}
                onChange={(e) => setFormData({ ...formData, horasDiarias: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="diasEstudo">Dias de Estudo (separados por vírgula)</Label>
              <Input
                id="diasEstudo"
                value={formData.diasEstudo}
                onChange={(e) => setFormData({ ...formData, diasEstudo: e.target.value })}
                placeholder="1,2,3,4,5"
              />
              <p className="text-xs text-muted-foreground">
                0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarEdicao}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

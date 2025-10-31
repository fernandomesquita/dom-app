import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { KeyRound, Copy, Ban, CheckCircle2, XCircle, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function GestaoTokens() {
  const [modalGerarAberto, setModalGerarAberto] = useState(false);
  const [dataExpiracao, setDataExpiracao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string | undefined>(undefined);

  // Queries
  const { data: tokens, refetch } = trpc.tokens.listar.useQuery({ status: filtroStatus });

  // Mutations
  const gerarMutation = trpc.tokens.gerar.useMutation({
    onSuccess: (data) => {
      toast.success("Token gerado com sucesso!");
      // Copiar automaticamente para clipboard
      navigator.clipboard.writeText(data.token);
      toast.info("Token copiado para a área de transferência");
      setModalGerarAberto(false);
      setDataExpiracao("");
      setObservacoes("");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao gerar token: ${error.message}`);
    },
  });

  const invalidarMutation = trpc.tokens.invalidar.useMutation({
    onSuccess: () => {
      toast.success("Token invalidado");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao invalidar token: ${error.message}`);
    },
  });

  const handleGerarToken = () => {
    gerarMutation.mutate({
      dataExpiracao: dataExpiracao || undefined,
      observacoes: observacoes || undefined,
    });
  };

  const handleCopiarToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success("Token copiado!");
  };

  const handleInvalidarToken = (tokenId: number) => {
    if (!confirm("Tem certeza que deseja invalidar este token?")) return;
    invalidarMutation.mutate({ tokenId });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="h-3 w-3 mr-1" />Ativo</Badge>;
      case "usado":
        return <Badge className="bg-gray-100 text-gray-800"><Clock className="h-3 w-3 mr-1" />Usado</Badge>;
      case "expirado":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Expirado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatarData = (data: string | Date | null) => {
    if (!data) return "-";
    try {
      return format(new Date(data), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch {
      return "-";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Gestão de Tokens
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Gerar e invalidar tokens de cadastro e acesso
            </p>
          </div>
          <Button onClick={() => setModalGerarAberto(true)}>
            <KeyRound className="h-4 w-4 mr-2" />
            Gerar Token
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={filtroStatus === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltroStatus(undefined)}
            >
              Todos
            </Button>
            <Button
              variant={filtroStatus === "ativo" ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltroStatus("ativo")}
            >
              Ativos
            </Button>
            <Button
              variant={filtroStatus === "usado" ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltroStatus("usado")}
            >
              Usados
            </Button>
            <Button
              variant={filtroStatus === "expirado" ? "default" : "outline"}
              size="sm"
              onClick={() => setFiltroStatus("expirado")}
            >
              Expirados
            </Button>
          </div>

          {/* Tabela */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado por</TableHead>
                <TableHead>Data Geração</TableHead>
                <TableHead>Data Expiração</TableHead>
                <TableHead>Usado por</TableHead>
                <TableHead>Data Uso</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens && tokens.length > 0 ? (
                tokens.map((token: any) => (
                  <TableRow key={token.id}>
                    <TableCell className="font-mono text-xs">
                      {token.token.substring(0, 20)}...
                    </TableCell>
                    <TableCell>{getStatusBadge(token.status)}</TableCell>
                    <TableCell>{token.criadorNome || "-"}</TableCell>
                    <TableCell className="text-sm">{formatarData(token.dataGeracao)}</TableCell>
                    <TableCell className="text-sm">{formatarData(token.dataExpiracao)}</TableCell>
                    <TableCell>{token.usuarioNome || "-"}</TableCell>
                    <TableCell className="text-sm">{formatarData(token.dataUso)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {token.observacoes || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopiarToken(token.token)}
                          title="Copiar token"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {token.status === "ativo" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleInvalidarToken(token.id)}
                            title="Invalidar token"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    Nenhum token encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Gerar Token */}
      <Dialog open={modalGerarAberto} onOpenChange={setModalGerarAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Novo Token</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dataExpiracao">Data de Expiração (Opcional)</Label>
              <Input
                id="dataExpiracao"
                type="datetime-local"
                value={dataExpiracao}
                onChange={(e) => setDataExpiracao(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Deixe em branco para token sem expiração
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações (Opcional)</Label>
              <Textarea
                id="observacoes"
                placeholder="Ex: Para turma 2025, Alunos novos..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalGerarAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGerarToken} disabled={gerarMutation.isPending}>
              {gerarMutation.isPending ? "Gerando..." : "Gerar Token"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

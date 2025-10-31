import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { gerarTemplateAlunos, parseArquivoAlunos, AlunoImportacao } from "@/utils/templateAlunos";

interface ImportarAlunosProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function ImportarAlunos({ open, onOpenChange, onSuccess }: ImportarAlunosProps) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [alunosPreview, setAlunosPreview] = useState<AlunoImportacao[]>([]);
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [etapa, setEtapa] = useState<"upload" | "preview" | "resultado">("upload");

  const importarMutation = trpc.adminPanel.usuarios.importarCSV.useMutation();

  const handleDownloadTemplate = () => {
    try {
      gerarTemplateAlunos();
      toast.success("Template baixado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar template");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar extensão
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error("Formato inválido. Use arquivos Excel (.xlsx, .xls) ou CSV");
      return;
    }

    setArquivo(file);

    try {
      const alunos = await parseArquivoAlunos(file);
      
      if (alunos.length === 0) {
        toast.error("Nenhum aluno encontrado na planilha");
        return;
      }

      setAlunosPreview(alunos);
      setEtapa("preview");
      toast.success(`${alunos.length} aluno(s) encontrado(s)`);
    } catch (error: any) {
      toast.error(error.message || "Erro ao processar arquivo");
      setArquivo(null);
    }
  };

  const handleImportar = async () => {
    if (alunosPreview.length === 0) {
      toast.error("Nenhum aluno para importar");
      return;
    }

    setImportando(true);

    try {
      // Preparar dados para envio
      const dados = alunosPreview.map(aluno => {
        // Montar endereço JSON se houver dados de endereço
        let endereco = undefined;
        if (aluno.rua || aluno.cidade) {
          endereco = JSON.stringify({
            rua: aluno.rua || "",
            numero: aluno.numero || "",
            complemento: aluno.complemento || "",
            bairro: aluno.bairro || "",
            cidade: aluno.cidade || "",
            estado: aluno.estado || "",
            cep: aluno.cep || "",
          });
        }

        return {
          nome: aluno.nome,
          email: aluno.email,
          cpf: aluno.cpf,
          telefone: aluno.telefone,
          dataNascimento: aluno.dataNascimento,
          endereco,
          role: aluno.role || "aluno",
        };
      });

      const resultado = await importarMutation.mutateAsync({ dados });
      
      setResultado(resultado);
      setEtapa("resultado");

      if (resultado.sucesso > 0) {
        toast.success(`${resultado.sucesso} aluno(s) importado(s) com sucesso!`);
        onSuccess();
      }

      if (resultado.erros.length > 0) {
        toast.warning(`${resultado.erros.length} erro(s) encontrado(s)`);
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao importar alunos");
    } finally {
      setImportando(false);
    }
  };

  const handleFechar = () => {
    setArquivo(null);
    setAlunosPreview([]);
    setResultado(null);
    setEtapa("upload");
    onOpenChange(false);
  };

  const handleNovaImportacao = () => {
    setArquivo(null);
    setAlunosPreview([]);
    setResultado(null);
    setEtapa("upload");
  };

  return (
    <Dialog open={open} onOpenChange={handleFechar}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Alunos em Lote</DialogTitle>
          <DialogDescription>
            Importe múltiplos alunos de uma planilha Excel ou CSV
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* ETAPA 1: Upload */}
          {etapa === "upload" && (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Baixe o template, preencha com os dados dos alunos e faça upload do arquivo.
                  Campos obrigatórios: Nome e Email.
                </AlertDescription>
              </Alert>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4">
                    <FileSpreadsheet className="w-16 h-16 text-muted-foreground" />
                    
                    <Button onClick={handleDownloadTemplate} variant="outline" size="lg">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Template Excel
                    </Button>

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Ou faça upload de um arquivo já preenchido
                      </p>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                          <Upload className="w-4 h-4" />
                          Escolher Arquivo
                        </div>
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    {arquivo && (
                      <p className="text-sm text-muted-foreground">
                        Arquivo selecionado: <strong>{arquivo.name}</strong>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* ETAPA 2: Preview */}
          {etapa === "preview" && (
            <>
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{alunosPreview.length} aluno(s)</strong> encontrado(s). 
                  Revise os dados antes de importar.
                </AlertDescription>
              </Alert>

              <div className="border rounded-lg max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Perfil</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alunosPreview.map((aluno, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{aluno.nome}</TableCell>
                        <TableCell>{aluno.email}</TableCell>
                        <TableCell>{aluno.cpf || "-"}</TableCell>
                        <TableCell>{aluno.telefone || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {aluno.role || "aluno"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleNovaImportacao}>
                  Cancelar
                </Button>
                <Button onClick={handleImportar} disabled={importando}>
                  {importando ? "Importando..." : `Importar ${alunosPreview.length} Aluno(s)`}
                </Button>
              </div>

              {importando && (
                <div className="space-y-2">
                  <Progress value={50} />
                  <p className="text-sm text-center text-muted-foreground">
                    Importando alunos...
                  </p>
                </div>
              )}
            </>
          )}

          {/* ETAPA 3: Resultado */}
          {etapa === "resultado" && resultado && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{resultado.sucesso}</p>
                        <p className="text-sm text-muted-foreground">Importados com Sucesso</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <XCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">{resultado.erros.length}</p>
                        <p className="text-sm text-muted-foreground">Erros Encontrados</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {resultado.erros.length > 0 && (
                <>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Alguns alunos não puderam ser importados. Veja os detalhes abaixo.
                    </AlertDescription>
                  </Alert>

                  <div className="border rounded-lg max-h-64 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Linha</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Erro</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resultado.erros.map((erro: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{erro.linha}</TableCell>
                            <TableCell>{erro.dados.nome}</TableCell>
                            <TableCell>{erro.dados.email}</TableCell>
                            <TableCell className="text-red-600 text-sm">
                              {erro.erro}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleNovaImportacao}>
                  Nova Importação
                </Button>
                <Button onClick={handleFechar}>
                  Fechar
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

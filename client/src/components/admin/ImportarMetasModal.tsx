import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Loader2,
} from "lucide-react";
import { parsearPlanilhaMetas, MetaImportada, gerarTemplateMetasExcel } from "@/utils/templateMetas";

interface ImportarMetasModalProps {
  aberto: boolean;
  onFechar: () => void;
  onImportar: (metas: Partial<any>[]) => Promise<void>;
  planoId: number;
  nomePlano: string;
}

type EstadoImportacao = "selecionar" | "validando" | "preview" | "importando" | "concluido";

export default function ImportarMetasModal({
  aberto,
  onFechar,
  onImportar,
  planoId,
  nomePlano,
}: ImportarMetasModalProps) {
  const [estado, setEstado] = useState<EstadoImportacao>("selecionar");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [metasParsed, setMetasParsed] = useState<MetaImportada[]>([]);
  const [progresso, setProgresso] = useState(0);

  const handleBaixarTemplate = () => {
    try {
      gerarTemplateMetasExcel(nomePlano);
      toast.success("Template baixado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar template");
      console.error(error);
    }
  };

  const handleSelecionarArquivo = async (file: File) => {
    setArquivo(file);
    setEstado("validando");
    setProgresso(0);

    try {
      // Simular progresso
      const interval = setInterval(() => {
        setProgresso((prev) => Math.min(prev + 10, 90));
      }, 100);

      const metas = await parsearPlanilhaMetas(file);
      
      clearInterval(interval);
      setProgresso(100);

      setMetasParsed(metas);
      setEstado("preview");
    } catch (error: any) {
      toast.error(error.message || "Erro ao processar arquivo");
      setEstado("selecionar");
      setArquivo(null);
    }
  };

  const handleConfirmarImportacao = async () => {
    // Filtrar apenas metas sem erros
    const metasValidas = metasParsed.filter((m) => m.erros.length === 0);

    if (metasValidas.length === 0) {
      toast.error("Nenhuma meta válida para importar");
      return;
    }

    setEstado("importando");
    setProgresso(0);

    try {
      // Converter para formato do backend
      const metasParaImportar = metasValidas.map((meta, index) => ({
        planoId,
        disciplina: meta.disciplina,
        assunto: meta.assunto,
        tipo: meta.tipo,
        duracao: meta.duracao,
        incidencia: meta.incidencia,
        prioridade: meta.prioridade,
        ordem: index + 1,
        dicaEstudo: meta.dicaEstudo,
        cor: meta.cor,
      }));

      // Simular progresso
      const interval = setInterval(() => {
        setProgresso((prev) => Math.min(prev + 5, 90));
      }, 200);

      await onImportar(metasParaImportar);

      clearInterval(interval);
      setProgresso(100);

      setEstado("concluido");
      
      setTimeout(() => {
        onFechar();
        resetar();
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Erro ao importar metas");
      setEstado("preview");
    }
  };

  const resetar = () => {
    setEstado("selecionar");
    setArquivo(null);
    setMetasParsed([]);
    setProgresso(0);
  };

  const handleVoltar = () => {
    setEstado("selecionar");
    setArquivo(null);
    setMetasParsed([]);
  };

  const metasValidas = metasParsed.filter((m) => m.erros.length === 0);
  const metasComErro = metasParsed.filter((m) => m.erros.length > 0);

  return (
    <Dialog
      open={aberto}
      onOpenChange={(open) => {
        if (!open) {
          onFechar();
          resetar();
        }
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Metas via Planilha</DialogTitle>
          <DialogDescription>
            Importe múltiplas metas de uma vez usando uma planilha Excel
          </DialogDescription>
        </DialogHeader>

        {/* ESTADO: SELECIONAR ARQUIVO */}
        {estado === "selecionar" && (
          <div className="space-y-6">
            <Alert>
              <FileSpreadsheet className="w-4 h-4" />
              <AlertDescription>
                <strong>Passo 1:</strong> Baixe o template Excel
                <br />
                <strong>Passo 2:</strong> Preencha com suas metas
                <br />
                <strong>Passo 3:</strong> Faça upload do arquivo preenchido
              </AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <Button onClick={handleBaixarTemplate} size="lg" variant="outline">
                <Download className="w-5 h-5 mr-2" />
                Baixar Template Excel
              </Button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleSelecionarArquivo(file);
                }}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                <Upload className="w-16 h-16 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Clique para selecionar arquivo
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ou arraste e solte aqui
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Formatos aceitos: .xlsx, .xls
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* ESTADO: VALIDANDO */}
        {estado === "validando" && (
          <div className="space-y-6 py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">
                  Validando arquivo...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {arquivo?.name}
                </p>
              </div>
              <Progress value={progresso} className="w-64" />
            </div>
          </div>
        )}

        {/* ESTADO: PREVIEW */}
        {estado === "preview" && (
          <div className="space-y-4">
            {/* Resumo */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {metasValidas.length}
                    </p>
                    <p className="text-sm text-gray-600">Metas Válidas</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {metasComErro.length}
                    </p>
                    <p className="text-sm text-gray-600">Com Erros</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {metasParsed.length}
                    </p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertas */}
            {metasComErro.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  {metasComErro.length} meta(s) com erro(s) não serão importadas.
                  Corrija os erros na planilha e tente novamente.
                </AlertDescription>
              </Alert>
            )}

            {metasValidas.length > 0 && (
              <Alert>
                <CheckCircle2 className="w-4 h-4" />
                <AlertDescription>
                  {metasValidas.length} meta(s) pronta(s) para importação.
                </AlertDescription>
              </Alert>
            )}

            {/* Lista de Metas */}
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="p-2 text-left">Linha</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Disciplina</th>
                    <th className="p-2 text-left">Assunto</th>
                    <th className="p-2 text-left">Tipo</th>
                    <th className="p-2 text-left">Duração</th>
                  </tr>
                </thead>
                <tbody>
                  {metasParsed.map((meta) => (
                    <tr
                      key={meta.linha}
                      className={`border-b ${
                        meta.erros.length > 0 ? "bg-red-50" : "bg-white"
                      }`}
                    >
                      <td className="p-2">{meta.linha}</td>
                      <td className="p-2">
                        {meta.erros.length === 0 ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </td>
                      <td className="p-2">{meta.disciplina || "-"}</td>
                      <td className="p-2 max-w-xs truncate">
                        {meta.assunto || "-"}
                      </td>
                      <td className="p-2">
                        <Badge
                          variant={
                            meta.tipo === "estudo"
                              ? "default"
                              : meta.tipo === "revisao"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {meta.tipo}
                        </Badge>
                      </td>
                      <td className="p-2">{meta.duracao} min</td>
                    </tr>
                  ))}
                  {metasParsed.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        Nenhuma meta encontrada no arquivo
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Erros Detalhados */}
            {metasComErro.length > 0 && (
              <details className="border rounded-lg p-4">
                <summary className="cursor-pointer font-medium text-red-600">
                  Ver erros detalhados ({metasComErro.length})
                </summary>
                <div className="mt-4 space-y-2">
                  {metasComErro.map((meta) => (
                    <div key={meta.linha} className="text-sm">
                      <strong>Linha {meta.linha}:</strong>
                      <ul className="list-disc list-inside ml-4 text-red-600">
                        {meta.erros.map((erro, i) => (
                          <li key={i}>{erro}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* ESTADO: IMPORTANDO */}
        {estado === "importando" && (
          <div className="space-y-6 py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">
                  Importando metas...
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {metasValidas.length} metas sendo processadas
                </p>
              </div>
              <Progress value={progresso} className="w-64" />
            </div>
          </div>
        )}

        {/* ESTADO: CONCLUÍDO */}
        {estado === "concluido" && (
          <div className="space-y-6 py-12">
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700">
                  Importação concluída!
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {metasValidas.length} metas importadas com sucesso
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {estado === "selecionar" && (
            <Button variant="outline" onClick={onFechar}>
              Cancelar
            </Button>
          )}

          {estado === "preview" && (
            <>
              <Button variant="outline" onClick={handleVoltar}>
                Voltar
              </Button>
              <Button
                onClick={handleConfirmarImportacao}
                disabled={metasValidas.length === 0}
              >
                Importar {metasValidas.length} Meta(s)
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

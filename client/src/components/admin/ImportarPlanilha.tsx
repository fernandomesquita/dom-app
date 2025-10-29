import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import * as XLSX from 'xlsx';

interface ImportarPlanilhaProps {
  aberto: boolean;
  onFechar: () => void;
  onSucesso?: () => void;
}

interface MetaDaPlanilha {
  disciplina: string;
  assunto: string;
  tipo: "estudo" | "revisao" | "questoes";
  duracao: number;
  incidencia: "alta" | "media" | "baixa" | null;
  ordem: number;
}

interface ResultadoImportacao {
  sucesso: number;
  erros: number;
  detalhes: string[];
}

export default function ImportarPlanilha({ aberto, onFechar, onSucesso }: ImportarPlanilhaProps) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [metasPreview, setMetasPreview] = useState<MetaDaPlanilha[]>([]);
  const [nomePlano, setNomePlano] = useState("");
  const [descricaoPlano, setDescricaoPlano] = useState("");
  const [etapa, setEtapa] = useState<"upload" | "preview" | "resultado">("upload");
  const [resultado, setResultado] = useState<ResultadoImportacao | null>(null);

  const importarMutation = trpc.planos.importarPlanilha.useMutation({
    onSuccess: (result: any) => {
      setResultado({
        sucesso: result.sucesso || 0,
        erros: result.erros || 0,
        detalhes: result.detalhes || [],
      });
      setEtapa("resultado");
      toast.success(`Plano importado com sucesso! ${result.sucesso} metas criadas.`);
      onSucesso?.();
    },
    onError: (error: any) => {
      toast.error(`Erro ao importar: ${error.message}`);
    },
  });

  const handleArquivoSelecionado = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error("Por favor, selecione um arquivo Excel (.xlsx ou .xls)");
      return;
    }

    setArquivo(file);

    // Ler e parsear planilha
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validar e mapear dados
      const metas: MetaDaPlanilha[] = [];
      
      for (let i = 0; i < jsonData.length; i++) {
        const row: any = jsonData[i];
        
        // Validar colunas obrigatórias
        if (!row.Disciplina || !row.Assunto || !row.Tipo || !row['Duração (min)']) {
          toast.error(`Linha ${i + 2}: Campos obrigatórios faltando (Disciplina, Assunto, Tipo, Duração)`);
          continue;
        }

        // Validar tipo
        const tipo = row.Tipo.toLowerCase();
        if (!['estudo', 'revisao', 'questoes'].includes(tipo)) {
          toast.error(`Linha ${i + 2}: Tipo inválido. Use: estudo, revisao ou questoes`);
          continue;
        }

        // Validar incidência
        let incidencia: "alta" | "media" | "baixa" | null = null;
        if (row.Incidencia) {
          const inc = row.Incidencia.toLowerCase();
          if (['alta', 'media', 'baixa'].includes(inc)) {
            incidencia = inc as "alta" | "media" | "baixa";
          }
        }

        metas.push({
          disciplina: row.Disciplina,
          assunto: row.Assunto,
          tipo: tipo as "estudo" | "revisao" | "questoes",
          duracao: parseInt(row['Duração (min)']) || 60,
          incidencia,
          ordem: row.Ordem || (i + 1),
        });
      }

      if (metas.length === 0) {
        toast.error("Nenhuma meta válida encontrada na planilha");
        return;
      }

      setMetasPreview(metas);
      setEtapa("preview");
      toast.success(`${metas.length} metas encontradas na planilha`);

    } catch (error) {
      console.error("Erro ao ler planilha:", error);
      toast.error("Erro ao ler planilha. Verifique o formato do arquivo.");
    }
  };

  const handleImportar = () => {
    if (!nomePlano.trim()) {
      toast.error("Nome do plano é obrigatório");
      return;
    }

    if (metasPreview.length === 0) {
      toast.error("Nenhuma meta para importar");
      return;
    }

    importarMutation.mutate({
      dados: {
        nomePlano,
        descricaoPlano: descricaoPlano || `Plano importado com ${metasPreview.length} metas`,
        metas: metasPreview,
      },
    } as any);
  };

  const handleBaixarTemplate = () => {
    // Criar planilha template
    const template = [
      {
        Disciplina: "Direito Constitucional",
        Assunto: "Princípios Fundamentais da República",
        Tipo: "estudo",
        "Duração (min)": 90,
        Incidencia: "alta",
        Ordem: 1,
      },
      {
        Disciplina: "Direito Administrativo",
        Assunto: "Princípios da Administração Pública",
        Tipo: "revisao",
        "Duração (min)": 60,
        Incidencia: "media",
        Ordem: 2,
      },
      {
        Disciplina: "Direito Penal",
        Assunto: "Crimes contra a pessoa",
        Tipo: "questoes",
        "Duração (min)": 45,
        Incidencia: "baixa",
        Ordem: 3,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Metas");
    XLSX.writeFile(workbook, "template_plano_estudos.xlsx");
    toast.success("Template baixado com sucesso!");
  };

  const resetar = () => {
    setArquivo(null);
    setMetasPreview([]);
    setNomePlano("");
    setDescricaoPlano("");
    setEtapa("upload");
    setResultado(null);
  };

  const handleFechar = () => {
    resetar();
    onFechar();
  };

  return (
    <Dialog open={aberto} onOpenChange={handleFechar}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Plano via Planilha</DialogTitle>
          <DialogDescription>
            Faça upload de uma planilha Excel com as metas do plano de estudos
          </DialogDescription>
        </DialogHeader>

        {etapa === "upload" && (
          <div className="space-y-6 py-4">
            {/* Botão de Download do Template */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Baixe o Template</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Use nosso template para garantir que a planilha está no formato correto
                    </p>
                    <Button variant="outline" onClick={handleBaixarTemplate}>
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Template Excel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload de Arquivo */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Selecione o Arquivo</h3>
              
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <Label htmlFor="arquivo" className="cursor-pointer">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Clique para selecionar
                  </span>
                  <span className="text-sm text-muted-foreground"> ou arraste o arquivo aqui</span>
                </Label>
                <Input
                  id="arquivo"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleArquivoSelecionado}
                  className="hidden"
                />
                {arquivo && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {arquivo.name}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <h4 className="font-semibold mb-2">Formato da Planilha:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>Disciplina</strong>: Nome da disciplina (obrigatório)</li>
                  <li>• <strong>Assunto</strong>: Assunto específico (obrigatório)</li>
                  <li>• <strong>Tipo</strong>: estudo, revisao ou questoes (obrigatório)</li>
                  <li>• <strong>Duração (min)</strong>: Tempo em minutos (obrigatório)</li>
                  <li>• <strong>Incidencia</strong>: alta, media ou baixa (opcional)</li>
                  <li>• <strong>Ordem</strong>: Número da ordem (opcional)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {etapa === "preview" && (
          <div className="space-y-6 py-4">
            {/* Informações do Plano */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Informações do Plano</h3>
              
              <div className="space-y-2">
                <Label htmlFor="nomePlano">Nome do Plano *</Label>
                <Input
                  id="nomePlano"
                  placeholder="Ex: Preparação OAB 2025"
                  value={nomePlano}
                  onChange={(e) => setNomePlano(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricaoPlano">Descrição (opcional)</Label>
                <Input
                  id="descricaoPlano"
                  placeholder="Descreva o objetivo do plano..."
                  value={descricaoPlano}
                  onChange={(e) => setDescricaoPlano(e.target.value)}
                />
              </div>
            </div>

            {/* Preview das Metas */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                Preview das Metas ({metasPreview.length})
              </h3>

              <div className="max-h-96 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left p-2 font-semibold">#</th>
                      <th className="text-left p-2 font-semibold">Disciplina</th>
                      <th className="text-left p-2 font-semibold">Assunto</th>
                      <th className="text-left p-2 font-semibold">Tipo</th>
                      <th className="text-left p-2 font-semibold">Duração</th>
                      <th className="text-left p-2 font-semibold">Inc.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metasPreview.map((meta, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="p-2">{meta.ordem}</td>
                        <td className="p-2">{meta.disciplina}</td>
                        <td className="p-2">{meta.assunto}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            meta.tipo === 'estudo' ? 'bg-blue-100 text-blue-800' :
                            meta.tipo === 'revisao' ? 'bg-amber-100 text-amber-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {meta.tipo}
                          </span>
                        </td>
                        <td className="p-2">{meta.duracao} min</td>
                        <td className="p-2">
                          {meta.incidencia === 'alta' && '🔴'}
                          {meta.incidencia === 'media' && '🟡'}
                          {meta.incidencia === 'baixa' && '🟢'}
                          {!meta.incidencia && '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {etapa === "resultado" && resultado && (
          <div className="space-y-6 py-4">
            <Card className={resultado.erros === 0 ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {resultado.erros === 0 ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-yellow-600" />
                  )}
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Importação Concluída</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-green-600 font-semibold">
                        ✓ {resultado.sucesso} metas importadas com sucesso
                      </p>
                      {resultado.erros > 0 && (
                        <p className="text-red-600 font-semibold">
                          ✗ {resultado.erros} erros encontrados
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {resultado.detalhes.length > 0 && (
                  <div className="mt-4 p-3 bg-white rounded border">
                    <h5 className="font-semibold text-sm mb-2">Detalhes:</h5>
                    <ul className="text-xs space-y-1 max-h-40 overflow-y-auto">
                      {resultado.detalhes.map((detalhe, i) => (
                        <li key={i} className="text-muted-foreground">{detalhe}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          {etapa === "upload" && (
            <Button variant="outline" onClick={handleFechar}>
              Cancelar
            </Button>
          )}
          
          {etapa === "preview" && (
            <>
              <Button variant="outline" onClick={() => setEtapa("upload")}>
                Voltar
              </Button>
              <Button 
                onClick={handleImportar}
                disabled={importarMutation.isPending}
              >
                {importarMutation.isPending ? "Importando..." : `Importar ${metasPreview.length} Metas`}
              </Button>
            </>
          )}

          {etapa === "resultado" && (
            <Button onClick={handleFechar}>
              Fechar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, TrendingDown, TrendingUp, Users } from "lucide-react";

interface EngajamentoModalProps {
  planoId: number;
  planoNome: string;
  open: boolean;
  onClose: () => void;
}

export default function EngajamentoModal({ planoId, planoNome, open, onClose }: EngajamentoModalProps) {
  const { data: engajamento, isLoading } = trpc.planos.admin.engajamento.useQuery(
    { planoId },
    { enabled: open }
  );

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Índice de Engajamento</DialogTitle>
            <DialogDescription>Carregando dados...</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (!engajamento || engajamento.totalAlunos === 0) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Índice de Engajamento - {planoNome}</DialogTitle>
            <DialogDescription>
              Nenhum aluno matriculado neste plano ainda.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  // Preparar dados para o gráfico
  const chartData = engajamento.progressoPorMeta.map((meta: any) => ({
    nome: `Meta ${meta.posicao}`,
    taxa: meta.taxaConclusao,
    alunos: meta.alunosConcluiram,
    isMaiorAbandono: engajamento.metaMaiorAbandono?.metaId === meta.metaId,
  }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">📊 Índice de Engajamento - {planoNome}</DialogTitle>
          <DialogDescription>
            Análise de onde os alunos estão abandonando o plano
          </DialogDescription>
        </DialogHeader>

        {/* Métricas Gerais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Total de Alunos</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{engajamento.totalAlunos}</div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Progresso Médio</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{engajamento.progressoMedio}%</div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Taxa de Conclusão</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">{engajamento.taxaConclusaoGeral}%</div>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">Taxa de Retorno</span>
            </div>
            <div className="text-2xl font-bold text-orange-700">{engajamento.taxaRetornoDiario}%</div>
          </div>
        </div>

        {/* Alerta de Maior Abandono */}
        {engajamento.metaMaiorAbandono && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Ponto de Maior Abandono</h4>
              <p className="text-sm text-red-700">
                <strong>Meta {engajamento.metaMaiorAbandono.posicao}:</strong>{" "}
                {engajamento.metaMaiorAbandono.metaNome}
              </p>
              <p className="text-sm text-red-600 mt-1">
                Queda de <strong>{engajamento.metaMaiorAbandono.quedaTaxa}%</strong> na taxa de conclusão.
                Apenas <strong>{engajamento.metaMaiorAbandono.alunosConcluiram}</strong> de{" "}
                <strong>{engajamento.totalAlunos}</strong> alunos concluíram esta meta.
              </p>
            </div>
          </div>
        )}

        {/* Gráfico de Taxa de Conclusão por Meta */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Taxa de Conclusão por Meta</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis label={{ value: 'Taxa de Conclusão (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded shadow-lg">
                        <p className="font-semibold">{data.nome}</p>
                        <p className="text-sm text-gray-600">
                          Taxa: <strong>{data.taxa}%</strong>
                        </p>
                        <p className="text-sm text-gray-600">
                          Alunos: <strong>{data.alunos}/{engajamento.totalAlunos}</strong>
                        </p>
                        {data.isMaiorAbandono && (
                          <p className="text-xs text-red-600 mt-1">⚠️ Maior abandono</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="taxa" name="Taxa de Conclusão (%)">
                {chartData.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isMaiorAbandono ? "#ef4444" : "#3b82f6"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabela Detalhada */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Detalhamento por Meta</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Meta</th>
                  <th className="p-2 text-center">Alunos Concluíram</th>
                  <th className="p-2 text-center">Taxa de Conclusão</th>
                  <th className="p-2 text-center">Taxa de Retorno</th>
                </tr>
              </thead>
              <tbody>
                {engajamento.progressoPorMeta.map((meta: any) => (
                  <tr 
                    key={meta.metaId}
                    className={meta.metaId === engajamento.metaMaiorAbandono?.metaId ? "bg-red-50" : ""}
                  >
                    <td className="p-2 font-medium">{meta.posicao}</td>
                    <td className="p-2">{meta.metaNome}</td>
                    <td className="p-2 text-center">
                      {meta.alunosConcluiram} / {meta.totalAlunos}
                    </td>
                    <td className="p-2 text-center">
                      <span className={`font-semibold ${meta.taxaConclusao < 50 ? 'text-red-600' : 'text-green-600'}`}>
                        {meta.taxaConclusao}%
                      </span>
                    </td>
                    <td className="p-2 text-center">{meta.taxaRetorno}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

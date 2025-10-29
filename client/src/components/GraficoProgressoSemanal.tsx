import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";

interface DadosProgresso {
  dia: string;
  metas: number;
  horas: number;
}

interface Props {
  dados: DadosProgresso[];
}

export default function GraficoProgressoSemanal({ dados }: Props) {
  // Formatar dia para exibição (ex: "2025-01-15" -> "15/01")
  const dadosFormatados = dados.map(item => ({
    ...item,
    diaFormatado: new Date(item.dia).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
  }));

  // Calcular totais
  const totalMetas = dados.reduce((acc, item) => acc + item.metas, 0);
  const totalHoras = dados.reduce((acc, item) => acc + item.horas, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Seu Progresso Esta Semana</CardTitle>
            <CardDescription>
              Acompanhe seu desempenho nos últimos 7 dias
            </CardDescription>
          </div>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Resumo */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Média diária de estudo</p>
            <p className="text-2xl font-bold text-blue-600">
              {(totalHoras / 7).toFixed(1)}h / dia
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Metas concluídas</p>
            <p className="text-2xl font-bold text-green-600">
              {totalMetas}
            </p>
          </div>
        </div>

        {/* Gráfico */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dadosFormatados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="diaFormatado" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              label={{ value: 'Horas', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              label={{ value: 'Metas', angle: 90, position: 'insideRight' }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="horas" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Horas Estudadas"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="metas" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Metas Concluídas"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Mensagem motivacional */}
        {totalMetas === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Comece a estudar para ver seu progresso aqui! 📚
          </p>
        )}
        {totalMetas > 0 && totalMetas < 5 && (
          <p className="text-center text-sm text-green-600 mt-4">
            Bom começo! Continue assim! 💪
          </p>
        )}
        {totalMetas >= 5 && (
          <p className="text-center text-sm text-green-600 mt-4">
            Excelente trabalho! Você está arrasando! 🔥
          </p>
        )}
      </CardContent>
    </Card>
  );
}

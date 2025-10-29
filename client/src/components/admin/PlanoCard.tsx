import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Calendar, Clock, Edit, Eye, Trash2, ToggleLeft, ToggleRight, User, BarChart3 } from "lucide-react";
import EngajamentoModal from "./EngajamentoModal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PlanoCardProps {
  plano: {
    id: number;
    nome: string;
    orgao: string;
    cargo: string;
    tipo: "pago" | "gratuito";
    ativo: boolean;
    duracao: number;
    horasDiarias: number;
    createdAt: string;
  };
  onEditar: () => void;
  onMetas: () => void;
  onExcluir: () => void;
  onToggleAtivo: () => void;
}

export default function PlanoCard({ plano, onEditar, onMetas, onExcluir, onToggleAtivo }: PlanoCardProps) {
  const [showEngajamento, setShowEngajamento] = useState(false);
  const [stats, setStats] = useState<{
    totalAlunos: number;
    totalMetas: number;
    criadorNome?: string;
  }>({
    totalAlunos: 0,
    totalMetas: 0,
  });

  const { data: estatisticas } = trpc.planos.admin.getComEstatisticas.useQuery(
    { id: plano.id },
    { enabled: !!plano.id }
  );

  useEffect(() => {
    if (estatisticas) {
      setStats({
        totalAlunos: estatisticas.totalAlunos || 0,
        totalMetas: estatisticas.totalMetas || 0,
        criadorNome: estatisticas.criadorNome || undefined,
      });
    }
  }, [estatisticas]);

  const formatarData = (data: string) => {
    try {
      return format(new Date(data), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return "Data inválida";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">{plano.nome}</h3>
              <Badge variant={plano.tipo === "pago" ? "default" : "secondary"}>
                {plano.tipo}
              </Badge>
              <button
                onClick={onToggleAtivo}
                className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
              >
                {plano.ativo ? (
                  <ToggleRight className="h-6 w-6 text-green-600" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-muted-foreground text-sm">
              {plano.orgao && plano.cargo ? `${plano.orgao} - ${plano.cargo}` : "Sem órgão/cargo definido"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{stats.totalAlunos}</p>
              <p className="text-xs text-muted-foreground">Alunos</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-2xl font-bold">{stats.totalMetas}</p>
              <p className="text-xs text-muted-foreground">Metas</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Duração:
            </span>
            <span className="font-semibold">{plano.duracao} dias</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horas/dia:
            </span>
            <span className="font-semibold">{plano.horasDiarias}h</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Criado em:
            </span>
            <span className="font-semibold">{formatarData(plano.createdAt)}</span>
          </div>

          {stats.criadorNome && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Criado por:
              </span>
              <span className="font-semibold">{stats.criadorNome}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onEditar}>
            <Edit className="h-3 w-3 mr-1" />
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={onMetas}>
            <Eye className="h-3 w-3 mr-1" />
            Metas
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowEngajamento(true)}>
            <BarChart3 className="h-3 w-3 mr-1" />
            Engajamento
          </Button>
          <Button variant="outline" size="sm" onClick={onExcluir} className="ml-auto">
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>

        <EngajamentoModal
          planoId={plano.id}
          planoNome={plano.nome}
          open={showEngajamento}
          onClose={() => setShowEngajamento(false)}
        />
      </CardContent>
    </Card>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, User, Mail, CheckCircle2, XCircle } from "lucide-react";

interface AlunosPlanoModalProps {
  aberto: boolean;
  onFechar: () => void;
  planoId: number;
  nomePlano: string;
}

export default function AlunosPlanoModal({
  aberto,
  onFechar,
  planoId,
  nomePlano,
}: AlunosPlanoModalProps) {
  const { data: alunos = [], isLoading } = trpc.planos.admin.listarAlunos.useQuery(
    { planoId },
    { enabled: aberto }
  );

  const formatarData = (data: Date | string | null) => {
    if (!data) return "Não definida";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const getIniciais = (nome: string) => {
    const partes = nome.split(" ");
    if (partes.length >= 2) {
      return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  };

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Alunos Matriculados - {nomePlano}
          </DialogTitle>
          <p className="text-sm text-gray-600">
            {alunos.length} {alunos.length === 1 ? "aluno matriculado" : "alunos matriculados"}
          </p>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : alunos.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum aluno matriculado neste plano</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alunos.map((aluno: any) => (
              <div
                key={aluno.matriculaId}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={aluno.foto || undefined} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                      {getIniciais(aluno.nome)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Informações */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{aluno.nome}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {aluno.email}
                        </div>
                        {aluno.cpf && (
                          <p className="text-xs text-gray-500 mt-1">
                            CPF: {aluno.cpf}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={aluno.ativo ? "default" : "secondary"}
                        className={aluno.ativo ? "bg-green-500" : "bg-gray-500"}
                      >
                        {aluno.ativo ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Ativo
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Inativo
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Detalhes da Matrícula */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <Calendar className="w-3 h-3" />
                          Início
                        </div>
                        <p className="text-sm font-medium">
                          {formatarData(aluno.dataInicio)}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <Calendar className="w-3 h-3" />
                          Término
                        </div>
                        <p className="text-sm font-medium">
                          {formatarData(aluno.dataFim)}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <Clock className="w-3 h-3" />
                          Horas/Dia
                        </div>
                        <p className="text-sm font-medium">
                          {aluno.horasDiarias || 0}h
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <Calendar className="w-3 h-3" />
                          Dias de Estudo
                        </div>
                        <p className="text-sm font-medium">
                          {aluno.diasEstudo || "Todos"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

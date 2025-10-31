import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { User, Mail, Phone, MapPin, Calendar, Award, BookOpen, Target, TrendingUp, Clock } from "lucide-react";

interface PerfilAlunoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuarioId: number;
  onEditar?: () => void;
}

export default function PerfilAlunoModal({ open, onOpenChange, usuarioId, onEditar }: PerfilAlunoModalProps) {
  const { data: usuario, isLoading } = trpc.adminPanel.usuarios.getById.useQuery(
    { id: usuarioId },
    { enabled: open && !!usuarioId }
  );

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!usuario) {
    return null;
  }

  let endereco = null;
  if (usuario.endereco) {
    try {
      endereco = JSON.parse(usuario.endereco);
    } catch (e) {
      console.error("Erro ao parsear endereço:", e);
    }
  }

  const getPerfilColor = (perfil: string) => {
    switch (perfil) {
      case "master": return "bg-purple-100 text-purple-800";
      case "mentor": return "bg-blue-100 text-blue-800";
      case "professor": return "bg-green-100 text-green-800";
      case "administrativo": return "bg-yellow-100 text-yellow-800";
      case "aluno": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Perfil do Usuário</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Cabeçalho com Foto e Dados Principais */}
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              {usuario.foto ? (
                <img
                  src={usuario.foto}
                  alt={usuario.name || "Usuário"}
                  className="w-32 h-32 rounded-full object-cover border-4 border-border"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-4 border-border">
                  <User className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold">{usuario.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getPerfilColor(usuario.role)}>
                    {usuario.role.charAt(0).toUpperCase() + usuario.role.slice(1)}
                  </Badge>
                  <Badge variant={usuario.status === "ativo" ? "default" : "secondary"}>
                    {usuario.status}
                  </Badge>
                </div>
              </div>

              {usuario.bio && (
                <p className="text-muted-foreground">{usuario.bio}</p>
              )}

              <div className="flex gap-2">
                <Button size="sm" onClick={onEditar}>
                  Editar Perfil
                </Button>
                <Button size="sm" variant="outline">
                  Enviar Mensagem
                </Button>
                <Button size="sm" variant="outline">
                  Atribuir Plano
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{usuario.email || "Não informado"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{usuario.telefone || "Não informado"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-medium">{usuario.cpf || "Não informado"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="font-medium">{usuario.dataNascimento || "Não informado"}</p>
                </div>
              </div>

              {endereco && (endereco.rua || endereco.cidade) && (
                <div className="col-span-2 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Endereço</p>
                    <p className="font-medium">
                      {endereco.rua && `${endereco.rua}${endereco.numero ? `, ${endereco.numero}` : ""}`}
                      {endereco.complemento && ` - ${endereco.complemento}`}
                      <br />
                      {endereco.bairro && `${endereco.bairro}, `}
                      {endereco.cidade && `${endereco.cidade}`}
                      {endereco.estado && ` - ${endereco.estado}`}
                      {endereco.cep && ` | CEP: ${endereco.cep}`}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estatísticas (apenas para alunos) */}
          {usuario.role === "aluno" && (
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Award className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{usuario.pontos || 0}</p>
                      <p className="text-sm text-muted-foreground">Pontos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Metas Concluídas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Aulas Assistidas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">0%</p>
                      <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Informações Administrativas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Administrativas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                  <p className="font-medium">
                    {new Date(usuario.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Último Acesso</p>
                  <p className="font-medium">
                    {new Date(usuario.lastSignedIn).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {usuario.observacoes && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Observações Internas</p>
                  <p className="text-sm bg-muted p-3 rounded-md">{usuario.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Edit, Trash2, Search, MessageSquare, Eye, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import MensagensForumModal from "./MensagensForumModal";
import FormularioUsuario from "./FormularioUsuario";
import PerfilAlunoModal from "./PerfilAlunoModal";
import ImportarAlunos from "./ImportarAlunos";
import { trpc } from "@/lib/trpc";

export default function GestaoUsuarios() {
  // Buscar usuários do backend
  const { data: usuariosData, isLoading, refetch } = trpc.adminPanel.usuarios.list.useQuery();
  const deletarUsuarioMutation = trpc.adminPanel.usuarios.delete.useMutation();
  
  const usuarios = usuariosData || [];

  const [busca, setBusca] = useState("");
  const [formularioAberto, setFormularioAberto] = useState(false);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [importarAberto, setImportarAberto] = useState(false);
  const [mensagensDialogAberto, setMensagensDialogAberto] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<any | null>(null);
  const [usuarioEditando, setUsuarioEditando] = useState<any | null>(null);
  const [usuarioPerfil, setUsuarioPerfil] = useState<number | null>(null);

  const getPerfilColor = (perfil: string) => {
    switch (perfil) {
      case "master":
        return "bg-purple-100 text-purple-800";
      case "mentor":
        return "bg-blue-100 text-blue-800";
      case "professor":
        return "bg-green-100 text-green-800";
      case "administrativo":
        return "bg-yellow-100 text-yellow-800";
      case "aluno":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleNovoUsuario = () => {
    setUsuarioEditando(null);
    setFormularioAberto(true);
  };
  
  const handleEditarUsuario = (usuario: any) => {
    setUsuarioEditando(usuario);
    setFormularioAberto(true);
  };
  
  const handleVerPerfil = (usuarioId: number) => {
    setUsuarioPerfil(usuarioId);
    setPerfilAberto(true);
  };

  const handleExcluir = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;
    
    try {
      await deletarUsuarioMutation.mutateAsync({ id });
      toast.success("Usuário excluído");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir usuário");
    }
  };

  const usuariosFiltrados = usuarios.filter((u: any) =>
    (u.name?.toLowerCase() || "").includes(busca.toLowerCase()) ||
    (u.email?.toLowerCase() || "").includes(busca.toLowerCase())
  );
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setImportarAberto(true)} variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar Alunos
          </Button>
          <Button onClick={handleNovoUsuario}>
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
          <CardDescription>
            Gerencie todos os usuários da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuariosFiltrados.map((usuario: any) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.name}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <Badge className={getPerfilColor(usuario.role)}>
                      {usuario.role.charAt(0).toUpperCase() + usuario.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(usuario.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <Badge variant={usuario.status === "ativo" ? "default" : "secondary"}>
                      {usuario.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleVerPerfil(usuario.id)}
                        title="Ver perfil completo"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setUsuarioSelecionado(usuario);
                          setMensagensDialogAberto(true);
                        }}
                        title="Ver mensagens do fórum"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditarUsuario(usuario)}
                        title="Editar usuário"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleExcluir(usuario.id)}
                        title="Excluir usuário"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Formulário de Usuário */}
      <FormularioUsuario
        open={formularioAberto}
        onOpenChange={setFormularioAberto}
        usuario={usuarioEditando}
        onSuccess={refetch}
      />
      
      {/* Importar Alunos */}
      <ImportarAlunos
        open={importarAberto}
        onOpenChange={setImportarAberto}
        onSuccess={refetch}
      />
      
      {/* Modal de Perfil */}
      {usuarioPerfil && (
        <PerfilAlunoModal
          open={perfilAberto}
          onOpenChange={setPerfilAberto}
          usuarioId={usuarioPerfil}
          onEditar={() => {
            const usuario = usuarios.find((u: any) => u.id === usuarioPerfil);
            if (usuario) {
              setPerfilAberto(false);
              handleEditarUsuario(usuario);
            }
          }}
        />
      )}
      
      {/* Modal de Mensagens do Fórum */}
      {usuarioSelecionado && (
        <MensagensForumModal
          open={mensagensDialogAberto}
          onOpenChange={setMensagensDialogAberto}
          userId={usuarioSelecionado.id}
          userName={usuarioSelecionado.name}
        />
      )}
    </div>
  );
}

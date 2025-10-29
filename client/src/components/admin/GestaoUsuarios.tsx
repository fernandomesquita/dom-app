import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Edit, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: "aluno" | "professor" | "administrativo" | "mentor" | "master";
  dataCadastro: string;
  status: "ativo" | "inativo";
}

export default function GestaoUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: 1, nome: "Fernando Mesquita", email: "fernando@dom.com", perfil: "master", dataCadastro: "2025-01-01", status: "ativo" },
    { id: 2, nome: "Maria Silva", email: "maria@dom.com", perfil: "mentor", dataCadastro: "2025-01-05", status: "ativo" },
    { id: 3, nome: "João Santos", email: "joao@dom.com", perfil: "professor", dataCadastro: "2025-01-10", status: "ativo" },
    { id: 4, nome: "Ana Costa", email: "ana@dom.com", perfil: "administrativo", dataCadastro: "2025-01-12", status: "ativo" },
    { id: 5, nome: "Pedro Oliveira", email: "pedro@dom.com", perfil: "aluno", dataCadastro: "2025-01-15", status: "ativo" },
  ]);

  const [busca, setBusca] = useState("");
  const [dialogAberto, setDialogAberto] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    nome: "",
    email: "",
    perfil: "aluno" as Usuario["perfil"],
  });

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

  const handleCriarUsuario = () => {
    if (!novoUsuario.nome || !novoUsuario.email) {
      toast.error("Preencha todos os campos");
      return;
    }

    const usuario: Usuario = {
      id: usuarios.length + 1,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      perfil: novoUsuario.perfil,
      dataCadastro: new Date().toISOString().split("T")[0],
      status: "ativo",
    };

    setUsuarios([...usuarios, usuario]);
    setDialogAberto(false);
    setNovoUsuario({ nome: "", email: "", perfil: "aluno" });
    toast.success("Usuário criado com sucesso!");
  };

  const handleExcluir = (id: number) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
    toast.success("Usuário excluído");
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(busca.toLowerCase()) ||
    u.email.toLowerCase().includes(busca.toLowerCase())
  );

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

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo usuário
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={novoUsuario.nome}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={novoUsuario.email}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="perfil">Perfil</Label>
                <Select
                  value={novoUsuario.perfil}
                  onValueChange={(value) => setNovoUsuario({ ...novoUsuario, perfil: value as Usuario["perfil"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aluno">Aluno</SelectItem>
                    <SelectItem value="professor">Professor</SelectItem>
                    <SelectItem value="administrativo">Administrativo</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                    <SelectItem value="master">Master</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogAberto(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCriarUsuario}>Criar Usuário</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados ({usuariosFiltrados.length})</CardTitle>
          <CardDescription>Gerencie todos os usuários do sistema</CardDescription>
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
              {usuariosFiltrados.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">{usuario.nome}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <Badge className={getPerfilColor(usuario.perfil)}>
                      {usuario.perfil.charAt(0).toUpperCase() + usuario.perfil.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(usuario.dataCadastro).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <Badge variant={usuario.status === "ativo" ? "default" : "secondary"}>
                      {usuario.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleExcluir(usuario.id)}
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
    </div>
  );
}

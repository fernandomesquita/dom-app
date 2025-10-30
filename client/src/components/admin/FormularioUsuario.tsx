import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Upload, User } from "lucide-react";

interface FormularioUsuarioProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario?: any; // Se fornecido, é edição. Se null, é criação
  onSuccess: () => void;
}

export default function FormularioUsuario({ open, onOpenChange, usuario, onSuccess }: FormularioUsuarioProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    telefone: "",
    dataNascimento: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    role: "aluno" as "aluno" | "professor" | "administrativo" | "mentor" | "master",
    bio: "",
    observacoes: "",
    foto: "",
  });

  const [uploadingFoto, setUploadingFoto] = useState(false);

  const criarMutation = trpc.admin.usuarios.create.useMutation();
  const atualizarMutation = trpc.admin.usuarios.update.useMutation();

  // Preencher formulário ao editar
  useEffect(() => {
    if (usuario) {
      let endereco = { rua: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "", cep: "" };
      
      if (usuario.endereco) {
        try {
          endereco = JSON.parse(usuario.endereco);
        } catch (e) {
          console.error("Erro ao parsear endereço:", e);
        }
      }

      setFormData({
        name: usuario.name || "",
        email: usuario.email || "",
        cpf: usuario.cpf || "",
        telefone: usuario.telefone || "",
        dataNascimento: usuario.dataNascimento || "",
        rua: endereco.rua || "",
        numero: endereco.numero || "",
        complemento: endereco.complemento || "",
        bairro: endereco.bairro || "",
        cidade: endereco.cidade || "",
        estado: endereco.estado || "",
        cep: endereco.cep || "",
        role: usuario.role || "aluno",
        bio: usuario.bio || "",
        observacoes: usuario.observacoes || "",
        foto: usuario.foto || "",
      });
    } else {
      // Resetar ao criar novo
      setFormData({
        name: "",
        email: "",
        cpf: "",
        telefone: "",
        dataNascimento: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
        role: "aluno",
        bio: "",
        observacoes: "",
        foto: "",
      });
    }
  }, [usuario, open]);

  const formatarCPF = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 11) {
      return numeros
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return valor;
  };

  const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 11) {
      return numeros
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return valor;
  };

  const formatarCEP = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 8) {
      return numeros.replace(/(\d{5})(\d)/, "$1-$2");
    }
    return valor;
  };

  const validarCPF = (cpf: string): boolean => {
    const numeros = cpf.replace(/\D/g, "");
    
    if (numeros.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(numeros)) return false; // CPFs com todos dígitos iguais

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(numeros.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto >= 10 ? 0 : resto;

    if (digito1 !== parseInt(numeros.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(numeros.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto >= 10 ? 0 : resto;

    return digito2 === parseInt(numeros.charAt(10));
  };

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo 5MB.");
      return;
    }

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      toast.error("Apenas imagens são permitidas");
      return;
    }

    setUploadingFoto(true);

    try {
      // Converter para base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData({ ...formData, foto: base64 });
        toast.success("Foto carregada!");
        setUploadingFoto(false);
      };
      reader.onerror = () => {
        toast.error("Erro ao carregar imagem");
        setUploadingFoto(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Erro ao fazer upload da foto");
      setUploadingFoto(false);
    }
  };

  const handleSubmit = async () => {
    // Validações
    if (!formData.name || !formData.email) {
      toast.error("Nome e email são obrigatórios");
      return;
    }

    if (formData.cpf && !validarCPF(formData.cpf)) {
      toast.error("CPF inválido");
      return;
    }

    // Montar endereço JSON
    const endereco = JSON.stringify({
      rua: formData.rua,
      numero: formData.numero,
      complemento: formData.complemento,
      bairro: formData.bairro,
      cidade: formData.cidade,
      estado: formData.estado,
      cep: formData.cep,
    });

    try {
      if (usuario) {
        // Atualizar
        await atualizarMutation.mutateAsync({
          id: usuario.id,
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf || undefined,
          telefone: formData.telefone || undefined,
          dataNascimento: formData.dataNascimento || undefined,
          endereco: endereco,
          foto: formData.foto || undefined,
          bio: formData.bio || undefined,
          role: formData.role,
          observacoes: formData.observacoes || undefined,
        });
        toast.success("Usuário atualizado com sucesso!");
      } else {
        // Criar
        await criarMutation.mutateAsync({
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf || undefined,
          telefone: formData.telefone || undefined,
          dataNascimento: formData.dataNascimento || undefined,
          endereco: endereco,
          foto: formData.foto || undefined,
          bio: formData.bio || undefined,
          role: formData.role,
          observacoes: formData.observacoes || undefined,
        });
        toast.success("Usuário criado com sucesso!");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar usuário");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{usuario ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
          <DialogDescription>
            Preencha os dados do usuário. Campos com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Foto de Perfil */}
          <div className="flex items-center gap-4">
            <div className="relative">
              {formData.foto ? (
                <img
                  src={formData.foto}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                  <User className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="foto" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                  <Upload className="w-4 h-4" />
                  {uploadingFoto ? "Carregando..." : "Escolher Foto"}
                </div>
              </Label>
              <Input
                id="foto"
                type="file"
                accept="image/*"
                onChange={handleUploadFoto}
                className="hidden"
                disabled={uploadingFoto}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Máximo 5MB. Formatos: JPG, PNG, GIF
              </p>
            </div>
          </div>

          {/* Dados Básicos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: João da Silva"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="role">Perfil</Label>
              <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
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

            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: formatarCPF(e.target.value) })}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: formatarTelefone(e.target.value) })}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>

            <div>
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
              />
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="font-semibold mb-3">Endereço</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-2">
                <Label htmlFor="rua">Rua</Label>
                <Input
                  id="rua"
                  value={formData.rua}
                  onChange={(e) => setFormData({ ...formData, rua: e.target.value })}
                  placeholder="Nome da rua"
                />
              </div>

              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  placeholder="123"
                />
              </div>

              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={formData.complemento}
                  onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                  placeholder="Apto, Bloco..."
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                  placeholder="Nome do bairro"
                />
              </div>

              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  placeholder="São Paulo"
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
                  placeholder="SP"
                  maxLength={2}
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => setFormData({ ...formData, cep: formatarCEP(e.target.value) })}
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Breve descrição sobre o usuário..."
              rows={3}
            />
          </div>

          {/* Observações Internas */}
          <div>
            <Label htmlFor="observacoes">Observações Internas (Admin)</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Notas internas visíveis apenas para administradores..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Estas observações não são visíveis para o usuário
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={criarMutation.isPending || atualizarMutation.isPending}
          >
            {criarMutation.isPending || atualizarMutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

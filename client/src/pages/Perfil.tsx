import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { User, Mail, Phone, Calendar, MapPin, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function Perfil() {
  const { user, refresh } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    telefone: "",
    dataNascimento: "",
    endereco: "",
    foto: "",
    bio: "",
  });

  const updateProfileMutation = trpc.authentication.updateProfile.useMutation();
  const resendVerificationMutation = trpc.authentication.resendVerificationEmail.useMutation();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        telefone: user.telefone || "",
        dataNascimento: user.dataNascimento || "",
        endereco: user.endereco || "",
        foto: user.foto || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const maskDate = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\/\d{4})\d+?$/, "$1");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfileMutation.mutateAsync(formData);
      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
      refresh();
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar perfil");
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerificationMutation.mutateAsync();
      toast.success("Email de verificação reenviado!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao reenviar email");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Editar Perfil
          </Button>
        )}
      </div>

      {/* Alerta de email não verificado */}
      {user.emailVerified === 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Seu email ainda não foi verificado. Verifique sua caixa de entrada.</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendVerification}
              disabled={resendVerificationMutation.isPending}
            >
              {resendVerificationMutation.isPending ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Reenviar Email"
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              {formData.foto ? (
                <img src={formData.foto} alt="Foto de perfil" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                {user.name}
                {user.emailVerified === 1 && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verificado
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Básicas
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      value={user.email || ""}
                      disabled
                      className="pr-10"
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Email não pode ser alterado</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={user.cpf || ""}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">CPF não pode ser alterado</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <div className="relative">
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleChange("telefone", maskPhone(e.target.value))}
                      placeholder="(11) 98765-4321"
                      maxLength={15}
                      disabled={!isEditing}
                    />
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <div className="relative">
                  <Input
                    id="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={(e) => handleChange("dataNascimento", maskDate(e.target.value))}
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                    disabled={!isEditing}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Endereço
              </h3>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Textarea
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleChange("endereco", e.target.value)}
                  placeholder="Rua, número, complemento, bairro, cidade, estado, CEP"
                  rows={3}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Foto e Bio */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Foto e Biografia
              </h3>

              <div className="space-y-2">
                <Label htmlFor="foto">URL da Foto de Perfil</Label>
                <Input
                  id="foto"
                  value={formData.foto}
                  onChange={(e) => handleChange("foto", e.target.value)}
                  placeholder="https://exemplo.com/foto.jpg"
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Conte um pouco sobre você..."
                  rows={4}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Botões */}
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    // Restaurar dados originais
                    if (user) {
                      setFormData({
                        name: user.name || "",
                        telefone: user.telefone || "",
                        dataNascimento: user.dataNascimento || "",
                        endereco: user.endereco || "",
                        foto: user.foto || "",
                        bio: user.bio || "",
                      });
                    }
                  }}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Perfil:</span>
            <Badge>{user.role}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant={user.status === "ativo" ? "default" : "secondary"}>
              {user.status}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pontos:</span>
            <span className="font-semibold">{user.pontos}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Membro desde:</span>
            <span>{new Date(user.createdAt).toLocaleDateString("pt-BR")}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

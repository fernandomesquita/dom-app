import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

export default function VerificarEmail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const token = params.token as string;
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const verifyMutation = trpc.authentication.verifyEmail.useMutation();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Token de verificação não fornecido");
      return;
    }

    verifyMutation.mutate(
      { token },
      {
        onSuccess: () => {
          setStatus("success");
        },
        onError: (error) => {
          setStatus("error");
          setErrorMessage(error.message || "Erro ao verificar email");
        },
      }
    );
  }, [token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl">Verificando Email</CardTitle>
            <CardDescription>
              Aguarde enquanto verificamos seu email...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Email Verificado!</CardTitle>
            <CardDescription>
              Sua conta foi ativada com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <Mail className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Seu email foi verificado com sucesso. Agora você pode fazer login na plataforma.
              </AlertDescription>
            </Alert>

            <Button 
              className="w-full" 
              onClick={() => setLocation("/")}
            >
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Erro na Verificação</CardTitle>
          <CardDescription>
            Não foi possível verificar seu email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Possíveis causas:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>O link de verificação expirou (válido por 24 horas)</li>
              <li>O link já foi utilizado</li>
              <li>O link está incorreto ou incompleto</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={() => setLocation("/cadastro")}
            >
              Fazer Novo Cadastro
            </Button>
            <Button 
              variant="outline"
              className="w-full" 
              onClick={() => setLocation("/")}
            >
              Voltar para Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

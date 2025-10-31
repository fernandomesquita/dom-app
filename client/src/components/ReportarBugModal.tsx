import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Upload, X, Bug } from "lucide-react";

interface ReportarBugModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ReportarBugModal({ open, onClose }: ReportarBugModalProps) {
  const [descricao, setDescricao] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const reportarMutation = trpc.bugs.reportar.useMutation({
    onSuccess: () => {
      toast.success("Bug reportado com sucesso! Obrigado pelo feedback 🎉");
      limparFormulario();
      onClose();
    },
    onError: (error) => {
      toast.error(`Erro ao reportar bug: ${error.message}`);
    },
  });

  const limparFormulario = () => {
    setDescricao("");
    setScreenshot(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("Arquivo muito grande. Máximo: 5MB");
      return;
    }

    // Validar formato
    if (!file.type.startsWith("image/")) {
      toast.error("Apenas imagens são permitidas");
      return;
    }

    setScreenshot(file);
  };

  const uploadParaS3 = async (file: File): Promise<string> => {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        file: base64,
        filename: file.name,
        mimeType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao fazer upload da imagem");
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async () => {
    if (!descricao.trim()) {
      toast.error("Por favor, descreva o problema");
      return;
    }

    setUploading(true);

    try {
      let screenshotUrl = "";
      if (screenshot) {
        screenshotUrl = await uploadParaS3(screenshot);
      }

      // Capturar informações automáticas
      const paginaUrl = window.location.href;
      const navegador = navigator.userAgent;
      const resolucao = `${window.screen.width}x${window.screen.height}`;
      
      // Gerar título automático baseado na URL
      const pathname = new URL(paginaUrl).pathname;
      const titulo = `Bug em ${pathname || 'página inicial'}`;

      await reportarMutation.mutateAsync({
        titulo,
        descricao,
        categoria: "funcionalidade",
        prioridade: "media",
        screenshots: screenshotUrl,
        paginaUrl,
        navegador,
        resolucao,
      });
    } catch (error) {
      toast.error("Erro ao enviar relatório");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-red-600" />
            Reportar Bug
          </DialogTitle>
          <DialogDescription>
            Descreva o problema encontrado. Informações técnicas serão capturadas automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Descrição */}
          <div>
            <Label htmlFor="descricao">Descrição do Problema *</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o que aconteceu, o que você esperava e como reproduzir o problema..."
              rows={6}
              className="mt-1"
            />
          </div>

          {/* Screenshot (opcional) */}
          <div>
            <Label>Screenshot (opcional)</Label>
            <div className="mt-2">
              {!screenshot ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Clique para adicionar uma imagem
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    PNG, JPG até 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(screenshot)}
                    alt="Screenshot"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setScreenshot(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Informações automáticas */}
          <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
            <p className="font-semibold text-foreground">Informações capturadas automaticamente:</p>
            <p className="text-muted-foreground">• Página: {window.location.pathname || '/'}</p>
            <p className="text-muted-foreground">• Navegador: {navigator.userAgent.split(' ').slice(0, 3).join(' ')}</p>
            <p className="text-muted-foreground">• Resolução: {window.screen.width}x{window.screen.height}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={uploading}>
            {uploading ? "Enviando..." : "Enviar Relatório"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

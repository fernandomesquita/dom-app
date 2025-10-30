import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Upload, X, AlertCircle, Bug } from "lucide-react";

interface ReportarBugModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ReportarBugModal({ open, onClose }: ReportarBugModalProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState<string>("funcionalidade");
  const [prioridade, setPrioridade] = useState<string>("media");
  const [screenshots, setScreenshots] = useState<File[]>([]);
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
    setTitulo("");
    setDescricao("");
    setCategoria("funcionalidade");
    setPrioridade("media");
    setScreenshots([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validar número máximo de arquivos
    if (screenshots.length + files.length > 3) {
      toast.error("Você pode enviar no máximo 3 screenshots");
      return;
    }

    // Validar tamanho (5MB por arquivo)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    for (const file of files) {
      if (file.size > MAX_SIZE) {
        toast.error(`Arquivo ${file.name} é muito grande. Máximo: 5MB`);
        return;
      }

      // Validar formato
      if (!file.type.startsWith("image/")) {
        toast.error(`Arquivo ${file.name} não é uma imagem válida`);
        return;
      }
    }

    setScreenshots([...screenshots, ...files]);
  };

  const removerScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index));
  };

  const uploadParaS3 = async (file: File): Promise<string> => {
    // Converter arquivo para base64
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
    // Validações
    if (!titulo.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    if (titulo.length < 5) {
      toast.error("Título deve ter no mínimo 5 caracteres");
      return;
    }

    if (!descricao.trim()) {
      toast.error("Descrição é obrigatória");
      return;
    }

    if (descricao.length < 10) {
      toast.error("Descrição deve ter no mínimo 10 caracteres");
      return;
    }

    try {
      setUploading(true);

      // Upload das screenshots para S3
      const screenshotUrls: string[] = [];
      for (const file of screenshots) {
        try {
          const url = await uploadParaS3(file);
          screenshotUrls.push(url);
        } catch (error) {
          console.error("Erro ao fazer upload:", error);
          toast.error(`Erro ao fazer upload de ${file.name}`);
        }
      }

      // Coletar informações do navegador
      const navegador = navigator.userAgent;
      const resolucao = `${window.screen.width}x${window.screen.height}`;
      const paginaUrl = window.location.href;

      // Enviar reporte
      await reportarMutation.mutateAsync({
        titulo,
        descricao,
        categoria: categoria as any,
        prioridade: prioridade as any,
        screenshots: screenshotUrls.length > 0 ? screenshotUrls : undefined,
        paginaUrl,
        navegador,
        resolucao,
      });
    } catch (error) {
      console.error("Erro ao reportar bug:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-destructive" />
            Reportar Bug ou Problema
          </DialogTitle>
          <DialogDescription>
            Encontrou algum problema? Descreva o que aconteceu e envie screenshots se possível.
            Sua contribuição ajuda a melhorar a plataforma! 🚀
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="titulo">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="titulo"
              placeholder="Ex: Botão de salvar não funciona"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              maxLength={255}
            />
            <p className="text-xs text-muted-foreground">
              {titulo.length}/255 caracteres
            </p>
          </div>

          {/* Categoria e Prioridade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger id="categoria">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interface">🎨 Interface/Visual</SelectItem>
                  <SelectItem value="funcionalidade">⚙️ Funcionalidade</SelectItem>
                  <SelectItem value="performance">⚡ Performance/Lentidão</SelectItem>
                  <SelectItem value="dados">📊 Dados Incorretos</SelectItem>
                  <SelectItem value="mobile">📱 Problema no Mobile</SelectItem>
                  <SelectItem value="outro">❓ Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select value={prioridade} onValueChange={setPrioridade}>
                <SelectTrigger id="prioridade">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">🟢 Baixa</SelectItem>
                  <SelectItem value="media">🟡 Média</SelectItem>
                  <SelectItem value="alta">🟠 Alta</SelectItem>
                  <SelectItem value="critica">🔴 Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">
              Descrição <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="descricao"
              placeholder="Descreva o problema em detalhes:&#10;- O que você estava fazendo?&#10;- O que aconteceu?&#10;- O que você esperava que acontecesse?"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {descricao.length} caracteres (mínimo 10)
            </p>
          </div>

          {/* Upload de Screenshots */}
          <div className="space-y-2">
            <Label>Screenshots (opcional, até 3 imagens)</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors">
              <input
                type="file"
                id="screenshots"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={screenshots.length >= 3}
              />
              <label
                htmlFor="screenshots"
                className={`cursor-pointer flex flex-col items-center gap-2 ${
                  screenshots.length >= 3 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {screenshots.length >= 3
                    ? "Máximo de 3 imagens atingido"
                    : "Clique para selecionar imagens"}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, JPEG ou WEBP (máx. 5MB cada)
                </p>
              </label>
            </div>

            {/* Preview das screenshots */}
            {screenshots.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {screenshots.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removerScreenshot(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Aviso */}
          <div className="bg-muted/50 p-3 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Informações coletadas automaticamente:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>URL da página atual</li>
                <li>Navegador e versão</li>
                <li>Resolução da tela</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              limparFormulario();
              onClose();
            }}
            disabled={uploading || reportarMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={uploading || reportarMutation.isPending}
          >
            {uploading || reportarMutation.isPending ? "Enviando..." : "Enviar Reporte"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

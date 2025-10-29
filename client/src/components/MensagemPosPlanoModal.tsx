import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, X, PartyPopper } from "lucide-react";

interface MensagemPosPlanoModalProps {
  open: boolean;
  onClose: () => void;
  mensagemHtml: string;
  link?: string;
  planoNome: string;
}

export default function MensagemPosPlanoModal({
  open,
  onClose,
  mensagemHtml,
  link,
  planoNome,
}: MensagemPosPlanoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
              <PartyPopper className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Parabéns! 🎉</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Você concluiu o plano: <span className="font-semibold">{planoNome}</span>
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="py-6">
          {/* Renderizar HTML da mensagem */}
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: mensagemHtml }}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
          
          {link && (
            <Button asChild>
              <a href={link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Acessar Link
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

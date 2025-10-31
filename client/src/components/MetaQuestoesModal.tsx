import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen } from "lucide-react";
import { trpc } from "@/lib/trpc";
import QuestaoCard from "@/components/QuestaoCard";

interface MetaQuestoesModalProps {
  metaId: number | null;
  metaTitulo?: string;
  open: boolean;
  onClose: () => void;
}

export default function MetaQuestoesModal({ metaId, metaTitulo, open, onClose }: MetaQuestoesModalProps) {
  const { data: questoes, isLoading, refetch } = trpc.metas.getQuestoes.useQuery(
    { metaId: metaId! },
    { enabled: !!metaId && open }
  );
  
  const handleQuestaoResolvida = () => {
    refetch();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Questões da Meta
            {metaTitulo && <span className="text-muted-foreground">- {metaTitulo}</span>}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !questoes || questoes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                Nenhuma questão vinculada a esta meta
              </div>
              <p className="text-sm text-muted-foreground">
                Use o painel administrativo para vincular questões
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">
                  {questoes.length} {questoes.length === 1 ? "questão" : "questões"}
                </Badge>
              </div>
              
              {questoes.map((questao: any) => (
                <QuestaoCard
                  key={questao.id}
                  questao={questao}
                  metaId={metaId!}
                  onResolvida={handleQuestaoResolvida}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface EditarMetaModalProps {
  metaId: number | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditarMetaModal({ metaId, open, onClose, onSuccess }: EditarMetaModalProps) {
  const [buscaQuestao, setBuscaQuestao] = useState("");
  const [questoesSelecionadas, setQuestoesSelecionadas] = useState<number[]>([]);
  
  // Queries
  const { data: questoesVinculadas, refetch: refetchQuestoesVinculadas } = trpc.metas.getQuestoes.useQuery(
    { metaId: metaId! },
    { enabled: !!metaId && open }
  );
  
  const { data: questoesDisponiveis } = trpc.metas.buscarQuestoes.useQuery(
    { busca: buscaQuestao, limit: 10 },
    { enabled: open && buscaQuestao.length > 0 }
  );
  
  // Mutations
  const vincularQuestoes = trpc.metas.vincularQuestoes.useMutation({
    onSuccess: () => {
      toast.success("Questões vinculadas com sucesso!");
      refetchQuestoesVinculadas();
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast.error(`Erro ao vincular questões: ${error.message}`);
    },
  });
  
  useEffect(() => {
    if (questoesVinculadas) {
      setQuestoesSelecionadas(questoesVinculadas.map(q => q.id));
    }
  }, [questoesVinculadas]);
  
  const handleAdicionarQuestao = (questaoId: number) => {
    if (!questoesSelecionadas.includes(questaoId)) {
      setQuestoesSelecionadas([...questoesSelecionadas, questaoId]);
      setBuscaQuestao("");
    }
  };
  
  const handleRemoverQuestao = (questaoId: number) => {
    setQuestoesSelecionadas(questoesSelecionadas.filter(id => id !== questaoId));
  };
  
  const handleSalvar = () => {
    if (!metaId) return;
    vincularQuestoes.mutate({ metaId, questoesIds: questoesSelecionadas });
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Vincular Questões à Meta</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Busca de questões */}
          <div>
            <Label>Buscar Questão (por ID ou palavra-chave)</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={buscaQuestao}
                  onChange={(e) => setBuscaQuestao(e.target.value)}
                  placeholder="Digite o ID ou busque por palavra-chave..."
                  className="pl-9"
                />
              </div>
            </div>
            
            {/* Resultados da busca */}
            {questoesDisponiveis && questoesDisponiveis.length > 0 && (
              <ScrollArea className="h-40 mt-2 border rounded-md p-2">
                {questoesDisponiveis.map((questao: any) => (
                  <div
                    key={questao.id}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-md mb-1"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">#{questao.id} - {questao.disciplina}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {questao.enunciado}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAdicionarQuestao(questao.id)}
                      disabled={questoesSelecionadas.includes(questao.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            )}
          </div>
          
          {/* Questões selecionadas */}
          <div>
            <Label>Questões Vinculadas ({questoesSelecionadas.length})</Label>
            <ScrollArea className="h-60 border rounded-md p-2 mt-2">
              {questoesSelecionadas.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Nenhuma questão vinculada
                </div>
              ) : (
                questoesVinculadas?.map((questao: any) => (
                  <div
                    key={questao.id}
                    className="flex items-start justify-between p-3 border rounded-md mb-2"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">#{questao.id}</Badge>
                        <span className="font-medium text-sm">{questao.disciplina}</span>
                        {questao.banca && (
                          <Badge variant="secondary" className="text-xs">{questao.banca}</Badge>
                        )}
                      </div>
                      <div className="text-sm line-clamp-2">{questao.enunciado}</div>
                      {questao.entidade && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {questao.entidade} {questao.cargo && `- ${questao.cargo}`} {questao.ano && `(${questao.ano})`}
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoverQuestao(questao.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
          
          {/* Ações */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar} disabled={vincularQuestoes.isPending}>
              {vincularQuestoes.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

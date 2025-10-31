import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AvisosSection() {
  const { data: avisos, refetch } = trpc.avisos.list.useQuery();
  const dispensarMutation = trpc.avisos.dispensar.useMutation({
    onSuccess: () => {
      toast.success("Aviso dispensado");
      refetch();
    },
  });

  if (!avisos || avisos.length === 0) {
    return null; // Não mostrar nada se não houver avisos
  }

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case "urgente":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "aviso":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBgColor = (tipo: string) => {
    switch (tipo) {
      case "urgente":
        return "bg-red-50 border-red-200";
      case "aviso":
        return "bg-yellow-50 border-yellow-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="space-y-3">
      {avisos.map((aviso: any) => (
        <Card key={aviso.id} className={`${getBgColor(aviso.tipo)} border`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(aviso.tipo)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{aviso.titulo}</h3>
                <p className="text-sm text-muted-foreground mt-1">{aviso.mensagem}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 h-8 w-8"
                onClick={() => dispensarMutation.mutate({ avisoId: aviso.id })}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Award, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Conquista {
  id: number;
  nome: string;
  descricao: string | null;
  icone: string | null;
}

interface ConquistaToastProps {
  conquistas: Conquista[];
  onClose: () => void;
}

export function ConquistaToast({ conquistas, onClose }: ConquistaToastProps) {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (conquistas.length > 0) {
      setVisible(true);
      
      // Auto-fechar após 5 segundos
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [conquistas, currentIndex]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      if (currentIndex < conquistas.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setVisible(true);
      } else {
        onClose();
      }
    }, 300);
  };

  if (conquistas.length === 0 || currentIndex >= conquistas.length) {
    return null;
  }

  const conquista = conquistas[currentIndex];

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className="w-96 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 shadow-2xl">
        <CardContent className="pt-6 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                {conquista.icone ? (
                  <span className="text-3xl">{conquista.icone}</span>
                ) : (
                  <Award className="h-8 w-8 text-white" />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-yellow-600" />
                <span className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">
                  Conquista Desbloqueada!
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {conquista.nome}
              </h3>
              
              {conquista.descricao && (
                <p className="text-sm text-gray-600">
                  {conquista.descricao}
                </p>
              )}

              {conquistas.length > 1 && (
                <div className="mt-3 flex items-center gap-1">
                  {conquistas.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentIndex
                          ? "w-6 bg-yellow-500"
                          : "w-1.5 bg-yellow-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

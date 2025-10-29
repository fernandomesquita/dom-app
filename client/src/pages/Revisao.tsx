import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import { RotateCcw, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Revisao() {
  const [, setLocation] = useLocation();

  return (
    <div className="container py-8 space-y-6">
      {/* Breadcrumb e Botão Voltar */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumb items={[{ label: "Revisão" }]} />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-foreground">Revisão Estratégica</h1>
        <p className="text-muted-foreground mt-2">
          Sistema de revisão baseado na curva de esquecimento e incidência de assuntos
        </p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <RotateCcw className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Módulo em Desenvolvimento</h3>
          <p className="text-muted-foreground mb-6">
            O sistema de revisão estratégica está sendo implementado com algoritmos de spaced repetition.
          </p>
          <Button variant="outline">Voltar ao Dashboard</Button>
        </CardContent>
      </Card>
    </div>
  );
}

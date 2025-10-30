import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import ReportarBugModal from "./ReportarBugModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function BotaoReportarBug() {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setModalAberto(true)}
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50 animate-bounce hover:animate-none"
            aria-label="Reportar Bug"
          >
            <Bug className="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="font-semibold">
          Reportar Bug ou Problema
        </TooltipContent>
      </Tooltip>

      <ReportarBugModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
      />
    </>
  );
}

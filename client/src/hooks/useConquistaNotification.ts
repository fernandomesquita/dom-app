import { useState, useCallback } from "react";

interface Conquista {
  id: number;
  nome: string;
  descricao: string | null;
  icone: string | null;
}

export function useConquistaNotification() {
  const [conquistas, setConquistas] = useState<Conquista[]>([]);

  const mostrarConquistas = useCallback((novasConquistas: Conquista[]) => {
    if (novasConquistas && novasConquistas.length > 0) {
      setConquistas(novasConquistas);
    }
  }, []);

  const limparConquistas = useCallback(() => {
    setConquistas([]);
  }, []);

  return {
    conquistas,
    mostrarConquistas,
    limparConquistas,
  };
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Palette, RotateCcw, Save } from "lucide-react";

interface ColorConfig {
  primaryColor: string;
  secondaryColor: string;
  sidebarBg: string;
  backgroundColor: string;
  textColor: string;
}

const defaultColors: ColorConfig = {
  primaryColor: "#2563eb", // blue-600
  secondaryColor: "#7c3aed", // violet-600
  sidebarBg: "#f0fdf4", // green-50
  backgroundColor: "#ffffff",
  textColor: "#0f172a", // slate-900
};

export default function CentroComando() {
  const [colors, setColors] = useState<ColorConfig>(defaultColors);
  const [previewMode, setPreviewMode] = useState(false);

  // Carregar cores salvas do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("customColors");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setColors(parsed);
        applyColors(parsed);
      } catch (e) {
        console.error("Erro ao carregar cores:", e);
      }
    }
  }, []);

  const applyColors = (colorConfig: ColorConfig) => {
    const root = document.documentElement;
    
    // Converter hex para HSL para usar com CSS variables do shadcn
    const hexToHSL = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return "0 0% 0%";
      
      let r = parseInt(result[1], 16) / 255;
      let g = parseInt(result[2], 16) / 255;
      let b = parseInt(result[3], 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }
      
      h = Math.round(h * 360);
      s = Math.round(s * 100);
      l = Math.round(l * 100);
      
      return `${h} ${s}% ${l}%`;
    };

    root.style.setProperty("--primary", hexToHSL(colorConfig.primaryColor));
    root.style.setProperty("--secondary", hexToHSL(colorConfig.secondaryColor));
    root.style.setProperty("--background", hexToHSL(colorConfig.backgroundColor));
    root.style.setProperty("--foreground", hexToHSL(colorConfig.textColor));
    
    // Aplicar cor da sidebar diretamente
    const sidebars = document.querySelectorAll("aside");
    sidebars.forEach(sidebar => {
      sidebar.style.backgroundColor = colorConfig.sidebarBg;
    });
  };

  const handleColorChange = (key: keyof ColorConfig, value: string) => {
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    if (previewMode) {
      applyColors(newColors);
    }
  };

  const handleSave = () => {
    localStorage.setItem("customColors", JSON.stringify(colors));
    applyColors(colors);
    toast.success("Cores personalizadas salvas com sucesso!");
  };

  const handleReset = () => {
    setColors(defaultColors);
    localStorage.removeItem("customColors");
    applyColors(defaultColors);
    toast.info("Cores resetadas para o padrão");
  };

  const togglePreview = () => {
    if (!previewMode) {
      applyColors(colors);
    } else {
      const saved = localStorage.getItem("customColors");
      if (saved) {
        applyColors(JSON.parse(saved));
      } else {
        applyColors(defaultColors);
      }
    }
    setPreviewMode(!previewMode);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Palette className="h-8 w-8" />
            Centro de Comando - Personalização
          </h2>
          <p className="text-muted-foreground mt-2">
            Customize as cores da plataforma de acordo com sua identidade visual
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={previewMode ? "default" : "outline"}
            onClick={togglePreview}
          >
            {previewMode ? "Preview Ativo" : "Ativar Preview"}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cor Primária */}
        <Card>
          <CardHeader>
            <CardTitle>Cor Primária</CardTitle>
            <CardDescription>
              Botões, links e elementos de destaque
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={colors.primaryColor}
                onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                className="w-20 h-20 rounded-lg cursor-pointer border-2 border-border"
              />
              <div className="flex-1">
                <Label>Código Hex</Label>
                <input
                  type="text"
                  value={colors.primaryColor}
                  onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="#2563eb"
                />
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: colors.primaryColor }}>
              <p className="text-white font-semibold">Exemplo de Botão</p>
            </div>
          </CardContent>
        </Card>

        {/* Cor Secundária */}
        <Card>
          <CardHeader>
            <CardTitle>Cor Secundária</CardTitle>
            <CardDescription>
              Elementos secundários e variações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={colors.secondaryColor}
                onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                className="w-20 h-20 rounded-lg cursor-pointer border-2 border-border"
              />
              <div className="flex-1">
                <Label>Código Hex</Label>
                <input
                  type="text"
                  value={colors.secondaryColor}
                  onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="#7c3aed"
                />
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: colors.secondaryColor }}>
              <p className="text-white font-semibold">Exemplo Secundário</p>
            </div>
          </CardContent>
        </Card>

        {/* Cor da Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Fundo da Sidebar</CardTitle>
            <CardDescription>
              Cor de fundo do menu lateral
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={colors.sidebarBg}
                onChange={(e) => handleColorChange("sidebarBg", e.target.value)}
                className="w-20 h-20 rounded-lg cursor-pointer border-2 border-border"
              />
              <div className="flex-1">
                <Label>Código Hex</Label>
                <input
                  type="text"
                  value={colors.sidebarBg}
                  onChange={(e) => handleColorChange("sidebarBg", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="#f0fdf4"
                />
              </div>
            </div>
            <div className="p-4 rounded-lg border-2" style={{ backgroundColor: colors.sidebarBg }}>
              <p className="font-semibold">Preview da Sidebar</p>
            </div>
          </CardContent>
        </Card>

        {/* Cor de Fundo */}
        <Card>
          <CardHeader>
            <CardTitle>Fundo da Página</CardTitle>
            <CardDescription>
              Cor de fundo principal da aplicação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={colors.backgroundColor}
                onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                className="w-20 h-20 rounded-lg cursor-pointer border-2 border-border"
              />
              <div className="flex-1">
                <Label>Código Hex</Label>
                <input
                  type="text"
                  value={colors.backgroundColor}
                  onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="#ffffff"
                />
              </div>
            </div>
            <div className="p-4 rounded-lg border-2" style={{ backgroundColor: colors.backgroundColor }}>
              <p className="font-semibold">Preview do Fundo</p>
            </div>
          </CardContent>
        </Card>

        {/* Cor de Texto */}
        <Card>
          <CardHeader>
            <CardTitle>Cor do Texto</CardTitle>
            <CardDescription>
              Cor principal do texto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={colors.textColor}
                onChange={(e) => handleColorChange("textColor", e.target.value)}
                className="w-20 h-20 rounded-lg cursor-pointer border-2 border-border"
              />
              <div className="flex-1">
                <Label>Código Hex</Label>
                <input
                  type="text"
                  value={colors.textColor}
                  onChange={(e) => handleColorChange("textColor", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="#0f172a"
                />
              </div>
            </div>
            <div className="p-4 rounded-lg border-2 bg-white">
              <p className="font-semibold" style={{ color: colors.textColor }}>
                Exemplo de Texto
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Dicas de Uso</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 space-y-2">
          <p>• Use o botão "Ativar Preview" para visualizar as mudanças em tempo real</p>
          <p>• Clique em "Salvar" para aplicar as cores permanentemente</p>
          <p>• Use "Resetar" para voltar às cores padrão</p>
          <p>• As cores são salvas localmente no navegador</p>
        </CardContent>
      </Card>
    </div>
  );
}

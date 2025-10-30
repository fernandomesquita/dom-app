import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Breadcrumb from "@/components/Breadcrumb";
import { ArrowLeft, Search, FileText, Video, File, Download, Eye, Star, Filter } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface Material {
  id: number;
  titulo: string;
  tipo: "PDF" | "Vídeo" | "Documento" | "Apresentação";
  disciplina: string;
  assunto: string;
  tamanho: string;
  dataUpload: string;
  downloads: number;
  favorito: boolean;
}

export default function Materiais() {
  const [, setLocation] = useLocation();
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);

  const [materiais, setMateriais] = useState<Material[]>([
    {
      id: 1,
      titulo: "Resumo Completo - Direitos Fundamentais",
      tipo: "PDF",
      disciplina: "Direito Constitucional",
      assunto: "Direitos Fundamentais",
      tamanho: "2.5 MB",
      dataUpload: "2025-01-20",
      downloads: 145,
      favorito: true,
    },
    {
      id: 2,
      titulo: "Videoaula - Princípios Administrativos",
      tipo: "Vídeo",
      disciplina: "Direito Administrativo",
      assunto: "Princípios",
      tamanho: "85 MB",
      dataUpload: "2025-01-18",
      downloads: 89,
      favorito: false,
    },
    {
      id: 3,
      titulo: "Mapas Mentais - Teoria do Crime",
      tipo: "PDF",
      disciplina: "Direito Penal",
      assunto: "Teoria do Crime",
      tamanho: "1.8 MB",
      dataUpload: "2025-01-22",
      downloads: 112,
      favorito: true,
    },
    {
      id: 4,
      titulo: "Slides - Contratos no Código Civil",
      tipo: "Apresentação",
      disciplina: "Direito Civil",
      assunto: "Contratos",
      tamanho: "4.2 MB",
      dataUpload: "2025-01-15",
      downloads: 67,
      favorito: false,
    },
    {
      id: 5,
      titulo: "Legislação Comentada - CTN",
      tipo: "PDF",
      disciplina: "Direito Tributário",
      assunto: "Código Tributário Nacional",
      tamanho: "5.8 MB",
      dataUpload: "2025-01-10",
      downloads: 203,
      favorito: true,
    },
    {
      id: 6,
      titulo: "Videoaula - CLT Comentada",
      tipo: "Vídeo",
      disciplina: "Direito do Trabalho",
      assunto: "Consolidação das Leis do Trabalho",
      tamanho: "120 MB",
      dataUpload: "2025-01-12",
      downloads: 156,
      favorito: false,
    },
    {
      id: 7,
      titulo: "Questões Comentadas - CPC",
      tipo: "PDF",
      disciplina: "Direito Processual Civil",
      assunto: "Código de Processo Civil",
      tamanho: "3.1 MB",
      dataUpload: "2025-01-25",
      downloads: 78,
      favorito: false,
    },
    {
      id: 8,
      titulo: "Esquemas - Sociedades Empresárias",
      tipo: "Documento",
      disciplina: "Direito Empresarial",
      assunto: "Sociedades",
      tamanho: "1.2 MB",
      dataUpload: "2025-01-08",
      downloads: 92,
      favorito: true,
    },
  ]);

  const disciplinasUnicas = Array.from(new Set(materiais.map(m => m.disciplina)));

  const materiaisFiltrados = materiais.filter(m => {
    const buscaMatch = m.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                      m.assunto.toLowerCase().includes(busca.toLowerCase());
    const tipoMatch = filtroTipo === "todos" || m.tipo === filtroTipo;
    const disciplinaMatch = filtroDisciplina === "todas" || m.disciplina === filtroDisciplina;
    return buscaMatch && tipoMatch && disciplinaMatch;
  });

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "PDF":
        return <FileText className="h-5 w-5 text-red-600" />;
      case "Vídeo":
        return <Video className="h-5 w-5 text-blue-600" />;
      case "Documento":
        return <File className="h-5 w-5 text-green-600" />;
      case "Apresentação":
        return <FileText className="h-5 w-5 text-orange-600" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "PDF":
        return "bg-red-100 text-red-800";
      case "Vídeo":
        return "bg-blue-100 text-blue-800";
      case "Documento":
        return "bg-green-100 text-green-800";
      case "Apresentação":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleToggleFavorito = (id: number) => {
    setMateriais(materiais.map(m => 
      m.id === id ? { ...m, favorito: !m.favorito } : m
    ));
    const material = materiais.find(m => m.id === id);
    if (material) {
      toast.success(material.favorito ? "Removido dos favoritos" : "Adicionado aos favoritos");
    }
  };

  const handleDownload = (material: Material) => {
    setMateriais(materiais.map(m =>
      m.id === material.id ? { ...m, downloads: m.downloads + 1 } : m
    ));
    toast.success(`Download iniciado: ${material.titulo}`);
  };

  const handleVisualizar = (material: Material) => {
    toast.info(`Abrindo: ${material.titulo}`);
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Breadcrumb items={[{ label: "Repositório de Materiais" }]} />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Repositório de Materiais</h1>
          <p className="text-muted-foreground mt-2">
            Acesse PDFs, vídeos, documentos e apresentações
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              Adicionar Material
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Material de Apoio</DialogTitle>
              <DialogDescription>
                Faça upload de um PDF para compartilhar com os alunos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Arquivo PDF *</Label>
                <Input type="file" accept=".pdf" />
              </div>
              <div>
                <Label>Título *</Label>
                <Input placeholder="Ex: Resumo de Direito Constitucional" />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea placeholder="Breve descrição do conteúdo..." rows={3} />
              </div>
              <div>
                <Label>Disciplina</Label>
                <Input placeholder="Ex: Direito Constitucional" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancelar</Button>
                <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>Adicionar Material</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total de Materiais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materiais.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">PDFs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {materiais.filter(m => m.tipo === "PDF").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Vídeos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {materiais.filter(m => m.tipo === "Vídeo").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {materiais.filter(m => m.favorito).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtros */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar e Filtrar
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFiltrosVisiveis(!filtrosVisiveis)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {filtrosVisiveis ? "Ocultar" : "Mostrar"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Buscar por título ou assunto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {filtrosVisiveis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo</label>
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Vídeo">Vídeo</SelectItem>
                    <SelectItem value="Documento">Documento</SelectItem>
                    <SelectItem value="Apresentação">Apresentação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Disciplina</label>
                <Select value={filtroDisciplina} onValueChange={setFiltroDisciplina}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    {disciplinasUnicas.map((disc) => (
                      <SelectItem key={disc} value={disc}>
                        {disc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Materiais */}
      <div className="grid grid-cols-1 gap-3">
        {materiaisFiltrados.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhum material encontrado com os filtros selecionados.
            </CardContent>
          </Card>
        ) : (
          materiaisFiltrados.map((material) => (
            <Card key={material.id} className="hover:bg-accent transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent rounded-lg">
                    {getTipoIcon(material.tipo)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{material.titulo}</h3>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className={getTipoColor(material.tipo)}>
                            {material.tipo}
                          </Badge>
                          <Badge variant="outline">{material.disciplina}</Badge>
                          <Badge variant="outline">{material.assunto}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{material.tamanho}</span>
                          <span>•</span>
                          <span>{new Date(material.dataUpload).toLocaleDateString("pt-BR")}</span>
                          <span>•</span>
                          <span>{material.downloads} downloads</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleFavorito(material.id)}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              material.favorito ? "fill-yellow-500 text-yellow-500" : ""
                            }`}
                          />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVisualizar(material)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(material)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

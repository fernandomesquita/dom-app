import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Breadcrumb from "@/components/Breadcrumb";
import { ArrowLeft, Search, FileText, Download, Eye, Filter, Plus, Upload, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Materiais() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [busca, setBusca] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");
  const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [uploadando, setUploadando] = useState(false);
  
  // Form data
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [disciplina, setDisciplina] = useState("");

  const { data: materiais, isLoading, refetch } = trpc.materiais.list.useQuery();
  
  const createMaterial = trpc.materiais.create.useMutation({
    onSuccess: () => {
      toast.success("Material adicionado com sucesso!");
      setModalUpload(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao adicionar material");
    },
  });

  const deleteMaterial = trpc.materiais.delete.useMutation({
    onSuccess: () => {
      toast.success("Material removido com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover material");
    },
  });

  const resetForm = () => {
    setArquivo(null);
    setTitulo("");
    setDescricao("");
    setDisciplina("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Apenas arquivos PDF são permitidos");
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB
        toast.error("Arquivo muito grande. Tamanho máximo: 50MB");
        return;
      }
      setArquivo(file);
      if (!titulo) {
        setTitulo(file.name.replace(".pdf", ""));
      }
    }
  };

  const handleUpload = async () => {
    if (!arquivo) {
      toast.error("Selecione um arquivo PDF");
      return;
    }
    if (!titulo.trim()) {
      toast.error("Informe um título");
      return;
    }

    setUploadando(true);

    try {
      // Upload para S3 usando storagePut
      const formData = new FormData();
      formData.append("file", arquivo);
      formData.append("path", `materiais/${Date.now()}_${arquivo.name}`);

      const uploadResponse = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Erro ao fazer upload do arquivo");
      }

      const { url } = await uploadResponse.json();

      // Criar registro no banco
      await createMaterial.mutateAsync({
        titulo: titulo.trim(),
        descricao: descricao.trim() || undefined,
        urlArquivo: url,
        tipoArquivo: arquivo.type,
        tamanhoBytes: arquivo.size,
        disciplina: disciplina.trim() || undefined,
      });
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer upload");
    } finally {
      setUploadando(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este material?")) {
      return;
    }
    await deleteMaterial.mutateAsync({ id });
  };

  const disciplinasUnicas = Array.from(new Set(materiais?.map(m => m.disciplina).filter(Boolean)));

  const materiaisFiltrados = materiais?.filter(m => {
    const buscaMatch = m.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                      (m.descricao && m.descricao.toLowerCase().includes(busca.toLowerCase()));
    const disciplinaMatch = filtroDisciplina === "todas" || m.disciplina === filtroDisciplina;
    return buscaMatch && disciplinaMatch;
  });

  const formatBytes = (bytes?: number) => {
    if (!bytes) return "Tamanho desconhecido";
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const canUpload = user && ["master", "professor", "mentor", "administrativo"].includes(user.role || "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando materiais...</p>
        </div>
      </div>
    );
  }

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
            Acesse PDFs e documentos complementares
          </p>
        </div>

        {canUpload && (
          <Dialog open={modalUpload} onOpenChange={setModalUpload}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
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
                {/* Upload de arquivo */}
                <div>
                  <Label>Arquivo PDF *</Label>
                  <div className="mt-2">
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      disabled={uploadando}
                    />
                    {arquivo && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {arquivo.name} ({formatBytes(arquivo.size)})
                      </p>
                    )}
                  </div>
                </div>

                {/* Título */}
                <div>
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ex: Resumo de Direito Constitucional"
                    disabled={uploadando}
                  />
                </div>

                {/* Descrição */}
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Breve descrição do conteúdo..."
                    rows={3}
                    disabled={uploadando}
                  />
                </div>

                {/* Disciplina */}
                <div>
                  <Label htmlFor="disciplina">Disciplina</Label>
                  <Input
                    id="disciplina"
                    value={disciplina}
                    onChange={(e) => setDisciplina(e.target.value)}
                    placeholder="Ex: Direito Constitucional"
                    disabled={uploadando}
                  />
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setModalUpload(false)}
                    disabled={uploadando}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleUpload} disabled={uploadando || !arquivo}>
                    {uploadando ? (
                      <>
                        <Upload className="h-4 w-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Adicionar Material
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total de Materiais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materiais?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">PDFs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {materiais?.filter(m => m.tipoArquivo === "application/pdf").length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Disciplinas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {disciplinasUnicas.length}
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
            placeholder="Buscar por título ou descrição..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {filtrosVisiveis && (
            <div>
              <label className="text-sm font-medium mb-2 block">Disciplina</label>
              <Select value={filtroDisciplina} onValueChange={setFiltroDisciplina}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  {disciplinasUnicas.map((disc) => (
                    <SelectItem key={disc} value={disc!}>
                      {disc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Materiais */}
      <div className="grid grid-cols-1 gap-3">
        {!materiaisFiltrados || materiaisFiltrados.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {busca || filtroDisciplina !== "todas"
                ? "Nenhum material encontrado com os filtros selecionados."
                : "Nenhum material disponível ainda. Professores podem adicionar materiais usando o botão acima."}
            </CardContent>
          </Card>
        ) : (
          materiaisFiltrados.map((material) => (
            <Card key={material.id} className="hover:bg-accent transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{material.titulo}</h3>
                        {material.descricao && (
                          <p className="text-sm text-muted-foreground mb-2">{material.descricao}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className="bg-red-100 text-red-800">PDF</Badge>
                          {material.disciplina && (
                            <Badge variant="outline">{material.disciplina}</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatBytes(material.tamanhoBytes || undefined)}</span>
                          <span>•</span>
                          <span>{new Date(material.createdAt).toLocaleDateString("pt-BR")}</span>
                          <span>•</span>
                          <span>Por {material.uploaderNome || "Professor"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(material.urlArquivo, "_blank")}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            window.open(material.urlArquivo, "_blank");
                            toast.success("Download iniciado");
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        {canUpload && material.uploadedBy === user?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(material.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
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

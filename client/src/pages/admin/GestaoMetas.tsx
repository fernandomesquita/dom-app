import { useState, useMemo } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import AdicionarEditarMetaModal from "@/components/admin/AdicionarEditarMetaModal";
import ImportarMetasModal from "@/components/admin/ImportarMetasModal";
import {
  Plus,
  Search,
  Filter,
  GripVertical,
  Edit,
  Trash2,
  Clock,
  BookOpen,
  RefreshCw,
  HelpCircle,
  BarChart3,
  Download,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Meta {
  id: number;
  planoId: number;
  disciplina: string;
  assunto: string;
  tipo: "estudo" | "revisao" | "questoes";
  duracao: number;
  incidencia: "baixa" | "media" | "alta" | null;
  prioridade: number;
  ordem: number;
  dicaEstudo: string | null;
  cor: string | null;
}

// Componente de linha sortable
function MetaRow({ meta, isSelected, onToggleSelect, onEdit, onDelete }: {
  meta: Meta;
  isSelected: boolean;
  onToggleSelect: (id: number) => void;
  onEdit: (meta: Meta) => void;
  onDelete: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: meta.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getTipoBadge = (tipo: string) => {
    const badges = {
      estudo: { label: "Estudo", className: "bg-blue-100 text-blue-800" },
      revisao: { label: "Revisão", className: "bg-green-100 text-green-800" },
      questoes: { label: "Questões", className: "bg-orange-100 text-orange-800" },
    };
    return badges[tipo as keyof typeof badges] || badges.estudo;
  };

  const getIncidenciaBadge = (incidencia: string | null) => {
    if (!incidencia) return null;
    const badges = {
      alta: { label: "Alta", className: "bg-red-100 text-red-800" },
      media: { label: "Média", className: "bg-yellow-100 text-yellow-800" },
      baixa: { label: "Baixa", className: "bg-gray-100 text-gray-800" },
    };
    return badges[incidencia as keyof typeof badges];
  };

  const tipoBadge = getTipoBadge(meta.tipo);
  const incidenciaBadge = getIncidenciaBadge(meta.incidencia);

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b hover:bg-gray-50 ${isSelected ? "bg-blue-50" : ""}`}
    >
      <td className="p-3">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(meta.id)}
          />
          <button
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>
      </td>
      <td className="p-3 text-sm text-gray-600">{meta.ordem}</td>
      <td className="p-3">
        <div className="font-medium text-gray-900">{meta.disciplina}</div>
        <div className="text-sm text-gray-500 line-clamp-1">{meta.assunto}</div>
      </td>
      <td className="p-3">
        <Badge className={tipoBadge.className}>{tipoBadge.label}</Badge>
      </td>
      <td className="p-3 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {meta.duracao} min
        </div>
      </td>
      <td className="p-3">
        {incidenciaBadge && (
          <Badge className={incidenciaBadge.className}>{incidenciaBadge.label}</Badge>
        )}
      </td>
      <td className="p-3">
        {meta.cor && (
          <div
            className="w-8 h-8 rounded border"
            style={{ backgroundColor: meta.cor }}
          />
        )}
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(meta)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(meta.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function GestaoMetas() {
  const params = useParams();
  const planoId = parseInt(params.id as string);

  const [busca, setBusca] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState<string>("todas");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroIncidencia, setFiltroIncidencia] = useState<string>("todas");
  const [selecionadas, setSelecionadas] = useState<number[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [metaEditando, setMetaEditando] = useState<Meta | null>(null);
  const [modalImportarAberto, setModalImportarAberto] = useState(false);

  // Queries
  const { data: metas = [], refetch: refetchMetas } = trpc.metas.list.useQuery({ planoId });
  const { data: plano } = trpc.planos.getById.useQuery({ id: planoId });
  const { data: estatisticas } = trpc.metas.estatisticas.useQuery({ planoId });

  // Mutations
  const reordenarMutation = trpc.metas.reordenar.useMutation({
    onSuccess: () => {
      refetchMetas();
      toast.success("Ordem atualizada!");
    },
  });

  const deletarMutation = trpc.metas.delete.useMutation({
    onSuccess: () => {
      refetchMetas();
      toast.success("Meta excluída!");
    },
  });

  const criarMutation = trpc.metas.create.useMutation({
    onSuccess: () => {
      refetchMetas();
      toast.success("Meta criada com sucesso!");
    },
  });

  const criarLoteMutation = trpc.metas.criarLote.useMutation({
    onSuccess: (data) => {
      refetchMetas();
      toast.success(`${data.criadas} metas importadas com sucesso!`);
    },
  });

  const atualizarMutation = trpc.metas.update.useMutation({
    onSuccess: () => {
      refetchMetas();
      toast.success("Meta atualizada!");
    },
  });

  const deletarLoteMutation = trpc.metas.deletarLote.useMutation({
    onSuccess: (data) => {
      refetchMetas();
      setSelecionadas([]);
      toast.success(`${data.deletadas} metas excluídas!`);
    },
  });

  // Sensors para drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filtrar metas
  const metasFiltradas = useMemo(() => {
    return metas.filter((meta: Meta) => {
      const matchBusca =
        busca === "" ||
        meta.disciplina.toLowerCase().includes(busca.toLowerCase()) ||
        meta.assunto.toLowerCase().includes(busca.toLowerCase());

      const matchDisciplina =
        filtroDisciplina === "todas" || meta.disciplina === filtroDisciplina;

      const matchTipo = filtroTipo === "todos" || meta.tipo === filtroTipo;

      const matchIncidencia =
        filtroIncidencia === "todas" || meta.incidencia === filtroIncidencia;

      return matchBusca && matchDisciplina && matchTipo && matchIncidencia;
    });
  }, [metas, busca, filtroDisciplina, filtroTipo, filtroIncidencia]);

  // Disciplinas únicas
  const disciplinas = useMemo(() => {
    return [...new Set(metas.map((m: Meta) => m.disciplina))];
  }, [metas]);

  // Handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = metasFiltradas.findIndex((m: Meta) => m.id === active.id);
      const newIndex = metasFiltradas.findIndex((m: Meta) => m.id === over.id);

      const metaId = active.id as number;
      const novaOrdem = metasFiltradas[newIndex].ordem;

      reordenarMutation.mutate({ metaId, novaOrdem });
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selecionadas.length === metasFiltradas.length) {
      setSelecionadas([]);
    } else {
      setSelecionadas(metasFiltradas.map((m: Meta) => m.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selecionadas.length === 0) return;

    if (
      confirm(
        `Tem certeza que deseja excluir ${selecionadas.length} meta(s)? Esta ação não pode ser desfeita.`
      )
    ) {
      deletarLoteMutation.mutate({ metaIds: selecionadas });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta meta?")) {
      deletarMutation.mutate({ id });
    }
  };

  const handleEdit = (meta: Meta) => {
    setMetaEditando(meta);
    setModalAberto(true);
  };

  const handleNovaMeta = () => {
    setMetaEditando(null);
    setModalAberto(true);
  };

  const handleSalvarMeta = (meta: Partial<Meta>) => {
    if (metaEditando) {
      atualizarMutation.mutate({ id: metaEditando.id, ...meta });
    } else {
      criarMutation.mutate(meta);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Metas</h1>
          <p className="text-gray-600 mt-1">
            {plano?.nome || "Carregando..."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setModalImportarAberto(true)}>
            <Download className="w-4 h-4 mr-2" />
            Importar Metas
          </Button>
          <Button onClick={handleNovaMeta}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      {estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Metas</CardDescription>
              <CardTitle className="text-3xl">{estatisticas.totalMetas}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Horas</CardDescription>
              <CardTitle className="text-3xl">
                {estatisticas.totalHoras.toFixed(1)}h
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Distribuição</CardDescription>
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-sm">
                  <span>Estudo:</span>
                  <span className="font-medium">{estatisticas.porTipo.estudo}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Revisão:</span>
                  <span className="font-medium">{estatisticas.porTipo.revisao}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Questões:</span>
                  <span className="font-medium">{estatisticas.porTipo.questoes}</span>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Incidência</CardDescription>
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-sm">
                  <span>Alta:</span>
                  <span className="font-medium text-red-600">
                    {estatisticas.porIncidencia.alta}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Média:</span>
                  <span className="font-medium text-yellow-600">
                    {estatisticas.porIncidencia.media}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Baixa:</span>
                  <span className="font-medium text-gray-600">
                    {estatisticas.porIncidencia.baixa}
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por disciplina ou assunto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filtroDisciplina} onValueChange={setFiltroDisciplina}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as disciplinas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as disciplinas</SelectItem>
                {disciplinas.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="estudo">Estudo</SelectItem>
                <SelectItem value="revisao">Revisão</SelectItem>
                <SelectItem value="questoes">Questões</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroIncidencia} onValueChange={setFiltroIncidencia}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as incidências" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as incidências</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ações em lote */}
          {selecionadas.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selecionadas.length} meta(s) selecionada(s)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelecionadas([])}
                >
                  Limpar Seleção
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Selecionadas
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-left">
                    <Checkbox
                      checked={
                        metasFiltradas.length > 0 &&
                        selecionadas.length === metasFiltradas.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">
                    Ordem
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">
                    Disciplina / Assunto
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">
                    Tipo
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">
                    Duração
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">
                    Incidência
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">
                    Cor
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-gray-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {metasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      Nenhuma meta encontrada
                    </td>
                  </tr>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={metasFiltradas.map((m: Meta) => m.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {metasFiltradas.map((meta: Meta) => (
                        <MetaRow
                          key={meta.id}
                          meta={meta}
                          isSelected={selecionadas.includes(meta.id)}
                          onToggleSelect={handleToggleSelect}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Adicionar/Editar */}
      <AdicionarEditarMetaModal
        aberto={modalAberto}
        onFechar={() => {
          setModalAberto(false);
          setMetaEditando(null);
        }}
        onSalvar={handleSalvarMeta}
        metaInicial={metaEditando}
        planoId={planoId}
        proximaOrdem={(metas.length > 0 ? Math.max(...metas.map((m: Meta) => m.ordem)) : 0) + 1}
      />

      {/* Modal de Importar */}
      <ImportarMetasModal
        aberto={modalImportarAberto}
        onFechar={() => setModalImportarAberto(false)}
        onImportar={async (metas) => {
          await criarLoteMutation.mutateAsync({ metas });
        }}
        planoId={planoId}
        nomePlano={plano?.nome || "Plano"}
      />
    </div>
  );
}

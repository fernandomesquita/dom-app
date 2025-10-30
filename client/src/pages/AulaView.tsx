import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Breadcrumb from "@/components/Breadcrumb";
import { 
  ArrowLeft, CheckCircle, BookOpen, FileText, Clock, Star, 
  Play, Pause, Volume2, VolumeX, Maximize, Settings 
} from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import ReactPlayer from "react-player";

interface Anotacao {
  id: string;
  texto: string;
  timestamp: number;
  createdAt: Date;
}

export default function AulaView() {
  const [, params] = useRoute("/aulas/:id");
  const aulaId = params?.id ? parseInt(params.id) : null;
  const [, setLocation] = useLocation();
  
  // Player states
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  
  // Anotações
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
  const [novaAnotacao, setNovaAnotacao] = useState("");
  
  // Queries
  const { data: aula, isLoading } = trpc.aulas.getById.useQuery(
    { id: aulaId! },
    { enabled: !!aulaId }
  );
  
  const { data: progresso } = trpc.aulas.meusProgressos.useQuery();
  
  // Mutations
  const marcarConcluida = trpc.aulas.marcarConcluida.useMutation({
    onSuccess: () => {
      toast.success("Aula marcada como concluída!");
    },
  });
  
  const salvarProgresso = trpc.aulas.salvarProgresso.useMutation();
  
  // Handlers
  const handlePlayPause = () => {
    setPlaying(!playing);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };
  
  const handleToggleMuted = () => {
    setMuted(!muted);
  };
  
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
  };
  
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };
  
  const handleSeekMouseDown = () => {
    setSeeking(true);
  };
  
  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    const target = e.target as HTMLInputElement;
    playerRef.current?.seekTo(parseFloat(target.value));
  };
  
  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played);
      
      // Salvar progresso a cada 10 segundos
      if (Math.floor(state.playedSeconds) % 10 === 0 && aulaId) {
        salvarProgresso.mutate({
          aulaId,
          posicao: Math.floor(state.playedSeconds),
          percentual: Math.floor(state.played * 100),
        });
      }
    }
  };
  
  const handleDuration = (duration: number) => {
    setDuration(duration);
  };
  
  const handleMarcarConcluida = () => {
    if (!aulaId) return;
    marcarConcluida.mutate({ 
      aulaId, 
      percentual: 100,
      posicao: Math.floor(duration),
    });
  };
  
  const handleSalvarAnotacao = () => {
    if (!novaAnotacao.trim()) return;
    
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    const novaAnotacaoObj: Anotacao = {
      id: Date.now().toString(),
      texto: novaAnotacao,
      timestamp: currentTime,
      createdAt: new Date(),
    };
    
    setAnotacoes(prev => [...prev, novaAnotacaoObj]);
    setNovaAnotacao("");
    toast.success("Anotação salva!");
  };
  
  const handleJumpToTimestamp = (timestamp: number) => {
    playerRef.current?.seekTo(timestamp);
    setPlaying(true);
  };
  
  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Carregando aula...</p>
      </div>
    );
  }
  
  if (!aula) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Aula não encontrada</p>
          <Button onClick={() => setLocation("/aulas")}>Voltar para Aulas</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/aulas")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Breadcrumb items={[
            { label: "Aulas", href: "/aulas" },
            { label: aula.titulo }
          ]} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna Principal - Vídeo */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                {/* Player de Vídeo */}
                <div className="aspect-video bg-black rounded-t-lg overflow-hidden relative">
                  {aula.urlVideo ? (
                    <>
                      <ReactPlayer
                        ref={playerRef}
                        url={aula.urlVideo}
                        width="100%"
                        height="100%"
                        playing={playing}
                        volume={volume}
                        muted={muted}
                        playbackRate={playbackRate}
                        onProgress={handleProgress}
                        onDuration={handleDuration}
                        config={{
                          youtube: {
                            playerVars: { showinfo: 1 }
                          }
                        }}
                      />
                      
                      {/* Controles Customizados */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 space-y-2">
                        {/* Barra de Progresso */}
                        <input
                          type="range"
                          min={0}
                          max={0.999999}
                          step="any"
                          value={played}
                          onMouseDown={handleSeekMouseDown}
                          onChange={handleSeekChange}
                          onMouseUp={handleSeekMouseUp}
                          className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                        />
                        
                        {/* Controles */}
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handlePlayPause}
                              className="text-white hover:bg-white/20"
                            >
                              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                            </Button>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleToggleMuted}
                                className="text-white hover:bg-white/20"
                              >
                                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                              </Button>
                              <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.1}
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                            
                            <span className="text-sm">
                              {formatTime(played * duration)} / {formatTime(duration)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <select
                              value={playbackRate}
                              onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                              className="bg-white/20 text-white text-sm rounded px-2 py-1 border-none"
                            >
                              <option value={0.5}>0.5x</option>
                              <option value={0.75}>0.75x</option>
                              <option value={1}>1x</option>
                              <option value={1.25}>1.25x</option>
                              <option value={1.5}>1.5x</option>
                              <option value={2}>2x</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <p>Vídeo não disponível</p>
                    </div>
                  )}
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold">{aula.titulo}</h1>
                      <p className="text-muted-foreground mt-1">Professor: {aula.professorId || "Não informado"}</p>
                    </div>
                    <Button onClick={handleMarcarConcluida} size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como Concluída
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{aula.disciplina}</Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {aula.duracao} min
                    </div>
                  </div>

                  {aula.descricao && (
                    <p className="text-sm leading-relaxed">{aula.descricao}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Anotações com Timestamp */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Minhas Anotações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Lista de Anotações */}
                {anotacoes.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {anotacoes.map((anotacao) => (
                      <div
                        key={anotacao.id}
                        className="p-3 bg-secondary rounded-lg space-y-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                        onClick={() => handleJumpToTimestamp(anotacao.timestamp)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-primary">
                            {formatTime(anotacao.timestamp)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {anotacao.createdAt.toLocaleTimeString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-sm">{anotacao.texto}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Nova Anotação */}
                <div className="space-y-2">
                  <Textarea
                    placeholder="Adicione uma anotação neste momento do vídeo..."
                    value={novaAnotacao}
                    onChange={(e) => setNovaAnotacao(e.target.value)}
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Timestamp: {formatTime(played * duration)}
                    </span>
                    <Button onClick={handleSalvarAnotacao} size="sm">
                      Salvar Anotação
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            {/* Progresso */}
            <Card>
              <CardHeader>
                <CardTitle>Seu Progresso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span className="font-medium">{Math.floor(played * 100)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${played * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Seu progresso é salvo automaticamente a cada 10 segundos
                </p>
              </CardContent>
            </Card>
            
            {/* Materiais de Apoio */}
            {aula.urlMaterial && (
              <Card>
                <CardHeader>
                  <CardTitle>Material de Apoio</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={aula.urlMaterial}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Material Complementar</p>
                      <p className="text-xs text-muted-foreground">PDF</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Abrir
                    </Button>
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

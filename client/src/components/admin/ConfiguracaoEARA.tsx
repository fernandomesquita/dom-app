import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Info, Save, RotateCcw } from 'lucide-react';

interface ConfigEARA {
  estudo: {
    habilitado: boolean;
  };
  aplicacao: {
    habilitado: boolean;
    duracaoPercentual: number;
    intervaloAposEstudo: "mesma_sessao" | "proxima_sessao";
  };
  revisao: {
    habilitada: boolean;
    ciclosObrigatorios: number;
    duracaoPercentual: number;
    intervalos: {
      revisao1: { min: number; max: number };
      revisao2: { min: number; max: number };
      revisao3: { min: number; max: number };
    };
    promptAposUltima: boolean;
  };
  adaptacao: {
    habilitada: boolean;
    automatica: boolean;
    acelerarSeAcima: number;
    desacelerarSeAbaixo: number;
    ajustePercentual: number;
  };
  alternancia: {
    habilitada: boolean;
    intervaloMinutos: number;
    intervaloMaximo: number;
  };
  disciplinasRecorrentes: Array<{
    disciplina: string;
    pinada: boolean;
    duracaoDiaria: number;
  }>;
}

const CONFIG_PADRAO: ConfigEARA = {
  estudo: {
    habilitado: true,
  },
  aplicacao: {
    habilitado: true,
    duracaoPercentual: 50,
    intervaloAposEstudo: "mesma_sessao",
  },
  revisao: {
    habilitada: true,
    ciclosObrigatorios: 3,
    duracaoPercentual: 30,
    intervalos: {
      revisao1: { min: 1, max: 3 },
      revisao2: { min: 7, max: 14 },
      revisao3: { min: 14, max: 30 },
    },
    promptAposUltima: true,
  },
  adaptacao: {
    habilitada: true,
    automatica: true,
    acelerarSeAcima: 90,
    desacelerarSeAbaixo: 70,
    ajustePercentual: 20,
  },
  alternancia: {
    habilitada: true,
    intervaloMinutos: 30,
    intervaloMaximo: 60,
  },
  disciplinasRecorrentes: [],
};

interface ConfiguracaoEARAProps {
  planoId: number;
  configInicial?: ConfigEARA;
  onSalvar: (config: ConfigEARA) => void;
}

export function ConfiguracaoEARA({ planoId, configInicial, onSalvar }: ConfiguracaoEARAProps) {
  const [config, setConfig] = useState<ConfigEARA>(configInicial || CONFIG_PADRAO);
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      await onSalvar(config);
    } finally {
      setSalvando(false);
    }
  };

  const handleResetar = () => {
    setConfig(CONFIG_PADRAO);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Configuração do Ciclo EARA®
            <Badge variant="outline" className="text-xs">Marca Registrada</Badge>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure os parâmetros do algoritmo de distribuição inteligente
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetar} size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar Padrão
          </Button>
          <Button onClick={handleSalvar} disabled={salvando} size="sm">
            <Save className="h-4 w-4 mr-2" />
            {salvando ? 'Salvando...' : 'Salvar Configuração'}
          </Button>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          O <strong>Ciclo EARA®</strong> é uma metodologia proprietária de Fernando Mesquita que distribui 
          automaticamente as metas em 4 pilares: <strong>E</strong>studo (material de base), <strong>A</strong>plicação 
          (questões), <strong>R</strong>evisão (mapas/resumos/flashcards) e <strong>A</strong>daptação (análise de desempenho).
        </AlertDescription>
      </Alert>

      {/* 1. ESTUDO */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">E</span>
                Estudo
              </CardTitle>
              <CardDescription>Contato com o Material de Base (aulas, PDFs, vídeos)</CardDescription>
            </div>
            <Switch
              checked={config.estudo.habilitado}
              onCheckedChange={(checked) => setConfig({ ...config, estudo: { habilitado: checked } })}
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            O Estudo é a primeira etapa do ciclo. Todas as metas de tipo "estudo" serão distribuídas primeiro.
          </p>
        </CardContent>
      </Card>

      {/* 2. APLICAÇÃO */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 font-bold">A</span>
                Aplicação
              </CardTitle>
              <CardDescription>Resolução de Questões para fixação prática</CardDescription>
            </div>
            <Switch
              checked={config.aplicacao.habilitado}
              onCheckedChange={(checked) => setConfig({ 
                ...config, 
                aplicacao: { ...config.aplicacao, habilitado: checked } 
              })}
            />
          </div>
        </CardHeader>
        {config.aplicacao.habilitado && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duração (% do tempo de estudo)</Label>
                <Input
                  type="number"
                  min="10"
                  max="100"
                  value={config.aplicacao.duracaoPercentual}
                  onChange={(e) => setConfig({
                    ...config,
                    aplicacao: { ...config.aplicacao, duracaoPercentual: parseInt(e.target.value) || 50 }
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Ex: Se estudo = 60min e % = 50, aplicação = 30min
                </p>
              </div>
              <div className="space-y-2">
                <Label>Intervalo após Estudo</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={config.aplicacao.intervaloAposEstudo}
                  onChange={(e) => setConfig({
                    ...config,
                    aplicacao: { ...config.aplicacao, intervaloAposEstudo: e.target.value as "mesma_sessao" | "proxima_sessao" }
                  })}
                >
                  <option value="mesma_sessao">Mesma sessão (30-60min depois)</option>
                  <option value="proxima_sessao">Próxima sessão (no dia seguinte)</option>
                </select>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 3. REVISÃO */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold">R</span>
                Revisão
              </CardTitle>
              <CardDescription>Material de fixação (mapas mentais, resumos, flashcards)</CardDescription>
            </div>
            <Switch
              checked={config.revisao.habilitada}
              onCheckedChange={(checked) => setConfig({ 
                ...config, 
                revisao: { ...config.revisao, habilitada: checked } 
              })}
            />
          </div>
        </CardHeader>
        {config.revisao.habilitada && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ciclos Obrigatórios</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={config.revisao.ciclosObrigatorios}
                  onChange={(e) => setConfig({
                    ...config,
                    revisao: { ...config.revisao, ciclosObrigatorios: parseInt(e.target.value) || 3 }
                  })}
                />
                <p className="text-xs text-muted-foreground">Recomendado: 3 ciclos</p>
              </div>
              <div className="space-y-2">
                <Label>Duração (% do tempo de estudo)</Label>
                <Input
                  type="number"
                  min="10"
                  max="100"
                  value={config.revisao.duracaoPercentual}
                  onChange={(e) => setConfig({
                    ...config,
                    revisao: { ...config.revisao, duracaoPercentual: parseInt(e.target.value) || 30 }
                  })}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="text-base font-semibold">Intervalos entre Revisões (em dias)</Label>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Revisão 1</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Mín"
                      value={config.revisao.intervalos.revisao1.min}
                      onChange={(e) => setConfig({
                        ...config,
                        revisao: {
                          ...config.revisao,
                          intervalos: {
                            ...config.revisao.intervalos,
                            revisao1: { ...config.revisao.intervalos.revisao1, min: parseInt(e.target.value) || 1 }
                          }
                        }
                      })}
                    />
                    <Input
                      type="number"
                      min="0"
                      placeholder="Máx"
                      value={config.revisao.intervalos.revisao1.max}
                      onChange={(e) => setConfig({
                        ...config,
                        revisao: {
                          ...config.revisao,
                          intervalos: {
                            ...config.revisao.intervalos,
                            revisao1: { ...config.revisao.intervalos.revisao1, max: parseInt(e.target.value) || 3 }
                          }
                        }
                      })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Padrão: 1-3 dias</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Revisão 2</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Mín"
                      value={config.revisao.intervalos.revisao2.min}
                      onChange={(e) => setConfig({
                        ...config,
                        revisao: {
                          ...config.revisao,
                          intervalos: {
                            ...config.revisao.intervalos,
                            revisao2: { ...config.revisao.intervalos.revisao2, min: parseInt(e.target.value) || 7 }
                          }
                        }
                      })}
                    />
                    <Input
                      type="number"
                      min="0"
                      placeholder="Máx"
                      value={config.revisao.intervalos.revisao2.max}
                      onChange={(e) => setConfig({
                        ...config,
                        revisao: {
                          ...config.revisao,
                          intervalos: {
                            ...config.revisao.intervalos,
                            revisao2: { ...config.revisao.intervalos.revisao2, max: parseInt(e.target.value) || 14 }
                          }
                        }
                      })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Padrão: 7-14 dias</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Revisão 3</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      placeholder="Mín"
                      value={config.revisao.intervalos.revisao3.min}
                      onChange={(e) => setConfig({
                        ...config,
                        revisao: {
                          ...config.revisao,
                          intervalos: {
                            ...config.revisao.intervalos,
                            revisao3: { ...config.revisao.intervalos.revisao3, min: parseInt(e.target.value) || 14 }
                          }
                        }
                      })}
                    />
                    <Input
                      type="number"
                      min="0"
                      placeholder="Máx"
                      value={config.revisao.intervalos.revisao3.max}
                      onChange={(e) => setConfig({
                        ...config,
                        revisao: {
                          ...config.revisao,
                          intervalos: {
                            ...config.revisao.intervalos,
                            revisao3: { ...config.revisao.intervalos.revisao3, max: parseInt(e.target.value) || 30 }
                          }
                        }
                      })}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Padrão: 14-30 dias</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Prompt após última revisão</Label>
                <p className="text-xs text-muted-foreground">
                  Perguntar ao aluno se deseja continuar revisando ou encerrar
                </p>
              </div>
              <Switch
                checked={config.revisao.promptAposUltima}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  revisao: { ...config.revisao, promptAposUltima: checked }
                })}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* 4. ADAPTAÇÃO */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold">A</span>
                Adaptação
              </CardTitle>
              <CardDescription>Análise de desempenho e ajustes automáticos</CardDescription>
            </div>
            <Switch
              checked={config.adaptacao.habilitada}
              onCheckedChange={(checked) => setConfig({ 
                ...config, 
                adaptacao: { ...config.adaptacao, habilitada: checked } 
              })}
            />
          </div>
        </CardHeader>
        {config.adaptacao.habilitada && (
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ajuste Automático</Label>
                <p className="text-xs text-muted-foreground">
                  Acelerar/desacelerar cronograma baseado no desempenho
                </p>
              </div>
              <Switch
                checked={config.adaptacao.automatica}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  adaptacao: { ...config.adaptacao, automatica: checked }
                })}
              />
            </div>

            {config.adaptacao.automatica && (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Acelerar se acima de (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={config.adaptacao.acelerarSeAcima}
                    onChange={(e) => setConfig({
                      ...config,
                      adaptacao: { ...config.adaptacao, acelerarSeAcima: parseInt(e.target.value) || 90 }
                    })}
                  />
                  <p className="text-xs text-muted-foreground">Padrão: 90%</p>
                </div>

                <div className="space-y-2">
                  <Label>Desacelerar se abaixo de (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={config.adaptacao.desacelerarSeAbaixo}
                    onChange={(e) => setConfig({
                      ...config,
                      adaptacao: { ...config.adaptacao, desacelerarSeAbaixo: parseInt(e.target.value) || 70 }
                    })}
                  />
                  <p className="text-xs text-muted-foreground">Padrão: 70%</p>
                </div>

                <div className="space-y-2">
                  <Label>Ajuste (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={config.adaptacao.ajustePercentual}
                    onChange={(e) => setConfig({
                      ...config,
                      adaptacao: { ...config.adaptacao, ajustePercentual: parseInt(e.target.value) || 20 }
                    })}
                  />
                  <p className="text-xs text-muted-foreground">Padrão: 20%</p>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* ALTERNÂNCIA */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Alternância de Disciplinas</CardTitle>
              <CardDescription>Trocar de disciplina a cada intervalo para melhor fixação</CardDescription>
            </div>
            <Switch
              checked={config.alternancia.habilitada}
              onCheckedChange={(checked) => setConfig({ 
                ...config, 
                alternancia: { ...config.alternancia, habilitada: checked } 
              })}
            />
          </div>
        </CardHeader>
        {config.alternancia.habilitada && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Intervalo Mínimo (minutos)</Label>
                <Input
                  type="number"
                  min="10"
                  max="120"
                  value={config.alternancia.intervaloMinutos}
                  onChange={(e) => setConfig({
                    ...config,
                    alternancia: { ...config.alternancia, intervaloMinutos: parseInt(e.target.value) || 30 }
                  })}
                />
                <p className="text-xs text-muted-foreground">Padrão: 30 minutos</p>
              </div>
              <div className="space-y-2">
                <Label>Intervalo Máximo (minutos)</Label>
                <Input
                  type="number"
                  min="10"
                  max="240"
                  value={config.alternancia.intervaloMaximo}
                  onChange={(e) => setConfig({
                    ...config,
                    alternancia: { ...config.alternancia, intervaloMaximo: parseInt(e.target.value) || 60 }
                  })}
                />
                <p className="text-xs text-muted-foreground">Padrão: 60 minutos</p>
              </div>
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Idealmente, a cada 30-60 minutos o sistema tentará trocar de disciplina para evitar fadiga mental.
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { MapLabel, MapToken, Player } from '@/lib/game-types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Map, 
  Tag, 
  Circle, 
  Trash2, 
  Upload,
  Move,
  Type,
  MousePointer2
} from 'lucide-react';

interface MasterMapProps {
  players: Player[];
  onMapImageChange?: (base64: string) => void;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Falha ao ler arquivo'));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function MasterMap({ players, onMapImageChange }: MasterMapProps) {
  const [mapImageBase64, setMapImageBase64] = useLocalStorage<string>('detective-map-image', '');
  const [labels, setLabels] = useLocalStorage<MapLabel[]>('detective-map-labels', []);
  const [tokens, setTokens] = useLocalStorage<MapToken[]>('detective-map-tokens', []);
  const [labelSize, setLabelSize] = useLocalStorage<number>('detective-map-label-size', 12);
  
  const [newLabelText, setNewLabelText] = useState('');
  const [isAddingLabel, setIsAddingLabel] = useState(false);
  const [isAddingToken, setIsAddingToken] = useState(false);
  const [selectedTokenPlayer, setSelectedTokenPlayer] = useState<string>('');
  const [dragging, setDragging] = useState<{ id: string, type: 'label' | 'token', x: number, y: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setIsUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setMapImageBase64(base64);
      onMapImageChange?.(base64);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }, [setMapImageBase64, onMapImageChange]);

  const handleMapClick = (e: React.MouseEvent) => {
    if (!mapRef.current || dragging) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (isAddingLabel && newLabelText.trim()) {
      setLabels([...labels, { id: `label-${Date.now()}`, text: newLabelText.trim(), x, y }]);
      setNewLabelText('');
      setIsAddingLabel(false);
    } else if (isAddingToken && selectedTokenPlayer) {
      const player = players.find(p => p.id === selectedTokenPlayer);
      if (player) {
        setTokens([...tokens, { id: `token-${Date.now()}`, playerId: player.id, color: player.color, x, y }]);
        setIsAddingToken(false);
        setSelectedTokenPlayer(''); // Reseta seleção após colocar
      }
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    requestAnimationFrame(() => {
      setDragging(prev => prev ? { ...prev, x, y } : null);
    });
  }, [dragging]);

  const handleMouseUp = useCallback(() => {
    if (!dragging) return;
    if (dragging.type === 'label') {
      setLabels(prev => prev.map(l => l.id === dragging.id ? { ...l, x: dragging.x, y: dragging.y } : l));
    } else {
      setTokens(prev => prev.map(t => t.id === dragging.id ? { ...t, x: dragging.x, y: dragging.y } : t));
    }
    setDragging(null);
  }, [dragging, setLabels, setTokens]);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="space-y-4 w-full animate-in fade-in duration-500">
      <div className="border-b border-primary/30 pb-3 flex justify-between items-center">
        <h2 className="font-serif text-xl uppercase tracking-widest text-primary flex items-center gap-2 font-bold">
          <Map className="h-5 w-5" /> Mapa do Mestre
        </h2>
        
        {mapImageBase64 && labels.length > 0 && (
          <div className="flex items-center gap-4 bg-muted/50 px-4 py-1.5 rounded-full border border-border">
            <Type className="h-4 w-4 text-muted-foreground" />
            <input 
              type="range" 
              min="8" 
              max="32" 
              value={labelSize} 
              onChange={(e) => setLabelSize(Number(e.target.value))}
              className="w-24 accent-primary"
            />
            <span className="text-[10px] font-mono text-muted-foreground w-6">{labelSize}px</span>
          </div>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

      {!mapImageBase64 ? (
        <div className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <Button variant="outline" className="border-primary text-primary font-bold">Carregar Mapa do Crime</Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Button size="sm" variant={isAddingLabel ? "default" : "outline"} onClick={() => { setIsAddingLabel(!isAddingLabel); setIsAddingToken(false); setSelectedTokenPlayer(''); }}>
              <Tag className="h-4 w-4 mr-2" /> Etiqueta
            </Button>
            <Button size="sm" variant={isAddingToken ? "default" : "outline"} onClick={() => { setIsAddingToken(!isAddingToken); setIsAddingLabel(false); setNewLabelText(''); }}>
              <Circle className="h-4 w-4 mr-2" /> Token
            </Button>
            
            <div className="ml-auto flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => fileInputRef.current?.click()} className="text-muted-foreground font-serif text-[10px] uppercase tracking-widest hover:text-primary">
                <Upload className="h-4 w-4 mr-2" /> Trocar
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { if(confirm("Limpar mapa?")) { setLabels([]); setTokens([]); setMapImageBase64(''); } }} className="text-destructive font-serif text-[10px] uppercase tracking-widest hover:bg-destructive/10">
                <Trash2 className="h-4 w-4 mr-2" /> Limpar
              </Button>
            </div>
          </div>

          {/* ETIQUETA: Instrução só aparece se começar a digitar */}
          {isAddingLabel && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <Input 
                value={newLabelText} 
                onChange={e => setNewLabelText(e.target.value)} 
                placeholder="Digite o nome do local..." 
                className="bg-input border-primary shadow-[0_0_10px_rgba(255,0,0,0.1)] h-11" 
                autoFocus 
              />
              {newLabelText.trim().length > 0 && (
                <p className="flex items-center gap-2 text-[11px] text-primary font-bold uppercase tracking-widest bg-primary/5 p-2 rounded border border-primary/20">
                  <MousePointer2 className="h-3 w-3 animate-bounce" /> Clique em qualquer lugar do mapa para fixar a etiqueta
                </p>
              )}
            </div>
          )}
          
          {/* TOKEN: Instrução só aparece se selecionar um jogador */}
          {isAddingToken && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
              <div className="flex gap-2 p-2 bg-card rounded-lg border border-primary/30 justify-center">
                {players.map(p => (
                  <button 
                    key={p.id} 
                    onClick={() => setSelectedTokenPlayer(p.id)} 
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedTokenPlayer === p.id ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`} 
                    style={{ backgroundColor: p.color }} 
                  />
                ))}
              </div>
              {selectedTokenPlayer && (
                <p className="flex items-center gap-2 text-[11px] text-primary font-bold uppercase tracking-widest bg-primary/5 p-2 rounded border border-primary/20 justify-center">
                  <MousePointer2 className="h-3 w-3 animate-bounce" /> Clique no mapa para posicionar o token
                </p>
              )}
            </div>
          )}

          <div 
            ref={mapRef} 
            className="relative border border-border rounded-lg overflow-hidden bg-black/40 select-none mx-auto w-full shadow-2xl group/map"
            onClick={handleMapClick}
          >
            <img src={mapImageBase64} alt="Map" className="w-full h-auto max-h-[75vh] object-contain pointer-events-none" />

            {labels.map((label) => {
              const isDragging = dragging?.id === label.id;
              const x = isDragging ? dragging.x : label.x;
              const y = isDragging ? dragging.y : label.y;

              return (
                <div
                  key={label.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${x}%`, top: `${y}%`, zIndex: isDragging ? 50 : 10 }}
                  onMouseDown={(e) => { e.stopPropagation(); setDragging({ id: label.id, type: 'label', x: label.x, y: label.y }); }}
                >
                  <div 
                    className="bg-background/95 border border-primary px-2 py-1 rounded shadow-xl flex items-center gap-1 cursor-grab active:cursor-grabbing whitespace-nowrap font-bold"
                    style={{ fontSize: `${labelSize}px` }}
                  >
                    <Move className="h-3 w-3 opacity-30" /> {label.text}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setLabels(labels.filter(l => l.id !== label.id)); }} className="absolute -top-2 -right-2 w-4 h-4 bg-destructive text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              );
            })}

            {tokens.map((token) => {
              const player = players.find(p => p.id === token.playerId);
              const isDragging = dragging?.id === token.id;
              const x = isDragging ? dragging.x : token.x;
              const y = isDragging ? dragging.y : token.y;

              return (
                <div
                  key={token.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${x}%`, top: `${y}%`, zIndex: isDragging ? 50 : 10 }}
                  onMouseDown={(e) => { e.stopPropagation(); setDragging({ id: token.id, type: 'token', x: token.x, y: token.y }); }}
                >
                  <div className="w-8 h-8 rounded-full border-2 border-white shadow-2xl flex items-center justify-center text-white text-xs font-black cursor-grab active:cursor-grabbing" style={{ backgroundColor: token.color }}>
                    {player?.name.charAt(0).toUpperCase()}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setTokens(tokens.filter(t => t.id !== token.id)); }} className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
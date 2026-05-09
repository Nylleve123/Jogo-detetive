'use client';

import { useState } from 'react';
import { Player, SharedGameData } from '@/lib/game-types';
import { InvestigationChecklist } from './investigation-checklist';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  EyeOff, 
  Lock,
  ChevronLeft,
  StickyNote 
} from 'lucide-react';

interface PlayerViewProps {
  gameData: SharedGameData;
}

export function PlayerView({ gameData }: PlayerViewProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showCards, setShowCards] = useState(false);
  
  const [notes, setNotes] = useLocalStorage<string>(
    selectedPlayer ? `detective-notes-${selectedPlayer.id}` : 'temp-notes', 
    ''
  );

  const getCardTypeLabel = (type: string) => {
    switch (type) {
      case 'character': return 'Personagem';
      case 'weapon': return 'Arma';
      case 'location': return 'Local';
      default: return type;
    }
  };

  if (!selectedPlayer) {
    // ... (mantenha a tela de seleção de jogador igual ao código anterior)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 shadow-lg">
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 mx-auto text-primary mb-3" />
            <h1 className="font-serif text-2xl uppercase tracking-widest text-primary">Dossiê Criminal</h1>
            <p className="text-sm text-muted-foreground mt-2">Selecione seu nome para entrar no sistema</p>
          </div>

          <div className="space-y-2">
            {gameData.players.map((player) => (
              <button
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className="w-full flex items-center gap-3 p-4 bg-muted hover:bg-muted/80 border border-border hover:border-primary/50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: player.color }}>
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-lg font-medium">{player.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: selectedPlayer.color }}>
              {selectedPlayer.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="font-serif text-sm uppercase tracking-widest text-primary">{selectedPlayer.name}</h1>
          </div>
          <Button onClick={() => {
            setSelectedPlayer(null);
            setShowCards(false);
          }} variant="ghost" size="sm" className="text-xs">
            <ChevronLeft className="h-4 w-4 mr-1" /> Trocar
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Seção de Cartas ocupando a largura total */}
        <section className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg uppercase tracking-widest text-primary flex items-center gap-2">
              {showCards ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              Minhas Cartas
            </h2>
            <Button onClick={() => setShowCards(!showCards)} size="sm" variant={showCards ? "default" : "outline"}>
              {showCards ? 'Esconder' : 'Revelar'}
            </Button>
          </div>

          {showCards ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedPlayer.cards.map((card) => (
                <div key={card.id} className="p-3 bg-muted border border-border rounded text-center">
                  <p className="font-medium text-foreground">{card.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{getCardTypeLabel(card.type)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border-2 border-dashed border-border rounded">
              <p className="text-xs text-muted-foreground uppercase">Cartas Ocultas para sua Segurança</p>
            </div>
          )}
        </section>

        {/* CONTAINER LADO A LADO: Checklist e Bloco de Notas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* LADO ESQUERDO: Checklist */}
          <section className="bg-card border border-border rounded-lg p-4 shadow-lg h-full">
            <InvestigationChecklist 
              characters={gameData.characters}
              weapons={gameData.weapons}
              locations={gameData.locations}
              players={[selectedPlayer]} 
              gameStarted={true}
              playerCards={selectedPlayer.cards}
            />
          </section>

          {/* LADO DIREITO: Bloco de Notas */}
          <section className="bg-card border border-border rounded-lg p-4 shadow-lg h-full flex flex-col">
            <div className="border-b border-primary/30 pb-3 mb-4">
              <h2 className="font-serif text-lg uppercase tracking-widest text-primary flex items-center gap-2">
                <StickyNote className="h-5 w-5" />
                Bloco de Notas
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Suas pistas e suspeitas (Salvo automaticamente)
              </p>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anotação..."
              className="w-full flex-1 min-h-[400px] p-4 bg-muted border border-border rounded-md text-sm text-foreground focus:ring-1 focus:ring-primary outline-none resize-none font-sans leading-relaxed"
            />
          </section>

        </div>
      </main>
    </div>
  );
}
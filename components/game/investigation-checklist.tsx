'use client';

import { useState, useEffect } from 'react';
import { Card, Player, ChecklistState } from '@/lib/game-types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Users, Sword, MapPin, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface InvestigationChecklistProps {
  characters: Card[];
  weapons: Card[];
  locations: Card[];
  players: Player[];
  gameStarted: boolean;
  playerCards?: Card[]; 
}

export function InvestigationChecklist({
  characters,
  weapons,
  locations,
  players,
  gameStarted,
  playerCards = [], 
}: InvestigationChecklistProps) {
  const [checklist, setChecklist] = useLocalStorage<ChecklistState>('detetive-checklist-data', {});
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState({
    characters: true,
    weapons: true,
    locations: true,
  });

  useEffect(() => {
    if (players.length > 0 && !selectedPlayer) {
      setSelectedPlayer(players[0].id);
    }
  }, [players, selectedPlayer]);

  const toggleCheck = (cardId: string) => {
    if (!selectedPlayer) return;
    
    setChecklist(prev => {
      const currentPlayerChecks = prev[selectedPlayer] || {};
      return {
        ...prev,
        [selectedPlayer]: {
          ...currentPlayerChecks,
          [cardId]: !currentPlayerChecks[cardId],
        },
      };
    });
  };

  const isChecked = (cardId: string): boolean => {
    return checklist[selectedPlayer]?.[cardId] ?? false;
  };

  const clearChecklist = () => {
    if (selectedPlayer && confirm("Limpar suas marcações deste jogador?")) {
      setChecklist(prev => ({
        ...prev,
        [selectedPlayer]: {},
      }));
    }
  };

  const toggleSection = (section: 'characters' | 'weapons' | 'locations') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const allCards = [...characters, ...weapons, ...locations];
  const checkedCount = selectedPlayer ? allCards.filter(card => isChecked(card.id)).length : 0;

  const renderSection = (
    title: string,
    cards: Card[],
    icon: React.ReactNode,
    sectionKey: 'characters' | 'weapons' | 'locations'
  ) => {
    const isExpanded = expandedSections[sectionKey];
    const sectionCheckedCount = cards.filter(card => isChecked(card.id)).length;

    return (
      <div className="border border-border rounded overflow-hidden mb-3">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            {icon}
            <span className="uppercase tracking-wider font-serif">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {sectionCheckedCount}/{cards.length}
            </span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>
        
        {isExpanded && (
          <div className="divide-y divide-border bg-card">
            {cards.map((card) => {
              const isMyCard = playerCards.some(pc => pc.id === card.id);

              return (
                <button
                  key={card.id}
                  onClick={() => toggleCheck(card.id)}
                  className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                    isMyCard ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-primary/5'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      isChecked(card.id) ? 'bg-primary border-primary' : 'border-border'
                    }`}
                  >
                    {isChecked(card.id) && <span className="text-primary-foreground text-xs font-bold">✕</span>}
                  </div>
                  <span className={`text-sm flex-1 ${isChecked(card.id) ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {card.name}
                    {isMyCard && (
                      <span className="ml-2 text-[10px] text-primary uppercase font-bold tracking-tighter">
                        (sua carta)
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto pb-20">
      <div className="border-b border-primary/30 pb-3">
        <h2 className="font-serif text-xl uppercase tracking-widest text-primary flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5" />
          Checklist
        </h2>
      </div>

      {players.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Investigador</label>
          <div className="flex flex-wrap gap-2">
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => setSelectedPlayer(player.id)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                  selectedPlayer === player.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: player.color, color: '#fff' }}
              >
                {player.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm py-2">
        <span className="text-muted-foreground">Descartados: <span className="text-primary font-medium">{checkedCount}</span></span>
        <Button onClick={clearChecklist} size="sm" variant="ghost" className="text-xs hover:text-destructive">
          <Trash2 className="h-3 w-3 mr-1" /> Limpar
        </Button>
      </div>

      <div className="space-y-1">
        {renderSection('Suspeitos', characters, <Users className="h-4 w-4 text-primary" />, 'characters')}
        {renderSection('Armas', weapons, <Sword className="h-4 w-4 text-primary" />, 'weapons')}
        {renderSection('Locais', locations, <MapPin className="h-4 w-4 text-primary" />, 'locations')}
      </div>
    </div>
  );
}
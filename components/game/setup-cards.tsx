'use client';

import { useState } from 'react';
import { Card } from '@/lib/game-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Users, Sword, MapPin, Trash2 } from 'lucide-react';

interface SetupCardsProps {
  title: string;
  type: 'character' | 'weapon' | 'location';
  cards: Card[];
  onCardsChange: (cards: Card[]) => void;
  icon: React.ReactNode;
}

function SetupCardsSection({ title, type, cards, onCardsChange, icon }: SetupCardsProps) {
  const [inputValue, setInputValue] = useState('');

  const addCard = () => {
    if (inputValue.trim()) {
      const newCard: Card = {
        id: `${type}-${Date.now()}`,
        name: inputValue.trim(),
        type,
      };
      onCardsChange([...cards, newCard]);
      setInputValue('');
    }
  };

  const removeCard = (id: string) => {
    onCardsChange(cards.filter(card => card.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCard();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-primary">
        <div className="scale-125">{icon}</div>
        <h3 className="font-serif text-xl uppercase tracking-wider font-bold">{title}</h3>
        <span className="ml-auto text-base font-mono text-muted-foreground bg-muted px-2 rounded">({cards.length})</span>
      </div>
      
      <div className="flex gap-3">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Adicionar ${title.toLowerCase().slice(0, -1)}...`}
          className="flex-1 bg-input border-border font-sans h-12 text-lg"
        />
        <Button
          onClick={addCard}
          size="icon"
          variant="outline"
          className="h-12 w-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar border border-border/20 rounded-lg p-2 bg-black/5">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="flex items-center gap-4 px-4 py-3 bg-muted/30 border border-border rounded-lg group hover:border-primary transition-colors"
          >
            <span className="text-sm text-muted-foreground font-mono w-8 font-bold">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="flex-1 font-sans text-lg font-medium">{card.name}</span>
            <button
              onClick={() => removeCard(card.id)}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
        {cards.length === 0 && (
          <p className="text-center text-muted-foreground text-base py-6 italic">
            Nenhum item adicionado
          </p>
        )}
      </div>
    </div>
  );
}

interface SetupPanelProps {
  characters: Card[];
  weapons: Card[];
  locations: Card[];
  onCharactersChange: (cards: Card[]) => void;
  onWeaponsChange: (cards: Card[]) => void;
  onLocationsChange: (cards: Card[]) => void;
  onClearAll: () => void; // NOVIDADE AQUI
}

export function SetupPanel({
  characters,
  weapons,
  locations,
  onCharactersChange,
  onWeaponsChange,
  onLocationsChange,
  onClearAll, // NOVIDADE AQUI
}: SetupPanelProps) {
  
  const handleClearAll = () => {
    if (window.confirm("Deseja realmente APAGAR TODAS as cartas configuradas?")) {
        onClearAll(); // Chama a função que criamos no page.tsx
    }
  };

  const hasAnyCard = characters.length > 0 || weapons.length > 0 || locations.length > 0;

  return (
    <div className="space-y-10">
      <div className="border-b border-primary/30 pb-5 flex justify-between items-end">
        <div>
          <h2 className="font-serif text-3xl uppercase tracking-widest text-primary flex items-center gap-3 font-bold">
            <span className="text-4xl">📋</span>
            Configurar Cartas
          </h2>
          <p className="text-lg text-muted-foreground mt-2">
            Adicione os elementos do crime para iniciar a partida
          </p>
        </div>
        
        {hasAnyCard && (
          <Button 
            variant="ghost" 
            onClick={handleClearAll}
            className="text-destructive hover:bg-destructive/10 font-serif uppercase tracking-widest text-xs font-bold gap-2 animate-in fade-in duration-300"
          >
            <Trash2 className="h-4 w-4" /> Limpar Tudo
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-12">
        <SetupCardsSection
          title="Personagens"
          type="character"
          cards={characters}
          onCardsChange={onCharactersChange}
          icon={<Users className="h-6 w-6" />}
        />

        <SetupCardsSection
          title="Armas"
          type="weapon"
          cards={weapons}
          onCardsChange={onWeaponsChange}
          icon={<Sword className="h-6 w-6" />}
        />

        <SetupCardsSection
          title="Locais"
          type="location"
          cards={locations}
          onCardsChange={onLocationsChange}
          icon={<MapPin className="h-6 w-6" />}
        />
      </div>
    </div>
  );
}
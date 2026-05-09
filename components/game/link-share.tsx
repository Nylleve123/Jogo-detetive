'use client';

import { useState } from 'react';
import { Player, Card, Crime, PLAYER_COLORS } from '@/lib/game-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Link2, 
  Users, 
  Shuffle, 
  Plus, 
  X, 
  AlertTriangle,
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';

interface LinkShareProps {
  characters: Card[];
  weapons: Card[];
  locations: Card[];
  onStartGame: (players: Player[], crime: Crime) => void;
  currentLink?: string;
}

export function LinkShare({
  characters,
  weapons,
  locations,
  onStartGame,
  currentLink,
}: LinkShareProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(['', '', '']);
  const [copied, setCopied] = useState(false);

  const isGameGenerated = !!currentLink;

  const canStartGame = () => {
    const validPlayers = playerNames.filter(name => name.trim() !== '');
    return (
      characters.length >= 3 &&
      weapons.length >= 3 &&
      locations.length >= 3 &&
      validPlayers.length >= 2
    );
  };

  const addPlayer = () => {
    if (playerNames.length < 8) {
      setPlayerNames([...playerNames, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const generateGame = () => {
    const validPlayers = playerNames
      .filter(name => name.trim() !== '')
      .map((name, index) => ({
        id: `player-${index}`,
        name: name.trim(),
        cards: [] as Card[],
        color: PLAYER_COLORS[index % PLAYER_COLORS.length],
      }));

    const crimeCharacter = characters[Math.floor(Math.random() * characters.length)];
    const crimeWeapon = weapons[Math.floor(Math.random() * weapons.length)];
    const crimeLocation = locations[Math.floor(Math.random() * locations.length)];

    const newCrime: Crime = {
      character: crimeCharacter,
      weapon: crimeWeapon,
      location: crimeLocation,
    };

    const remainingCharacters = characters.filter(c => c.id !== crimeCharacter.id);
    const remainingWeapons = weapons.filter(w => w.id !== crimeWeapon.id);
    const remainingLocations = locations.filter(l => l.id !== crimeLocation.id);

    const shuffledCards = [...remainingCharacters, ...remainingWeapons, ...remainingLocations].sort(() => Math.random() - 0.5);
    const playersWithCards = validPlayers.map(player => ({ ...player, cards: [] as Card[] }));

    shuffledCards.forEach((card, index) => {
      const playerIndex = index % playersWithCards.length;
      playersWithCards[playerIndex].cards.push(card);
    });

    onStartGame(playersWithCards, newCrime);
  };

  const copyToClipboard = async () => {
    if (!currentLink) return;
    try {
      await navigator.clipboard.writeText(currentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { console.error(err); }
  };

  if (isGameGenerated && currentLink) {
    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="border-b border-primary/30 pb-5">
          <h2 className="font-serif text-3xl uppercase tracking-widest text-primary flex items-center gap-4 font-black">
            <CheckCircle className="h-8 w-8" />
            PARTIDA CRIADA!
          </h2>
          <p className="text-muted-foreground mt-2 font-serif text-lg opacity-80">
            O mistério está pronto. Compartilhe o link com os investigadores.
          </p>
        </div>

        <div className="p-8 bg-primary/5 border-2 border-primary/20 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
             <Link2 className="h-24 w-24 rotate-12" />
          </div>
          
          <div className="relative z-10 space-y-5">
            <p className="text-xl text-foreground font-serif font-black leading-tight uppercase tracking-tight">
              Link de Acesso:<br />
              <span className="text-primary/70 text-base font-sans font-medium italic">Envie para cada jogador abrir no próprio celular ou computador.</span>
            </p>
            
            <div className="flex gap-3">
              <Input 
                value={currentLink} 
                readOnly 
                className="flex-1 bg-background/80 border-primary/30 h-14 text-sm font-mono" 
              />
              <Button onClick={copyToClipboard} className="h-14 w-20 bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/20 transition-all active:scale-95">
                {copied ? <Check className="h-7 w-7" /> : <Copy className="h-7 w-7" />}
              </Button>
            </div>
            {copied && <p className="text-sm text-primary mt-3 font-black animate-pulse uppercase tracking-[0.2em] text-center">Copiado para a área de transferência!</p>}
          </div>
        </div>

        <div className="space-y-5 py-6 px-4 bg-muted/10 rounded-xl border border-border/50 font-sans">
          <div className="flex items-start gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shadow-[0_0_12px_rgba(255,0,0,0.8)]" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              Cada jogador abre no <span className="text-foreground font-black">celular ou computador</span>
            </p>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shadow-[0_0_12px_rgba(255,0,0,0.8)]" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              Seleciona o seu nome para <span className="text-foreground font-black">ver suas cartas</span>
            </p>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shadow-[0_0_12px_rgba(255,0,0,0.8)]" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              <span className="text-foreground font-black">SEJA HONESTO VEJA APENAS AS SUAS CARTAS</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 font-sans">
      <div className="border-b border-primary/30 pb-6">
        <h2 className="font-serif text-3xl uppercase tracking-[0.15em] text-primary flex items-center gap-4 font-black">
          <Link2 className="h-8 w-8" />
          Gerar Link
        </h2>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-4">
            <Users className="h-6 w-6 text-primary" />
            JOGADORES ({playerNames.filter(n => n.trim()).length})
          </h3>
          <Button onClick={addPlayer} size="lg" variant="outline" className="font-black border-primary text-primary hover:bg-primary/10 px-6">
            <Plus className="h-5 w-5 mr-2" /> Adicionar
          </Button>
        </div>

        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
          {playerNames.map((name, index) => (
            <div key={index} className="flex items-center gap-4 group animate-in slide-in-from-left-2 duration-300">
              <div 
                className="w-5 h-5 rounded-full ring-2 ring-offset-2 ring-offset-background ring-background/50 shadow-lg" 
                style={{ backgroundColor: PLAYER_COLORS[index % PLAYER_COLORS.length], boxShadow: `0 0 15px ${PLAYER_COLORS[index % PLAYER_COLORS.length]}60` }} 
              />
              <Input
                value={name}
                onChange={(e) => updatePlayerName(index, e.target.value)}
                placeholder={`Nome do Investigador ${index + 1}`}
                className="flex-1 bg-muted/20 h-14 text-lg font-bold border-border/40 group-hover:border-primary/50 transition-all focus:bg-background"
              />
              {playerNames.length > 2 && (
                <button onClick={() => removePlayer(index)} className="text-muted-foreground hover:text-destructive p-3 transition-colors bg-muted/10 rounded-lg">
                  <X className="h-6 w-6" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PAINEL DE PENDÊNCIAS: SÓ APARECE SE NÃO PUDER COMEÇAR */}
      {!canStartGame() ? (
        <div className="p-8 bg-destructive/10 border-2 border-destructive/20 rounded-2xl text-destructive animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 mb-6 border-b border-destructive/20 pb-4">
             <AlertTriangle className="h-7 w-7 animate-pulse"/> 
             <p className="font-black uppercase tracking-[0.2em] text-lg">Itens Pendentes</p>
          </div>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-3 font-black uppercase tracking-widest text-sm font-sans">
            <li className={characters.length < 3 ? "flex items-center gap-2" : "opacity-30 flex items-center gap-2 line-through"}>
              <div className="w-2 h-2 rounded-full bg-destructive" /> 3 Personagens
            </li>
            <li className={weapons.length < 3 ? "flex items-center gap-2" : "opacity-30 flex items-center gap-2 line-through"}>
              <div className="w-2 h-2 rounded-full bg-destructive" /> 3 Armas
            </li>
            <li className={locations.length < 3 ? "flex items-center gap-2" : "opacity-30 flex items-center gap-2 line-through"}>
              <div className="w-2 h-2 rounded-full bg-destructive" /> 3 Locais
            </li>
            <li className={playerNames.filter(n => n.trim()).length < 2 ? "flex items-center gap-2" : "opacity-30 flex items-center gap-2 line-through"}>
              <div className="w-2 h-2 rounded-full bg-destructive" /> 2 Jogadores
            </li>
          </ul>
        </div>
      ) : (
        /* BOTÃO DE SORTEIO: SÓ APARECE QUANDO TUDO ESTÁ OK */
        <div className="animate-in zoom-in-95 fade-in slide-in-from-bottom-6 duration-700">
           <Button
            onClick={generateGame}
            className={`
              w-full h-24 relative overflow-hidden transition-all duration-500 group
              font-serif text-2xl uppercase tracking-[0.4em] font-black
              border-b-4 border-primary/40 active:border-b-0 active:translate-y-1
              bg-gradient-to-r from-primary via-red-600 to-primary bg-[length:200%_100%] animate-shimmer 
              shadow-[0_0_30px_rgba(255,0,0,0.3)] hover:shadow-[0_0_50px_rgba(255,0,0,0.5)] text-primary-foreground
            `}
          >
            <div className="absolute inset-0 border-t border-white/20 rounded-md pointer-events-none" />
            
            <div className="relative z-10 flex items-center justify-center gap-4">
              <Shuffle className="h-9 w-9 group-hover:rotate-180 transition-transform duration-700" />
              <span>Sorteio e Link</span>
            </div>

            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-scan" />
          </Button>
          <p className="text-center text-primary text-[10px] mt-4 font-black uppercase tracking-[0.3em] animate-pulse">
            Configuração Completa — Pronto para Iniciar
          </p>
        </div>
      )}
    </div>
  );
}
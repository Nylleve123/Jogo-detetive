'use client';

import { useState, useEffect } from 'react';
import { Card, Player, Crime, GameState, SharedGameData } from '@/lib/game-types';
import { getGameDataFromUrl, hasSharedGameData, generateGameUrl } from '@/lib/game-url';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { SetupPanel } from '@/components/game/setup-cards';
import { LinkShare } from '@/components/game/link-share';
import { PlayerView } from '@/components/game/player-view';
import { MasterMap } from '@/components/game/master-map';
import { CrimeRevealModal, RevealCrimeButton } from '@/components/game/crime-reveal-modal';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  X, 
  FileText, 
  Link2, 
  Map,
  Skull,
  RefreshCcw,
  Users,
  Sword,
  AlertTriangle,
  Unlock
} from 'lucide-react';

export default function DetectiveGame() {
  const [activeTab, setActiveTab] = useState<'setup' | 'game' | 'map'>('setup');
  const [gameState, setGameState] = useLocalStorage<GameState>('detective-game-state', {
    characters: [], weapons: [], locations: [], players: [], crime: null, gameStarted: false,
  });
  
  const [mapImageBase64, setMapImageBase64] = useLocalStorage<string>('detective-map-image', '');
  const [generatedUrl, setGeneratedUrl] = useLocalStorage<string>('detective-game-url', '');
  const [isHydrated, setIsHydrated] = useState(false);
  const [sharedGameData, setSharedGameData] = useState<SharedGameData | null>(null);
  const [isPlayerView, setIsPlayerView] = useState(false);
  const [showCrimeReveal, setShowCrimeReveal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const revelarCrime = () => { setShowCrimeReveal(true); };

  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== 'undefined' && hasSharedGameData()) {
      const data = getGameDataFromUrl();
      if (data) { setSharedGameData(data); setIsPlayerView(true); }
    }
  }, []);

  const handleStartGame = (players: Player[], crime: Crime) => {
    const sharedData: SharedGameData = { characters: gameState.characters, weapons: gameState.weapons, locations: gameState.locations, players };
    const url = generateGameUrl(sharedData);
    setGeneratedUrl(url);
    setGameState({ ...gameState, players, crime, gameStarted: true });
  };

  const handleClearCards = () => {
    setGameState({
      ...gameState,
      characters: [],
      weapons: [],
      locations: [],
      crime: null,
      gameStarted: false,
    });
    setGeneratedUrl('');
    localStorage.removeItem('detective-game-url');
  };

  const handleRematch = () => {
    if (confirm("Deseja sortear um NOVO CRIME mantendo os mesmos jogadores e cartas?")) {
      setGameState({
        ...gameState,
        crime: null,
        gameStarted: false,
      });
      setGeneratedUrl('');
      localStorage.removeItem('detective-game-url');
      setActiveTab('game');
    }
  };

  const handleResetGame = () => {
    if (confirm("Deseja iniciar uma NOVA PARTIDA? Isso apagará TODOS os nomes e cartas.")) {
      setGameState({ characters: [], weapons: [], locations: [], players: [], crime: null, gameStarted: false });
      setGeneratedUrl('');
      localStorage.removeItem('detective-game-url');
      setActiveTab('setup');
    }
  };

  if (!isHydrated) return null;
  if (isPlayerView && sharedGameData) return <PlayerView gameData={sharedGameData} />;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border py-4 font-sans">
        <div className="max-w-[1600px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 text-primary">
            <Search className="h-10 w-10" />
            <div>
              <h1 className="font-serif text-3xl uppercase tracking-widest font-black">Dossiê Criminal</h1>
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold opacity-70">Painel do Mestre</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-3">
            <Button onClick={() => setActiveTab('setup')} variant={activeTab === 'setup' ? 'default' : 'ghost'} className="font-serif uppercase tracking-widest h-12 px-6 text-base font-bold">
              <FileText className="h-5 w-5 mr-3" /> Cartas
            </Button>
            <Button onClick={() => setActiveTab('game')} variant={activeTab === 'game' ? 'default' : 'ghost'} className="font-serif uppercase tracking-widest h-12 px-6 text-base font-bold">
              <Link2 className="h-5 w-5 mr-3" /> Link
            </Button>
            <Button onClick={() => setActiveTab('map')} variant={activeTab === 'map' ? 'default' : 'ghost'} className="font-serif uppercase tracking-widest h-12 px-6 text-base font-bold">
              <Map className="h-5 w-5 mr-3" /> Mapa
            </Button>

            <div className="flex items-center gap-3 border-l border-border/50 ml-6 pl-6">
               <Button variant="outline" size="sm" onClick={handleRematch} disabled={!gameState.gameStarted} className="border-primary/50 text-primary hover:bg-primary/10 h-12 px-6 font-bold text-base">
                 <RefreshCcw className="h-5 w-5 mr-3" /> Revanche
               </Button>
               <Button variant="outline" size="sm" onClick={handleResetGame} className="border-destructive/30 text-destructive hover:bg-destructive/10 h-12 px-6 font-bold text-base">
                 <X className="h-5 w-5 mr-3" /> Nova Partida
               </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-12 font-sans">
        <div className="flex flex-col lg:flex-row gap-12 justify-center items-start">
          
          {activeTab !== 'map' && (
            <aside className="w-full lg:w-[450px] space-y-8 flex-shrink-0">
              <div className="bg-card border-2 border-border rounded-2xl p-8 shadow-2xl space-y-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
                <div className="border-b border-primary/30 pb-4 text-center">
                  <h3 className="font-serif text-lg uppercase tracking-[0.2em] text-primary font-black">Resumo do Dossiê</h3>
                </div>

                <div className="space-y-6">
                  <h4 className="text-sm uppercase text-muted-foreground font-black tracking-widest border-l-4 border-primary pl-4">Investigadores ({gameState.players.length})</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {gameState.players.map(p => (
                      <div key={p.id} className="flex items-center gap-4 text-lg bg-muted/20 p-4 rounded-xl border border-border/40 font-bold">
                        <div className="w-4 h-4 rounded-full ring-4 ring-background shadow-lg" style={{ backgroundColor: p.color }} />
                        <span className="text-foreground/90">{p.name}</span>
                        <span className="ml-auto text-xs font-black uppercase bg-background px-3 py-1 rounded-full border border-border">{p.cards.length} cartas</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-10 pt-4 border-t border-border/30">
                  {[{ label: 'Personagens', data: gameState.characters, icon: <Users className="h-5 w-5" /> }, { label: 'Armas', data: gameState.weapons, icon: <Sword className="h-5 w-5" /> }, { label: 'Locais', data: gameState.locations, icon: <Map className="h-5 w-5" /> }].map((cat) => (
                    <div key={cat.label} className="space-y-4">
                      <h4 className="text-sm uppercase text-primary font-black tracking-widest flex items-center gap-3">
                        {cat.icon} {cat.label} ({cat.data.length})
                      </h4>
                      <div className="flex flex-col gap-2 pl-4">
                        {cat.data.map(item => (
                          <div key={item.id} className="text-base text-foreground/80 font-bold border-l-2 border-primary/40 pl-4 py-1">{item.name}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          )}

          <section className={`w-full ${activeTab === 'map' ? 'max-w-full' : 'max-w-4xl'}`}>
             <div className="bg-card border-2 border-border rounded-2xl p-12 shadow-xl min-h-[70vh]">
                {activeTab === 'setup' && (
                  <SetupPanel 
                    characters={gameState.characters} 
                    weapons={gameState.weapons} 
                    locations={gameState.locations} 
                    onCharactersChange={(cards) => setGameState({ ...gameState, characters: cards })} 
                    onWeaponsChange={(cards) => setGameState({ ...gameState, weapons: cards })} 
                    onLocationsChange={(cards) => setGameState({ ...gameState, locations: cards })}
                    onClearAll={handleClearCards}
                  />
                )}
                {activeTab === 'game' && <LinkShare characters={gameState.characters} weapons={gameState.weapons} locations={gameState.locations} mapImageBase64={mapImageBase64} onStartGame={handleStartGame} currentLink={generatedUrl} />}
                
                {activeTab === 'map' && (
                  <div className="flex flex-col lg:flex-row gap-12 items-start font-sans">
                    <div className="flex-1 w-full flex flex-col items-center"><MasterMap players={gameState.players} onMapImageChange={setMapImageBase64} /></div>
                    <div className="w-full lg:w-80 space-y-8 flex-shrink-0">
                      {gameState.gameStarted && gameState.crime && (
                        <div className="p-6 bg-card border-2 border-primary/50 rounded-2xl shadow-xl font-sans">
                          <div className="flex items-center gap-3 text-primary mb-6 border-b border-primary/20 pb-4">
                            <Skull className="h-6 w-6" /><span className="font-serif uppercase tracking-widest text-sm font-black">Revelar Culpado</span>
                          </div>
                          <RevealCrimeButton crime={gameState.crime} gameStarted={gameState.gameStarted} onReveal={() => setShowConfirmModal(true)} />
                        </div>
                      )}
                      <div className="p-6 bg-card border-2 border-border rounded-2xl shadow-xl font-sans">
                        <div className="flex items-center gap-3 text-primary mb-6 border-b border-primary/20 pb-4">
                          <Users className="h-6 w-6" /><span className="font-serif uppercase tracking-widest text-sm font-black">Legenda</span>
                        </div>
                        <div className="space-y-4">
                          {gameState.players.map(p => (
                            <div key={p.id} className="flex items-center gap-4 text-base bg-muted/20 p-3 rounded-xl border border-border/20 font-bold">
                              <div className="w-4 h-4 rounded-full ring-2 ring-background" style={{ backgroundColor: p.color }} />
                              <span className="truncate">{p.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
             </div>
          </section>
        </div>
      </main>

      {showConfirmModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 font-sans">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setShowConfirmModal(false)} />
          <div className="relative bg-card border-4 border-destructive rounded-3xl p-10 max-w-xl w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 animate-pulse"><AlertTriangle className="h-10 w-10 text-destructive" /></div>
              <div className="flex-1"><h3 className="font-serif text-3xl uppercase tracking-tighter text-foreground font-black">Encerrar Investigação?</h3><p className="text-lg text-muted-foreground mt-2">Deseja encerrar a investigação e revelar o culpado? Isso mostrará a solução do crime para todos.</p></div>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => setShowConfirmModal(false)} variant="outline" className="flex-1 font-serif uppercase tracking-widest h-16 text-lg border-2 font-bold">Cancelar</Button>
              <Button onClick={() => { setShowConfirmModal(false); revelarCrime(); }} className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive font-serif uppercase tracking-widest h-16 text-lg font-bold shadow-xl"><Unlock className="h-6 w-6 mr-3" /> Revelar</Button>
            </div>
          </div>
        </div>
      )}

      <CrimeRevealModal crime={gameState.crime} isOpen={showCrimeReveal} onClose={() => setShowCrimeReveal(false)} />
    </div>
  );
}
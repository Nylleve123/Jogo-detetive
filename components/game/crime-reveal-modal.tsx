'use client';

import { useState, useEffect } from 'react';
import { Crime } from '@/lib/game-types';
import { Button } from '@/components/ui/button';
import { 
  Lock, 
  Unlock,
  X,
  Skull,
  User,
  Crosshair,
  MapPin
} from 'lucide-react';

interface CrimeRevealModalProps {
  crime: Crime | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CrimeRevealModal({ crime, isOpen, onClose }: CrimeRevealModalProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowContent(true), 100);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen || !crime) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Principal */}
      <div 
        className={`relative w-full max-w-2xl transform transition-all duration-1000 ease-out ${
          showContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-8 w-8" />
        </button>

        <div className="bg-card border-4 border-primary/40 rounded-lg overflow-hidden shadow-2xl shadow-primary/10">
          {/* Header */}
          <div className="bg-primary/5 border-b border-primary/20 p-8 text-center">
            <div className="flex justify-center mb-4">
              <Skull className="h-20 w-20 text-primary opacity-80 animate-pulse" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl uppercase tracking-[0.2em] text-primary font-black">
              O Crime Foi Solucionado!
            </h2>
            <p className="text-muted-foreground mt-2 uppercase tracking-widest text-sm font-bold opacity-60">
              Dossiê Finalizado
            </p>
          </div>

          {/* Grid de Evidências com animação demorada */}
          <div className="p-6 md:p-10 space-y-4">
            
            {/* Assassino - DELAY MAIOR */}
            <div className={`transform transition-all duration-1000 delay-[800ms] ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="flex items-center gap-6 p-5 bg-muted/20 border border-border rounded-lg group">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0 border border-border">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1 font-bold">O Assassino</p>
                  <p className="font-serif text-2xl text-foreground uppercase tracking-wider font-black">{crime.character.name}</p>
                </div>
              </div>
            </div>

            {/* Arma - DELAY MAIORA */}
            <div className={`transform transition-all duration-1000 delay-[1800ms] ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="flex items-center gap-6 p-5 bg-muted/20 border border-border rounded-lg group">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0 border border-border">
                  <Crosshair className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1 font-bold">A Arma do Crime</p>
                  <p className="font-serif text-2xl text-foreground uppercase tracking-wider font-black">{crime.weapon.name}</p>
                </div>
              </div>
            </div>

            {/* Local - DELAY MAIOR */}
            <div className={`transform transition-all duration-1000 delay-[2800ms] ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="flex items-center gap-6 p-5 bg-muted/20 border border-border rounded-lg group">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0 border border-border">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1 font-bold">Local do Crime</p>
                  <p className="font-serif text-2xl text-foreground uppercase tracking-wider font-black">{crime.location.name}</p>
                </div>
              </div>
            </div>

            {/* Resumo Final - SÓ APARECE NO FINAL DE TUDO */}
            <div className={`transform transition-all duration-1000 delay-[4000ms] ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="mt-8 pt-8 border-t border-border/50 text-center">
                <p className="text-muted-foreground text-[10px] uppercase tracking-[0.4em] mb-4 font-bold opacity-50">Resumo da Ocorrência</p>
                <p className="font-serif text-xl md:text-2xl text-foreground leading-relaxed italic">
                  "<span className="text-primary font-black not-italic">{crime.character.name}</span>
                  {' '}matou a vítima com{' '}
                  <span className="text-primary font-black not-italic">{crime.weapon.name}</span>
                  {' '}no local{' '}
                  <span className="text-primary font-black not-italic">{crime.location.name}</span>."
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 border-t border-border p-4 text-center">
            <p className="text-[10px] text-muted-foreground font-serif uppercase tracking-[0.4em] font-bold">
              Confidencial — Somente para Olhos Autorizados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RevealCrimeButtonProps {
  crime: Crime | null;
  gameStarted: boolean;
  onReveal: () => void;
}

export function RevealCrimeButton({ crime, gameStarted, onReveal }: RevealCrimeButtonProps) {
  if (!gameStarted || !crime) {
    return (
      <Button disabled className="w-full bg-muted text-muted-foreground font-serif uppercase tracking-widest cursor-not-allowed opacity-50" size="lg">
        <Lock className="h-5 w-5 mr-2" /> Envelope Selado
      </Button>
    );
  }

  return (
    <Button
      onClick={onReveal} 
      className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 font-serif uppercase tracking-[0.2em] font-black group transition-all duration-300 shadow-xl"
      size="lg"
    >
      <Unlock className="h-5 w-5 mr-2" />
      Revelar Solução
    </Button>
  );
}
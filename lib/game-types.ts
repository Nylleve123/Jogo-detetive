export interface Card {
  id: string;
  name: string;
  type: 'character' | 'weapon' | 'location';
}

export interface Player {
  id: string;
  name: string;
  cards: Card[];
  color: string;
}

export interface Crime {
  character: Card;
  weapon: Card;
  location: Card;
}

export interface GameState {
  characters: Card[];
  weapons: Card[];
  locations: Card[];
  players: Player[];
  crime: Crime | null;
  gameStarted: boolean;
}

// Dados codificados no link compartilhável
export interface SharedGameData {
  characters: Card[];
  weapons: Card[];
  locations: Card[];
  players: Player[];
  mapImageBase64?: string;
}

export interface ChecklistState {
  [playerId: string]: {
    [cardId: string]: boolean;
  };
}

export interface MapLabel {
  id: string;
  text: string;
  x: number;
  y: number;
}

export interface MapToken {
  id: string;
  playerId: string;
  color: string;
  x: number;
  y: number;
}

export const PLAYER_COLORS = [
  '#dc2626', // vermelho
  '#2563eb', // azul
  '#16a34a', // verde
  '#eab308', // amarelo
  '#9333ea', // roxo
  '#ea580c', // laranja
  '#06b6d4', // ciano
  '#ec4899', // rosa
];

import { SharedGameData, Card, Player } from './game-types';

/**
 * Codifica os dados do jogo em uma string Base64 para o link compartilhável
 * Esta função é chamada quando o mestre sorteia a partida e gera o link
 */
export function encodeGameData(data: SharedGameData): string {
  try {
    const jsonString = JSON.stringify(data);
    // Usar TextEncoder para lidar com caracteres Unicode
    const bytes = new TextEncoder().encode(jsonString);
    const binaryString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    return btoa(binaryString);
  } catch (error) {
    console.error('Erro ao codificar dados do jogo:', error);
    throw new Error('Falha ao gerar link do jogo');
  }
}

/**
 * Decodifica a string Base64 da URL para obter os dados do jogo
 * Esta função é chamada quando um jogador acessa o link compartilhado
 */
export function decodeGameData(encodedData: string): SharedGameData | null {
  try {
    const binaryString = atob(encodedData);
    const bytes = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));
    const jsonString = new TextDecoder().decode(bytes);
    const data = JSON.parse(jsonString) as SharedGameData;
    
    // Validação básica dos dados
    if (!data.characters || !data.weapons || !data.locations || !data.players) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao decodificar dados do jogo:', error);
    return null;
  }
}

/**
 * Gera a URL completa do jogo com os dados codificados
 */
export function generateGameUrl(data: SharedGameData): string {
  const encoded = encodeGameData(data);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}?game=${encoded}`;
}

/**
 * Extrai os dados do jogo da URL atual
 */
export function getGameDataFromUrl(): SharedGameData | null {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const gameData = urlParams.get('game');
  
  if (!gameData) return null;
  
  return decodeGameData(gameData);
}

/**
 * Verifica se a URL atual contém dados de jogo compartilhado
 */
export function hasSharedGameData(): boolean {
  if (typeof window === 'undefined') return false;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('game');
}

/**
 * Gera uma chave única para o localStorage baseada no nome do jogador e dados do jogo
 * Isso garante que cada jogador tenha seu próprio checklist privado
 */
export function getPlayerChecklistKey(playerName: string, gameId: string): string {
  // Cria um hash simples dos dados para identificar a partida
  return `detective-checklist-${gameId}-${playerName.toLowerCase().replace(/\s+/g, '-')}`;
}

/**
 * Gera um ID único para a partida baseado nos jogadores
 */
export function generateGameId(players: Player[]): string {
  const playerNames = players.map(p => p.name).sort().join('-');
  const timestamp = Date.now().toString(36);
  return `${playerNames}-${timestamp}`.substring(0, 32);
}

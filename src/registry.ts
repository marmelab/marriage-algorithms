import { Player, rank, hasCandidate } from './player';

export type Registry = { [playername: string]: Player[] };
export type Matching = { [playername: string]: string[] };

export const createRegistry = (): Registry => ({});

export const engage = (registry: Registry, player1: Player, player2: Player): void => {
    if (!registry.hasOwnProperty(player1.name)) {
        registry[player1.name] = [];
    }
    if (!registry.hasOwnProperty(player2.name)) {
        registry[player2.name] = [];
    }

    registry[player1.name].push(player2);
    registry[player2.name].push(player1);
};

export const disengage = (registry: Registry, player1: Player, player2: Player): void => {
    const indexPlayer2 = registry[player1.name].indexOf(player2);
    const indexPlayer1 = registry[player2.name].indexOf(player1);

    registry[player1.name].splice(indexPlayer2, 1);
    registry[player2.name].splice(indexPlayer1, 1);
};

const numberOfEngagments = (registry: Registry, player: Player): number =>
    registry[player.name] ? registry[player.name].length : 0;

export const isOverEngaged = (registry: Registry, player: Player): boolean =>
    numberOfEngagments(registry, player) > player.capacity;

export const isFullyEngaged = (registry: Registry, player: Player): boolean =>
    numberOfEngagments(registry, player) === player.capacity;

export const isSingle = (registry: Registry, player: Player): boolean =>
    numberOfEngagments(registry, player) === 0;

export const currentPartner = (registry: Registry, player: Player): Player | null =>
    numberOfEngagments(registry, player) > 0 ? registry[player.name][0] : null;

export const worstPartner = (registry: Registry, player: Player): Player | null => {
    if (isSingle(registry, player)) {
        return null;
    }

    let max = -1;
    let worst = null;
    registry[player.name].forEach(partner => {
        const rankNumber = rank(player, partner);
        if (rankNumber > max) {
            max = rankNumber;
            worst = partner;
        }
    });
    return worst;
};

export const allAssigned = (registry: Registry, players: Player[]): boolean => {
    const unassignedPlayers = players.filter(
        player => isSingle(registry, player) && hasCandidate(player),
    );
    return unassignedPlayers.length === 0;
};

export const extractMatching = (registry: Registry): Matching => {
    const names = Object.keys(registry);
    return names.reduce((acc: Matching, name: string) => {
        acc[name] = registry[name].map(player => player.name);
        return acc;
    }, {});
};

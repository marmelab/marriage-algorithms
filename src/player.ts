type RankTable = { [playername: string]: number };

export type Player = {
    name: string;
    candidates: Player[];
    rankTable: RankTable;
    capacity: number;
};

export const createPlayer = (name: string, capacity = 1): Player => ({
    name,
    candidates: [], // list of candidates
    rankTable: {}, // associate a preference rank to each candidate's name
    capacity,
});

export const addCandidate = (player: Player, candidate: Player): void => {
    player.candidates.push(candidate);
    player.rankTable[candidate.name] = player.candidates.length - 1;
};

export const addCandidates = (player: Player, candidates: Player[]): void => {
    candidates.forEach(candidate => {
        addCandidate(player, candidate);
    });
};

export const removeCandidate = (player: Player, candidate: Player): void => {
    const index = player.candidates.indexOf(candidate);
    player.candidates.splice(index, 1);
    delete player.rankTable[candidate.name];
};

export const hasCandidate = ({ candidates }: Player): boolean => candidates.length > 0;

export const topCandidate = ({ candidates }: Player): Player => candidates[0];

export const nextCandidate = (player: Player): Player | null => {
    const topCandidate = player.candidates.shift();
    if (topCandidate) {
        delete player.rankTable[topCandidate.name];
        return topCandidate;
    }
    return null;
};

export const successorsOf = ({ candidates }: Player, candidate: Player): Player[] =>
    candidates.slice(1 + candidates.indexOf(candidate));

export const rank = ({ rankTable }: Player, candidate: Player): number =>
    rankTable.hasOwnProperty(candidate.name) ? rankTable[candidate.name] : Infinity;

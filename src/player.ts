/*
 * A Player is a partner in a marriage problem
 * For instance, it can be
 * - a Male or a Female in a 'classical' marriage problem
 * - a Resident or an Hospital in a Hospitals-Residents allocation problem
 * - a Student or an School in a School choice problem
 *
 * A Player has a maximal capacity: 1 in a 'classical' single-partner marriage problem, but it can be greater for
 * a School which has a fixed capacity for instance
 * A Player should also have a strictly ordered list of preferences: candidates is this list
 * rankTable is used to speedup the algorithms: given a candidate's name, the table gives the position of this candidate
 * in the list of preferences
 */
type RankTable = { [playername: string]: number };

export type Player = {
    name: string;
    candidates: Player[];
    rankTable: RankTable;
    capacity: number;
};

export const toString = ({ name, candidates, capacity }: Player): string =>
    `${name}${capacity > 1 ? ` (capacity=${capacity})` : ''} prefers: ${candidates
        .map(({ name }) => name)
        .join(', ')}`;

export const createPlayer = (name: string, capacity = 1): Player => ({
    name,
    candidates: [], // list of candidates
    rankTable: {}, // associate a preference rank to each candidate's name
    capacity, // maximal number of partners to which this Player can be associated
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

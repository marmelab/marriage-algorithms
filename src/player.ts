import { without, omit } from 'lodash';

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

export const addCandidate = (
    { name, candidates, rankTable, capacity }: Player,
    candidate: Player,
): Player => ({
    name,
    candidates: [...candidates, candidate],
    rankTable: { ...rankTable, [candidate.name]: candidates.length },
    capacity,
});

export const addCandidates = (player: Player, candidates: Player[]): Player =>
    candidates.reduce((acc, candidate) => addCandidate(acc, candidate), player);

export const removeCandidate = (
    { name, candidates, rankTable, capacity }: Player,
    candidate: Player,
): Player => ({
    name,
    candidates: without(candidates, candidate),
    rankTable: omit(rankTable, candidate.name),
    capacity,
});

export const hasCandidate = ({ candidates }: Player): boolean => candidates.length > 0;

export const topCandidate = ({ candidates }: Player): Player => candidates[0];

export const nextCandidate = ({ name, candidates, rankTable, capacity }: Player): Player => ({
    name,
    candidates: candidates.slice(1),
    rankTable: omit(rankTable, candidates[0].name),
    capacity,
});

export const successorsOf = ({ candidates }: Player, candidate: Player): Player[] =>
    candidates.slice(1 + candidates.indexOf(candidate));

export const rank = ({ rankTable }: Player, candidate: Player): number =>
    rankTable.hasOwnProperty(candidate.name) ? rankTable[candidate.name] : Infinity;

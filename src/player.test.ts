import {
    addCandidate,
    addCandidates,
    createPlayer,
    hasCandidate,
    rank,
    successorsOf,
    removeCandidate,
    nextCandidate,
    topCandidate,
} from './player';

describe('Player', () => {
    it('should create a player', () => {
        const player = createPlayer('player', 1);
        expect(player.name).toEqual('player');
    });

    it('should add a candidate', () => {
        const player = createPlayer('player', 1);
        const candidate = createPlayer('candidate', 1);
        addCandidate(player, candidate);
        expect(hasCandidate(player)).toBeTruthy();
        expect(topCandidate(player)).toBe(candidate);
        expect(rank(player, candidate)).toEqual(0);
        expect(successorsOf(player, candidate)).toHaveLength(0);
    });

    it('should add two candidates', () => {
        const player = createPlayer('player', 1);
        const candidate1 = createPlayer('candidate 1', 1);
        const candidate2 = createPlayer('candidate 2', 1);
        addCandidates(player, [candidate1, candidate2]);
        expect(hasCandidate(player)).toBeTruthy();
        expect(topCandidate(player)).toBe(candidate1);
        expect(rank(player, candidate1)).toEqual(0);
        expect(rank(player, candidate2)).toEqual(1);
        expect(successorsOf(player, candidate1)).toEqual([candidate2]);

        const next = nextCandidate(player);
        expect(rank(player, candidate1)).toEqual(Infinity);

        removeCandidate(player, candidate2);
        addCandidates(player, [candidate1, candidate2]);
        removeCandidate(player, candidate1);
        expect(rank(player, candidate1)).toEqual(Infinity);
        expect(rank(player, candidate2)).toEqual(1);

        removeCandidate(player, candidate2);
        addCandidates(player, [candidate1, candidate2]);
        removeCandidate(player, candidate2);
        expect(rank(player, candidate1)).toEqual(0);
        expect(rank(player, candidate2)).toEqual(Infinity);
    });
});

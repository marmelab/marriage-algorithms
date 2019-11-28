import {
    addCandidate,
    addCandidates,
    createPlayer,
    hasCandidate,
    topCandidate,
    rank,
    successorsOf,
    nextCandidate,
    removeCandidate,
} from './player';

describe('Player', () => {
    it('should create a player', () => {
        const player = createPlayer('player', 1);
        expect(player.name).toEqual('player');
    });

    it('should add a candidate', () => {
        const candidate = createPlayer('candidate', 1);
        const player = addCandidate(createPlayer('player', 1), candidate);
        expect(hasCandidate(player)).toBeTruthy();
        expect(topCandidate(player)).toBe(candidate);
        expect(rank(player, candidate)).toEqual(0);
        expect(successorsOf(player, candidate)).toHaveLength(0);
    });

    it('should add two candidates', () => {
        const candidate1 = createPlayer('candidate 1', 1);
        const candidate2 = createPlayer('candidate 2', 1);
        const player = addCandidates(createPlayer('player', 1), [candidate1, candidate2]);
        expect(hasCandidate(player)).toBeTruthy();
        expect(topCandidate(player)).toBe(candidate1);
        expect(rank(player, candidate1)).toEqual(0);
        expect(rank(player, candidate2)).toEqual(1);
        expect(successorsOf(player, candidate1)).toEqual([candidate2]);

        const playerNextCandidate = nextCandidate(player);
        expect(rank(playerNextCandidate, candidate1)).toEqual(Infinity);

        const playerWithoutCandidate1 = removeCandidate(player, candidate1);
        expect(rank(playerWithoutCandidate1, candidate1)).toEqual(Infinity);
        expect(rank(playerWithoutCandidate1, candidate2)).toEqual(1);

        const playerWithoutCandidate2 = removeCandidate(player, candidate2);
        expect(rank(playerWithoutCandidate2, candidate1)).toEqual(0);
        expect(rank(playerWithoutCandidate2, candidate2)).toEqual(Infinity);
    });
});

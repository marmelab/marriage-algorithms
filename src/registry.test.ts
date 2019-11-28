import { createPlayer } from './player';
import {
    allAssigned,
    createRegistry,
    currentPartner,
    disengage,
    engage,
    extractMatching,
    isFullyEngaged,
    isOverEngaged,
    isSingle,
    worstPartner,
} from './registry';

describe('Registry', () => {
    it('should create a registry', () => {
        const registry = createRegistry();
        const player = createPlayer('player', 1);
        expect(isOverEngaged(registry, player)).toBeFalsy();
        expect(isFullyEngaged(registry, player)).toBeFalsy();
        expect(isSingle(registry, player)).toBeTruthy();
        expect(currentPartner(registry, player)).toBeNull();
        expect(worstPartner(registry, player)).toBeNull();
    });

    it('should engage a player', () => {
        const registry = createRegistry();
        const player1 = createPlayer('player 1', 1);
        const player2 = createPlayer('player 2', 1);
        engage(registry, player1, player2);
        expect(isOverEngaged(registry, player1)).toBeFalsy();
        expect(isOverEngaged(registry, player2)).toBeFalsy();
        expect(isFullyEngaged(registry, player1)).toBeTruthy();
        expect(isFullyEngaged(registry, player2)).toBeTruthy();
        expect(isSingle(registry, player1)).toBeFalsy();
        expect(isSingle(registry, player2)).toBeFalsy();
        expect(currentPartner(registry, player1)).toEqual(player2);
        expect(currentPartner(registry, player2)).toEqual(player1);
        expect(worstPartner(registry, player1)).toEqual(player2);
        expect(worstPartner(registry, player2)).toEqual(player1);
        expect(allAssigned(registry, [player1, player2])).toBeTruthy();
    });

    it('should disengage an engaged player', () => {
        const registry = createRegistry();
        const player1 = createPlayer('player 1', 1);
        const player2 = createPlayer('player 2', 1);

        engage(registry, player1, player2);
        disengage(registry, player1, player2);

        expect(isOverEngaged(registry, player1)).toBeFalsy();
        expect(isFullyEngaged(registry, player1)).toBeFalsy();
        expect(isSingle(registry, player1)).toBeTruthy();
        expect(currentPartner(registry, player1)).toBeNull();
        expect(worstPartner(registry, player1)).toBeNull();

        expect(isOverEngaged(registry, player2)).toBeFalsy();
        expect(isFullyEngaged(registry, player2)).toBeFalsy();
        expect(isSingle(registry, player2)).toBeTruthy();
        expect(currentPartner(registry, player2)).toBeNull();
        expect(worstPartner(registry, player2)).toBeNull();
    });

    it('should extract matching', () => {
        const registry = createRegistry();
        const player1 = createPlayer('player 1', 1);
        const player2 = createPlayer('player 2', 1);

        engage(registry, player1, player2);
        const matching = extractMatching(registry);

        expect(matching[player1.name]).toContain(player2.name);
        expect(matching[player2.name]).toContain(player1.name);
    });
});

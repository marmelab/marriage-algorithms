import {
    hasCandidate,
    topCandidate,
    nextCandidate,
    removeCandidate,
    successorsOf,
    rank,
    Player,
} from './player';
import {
    createRegistry,
    allAssigned,
    currentPartner,
    isSingle,
    engage,
    disengage,
    extractMatching,
    worstPartner,
    isOverEngaged,
    isFullyEngaged,
    Registry,
    Matching,
} from './registry';

export const galeShapley = (players: Player[]): Matching => {
    const galeShapleyAux = (registry: Registry, players: Player[]): void => {
        players.forEach(player => {
            if (!isSingle(registry, player)) {
                // do nothing
                return;
            }

            const candidate = nextCandidate(player);
            if (!candidate) {
                // do nothing
                return;
            }

            if (isSingle(registry, candidate)) {
                engage(registry, player, candidate);
            } else {
                const currentPartnerOfCandidate = currentPartner(registry, candidate);
                if (
                    currentPartnerOfCandidate !== null &&
                    rank(candidate, player) < rank(candidate, currentPartnerOfCandidate)
                ) {
                    disengage(registry, currentPartnerOfCandidate, candidate);
                    engage(registry, player, candidate);
                }
            }
        });

        if (!allAssigned(registry, players)) {
            galeShapleyAux(registry, players);
            return;
        }
    };

    const registry = createRegistry();
    galeShapleyAux(registry, players);
    return extractMatching(registry);
};
// 0. Assign all residents to be unmatched, and all hospitals to be totally unsubscribed.
// 1. Take any unmatched resident with a non-empty preference list, r, and consider their most preferred hospital, h.
//    Match them to one another.
// 2. If, as a result of this new matching, h is now over-subscribed, find the worst resident currently assigned to h, r'.
//    Set r' to be unmatched and remove them from the hospital's matching. Go to 3.
// 3. If h is at capacity (fully subscribed) then find their worst current match r'.
//    Then, for each successor, s, to r' in the preference list of h, delete the pair (s, h) from the game. Go to 4.
// 4. Go to 1 until there are no such residents left, then end.
export const rothShapley = (players: Player[]): Matching => {
    const rothShapleyAux = (registry: Registry, players: Player[]): void => {
        players.forEach(player => {
            if (isSingle(registry, player) && hasCandidate(player)) {
                const candidate = topCandidate(player);
                engage(registry, player, candidate);
                if (isOverEngaged(registry, candidate)) {
                    const worstPartnerOfCandidate = worstPartner(registry, candidate);
                    if (worstPartnerOfCandidate !== null) {
                        disengage(registry, worstPartnerOfCandidate, candidate);
                    }
                }

                if (isFullyEngaged(registry, candidate)) {
                    const worstPartnerOfCandidate = worstPartner(registry, candidate);
                    if (worstPartnerOfCandidate !== null) {
                        const successors = successorsOf(candidate, worstPartnerOfCandidate);
                        successors.forEach(successor => {
                            removeCandidate(successor, candidate);
                            removeCandidate(candidate, successor);
                        });
                    }
                }
            }
        });

        if (!allAssigned(registry, players)) {
            return rothShapleyAux(registry, players);
        }
    };
    const registry = createRegistry();
    rothShapleyAux(registry, players);
    return extractMatching(registry);
};

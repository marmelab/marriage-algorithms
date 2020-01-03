import { Player, toString as playerToString } from './player';

export type Problem = {
    players1: Player[];
    players2: Player[];
};

export const toString = ({
    players1,
    players2,
}: Problem): { players1: string[]; players2: string[] } => ({
    players1: players1.map(player => playerToString(player)),
    players2: players2.map(player => playerToString(player)),
});

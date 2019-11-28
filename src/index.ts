import { createPlayer, addCandidate, removeCandidate } from './player';

let p1 = createPlayer('player 1', 1);
const p2 = createPlayer('player 2', 1);

p1 = addCandidate(p1, p2);

console.log('add', p1);

p1 = removeCandidate(p1, p2);
console.log('remove', p1);

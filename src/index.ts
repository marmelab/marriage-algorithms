import { createPlayer, Player, addCandidates } from './player';
import { galeShapley } from './algorithms';

const createProblem2301 = (): { students: Player[]; correctors: Player[] } => {
    const students = Array.from({ length: 4 }, (v, i) => createPlayer(`Student${i}`));
    const correctors = Array.from({ length: 4 }, (v, i) => createPlayer(`Corrector${i}`));

    addCandidates(students[0], [correctors[0], correctors[1], correctors[2], correctors[3]]);
    addCandidates(students[1], [correctors[0], correctors[3], correctors[2], correctors[1]]);
    addCandidates(students[2], [correctors[1], correctors[0], correctors[2], correctors[3]]);
    addCandidates(students[3], [correctors[3], correctors[1], correctors[2], correctors[0]]);

    addCandidates(correctors[0], [students[3], students[2], students[0], students[1]]);
    addCandidates(correctors[1], [students[1], students[3], students[0], students[2]]);
    addCandidates(correctors[2], [students[3], students[0], students[1], students[2]]);
    addCandidates(correctors[3], [students[2], students[1], students[0], students[3]]);
    return { students, correctors };
};

const { students } = createProblem2301();
const result = galeShapley(students);
console.log(result);

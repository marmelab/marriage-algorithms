import { createPlayer, addCandidate, removeCandidate } from './player';

let p1 = createPlayer('player 1', 1);
const p2 = createPlayer('player 2', 1);

p1 = addCandidate(p1, p2);

console.log('add', p1);

p1 = removeCandidate(p1, p2);
console.log('remove', p1);

/*import { genProblemCapacities, genProblemHospitalCapacities } from './problems';
import Registry from './Registry';

const runGaleShapley = ({ students }) => {
    const registry = new Registry();
    const start = process.hrtime();
    const results = registry.extendedGaleShapley(students).extractMatching();
    const end = process.hrtime(start);

    console.log('results =>', results);
    console.info('%ds %dms', end[0], end[1] / 1000000);
};

const runRothShapley = ({ students }) => {
    const registry = new Registry();
    const start = process.hrtime();
    const results = registry.rothShapley(students).extractMatching();
    const end = process.hrtime(start);

    // console.log('results =>', results);
    console.info('%ds %dms', end[0], end[1] / 1000000);
};

runGaleShapley(genProblemCapacities(5, [2, 3]));
runRothShapley(genProblemHospitalCapacities(5000, [20, 20, 40, 40, 40, 100, 100]));


 */

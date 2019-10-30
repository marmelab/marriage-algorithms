const { genProblemCapacities, genProblemHospitalCapacities } = require('./problems');
const Registry = require('./Registry');

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

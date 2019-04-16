const {genProblem1, genProblem3, genProblemCapacities, genProblemHospitalCapacities} = require('./problems');
const State = require('./State');

const runGaleShapley = ({students,correctors}) => {
    const state = new State();
    const start = process.hrtime();
    const results = state.galeShapley(students).extractMatching();
    const end = process.hrtime(start);

    // console.log('results =>', results);
    console.info('%ds %dms',end[0],end[1]/1000000);
}

const runRothShapley = ({students,correctors}) => {
    const state = new State();
    const start = process.hrtime();
    const results = state.rothShapley(students).extractMatching();
    const end = process.hrtime(start);

    console.log('results =>', results);
    console.info('%ds %dms',end[0],end[1]/1000000);
}


runGaleShapley(genProblemCapacities(1000,[20,20,40,40,40,100,100]));
runRothShapley(genProblemHospitalCapacities(10,[2,2,4]));

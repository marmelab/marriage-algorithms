const {genProblem2 } = require('./problems');
const {engageEveryone } = require('./gale-shapley');

function isStable(population1, population2) {
    population1.forEach(p1 => population2.forEach(p2 => {
            if (p1.prefers(p2) && p2.prefers(p1)) {
                return false;
            }
        }
    ));
    return true;
}



const doMarriage = () => {

    const {students, correctors} = genProblem2();
    // const {students, correctors} = genProblemN(4);
    // const {students,correctors} = genProblemCapacities(100, [30, 30, 30,10]);

    console.log(students);
    console.log(correctors);

    engageEveryone([...students, ...correctors]);
    // engageEveryone(students);

    students.forEach(student => {
        console.log(`${student.name} is engaged with ${student.fiance.name}`);
    })
    console.log(`Stable = ${isStable(students, correctors) ? "Yes" : "No"}`);

    // console.log('swap');
    // students[1].swapWith(students[3]);
    // students[0].swapWith(students[3]);
    //
    // students.forEach(student => {
    //     console.log(`${student.name} is engaged with ${student.fiance.name}`);
    // })
    // console.log(`Stable = ${isStable(students, correctors) ? "Yes" : "No"}`);
}

doMarriage();
const Player = require('./Player');

// same number of students and correctors
exports.genProblemN = (n) => {
    const students = Array.from({length: n}, (v, i) => new Player(`Student${i}`));
    const correctors = Array.from({length: n}, (v, i) => new Player(`Corrector${i}`));

    students.forEach(student => {
        student.addCandidates(correctors)
    });
    correctors.forEach(corrector => {
        corrector.addCandidates(students)
    });

    return {students, correctors};
}

// more students than correctors, but correctors with capacity
exports.genProblemCapacities = (n, capacities) => {
    const students = Array.from({length: n}, (v, i) => new Player(`Student${i}`));
    const correctors = [];
    Array.from({length: capacities.length}).forEach((v, i) => {
        Array.from({length: capacities[i]}).forEach((w, j) => {
            correctors.push(new Player(`Corrector${i}_${j}`));
        })
    });


    students.forEach(student => {
        student.addCandidates(correctors)
    });
    correctors.forEach(corrector => {
        corrector.addCandidates(students)
    });

    // console.log(students);
    // console.log(correctors);
    return {students, correctors};
}

// example from tutorial: http://www.ams.org/publicoutreach/feature-column/fc-2015-03
exports.genProblem1 = () => {
    const students = Array.from({length: 4}, (v, i) => new Player(`Student${i}`));
    const correctors = Array.from({length: 4}, (v, i) => new Player(`Corrector${i}`));

    students[0].addCandidates([correctors[0], correctors[1], correctors[2], correctors[3]]);
    students[1].addCandidates([correctors[0], correctors[3], correctors[2], correctors[1]]);
    students[2].addCandidates([correctors[1], correctors[0], correctors[2], correctors[3]]);
    students[3].addCandidates([correctors[3], correctors[1], correctors[2], correctors[0]]);

    correctors[0].addCandidates([students[3], students[2], students[0], students[1]]);
    correctors[1].addCandidates([students[1], students[3], students[0], students[2]]);
    correctors[2].addCandidates([students[3], students[0], students[1], students[2]]);
    correctors[3].addCandidates([students[2], students[1], students[0], students[3]]);
    // should return : [2, 3, 0, 1]

    return {students, correctors};
}

// 4 students and 2 correctors
exports.genProblem2 = () => {
    const students = Array.from({length: 4}, (v, i) => new Player(`Student${i}`));
    const correctors = Array.from({length: 2}, (v, i) => new Player(`Corrector${i}`));

    students[0].addCandidates([correctors[0], correctors[1], students[0]]);
    students[1].addCandidates([correctors[0], correctors[1], students[1]]);
    students[2].addCandidates([correctors[1], correctors[0], students[2]]);
    students[3].addCandidates([correctors[1], correctors[0], students[3]]);

    correctors[0].addCandidates([students[3], students[2], students[0], students[1]]);
    correctors[1].addCandidates([students[1], students[3], students[0], students[2]]);

    return {students, correctors};
}


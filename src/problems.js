const groupBy = require('lodash.groupby');
const shuffle = require('lodash.shuffle');

const Player = require('./Player');
const Registry = require('./Registry');

const createPlayers = (ids, capacities) =>
    ids.reduce((acc, id, index) => {
        acc[id] = new Player(id, capacities[index]);
        return acc;
    }, {});

const initScores = ids =>
    ids.reduce((acc, id) => {
        acc[id] = 0;
        return acc;
    }, {});

// more students than correctors, but correctors with capacity
exports.genProblemCapacities = (n, capacities) => {
    const students = Array.from({ length: n }, (v, i) => new Player(`Student${i}`));
    const correctors = [];
    Array.from({ length: capacities.length }).forEach((v, i) => {
        Array.from({ length: capacities[i] }).forEach((w, j) => {
            correctors.push(new Player(`Corrector${i}_${j}`));
        });
    });

    students.forEach(student => {
        student.addCandidates(correctors);
    });
    const reversedStudents = students.slice().reverse();
    correctors.forEach(corrector => {
        corrector.addCandidates(reversedStudents);
    });

    // console.log(students);
    // console.log(correctors);
    return { students, correctors };
};

exports.genProblemHospitalCapacities = (n, capacities) => {
    const students = Array.from({ length: n }, (v, i) => new Player(`Student${i}`));
    const correctors = capacities.map((capacity, i) => new Player(`Corrector${i}`, capacity));

    students.forEach(student => {
        student.addCandidates(correctors);
    });
    const reversedStudents = students.slice().reverse();
    correctors.forEach(corrector => {
        corrector.addCandidates(reversedStudents);
    });

    // console.log(students);
    // console.log(correctors);
    return { students, correctors };
};

/*
 * a student prefers to be corrected by a corrector who corrected him the most,
 * recent corrections have more impact than older ones
 */
const computeScoreByCorrector = (corrector_ids, orderedListOfCorrections) =>
    orderedListOfCorrections.reduce((acc, { corrector_id }, index) => {
        if (acc.hasOwnProperty(corrector_id)) {
            acc[corrector_id] += Math.max(100 - 10 * index, 10);
        }
        return acc;
    }, initScores(corrector_ids));

const orderedPreferencesByStudent = ({ student_enf_ids, corrector_ids, sortedStatistics }) => {
    const studentsHistory = groupBy(sortedStatistics, o => o.student_enf_id);
    const preferences = student_enf_ids.reduce((acc, id) => {
        const history = studentsHistory[id] || [];

        const scoredPreferences = shuffle(
            Object.entries(computeScoreByCorrector(corrector_ids, history)),
        );

        const sortedPreferences = scoredPreferences
            .sort((a, b) => b[1] - a[1])
            .map(pair => ({ corrector_id: pair[0], score: pair[1] }));

        acc[id] = sortedPreferences;
        return acc;
    }, {});
    return preferences;
};
exports.orderedPreferencesByStudent = orderedPreferencesByStudent;

const addStudents = (studentsTable, correctorsTable, studentsHistory) =>
    Object.keys(studentsTable).forEach(studentId => {
        const history = studentsHistory[studentId] || [];

        const scoredPreferences = shuffle(
            Object.entries(computeScoreByCorrector(Object.keys(correctorsTable), history)),
        );

        const sortedPreferences = scoredPreferences
            .sort((a, b) => b[1] - a[1])
            .map(pair => correctorsTable[pair[0]]);

        studentsTable[studentId].addCandidates(sortedPreferences);
    });

const addCorrectors = (correctorsTable, studentsTable, correctorsHistory, preferencesByStudent) => {
    return Object.keys(correctorsTable).forEach(corrector_id => {
        const orderedListOfStudents = correctorsHistory[corrector_id] || [];
        const student_enf_ids = Object.keys(studentsTable);

        // a corrector prefers to correct a student he has already corrected
        const scoreByStudent = orderedListOfStudents.reduce((acc, { student_enf_id }) => {
            if (acc.hasOwnProperty(student_enf_id)) {
                acc[student_enf_id] += 10;
            }
            return acc;
        }, initScores(student_enf_ids));

        // but he prefers to not correct a student that prefers another corrector
        // this is needed to ensure that a student is not assigned to a corrector
        // which could have selected another student (who has a preference with a score 0,
        // meaning he does not care in reality)
        Object.keys(scoreByStudent).forEach(student_enf_id => {
            const { score, corrector_id: preferedCorrectorId } = preferencesByStudent[
                student_enf_id
            ][0];
            if (preferedCorrectorId !== corrector_id && score > 0) {
                scoreByStudent[student_enf_id] -= 5;
            }
        });

        const scoredPreferences = shuffle(Object.entries(scoreByStudent));

        const sortedPreferences = scoredPreferences
            .sort((a, b) => b[1] - a[1])
            .map(pair => studentsTable[pair[0]]);

        correctorsTable[corrector_id].addCandidates(sortedPreferences);
    });
};

exports.buildMarriageProblem = ({ correctorsWithCapacity, student_enf_ids, sortedStatistics }) => {
    const studentsTable = createPlayers(student_enf_ids, student_enf_ids.map(() => 1));
    const correctorsWithPositiveCapacity = correctorsWithCapacity.filter(
        ({ numberOfPapersToAssign }) => numberOfPapersToAssign >= 0,
    );
    const correctorsTable = createPlayers(
        correctorsWithPositiveCapacity.map(({ corrector_id }) => corrector_id),
        correctorsWithPositiveCapacity.map(({ numberOfPapersToAssign }) => numberOfPapersToAssign),
    );

    const studentsHistory = groupBy(sortedStatistics, o => o.student_enf_id);
    const correctorsHistory = groupBy(sortedStatistics, o => o.corrector_id);

    addStudents(studentsTable, correctorsTable, studentsHistory);

    const corrector_ids = correctorsWithCapacity.map(({ corrector_id }) => corrector_id);
    const preferencesByStudent = orderedPreferencesByStudent({
        student_enf_ids,
        corrector_ids,
        sortedStatistics,
    });

    addCorrectors(correctorsTable, studentsTable, correctorsHistory, preferencesByStudent);

    const students = Object.values(studentsTable);
    return students;
};

exports.solveRothShapley = problem => new Registry().rothShapley(problem).extractMatching();

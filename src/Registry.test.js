const Player = require('./Player');
const Registry = require('./Registry');

describe('Gale-Shapley algorithm', () => {
    it('should return an empty solution when there is no student', () => {
        const students = [];
        const result = new Registry().galeShapley(students).extractMatching();
        expect(result).toEqual({});
    });
});

describe('Roth-Shapley algorithm', () => {
    it('should return an empty solution when there is no student', () => {
        const students = [];
        const result = new Registry().rothShapley(students).extractMatching();
        expect(result).toEqual({});
    });

    it('should find a solution when there is more students than correctors', () => {
        const students = Array.from({ length: 10 }, (v, i) => new Player(`Student${i}`));
        const correctors = Array.from({ length: 2 }, (v, i) => new Player(`Corrector${i}`, 2));
        students.forEach(student => {
            student.addCandidates(correctors);
        });
        const reversedStudents = students.slice().reverse();
        correctors.forEach(corrector => {
            corrector.addCandidates(reversedStudents);
        });

        const result = new Registry().rothShapley(students).extractMatching();
        expect(result['Student0']).toHaveLength(0);
        expect(result['Student1']).toHaveLength(0);
        expect(result['Student2']).toHaveLength(0);
        expect(result['Student3']).toHaveLength(0);
        expect(result['Student4']).toHaveLength(0);
        expect(result['Student5']).toHaveLength(0);
        expect(result['Student6'][0]).toEqual('Corrector1');
        expect(result['Student7'][0]).toEqual('Corrector1');
        expect(result['Student8'][0]).toEqual('Corrector0');
        expect(result['Student9'][0]).toEqual('Corrector0');
    });

    it('should find a solution when there is more correctors than students ', () => {
        const students = Array.from({ length: 2 }, (v, i) => new Player(`Student${i}`));
        const correctors = Array.from({ length: 10 }, (v, i) => new Player(`Corrector${i}`, 10));
        students.forEach(student => {
            student.addCandidates(correctors);
        });
        correctors.forEach(corrector => {
            corrector.addCandidates(students.slice());
        });

        const result = new Registry().rothShapley(students).extractMatching();
        expect(result['Student0'][0]).toEqual('Corrector0');
        expect(result['Student1'][0]).toEqual('Corrector0');
    });

    it('should return [2, 3, 0, 1] for this well known problem', () => {
        // http://www.ams.org/publicoutreach/feature-column/fc-2015-03
        const students = Array.from({ length: 4 }, (v, i) => new Player(`Student${i}`));
        const correctors = Array.from({ length: 4 }, (v, i) => new Player(`Corrector${i}`));

        students[0].addCandidates([correctors[0], correctors[1], correctors[2], correctors[3]]);
        students[1].addCandidates([correctors[0], correctors[3], correctors[2], correctors[1]]);
        students[2].addCandidates([correctors[1], correctors[0], correctors[2], correctors[3]]);
        students[3].addCandidates([correctors[3], correctors[1], correctors[2], correctors[0]]);

        correctors[0].addCandidates([students[3], students[2], students[0], students[1]]);
        correctors[1].addCandidates([students[1], students[3], students[0], students[2]]);
        correctors[2].addCandidates([students[3], students[0], students[1], students[2]]);
        correctors[3].addCandidates([students[2], students[1], students[0], students[3]]);

        const result = new Registry().rothShapley(students).extractMatching();
        expect(result['Student0'][0]).toEqual('Corrector2');
        expect(result['Student1'][0]).toEqual('Corrector3');
        expect(result['Student2'][0]).toEqual('Corrector0');
        expect(result['Student3'][0]).toEqual('Corrector1');
    });
});

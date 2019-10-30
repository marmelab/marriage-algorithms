const { buildMarriageProblem, solveRothShapley } = require('./problems');

describe('Roth-Shapley algorithm', () => {
    it('should return an empty solution when there is no problem', () => {
        expect(solveRothShapley([])).toEqual({});
    });

    it('should return an empty solution when there is no student', () => {
        const problem = buildMarriageProblem({
            correctorsWithCapacity: [],
            student_enf_ids: [],
            sortedStatistics: []
        });
        expect(solveRothShapley(problem)).toEqual({});
    });

    it('should find a solution if there is no history', () => {
        const problem = buildMarriageProblem({
            correctorsWithCapacity: [
                { corrector_id: 'c1', numberOfPapersToAssign: 1 },
                { corrector_id: 'c2', numberOfPapersToAssign: 1 }
            ],
            student_enf_ids: ['s1', 's2'],

            sortedStatistics: []
        });
        const result = solveRothShapley(problem);
        if (result['s1'][0] === 'c1') {
            expect(result['s2'][0]).toEqual('c2');
        } else {
            expect(result['s1'][0]).toEqual('c2');
            expect(result['s2'][0]).toEqual('c1');
        }
    });

    it('should find a solution when there is an length-1 history', () => {
        const problem = buildMarriageProblem({
            correctorsWithCapacity: [
                { corrector_id: 'c1', numberOfPapersToAssign: 1 },
                { corrector_id: 'c2', numberOfPapersToAssign: 1 }
            ],
            student_enf_ids: ['s1', 's2'],

            sortedStatistics: [
                { student_enf_id: 's1', corrector_id: 'c1' },
                { student_enf_id: 's2', corrector_id: 'c2' }
            ]
        });
        const result = solveRothShapley(problem);
        expect(result['s1'][0]).toEqual('c1');
        expect(result['s2'][0]).toEqual('c2');
    });

    it('should give more weight to more recent entries of history', () => {
        const problem = buildMarriageProblem({
            correctorsWithCapacity: [
                { corrector_id: 'c1', numberOfPapersToAssign: 1 },
                { corrector_id: 'c2', numberOfPapersToAssign: 1 }
            ],
            student_enf_ids: ['s1', 's2'],

            sortedStatistics: [
                { student_enf_id: 's1', corrector_id: 'c1' },
                { student_enf_id: 's1', corrector_id: 'c2' },
                { student_enf_id: 's2', corrector_id: 'c2' },
                { student_enf_id: 's2', corrector_id: 'c1' }
            ]
        });
        const result = solveRothShapley(problem);
        expect(result['s1'][0]).toEqual('c1');
        expect(result['s2'][0]).toEqual('c2');
    });

    it('should give more weight to repetition of entries of history', () => {
        const problem = buildMarriageProblem({
            correctorsWithCapacity: [
                { corrector_id: 'c1', numberOfPapersToAssign: 1 },
                { corrector_id: 'c2', numberOfPapersToAssign: 1 }
            ],
            student_enf_ids: ['s1', 's2'],

            sortedStatistics: [
                { student_enf_id: 's1', corrector_id: 'c1' },
                { student_enf_id: 's1', corrector_id: 'c2' },
                { student_enf_id: 's1', corrector_id: 'c2' },
                { student_enf_id: 's2', corrector_id: 'c2' },
                { student_enf_id: 's2', corrector_id: 'c1' },
                { student_enf_id: 's2', corrector_id: 'c1' }
            ]
        });
        const result = solveRothShapley(problem);
        expect(result['s1'][0]).toEqual('c2');
        expect(result['s2'][0]).toEqual('c1');
    });

    it('should assign students to a same corrector if capacity is high enough', () => {
        const problem = buildMarriageProblem({
            correctorsWithCapacity: [
                { corrector_id: 'c1', numberOfPapersToAssign: 2 },
                { corrector_id: 'c2', numberOfPapersToAssign: 2 }
            ],
            student_enf_ids: ['s1', 's2'],

            sortedStatistics: [
                { student_enf_id: 's1', corrector_id: 'c1' },
                { student_enf_id: 's1', corrector_id: 'c2' },
                { student_enf_id: 's1', corrector_id: 'c2' },
                { student_enf_id: 's2', corrector_id: 'c2' },
                { student_enf_id: 's2', corrector_id: 'c2' },
                { student_enf_id: 's2', corrector_id: 'c1' }
            ]
        });
        const result = solveRothShapley(problem);
        expect(result['s1'][0]).toEqual('c2');
        expect(result['s2'][0]).toEqual('c2');
    });
});

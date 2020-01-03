import { Problem, toString } from '../problem';
import { createPlayer, addCandidates } from '../player';
import { galeShapley } from '../algorithms';

export const createManWomanProblem = (): Problem => {
    const albert = createPlayer('Albert');
    const bob = createPlayer('Bob');
    const charles = createPlayer('Charles');
    const denis = createPlayer('Denis');

    const alice = createPlayer('Alice');
    const brigitte = createPlayer('Brigitte');
    const diane = createPlayer('Diane');
    const emily = createPlayer('Emily');

    addCandidates(albert, [alice, brigitte, diane, emily]);
    addCandidates(bob, [alice, emily, diane, brigitte]);
    addCandidates(charles, [brigitte, alice, diane, emily]);
    addCandidates(denis, [emily, brigitte, diane, alice]);

    addCandidates(alice, [denis, charles, albert, bob]);
    addCandidates(brigitte, [bob, denis, albert, charles]);
    addCandidates(diane, [denis, albert, bob, charles]);
    addCandidates(emily, [charles, bob, albert, denis]);
    return { players1: [albert, bob, charles, denis], players2: [alice, brigitte, diane, emily] };
};

export const runManWomanProblem = (): void => {
    const manWomanProblem = createManWomanProblem();
    console.log('Man-Woman problem: ', toString(manWomanProblem));
    const manWomanResult = galeShapley(manWomanProblem);
    console.log('Solution', manWomanResult);
};

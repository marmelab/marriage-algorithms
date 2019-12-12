import { Problem, toString } from '../problem';
import { createPlayer, Player, addCandidates } from '../player';
import { galeShapley } from '../algorithms';

/*
 * To be able to use Roth-Shapley algorithm
 * each Player should have a capacity of 1
 * Therefore, we create as many hospitals as needed to simulate capacites
 * for example Hospital-0_0, Hospital-0_1, Hospital-0_2 to simulate an Hospital-0 with capacity 3
 */
export const createHospitalsResidentsWithoutCapacityProblem = (
    numberOfResidents: number,
    hospitalsCapacities: number[],
): Problem => {
    const residents = Array.from({ length: numberOfResidents }, (v, residentNumber) =>
        createPlayer(`Resident-${residentNumber}`),
    );

    const hospitals: Player[] = [];
    Array.from({ length: hospitalsCapacities.length }).forEach((_, hospitalNumber) => {
        Array.from({ length: hospitalsCapacities[hospitalNumber] }).forEach((_, copyNumber) => {
            hospitals.push(createPlayer(`Hospital-${hospitalNumber}_${copyNumber}`));
        });
    });

    residents.forEach(resident => {
        addCandidates(resident, hospitals);
    });

    const reversedResidents = residents.slice().reverse();
    hospitals.forEach(hospital => {
        addCandidates(hospital, reversedResidents);
    });

    return { players1: residents, players2: hospitals };
};

// We have 3 hospitals (Hospital-0, Hospital-1, and Hospital-2) with respective capacities 3, 3 and 4
// We have 10 residents, whose names are Resident-0, Resident-1, ..., Resident-9
// Each Resident prefers Hospital-0 first, and then Hospital-1 and Hospital-2
// But each Hospital prefers Resident-9, Resident-8, etc.
// The current Roth-Shapley implementation gives preference to Hospitals instead of Residents
export const runHospitalsResidentsWithoutCapacityProblem = (): void => {
    const hospitalsResidentsProblemWithoutCapacity = createHospitalsResidentsWithoutCapacityProblem(
        10,
        [3, 3, 4],
    );
    console.log(
        'Hospitals-Residents problem: ',
        toString(hospitalsResidentsProblemWithoutCapacity),
    );
    const hospitalsResidentsWithoutCapacityResult = galeShapley(
        hospitalsResidentsProblemWithoutCapacity,
    );
    console.log('Solution', hospitalsResidentsWithoutCapacityResult);
};

import { Problem, toString } from '../problem';
import { createPlayer, addCandidates } from '../player';
import { rothShapley } from '../algorithms';

export const createHospitalsResidentsProblem = (
    numberOfResidents: number,
    hospitalsCapacities: number[],
): Problem => {
    const residents = Array.from({ length: numberOfResidents }, (v, residentNumber) =>
        createPlayer(`Resident-${residentNumber}`),
    );
    const hospitals = hospitalsCapacities.map((capacity, hospitalNumber) =>
        createPlayer(`Hospital number ${hospitalNumber}`, capacity),
    );

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
export const runHospitalsResidentsProblem = (): void => {
    const hospitalsResidentsProblem = createHospitalsResidentsProblem(10, [3, 3, 4]);
    console.log('Hospitals-Residents problem: ', toString(hospitalsResidentsProblem));
    const hospitalsResidentsResult = rothShapley(hospitalsResidentsProblem);
    console.log('Solution', hospitalsResidentsResult);
};

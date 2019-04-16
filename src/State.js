const {genProblem1, genProblem3, genProblemCapacities, genProblemHospitalCapacities} = require('./problems');

class State {

    constructor() {
        this.assignment = {};
    }

    engage(player1, player2) {
        // console.log('engage', player1.name, player2.name);

        if(!this.assignment.hasOwnProperty(player1.name)) {
            this.assignment[player1.name] = [];
        }
        if(!this.assignment.hasOwnProperty(player2.name)) {
            this.assignment[player2.name] = [];
        }

        this.assignment[player1.name].push(player2);
        this.assignment[player2.name].push(player1);
        // console.log('state', this.extractMatching());
    }

    unEngage(player1, player2) {
        // console.log('unEngage', player1.name, player2.name);
        const indexPlayer2 = this.assignment[player1.name].indexOf(player2);
        const indexPlayer1 = this.assignment[player2.name].indexOf(player1);

        this.assignment[player1.name].splice(indexPlayer2,1);
        this.assignment[player2.name].splice(indexPlayer1,1);
        // console.log('state', this.extractMatching());
    }

    isOverEngaged(player) {
        return this.assignment[player.name].length > player.capacity;
    }

    isFullyEngaged(player) {
        return this.assignment[player.name].length === player.capacity;
    }

    currentPartner(player) {
        return this.assignment[player.name][0];
    }

    worstCurrentPartner(player) {
        let max = -1;
        let worst = null;

        this.assignment[player.name].forEach(partner => {
            const rank = player.rank(partner);
            if(rank > max) {
                max = rank;
                worst = partner;
            }
        })
        return worst;
    }

    isSingle(player) {
        // console.log('isSingle', player.name);
        if(!this.assignment.hasOwnProperty(player.name)) {
            return true;
        }
        return this.assignment[player.name].length === 0;
    }

    allAssigned(players) {
        const unassignedPlayers = players.filter((player) => this.isSingle(player) && player.hasCandidate()>0);
        return unassignedPlayers.length === 0;
    }

    extractMatching() {
        const names = Object.keys(this.assignment);
        return names.reduce((acc, name) => {
            acc[name] = this.assignment[name].map(player => player.name);
            return acc;
        }, {});

    }

    galeShapley(players) {

        players.forEach(player => {
            if (!this.isSingle(player)) {
                // do nothing
                return;
            }

            const candidate = player.nextCandidate();
            if (this.isSingle(candidate)) {
                this.engage(player, candidate);
            } else {
                const currentPartnerOfCandidate = this.currentPartner(candidate);
                // console.log('current partner', currentPartnerOfCandidate);
                if (candidate.rank(player) < candidate.rank(currentPartnerOfCandidate)) {
                    this.unEngage(candidate,currentPartnerOfCandidate);
                    this.engage(player, candidate);
                }
            }
        });

        if (!this.allAssigned(players)) {
            return this.galeShapley(players);
        }

        return this;
    }


    // 0. Assign all residents to be unmatched, and all hospitals to be totally unsubscribed.
    // 1. Take any unmatched resident with a non-empty preference list, r, and consider their most preferred hospital, h.
    //    Match them to one another.
    // 2. If, as a result of this new matching, h is now over-subscribed, find the worst resident currently assigned to h, r'.
    //    Set r' to be unmatched and remove them from the hospital's matching. Go to 3.
    // 3. If h is at capacity (fully subscribed) then find their worst current match r'.
    //    Then, for each successor, s, to r' in the preference list of h, delete the pair (s, h) from the game. Go to 4.
    // 4. Go to 1 until there are no such residents left, then end.
    rothShapley(players) {

        players.forEach(player => {

            if (this.isSingle(player) && player.hasCandidate()) {
                const candidate = player.topCandidate();
                this.engage(player, candidate);
                if (this.isOverEngaged(candidate)) {
                    const worstPartnerOfCandidate = this.worstCurrentPartner(candidate);
                    this.unEngage(worstPartnerOfCandidate, candidate);
                }

                if (this.isFullyEngaged(candidate)) {
                    const worstPartnerOfCandidate = this.worstCurrentPartner(candidate);
                    const successors = candidate.successorsOf(worstPartnerOfCandidate);
                    successors.forEach(successor => {
                        successor.removeCandidate(candidate);
                        candidate.removeCandidate(successor);
                    });
                }
            }
        });

        if (!this.allAssigned(players)) {
            return this.rothShapley(players);
        }

        return this;
    }


}

const run1 = () => {
    // const {students, correctors} = genProblem1();
    const {students, correctors} = genProblemCapacities(10000,[20,20,40,40,40,100,100]);

    const state = new State();

    const start = process.hrtime()
    const results = state.galeShapley(students).extractMatching();
    const end = process.hrtime(start);

    // console.log('results =>', results);
    console.info('%ds %dms',end[0],end[1]/1000000);
}

const run3 = () => {
    // const {students, correctors} = genProblem3();
    const {students, correctors} = genProblemHospitalCapacities(10,[2,2,4]);

    const state = new State();

    const start = process.hrtime()
    const results = state.rothShapley(students).extractMatching();
    const end = process.hrtime(start);

    console.log('results =>', results);
    console.info('%ds %dms',end[0],end[1]/1000000);
}

// run1();
run3();

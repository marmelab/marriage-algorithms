module.exports = class Player {
    constructor(name, capacity = 1) {
        this.name = name;
        this.candidates = [];
        this.rankTable = {};
        this.capacity = capacity;
    }

    addCandidates(candidates) {
        candidates.forEach(candidate => {
            this.addCandidate(candidate);
        });
    }

    addCandidate(p) {
        this.candidates.push(p);
        this.rankTable[p.name] = this.candidates.length - 1;
    }

    removeCandidate(p) {
        const index = this.candidates.indexOf(p);
        this.candidates.splice(index, 1);
        delete this.rankTable[p.name];
    }

    hasCandidate() {
        return this.candidates.length > 0;
    }

    topCandidate() {
        return this.candidates[0];
    }

    nextCandidate() {
        return this.candidates.shift();
    }

    successorsOf(p) {
        const index = this.candidates.indexOf(p);
        return this.candidates.slice(index + 1);
    }

    rank(p) {
        if (this.rankTable.hasOwnProperty(p.name)) {
            return this.rankTable[p.name];
        }
        return Infinity;
    }
};

module.exports = class Player {

    constructor(name, capacity = 1) {
        this.name = name;
        this.candidates = [];
        this.rankTable = {};
        this.capacity = capacity;
        this.fiance = null;
    }

    addCandidates(candidates) {
        candidates.forEach(candidate => {
            this.addCandidate(candidate);
        });
    }

    addCandidate(p) {
        // console.log(`${this.name} add candidate:`, p.name)
        this.candidates.push(p);
        this.rankTable[p.name] = this.candidates.length - 1;
    }

    removeCandidate(p) {
        const index = this.candidates.indexOf(p);
        this.candidates.splice(index,1);
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
       return this.candidates.slice(index+1);
    }

    rank(p) {
        if (this.rankTable.hasOwnProperty(p.name)) {
            return this.rankTable[p.name];
        }
        return Infinity;
    }

    prefers(p) {
        // console.log(`do ${this.name} prefers ${p.name} (${this.rank(p)}) over ${this.fiance.name} (${this.rank(this.fiance)}) ? -> ${this.rank(p) < this.rank(this.fiance)}`)
        return this.rank(p) < this.rank(this.fiance);
    }

    engageTo(p) {
        if (p.fiance) {
            p.fiance.fiance = null;
        }
        p.fiance = this;
        if (this.fiance) {
            this.fiance.fiance = null;
        }
        this.fiance = p;
    }

    swapWith(p) {
        console.log("%s & %s swap partners", this.name, p.name);
        const thisFiance = this.fiance;
        const pFiance = p.fiance;
        this.engageTo(pFiance);
        p.engageTo(thisFiance);
    }
}

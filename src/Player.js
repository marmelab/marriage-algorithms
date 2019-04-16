module.exports = class Player {

    constructor(name) {
        this.name = name;
        this.fiance = null;
        this.candidates = [];
        this.rankTable = {};
        this.maxRank = undefined;
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
        this.maxRank = this.candidates.length;
    }

    rank(p) {
        if (this.rankTable.hasOwnProperty(p.name)) {
            return this.rankTable[p.name];
        }
        // console.log(`${p.name} has no rank for ${this.name}, return ${this.maxRank}`);
        return this.maxRank;
    }

    prefers(p) {
        // console.log(`do ${this.name} prefers ${p.name} (${this.rank(p)}) over ${this.fiance.name} (${this.rank(this.fiance)}) ? -> ${this.rank(p) < this.rank(this.fiance)}`)
        return this.rank(p) < this.rank(this.fiance);
    }

    nextCandidate() {
        return this.candidates.shift();
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

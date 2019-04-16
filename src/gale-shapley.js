
exports.engageEveryone = (players) => {
    let someOneToMarry = players && players.length > 0;
    while (someOneToMarry) {
        someOneToMarry = false;
        players.forEach((player) => {
            if (!player.fiance) {
                someOneToMarry = true;
                const candidate = player.nextCandidate();
                if (!candidate.fiance || candidate.prefers(player)) {
                    player.engageTo(candidate);
                    console.log("try to engage %s with %s", player.name, candidate.name);
                }
            }
        })
    }
}

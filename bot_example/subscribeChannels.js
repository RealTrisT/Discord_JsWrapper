module.exports.cmd_subscribe = function(Viscera, data) {
    const args = data.content.substring(11);
    const role = Viscera.MyRoles[data.substring(11)];
    let match;

    if(match = a.match(/(\w+)/)) { // add msg's user to channel
        Viscera.SetMemberRole(data.guild_id, data.author.id, role);
    }

    // a possible command variation
    // ADMIN ONLY CMD - subscribe user(arg 2) to channel(arg 1)
    /* else if(match = a.match(/(\w+) (\w+)/)) { // not working yet
        if(isAdmin(data.user)) { // what the role considered admin?
            const targetUser = Viscera.GetUser() // get by name??
            Viscera.SetMemberRole(data.guild_id, targetUser, role);
        }
    } */

    else {
        console.error("Error: not valid arguments");
    }
}

module.exports.cmd_unsubscribe = function(Viscera, data) {
    const args = data.content.substring(11);
    const role = Viscera.MyRoles[data.substring(11)];
    let match;

    if(match = a.match(/(\w+)/)) { // remove msg's user to channel
        Viscera.RemMemberRole(data.guild_id, data.author.id, role);
    } else {
        console.error("Error: not valid arguments");
    }
}

module.exports = function cmd_subcribe(Viscera, data) {
    const args = data.content.substring(11);
    const role = Viscera.MyRoles[data.substring(11)];
    let match;

    if(match = a.match(/(\w+)/)) { // add msg's user to channel
        Viscera.SetMemberRole(data.guild_id, data.author.id, role);
    }

    // admin only CMD - subscribe user(arg 2) to channel(arg 1)
    /* else if(match = a.match(/(\w+) (\w+)/)) { // not working yet
        if(isAdmin(data.user)) {
            const targetUser = Viscera.GetUser() // by name??
            Viscera.SetMemberRole(data.guild_id, targetUser, role);
        }
    } */

    else {
        console.error("Error: not valid arguments");
    }
}

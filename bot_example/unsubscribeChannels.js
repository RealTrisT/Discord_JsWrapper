module.exports = function cmd_unsubscribe(Viscera, data) {
    const args = data.content.substring(11);
    const role = Viscera.MyRoles[data.substring(11)];
    let match;

    if(match = a.match(/(\w+)/)) { // remove msg's user to channel
        Viscera.RemMemberRole(data.guild_id, data.author.id, role);
    } else {
        console.error("Error: not valid arguments");
    }
}

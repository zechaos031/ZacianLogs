module.exports = async (client, oldMember, newMember) => {

    if (!newMember.guild.me.permissions.has(["SEND_MESSAGES", "VIEW_AUDIT_LOG", "EMBED_LINKS", "MANAGE_CHANNELS", "MANAGE_GUILD"], true)) return;

    let db = await client.dbmanager.getGuild(newMember.guild);
    if (!db) return;
    let channel = newMember.guild.channels.cache.get(db.channels.log);
    if (!channel) return;

    return channel.send({
        embed: {
            title: "Membre Logs",
            description: "Un membre de change de pseudo",
            color: 0xF5AD2E,
            fields: [{
                    name: "❱ Ancien pseudo",
                    value: oldMember.nickname === null ? oldMember.user.username : oldMember.nickname
                },
                {
                    name: "❱ Nouveau pseudo",
                    value: newMember.nickname === null ? newMember.user.username : newMember.nickname
                },
                {
                    name: "❱ Utilisateur",
                    value: newMember.user.username
                }
            ]
        }
    })
};

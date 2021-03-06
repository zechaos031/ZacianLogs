module.exports = async (client, message, data) => {

    if (!message.guild.me.permissions.has(["SEND_MESSAGES", "VIEW_AUDIT_LOG", "EMBED_LINKS", "MANAGE_CHANNELS", "MANAGE_GUILD"], true)) return;

    let db = await client.dbmanager.getGuild(message.guild);
    if (!db) return;
    let channel = message.guild.channels.cache.get(db.channels.log);

    if (!channel) return;

    return channel.send({
        embed: {
            title: "Anti Insulte Logs",
            description: "Message supprimer",
            color: 0xF5AD2E,
            fields: [{
                    name: "❱ Utilisateur",
                    value: message.author.username
                },
                {
                    name: "❱ Contenu",
                    value: message.content.length > 1090 ? message.content.substr(0, 10) + "..." : message.content
                },
                {
                    name: "❱ Roles",
                    value: message.member.roles.cache.size < 0 ? message.member.roles.cache.filter(filter => filter.name !== "@everyone").map(role => `${role.name}`).join(" - ") : "Pas de roles"
                },
                {
                    name: "❱ Mauvais mot",
                    value: data,
                }
            ]
        }
    })
};

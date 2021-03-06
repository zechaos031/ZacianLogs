const Command = require("../../Base/Command");
const {
    HELPER
} = require("../../Utils/Constant/CommandeHelper");

class ListMute extends Command {
    constructor(client) {
        super(client, HELPER.COMMANDS.MOD.LISTMUTE);
        this.client = client

    }

    run = async (message) => {
        let i;
        const mention = message.mentions.members.first();
        if (!mention) return message.channel.send("Vous devez mentionné un utilisateur");
        const db = await this.client.dbmanager.getGuild(message.guild);

        if (!db.members[mention.id]) return message.channel.send("Cette utilisateur n'as pas de mute");
        let mutelist = [];

        let mapmute = db.members[mention.id].mute.muteList.map(g => g);

        for (i = 0; i < 5; i++) {
            let nombre = i + 1;
            if (mapmute[i]) {
                mutelist.push(`Mute n°${nombre}:\n╚>Raison: ${mapmute[i].reason}\n╚>Date: ${mapmute[i].startAt} a ${mapmute[i].endAt ? mapmute[i].endAt : "Actuellement"}\n`)

            }
        }
        message.channel.send({
            embed: {
                title: `Mutes de ${mention.user.username}`,
                description: mutelist ? mutelist.join("\n") : "Aucun mute"
            }
        }).then(msg => {
            msg.react("◀").then(() => {
                msg.react("❌").then(() => {
                    msg.react("▶").then(() => {
                        const backF = (reaction, user) => reaction.emoji.name === "◀" && user.id === message.author.id;
                        const forF = (reaction, user) => reaction.emoji.name === "▶" && user.id === message.author.id;
                        const delF = (reaction, user) => reaction.emoji.name === "❌" && user.id === message.author.id;
                        const del = msg.createReactionCollector(delF, {
                            time: 180000
                        });
                        const back = msg.createReactionCollector(backF, {
                            time: 180000
                        });
                        const forw = msg.createReactionCollector(forF, {
                            time: 180000
                        });

                        back.on("collect", async r => {
                            let x = i - 5;
                            if (x <= 0) return;
                            i -= 10;
                            let mutelist = [];

                            for (i; i < x; i++) {
                                let nombre = i + 1;

                                if (i >= 0 - 1) {
                                    if (mapmute[i]) {
                                        mutelist.push(`Mute n°${nombre}:\n╚>Raison: ${mapmute[i].reason}\n╚>Date: ${mapmute[i].addAt} a ${mapmute[i].endAt ? mapmute[i].endAt : "Actuellement"}\n`)
                                    }
                                }
                            }
                            await msg.edit({
                                embed: {
                                    title: `Mutes de ${mention.user.username}`,
                                    description: mutelist ? mutelist.join("\n") : "Aucun mute"
                                }
                            });
                            await r.users.remove(message.author.id)
                        });
                        forw.on("collect", async r => {
                            if (i >= mapmute.length - 1) return;

                            let t = i + 5;
                            for (i; i < t; i++) {
                                mutelist = [];
                                let nombre = i + 1;
                                if (i <= mapmute.length - 1) {
                                    if (mapmute[i]) {
                                        mutelist.push(`Mute n°${nombre}:\n╚>Raison: ${mapmute[i].reason}\n╚>Date: ${mapmute[i].addAt} a ${mapmute[i].endAt ? mapmute[i].endAt : "Actuellement"}\n`)

                                    }
                                }
                            }
                            await msg.edit({
                                embed: {
                                    title: `Mutes de ${mention.user.username}`,
                                    description: mutelist ? mutelist.join("\n") : "Aucun mute"
                                }
                            });

                            await r.users.remove(message.author.id)


                        });
                        del.on("collect", async () => {
                            await msg.edit({
                                embed: {
                                    description: "La liste de mutes a etait supprimé"
                                }
                            }).then(() => {
                                forw.stop();
                                back.stop();
                                msg.reactions.removeAll()
                            })
                        })
                    })
                })
            });
        })

    }
}

module.exports = ListMute;

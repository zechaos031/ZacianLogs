const Command = require("../../Base/Command");
const {HELPER } = require("../../Utils/Constant/CommandeHelper");

class Checkuser extends Command {
    constructor(client) {
        super(client, HELPER.COMMANDS.MOD.CHECKUSER)
    }

    async run(message) {
/*
        const members = message.guild.members;

        const withInvite = members.cache.filter((m) => m.user.presence.activities.name && /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(m.user.presence.game.name));
console.log(message.member.presence)
        const text = (withInvite.length > 0 ?
            withInvite.map((member) => {

            }`ID:\`${member.id}\` Pseudo: ${member.displayName} a une invitation dans son status`).join("\n")
            :   "Personne n'a d'invitation dans son status");
        message.channel.send(text)
*/
        //TODO Checkuser
    }
}

module.exports = Checkuser;
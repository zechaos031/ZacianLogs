class Command {

    constructor(client, options) {
        this.help = {
            name: options.name || null,
            description: options.description || "Pas d'information donnée.",
            usage: options.usage ? `${client.config.prefix}${options.usage}` : "",
            category: options.category || "Information",
            exemple: options.exemple || "Pas d'exemple",
            args: options.args || "Pas d\"argument complexe"
        };
        this.conf = {
            permLevel: options.permLevel || 0,
            permission: options.permission || "SEND_MESSAGES",
            cooldowns: options.cooldowns || 1000,
            aliases: options.aliases || [],
            allowDMs: options.allowDMs || false,
            args: options.args || "pas d\"arguments",
            mention: options.mention || false
        };
        this.cooldown = new Set();
    }

    set startCooldown(user) {
        if (!user) return console.log("[CoolDown] Pas d'utilisateur donnée")
        this.cooldown.add(user);
        setTimeout(() => {
            this.cooldown.delete(user);
        }, this.conf.cooldown);
    }

    setMessage(message) {
        this.message = message;
    }
}

module.exports = Command;

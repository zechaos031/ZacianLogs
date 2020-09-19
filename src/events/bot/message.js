const   AntiInsulte = require("../../modules/antiInsulte"),
     {Collection} = require("discord.js");
module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(message) {
        if (message.author.bot) return;
        if (message.channel.type === "dm") return this.client.emit("DirectMessage", message);
        let guildData = await this.getDataOrCreate(message.guild);

        const insulte = new AntiInsulte(this.client);
        await insulte.run(message);
        //Antiraid
        if(guildData.settings.antiraid) {
            if(guildData.settings.antiraid.enabled) {
                await require('../../modules/antiraid').getMessage(this.client, message, guildData.settings.antiraid)
            }
        }
        //


        this.client.emit('invitationLogger' ,message);
        this.client.emit('messageCitation' ,message);
        if (message.author.bot) return;
        if(message.content.startsWith('<@!717658826379231256>')) return this.client.emit('MessageMentionBot',message,guildData);

        let prefix = guildData ? guildData.prefix : "zac!";
        if(!message.content.startsWith(prefix)) return;

        const args = message.content.split(' ').slice(1);

        const command = message.content.split(' ')[0].slice(prefix.length);
        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
        if (!cmd) return;

        if (!this.client.cooldowns.has(cmd.help.name)) {
            this.client.cooldowns.set(cmd.help.name, new Collection());
        }

        const timeNow = Date.now();
        const tStamps = this.client.cooldowns.get(cmd.help.name);
        const cdAmount = (cmd.help.cooldown || 5) * 1000;
        if(!this.client.config.owner.includes(message.author.id)){
            if (tStamps.has(message.author.id)) {
                const cdExpirationTime = tStamps.get(message.author.id) + cdAmount;

                if (timeNow < cdExpirationTime) {
                    let timeLeft = (cdExpirationTime - timeNow) / 1000;
                    return message.reply(`merci d'attendre ${timeLeft.toFixed(0)} seconde(s) avant de ré-utiliser la commande \`${cmd.help.name}\`.`);
                }
            }
            tStamps.set(message.author.id, timeNow);
            setTimeout(() => tStamps.delete(message.author.id), cdAmount);
        }

        if(cmd.help.category.toLowerCase() === 'owner' && !this.client.config.owner.includes(message.author.id)) return message.channel.send('Vous devez etre dévellopeur du bot');

        cmd.setMessage(message);
        try{
            //await this.getInvite(this.client,message.guild, guildData)
            cmd.run(message, args,guildData);
        }catch (e) {
            this.client.emit('error',e.stack,message.channel,cmd)
        }

        if (cmd.conf.cooldown > 0) cmd.startCooldown(message.author.id);
    }

    async getDataOrCreate(guild){
        const {Types} = require('mongoose')
        return new Promise(async (resolve)=>{
            const {Guild} = require('../../models/index');
            let data = await this.client.dbmanager.getGuild(guild);
            if(data){
                resolve(data)
            }else{
                const newGuild= {
                    GuildId : guild.id
                };
                const merged = Object.assign({ _id: Types.ObjectId()}, newGuild);
                let savedata = await new Guild(merged);
                savedata.save();
                resolve(savedata)
            }
        })

    }

    /*async getInvite(client,guild,db){
        if(db){
            try{
                await guild.fetchInvites().then(async invite=>{
                    if(!db.invites[invite.code]){
                        db.invites[invite.code] ={}
                        await client.dbmanager.updateGuild(guild, {invites:db.invites});

                    }
                    let inviteData = {};
                    inviteData[guild.id] = invite;
                    Object.assign(db.invites,inviteData);
                    await client.dbmanager.updateGuild(guild, {invites:db.invites});
                    console.log(`Invitation get ${guild.id}`)
                }).catch((err)=>{
                    console.error(err)
                })
            }catch (e) {
                return client.logger.error(e)
            }
        }
    }*/
};
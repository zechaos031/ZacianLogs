
module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(newMessage) {
        let db =  await this.client.dbmanager.getGuild(newMessage.guild);
        if(!db) return;
        let channel= newMessage.guild.channels.cache.get(db.channels.log);

        if(!channel )return;


        return channel.send({
            embed:{
                title:"Message Logs",
                description:"Un message vient d'etre epinglé",
                color :0xF5AD2E,
                fields:[
                    {
                        name:"❱ Utilisateur",
                        value : newMessage.member.user.username
                    },
                    {
                        name:"❱ Message",
                        value: newMessage.content
                    },
                ]
            }
        })

    }
};
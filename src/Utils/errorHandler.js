module.exports = async (client) => {

    process.on('unhandledRejection', err =>{
        if(err) {
            if(err.stack) {
                if (err.stack.includes('An invalid token was provided.')) {
                    client.logger.error('Bad token see config.js for set the token');
                } else if (err.stack.includes('Missing Permissions')) {
                    client.logger.error('Permission Error')
                } else if(err.stack.includes(' getaddrinfo ENOTFOUND discordapp.com')) {
                    client.logger.error('Impossible to get information from discord');
                    client.destroy()
                    process.exit(0)
                }else{
                    client.logger.error(err.stack)
                }
            }else{
                client.logger.error(err)
            }
        }
    });

    process.on('uncaughtException', err =>{
        if (err.stack.includes('Promise { <pending> }')) return;
        client.logger.error(err.stack)
    });

    process.on('warning', (err) => {
        client.logger.error(err.stack)
    })
};
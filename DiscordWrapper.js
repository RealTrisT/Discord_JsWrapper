module.exports = 
class DiscordWrapper{
	constructor(Token_){
		this.events 	= new (require('events'))();
		this.ApiWrapper = new (require('./DiscordWrapperApi'))(Token_, {obj: this.events});
	}

	async Initialize(){
		await this.ApiWrapper.networking.GetGatewayInfo();
		await this.ApiWrapper.networking.OpenGateway();
	}

	//https://discordapp.com/developers/docs/resources/channel#create-message
	async CreateMessage(channelID, message){
		return await this.ApiWrapper.networking.HttpApiSend(
			"POST", 
			"/channels/" + channelID + "/messages", 
			JSON.stringify({'content': message})
		);
	}

	//https://discordapp.com/developers/docs/resources/channel#delete-message
	async DeleteMessage(messageID, channelID){
		return await this.ApiWrapper.networking.HttpApiSend(
			"DELETE", 
			"/channels/" + channelID + "/messages/" + messageID
		);
	}

	//https://discordapp.com/developers/docs/resources/channel#get-channel-messages
	async GetMessages(channelID, params = undefined){ //look in the link for params
		var queryParams = "";
		if(params !== undefined)for(var propertyn in params)queryParams += "&" + propertyn + "=" + params[propertyn];
		return await this.ApiWrapper.networking.HttpApiSend(
			"GET", 
			"/channels/" + channelID + "/messages" + ((queryParams != "")?("?" + queryParams.substring(1)):(""))
		);
	}
}
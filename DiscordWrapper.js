module.exports = 
class DiscordWrapper{
	constructor(Token_){
		this.events 	= new (require('events'))();
		this.ApiWrapper = new (require('./DiscordWrapperApi'))(Token_, {obj: this.events});

		this.GuildCache = new Array();
		console.log(this.GuildCache);

		//All Gateway Events: https://discordapp.com/developers/docs/topics/gateway#commands-and-events-gateway-events
		this.events.me = this; //HACK THAT SHIT LMAO
		this.events.on('GUILD_CREATE', this.GUILD_CREATE_handler);
	}

	async Initialize(){
		await this.ApiWrapper.networking.GetGatewayInfo();
		await this.ApiWrapper.networking.OpenGateway();
	}


	//https://discordapp.com/developers/docs/resources/guild#guild-object
	GUILD_CREATE_handler(data){
		this.me.GuildCache.push(data);
	}
	GetCachedGuild(GuildID){
		console.log("cached guilds: " + this.GuildCache.length);
		for (var i = 0; i < this.GuildCache.length; i++){
			console.log(this.GuildCache[i].name + ": ", this.GuildCache[i].id)
			if(this.GuildCache[i].id == GuildID)return this.GuildCache[i];
		}
		return undefined;
	}

	//https://discordapp.com/developers/docs/resources/channel#create-message
	async CreateMessage(channelID, message){//message is text
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

	async GetUser(userID){
		return await this.ApiWrapper.networking.HttpApiSend(
			"GET",
			"/users/" + userID
		);
	}
}



//--------------------------------------------------------------------------------------------------
//https://discordapp.com/developers/docs/resources/channel#message-object
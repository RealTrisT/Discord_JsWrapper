module.exports = 
class DiscordWrapper{
	constructor(Token_){
		this.events 	= new (require('events'))();
		this.ApiWrapper = new (require('./DiscordWrapperApi'))(Token_, {obj: this.events});

		this.GuildCache = new Array();

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
	GetCachedGuild_ByID(GuildID){
		for (var i = 0; i < this.GuildCache.length; i++){
			if(this.GuildCache[i].id == GuildID)return this.GuildCache[i];
		}
		return undefined;
	}
	GetCachedGuild_ByName(GuildName){
		for (var i = 0; i < this.GuildCache.length; i++){
			//console.log("guild search: " + this.GuildCache[i].name + " == " + GuildName);
			if(this.GuildCache[i].name == GuildName)return this.GuildCache[i];
		}
		return undefined;
	}

	GetCachedRole_ByID(GuildID, RoleID){
		var TheGuild = this.GetCachedGuild_ByID(GuildID);
		if(TheGuild === undefined){return undefined;}
		for (var i = 0; i < TheGuild.roles.length; i++) {
			if(TheGuild.roles[i].id == RoleID){
				return TheGuild.roles[i];
		}	}
		return undefined;
	}
	GetCachedRole_ByName(GuildID, RoleName){
		var TheGuild = this.GetCachedGuild_ByID(GuildID);
		if(TheGuild === undefined){return undefined;}
		for (var i = 0; i < TheGuild.roles.length; i++) {
			if(TheGuild.roles[i].name == RoleName){
				return TheGuild.roles[i];
		}	}
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

	async SetMemberRole(guildID, userID, roleID){
		return await this.ApiWrapper.networking.HttpApiSend(
			"PUT",
			"/guilds/" + guildID + "/members/" + userID + "/roles/" + roleID
		);
	}
	async RemMemberRole(guildID, userID, roleID){
		return await this.ApiWrapper.networking.HttpApiSend(
			"DELETE",
			"/guilds/" + guildID + "/members/" + userID + "/roles/" + roleID
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
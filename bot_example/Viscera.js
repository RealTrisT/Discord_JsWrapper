DiscordWrapper = require('../DiscordWrapper');
Commands = require('./Commands');
auth = require('./auth.json');



class Viscera{
	constructor(){
		this.MyGuildID = undefined;
		this.MyRoles = {};
		this.MyChannels = {};
		this.IOs = new DiscordWrapper(auth.token);	
		this.IOs.ApiWrapper.events.Viscera =this;
		this.IOs.on('error', 				this.handler_error);
		this.IOs.on('GUILD_MEMBER_UPDATE', 	this.handler_GUILD_MEMBER_UPDATE);
		this.IOs.on('GUILD_CREATE', 		this.handler_GUILD_CREATE);
		this.IOs.on('GUILD_MEMBER_ADD', 	this.handler_GUILD_MEMBER_ADD);
		this.IOs.on('MESSAGE_CREATE', 		this.handler_MESSAGE_CREATE);

		this.LoggingInPeople = {};
	}

	async run(){
		//console.log(this);
		if(await this.IOs.ApiWrapper.networking.GetGatewayInfo() === true){
			await this.IOs.ApiWrapper.networking.OpenGateway(); console.log("running");
		} else {console.log("Couldn't start.");}
	}

	handler_error(error){
		if(error.code == 1){	//disconnect
			console.log("Got Connection Fuck Error");
			var eh = setInterval(async () => {
				if(await this.Viscera.IOs.AttemptReconnection()){clearInterval(eh); console.log("we're back baby");}
				else console.log("Still Nothing");
			}, 5000);
		}
	}
	handler_GUILD_MEMBER_UPDATE(data){
		console.log(data);		
	}
	handler_GUILD_CREATE(data){
		this.Viscera.MyGuildID = this.Viscera.IOs.GetCachedGuild_ByName("TheThriftShop"); //temp
		this.Viscera.MyGuildID.roles.forEach((role) => {this.Viscera.MyRoles[role.name] = role.id;});
		this.Viscera.MyGuildID.channels.forEach((channel) => {this.Viscera.MyChannels[channel.name] = channel.id;});
		this.Viscera.MyGuildID = this.Viscera.MyGuildID.id;
	}
	handler_GUILD_MEMBER_ADD(data){
		this.Viscera.IOs.SetMemberRole(this.Viscera.MyGuildID, data.user.id, this.Viscera.MyRoles['Turista']);
		this.Viscera.IOs.CreateMessage(this.Viscera.MyChannels['new'], "\
<@" + data.user.id + "> sup manegga\nO teu role de momento é Turista, és basicamente lixo. \n\
Faz \"!grau TeuNumeroDeMatriculasNesteCurso\" e \"!nick TeuNome\" , para passares a ser alguém.\n\
(a partir de " + (32 - data.user.username.length - 3) + " caracteres o teu nick começa a cortar o teu nome original)\n\
Peço desculpa por esta merda mas n custa nada e evita confusão. https://i.imgur.com/9CAjIPG.png"
		);
	}
	handler_MESSAGE_CREATE(data){
		if(data.content.substring(0, 1) == '!'){
			var endCmd = data.content.indexOf(' ');
			var command = ((endCmd != -1)?data.content.substring(1, endCmd):data.content.substring(1)).toLowerCase();
//----------------------------------------------------------------
			Commands(this.Viscera, command, data);
//----------------------------------------------------------------				
		}
	}


	/*async */LogUserIn(data, user_data){
		//console.log("EEEELP " + JSON.stringify(user_data) + "EEEEEEEEEEEEEEEEELP" + 
		/*await */this.IOs.ModifyGuildMember(this.MyGuildID, data.author.id, {'nick': user_data.Nick.val,'roles': [this.MyRoles[user_data.Grau.val]]})  /*);*/
		//console.log("modifi: -->" + ab + "<--" + JSON.stringify({'roles': [this.MyRoles[user_data.Grau.val]]}));
	}

}

yep = new Viscera();
yep.run();



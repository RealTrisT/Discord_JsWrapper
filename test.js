DiscordWrapper = require('./DiscordWrapper');
auth = require('./auth.json');

async function ey(){
	var IOs = new DiscordWrapper(auth.token);

	var MyGuildID = undefined;
	var MyRoles = {};
	var MyChannels = {};

	IOs.events.on('GUILD_CREATE', function(){
		MyGuildID = IOs.GetCachedGuild_ByName("TheThriftShop"); //temp
		MyGuildID.roles.forEach((role) => {MyRoles[role.name] = role.id;});
		MyGuildID.channels.forEach((channel) => {MyChannels[channel.name] = channel.id;});
		MyGuildID = MyGuildID.id;
	});

	IOs.events.on('GUILD_MEMBER_ADD', async function(data){
		console.log("NEW MEMBER--------------------------------------");
		IOs.SetMemberRole(MyGuildID, data.user.id, MyRoles['Turista']);
		await IOs.CreateMessage(MyChannels['new'], "\
<@" + data.user.id + "> sup manegga\nO teu role de momento é Turista, és basicamente lixo. \
\nFaz \"!grau TeuNumeroDeMatriculas\" e \"!nick TeuNome\", para passares a ser alguém.\
\nPeço desculpa por esta merda mas n custa nada e evita confusão."
		);
	});

	IOs.events.on('MESSAGE_CREATE', async function(data){
		if(data.content.substring(0, 1) == '!'){
			var endCmd = data.content.indexOf(' ');
			var command = (endCmd != -1)?data.content.substring(1, endCmd):data.content.substring(1);
//----------------------------------------------------------------
			if(command == 'elp'){
				IOs.CreateMessage(data.channel_id, "https://www.google.pt/search?q=" + encodeURIComponent(data.content.substring(5)));
			}else if(command == 'sauce'){
				IOs.CreateMessage(data.channel_id, "https://github.com/RealTrisT/Discord_JsWrapper");
			}else if(command == 'elpb4'){
				previousMessages = JSON.parse(await IOs.GetMessages(data.channel_id, {'before': data.id, 'limit': 1}));
				IOs.DeleteMessage(data.id, data.channel_id);
				IOs.CreateMessage(data.channel_id, 
					"https://www.google.pt/search?q=" + encodeURIComponent(previousMessages[0].content) + " " + 
					"<@!" + previousMessages[0].author.id + ">"
				);
			}else if(command == "grau"){
				await IOs.RemMemberRole(MyGuildID, data.author.id, MyRoles['Turista']);
				var which = undefined;
				switch(parseInt(data.content.substring(6))){
					case 1: which = "Besta"; 	   break;
					case 2: which = "Macebo";	   break;
					case 3: which = "Académico";   break;
					case 4: which = "Veterano";    break;
					default:which = "Velha Guarda";break;
				}
				await IOs.SetMemberRole(MyGuildID, data.author.id, MyRoles[which]);
			}
//----------------------------------------------------------------				
		}
	});

	await IOs.ApiWrapper.networking.GetGatewayInfo();
	await IOs.ApiWrapper.networking.OpenGateway();

	console.log(IOs);
}ey();
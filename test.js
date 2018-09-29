DiscordWrapper = require('./DiscordWrapper');
auth = require('./auth.json');


async function ey(){
	var IOs = new DiscordWrapper(auth.token);

	var uncucked = {'123': {streng: 'gay'}, '321': {streng: 'gay2'}};
	console.log(uncucked['123'].streng);

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
			}else if(command =='emoju'){//this does not work, I do not know how to get the url of the fucking thing
				var emojin = data.content.substring(7);

				var found = false;
				var daguild = IOs.GetCachedGuild(data.guild_id);
				if(!daguild)return;
				emojiarr = daguild.emojis;
				for (var i = 0; i < emojiarr.length; i++) {
					if(emojiarr[i].name == emojin){
						console.log("getting :" + emojin + ":");
						found = true;

						var gotuser = await IOs.GetUser(emojiarr[i].id);
						console.log("user thing: " + gotuser);
						IOs.CreateMessage(
							data.channel_id, 
							"https://cdn.discordapp.com/emojis/" + JSON.parse(gotuser).avatar + ".png" 
						);
						break;
					}
				}
			}
//----------------------------------------------------------------				
		}
	});

	await IOs.ApiWrapper.networking.GetGatewayInfo();
	await IOs.ApiWrapper.networking.OpenGateway();

	console.log(IOs);
}ey();
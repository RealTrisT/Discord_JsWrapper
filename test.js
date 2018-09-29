DiscordWrapper = require('./DiscordWrapper');
auth = require('./auth.json');


async function ey(){
	var IOs = new DiscordWrapper(auth.token);

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
			}
//----------------------------------------------------------------				
		}
	});

	await IOs.ApiWrapper.networking.GetGatewayInfo();
	await IOs.ApiWrapper.networking.OpenGateway();

	console.log(IOs);
}ey();
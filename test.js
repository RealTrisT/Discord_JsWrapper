DiscordWrapperApi = require('./DiscordWrapperApi');
auth = require('./auth.json');


async function ey(){
	var IOs = new DiscordWrapperApi(auth.token);


	async function postMsg(channel_id, content){
		var bod = await IOs.networking.HttpApiSend(
			"POST", 
			"/channels/" + channel_id + "/messages", 
			JSON.stringify({'content': content})
		);
		console.log("response:" + bod);
	}

	IOs.events.on('MESSAGE_CREATE', function(data){
		if(data.content.substring(0, 4) == '!elp'){
			postMsg(data.channel_id, "https://www.google.pt/search?q=" + encodeURIComponent(data.content.substring(5)));
		}else if(data.content == '!sauce'){
			postMsg(data.channel_id, "https://github.com/RealTrisT/Discord_JsWrapper");
		}
	});

	await IOs.networking.GetGatewayInfo();
	await IOs.networking.OpenGateway();

	console.log(IOs);
}ey();
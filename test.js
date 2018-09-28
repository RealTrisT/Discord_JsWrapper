DiscordWrapperApi = require('./DiscordWrapperApi');
auth = require('./auth.json');

async function ey(){
	var IOs = new DiscordWrapperApi(auth.token);

	IOs.events.on('MESSAGE_CREATE', function(data){
		if(data.content.substring(0, 4) == '!elp')
			IOs.networking.HttpApiSendNoResponse(
				"POST", 
				"/channels/" + data.channel_id + "/messages", 
				JSON.stringify({'content': "https://www.google.pt/search?q=" + encodeURIComponent(data.content.substring(5))})
			);
	});

	await IOs.networking.GetGatewayInfo();
	await IOs.networking.OpenGateway();

	console.log(IOs);
}ey();
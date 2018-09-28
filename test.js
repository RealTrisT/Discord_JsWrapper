DiscordWrapperApi = require('./DiscordWrapperApi');
auth = require('./auth.json');

async function ey(){
	var IOs = new DiscordWrapperApi(auth.token);

	await IOs.networking.GetGatewayInfo();
	await IOs.networking.OpenGateway();

	console.log(IOs);
}ey();
https = require('https');
websock = require('ws');

function DiscordWrapperNetworking(wSockCallback) {
	SecWebsocketsConnection = undefined;
	WebsocketsBotDomainRequestOptions = {
		host: "discordapp.com",
		port: 443,
		path: "/api/gateway/bot",
		method: "GET",
		headers: {"Authorization": 'Bot ' + auth.token}
	};
																		/*	
	{	"url": string,
		"shards": number,
		"session_start_limit": {
			"total": number,
			"remaining": number,
			"reset_after": number
		}	
	}		v	v	v													*/
	GatewayInfo = undefined;

	WSockCallback = wSockCallback;
}

//	ALWAYS RETURNS TRUE - gets gateway info, sets this.GatewayInfo to it
DiscordWrapperNetworking.prototype.GetGatewayInfo = async function() {

	function GetIt(){ 
		return new Promise((resolve, reject) => {
			var req = https.request(opts, function(res){
				//if(res.statusCode)				//TODO: handle bad shit
				res.on('data', function (chunk) {
					this.GatewayInfo = JSON.parse(chunk);
					resolve(this.GatewayInfo);
				});	
			});	
			req.end();
		});	
	}
	return await GetIt();
}

DiscordWrapperNetworking.prototype.OpenGateway = async function() {
	if(GatewayInfo === undefined)return false;

	function GetIt(){ 
		return new Promise((resolve, reject) => {
			SecWebsocketsConnection = new websock(ret_gateway_info.url + "/?v=6&encoding=json");
			SecWebsocketsConnection.on('message', WSockCallback);
			SecWebsocketsConnection.on('open', function(){
				resolve(SecWebsocketsConnection);
			});	
		});	
	}
	return await GetIt();
}
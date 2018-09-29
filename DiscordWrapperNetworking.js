https   = require('https');
websock = require('ws');


module.exports = function DiscordWrapperNetworking(wSockCallback, Token_) {
	this.token = Token_;
	this.SecWebsocketsConnection = undefined;
	this.WebsocketsBotDomainRequestOptions = {
		host: "discordapp.com",
		port: 443,
		path: "/api/gateway/bot",
		method: "GET",
		headers: {"Authorization": 'Bot ' + this.token}
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
	this.GatewayInfo = undefined;

	this.WSockCallback = wSockCallback;




//	ALWAYS RETURNS TRUE - gets gateway info, sets this.GatewayInfo to it
	this.GetGatewayInfo = function() {
		return new Promise((resolve, reject) => {
			proxy_me = this;
			var req = https.request(proxy_me.WebsocketsBotDomainRequestOptions, function(res){
				//if(res.statusCode)				//TODO: handle bad shit
				//console.log(res.statusCode);
				res.on('data', function (chunk) {
					proxy_me.GatewayInfo = JSON.parse(chunk);
					resolve(proxy_me.GatewayInfo);
				});	
			});	
			req.end();
		});
	}

	this.OpenGateway = function() {
		return new Promise((resolve, reject) => {
			if(this.GatewayInfo === undefined)reject();
			this.SecWebsocketsConnection = new websock(this.GatewayInfo.url + "/?v=6&encoding=json");
			this.SecWebsocketsConnection.on('message', this.WSockCallback);
			this.SecWebsocketsConnection.on('open', function(){
				resolve(this.SecWebsocketsConnection);
			});	
		});	
	}

	this.GatewaySend = function(senda){
		if(this.SecWebsocketsConnection === undefined)return false;
		this.SecWebsocketsConnection.send(senda);
		return true;
	}

	this.HttpApiSend = function(Method, Path, Data){ //TODO: make dis decent
		return new Promise((resolve, reject) => {
			var opts = {
				host: "discordapp.com",
				port: 443,
				path: "/api" + Path,
				method: Method,
				headers: {
					"Authorization": 'Bot ' + this.token,
					"Content-Type": "application/json"
				}
			};
			var req = https.request(opts, function(res){
				//console.log("send attempt:" + res.statusCode);
				res.on('data', function (chunk) {
					//console.log('send attempt (body): ' + chunk);
					resolve(chunk);
				});
			});
			req.write(Data);
			req.end();
		});
	}
}

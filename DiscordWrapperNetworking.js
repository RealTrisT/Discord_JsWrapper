https   = require('https');
websock = require('ws');


module.exports = function DiscordWrapperNetworking(wSockCallback, wSockFailCallbackInfo, Token_) {
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
	this.WSockFailCallbackInfo = wSockFailCallbackInfo;

//	ALWAYS RETURNS TRUE - gets gateway info, sets this.GatewayInfo to it
	this.GetGatewayInfo = function() {
		return new Promise((resolve, reject) => {
			console.log("GetGatewayInfo called");
			proxy_me = this;
			try{
				var req = https.request(proxy_me.WebsocketsBotDomainRequestOptions, function(res){
					//if(res.statusCode)				//TODO: handle bad shit
					//console.log(res.statusCode);
					res.on('data', function (chunk) {
						proxy_me.GatewayInfo = JSON.parse(chunk);
						console.log("GetGatewayInfo success");
						resolve(true);
					});	
				});	
				req.on('error', function(error){
					proxy_me.GatewayInfo = undefined;
					console.log("GetGatewayInfo failiure(1)");
					resolve(false);
				});
				req.end();
			}catch(e){
				console.log("GetGatewayInfo failiure(2)");
				resolve(e);
			}
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
		try{
			this.SecWebsocketsConnection.send(senda);
		}catch(e){
			this.WSockFailCallbackInfo.callback(e, this.WSockFailCallbackInfo.param);
		}
		return true;
	}

	this.HttpApiSend = function(Method, Path, Data = undefined){ //TODO: make dis decent
		return new Promise((resolve, reject) => {
			var DataGotten = "";
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
					DataGotten+=chunk;
					//console.log("gotChunk");
				});
				res.on('end', function(){
					//console.log("finished");
					resolve(DataGotten);
				});
			});
			if(Data !== undefined)req.write(Data);
			req.end();
		});
	}
}

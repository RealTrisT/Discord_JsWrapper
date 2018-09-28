DiscordWrapperNetworking = require('./DiscordWrapperNetworking.js');


module.exports = function DiscordWrapperApi(Token){
	this.token = Token;
	this.heartbeatLoop = undefined;
	this.events = new (require('events'))();

	this.networking = new DiscordWrapperNetworking((data) => {
		var GatewayOp = JSON.parse(data);
		switch(GatewayOp.op){
			case 0:  //EVENT DISPATCH
				this.HandleEvent(GatewayOp);
			break;
			case 1:  //HEARTBEAT
				this.HandleHeartbeat();
			break;
			case 7:  //RECONNECT
				this.HandleReconnect();
			break;
			case 9:  //INVALID SESSION
				this.HandleInvalidSession();
			break;
			case 10: //HELLO
				this.HandleHello(GatewayOp);
			break;
			case 11: //HEARTBEAT ACK
				this.HandleHeartbeatAck();
			break;
		}
	}, Token);
	this.HandleEvent = function(GatewayOp){
		console.log("Event Dispatch OPCODE" + " - " + GatewayOp.t);
		this.events.emit(GatewayOp.t, GatewayOp.d);
	}
	this.HandleHeartbeat = function(){
		console.log("Heartbeat OPCODE");
	}
	this.HandleReconnect = function(){
		console.log("Reconnect OPCODE")
	}
	this.HandleInvalidSession = function(){
		console.log("Invalid Session OPCODE");	
	}
	this.HandleHello = function(GatewayOp){
		console.log("Hello OPCODE");
		this.InitHeartbeat(GatewayOp.d.heartbeat_interval); //won't beat immediately
		this.SendIdentify();
	}
	this.HandleHeartbeatAck = function(){
		console.log("Heartbeat Acknowledgement OPCODE");
	}


	this.InitHeartbeat = function(heartbeat_interval){
		var proxy_me = this;
		this.heartbeatLoop = setInterval(function(){
			proxy_me.BeatHeart();
		}, heartbeat_interval);
	}
	this.BeatHeart = function(){
		this.networking.GatewaySend(JSON.stringify({"op": 1, "d": null}));
	}
	this.SendIdentify = function(){
		this.networking.GatewaySend(JSON.stringify({
			"op": 2,
			"d": {
				"token": this.token,
				"properties": {
					"$os": "windows",
					"$browser": "metrexPC",
					"$device": "metrexPC"
				},
				"compress": false,
				"large_threshold": 250,
				"presence": {
					"game": {
						"name": "with fire, binary fire",
						"type": 0
					},
					"status": "online",
					"since": null,
					"afk": false
				}
			}
		}));
	}
}
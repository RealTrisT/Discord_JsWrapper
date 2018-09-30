module.exports = class DiscordWrapperApi{
	constructor(Token){
		this.token = Token;
		this.heartbeatLoop = undefined;
		this.events	= new (require('events'))();
		this.session = {sequence_nr: undefined, session_id: undefined}

		this.networking = new (require('./DiscordWrapperNetworking.js'))((data) => {
			var GatewayOp = JSON.parse(data);
			switch(GatewayOp.op){
				case 0:  //EVENT DISPATCH
					this.HandleEvent(GatewayOp);
					this.session.sequence_nr = GatewayOp.s;
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
		}, {'callback': this.WSockFailCallback, 'param': this}, Token);

		this.events.on('READY', (data) => {this.session.session_id = data.session_id;});
	}

	async WSockFailCallback(error, proxy_me){
		console.log("-----------WSOCK DIED------------- (" + error + ")");
		if(proxy_me.heartbeatLoop !== undefined)clearInterval(proxy_me.heartbeatLoop);
		if(await proxy_me.networking.GetGatewayInfo() === true)proxy_me.networking.OpenGateway();
		else proxy_me.events.emit('error', {code: 1, text: "Gateway Connection Dropped, Failed to Reconnect."});
	}

	HandleEvent(GatewayOp){
		console.log("Event Dispatch OPCODE" + " - " + GatewayOp.t);
		this.events.emit(GatewayOp.t, GatewayOp.d);
	}
	HandleHeartbeat(){
		console.log("Heartbeat OPCODE");
	}
	HandleReconnect(){
		console.log("Reconnect OPCODE")
	}
	HandleInvalidSession(){
		console.log("Invalid Session OPCODE");	
	}
	HandleHello(GatewayOp){
		console.log("Hello OPCODE");
		this.InitHeartbeat(GatewayOp.d.heartbeat_interval); //won't beat immediately
		if(this.session.session_id === undefined)this.SendIdentify(); //connecting
		else this.SendReconnect();									  //reconnecting
	}
	HandleHeartbeatAck(){
		console.log("Heartbeat Acknowledgement OPCODE");
	}


	InitHeartbeat(heartbeat_interval){
		var proxy_me = this;
		this.heartbeatLoop = setInterval(function(){
			proxy_me.BeatHeart();
		}, heartbeat_interval);
	}
	BeatHeart(){
		this.networking.GatewaySend(JSON.stringify({"op": 1, "d": this.session.sequence_nr}));
	}
	SendIdentify(){
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
	SendReconnect(){
		this.networking.GatewaySend(JSON.stringify({
			"op": 6,
			"d": {
				"token": this.token,
				"session_id": this.session.session_id,
				"seq": this.session.sequence_nr
			}
		}));
	}

}
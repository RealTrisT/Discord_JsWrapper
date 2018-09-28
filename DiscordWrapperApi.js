NWORKING = require('DiscordWrapperNetworking.js');

function DiscordWrapperApi(Token){

	token = Token;
	heartbeatLoop = undefined;


	networking = NWORKING.DiscordWrapperNetworking((data) => {
		var GatewayOp = JSON.parse(data);
		switch(GatewayOp.op){
			case 0:  //EVENT DISPATCH
				HandleEvent(GatewayOp);
			break;
			case 1:  //HEARTBEAT
				HandleHeartbeat();
			break;
			case 7:  //RECONNECT
				HandleReconnect();
			break;
			case 9:  //INVALID SESSION
				HandleInvalidSession();
			break;
			case 10: //HELLO
				HandleHello(GatewayOp);
			break;
			case 11: //HEARTBEAT ACK
				HandleHeartbeatAck();
			break;
		}
	});
	function HandleEvent(GatewayOp){
		console.log("Event Dispatch OPCODE" + " - " + GatewayOp.t);
	}
	function HandleHeartbeat(){
		console.log("Heartbeat OPCODE");
	}
	function HandleReconnect(){
		console.log("Reconnect OPCODE")
	}
	function HandleInvalidSession(){
		console.log("Invalid Session OPCODE");	
	}
	function HandleHello(GatewayOp){
		console.log("Hello OPCODE");
		InitHeartbeat(rec.d.heartbeat_interval); //won't beat immediately
		SendIdentify();
	}
	function HandleHeartbeatAck(){
		console.log(("Heartbeat Acknowledgement OPCODE");
	}


	function InitHeartbeat(heartbeat_interval){
		heartbeatLoop = setInterval(function(){
			BeatHeart();
		}, heartbeat_interval);
	}
	function BeatHeart(){
		networking.GatewaySend(JSON.stringify({"op": 1, "d": null}));
	}
	function SendIdentify(){
		networking.GatewaySend(JSON.stringify({
			"op": 2,
			"d": {
				"token": token,
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
NWORKING = require('DiscordWrapperNetworking.js');

function DiscordWrapperApi(){
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
				HandleHello();
			break;
			case 11: //HEARTBEAT ACK
				HandleHeartbeatAck();
			break;
		}
	});
	function HandleEvent(GatewayOp){

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
	function HandleHello(){
		console.log("Hello OPCODE");
	}
	function HandleHeartbeatAck(){
		console.log(("Heartbeat Acknowledgement OPCODE");
	}
}
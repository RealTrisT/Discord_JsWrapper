https = require('https');
auth = require('./auth.json');
websock = require('ws');

ret_gateway_info = {};
wss = 0;
heartbeat_loop = 0;
sequence_nr = 0;

var opts = {
	host: "discordapp.com",
	port: 443,
	path: "/api/gateway/bot",
	method: "GET",
	headers: {"Authorization": 'Bot ' + auth.token}
}
// teste 2 :D
var req = https.request(opts, function(res){
	console.log('STATUS: ' + res.statusCode + "\n");
	console.log('HEADERS: ' + JSON.stringify(res.headers) + "\n");
	res.setEncoding('utf8');
	res.on('data', function (chunk) {
		console.log("\n\n\nGOT DAYTA" + chunk + "\n\n\n");
		ret_gateway_info = JSON.parse(chunk);
		wss = new websock(ret_gateway_info.url + "/?v=6&encoding=json");
		wss.on('open', WSopen);
		wss.on('message', WSdata);
	});
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

req.end();

function BeatHeart(){
	var hb = JSON.stringify({"op": 1, "d": null});
	console.log("sending heartbeat: " + hb);
	wss.send(hb);
}

function WSopen(){
	console.log("ws connection open");
}
function WSdata(data){
	console.log(">-------<")
	var rec = JSON.parse(data);
	switch(rec.op){
		case 10: //hello
			console.log("got hello");
			heartbeat_loop = setInterval(BeatHeart, rec.d.heartbeat_interval);
			//BeatHeart();
			console.log("sending identify");
			wss.send(JSON.stringify({
				"op":2,
				"d":{
					"token": auth.token,
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
			//heartBeat();
			break;
		case 11: //heartbeat ack
			console.log("heartbeat acked");
			break;
		case 2:
			console.log("identify: " + JSON.parse(data));
			break;
		case 0:
			console.log("event: " + rec.t);
			console.log(JSON.stringify(rec, null, 4));
			sequence_nr = rec.s;
			switch(rec.t){
				case "READY":
					break;
			}
			break;
		default:
			console.log("------------------------UNKNOWN OPCODE----------------------\n" + data);
			break;
	}
}

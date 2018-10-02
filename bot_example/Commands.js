var commands = {
	'dropbox': cmd_dropbox,
	'elpb4':   cmd_elpb4,
	'sauce':   cmd_sauce,
	'help':    cmd_help,
	'grau':    cmd_grau,
	'nick':    cmd_nick,
	'elp':     cmd_elp,
	'subscribe':       require("./subscribeChannels").cmd_subscribe,
	'unsubscribe':     require("./subscribeChannels").cmd_unsubscribe
};

module.exports = function(Viscera, command, data){ //PROCESS
	var cmdf = commands[command];
	if(cmdf !== undefined)cmdf(Viscera, data);
}

function cmd_help(Viscera, data){
	Viscera.IOs.CreateMessage(data.channel_id, "```\
!elp [text] -> espeta com um link do google, \n\
               se tiver [text] espeta com o link da pesquisa\n\
!elpb4 -> pega na mensagem anterior ao comando, espeta com o link da pesquisa \n\
          e um ping para essa pessoa, e apaga o comando\n\
!dropbox -> espeta com link pa dropbox de lei\n\
!sauce -> espeta com link po código do bot```"
	);
}
function cmd_elp(Viscera, data){
	var search = data.content.substring(5);
	if(search == "")Viscera.IOs.CreateMessage(data.channel_id, "https://www.google.com");
	else Viscera.IOs.CreateMessage(data.channel_id, "https://www.google.com/search?q=" + encodeURIComponent(search));
}
function cmd_dropbox(Viscera, data){
	Viscera.IOs.CreateMessage(data.channel_id, "https://www.dropbox.com/sh/o2vjinvzog8bpp5/AACXF6m82edwyVBUkCrygDMia?dl=0");
}
async function cmd_elpb4(Viscera, data){
	var previousMessages = JSON.parse(await Viscera.IOs.GetMessages(data.channel_id, {'before': data.id, 'limit': 1}));
	Viscera.IOs.DeleteMessage(data.id, data.channel_id);
	Viscera.IOs.CreateMessage(data.channel_id,
		"https://www.google.pt/search?q=" + encodeURIComponent(previousMessages[0].content) + " " +
		"<@!" + previousMessages[0].author.id + ">"
	);
}
function cmd_sauce(Viscera, data){
	Viscera.IOs.CreateMessage(data.channel_id, "https://github.com/RealTrisT/Discord_JsWrapper");
}
function cmd_grau(Viscera, data){
	var which = undefined;
	switch(parseInt(data.content.substring(6))){
		case 1: which = "Besta"; 	   break;
		case 2: which = "Mancebo";	   break;
		case 3: which = "Académico";   break;
		case 4: which = "Veterano";    break;
		default:which = "Velha Guarda";break;
	}

	if(Viscera.LoggingInPeople[data.author.id] === undefined){
		Viscera.LoggingInPeople[data.author.id] = {Nick: {isset: false, val: ""}, Grau: {isset: true, val: which}};
	}else if(Viscera.LoggingInPeople[data.author.id].Nick.isset){
		var templogginin = Viscera.LoggingInPeople[data.author.id];
		templogginin.Grau = {isset: true, val: which};
		Viscera.LogUserIn(data, templogginin);
		delete Viscera.LoggingInPeople[data.author.id];
	}
}

function cmd_nick(Viscera, data){
	var newName = data.author.username;
	if((32 - data.author.username.length) < (data.content.length + 3)) {
		if((data.content.length - 6) > 32){newName = "parvo"; Viscera.IOs.CreateMessage(data.channel_id, "<@" + data.author.id + "> és parvo, 32 chars maximo.");
		}else newName = newName.substring(0, 32 - (data.content.length)) + "... (" + data.content.substring(6) + ")";
	}else 	newName += " (" + data.content.substring(6) + ")";

	if(Viscera.LoggingInPeople[data.author.id] === undefined){
		Viscera.LoggingInPeople[data.author.id] = {Nick: {isset: true, val: newName}, Grau: {isset: false, val: ""}};
	}else if(Viscera.LoggingInPeople[data.author.id].Grau.isset){
		var templogginin = Viscera.LoggingInPeople[data.author.id];
		templogginin.Nick = {isset: true, val: newName};
		Viscera.LogUserIn(data, templogginin);
		delete Viscera.LoggingInPeople[data.author.id];
	}
}

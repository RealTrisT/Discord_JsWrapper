DiscordWrapper = require('./DiscordWrapper');
auth = require('./auth.json');

var IOs = undefined;
var MyGuildID = undefined;
var MyRoles = {};
var MyChannels = {};

async function ey(){
	IOs = new DiscordWrapper(auth.token);

	IOs.on('error', function(error){
		if(error.code == 1){	//disconnect
			console.log("Got Connection Fuck Error");
			var eh = setInterval(async () => {
				if(await IOs.AttemptReconnection()){clearInterval(eh); console.log("we're back baby");}
				else console.log("Still Nothing")
			}, 5000);
		}
	});

	IOs.on('GUILD_CREATE', function(){
		MyGuildID = IOs.GetCachedGuild_ByName("TheThriftShop"); //temp
		MyGuildID.roles.forEach((role) => {MyRoles[role.name] = role.id;});
		MyGuildID.channels.forEach((channel) => {MyChannels[channel.name] = channel.id;});
		MyGuildID = MyGuildID.id;
	});

	IOs.on('GUILD_MEMBER_ADD', NewMember);

	IOs.on('MESSAGE_CREATE', async function(data){
		//if(data.content.indexOf('bot') != -1)IOs.CreateMessage(data.channel_id, "<@!" + data.author.id + "> vai pó caralho urso de merda fds");

		if(data.content.substring(0, 1) == '!'){
			var endCmd = data.content.indexOf(' ');
			var command = ((endCmd != -1)?data.content.substring(1, endCmd):data.content.substring(1)).toLowerCase();
//----------------------------------------------------------------
			switch(command){
				case 'dropbox': Cmd_Dropbox(data);break;
				case 'elp':     Cmd_Elp(data);    break;
				case 'elpb4':   Cmd_Elpb4(data);  break;
				case 'sauce':   Cmd_Sauce(data);  break;
				case 'grau':    Cmd_Grau(data);   break;
				case 'nick':    Cmd_Nick(data);   break;
			}
//----------------------------------------------------------------				
		}
	});

	if(await IOs.ApiWrapper.networking.GetGatewayInfo() === true)await IOs.ApiWrapper.networking.OpenGateway();
}ey();

function Cmd_Elp(data){
	var search = data.content.substring(5);
	if(search == "")IOs.CreateMessage(data.channel_id, "https://www.google.com");
	else IOs.CreateMessage(data.channel_id, "https://www.google.com/search?q=" + encodeURIComponent(search));
}

function Cmd_Sauce(data){
	IOs.CreateMessage(data.channel_id, "https://github.com/RealTrisT/Discord_JsWrapper");
}

async function Cmd_Elpb4(data){
	previousMessages = JSON.parse(await IOs.GetMessages(data.channel_id, {'before': data.id, 'limit': 1}));
	IOs.DeleteMessage(data.id, data.channel_id);
	IOs.CreateMessage(data.channel_id, 
		"https://www.google.pt/search?q=" + encodeURIComponent(previousMessages[0].content) + " " + 
		"<@!" + previousMessages[0].author.id + ">"
	);	
}

function Cmd_Dropbox(data){
	IOs.CreateMessage(data.channel_id, "https://www.dropbox.com/sh/o2vjinvzog8bpp5/AACXF6m82edwyVBUkCrygDMia?dl=0");
}

function Cmd_Help(data){
	IOs.CreateMessage(data.channel_id, "https://www.dropbox.com/sh/o2vjinvzog8bpp5/AACXF6m82edwyVBUkCrygDMia?dl=0");
}



var LoggingInPeople = {};

async function LogUserIn(data, GrauStr){
	await IOs.RemMemberRole(MyGuildID, data.author.id, MyRoles['Turista']);
	await IOs.SetMemberRole(MyGuildID, data.author.id, MyRoles[GrauStr]);
}

function Cmd_Grau(data){
	var which = undefined;
	switch(parseInt(data.content.substring(6))){
		case 1: which = "Besta"; 	   break;
		case 2: which = "Macebo";	   break;
		case 3: which = "Académico";   break;
		case 4: which = "Veterano";    break;
		default:which = "Velha Guarda";break;
	}

	if(LoggingInPeople[data.author.id] === undefined){
		LoggingInPeople[data.author.id] = {Nick: false, Grau: {isset: true, val: which}};
	}else if(LoggingInPeople[data.author.id].Nick){
		LogUserIn(data, which);
		delete LoggingInPeople[data.author.id];
	}	
}

function Cmd_Nick(data){
	var newName = data.author.username;
	if((32 - data.author.username.length) < (data.content.length + 3)) {
		if((data.content.length - 6) > 32){ newName = "parvo"; IOs.CreateMessage(data.channel_id, "<@" + data.author.id + "> és parvo, 32 chars maximo.");
		}else newName = newName.substring(0, 32 - (data.content.length)) + "... (" + data.content.substring(6) + ")";
	}else 	newName += " (" + data.content.substring(6) + ")";
	IOs.SetMemberNick(MyGuildID, data.author.id, newName);

	if(LoggingInPeople[data.author.id] === undefined){
		LoggingInPeople[data.author.id] = {Nick: true, Grau: {isset: false, val: ""}};
	}else if(LoggingInPeople[data.author.id].Grau.isset){
		LogUserIn(data, LoggingInPeople[data.author.id].Grau.val);
		delete LoggingInPeople[data.author.id];
	}
}

async function NewMember(data){
	IOs.SetMemberRole(MyGuildID, data.user.id, MyRoles['Turista']);
	await IOs.CreateMessage(MyChannels['new'], "\
<@" + data.user.id + "> sup manegga\nO teu role de momento é Turista, és basicamente lixo. \n\
Faz \"!grau TeuNumeroDeMatriculasNesteCurso\" e \"!nick TeuNome\" , para passares a ser alguém.\n\
(a partir de " + (32 - data.user.username.length - 3) + " caracteres o teu nick começa a cortar o teu nome original)\n\
Peço desculpa por esta merda mas n custa nada e evita confusão. https://i.imgur.com/9CAjIPG.png"
	);
}
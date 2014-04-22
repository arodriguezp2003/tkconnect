//var username = window.prompt("Ingrese su Username","arodriguez");</div>
$('.info').slimscroll({ height: '280px', });
$('<audio id="chatAudio"><source src="mp3/noty.mp3" type="audio/mpeg"></audio>').appendTo('body');
var socket = io.connect('http://192.168.1.70:3000');
var Id ="";
var Nombre="";
var Avatar ="";

var Idy ="arodriguez";
var Nombrey="Alejandro Rodriguez";
var Avatary ="avatar.jpg";

var Usuarios = [];

$("#xEnviar").keypress(function(e) {
	if(e.which == 13) 
	{
		if ($("#xEnviar").val()=="") { return;}

		var b = new TkConnect.Mensaje({avatar: Avatary, mensaje: $("#xEnviar").val(), tipo: "yo",fecha: moment().format('h:mm:ss a')})
		var v = new TkConnect.MensajeView({model:b, el:$(".info")});
		v.render();

		var m = {};
		m.user =Idy;
		m.user_d = Id;
		m.tipo = "el"
		m.msn = $("#xEnviar").val();
		m.fecha = Date.now();

		socket.emit('send message', m);
		$("#xEnviar").val("");
		$('.info').slimscroll({scrollBy: '500px'});
	}
});
socket.on('init', function (data) {
	for(x in data['Depto'])
	{

		var b = new TkConnect.Departamento(data['Depto'][x]);
		var v = new TkConnect.DepartamentoView({model:b, el:$(".chat")})
		v.render();
	}	

	Idy= prompt("Ingrese Usuario","arodriguez");
	Usuarios = data['User'];
	for(x in data['User'])
	{	
		if(data['User'][x].id != Idy)
		{
			var b = new TkConnect.Usuario(data['User'][x]);
			var v = new TkConnect.UsuarioView({model:b, el:$("#"  +data['User'][x].depto)})
			v.render();
		}
		else
		{
			Avatary = data['User'][x].avatar;
			Nombrey = data['User'][x].name;
		}
		
	}	 	   	
});

var num = new Array();
socket.on('nuevo_mensaje', function (data) {

	if (data.dest != Idy) 
	{
		return;
	}
	if(Id != data.user)
	{
		if(num[data.user] == 0 || num[data.user] ==  null ) 
		{
			$("#" + data.user ).append('<div class="nuevo">1</div>');
			num[data.user] = 2;
		}
		else
		{
			$("#" + data.user ).append('<div class="nuevo">' + num[data.user]+ '</div>');
			if(num[data.user]< 10)num[data.user]++;

			
		}
		var _usuario ;
		var _data ;
		var _avatar;
		$.each(Usuarios, function (i,v){
			if (v.id==data.user)
			{
					_usuario = v.name;
					_data = data.msn;
					_avatar = v.avatar;
			}
		} );
		mostrarNotificacion(_usuario,_data, "img/" + _avatar);

	}	
	else
	{
		var fecha = moment(data.fecha).format('h:mm:ss a');
		var b = new TkConnect.Mensaje({avatar: Avatar, mensaje: data.msn, tipo: "el", fecha: fecha})
		var v = new TkConnect.MensajeView({model:b, el:$(".info")})
		v.render();
		$('.info').slimscroll({scrollBy: '500px'});
	}

		$('#chatAudio')[0].play();
});
socket.on("old msn",function(docs){
	console.log("PASA");
	debugger;
	for(var i=0; i< docs.length; i++)
	{
		var fecha = moment(docs[i].creado).format('h:mm:ss a');
		if (docs[i].usuario!=Idy)
		{
				var b = new TkConnect.Mensaje({avatar: Avatar, mensaje: docs[i].mensaje, tipo: "el", fecha: fecha})
				var v = new TkConnect.MensajeView({model:b, el:$(".info")})
				v.render();
		}
		else
		{
				var b = new TkConnect.Mensaje({avatar: Avatary, mensaje: docs[i].mensaje, tipo: "yo", fecha: fecha})
				var v = new TkConnect.MensajeView({model:b, el:$(".info")})
				v.render();
		}
		$('.info').slimscroll({scrollBy: '500px'});
	}
	
});

function click(id,nombre,avatar)
{
	Id = id;
	Nombre = nombre ;
	Avatar = avatar;
	console.log(nombre + " " + id);

	$(".chat_ventana .titulo .nombre").text(nombre);
	$(".chat_ventana").show();
	$(".info").html("");
	$("#" + id).find(".nuevo").remove();

	//consultamos si tenemos mensajes disponibles
	socket.emit('old user', {uo: Idy, ud: Id});
	num[data.user] = 0;
}


$(".chat_ventana").hide();
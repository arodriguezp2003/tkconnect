var express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
mongoose = require('mongoose'),

departamentos = [{ id: "DT", name:'Departamento Tecnologias'}, 
{ id: "DC", name:'Departamento Comercial'},
{ id: "DG", name:'Departamento Gerencia'}] ,
users = 
[
{id: "arodriguez",name : "Alejandro Rodriguez", avatar:"avatar.jpg", depto : "DT"},
{id: "cencina", name : "Christian Encina", avatar:"avatar2.jpg", depto : "DT"},
{id: "rsoto", name : "Raul Soto",avatar:"avatar3.jpg", depto : "DC"},



];

server.listen(3000);

//**************** MONGO DB **************************
mongoose.connect('mongodb://localhost/tkconnect',function(err){
	if (err) {
		console.log(err);
	}else {
		console.log("MongoDB OK");
	}
});
var chatSchema = mongoose.Schema({
	usuario:String,
	mensaje:String,
	departamento: String,
	usuarioDestino:String,
	usuarioDestino2:String,
	creado: {type: Date, default: Date.now},
	recibido: {type: Date}

});
var Chat = mongoose.model('Mensajes',chatSchema);
// ****************************************************

// ********************** SOCKET IO *******************
io.sockets.on('connection', function(socket){
	socket.emit('init', { Depto:departamentos, User: users});
	socket.on('send message', function(data, callback)
	{
		var newMsn = new Chat({
			usuario:data.user,
			mensaje:data.msn,
			departamento: "0",
			usuarioDestino:  data.user_d + "<>" + data.user,
			usuarioDestino2:  data.user + "<>" + data.user_d
			 });
		newMsn.save(function(err){});
		console.log(data.user + " " +data.msn);
		socket.broadcast.emit('nuevo_mensaje', {user: data.user , dest: data.user_d, tipo: data.tipo, msn: data.msn , fecha: data.fecha});
	});

	socket.on('old user', function (data){
		console.log("OR: " + data.ud + "<>" +data.uo + " OR2: " + data.uo + "<>" +data.ud)+

		Chat.find( { "usuarioDestino" : { $in: [ data.ud + "<>" +data.uo, data.uo + "<>" +data.ud] } } 
			,function(err,docs)
			{
				console.log(docs);
				socket.emit('old msn',docs);		
			});

	});
});


// ****************************************************
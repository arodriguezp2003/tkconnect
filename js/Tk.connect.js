TkConnect ={}

TkConnect.Departamento = Backbone.Model.extend({});
TkConnect.Mensaje = Backbone.Model.extend({});
TkConnect.Usuario = Backbone.Model.extend({});

TkConnect.Departamentos = Backbone.Collection.extend({
	model:TkConnect.Departamento
});
TkConnect.Mensajes = Backbone.Collection.extend({
	model:TkConnect.Mensaje
});
TkConnect.Usuarios = Backbone.Collection.extend({
	model:TkConnect.Usuario
});

TkConnect.UsuarioView = Backbone.View.extend({

	template: Handlebars.compile($("#user_t").html()),
	tagName: 'div',
	el : '.departamento',
	className: 'departamento',
	initialize: function () {
	 this.listenTo(this.model,"change",this.render,this)	
	},
	render: function () {
		var html = this.template(this.model.toJSON());
		this.$el.append(html);
	},
});

TkConnect.UsuariosView = Backbone.View.extend({
	tagName:"ul",
	initialize:function () {
	  this.collection.on('add', this.addOne, this);
	},
	render: function () {
		this.collection.each(this.addOne,this);
		return this;
	},

	addOne: function(task)
	{
		var taskview = new TkConnect.UsuarioView({model:task});
		this.$el.append(taskview.render().el);
		return this;
	}
});



TkConnect.DepartamentoView = Backbone.View.extend({
	template: Handlebars.compile($("#depto").html()),
	tagName: 'div',
	className: 'chat',
	initialize: function () {
	 this.listenTo(this.model,"change",this.render,this)	
	},
	render: function () {
		var html = this.template(this.model.toJSON());
		this.$el.append(html);
	},
});

TkConnect.MensajeView =  Backbone.View.extend({
	template: Handlebars.compile($("#msn").html()),
	tagName: 'div',
	className: 'info',
	initialize: function () {
	 this.listenTo(this.model,"change",this.render,this)	
	},
	render: function () {
		var html = this.template(this.model.toJSON());
		this.$el.append(html);
	},
});
TkConnect.Router = Backbone.Router.extend({
	routes: {
		"u/:name" : "u",	
	},
	

 	u: function(name)
	{
		//alert("username: " + name);
	}
});
TkConnect.app = new TkConnect.Router();
Backbone.history.start();
window.Sfotipy = TkConnect;
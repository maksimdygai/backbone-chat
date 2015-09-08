/*

— need to figure out why app doesn't start
— need to add header and footer markup

*/

define(['exports', 'header', 'home', 'footer'], function (exports, headerTpl, homeTpl, footerTpl) {

	exports.ApplicationRouter = Backbone.Router.extend({
		routes: {
			"": "home",
			"*actions": "home"
		},

		initialize: function() {
			this.headerView = new HeaderView();
			this.headerView.render();
			this.footerView = new FooterView();
			this.footerView.render();
		},

		home: function() {
			this.homeView = new HomeView();
			this.homeView.render();
		}
	});

	exports.HeaderView = Backbone.View.extend({
		el: "#header",
		templateFileName: "header.html",
		template: headerTpl,
		initialize: function() {
		},
		render: function() {
			$(this.el).html(_.template(this.template));
		}
	});

	exports.FooterView = Backbone.View.extend({
		el: "#footer",
		template: footerTpl,
		render: function() {
			this.$el.html(_.template(this.template));
		}
	});
	
	exports.Message = Parse.Object.extend({
		className: "MessageBoard"
	});
	
	exports.MessageBoard = Parse.Collection.extend({
		model: Message
	});
	
	exports.HomeView = Backbone.View.extend({
		el: "#content",
		template: homeTpl,
		events: {
			"click #send": "saveMessage"
		},

		initialize: function() {
			this.collection = new MessageBoard();
			this.collection.bind("all", this.render, this);
			this.collection.fetch();
			this.collection.on("add", function(message) {
				message.save(null, {
					success: function(message) {
						console.log('saved ' + message);
					},
					error: function(message) {
						console.log('error');
					}
				});
			})
		},
		
		saveMessage: function() {
			var 
				newMessageForm = $("#new-message"),
				username = newMessageForm.find('[name="username"]').attr('value'),
				message = newMessageForm.find('[name="message"]').attr('value');
				
			this.collection.add({

				"username": username,
				"message": message
			});
		},
		
		render: function() {
			$(this.el).html(_.template(this.template, this.collection));
		}
	});

	Parse.initialize("p3NPYc5HAa2Ipqp3qDxOhMO0185XDLL1s1rKARen", "lVpL7nh2Z5i7P8Yop0bEjEEsEUCQcMhfqGUfqsms");
	app = new exports.ApplicationRouter();
	Backbone.history.start();
});

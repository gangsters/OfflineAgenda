var SERVER_INTERFACE_URL = "http://localhost/agendapp/server/eventInterface.php"; //TODO: Change PORT
var RELATIVE_SERVER_INTERFACE_URL = "../server/eventInterface.php";

var agendapp = {
	model: null, // See agendapp.model.js
	view: null, // See agendapp.view.js
	controller: null, // See agendapp.controller.js

	init: function () {
		this.model.pre_init();
		this.view.init();
		this.controller.init();
	},

};

/**
 * Main function
 */
$(window).load(function() {
	agendapp.init();
});
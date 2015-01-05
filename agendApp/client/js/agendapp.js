var SERVER_INTERFACE_URL = "http://localhost:8888/agendapp/server/eventInterface.php";
var RELATIVE_SERVER_INTERFACE_URL = "../server/eventInterface.php";
var	SERVER_ADDRESS = "http://localhost:8888";
var	SERVER_EVENT_SOURCE_URL = "http://localhost:8888/agendapp/server/eventSource.php";

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
var agendapp = {

	model: null, // See agendapp.model.js
	view: null, // See agendapp.view.js
	controller: null, // See agendapp.controller.js

	init: function () {
		this.model.init();
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
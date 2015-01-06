agendapp.controller = {

	init: function() {
		/*** Form submition listeners ***/
		$('#add-event-form').submit(this.addEvent);
		$('#edit-event-form').submit(this.editEvent);
		$('#remove-event-form').submit(this.removeEvent);
	},

	addEvent: function(jsEvent) {
		if ($('#add-event-form #title').val()) {
			var newEvent = new agendapp.model.CalendarEvent(
				$('#add-event-form #title').val(),
				$('#add-event-form #start').val(),
				$('#add-event-form #end').val()
			);
			agendapp.model.save(newEvent, agendapp.view.refresh());
		}
		$.unblockUI(); // Remove the pop-up
		jsEvent.preventDefault(); // Avoïd the page to be reloaded
	},

	dropEvent: function(calEvent, delta, revertFunc) {
		var myEvent = new agendapp.model.CalendarEvent();
		myEvent.fromFullCalendarEvent(calEvent);
		agendapp.model.save(myEvent, agendapp.view.refresh());
	},
	
	resizeEvent: function(calEvent, delta, revertFunc) {
		var myEvent = new agendapp.model.CalendarEvent();
		myEvent.fromFullCalendarEvent(calEvent);
		agendapp.model.save(myEvent, agendapp.view.refresh());
	},
	
	editEvent: function(jsEvent) {
		var editedEvents = $('#agenda').fullCalendar('clientEvents',$('#edit-event-form').attr('event-id'));
		for (var i = editedEvents.length - 1; i >= 0; i--) {
			editedEvents[i].title = $('#edit-event-form #title').val();
			var myEvent = new agendapp.model.CalendarEvent();
			myEvent.fromFullCalendarEvent(editedEvents[i]);
			agendapp.model.save(myEvent, agendapp.view.refresh());
		};
		$.unblockUI(); // Remove the pop-up
		jsEvent.preventDefault();
	},
	
	removeEvent: function(jsEvent) {
		var editedEvents = $('#agenda').fullCalendar('clientEvents',$('#remove-event-form').attr('event-id'));
		for (var i = editedEvents.length - 1; i >= 0; i--) {
			var myEvent = new agendapp.model.CalendarEvent();
			myEvent.fromFullCalendarEvent(editedEvents[i]);
			agendapp.model.delete(myEvent, agendapp.view.refresh());
		};
		$.unblockUI(); // Remove the pop-up
		jsEvent.preventDefault();
	}
}
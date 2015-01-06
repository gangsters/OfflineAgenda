agendapp.view = {

	init: 	function() {
		/*** Creating calendar ***/
		// See http://fullcalendar.io/docs/ for more informations.
		$('#agenda').fullCalendar({
			/*** Display settings ***/
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			defaultDate: '2015-01-05',
			/*** Behavior settings ***/
			selectable: true,
			selectHelper: true,
			editable: true,
			eventLimit: true,
			/*** Data settings ***/
			events: agendapp.model.fetchEvents,
			/*** UI-Event listeners ***/
			select: agendapp.view.showAddEventForm, // Day-Selection event
			eventClick: agendapp.view.showEditEventForm, // Event-Selection event
			eventDragStop: agendapp.view.showRemoveEventForm, // Event-drag-stop event
			eventDrop: agendapp.controller.dropEvent, // Event-drop event
			eventResize: agendapp.controller.resizeEvent // Event-Resize event
		});
		/*** Creating the event trashcan ***/
		$('#trash').droppable({
			tolerance: "pointer",
			over: function(event, ui) { // handlerIn
				$('#trash').attr('src','res/open-trash.png');
			},
			out: function(event, ui) { // handlerOut
				$('#trash').attr('src','res/trash.png');
			}
		});
        // getting and displaying the events in the view
        agendapp.view.refresh();
	},

	showAddEventForm: function(start, end) {
		$('#add-event-form #start').val(start.format()); // Filling start date form field
		$('#add-event-form #end').val(end.format()); // Filling end date form field
		$.blockUI({ 
			message: $('#add-event-popup') ,
			onOverlayClick: $.unblockUI
		}); // Showing the previously filled pop-up
	},

	showEditEventForm: function(calEvent) {
		$('#edit-event-form #title').val(calEvent.title); // Filling title form field
		$('#edit-event-form').attr('event-id',calEvent.id); // Setting the event-id attribute
		$.blockUI({ 
			message: $('#edit-event-popup'),
			onOverlayClick: $.unblockUI
		}); // Showing the previously filled pop-up
	},

	showRemoveEventForm: function(calEvent, jsEvent) {
		var trash = $('#trash');
		var ofs = trash.offset();
		var x1 = ofs.left;
		var x2 = ofs.left + trash.outerWidth(true);
		var y1 = ofs.top;
		var y2 = ofs.top + trash.outerHeight(true);

		if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 && 
			jsEvent.pageY >= y1 && jsEvent.pageY <= y2) { // If the event was dropped on the trash can area
			$('#remove-event-form #title').html(calEvent.title); // Filling title span
			$('#remove-event-form').attr('event-id',calEvent.id); // Setting the event-id attribute
			$.blockUI({ 
				message: $('#remove-event-popup'),
				onOverlayClick: $.unblockUI
			}); // Showing the previously filled pop-up
		}
	},

	refresh: function() {
		$('#agenda').fullCalendar('refetchEvents');
	}
	
}
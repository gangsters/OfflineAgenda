var agendapp = {

	init: function () {
		this.model.init();
		this.view.init();
		this.controller.init();
	},

	model: {
        
		init: 	function() {
            /**
             * Creates a new calendar event instance.
             * @constructor
             */
            function CalendarEvent(name, beginDate, endDate) {
                // properties
                this.name = name,
                this.beginDate = beginDate;
                this.endDate = endDate;
            }
            
            /**
             * Creates a new calendar event instance.
             * @constructor
             */
            function CalendarEvent(name, beginDate) {
                // properties
                this.name = name,
                this.beginDate = beginDate;
            }
            
            // Methods for CalendarEvent prototype
            // displayAll est un test, il faudra la virer
            CalendarEvent.prototype.displayAll = function() {
                return this.name + " " + this.beginDate + " " + this.endDate;
            };
            
            // export to agendapp the prototype
            agendapp.model.CalendarEvent = CalendarEvent;
		},


        fetchEvents: function (start, end, timezone, callback) {
			// TEST à virer
            var event1 = new agendapp.model.CalendarEvent('jaune1', '2015-01-02');
            var event2 = new agendapp.model.CalendarEvent('jaune2', '2015-01-05', '2015-01-08');
            // Must return an array of Event Objects via the callback function (See http://fullcalendar.io/docs/event_data/Event_Object/)
			var events = [
			{
				title: 'All Day Event',
				start: '2014-11-01'
			},
			{
				title: 'Long Event',
				start: '2014-11-07',
				end: '2014-11-10'
			},
			{
				title: event1.name,
				start: event1.beginDate,
                end: '2015-01-02'
			},
			{
				title: event2.name,
				start: event2.beginDate,
				end: event.endDate
			}
            ];
			callback(events);
		},
        
	},

	view: {
		init: 	function() {
			/*** Creating Calendar ***/
			// See http://fullcalendar.io/docs/ for more informations.
			$('#agenda').fullCalendar({
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay'
				},
				defaultDate: '2015-01-05',
				selectable: true,
				selectHelper: true,
				select: agendapp.view.showAddEventForm,
				editable: true,
				eventLimit: true,
				events: agendapp.model.fetchEvents,
				// events: 
			});
		},
		showAddEventForm: function(start, end) {
			//TODO: passer start et end par le form
			$('#add-event-form #start').val(start.format());
			$('#add-event-form #end').val(end.format());
			$.blockUI({ message: $('#add-event-popup') });
		}
	},

	controller: {
		init: function() {
			/*** Adding Form Submition Listeners ***/
			$('#add-event-form').submit(this.addEvent);
			$('#edit-event-form').submit(this.editEvent);
			$('#remove-event-form').submit(this.removeEvent);
		},
		addEvent: function(event) {
			if ($('#add-event-form #title').val()) {
				var eventData = {
					title: $('#add-event-form #title').val(),
					start: $('#add-event-form #start').val(),
					end: $('#add-event-form #end').val()
				};
				console.log(eventData);
				$('#agenda').fullCalendar('renderEvent', eventData, true); // stick? = true
			}
			$.unblockUI();
			event.preventDefault();
		},
		editEvent: function(event) {
			console.log($('#edit-event-form #title').val());
			event.preventDefault();
		},
		removeEvent: function(event) {
			console.log($('#remove-event-form #title').val());
			event.preventDefault();
		},
	},

};

$(document).ready(function() {
	agendapp.init();
});
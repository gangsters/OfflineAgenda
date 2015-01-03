var agendapp = {

	init: function () {
		this.model.init();
		this.view.init();
		this.controller.init();
	},

	model: {

		localDB: {
			db: null,
			open: function() {
				var version = 2;
				console.log('Opening local database');
				var request = indexedDB.open("agendapp", version);

				request.onupgradeneeded = function(e) {
					var db = e.target.result;
					// A versionchange transaction is started automatically.
					e.target.transaction.onerror = agendapp.model.localDB.onError;

					if(db.objectStoreNames.contains("event")) {
						console.log('Deleting previous event object store');
						db.deleteObjectStore("event");
					}
					/*** Creating database table (or object store) ***/
					var store = db.createObjectStore("event",{keyPath: "id"});
					store.createIndex("start", "start", { unique: false });
					store.createIndex("end", "end", { unique: false });
					store.createIndex("title", "title", { unique: false });
				};

				request.onsuccess = function(e) {
					console.log('Local database successfully open');
					agendapp.model.localDB.db = e.target.result;
					agendapp.view.refresh();
				};

				request.onerror = agendapp.model.localDB.onError;
			},
			addEvent: function(calEvent) {
				var db = agendapp.model.localDB.db;
				if(db) {
					var trans = db.transaction(["event"], "readwrite");
					var store = trans.objectStore("event");
					var request = store.add(calEvent);
					request.onsuccess = function(e) {
						console.log('Event successfully added to local database');
						agendapp.view.refresh();
					};
					request.onerror = agendapp.model.localDB.onError;
				}
			},
			onError: function(error) {
				console.log(error.value);
			},
		},

		init: 	function() {
			// Opening local HTML5 indexed database
			agendapp.model.localDB.open();

            var SERVER_INTERFACE_URL = "http://localhost/agendapp/server/eventInterface.php";
            var RELATIVE_SERVER_INTERFACE_URL = "../server/eventInterface.php";
            
            /**
             * Creates a new calendar event instance.
             * @constructor
             */
             function CalendarEvent(title, beginDate, endDate) {
                // properties
                this.title = title;
                this.beginDate = beginDate;
                this.endDate = endDate;
            }
            
            /*** METHODS FOR CALENDAR PROTOTYPE ***/
            
            /**
             * Save the current CalendarEvent to server database
             * If the returned JSON is incorrect the callback will not be executed. SILENTLY.
             * This is due to the conversion to JSON function ...
             */
            CalendarEvent.prototype.save_to_server = function() {
                var request_data = '';
                request_data += "query=save";
                request_data += "&event="+JSON.stringify(this);
                console.log(request_data);
                $.getJSON(SERVER_INTERFACE_URL, request_data, function (result) {
                    if (result.error == 'KO') {
                        console.log('An error occured while saving event in server. Details : '.result.message);
                    }
                    else if(result.error == 'OK'){
                        console.log('Event saved to server.');
                    }
                    else{
                        console.log('Unexpected error with server. '.result);
                    }
                });
            }
            
            /**
             * Save the current CalendarEvent to local database.
             */
            CalendarEvent.prototype.save_to_localdb = function() {
                //TODO
            }
            
            /**
             * Delete the current CalendarEvent of server database.
             */
            CalendarEvent.prototype.delete_of_server = function () {
                var request_data = '';
                request_data += "query=delete";
                request_data += "&event="+JSON.stringify(this);
                $.getJSON(SERVER_INTERFACE_URL, request_data, function (result) {
                    if (result.error == 'KO') {
                        console.log('An error occured while deleting event in server. Details : '.result.message);
                    }
                    else if(result.error == 'OK'){
                        console.log('Event deleted of server.');
                    }
                    else{
                        console.log('Unexpected error with server. '.result);
                    }
                });
            }
            
            /**
             * Delete the curent calendar event from local database.
             */
            CalendarEvent.prototype.delete_of_localdb = function() {
                //TODO
            }
            // export to agendapp the prototype
            agendapp.model.CalendarEvent = CalendarEvent;
        },

        /*** GENERALS MODEL METHODS ***/
        /**
         * Get all events stored in server database.
         */
        function get_all_events_from_server() {
            var result = [];
            var request_data = '';
            request_data += "query=readAll";
            $.getJSON(SERVER_INTERFACE_URL, request_data, function (result) {
                if (result.error == 'KO') {
                    console.log('An error occured while deleting event in server. Details : '.result.message);
                }
                else if(result.error == 'OK'){
                    var events_obj = result.events;
                    var calendarevents = [];
                    var arrayLength = events_obj.length;
                    for (var i = 0; i < arrayLength; i++) {
                        var newevent = new CalendarEvent(events_obj[i].title, events_obj[i].beginDate, events_obj[i].endDate);
                        newevent.id = events_obj[i].id;
                        calendarevents.push(newevent);
                    }
                    console.log(arrayLength+' events has been get from server.');
                    return calendarevents;
                }
                else{
                    console.log('Unexpected error with server. '.result);
                }
            });
        },

        /**
         * Get all events stored in local database.
         */
        function get_all_events_from_localdb() {
            //TODO   
        },

		/**
		 * Fetch all events from local database (fullCalendar callback)
		 */
        fetchEvents: function (start, end, timezone, callback) {
			var db = agendapp.model.localDB.db;
			if(db) {
				// start transaction with the event table (also called object store)
				var trans = db.transaction(["event"], "readwrite");
				// get the object store
				var store = trans.objectStore("event");
				// get the whole keyRange
				var keyRange = IDBKeyRange.lowerBound(0);
				// get the cursor
				var cursorRequest = store.openCursor(keyRange);

				cursorRequest.onsuccess = function(e) {
					var result = e.target.result;
					if(!!result == false) return;
					//TODO: add result to events var (see below)
					result.continue();
				};

				cursorRequest.onerror = agendapp.model.localDB.onError;
			}
            
			// Must return an array of Event Objects via the callback function (See http://fullcalendar.io/docs/event_data/Event_Object/)
			var events = [
			{
				id: new Date().getTime(),
				title: 'All Day Event',
				start: '2014-11-01'
			},
			{
				id: new Date().getTime(),
				title: 'Long Event',
				start: '2014-11-07',
				end: '2014-11-10'
			},
			{
				id: new Date().getTime(),
				title: event1.name,
				start: event1.beginDate,
				end: '2015-01-02'
			},
			{
				id: new Date().getTime(),
				title: event2.name,
				start: event2.beginDate,
				end: event2.endDate
			}
			];
			callback(events);
		},
        
        /*** SIMPLE FUNCTIONS FOR PERSISTENCE - THIS FUNCTIONS MUST BE CALLED FROM CONTROLLER AND NO OTHER !***/
        /**
         * Save a CalendarEvent ; no matter whether you're online or offline.
         */
        function save($calendarevent){
            //TODO check connectivity
            
            //TODO if offline, store locally with a tag
            
            //TODO if online, get update then store locally and remotely
        },
        
        /**
         * Delete a CalendarEvent ; no matter whether you're online or offline.
         */
        function delete($calendarevent) {
            //TODO check connectivity
            
            //TODO if offline, delete locally with a tag
            
            //TODO if online, get update then delete locally and remotely
        },
        
        /**
         * Set local database and server database to the same version.
         * Resolve conflicts if they are some.
         * If online -> online : push merged/new data.
         * If offline -> online : pull, merge, push.
         * If offline -> offline : do nothing
         * This function must be called :
         * * when local app retrieve connectivity
         * * each time a modification was made by another client on server database. (publish-subscribe?)
         */
        function actualize() {
            // TODO if online
            // TODO get all events from server
            // TODO get all events from local
            // check what to push.
            // check if the ID problem
            // store locally
            // push back to server if still online
            // get IDs of pushed events to set the ID locally.
        }
        

		
	},

	view: {
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
	},

	controller: {
		init: function() {
			/*** Form submition listeners ***/
			$('#add-event-form').submit(this.addEvent);
			$('#edit-event-form').submit(this.editEvent);
			$('#remove-event-form').submit(this.removeEvent);
		},
		addEvent: function(jsEvent) {
			if ($('#add-event-form #title').val()) {
				var eventData = {
					id: new Date().getTime(),
					title: $('#add-event-form #title').val(),
					start: $('#add-event-form #start').val(),
					end: $('#add-event-form #end').val()
				};
				console.log(eventData);
				agendapp.model.localDB.addEvent(eventData);
			}
			$.unblockUI(); // Remove the pop-up
			jsEvent.preventDefault(); // Avoïd the page to be reloaded
		},
		dropEvent: function(calEvent, delta, revertFunc) {
			console.log(calEvent.title + " was dropped on " + calEvent.start.format());
			//TODO: Enregistrer en BD
		},
		resizeEvent: function(calEvent, delta, revertFunc) {
			console.log(calEvent.title + " was resized to " + calEvent.end.format());
			//TODO: Enregistrer en BD
		},
		editEvent: function(jsEvent) {
			var editedEvents = $('#agenda').fullCalendar('clientEvents',$('#edit-event-form').attr('event-id'));
			console.log(editedEvents[0].title + "was renamed " + $('#edit-event-form #title').val());
			for (var i = editedEvents.length - 1; i >= 0; i--) {
				editedEvents[i].title = $('#edit-event-form #title').val();
				$('#agenda').fullCalendar('updateEvent', editedEvents[i]);
			};
			//TODO: Enregistrer en BD
			$.unblockUI(); // Remove the pop-up
			jsEvent.preventDefault();
		},
		removeEvent: function(jsEvent) {
			console.log($('#remove-event-form #title').html() + " was removed (id: " + $('#remove-event-form').attr('event-id') + ")");
			$('#agenda').fullCalendar('removeEvents', $('#remove-event-form').attr('event-id'));
			//TODO: Enregistrer en BD
			$.unblockUI(); // Remove the pop-up
			jsEvent.preventDefault();
		},
	},

};

$(document).ready(function() {
	agendapp.init();
});
agendapp.model = {

	localDB: {
		db: null,
		open: function() {
			var version = 8;
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
				var store = db.createObjectStore("event",{ keyPath: "id" });
				store.createIndex("title", "title", { unique: false });
				store.createIndex("beginDate", "beginDate", { unique: false });
				store.createIndex("endDate", "endDate", { unique: false });
			};

			request.onsuccess = function(e) {
				console.log('Local database successfully open');
				agendapp.model.localDB.db = e.target.result;
				agendapp.view.refresh();
			};

			request.onerror = agendapp.model.localDB.onError;
		},
		onError: function(error) {
			console.log(error.value);
		},
	},

	init: 	function() {
		var SERVER_INTERFACE_URL = "http://localhost:8888/agendapp/server/eventInterface.php"; //TODO: Change PORT
		var RELATIVE_SERVER_INTERFACE_URL = "../server/eventInterface.php";
        
        /*** handling Offline/online mode ***/
        IS_ONLINE=false; // global variable
        function updateOnlineStatus() {
            IS_ONLINE = navigator.onLine;
            if (IS_ONLINE){
                console.log('Switched to online mode.');
            }
            else{
                console.log('Switched to offline mode.');
            }
        }

        updateOnlineStatus("load");
        window.addEventListener("online", function () {
                  updateOnlineStatus() ;
        }, false);
        window.addEventListener("offline", function () {
                    updateOnlineStatus();
        }, false);

		/*** Opening local HTML5 indexed database ***/
		agendapp.model.localDB.open();
		
		/**
		 * Creates a new calendar event instance.
		 * @constructor
		 */
		function CalendarEvent(title, beginDate, endDate) {
			this.title = title;
			this.beginDate = beginDate;
			this.endDate = endDate;
			this.id = new Date().getTime();
            this.isDirty = true;
            this.toDelete = false;
		}

		/**
		 * Creates a new calendar event instance from an Event instance.
		 * @constructor
		 */
		CalendarEvent.prototype.fromFullCalendarEvent = function(calEvent) {
			this.title = calEvent.title;
			this.beginDate = calEvent.start.format();
			this.endDate = calEvent.end.format();
			this.id = calEvent.id;
		}
		
		/*** METHODS FOR CALENDAR PROTOTYPE ***/
		
		/**
		 * Save the current CalendarEvent to server database
		 * If the returned JSON is incorrect the callback will not be executed. SILENTLY.
		 * This is due to the conversion to JSON function ...
         * @return true if the transaction is successful ; false otherwise.
		 */
		CalendarEvent.prototype.save_to_server = function(callback) {
			var request_data = '';
			request_data += "query=save";
			request_data += "&event="+JSON.stringify(this);
			console.log(request_data);
			$.getJSON(SERVER_INTERFACE_URL, request_data, callback);
		}
		
		/**
		 * Save the current CalendarEvent to local database.
		 */
		CalendarEvent.prototype.save_to_localdb = function(callback) { //TODO: callback pas vrmt utile
			var db = agendapp.model.localDB.db;
			if(db) {
				var trans = db.transaction(["event"], "readwrite");
				var store = trans.objectStore("event");
				var request = store.put(this);
				request.onsuccess = function(e) {
					console.log('Event successfully saved to local database.');
					agendapp.view.refresh(); //TODO: Use actualize()
				};
				request.onerror = agendapp.model.localDB.onError;
			}
		}
		
		/**
		 * Delete the current CalendarEvent of server database.
         * @return true if success ; false otherwise.
		 */
		CalendarEvent.prototype.delete_of_server = function(callback) {
			var request_data = '';
			request_data += "query=delete";
			request_data += "&event="+JSON.stringify(this);
			console.log(request_data);
			$.getJSON(SERVER_INTERFACE_URL, request_data, callback);
		}

		/**
		 * Delete the curent calendar event from local database.
		 */
		CalendarEvent.prototype.delete_of_localdb = function(callback) {
			var db = agendapp.model.localDB.db;
			if(db) {
				var trans = db.transaction(["event"], "readwrite");
				var store = trans.objectStore("event");
				var request = store.delete(this.id);
				request.onsuccess = function(e) {
					console.log('Event successfully deleted from local database.');
					agendapp.view.refresh();
				};
				request.onerror = agendapp.model.localDB.onError;
			}
		}
        
        /**
         * Check if an event is the same as the current one.
         * @return true if same; false otherwise.
         */
         CalendarEvent.prototype.is_same = function(other_event) {
             result = this.id === other_event.id && this.title === other_event.title;
             result = result && this.beginDate === other_event.beginDate && this.endDate === other_event.endDate;
             return result
         }
        
		// export to agendapp the prototype
		agendapp.model.CalendarEvent = CalendarEvent;
	},

	/*** GENERALS MODEL METHODS ***/
	/**
	 * Get all events stored in server database.
     * @return an array of CalendarEvent
	 */
	get_all_events_from_server: function() {
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
					var newevent = new CalendarEvent(events_obj[i].title, events_obj[i].start, events_obj[i].end);
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
     * @return an array of CalendarObject
	 */
	get_all_events_from_localdb: function() {
		var events = [];
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
				events.push(result.value);
				result.continue();
			};
			cursorRequest.onerror = agendapp.model.localDB.onError;
			trans.oncomplete = function(e) {
				console.log(events);
				return(events);
			}
		}
	},

	/**
	 * Fetch all events from local database (fullCalendar callback)
	 */
	fetchEvents: function (start, end, timezone, callback) {
		var events = [];
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
				result.value.start = result.value.beginDate; // Quickly convert our CalendarEvent to the fullCalendar ones
				result.value.end = result.value.endDate; // Quickly convert our CalendarEvent to the fullCalendar ones
				events.push(result.value);
				result.continue();
			};
			cursorRequest.onerror = agendapp.model.localDB.onError;
			trans.oncomplete =  function(e) {
				console.log("All events have been successfully fetched from local database.");
				callback(events);
			}
		}
	},
	
	/*** SIMPLE FUNCTIONS FOR PERSISTENCE - CONTROLLERS MUST CALL THESE FUNCTIONS AND NO OTHER !***/
	/**
	 * Save a CalendarEvent ; no matter whether you're online or offline.
	 */
	save: function(calendarevent){
		// if online, store locally and remotely
		if (IS_ONLINE){
            calendarevent.save_to_server(function (result) {
				console.log(result);
				if (result.error == 'KO') {
            		calendarevent.isDirty = true;
	    			calendarevent.save_to_localdb();
					console.log('An error occured while saving event in server. Details : '.result.message);
				}
				else if(result.error == 'OK'){
            		calendarevent.isDirty = false;
					calendarevent.id = result.id;
	    			calendarevent.save_to_localdb();
					console.log('Event saved to server.');
				}
				else{
            		calendarevent.isDirty = true;
	    			calendarevent.save_to_localdb();
					console.log('Unexpected error with server. '.result);
				}
			});
        }
        else {
            calendarevent.isDirty = true;
	        // if offline, store locally with a tag saying 'not synchronized'.
	        //very important. If save_to_server() failed, it will be sent again at next refresh.
	    	calendarevent.save_to_localdb();
			console.log('Offline: saving event locally.');
        }
	},
	
	/**
	 * Delete a CalendarEvent ; no matter whether you're online or offline.
	 */
	delete: function(calendarevent) {
		// if online, get update then delete locally and remotely
		console.log("DELETE");
		if(IS_ONLINE){
            calendarevent.delete_of_server(function (result) {
				if (result.error == 'KO') {
	                calendarevent.isDirty = true;
	                calendarevent.toDelete = true;
	                calendarevent.save_to_localdb();
					console.log('An error occured while deleting event in server. Details : '.result.message);
                    return false;
				}
				else if(result.error == 'OK'){
                	calendarevent.delete_of_localdb();
					console.log('Event successfully deleted from server.');
                    return true;
				}
				else{
	                calendarevent.isDirty = true;
	                calendarevent.toDelete = true;
	                calendarevent.save_to_localdb();
					console.log('Unexpected error with server.'.result);
                    return false;
				}
			});
        }
        // if offline, tag to delete.
        else{
            calendarevent.isDirty = true;
            calendarevent.toDelete = true;
            calendarevent.save_to_localdb();
			console.log('Offline: saving flagged-event locally.');
        }
	},
    
	/**
     * Test if a calendarevent is in an array.
     * Comparaison is based on ID.
     * If an event doesn't have an id, it isn't take into account.
     * @return true if array contains calendarevent ; false otherwise
     */
    contains: function(calendarevent, array){
        var result = false;
        if (isset(calendarevent.id)){
            var length = array.length;
            var i = 0;
            while (!result && i<length) {
                if(isset(array[i].id)){
                    result = array[i].id === calendarevent.id;
                }
                i++;
            }
        }
        return result;
    },
        
    /**
     * Retrieve the index of the array where a similar calendarevent (based on id only) is.
     * Comparaison is based on ID.
     * If an event doesn't have an id, it isn't take into account.
     * @return index of the similar event if there is one; -1 otherwise.
     */
    get_position_same_id_event: function(calendarevent, array){
        var result = -1;
        var found = false;
        if (isset(calendarevent.id)){
            var length = array.length;
            var i = 0;
            while (!found && i<length) {
                if(isset(array[i].id) && array[i].id === calendarevent.id){
                    found = true;
                    result = i;
                }   
                i++;
            }
        }
        return result;
    },
    
	/**
	 * Set local database and server database to the same version (if connection allows it of course !).
	 * Resolve conflicts if they are some.
     * if beforeCall -> whenFunctionIsCalled : what is done by actualize().
	 * If online -> online : pull from server. Then, push dirty data. If push succeeded, clean data locally (undirty and delete).
	 * If offline -> online : idem as online -> online. BUT MAY NEED A VIEW REFRESH.
	 * If offline -> offline : do nothing
	 * This function must be called :
	 * * when local app retrieve connectivity
	 * * each time a modification was made by another client on server database. (publish-subscribe?)
	 */
	actualize: function() {
		if(IS_ONLINE){
            var events_server = get_all_events_from_server();
            var events_local = get_all_events_from_localdb();//<<<--- problem d'asynchrone. Du coup, faut résoudre ça cf discussion fb.
            /* merge server events -> local events */
            var events_server_length = events_server.length;
			for (var i = 0; i < events_server_length; i++) {
                var serverevent = events_server[i];
                // if server event is NOT in local_events : add it.
                if (!contains(serverevent, events_local)) {
                    serverevent.isDirty = false;
                    serverevent.toDelete = false;
                    events_local.push(serverevent);
                    serverevent.save_to_localdb();
                    console.log('Added one new event from server.');
                }
                // if server event is in local_events => resolving
                else{
                    var localevent_position = get_position_same_id_event(serverevent, events_local);
                    var localevent = events_local[localevent_position];
                    // events are same (ID) = someone changed something => resolve
                    if (!localevent.is_same(serverevent)) {
                        // local dirty (modified) => local event wins over server event // CHOICE TO PRIVILEGE LOCAL
                        if (localevent.isDirty && !localevent.toDelete) {
                            var success = localevent.save_to_server();
                            if (success) {
                                events_local[localevent_position].isDirty = false;
                                events_local[localevent_position].save_to_localdb();
                                console.log('An event modified locally overwrited an event modified by someone else. Conflict solved.');
                            }
                        }
                        // local dirty to delete (modifed locally then deleted) => delete everywhere
                        else if (localevent.isDirty && localevent.toDelete) {
                            var success = localevent.delete_of_server();
                            if (success) {
                                events_local.slice(localevent_position, 1);
                                events_local[localevent_position].delete_of_localdb();
                                console.log('A locally modified-then-deleted event was permanently deleted.');
                            }
                        }
                        // local not dirty (not modified) = server event is dirty => server event win over local event
                        else{
                            serverevent.isDirty = false;
                            events_local.slice(localevent_position, 1);
                            events_local.push(serverevent);
                            serverevent.save_to_localdb();
                            console.log('An event was updated by someone else.');
                        }
                    }
                    // events are same = no change => do nothing
                    else{}
                }
            }// server_events is now same as local_events
            
            // push local dirty events -> server. Then clean them (delete or undirty).
            var locallength = events_local.length;
            for (var i = 0; i <locallength; i++) {
                // dirty events
                if (isset(events_local[i].isDirty) && events_local[i].isDirty) {
                    // events to delete
                    if (isset(events_local[i].toDelete) && events_local[i].toDelete) {
                        success = events_local[i].delete_of_server();
                        if (success) {
                            events_local[i].delete_of_localdb();
                            events_local.slice(i, 1);
                        }
                    }
                    // events to create or update
                    else{
                        success = events_local[i].save_to_server();
                        if (success) {
                            events_local[i].isDirty = false;
                            events_local[i].save_to_localdb();
                        }
                    }
                }
            }
            //TODO get IDs of pushed events to set the ID locally.
            
            //TODO écraser la variable globale client des events par events_local ou alors l'appeler events_local et virer la 3eme ligne de cette fonction.
        }
	}
}
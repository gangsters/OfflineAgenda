agendapp.model = {
    
    events_local : [],
    events_server : [],
    test : [],
    
	localDB: {
		db: null,
		open: function(callback) {
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
                callback();
			};

			request.onsuccess = function(e) {
				console.log('Local database successfully open');
				agendapp.model.localDB.db = e.target.result;
				agendapp.view.refresh();
                callback();
			};

			request.onerror = agendapp.model.localDB.onError;
		},
		onError: function(error) {
			console.log(error.value);
		},  
	},

	onServerEvent: function(event) {
		if (event.origin != SERVER_ADDRESS) {
			console.log(event.origin);
		    return;
		}
		else if(event.data == "out-of-date") { 
			// actualize(); //TODO décommenter
			console.log(SERVER_EVENT_SOURCE_URL + " : " + event.data);
		} else if(event.data == "up-to-date") {
			console.log(SERVER_EVENT_SOURCE_URL + " : " + event.data);
		} else {
			console.log(SERVER_EVENT_SOURCE_URL + " : " + event.data);
		}
	},
    
    pre_init : function() {
        /*** Opening local HTML5 indexed database ***/
		agendapp.model.localDB.open(agendapp.model.init);
    },
    
	init: 	function() {
        // global variables
        IS_ONLINE=false;
        /*** handling Offline/online mode ***/
        function updateOnlineStatus() {
            IS_ONLINE = navigator.onLine;
            if (IS_ONLINE){
                //TODO acutalize here
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

		/*** Subscribe to server-side events ***/
		var source = new EventSource(SERVER_EVENT_SOURCE_URL);
		source.onmessage = agendapp.model.onServerEvent;
		
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
			console.log('saving to server request : '+request_data);
			$.getJSON(SERVER_INTERFACE_URL, request_data, callback);
		}
		
		/**
		 * Save the current CalendarEvent to local database.
		 */
		CalendarEvent.prototype.save_to_localdb = function(callback) {
			var db = agendapp.model.localDB.db;
			if(db) {
				var trans = db.transaction(["event"], "readwrite");
				var store = trans.objectStore("event");
				var request = store.put(this);
				request.onsuccess = function(e) {
					console.log('Event '+this.title+ 'successfully saved to local database.');
					agendapp.view.refresh(); //TODO: Use actualize()
                    callback();
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
                    callback();
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
        agendapp.model.launch_actualization();
	},

	/*** GENERALS MODEL METHODS ***/
	/**
	 * Get all events stored in server database.
     * @return an array of CalendarEvent
	 */
	get_all_events_from_server: function(callback) {
		var result = [];
		var request_data = '';
		request_data += "query=readAll";
		$.getJSON(SERVER_INTERFACE_URL, request_data, function (result) {
			if (result.error == 'KO') {
				console.log('An error occured while retrieving all events from server. Details : '.result.message);
			}
			else if(result.error == 'OK'){
				var events_obj = result.events;
				var arrayLength = events_obj.length;
                agendapp.model.events_server = [];
				for (var i = 0; i < arrayLength; i++) {
					var newevent = new agendapp.model.CalendarEvent(events_obj[i].title, events_obj[i].beginDate, events_obj[i].endDate);
					newevent.id = events_obj[i].id;
                    newevent.isDirty = false;
                    newevent.toDelete = false;
					agendapp.model.events_server.push(newevent);
				}
				console.log(arrayLength+' events got from server.');
				callback();
			}
			else{
				console.log('Unexpected error with server. '+result);
			}
		});
	},

	/**
	 * Get all events stored in local database.
     * @return an array of CalendarObject
	 */
	get_all_events_from_localdb: function(callback) {
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
				if(result == null) return;
                agendapp.model.events_local = [];
				agendapp.model.events_local.push(result.value);
                console.log(result.value.length+' events got from local database.');
				result.continue();
			};
			cursorRequest.onerror = agendapp.model.localDB.onError;
			trans.oncomplete = function(e) {
                //agendapp.model.events_local = e; // ? already done in onsuccess function
                console.log(' events_local at end of get from localdb :');
                console.log(agendapp.model.events_local);
                callback();
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
				if (result.error == 'KO') {
                    console.log('An error occured while saving event ' + this.title + ' in server. Details : '.result.message);
            		calendarevent.isDirty = true;
	    			calendarevent.save_to_localdb(function() {
                        console.log("The event " + this.title + "couldn't be saved remotely is dirty and saved locally.");
                    });
					
				}
				else if(result.error == 'OK'){
            		calendarevent.isDirty = false;
					calendarevent.id = result.id;
	    			calendarevent.save_to_localdb(function() {
                        console.log('Event ' + this.title + ' saved to server and locally with ID.');
                    });
					
				}
				else{
                    console.log('Unexpected error with server. '.result);
            		calendarevent.isDirty = true;
	    			calendarevent.save_to_localdb(function(){
                        console.log("The event " + this.title + " who couldn't be saved remotely is dirty and saved locally.");
                    });
				}
			});
        }
        else {
            calendarevent.isDirty = true;
	        // if offline, store locally with a tag saying 'not synchronized'.
	        //very important. If save_to_server() failed, it will be sent again at next refresh.
	    	calendarevent.save_to_localdb(function(){
			     console.log('Offline: saving event locally.');
            });
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
    events_local_contains: function(calendarevent){
        var result = false;
        if (typeof calendarevent.id != 'undefined'){
            var length = agendapp.model.events_local.length;
            var i = 0;
            while (!result && i<length) {
                if(typeof agendapp.model.events_local[i].id != 'undefined'){
                    result = agendapp.model.events_local[i].id === calendarevent.id;
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
        if (typeof calendarevent.id != 'undefined'){
            var length = array.length;
            var i = 0;
            while (!found && i<length) {
                if((typeof array[i].id != 'undefined') && (array[i].id === calendarevent.id)){
                    found = true;
                    result = i;
                }   
                i++;
            }
        }
        return result;
    },
    
    /**
     * Function called during actualization process when server response of get_all_events_from_server() has arrived.
     */
    callback_get_from_server_actualization: function() {
        agendapp.model.get_all_events_from_localdb(agendapp.model.callback_get_from_localdb_actualization);
    },
    
    /**
     * Function called during actualization process when server response of get_all_events_from() has arrived.
     */
    callback_get_from_localdb_actualization: function() {
        agendapp.model.merge_events();
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
	launch_actualization: function() {
		if(IS_ONLINE){
            var events_server = agendapp.model.get_all_events_from_server(agendapp.model.callback_get_from_server_actualization);
        }
    },
    
    /* merge server events -> local events */
    merge_events: function(){
        var events_server_length = agendapp.model.events_server.length;
        console.log('---Server events to merge : '+events_server_length);
        for (var i = 0; i < events_server_length; i++) {
            var serverevent = agendapp.model.events_server[i];
            // if server event is NOT in events_local : add it.
            if (!agendapp.model.events_local_contains(serverevent)) {
                console.log('Server event is not in events_local.');
                serverevent.isDirty = false;
                serverevent.toDelete = false;
                agendapp.model.events_local.push(serverevent);
                serverevent.save_to_localdb(function(){
                console.log('Added one new event from server.');
                });
            }
            // if server event is in events_local => resolving
            else{
                console.log('Server event is in events_local.');
                var localevent_position = agendapp.model.get_position_same_id_event(serverevent, agendapp.model.events_local);
                var localevent = agendapp.model.events_local[localevent_position];
                console.log('HERE IT WILL FAIL BECAUSE LOCAL_EVENT IS NOT A CALENDAREVENT.');
                console.log(localevent);
                // events are same (ID) = someone changed something => resolve
                if (!localevent.is_same(serverevent)) {
                    console.log('in if');
                    // local dirty (modified) => local event wins over server event // CHOICE TO PRIVILEGE LOCAL
                    if (localevent.isDirty && !localevent.toDelete) {
                        localevent.save_to_server(function(){
                            agendapp.model.events_local[localevent_position].isDirty = false;
                            agendapp.model.events_local[localevent_position].save_to_localdb(function(){
                                console.log('An event modified locally overwrited an event modified by someone else. Conflict solved.');
                            });
                        });
                    }
                    // local dirty to delete (modifed locally then deleted) => delete everywhere
                    else if (localevent.isDirty && localevent.toDelete) {
                        console.log('in elseif');
                        localevent.delete_of_server(function(){
                            agendapp.model.events_local.slice(localevent_position, 1);
                            agendapp.model.events_local[localevent_position].delete_of_localdb(function(){
                                console.log('A locally modified-then-deleted event was permanently deleted.');
                            });
                        });
                    }
                    // local not dirty (not modified) = server event is dirty => server event win over local event
                    else{
                        console.log('in else');
                        serverevent.isDirty = false;
                        agendapp.model.events_local.slice(localevent_position, 1);
                        agendapp.model.events_local.push(serverevent);
                        serverevent.save_to_localdb(function(){
                            console.log('An event was updated by someone else.');
                        });
                    }
                }
                // events are same = no change => do nothing
                else{
                    console.log('No events to merge.');
                }
            }
        }// events_server is now same as events_local
        // push local dirty events -> server. Then clean them (delete or undirty).
        var locallength = agendapp.model.events_local.length;
        
        console.log('---Local events to push id needed : '+locallength);
        for (var i = 0; i <locallength; i++) {
            // dirty events
            if ((agendapp.model.events_local[i].isDirty != 'undefined') && agendapp.model.events_local[i].isDirty) {
                // events to delete
                if ((agendapp.model.events_local[i].toDelete != 'undefined') && agendapp.model.events_local[i].toDelete) {
                    agendapp.model.events_local[i].delete_of_server(function(){
                        agendapp.model.events_local[i].delete_of_localdb(function(){
                            agendapp.model.events_local.slice(i, 1);
                            console.log('An event was permanently deleted.');
                        });
                    });
                }
                // events to create or update
                else{
                   agendapp.model.events_local[i].save_to_server(function(){
                       agendapp.model.events_local[i].isDirty = false;
                       agendapp.model.events_local[i].save_to_localdb(function(){
                           console.log('An created or updated event was pushed to server.');
                       });
                   });
                }
            }
        }
    }
}
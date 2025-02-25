<?php
	require_once('CalendarEvent.class.php');
	require_once('Db.class.php');

	// The JSON standard MIME header.
	header('Content-type: application/json');

	// Request from javascript client.
	if (empty($_GET)) {
		respond_with_error("Not request using GET was made.");
	}
	else{
		$request = $_GET['query'];

		// Executing request
		switch($request) {
			case "save":
				save();
				break;
			case "readAll":
				read_all();
				break;
			case "delete":
				delete();
				break;
			default:
				respond_with_error(
					"Sorry, bad request. ".$request." is not an correct arg."
					);
		}
	}

	/*************** EXECUTING CLIENT REQUEST FUNCTIONS **************************/

	/**
	 * Called when the client request is to save an event.
	 */
	function save() {
		// create object
		$event = get_event_from_http();
		// save it
		$event->save();
		// respond
		respond_success($event);
	}

	/**
	 * Called when the client request is to return all events
	 * from database.
	 */
	function read_all() {
		// retrieve events from database
		$db = Db::getConnection();
		$query = "SELECT id, title, begin_date, end_date FROM Event";
		$result= $db->query($query);
		// create objects and print
		$first_line = true;
		echo '{"error": "OK", ';
		echo '"events": [';
		while($row = $result->fetch(PDO::FETCH_ASSOC)) {
			$newevent = new CalendarEvent();
			$newevent->id = utf8_encode($row['id']);
			$newevent->title = utf8_encode($row['title']);
			$newevent->beginDate = utf8_encode($row['begin_date']);
			$newevent->endDate = utf8_encode($row['end_date']);
			// stringify
			if ($first_line) {
				$first_line=false;
			}
			else{
				echo ',';
			}
			echo json_encode($newevent);
		}
		echo ']}';
	}

	/**
	 * Called when the client request is to delete an event.
	 */
	function delete() {
		// create object
		$event = get_event_from_http();
		// save it
		$event->delete();
		// respond
		respond_success();
	}

	/*************** UTILITIES FUNCTIONS **************************/

	/**
	 * Create the object event from data in http request.
	 * The key of GET request is 'event'.
	 * @return CalendarEvent created. Id may be null.
	 */
	function get_event_from_http() {
		$event_json = json_decode($_GET['event'], true);
		if (empty($event_json)){
			respond_with_error(
				'An event must be given with correct syntax.');
		}
		else{
			// create object event from the $event_json
			$event = new CalendarEvent();
			$event->title = $event_json["title"];
			$event->beginDate = $event_json["beginDate"];
			if (isset($event_json["endDate"])) {
				$event->endDate = $event_json["endDate"];
			}
			if (isset($event_json["id"])) {
				$event->id = $event_json["id"];
			}
			return $event;
		}
	}

	/**
	 * Send back to the client an error with the message 
	 * given as arg.
	 */
	function respond_with_error($message) {
		$response = array();
		$response['error'] = "KO";
		$response['message'] = $message;
		$json = json_encode($response);
		echo $json;
	}

	/**
	 * Send back to client the success code indicating his
	 * request was well executed.
	 */
	function respond_success($event){
		$response = array();
		$response['error'] = "OK";
		$response['id'] = $event->id; //TODO: Un truc plus propre que ça :s
		$json = json_encode($response);
		file_put_contents("notify.txt", "true");
		echo $json;
	}

	/**
	 * Send back to client the success code indicating his
	 * request was well executed.
	 * A message is attached to the response.
	 */
	function respond_success_with_msg($message){
		$response = array();
		$response['error'] = "OK";
		$response['message'] = $message;
		$json = json_encode($response);
		file_put_contents("notify.txt", "true");
		echo $json;
	}
?>
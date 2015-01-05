<?php
	header('Content-Type: text/event-stream');
	header('Cache-Control: no-cache');

	if(file_get_contents("notify.txt") == "true") {
		echo "data: out-of-date\n\n";
		flush();
		file_put_contents("notify.txt", "false");
	} else {
		echo "data: up-to-date\n\n";
		flush();
	}
?>
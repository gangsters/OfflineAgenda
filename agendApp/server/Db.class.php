<?php
	class Db {
		private static $servername = "127.0.0.1";
		private static $username = "usertest";
		private static $password = "passwordtest";
		private static $dbname = "AgendApp";
		private static $connection;

		private static function connect () {
			try {
				Db::$connection = new PDO('mysql:host='.self::$servername.';port=8889;dbname='.self::$dbname, self::$username, self::$password);
				Db::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			}
			catch (PDOException $e) {
				echo 'Connection to database failed : '.$e->getMessage();
			}
		}

		public static function getConnection() {
			if (!isset(Db::$connection) || is_null(Db::$connection)) {
				Db::connect();
			}
			return Db::$connection;
		}

		public static function disconnect(){
			if (!isset(Db::$connection) || is_null(Db::$connection)) {
				echo "Couldn't disconnect. Database wasn't connected.";
			}
			else{
				Db::$connection->close();
			}
		}

	}
	
?>
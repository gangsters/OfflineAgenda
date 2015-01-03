<?php
	require_once('Db.class.php');

	class CalendarEvent {
		public $id;
		public $title;
		public $beginDate;
		public $endDate;

		/**
		 * Empty constructor. Useful when retrieving from database.
		 */
		public function __construct() {
		}

		/**
		 * Useful when creating from JSON new Event.
		 */
		public function set($title, $beginDate, $endDate){
			$this->title = $title;
			$this->beginDate = $beginDate;
			$this->endDate = $endDate;
		}

		/**
		 * Constructor with args and id. For updates.
		 */
		public function set_all($id, $title, $beginDate, $endDate){
			$this->set($title, $beginDate, $endDate);
			$this->id = $id;
		}

		/**
		 * Save the current object in database. It can be a new object or an
		 * update, it doesn't matter.
		 */
		public function save() {
			if (!isset($this->id) || empty($this->id)) {
				$this->db_create();
			}
			else{
				$this->db_update();
			}
		}

		/**
		 * Delete the current object from database.
		 */
		public function delete() {
			if (!isset($this->id) || empty($this->id)){
				throw new Exception ('ID non défini, impossible de supprimer cet Event.');
			}
			else{
				$db = Db::getConnection();
				$pre_query = "DELETE FROM Event where id=:id";
				$query = $db->prepare($pre_query);
				$query->bindParam(':id', $this->id);
				$query->execute();	
			}
		}

		public function toJson() {
			return json_encode($this);
		}
		
		/**
		 * Add in database the current object.
		 */
		private function db_create() {
			$db = Db::getConnection();
			$pre_query = "INSERT INTO Event (title, begin_date, end_date)".
				" VALUES (:title, :begin, :end)";
			$query = $db->prepare($pre_query);
			$query->bindParam(':title', $this->title);
			$query->bindParam(':begin', $this->beginDate);
			$query->bindParam(':end', $this->endDate);
			$query->execute();
		}

		/**
		 * Update the database with current object
		 */
		private function db_update() {
			$db = Db::getConnection();
			$pre_query = "UPDATE Event SET title=:title, ".
				"begin_date=:begin, end_date=:end WHERE id=:id";
			$query = $db->prepare($pre_query);
			$query->bindParam(':title', $this->title);
			$query->bindParam(':begin', $this->beginDate);
			$query->bindParam(':end', $this->endDate);
			$query->bindParam(':id', $this->id);
			$query->execute();
		}

	}
?>
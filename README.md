OfflineAgenda
=============

This project is part of a course of conception in system information architecture at INSA Rouen France. The aim is to develop in two different ways a collaborative web agenda accessible offline and with asynchronous data replication with the server.

Project 1 : "agendaJS"
---------------
It uses AngularJS and MongoDB to offer an agenda WebApp.

### Installation procedure :
* todo

Project 2 : "agendApp"
-----------------------
It uses Javascript and PHP to offer an agenda Chrome app.

### Installation procedure :
 Clone the repository.

#### Database installation for Ubuntu
 * sudo apt-get install mysql-client
 * cd path_to_repository/OfflineAgenda/agendApp/database
 * if you didn't set any password : do not write the option -p for the two following steps.
 * mysql -h localhost -u root -p < init.sql
 * mysql -h localhost -u root -p < test_data.sql

#### Server Installation
 * sudo apt-get install apache2
 * sudo ln -s path_to_repository/OfflineAgenda/agendApp/server /var/www/html/agendapp
 * You can see if it works by entering this URL in your favorite browser : http://localhost/agendapp/eventInterface.php
 
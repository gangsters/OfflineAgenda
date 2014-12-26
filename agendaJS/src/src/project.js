/**
 * Gangster Calendar
 */
angular.module('calendarDemoApp', ['ui.calendar', 'ui.bootstrap'])

.factory('calendarDB', function() {
    var db = new PouchDB('events');
    return db;
  })

.controller('CalendarCtrl',function($scope,calendarDB,$compile,uiCalendarConfig) {
    var date = new Date();
    var online = false;
    var theEvent = '';
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.newEvent=('Nouveau');
    $scope.submitEvent=('Ajouter');
    $scope.onlineBtn=('Offline');
    $scope.events = [];

    calendarDB.changes({
      live: true,
      onChange: function (change) {
        if (!change.deleted) {
          calendarDB.get(change.id, function(err, doc) {
            if (err) console.log(err);
            $scope.$apply(function() { //UPDATE
              for (var i = 0; i < $scope.events.length; i++) {
                if ($scope.events[i]._id === doc._id) {
                  $scope.events[i] = doc;
                  return;
                }
              } // CREATE / READ
              $scope.events.push(doc);
            });
          })
        } else { //DELETE
          $scope.$apply(function () {
            for (var i = 0; i<$scope.events.length; i++) {
              if ($scope.events[i]._id === change.id) {
                $scope.events.splice(i,1);
              }
            }
          })
        }
      }
    });

    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.newEvent=('Modifier '+ date.title);
        $scope.eventName= date.title;
        $scope.submitEvent= 'Modifier';
        $scope.theEvent = date.title;
    };


    $scope.addEvent = function(eventName) {
      var dateD = $('.form_datetimeD input').val();
      var dateTabD = dateD.split('/');
      var timeD = dateTabD[2].split('-')[1];
      timeD = timeD.split(':');
      var dayD = dateTabD[0];
      var monthD = dateTabD[1];
      var yearD = dateTabD[2];
      var hourD = timeD[0];
      var minD = timeD[1];

      var dateF = $('.form_datetimeF input').val();
      var dateTabF = dateF.split('/');
      var timeF = dateTabF[2].split('-')[1];
      timeF = timeF.split(':');
      var dayF = dateTabF[0];
      var monthF = dateTabF[1];
      var yearF = dateTabF[2];
      var hourF = timeF[0];
      var minF = timeF[1];
      var startT = new Date(parseInt(yearD),parseInt(monthD)-1,parseInt(dayD),parseInt(hourD),parseInt(minD),0,0);
      var endT = new Date(parseInt(yearF),parseInt(monthF)-1,parseInt(dayF),parseInt(hourF),parseInt(minF),0,0);
      if($scope.submitEvent === 'Ajouter'){
        var event = {
          _id:eventName,
          title: eventName,
          start: startT,
          end: endT
        };
        $scope.events.push(event);

          calendarDB.put(angular.copy(event), function (err, res) {});
      }else{
        angular.forEach($scope.events,function(value,index){
        if(value.title === $scope.theEvent){
          var event = {
          _id:theEvent,
          title: eventName,
          start: startT,
          end: endT
          };
          calendarDB.put(angular.copy(event), function (err, res) {});
        }
      });
      }
    };
    
    /*****TODO Reset Dates****/
    $scope.annuler = function(){
      $scope.newEvent='Nouveau';
      $scope.eventName='';
      $scope.submitEvent ='Ajouter'

    }

    /* remove event */
    $scope.remove = function(source) {
      angular.forEach($scope.events,function(value,index){
        if(value.title === source){
          $scope.events.splice(index,1);
          calendarDB.get(value._id, function (err, doc) {
            calendarDB.remove(doc, function (err, res) {});
          });
        }
      });
      $scope.annuler();
    };

    /* Change View */
    $scope.changeView = function(view,calendar) {
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };
     /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) { 
        element.attr({'tooltip': event.title,
                     'tooltip-append-to-body': true});
        $compile(element)($scope);
    };
    /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        header:{
          left: 'title',
          center: '',
          right: 'prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };

    $scope.toogleOffline = function(){
      $scope.online = !$scope.online 
      if($scope.onlineBtn=="Offline"){
        $scope.onlineBtn=('Online');
        $scope.sync = calendarDB.sync('http://127.0.0.1:5984/events', {live: true})
          .on('error', function (err) {
            console.log("Syncing stopped");
            console.log(err);
          });
      } 
      else{
                $scope.sync.cancel();
        $scope.onlineBtn=('Offline');
      }
    };

    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
});
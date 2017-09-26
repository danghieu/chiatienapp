(function() {
  'use strict';

  var app = {
    init: function() {
      app.initEventForm = document.getElementById('initEventForm');
      app.expensesWrap = document.getElementById('expensesWrap');
      app.expenseElements = document.getElementById('expenseElements');
      app.expensesNewForm = document.getElementById('expensesNewForm');
      app.resultTable = document.getElementById('resultTable');
      app.resultWrap = document.getElementById('resultWrap');
      app.tripName_title = document.getElementById('tripName_title');  
      app.eventData = {};
      app.expenseTypes = ['Food', 'Service'];
      app.getEventData();
      if (!app.eventData) {
        app.eventData = {
          tripName: null,
          people : {
            numOfPeople: 0,
            names: []
          },
          expenses: [
          ]
        };
      }
      console.log(app.eventData);
      if (!app.eventData.tripName) {
        app.showTripNameForm();
      } else if(app.eventData.people.numOfPeople < 0) {
        app.showHowManyPeopleForm();
      } else if(app.eventData.people.names.length <= 0) {
        app.showNamesForm();
      } else {
        app.updateDashboard();
      }
      if(app.eventData.tripName) {
        app.setTripNameTitle();
      }
    },
    updateDashboard: function(){
      app.showEventDataForm();
      app.expensesWrap.style.display = "block";
      app.resultWrap.style.display = "block";
      app.showExpenseElements();
      app.showAddExpenseForm();
      app.updateResultTable();
    },
    showEventDataForm: function(){
      var eventDataForm = '<button class="btn btn-primary btnEventDataExpand" type="button" data-toggle="collapse"\
          data-target="#collapseEventdata" aria-expanded="false" aria-controls="collapseEventdata">\
                          Trip Information\
                          <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>\
                        </button>\
                        <div class="collapse collapseEventdata" id="collapseEventdata">\
                          <div class="form-group">\
                            <label for="tripName">Trip Name:</label>\
                            <input type="text" value="'+app.eventData.tripName+'" class="form-control" name="tripName">\
                          </div>';
      for (var i=0; i<app.eventData.people.names.length; i++) {
        eventDataForm +=  '<div class="form-group col-md-12">\
                            <label for="person">Person #'+i+':</label>\
                            <input type="text" value="'+app.eventData.people.names[i]+'" class="form-control" name="person[]">'
        if(i==app.eventData.people.names.length-1) {
          eventDataForm += '<button class="btn btn-success btnAddMoreName" type="button" data-toggle="collapse"\
           data-target="#collapseAddMoreName" aria-expanded="false" aria-controls="collapseAddMoreName">Add Person</button>';
        }
        eventDataForm +=  '</div>';
      }
      eventDataForm += '<div class="collapse form-group col-md-12" id="collapseAddMoreName">\
            <label for="person">Person #'+i+':</label>\
              <input type="text" value="" class="form-control" name="person[]">\
            </div>';
      eventDataForm +=  '<button class="btn btn-next btn-primary" id="btnUpdateEvent">Update</button>\
                        </div>';
      app.initEventForm.innerHTML = eventDataForm;
    },
    updateResultTable: function(){
      var tbody = app.resultTable.getElementsByTagName('tbody')[0];
      var result = {
        total:0,
        eachPerson:0,
        people:[],
      };
      for(var i =0; i <app.eventData.people.numOfPeople; i++) {
        result.people[i] =0;
      }
      for(var i=0; i < app.eventData.expenses.length; i++) {
        result.total += app.eventData.expenses[i].paid;
        var whopaid = app.eventData.expenses[i].whopaid;
        result.people[whopaid] += app.eventData.expenses[i].paid;
        
      }
      result.eachPerson = Math.floor(result.total/app.eventData.people.numOfPeople);
      var cell = '<tr>\
                    <td>Total</td>\
                    <td><span>'+numberWithCommas(result.total)+'</span></td>\
                  </tr>\
                  <tr>\
                    <td>Each person</td>\
                    <td><span>'+numberWithCommas(result.eachPerson)+'</span></td>\
                  </tr>';
      for(var i=0; i < app.eventData.people.names.length; i++) {
        var paid = result.people[i] ? result.people[i] : 0;
        var rest = result.eachPerson - paid;
        cell +=   '<tr>\
                    <td>'+app.eventData.people.names[i]+'</td>\
                    <td>Paid: '+numberWithCommas(paid)+'</td>\
                    <td>Rest: '+numberWithCommas(rest)+'</td>\
                  </tr>';
      }
      tbody.innerHTML = cell;
    },
    showAddExpenseForm: function(){
      var expenseForm = '<div class="form-group form-group-expense">\
                <label for="whopaid">Who paid:</label>\
                <select name="expense[whopaid]">';
      for (var i=0; i < app.eventData.people.names.length; i ++) {
        expenseForm += '<option value="'+i+'">'+app.eventData.people.names[i]+'</option>';
      }
      expenseForm += '</select>\
              </div>\
              <div class="form-group form-group-expense">\
                <label for="type">Type:</label>\
                <select name="expense[type]">';
      for (var i=0; i < app.expenseTypes.length; i ++) {
        expenseForm += '<option value="'+i+'">'+app.expenseTypes[i]+'</option>';
      }
      expenseForm += '</select>\
              </div>\
              <div class="form-group form-group-expense">\
                <label for="type">Paid:</label>\
                <input type="number" name="expense[paid]">\
              </div>\
            <button class="btn btn-next btn-success" id="btnAddNewExpense">Add</button>';      
      app.expensesNewForm.innerHTML= expenseForm;
      app.handleBtnAddNewExpenseEvent();
    },
    showExpenseElements: function() {
      var expenseElements = '';
      for (var i=0; i < app.eventData.expenses.length; i ++) {
        expenseElements += '<div id="expense'+i+'" class="expenseElement">\
                              <div class="expense__header">\
                                <div class="expense expense__whopaid">\
                                <div class="expense__title">who paid:</div>\
                                  <div class="expense__value">'+app.eventData.people.names[app.eventData.expenses[i].whopaid]+'</div>\
                                </div>\
                                <div class="expense expense__type">\
                                  <div class="expense__title">Type:</div>\
                                  <div class="expense__value">'+app.expenseTypes[app.eventData.expenses[i].type]+'</div>\
                                </div>\
                                <div class="expense expense__paid">\
                                <div class="expense__title">Paid:</div>\
                                  <div class="expense__value">'+numberWithCommas(app.eventData.expenses[i].paid)+'</div>\
                                </div>\
                                <button class="btn btnExpenseExpand" type="button" data-toggle="collapse" data-target="#collapseExpense'+i+'" aria-expanded="false" aria-controls="collapseExpense'+i+'">\
                                  <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>\
                                </button>\
                                <button class="btn btnExpenseDelete" data-id="'+i+'" data-confirm="Are you sure to delete this item?" type="button" >\
                                  <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>\
                                </button>\
                              </div>\
                              <div class="collapse" id="collapseExpense'+i+'">\
                                <div class="card card-body">\
                                  update in future\
                                </div>\
                              </div>\
                            </div>'
      }
      app.expenseElements.innerHTML= expenseElements;
      app.handleBtnDeleteExpenseEvent();
    },
    handleBtnDeleteExpenseEvent: function() {
      var deletebtns = document.querySelectorAll('.btnExpenseDelete');
      for (var i = 0; i < deletebtns.length; i++) {
        deletebtns[i].addEventListener('click', function(e) {
          e.preventDefault();
          var choice = confirm(this.getAttribute('data-confirm'));

          if (choice) {
            var expenseId = this.getAttribute('data-id');
            delete app.eventData.expenses[expenseId];
            console.log(app.eventData.expenses);
            app.eventData.expenses = app.eventData.expenses.filter(function(){return true;});
            app.saveEventData();
            app.updateDashboard();
          }
        });
      }
    },
    handleBtnAddNewExpenseEvent: function() {
      document.getElementById('btnAddNewExpense').addEventListener('click', function(e) {
        e.preventDefault();
        var expenseWhoPaid = document.getElementsByName("expense[whopaid]")[0].value;
        var expenseType = document.getElementsByName("expense[type]")[0].value;
        var expensePaid = document.getElementsByName("expense[paid]")[0].value;
        var expense = {
          whopaid: parseInt(expenseWhoPaid),
          type: expenseType,
          paid: parseFloat(expensePaid),
        }
        app.eventData.expenses.push(expense);
        app.saveEventData();
        app.showExpenseElements();
        app.updateResultTable();
      });
    },
    saveEventData: function() {
      localStorage.eventData = JSON.stringify(app.eventData);
    },
    getEventData: function() {
      app.eventData = localStorage.eventData ? JSON.parse(localStorage.eventData) : null;
    },
    btnNamesHandleEvent: function() {
      document.getElementById('btnNames').addEventListener('click', function(e) {
        e.preventDefault();
        var inputs = document.querySelectorAll('input[name="person[]"');
        console.log(inputs);
        for(var i=0; i<inputs.length; i++) {
          var value = inputs[i].value;
          app.eventData.people.names[i] = value;
        }
        app.saveEventData();
        app.initEventForm.innerHTML = '';
        app.updateDashboard();
      });
    },
    showNamesForm: function(){
      var namesForm = '';
      for (var i=0; i < app.eventData.people.numOfPeople; i ++) {
        namesForm += '<div class="form-group">';
        namesForm +=   '<label for="person">Person #'+i+':</label>';
        namesForm +=   '<input type="text" class="form-control" name="person[]" placeholder="person name '+i+'">';
        namesForm +=  '</div>';
      }
      namesForm +=  '<button class="btn btn-next btn-primary" id="btnNames">Next</button>';
      
      app.initEventForm.innerHTML= namesForm;
      app.btnNamesHandleEvent();
    },
    showHowManyPeopleForm: function(){
      var howManyPeopleForm = '<div class="form-group">\
          <label for="howmanyPeople">How many people:</label>\
          <input type="number" pattern="\d*" class="form-control" id="howmanyPeople" placeholder="4">\
        </div>\
        <button class="btn btn-next btn-primary" id="btnHowmanyPeople">Next</button>';
      app.initEventForm.innerHTML= howManyPeopleForm;
      app.handleNtnHowmanyPeopleEvent();
    },
    handleNtnHowmanyPeopleEvent: function(){
      document.getElementById('btnHowmanyPeople').addEventListener('click', function(e) {
        e.preventDefault();
        var numOfPeople = document.getElementById('howmanyPeople');
        app.eventData.people.numOfPeople = parseInt(numOfPeople.value);
        app.saveEventData();
        app.showNamesForm();
      });
    },
    showTripNameForm: function(){
      var tripNameForm = '<div class="form-group">\
          <label for="tripName">Trip Name:</label>\
          <input type="text" class="form-control" id="tripName" placeholder="">\
        </div>\
        <button class="btn btn-next btn-primary" id="btnTripName">Next</button>';
      app.initEventForm.innerHTML= tripNameForm;
      app.handlebtnTripNameEvent();
    },
    handlebtnTripNameEvent: function(){
      document.getElementById('btnTripName').addEventListener('click', function(e) {
        e.preventDefault();
        var tripName = document.getElementById('tripName');
        app.eventData.tripName = tripName.value;
        app.setTripNameTitle();
        app.saveEventData();
        app.showHowManyPeopleForm();
      });
    },
    setTripNameTitle: function() {
      app.tripName_title.innerHTML = app.eventData.tripName;
    }
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  app.init();

  // TODO add service worker code here
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }
})();

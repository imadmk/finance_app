// ANGULAR
var expenseMonitor = angular.module('expenseMonitor', ['nvd3ChartDirectives', 'btford.socket-io']);

var expenseData = [];

// Service to interact with the socket library
expenseMonitor.factory('socket', function(socketFactory) {
    var theIoSocket = io.connect();

    var socket = socketFactory({
        ioSocket: theIoSocket
    });
    return socket;
});

// The Angular Controller
expenseMonitor.controller('expenseController', function($scope, socket, $http) {

    // Variable to store all expense list data from database
    $scope.expenseList = {};

    // Get list of expense
    var getAll = function () {
        $http.get('/api/expense')
            .success(function(data) {
                $scope.expenseList = data;
                updateExpenseData(data);
                updateChart();
            })
            .error(function(err) {
                console.log('Error: ' + err);
            });
    };
    // get data for the first time
    getAll();

    // Get one data of expense, will be used to edit data or later
    //      to show one expense page
    $scope.getOne = function(expenseId) {
        $scope.editFormData = {};
        $http.get('/api/expense/' + expenseId)
            .success(function(data) {
                $scope.editFormData = data;
                // Remember that date format from PostgreSQL can not be directly
                //  converted to Angular date form, if you one to show it in a textbox
                //  like editing form instance it first
                $scope.editFormData.date = new Date(data.date);
            })
            .error(function(err) {
                console.log('Error: ' + err);
            });
    };

    // Create new data of expense
    $scope.newExpense = function() {
        $http.post('/api/expense', $scope.formData)
            .success(function(data) {
                $scope.expenseList = data;
                socket.emit('data changed');
                updateExpenseData(data);
                updateChart();
            })
            .error(function(err) {
                console.log('Error: ' + err);
            });
    };

    // Delete an expense data
    $scope.deleteExpense = function(expenseId) {
        // Using alert to get confirmation
        var deleteConfirm = confirm('Are you sure?');
        if (deleteConfirm == true) {
            $http.delete('/api/expense/' + expenseId)
                .success(function(data) {
                    $scope.expenseList = data;
                    socket.emit('data changed');
                    updateExpenseData(data);
                    updateChart();
                })
                .error(function(err) {
                    console.log('Error: ' + err);
                });
        }
    };

    // Update an expense data
    $scope.updateExpense = function(expenseId) {
        $http.put('/api/expense/' + expenseId, $scope.editFormData)
            .success(function(data) {
                $scope.expenseList = data;
                socket.emit('data changed');
                updateExpenseData(data);
                updateChart();
            })
            .error(function(err) {
                console.log('Error: ' + err);
            });
    };
    
    // socket.io
    // if data changed, reload data from the server
    socket.on('change data', function () {
        console.log('change data');
       getAll();
    });

    // default input form values
    $scope.dateNow = new Date(Date.now());
    $scope.defaultTitle = monthNames[$scope.dateNow.getMonth()] + ' Expense';
    $scope.formData = {
        name: $scope.defaultTitle,
        date: $scope.dateNow
    };

    // Everytime data updated, we update all chart variables 
    var updateChart = function() {
        // variable for store chart data
        $scope.expenseHistoricalData = [{
            'key': 'Expense History',
            'values': expenseData
        }];
        // these two function are formatting the look of the chart info
        $scope.xAxisTickFormatFunction = function() {
            return function(d) {
                return d3.time.format('%b')(new Date(d));
            };
        };
        $scope.valueFormatFunction = function() {
            return function(d) {
                return d3.format(",.2f")(d);
            };
        };
    };
});

var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Used for updating data one by one for Chart

var updateExpenseData = function(expenses, cb) {
    expenseData = [];
    expenses.forEach(function(expense) {
        var data = [];

        var date = new Date(expense.date);
        data.push(date.getTime());
        data.push(expense.amount);

        expenseData.push(data);
    });
    expenseData.reverse();
};
var expenseMonitor = angular.module('expenseMonitor', []);
expenseMonitor.controller('expenseController', function($scope, $http) {
    
    $scope.expenseList = {};
    
    // Get list of expense
    $http.get('/api/expense')
        .success(function (data) {
            $scope.expenseList = data;
        })
        .error(function (err) {
            console.log('Error: ' + err);
        });
        
    $scope.newExpense = function () {
        $http.post('/api/expense', $scope.formData)
            .success(function (data) {
                $scope.expenseList = data;
            })
            .error(function (err) {
                console.log('Error: ' + err);
            });
    };
    
    $scope.deleteExpense = function (expenseId) {
        var deleteConfirm = confirm('Are you sure?');
        if (deleteConfirm == true) {
            $http.delete('/api/expense/' + expenseId)
            .success(function (data) {
                $scope.expenseList = data;
            })
            .error(function (err) {
                console.log('Error: ' + err);
            });
        }
    };
    
    $scope.updateExpense = function (expenseId) {
        $http.put('/api/expense/' + expenseId, $scope.editFormData)
            .success(function (data) {
                $scope.expenseList = data;
            })
            .error(function (err) {
                console.log('Error: ' + err);
            });
    };
    
    // default input form values
    $scope.dateNow = new Date(Date.now());
    $scope.defaultTitle = monthNames[$scope.dateNow.getMonth()] + ' Expense';
    $scope.formData = {
        name: $scope.defaultTitle,
        date: $scope.dateNow
    };
    
});

var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
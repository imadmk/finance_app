var db = require('../models/index');

// Create new data of expense
exports.create = function (req, res) {
    // save and return and the new database of expense to the res object
    db.Expense.create({
        name: req.body.name,
        amount: req.body.amount,
        date: req.body.date
    })
    .then(function (newExpense) {
        // Send all updated database when done
        exports.list(req, res);
    })
    .catch(function (err) {
        return res.status(500).send('error', {error: err});
    });
};

// Get all data of expenses
exports.list = function (req, res) {
    db.Expense
        .findAll({order: '"date" DESC'})
        .then(function (expenses) {
            res.json(expenses);
        })
        .catch(function (err) {
           return res.status(500).send('error', {error: err});
        });
};

// Get one expense
exports.read = function (req, res) {
    
    var id = req.params.expenseId;
    db.Expense
        .findOne({
            where: { id: id }
        })
        .then(function (expense) {
            res.json(expense);
        })
        .catch(function (err) {
           return res.status(500).send('error', {error: err});
        });
};

// Update a data of expense
exports.update = function (req, res) {
    
    var id = req.params.expenseId;
    db.Expense.findOne({
        where: { id: id }
    })
    .then(function (expense) {
       expense.updateAttributes({
           name: req.body.name,
           amount: req.body.amount,
           date: new Date(req.body.date)
       })
        .then(function () {
            // Send all updated database when done
            exports.list(req, res);
        })
        .catch(function(err) {
            return res.status(500).send('error', {error: err});
        });
    })
    .catch(function(err) {
        return res.status(500).send('error', {error: err});
    });
};

// Delete an expense
exports.delete = function (req, res) {
    
    var id = req.params.expenseId;
    db.Expense.findOne({
        where: {id: id}
    })
    .then(function (expense) {
       expense.destroy()
        .then(function () {
            // Send all updated database when done
            exports.list(req, res);
        })
        .catch(function(err) {
            return res.status(500).send('error', {error: err});
        });
    })
    .catch(function(err) {
        return res.status(500).send('error', {error: err});
    });
};
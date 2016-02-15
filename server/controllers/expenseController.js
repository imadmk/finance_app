var db = require('../models/index');

exports.create = function (req, res) {
    
    // save and return and the new database of expense to the res object
    db.Expense.create({
        name: req.body.name,
        amount: req.body.amount,
        date: req.body.date
    })
    .then(function (newExpense) {
        exports.list(req, res);
    })
    .catch(function (err) {
        return res.status(500).send('error', {error: err});
    });
};

exports.list = function (req, res) {
    db.Expense
        .findAll()
        .then(function (expenses) {
            res.json(expenses);
        })
        .catch(function (err) {
           return res.status(500).send('error', {error: err});
        });
};

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

exports.delete = function (req, res) {
    
    var id = req.params.expenseId;
    
    db.Expense.findOne({
        where: {id: id}
    })
    .then(function (expense) {
       expense.destroy()
        .then(function () {
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
var express = require('express');
var router = express.Router();
var expense = require('../controllers/expenseController');

// website.com/expense
// Get expense data
router.get('/', expense.list);
// Create expense data
router.post('/', expense.create);
// Update expense data
router.put('/:expenseId', expense.update);
// Delete expense data
router.delete('/:expenseId', expense.delete);

module.exports = router;
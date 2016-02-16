'use strict';
var express = require('express');
var router = express.Router();
var path = require('path');
var report = require('../controllers/reportController');

router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../', '../', 'client/views/index.html'));
});

// routes for pdf reporting
// report.render used for rendering the html
router.get('/render', report.render);
// report.send will capture result from /render and do pdf rendering and send to client
router.get('/report', report.send);

module.exports = router;

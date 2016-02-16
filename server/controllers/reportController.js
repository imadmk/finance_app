'use strict';
var phantom = require('phantom'); // the module for pdf rendering
var path = require('path');
var hbs = require('hbs'); // web page rendering
var handlebarsIntl = require('handlebars-intl'); // additional formating tools for handlebars
var db = require('../models/index');

// Before render pdf, phantom will access this route / function to get the compiled html
exports.render = function (req, res) {
    // add additional formating to handlebars
    handlebarsIntl.registerWith(hbs);
    // get all expense data
    db.Expense
        .findAll({order: '"date" DESC'})
        .then(function (expenses) {
            // render the report view with all expense data
            res.render('report', {"expenses": expenses});
        })
        .catch(function (err) {
           return res.status(500).send('error', {error: err});
        });   
};

// Send the pdf to client, will be available on /render
exports.send = function (req, res) {
    // create the phantom service
    phantom.create().then(function (ph) {
        // create page
        ph.createPage().then(function (page) {
            // scrap the /render page
            page.open('http://localhost:3000/render').then(function(status) {
                // setting the viewport
                page.property('viewportSize', { width: 800, height: 1200 });
                // setting the paper options
                page.property('paperSize', { format: 'A4', orientation: 'portrait', border: '1cm' });
                // render the pdf and send it to the client
                page.renderBase64('/client/file/report.pdf').then(function (err) {
                   res.sendFile('/client/file/report.pdf');
                   page.close();
                   ph.exit(); 
                });
            });
        });
    });
};


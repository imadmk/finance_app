'use strict';

module.exports = function (io) {

    io.on('connection', function (socket) {
        console.log('new connection');
        socket.on('new client', function () {
            socket.emit('welcome', {msg: 'welcome'});
        });
        socket.on('data changed', function () {
            io.emit('change data');
        });
    });
};
var cors = require('cors');
var app = require('express')();
app.use(cors());

//================================
var http = require('http');
var https = require('https')
var path = require("path");
var os = require('os');
var fs = require('fs');
var ifaces = os.networkInterfaces();

var privateKey = '';
var certificate = '';
var credentials = { key: privateKey, cert: certificate };
//var httpsServer=https.createServer(credentials,app);

Object.keys(ifaces).forEach(function(ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function(iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }

        console.log("");
        console.log("Iniciando Servicios");
        console.log("");
        console.log("Test de puertos configurdos : ", "https://localhost:8443");
        console.log("");
        console.log("");

        if (alias >= 1) {
            console.log("Multiple ipv4 addreses were found ... ");
            // this single interface has multiple ipv4 addresses
            console.log(ifname + ':' + alias, "https://" + iface.address + ":8443");
        } else {
            // this interface has only one ipv4 adress
            console.log(ifname, "https://" + iface.address + ":8443");
            console.log(ifname, "http://" + iface.address + ":8080");
        }

        ++alias;
    });
});


var LANAccess = "0.0.0.0";

//===================================

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080, function() {
    console.log('servidor corriendo...')
});



app.get('/', function(req, res) {
    console.log('---------- lanzando sites ------')
    res.sendfile(__dirname + '/page/index.html')
});

io.on('connection', function(socket) {

});
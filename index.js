var app = require('express')();
app.use(cors());
var server = require('http').Server(app);
var io = require('socket.io')(server)
server.listen(8080, function() {
    console.log('servidor corriendo...')
});


io.on('connection', function(socket) {
    console.log('clientes conectados: ' + io.engine.clientsCount + ' client');

    function log() {
        var array = ['Messaje del server:'];
        array.push.apply(array, arguments);
        socket.emit('log', array);
    }
    socket.on('message', function(message) {
        console.log('Cliente dice: ', message)
            //log('Cliente dice: ',message);
            //retransmitimos el mensaje a todos lo clientes
        socket.broadcast.emit('message', message);
    });
    socket.on('create or join', function(room) {
        console.log('Recibimos la respuesta de crear o unirse a la sala : ' + room)
            //log('Recibimos la respuesta de crear o unirse a la sala : ',room);
        var numClients = io.engine.clientsCount;
        console.log('la sala ' + room + ' tiene ' + numClients + ' de clientes')
            //log('la sala '+ room+ ' tiene '+ numClients + ' de clientes');

        if (numClients === 1) {
            socket.join(room);
            //log('el cliente '+ socket.id + ' a creado la sala '+ room );
            console.log('el cliente ' + socket.id + ' a creado la sala ' + room);
            socket.emit('created', room, socket.id); // se trasnmite que el socket esta creado
        }
        if (numClients === 2) {
            //log('el cliente '+ socket.id + ' se ha unido a las sala '+ room );
            console.log('el cliente ' + socket.id + ' se ha unido a las sala ' + room)
            io.in(room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room, socket.id);
            io.in(room).emit('ready');
        }
        if (numClients > 2) {
            console.log('la sala esta llena')
            socket.emit('full', room); //se transmite que la sala esta llena
        }


    });
    socket.on('ipaddr', function() {
        var iface = os.networkInterfaces();
        for (var dev in iface) {
            iface[dev].forEach(function(details) {
                if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
                    socket.emit('ipaddr', details.address);
                }
            });
        }
    });

    socket.on('bye', function() {
        console.log('received bye');
    });
});
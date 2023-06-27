// Port for the Express web server
var PORT = 3000;



// Import Express and initialise the web server
var express = require('express');
var app = express();
var server = app.listen(PORT);
app.use(express.static('public'));
console.log('Node.js Express server running on port ' + PORT);

// Import and configure body-parser for Express
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



// Create an osc.js UDP Port listening on port 57121.
// Credit: https://www.npmjs.com/package/osc
var osc = require("osc");
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57121,
    metadata: true
});

// Open the socket.
udpPort.open();

// Handle POST requests
app.post('/sendMessage', function(request, response) {
	var address = request.body.address;
	var value = request.body.value;
    var type = request.body.type;

	sendOSC(address, value, type);
    response.end("");
});


// Send OSC messages
function sendOSC(address, value, type) {
    // console.log('OSC message sent: address: ' + address + ', value: ' + value);
    udpPort.send({
        address: address,
        args: [
            {
//                type: "f",
                type: type,
                value: value
            }
        ]
    }, "127.0.0.1", 7000);
}


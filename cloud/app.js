var express = require('express');
var app = express();

// basic auth not enabled for this route

// basic auth is enabled for this route
app.get('/test',
        express.basicAuth('YOUR_USERNAME', 'YOUR_PASSWORD'),
        function(req, res) {});

app.listen();
const express = require('express');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/mycfmportal.html'));
})


const server = https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
}, app);

server.listen(8080, () => {
  console.log('server listenting on 8080');
});


// @ts-check
// Required imports
const { ApiPromise, WsProvider } = require('@polkadot/api');

const https = require('https');
const fs = require('fs');

var express = require('express');
var app = express();

var mysql = require('mysql');

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


app.get('/validators', async function (req, res) {
  
  //
  // Initialise the provider to connect to the local polkadot node
  //
  const provider = new WsProvider('ws://127.0.0.1:9944');

  //
  // Create the API and wait until ready
  //
  const api = await ApiPromise.create(provider);

  //
  // Retrieve active validators
  //
  const [validators] = await Promise.all([
    api.query.session.validators()
  ]);

  //
  // Map validator authorityId to staking info object
  //
  const validatorStaking = await Promise.all(
    validators.map(authorityId => api.derive.staking.info(authorityId))
  );

  //
  // Disconnect. TODO: Reuse websocket connection
  //
  provider.disconnect();

  //
  // Outputs JSON
  //
  res.json(validatorStaking);

});


app.get('/validator/:accountId', function (req, res, next) {

  // Connect to MySQL
  var con = mysql.createConnection({
    host: "localhost",
    user: "stats",
    password: "stats",
    database: 'validators'
  });
  // Last 24 hours
  con.query('SELECT * FROM bonded WHERE accountId = \'' + req.params.accountId + '\' ORDER BY id DESC LIMIT 288;', function(err, rows, fields) {
    if (err) throw err;
    
    res.json(rows);

  });

});



app.get('/offline', async function (req, res) {
  
  //
  // Initialise the provider to connect to the local polkadot node
  //
  const provider = new WsProvider('ws://127.0.0.1:9944');

  //
  // Create the API and wait until ready
  //
  const api = await ApiPromise.create(provider);

  //
  // Get validator outages
  //
  const offlineEvents = await api.query.staking.recentlyOffline();

  //
  // Disconnect. TODO: Reuse websocket connection
  //
  provider.disconnect();

  //
  // Outputs JSON
  //
  res.json(offlineEvents);

});

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/polkadot-node.mariopino.es/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/polkadot-node.mariopino.es/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/polkadot-node.mariopino.es/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

// Starting https server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});

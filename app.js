/**
 * Module dependencies.
 */
var render = require('./lib/render');
var logger = require('koa-logger');
var route = require('koa-route');
var parse = require('co-body');
var request = require('request');
var koa = require('koa');
var bitcoin = require('bitcoinjs-lib');
var view = require('co-views');
var Keen = require('keen.io');
var co = require('co')

var app = koa();



// "database"
var wallets = [];

// "middleware"
app.use(logger());

// "route middleware" - routes
app.use(route.get('/', beta));
app.use(route.get('/wallets/new', add));
app.use(route.get('/wallets/:id', show));
app.use(route.get('/wallets', list));
app.use(route.post('/wallets', create));
app.use(route.get('/signup', beta));
app.use(route.get('/admin', admin));

function *readWallets() {
	var count = new Keen.Query("count", {
	  event_collection: "wallets",
  	timeframe: "this_7_days"
	});
	client.run(count, function(err, response){
  	if (err) return console.log(err);
  	result = response.result
  	console.log(result)
	});
}

function *admin() {
	this.body = yield render('admin');
}


// co(function *(){
// 	var a = yield keenQuery
// 	var res = yield a
// 	console.log(res)
// })



function keenQuery(){
	return request(keenRoute, function(error, res, body) {
			if(!error && res.statusCode == 200){
				 var body = JSON.parse(body)
				 var results = body["result"]
				 for(var i=0; i < results.length; i++){
				 	 var result = results[i]
				 	 if(parseInt(result["id"]) == wallets.length){
				 	 		wallets.push(result)
				 	 		console.log(wallets.length)
				 	 } else {
				 	 		console.log('wallet already in db')
				 	 }
				 }
			}
	})
}
function *list() {
		keenQuery()
  	this.body = yield render('list', { wallets: wallets});
}

function	*add() {
	this.body = yield render('new');
};

function	*show(id) {
	var wallet = wallets[id];
	if(!wallet) this.throw(404, 'invalid wallet id');
	this.body = yield render('show', {wallet : wallet});
}

function	*create(){
	var wallet = yield parse(this);
	var id = wallets.push(wallet) - 1;
  key = bitcoin.ECKey.makeRandom()
	wallet.created_at = new Date;
	wallet.id = id;
	wallet.key = key
	wallet.publickey = key.pub.getAddress().toString()
	wallet.privatekey = key.toWIF()
	var object = {}
	object.name = wallet.name.toString(),
	object.email = wallet.email.toString(),
	object.id = wallet.id.toString(),
	object.created_at = wallet.created_at.toString()
	object.key = wallet.key.toString()
	object.publickey = wallet.publickey.toString()
	object.privatekey = wallet.privatekey.toString()
	client.addEvent('wallets', JSON.stringify(object, null, 4), function(err, res) {
		if(err) {
			console.log('An error!', err);
		} else {
			console.log("Keen Collection worked!")
		}
	})
  this.redirect("/wallets");
}


function *beta() {
	this.body = yield render('beta');
}

// app.use(function *(){
//   this.body = 'Amen World';
//   key = bitcoin.ECKey.makeRandom()
//   console.log(key.toWIF()) // private key
//   console.log(key.pub.getAddress().toString()) //public key
// });

app.listen(3000);
console.log("goto localhost:3000 and Hit it with /bitwall/create || /bitwall/new");
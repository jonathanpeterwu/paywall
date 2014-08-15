/**
 * Module dependencies.
 */
var render = require('./lib/render');
var logger = require('koa-logger');
var route = require('koa-route');
var parse = require('co-body');
var koa = require('koa');
var bitcoin = require('bitcoinjs-lib');
var view = require('co-views');

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


function *admin() {
	this.body = yield render('admin');
}

function *list() {
  this.body = yield render('list', { wallets: wallets });
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
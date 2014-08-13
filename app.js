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

// "route middleware"

app.use(route.get('/', beta));
app.use(route.get('/wallet/new', add));
app.use(route.get('/wallet/:id', show));
app.use(route.post('/post', create));

// "route for beta signup"
app.use(route.get('/signup', beta));


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
	var id = posts.push(post) - 1;
  key = bitcoin.ECKey.makeRandom()
	post.created_at = new Date;
	post.id = id;
	post.key = key
  this.redirect('/');
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
console.log("This Koa site is now running at http://localhost:3000");
console.log("Hit it with /bitwall/create || /bitwall/new");
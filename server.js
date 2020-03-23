const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const PORT = process.env.PORT || 5000;

const loginConfirm = require('./controllers/login-confirm');

let app = express();

// Set up server
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({ secret: 'com.heroku.matthew-node-personal', cookie: { maxAge: 60000 }}));
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
// set default route and content
// .get('/', function(req, res) {
//   res.sendFile('form.html', {root: __dirname + "/public"});
// })
// run localhost
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up pages
app.get('/', (req, res) => res.render('pages/index', loginConfirm.testSession(req)));
app.get('/login', (req, res) => res.render('pages/login', loginConfirm.testSession(req)));
app.post('/login-confirm', loginConfirm.run);
app.get('/logout', require('./controllers/logout').run);
app.get('/shop', require('./controllers/shop').run);
app.get('/addCartItem', require('./controllers/add-cart-item').run);
app.get('/removeCartItem', require('./controllers/remove-cart-item').run);
app.get('/cart', require('./controllers/cart').run);
app.get('/confirm', require('./controllers/confirm').run);

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('pages/errors/404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

app.listen(PORT, function() {
  console.log('Listening on port: ' + PORT);
});
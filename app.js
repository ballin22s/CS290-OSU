// install middleware
var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

// post 
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// view engine setup
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

// get request
app.get('/', function(req, res){
  	var getParameters = [];

	for (var i in req.query){
	  getParameters.push({'key':i, 'value':req.query[i]});
	}
	
	var context = {};
	context.getData = getParameters;
	
	context.get = true;
	context.post = false;
	
	res.render('home.handlebars', context);
});

// post request
app.post('/', function(req, res){
	var getParameters = [];
	var context = {};
	
	for (var i in req.query) {
		getParameters.push({'key':i, 'value':req.query[i]});
	}
	
	context.getData = getParameters;
	
	var postParameters = [];
	
	for(var i in req.body){
		postParameters.push({'key':i, 'value':req.body[i]});
	}
	
	context.postData = postParameters;
	
	context.post = true;
	
	res.render('home.handlebars', context);
});

// catch 404
app.use('/', function(req,res){
  res.status(404);
  res.render('404');
});

// catch 500
app.use('/', function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

//module.exports = app;
app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:3000; press Ctrl-C to terminate.');
})
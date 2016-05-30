//website link: http://52.35.224.108:3000
// install middleware
var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var validator = require('express-validator');

// post middleware
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(validator());

//stylesheets
app.use(express.static(__dirname + '/public'));

// view engine setup
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

//db connection
var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'root',
  password: 'gaga09',
  database: 'workouts_db',
});

// week6_how_to_calls
app.get('/how-to', function(req, res){
	res.render('how-to.handlebars');
});

app.get('/common-issues', function(req, res){
	res.render('issues.handlebars')
});

app.get('/embed-player', function(req, res){
	res.render('embed-player.handlebars')
});

app.get('/playback', function(req, res){
	res.render('playback.handlebars')
});

app.get('/queuing', function(req, res){
	res.render('queuing.handlebars')
});

//week 9 DB-Assignment

//Index Page
app.get('/workouts', function(req, res, next){
	var context = {};
	pool.query('SELECT * FROM workouts', function(err, rows, fields){
		if(err){
	      console.log(err);
	      return;
	    }
		
		context.mytable = rows;
		context.results = JSON.stringify(rows);
		res.render('workouts', context);
	});
});

//Create Call
app.post('/workouts/create', function(req, res){
	var context = {};
	
	req.checkBody("name", "Please enter a name.").notEmpty();
	req.checkBody("reps", "Please enter a rep value. (ex: 10)").isInt();
	req.checkBody("weight", "Please enter a weight value. (ex: 25)").isInt();
	req.checkBody('date', 'Date needs to be a valid date (ex: YYYY-MM-DD)').isDate({format: 'YYYY-MM-DD'});
	
	var errors = req.validationErrors();
	if(errors){
		res.render('workouts', {errors: errors});
		return;
	} else {
		pool.query("INSERT INTO workouts (name, reps, weight, lbs, date) VALUES (?, ?, ?, ?, ?)", [req.body.name, req.body.reps, req.body.weight, req.body.lbs, req.body.date], function(err, result){
		  if(err){
	        console.log(err);
		    return;
		  }
	      	context.results = "Workout Created";
			res.status(200).send('<html><body></body><script type="text/javascript">window.location.href="/workouts";</script></html>');
		});
	}
});

//Delete Call
app.post('/workouts/:id', function(req, res){
	var context = {};
	
	pool.query("DELETE FROM workouts WHERE id = (?)", [req.params.id], function() {
	  pool.query("SELECT * FROM workouts;", function(err, rows, fields) {
	    if(err){
	      console.log(err);
	      return;
	    }
	    res.status(200).send('<html><body></body><script type="text/javascript">window.location.href="/workouts";</script></html>');
	  });
	});
});

//Edit Page
app.get('/workouts/:id', function(req, res){
	var context = {};
	
	pool.query("SELECT * FROM workouts WHERE id = (?)", [req.params.id], function(err, rows, fields){
	  if(err){
	    console.log(err);
	    return;
	  }
	
	  var string = JSON.stringify(rows);
	  var json =  JSON.parse(string);

	  context.id = json[0].id;
	  context.name = json[0].name;
	  context.reps = json[0].reps;
	  context.weight = json[0].weight;
	
	  if(json[0].lbs == 1) {
	      context.lbs = true;
	      context.kg = null;
	  } else if(json[0].lbs == 0) {
		  context.lbs = null;
	      context.kg = true;
	  }
	
	  context.date = json[0].date.slice(0, 10);
	
	  res.render('edit_workouts', context);
	});
});

//Update Call
app.get('/workouts/:id/update',function(req,res,next){
	var context = {};
	
	pool.query("SELECT * FROM workouts WHERE id=?", [req.params.id], function(err, result){
	  if(err){
	    console.log(err);
	    return;
	  }
	
	  if(result.length == 1){
	    var curVals = result[0];
	   
	    pool.query("UPDATE workouts SET name=(?), reps=(?), weight=(?), lbs=(?), date=(?) WHERE id=(?)", [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.lbs || curVals.lbs, req.query.date || curVals.date, req.params.id], function(err, result){
		  	if(err){
	          console.log("PUT ERROR: ", err);
	          return;
	      	}
	
	    	res.status(200).send('<html><body></body><script type="text/javascript">window.location.href="/workouts";</script></html>');
	    });
	  }
	
	});
});

//Reset Table
app.post('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
      context.results = "Table reset";
	  res.status(200).send('<html><body></body><script type="text/javascript">window.location.href="/workouts";</script></html>');
    })
  });
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
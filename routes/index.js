var express = require('express');
var router = express.Router();
var mysql = require('mysql');

//Database connection
var connection = mysql.createConnection({
  host     : 'lab-6-db.cxstuztjidhn.us-east-1.rds.amazonaws.com',
  user     : 'admin',
  password : 'UYgEMz8pehwOJmFVDBGg',
  database : 'Covid19'
});

connection.connect(function(err){
  if(!err){
    console.log("Database is connected");
  }
  else{
    console.log("Error in connecting database");
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {

  connection.query("CREATE TABLE IF NOT EXISTS Covid_details (R_ID INT NOT NULL AUTO_INCREMENT, State_Name VARCHAR(255) NOT NULL, Date_of_Record DATE NOT NULL, No_of_Samples INT UNSIGNED NOT NULL, No_of_Deaths INT UNSIGNED NOT NULL, No_of_Positive INT UNSIGNED NOT NULL, No_of_Negative INT UNSIGNED NOT NULL, No_of_Discharge INT UNSIGNED NOT NULL, PRIMARY KEY (R_ID))",function(err,result){
    if(err) throw err;
    console.log("Table Created");
    res.render('index');
  });
});

//Get Add
router.get('/add', function(req, res, next) {
  res.render('addRecord');
});

//Post Add
router.post('/add', function(req, res, next) {
  var state = req.body.state;
  var date = req.body.date;
  var samples = req.body.samples;
  var deaths = req.body.deaths;
  var positive = req.body.positiveCases;
  var negative = req.body.negativeCases;
  var discharge = req.body.discharges;

  connection.query("INSERT INTO Covid_details (State_Name, Date_of_Record, No_of_Samples, No_of_Deaths, No_of_Positive, No_of_Negative, No_of_Discharge) VALUES (?,?,?,?,?,?,?)",[state,date,samples,deaths,positive,negative,discharge],function(err,result){
    if(err) throw err;
    console.log("Record Added");
    res.render('addRecord');
  });
});

//Get State Dashboard
router.get('/viewstate', function(req, res, next) {
  connection.query("SELECT * FROM Covid_details",function(err,result){
    if(err) throw err;
    console.log("Records Found");
    res.render('viewStateRecord',{stateDetails:result});
  });
});

//Post State Dashboard
router.post('/viewstate', function(req, res, next) {
  var state = req.body.stateFilter;
  //console.log(state);
  connection.query("SELECT * FROM Covid_details WHERE State_Name = ? order by No_of_Positive asc",[state],function(err,result){
    if(err) throw err;
    console.log("Record Found");
    //console.log(result);
    res.render('viewStateRecord',{stateDetails:result});
  });
});

//Get Date Dashboard
router.get('/viewdate', function(req, res, next) {
  connection.query("SELECT * FROM Covid_details where Date(Date_of_Record)=CURDATE()",function(err,result){
    if(err) throw err;
    console.log("Records Found");
    res.render('viewDateRecord',{Details:result});
  });
});

//Get Post Dashboard
router.post('/viewdate', function(req, res, next) {
  var date = req.body.dateFilter;
  connection.query("SELECT * FROM Covid_details where Date(Date_of_Record)=Date(?)",[date],function(err,result){
    if(err) throw err;
    console.log("Records Found");
    res.render('viewDateRecord',{Details:result});
  });
});

module.exports = router;

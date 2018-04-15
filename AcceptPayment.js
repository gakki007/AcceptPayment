var config = require('./models/settings.js').Config()
var CryptoJS = require("crypto-js");
var http = require('http')
var url = require('url');
const pg = require('pg');

var encryption_key = config.encryption_key
var listening_port = config.listening_port

function single_digit(number){
   if (number>9)
	  return number-9;
   else
	  return number;
}


function luhn_valid(cardnumber){
   if (cardnumber.length!=16)
	  return false;
   var total = 0;
   for (var i =15; i >= 0; i--) {
	  var sngl = single_digit (cardnumber[i--]);
	  var dbl = single_digit (2*cardnumber[i]);
	  total +=  parseInt(sngl) +  parseInt(dbl);
   }
   return (total % 10)==0
}


function validate_form(cardnumber, cvv, name_on_card, expiry_month, expiry_year){
	var result = "";
	if (cardnumber.length!=16 || cardnumber.replace(/[^\d]+/g,'')!=cardnumber)//length 16 and should be composed of just numbers
		result += "<bullet> Card number should be composed of 16 numbers"
	else if (!luhn_valid(cardnumber))
		result += "<bullet> Invalid cardnumber checkdigit (Luhn algo)"
	if (cvv.replace(/[^\d]+/g,'')!=cvv) //should be composed of just numbers
		result+="<bullet> CVV should contain only numbers"
	if (cvv.length!=3)
		result += "<bullet> CVV should have 3 digits"
	if (name_on_card.replace(/\s/g, '').length==0)//first remove spaces, then check for length 0
		result += "<bullet> Name cannot be empty"
	var today = new Date();
    var first_day_of_this_month = new Date(today.getFullYear(), today.getMonth(), 1);
	var expiry_day = new Date(expiry_year, expiry_month-1, 1);
	if (expiry_day<first_day_of_this_month)// this compares expiry date supplied against the first of this month
		result += "<bullet> Card expired"
	return result;
}

http.createServer(function (req, res) {
	try{	
		var data = url.parse(req.url, true).query;
		var callback = data.callback ;
		var cardnumber = data.number ;
		var cvv = data.cvv ;
		var name_on_card = data.name_on_card;
		var card_encrypted = CryptoJS.AES.encrypt(cardnumber, encryption_key);
		var cvv_encrypted = CryptoJS.AES.encrypt(cvv, encryption_key);
		// Decrypt 
		// var bytes  = CryptoJS.AES.decrypt(card_encrypted, encryption_key);
		// var decrypted_card = bytes.toString(CryptoJS.enc.Utf8);
		var expiry_month = data.expiry_month;
		var expiry_year = data.expiry_year;

		var con_payments = new pg.Client({
		  host: config.dbase_host,
		  port: config.dbase_port,
		  user: config.dbase_user,
		  password: config.dbase_password,
		  database: 'payments'
		})	

		con_payments.connect()
		var sql = "insert into payment_attempts (cardholder, cardnumber, cvv, expiry_month, expiry_year) values ('" + name_on_card.replace(/'/g, "''") + "','" + card_encrypted + "','" + cvv_encrypted + "'," + expiry_month + "," + expiry_year + ")";
		con_payments.query(sql, (err, result) => {
		  var response = "";
		  if (result){
			  response = validate_form(cardnumber, cvv, name_on_card, expiry_month, expiry_year);
			  if (response=="")
				  response="Record updated successfully";
			  else
				  response = "Errors:<br>"+response;
		  }
		  else
		  {
			  response = err;
			  console.log(err)
		  }
		  res.write(callback+"('" + response + "')");
		  con_payments.end();
		  return res.end();
		})	
	}
	catch(error){
	   console.log("Error in (createServer)"+err)
	}	
}).listen(listening_port);

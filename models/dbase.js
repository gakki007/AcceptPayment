const pg = require('pg');
var config = require('./settings.js').Config()

var con_postgres = new pg.Client({
  host: config.dbase_host,
  port: config.dbase_port,
  user: config.dbase_user,
  password: config.dbase_password,
  database: 'postgres'
})
con_postgres.connect()

//Create DATABASE payments, only if it doesn't exist
var sql = "SELECT count(*) as dbase_exists FROM pg_database WHERE datname='payments'"
con_postgres.query(sql, (err, res) => {
  if (res){
	  var dbase_exists = res.rows[0].dbase_exists
	  if (dbase_exists==0){

			con_postgres.query('create DATABASE payments', (err, res) => {
			  if (res){
				 console.log('Created Payments Database')
				 Create_Table_Payments()
			  }
			  else
				 console.log(err)
			})		  
	  }
	  else{
         console.log('Payments Database already exists')
		 Create_Table_Payments()
	  }
  }
  else
     console.log(err)
})


function Create_Table_Payments(){
	//Create TABLE Payment_Attempts if it doesn't exist
	var con_payments = new pg.Client({
	  host: config.dbase_host,
	  port: config.dbase_port,
	  user: config.dbase_user,
	  password: config.dbase_password,
	  database: 'payments'
	})
	con_payments.connect()
	con_payments.query("SELECT count(*) as table_exists FROM information_schema.tables WHERE table_catalog = 'payments' AND table_name = 'payment_attempts'", (err, res) => {
	  if (res){
		  var table_exists = res.rows[0].table_exists
		  if (table_exists==0){
				con_payments.query('create table payment_attempts(id serial primary key,  cardholder varchar(80) not null, cardnumber varchar(66) not null, cvv varchar(46) not null, expiry_month integer not null, expiry_year integer not null)', (err, res) => {
				  if (res)
					 console.log('Created Table Payment_Attempts')
				  else
					 console.log(err)
				  process.exit(0)
				})		  
		  }
		  else{
			 console.log('Payment_Attempts already exists')
			 process.exit(0)
		  }
	  }
	  else{
		 console.log(err)
		 process.exit(1)
	  }

	})
}


// database details
// ================
var dbase_host =  'localhost'
var dbase_port =  5432
var dbase_user = 'postgres'
var dbase_password = 'qwerty'


// encrption security
//===================
var encryption_key = 'Carma_2018!'



// server details
//===============
var listening_port = 8080







// ***********************
// DO NOT TOUCH CODE BELOW
//************************

exports.Config = function () {
    return {
		"dbase_host": dbase_host,
		"dbase_port": dbase_port,
		"dbase_user": dbase_user,
		"dbase_password": dbase_password,
		"encryption_key": encryption_key,
		"listening_port": listening_port
	}
};
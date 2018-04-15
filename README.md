# AcceptPayment

An assignment by Carma to accept credit card details and validate them on the server via ajax, and storing data in a postgres database.



## Prerequisites

* The [NodeJS](https://nodejs.org/en/) framework should be installed, together with its  npm manager. If it is not, please download from:
[https://nodejs.org/en/download/](https://nodejs.org/en/download/)





*  [Postgress](https://www.postgresql.org/) database engine should be installed, but not the database.If it is not, please download from:
[https://www.postgresql.org/download/](https://www.postgresql.org/download/). In my case I used Postgress v10.3





## Configuring
#### Set Server settings
First set the server settings, such as the database password. To do this, using a text editor modify the contets of the file 
```
./model/settings.js
```
&nbsp; found in the model folder.


The settings to change are the following:

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



#### Set Client settings
Set the client settings by using a text editor modify the contets of the file 
```
./model/client_settings.js
```
   &nbsp;found in the model folder.

There is only one variable in the client_settings, the server url.


            // client details
            //===============
            var server_url = 'http://localhost:8080' 



## Installing

To install the packages needed by the application, run the install.bat found in the root folder

```
./install.bat
```

This file will execute 3 instructions:

* The installation of postgres package ```npm install pg@6.1.0 --save```
* The installation of CryptoJS package ```npm install crypto-js```
* The creation of the database and table ```node .\models\dbase.js```
			
			
## Running
#### Server
Navigate to the root folder and execute

```
 node ./AcceptPayment.js
```

#### Client
Load the
```
 Payment.html
```
&nbsp;in the browser

			
## Notes
#### CryptoJS
CryptoJS was selected as the encryption algorithm as it is a standard and secure algorithm, whilst at the same time, easy to implement and understand
#### Luhn Algorithm
The alogorithm I wrote was the following:

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

The logic here was modelled on this  [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm ).<br>
In my case, the length of the credit card number should have been exactly 16, so the first line returns false for any number of digits which is not 16.

The next loop iterates through all the numbers, reading two variables with each iteration. The first variable 'sngl' is use to read a single charater which won't be doubled. The value of 'i' is decremented by 1, so that the next character is read, this time it is doubled.
<br>
Each of the two variables are passed to the function 'single_digit', so that if they are two digits, the value of 9 would be subtracted from it. The resulting two variables are added to a running total.

The final line calculates the total modulus 10 to get the last character, which should be 0 for a valid checkdigit.

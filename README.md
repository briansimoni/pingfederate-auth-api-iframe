password to ping: 2Federate
Brian password: 2Federate

url for ping https://fss.gecompany.com:9999/pingfederate/app


127.0.0.1 my.cfmportal.com
127.0.0.1 fss.gecompany.com


requirements:

* set .env file
* Set turn off all of your silly corporate proxies, get off of corporate vpn
* set hosts file
* docker-compose up
* node mycfmportal.js
* visit 


### notes

openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes


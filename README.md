# URL Analyzer


### Angular: 
-	Front UI with text box and button.
-	Once Valid url enter then it send url to Node server API.
-	After URL analyze on server its send response to angular.
-	Based on response its generate url analyze result or any error on URL.

### Node Server:
-	We use cheerio, request, request-promise library
-	First we take url parameter from api, then send request to retrive html data once data retrived we load response body to cheerio to handle data.
-	If any http error like 404, 403 then we bind error message and send response to browser
-	If http response code 200 then move on to find html version, title of html, link and etc.
-	To detect login from available or not: we assume that page who having 1 input type of password then its chanse to exsist login page on that url
-	For title: find <title> tag and get text
-	For heading: count h1, h2, h3, h4, h5, h6 tag
-	For link: 
o	IF start with http: we take host name from url (which pass on api) and host name of a tag href and compare, and if both are same then its internal link otherwise external link
o	IF not start with http: then consider them as internal link

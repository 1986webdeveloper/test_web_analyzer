# URL Analyzer


### Angular: 
-	Front UI with text box and button.
-	Once valid URL enter then it send URL to Node server API.
-	After URL analyze on server its send response to angular.
-	Based on response its generate URL analyze result or any error on URL.

### Node Server:
-	We use cheerio, request, request-promise library.
-	First we take URL parameter from API, then send request to retrive HTML data once data retrived we load response body to cheerio to handle data.
-	If any http error like 404, 403 then we bind error message and send response to browser.
-	If http response code 200 then move on to find HTML version, title of HTML, link and etc.
-	To detect login from available or not: we assume that page who having 1 input type of password then its chanse to exsist login page on that URL.
-	For title: find <title> tag and get text.
-	For heading: count H1, H2, H3, H4, H5, H6 tag.
-	For link:
    -	If started with http: we take host name from URL (which pass on API) and host name of a tag href and compare, and if both are same then its internal link otherwise external link.
    -	If not started with http: then consider them as internal link.

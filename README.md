URL Shortener Microservice
==========================

FreeCodeCamp assignment.


Objective: Build a full stack JavaScript app that is functionally similar to this: 

https://little-url.herokuapp.com/ and deploy it to Heroku.

Here are the specific user stories you should implement for this project:

User Story: I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.

User Story: If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.

User Story: When I visit that shortened URL, it will redirect me to my original link.

Pro Tip: Checkout this wiki article for tips on integrating MongoDB on Heroku.


## Usage:

Start the server; uses package.json scripts to point to to 'nodemon server.js'

$ npm start



### Example creation usage:

use /new/<url> :
https://fcc-minurl.herokuapp.com/new/https://www.google.com
https://fcc-minurl.herokuapp.com/new/http://foo.com:80

Example creation output

{ "original_url":"http://foo.com:80", "short_url":"https://fcc-minurl.herokuapp.com/8170" }
Usage:

https://fcc-minurl.herokuapp.com/31

Will redirect to:

https://www.asdf.com/
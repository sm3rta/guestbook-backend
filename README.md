To clone and install dependencies

- `git clone https://github.com/sm3rta/guestbook-backend`

- `cd guestbook-backend`

- `yarn` (or use npm)

To start the application

- `node ./index.js` or `nodemon` 

To generate the docs

- `jsdoc -r -c .\jsdoc.conf.json .`
- Open /out/index.html

To run the tests

- `yarn test`



I used

- joi to validate request objects
- body-parser to parse request body into express's request.body
- config to manage global configuration variables
- cors for enabling CORS and exposing certain headers
- crypto for hashing passwords
- jsonwebtoken for encryption and authentication
- mongoose to connect to mongoDB and use its ORM

   

Security Features

- User data are tokenized using JWT and stored on the client side
- Requests that require the user to be logged in must have a header with a valid token in it 
- Passwords are stored hashed in the database


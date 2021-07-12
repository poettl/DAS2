# Websecurity Demo

This example shows three different authentication possiblities for web applications:
- Form Login
- Google Authentication
- Digest Authentication

## Usage

For running the backend server, which also serves the static HTML Files run
```shell
node app.js
```
in the project root directory.

This exposes a Node.js webserver on localhost port 3000. To be able to run the program, Node.js >= 14.15.4 has to be installed on the target computer.

## Different Logins

### Form Auth

For the Form-Authentication, there are three valid username:password combinations:

- test:test
- florian:czeczil
- peter:oettl

If any of the aforementioned combinatins is entered, a session token will be generated and sent to the client. Afterwards, the client will redirect to the secure page and be able to view the content there

### Google Auth

For this option, you need to log in with a valid Google account. Afterwards the server will again generate a session token, send it to the client, and redirect to the secure page. 

### Digest Auth

On click of the "Digest Authentication" button, the client sends an HTTP-Request to `localhost:3000/digest-login`. This Request returns a status of 401 with a `WWW-Authenticate` header, so that the browser-specific login prompt appers. For this, there is only one valid username:password combination, that being digest:digest.

If wrong credentials are entered at this step, the client will recieve another WWW-Authenticate requests, which again asks for username and password.

If the credentials are right, the client sends the digest challenge back to the server, which checks the values. If the values match the server calculations, the user is authenticated, a session token is created, sent to the client, and the client is again redirected to the secure page.

### Things to note

The access to the secure page stays consistent through refreshes, after two minutes however the session expires, resulting in a "Unauthorized" response on the next page refresh. 

Also, this response is set in case the user does not have a session cookie at all.
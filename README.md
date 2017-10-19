# React based RADIUS user management

A really simple front end to an equally simple RADIUS user management service.

To install this you also need my [go-radius-rest](https://github.com/shaleh/go-radius-rest)
micro-service. Of course, if you implement the really
simple REST endpoints below you can run this against your own backend.

    GET /users expects a list of users that have a `name` and a `disabled` boolean.
    PUT /users/<name>/disable will disable a user in RADIUS
    PUT /users/<name>/reactivate will reactivate a user in RADIUS

That is it. Yes, it is disable/reactivate not disable/enable. This was done to
prevent accidental calls.

The JS UI is a list of users from RADIUS. Each user is a
button. If the user is deactivated their button will be red if active
it is green. Clicking the button will move the user to the opposite
state. The UI is driven by a timer and every tick the user list will
be redrawn.

## Configuration
Edit the proxy section of package.json as needed for your own
development. To route calls to the micro-service to a different base URL tweak
the proxy section. The variable `RADIUS_API_BASE` in src/User.js will also
need to match the route used. Due to CORS they should both live on the same
server.

Change the `frequency` member of `UserList`'s state to adjust how
often the micro-service is called for new data.

## NOTE
The change in user state will hit the RADIUS DB immediately. However,
the client may not be affected for some time. This will be based on
RADIUS timeouts. For instance, if the user is set to have access from
8am to 8pm and it is 4pm currently the user's client may not check for
several hours. This can be adjusted in the database.

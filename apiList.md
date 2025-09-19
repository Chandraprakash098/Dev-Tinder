# DevTinder API List

/* Auth Routes */

- POST /signup  - user can signup by giving their deatails
- POST /login   - user can login by email and password
- POST /logout  - user can logout

/* User Routes */

- GET /profile/view   - After login user can see their profile
- PATCH /profile/edit - user can edit their profile
- PATCH /profile/password - user can edit their password

/* user connection Routes */

- GET /feed - to get the profile of other users on devTinder - not used
- GET /users - user can see the all connections
- POST /router.post("/request/send/:status/:toUserId")- user can send the request to other user
- GET /requests/received - user can see the request that he received
- POST /request/send/ignored/:userId - user can ignore the users 
- POST /request/review/accepted/:requestId - user accept the request
- POST /request/review/rejected/:requestId - user reject the request




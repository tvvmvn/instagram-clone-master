# Server for *Instagram-clone*

### Server Modules
![Modules](/images/modules.png)

### Rest API specification
> localhost:3000/api

1. Users
- POST /users - Create an user
- POST /users/login - Login
- PUT /users/user - Update an user

2. Profiles
- GET /profiles - Get profiles
- GET /profiles/:username - Get a profile
- POST /profiles/:username/follow - Follow a profile
- DELETE /profiles/:username/unfollow - Unfollow a profile

3. Posts
- GET /posts/feed - Get feed
- GET /posts - Get posts
- POST /posts - Create a post
- GET /posts/:id - Get a post
- DELETE /posts/:id - Delete a post
- POST /posts/:id/like - Like a post
- DELETE /posts/:id/unlike - Unlike a post

4. Comments
- GET /posts/:id/comments - Get comments
- POST /posts/:id/comment - Create a comment
- DELETE /posts/comments/:id - Delete a comment

### Model Diagram
1. Schema - A structure of Model
2. Operation - Model's behavior to process data of itself
3. Relationship - Interaction between Models.

![Diagram](/server/public/images/Diagram.png)




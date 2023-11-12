# Server for *Instagram-clone*



### Structure of express project

1. bin: Execution files for running the server
- www

2. models: Models of app
- User.js
- Following.js
- Post.js
- Comment.js
- Likes.js

3. controllers: Controllers of app
- userController.js
- postController.js
- commentController.js
- profileController.js

4. routes: Routes of app
- index.js
- user.js
- post.js
- comment.js
- profile.js

5. middleware: Middlewares of app
- auth.js
- loginValidator.js
- signUpValidator.js
- upload.js

6. files: A file server for client's upload
- avatar/
- photos/

7. public: static files directory

8. root directory
- app.js: The entry point of app
- seed.js: to generating seed data 
- env: enviroment variables for the apps


# An initial setup *GUIDES* for building Instagram clone app


## Setting enviroment variables
Set enviroment variables to .env such as server url.

## Install packages
cd client
npm install

## Create Server request library
make directory named utils and move to utils directory.
create a file named request.js

## Create components
make directory named components in src.
create templates with export function that has equal name to file.

- Authorization
AuthContext
AuthProvider
AuthRequired

- USER
Accounts
Login
SignUp

- ARTICLE
Feed
ArticleView
ArticleCreate
ArticleTemplate
Carousel
Comments

- PROFILE
Profile
Timeline
FollowerList
FollowingList

- OTHERS
Layout
NotFound
Search
Spinner

## Edit entry file of application and html document.
index.js
index.html > title

## Define Application Sturcture
App.js

## make each component to build UI. 
1. Components relavant to authorization
Auth*.js > Layout > Spinner, NotFound > SignIn & SignUp.
2. User profile and account
Profile > Account
3. Article
ArticleCreate > ArticleView > ArticleTemplate(Carousel) > Comments
4. Search
6. FollowerList, FollowingList
5. Feed







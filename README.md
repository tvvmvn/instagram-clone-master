# Prerequisites for App


## Table Of Contents
1. Development Map
2. Dev Stack
3. MVC Pattern
4. Router (+ URL structure, path, query & params..)
5. Module Integration Apporach
6. HTTP Request & Response
7. Middleware
8. Authentication & Authorization
9. NoSQL Guide


## 1. Development Map
1. Brower (Client)
2. Server 
- Authentication
- Processing data
3. DataBase

![Flow](/images/dev_flow.png)


## 2. Development Stack
> MERN Stack
1. M (MongoDB) - DataBase
2. E (Express) - Server Framework
3. R (React) - Client Framework
4. N (NodeJS) - Server dev language

![MERN](/images/MERN.png)


## 3. MVC Pattern
> Software architercture design pattern
1. M (Model) - Data Access Layer
2. V (View) - Presentation Layer
3. C (Controller) - Logic Layer

![MVC](/images/mvc.jpeg)


## 4. Router
> It connects request with proper resource

![Router](/images/router.png)


## 5. Module Integration 
> Bottom-Up Approach

![Integration](images/bottom-up.webp)


## 6. HTTP Request & Response
![HTTP](/images/http.png)

### HTTP Request Method
1. GET - Read Data
2. POST - Create Data
3. PUT - Update Data
4. DELETE - Delete Data

### HTTP Response Status Code
1. 1XX (Informational Response)
2. 2XX (Successful)
- 200 OK
3. 3XX (Redirection)
- 304 NotModified
4. 4XX (Client Error)
- 400 BadRequest
- 401 Unauthorized
- 404 NotFound
5. 5XX (Server Error)
- 500 Internal Server Error



## 7. Middleware
> They process many tasks between client and server

![Middleware](/images/middleware.png)



## 8. Authentication & Authorization 
> Based on JWT (JSON Web Token)

### Process 
![Auth](/images/auth_process.png)

### JWT (JSON Web Token) Structure
![JWT](/images/jwt.jpeg)



## 9. NoSQL Guide

### Basic terms
1. Collection - A basis for sorting related data in NoSQL.
2. Document - Each data in collection
3. Field - each property of document.

![Collection](/images/collection.png)

### Collection Join
> Collection can be joined to make abundant data
---
![Join](/images/join.png)


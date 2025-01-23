



# Usage

## Authentication

<post> POST </post> : `/auth/register` Registers a new User.

*Request Body*

```json
{
  "email":"werner.heisenberg@gmail.com",//! unique
  "password":"freedom",
  "username":"heisen", //! unique
  "name":"Werner", //optional
  "lastName":"Heisenberg", //optional
  "bio":"German theoretical physicist and 1932 Nobel Prize winner. Heisenberg was a main contributor to the German atomic program during World War II, in direct  competition with the Manhattan Project" //optional
} 
```

*Response Body*


```json
{
    "Authorization": "eyJhbGciOiJIUzI...."
}

```

---

<post> POST </post> : `/auth/login` Log in to existent account.


*Request Body*

```json
{
  "email":"werner.heisenberg@gmail.com",
  "password":"freedom"
}

```
*Response Body*


```json
{
    "Authorization": "eyJhbGciOiJIUzI1NiI..."
}

```
## Users Management 

<get> GET </get> : `/users/infos`  Retrieves the information of the currently authenticated user.

*Response Body*


```json
{
    "email": "werner.heisenberg@gmail.com",
    "name": "Werner",
    "lastName": "Heisenberg",
    "username": "heisen",
    "bio": "German theoretical physicist and 1932 Nobel Prize winner. Heisenberg was a main contributor to the German atomic program during World War II, in direct competition with the Manhattan Project",
    "id": "6792d03f6ead5323be1a6fa4"
}

```

---

<patch> PATCH </patch> : `/users/infos` Updates the information of the currently authenticated user.  

```json
{
  "name":"new name",
  "lastName":"new lastName",
  "bio":"new biooo"
}

```
---
<patch> PATCH </patch> : `/users/infos/password` Changes the password of the currently authenticated user.


```json
{
  "oldPassword": "currentPassword",
  "newPassword": "newPassword"
}
```


---

<get> GET </get> : `/users/email/{email}` Finds a user by email address. Replace `{email}` with the user's email.

---

<get> GET </get> : `/users` Retrieves a list of all users.

**Query Parameter:**  
`transform` (optional): Boolean to decide transformation logic.


---

<get> GET </get> : `/users/{id}` Finds a user by ID. Replace `{id}` with the user's ID.

---

<patch> PATCH </patch> : `/users/{id}` Updates a user by ID. Replace `{id}` with the user's ID.
**Request Body:** 

```json
{
  "name":"new name",
  "lastName":"new lastName",
  "bio":"new biooo"
}
```


---

<delete> DELETE </delete> :  `/users/{id}` Removes a user by ID. Replace `{id}` with the user's ID.



## Article API Endpoints


<get> GET </get>: `/article` Retrieves all articles.

---

<get> GET </get> : `/article/:id` Retrieves an article by its ID.

---


<get> GET </get> : `/article/full` Fetches All Standalone articles with their nested comments 

---

<get> GET </get> : `/article/full/{id}` Fetches an article (or comment) with its nested comments. 

---

<post> POST </post>: `/article/create/` Creates a new article or a comment, with multiple image uploads. If the article is a comment on another article, provide the `fatherId` field with the ID of the parent article. Otherwise, set `fatherId` to `null` for standalone posts.  

*Multipart/form-data*


```json
{
    "title": "Article title",
    "content": "Article content",
    "fatherId": "ParentArticleId or null",
    "slug": "optional-slug",
    "owner": "OwnerId",
    "images": [ArrayOfImages]
}
```

---


<post> POST </post> : `/article/:id/upvote` Upvotes an article.

 ---

<post> POST </post> : `/article/:id/downvote` Downvotes an article

---


<put> PUT </put>: `/article/:id/image/change/:index?` Changes an article's image by its index (default is `0`).  

*Multipart/form-data*

```json
{
    "image": [TheImage]
}
```
---
<delete> DELETE </delete>: `/article/:id/image/delete/:index?` Deletes an article's image by its index (default is `0`).  

---

<post> POST </post>: `/article/:id/image/add` Adds a new image to the specified article.

*Multipart/form-data*

```json
{
    "image": [TheImage]
}
```
---


<get> GET </get>: `/article/property` Retrieves all articles created by the currently authenticated user.

 ---

<get> GET </get>: `/article/owner/:id` Retrieves the owner of a specified articl.

 ---

<patch> PATCH </patch>: `/article/:id` Updates an article by its ID.


```json
{
  "title": "Updated title",
  "description": "Updated description",
  "content": "Updated content"
}
```

 ---

<delete> DELETE </delete>: `/article/:id` Deletes an article by its ID.
 
 ---

<get> GET </get> : `/article/search/:name` Searches for articles by their name.

 ---



## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If
you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
<style>
get { 
 
  background-color :rgb(1, 71, 55) ;
  border-color : rgb(229, 231, 235);
  border-radius : 4px;
  color:  rgb(132, 225, 188);
  border-style: solid;  
  border-width : 0px;
  
  padding-right: 3px;
  padding-left: 3px;

  }
post { 
 
  background-color :rgb(99, 49, 18);
  border-color : rgb(229, 231, 235);
  border-radius : 4px;
  color:  rgb(250, 202, 21) ;
  border-style: solid;  
  border-width : 0px;
  
  padding-right: 3px;
  padding-left: 3px;

  }
patch { 
 
  background-color :rgb(35, 56, 118) ;
  border-color : rgb(229, 231, 235);
  border-radius : 4px;
  color:  rgb(164, 202, 254);
  border-style: solid;  
  border-width : 0px;
  
  padding-right: 3px;
  padding-left: 3px;

  }

delete { 
 
  background-color :rgb(119, 29, 29) ;
  border-color : rgb(229, 231, 235);
  border-radius : 4px;
  color:  rgb(248, 180, 180);
  border-style: solid;  
  border-width : 0px;
  
  padding-right: 3px;
  padding-left: 3px;

  }
put{ 
 
  background-color :rgb(74, 29, 150) ;
  border-color : rgb(229, 231, 235);
  border-radius : 4px;
  color:  rgb(202, 191, 253);
  border-width : 0px;
  
  padding-right: 3px;
  padding-left: 3px;

  }
</style>






# Usage

## Users Management 

#### <get> GET </get> : `/users/infos`  Retrieves the information of the currently authenticated user.

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
  <get> GET </get> : `/article/:id` Retrieves an article by its ID.
 
<get> GET </get>: `/article` Retrieves all articles.

<post> POST </post>: `/article/create/` Creates a new article or a comment, with multiple image uploads. If the article is a comment on another article, provide the `fatherId` field with the ID of the parent article. Otherwise, set `fatherId` to `null` for standalone posts.  
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

<put> PUT </put>: `/article/:id/image/change/:index?` Changes an article's image by its index (default is `0`).  
*No body required.*

<get> GET </get>: `/article/:id/images` Retrieves all images of the specified article.  
<post> POST </post>: `/article/:id/image/add` Adds a new image to the specified article.
*No body required.*
 
<get> GET </get>: `/article/:id/image/:index?` Retrieves a specific image link from an article by its index (default is `0`).
 
<get> GET </get>: `/article/property` Retrieves all articles created by the currently authenticated user.
 
<get> GET </get>: `/article/owner/:id` Retrieves the owner of a specified article.
 
<patch> PATCH </patch>: `/article/:id` Updates an article by its ID.


```json
{
  "title": "Updated title",
  "description": "Updated description",
  "content": "Updated content"
}
```
 
<delete> DELETE </delete>: `/article/:id` Deletes an article by its ID.
 
 
<get> GET </get> : `/article/search/:name` Searches for articles by their name.
 
<post> POST </post> : `/article/:id/upvote` Upvotes an article.
 
<post> POST </post> : `/article/:id/downvote` Downvotes an article

## Notifications 



- GET : /Notification/received/ : allows ADMIN to list all PENDING requests
- GET : /Notification/received/all : allows ADMIN to list all received requests
- POST : /Notification/request : allows CONSUMER to send request to be promoted to MERCHANT
- DELETE : /Notification/cancel : allows CONSUMER to cancel his PENDING requests before ADMIN responds
- PATCH : /Notification/grant/{userId} : allows ADMIN to grant CONSUMER with {userId} the MERCHANT Role (if already MERCHANT
  he
  stays MERCHANT )
- PATCH : /Notification/revoke/{userId} : allows ADMIN to revoke CONSUMER with {userId} the MERCHANT's Role down to CONSUMER
  again (he stays CONSUMER if already CONSUMER)
- GET : /Notification/granted : allows ADMIN to list all MERCHANTS he granted the role
<get>GET </get>: `Notification/sent` : allows CONSUMER/MERCHANT to see the request details they sent

```json  
{
  "userId": "665bcee36a8214438b2324ad",
  "status": "approved",
  "id": "665d0fd176c62c1b2821a54b",
  "createdAt": "2024-06-03T00:35:29.519Z",
  "updatedAt": "2024-06-03T01:06:02.424Z"
}
```
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
  color:  rgb(202, 191, 253)
  border-width : 0px;
  
  padding-right: 3px;
  padding-left: 3px;

  }
</style>


<!-- 
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456V

[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->
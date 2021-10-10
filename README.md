# Social Network API

![badge](https://img.shields.io/badge/license-MIT-brightgreen)

  ## Description
  Acceptance Criteria:
  
 ```
GIVEN a social network API
WHEN I enter the command to invoke the application
THEN my server is started and the Mongoose models are synced to the MongoDB database
WHEN I open API GET routes in Insomnia Core for users and thoughts
THEN the data for each of these routes is displayed in a formatted JSON
WHEN I test API POST, PUT, and DELETE routes in Insomnia Core
THEN I am able to successfully create, update, and delete users and thoughts in my database
WHEN I test API POST and DELETE routes in Insomnia Core
THEN I am able to successfully create and delete reactions to thoughts and add and remove friends to a user’s friend list
 ```

  ## Table of Contents
  - [Description](#description)
  - [Installation](#installation)
  - [Usage](#usage)
  - [License](#license)
  - [Credits](#credits)
  ## Installation
  `npm init`
  `npm i express mongoose moment`

  ## Usage
  Run `node server.js` or `npm start` command at the root of the file to connect to the MongoDB database on server start.

  Demo Video:

  - Full youtube video can be viewed [here](https://www.youtube.com/watch?v=0EU4mVjqLoI).
  
  ## License
  This application is covered by [MIT](https://opensource.org/licenses/MIT) license. 
  
  ## Credits: 
  https://courses.bootcampspot.com/

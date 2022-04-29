# RamenLog

RamenLog is a forum-like blog application with login features and photo uploading. It provides a cloud-based place to document every ramen store you visited. It requires sign-in to post a new blog and comment on other's blog post.

## Demo

Here is a working live demo: [RamenLog](https://ramenlogtaiwan.herokuapp.com)

## Technologies

- VanillaJS
- Bulma.io
- Node.js
- Express
- MongoDB

## Key Features

- Frontend uses Bulma.io library and ejs as view engine.
- Backend code architecture follows **Model-View-Controller**(MVC) pattern.
- Routes are configured in **RESTful** patterns which provide API mapping from HTTP verbs to CRUD operations.
- Using NoSQL database (MongoDB) for data storage.
- Connect with cloudinary API to store images.
- Utilizing **passport.js** for authentication as well as **session** to store user information and flashing messages.
- Using **joi** validator to check whether data input meets the defined schema.
- Deploy on Heroku live server.

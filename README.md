# Project Title

AI Learning Bot

## GitHub link:

Access this project on Git:
https://github.com/joaobernardino77/LearningBot

## Table of Content:

- [About The App](#about-the-app)
- [Technologies](#technologies)
- [Setup](#setup)
- [Run](#run)
- [Approach](#approach)
- [Author](#author)

## About The App

AI Learning Bot is an app that allows the user to learn about different topics and subjects by writing messages through a chat bot. All the learning information is loaded using a MongoDB database. There are documents for learning (the ones that have a category named learning) and the others are for bot basic communication. You can specify on bot server initialization what are the learning topics that you can include on the bot (if you don't specify one all topics and all learning messages will be learned by the bot)

## Technologies

Application made using React (client part) and Node.js(server part) with MongoDB (database part)

## Setup

- download or clone the repository
- execute `npm install` for both client and server folder

## Run

- to run the server execute `npm start` on the server folder
- to run the client execute `npm start` on the client folder

## Approach

For the database i have created the 'messages' collection on the database. Every document has a category (learning or other), a topic and an array of objects(composed by user messages, bot responses and a subject).
For the server right at the beggining we create an instance of the bot,for this i used a class that has all the methods associated with the bot, except for the helpers (that are optional to the working of the bot). We also set the routes where each will call a method of the bot instance. One to send the bot initial message and the other to get the response for the user message (in case there is no response a not found response is sent, and in case there are multiple responses a random one is picked)
For the client i created the MessageArea component that is the core of the client with two useEffects: one to retrieve the initial bot message and the other to get a bot response whenever user sends a message. We then have 2 components one for capturing the user input and the other to display both Bot and User messages. Whenever we are getting the bot response from the server we block the user input and show a loading message animation as the last message of the bot

## Author

[João Bernardino] https://github.com/joaobernardino77

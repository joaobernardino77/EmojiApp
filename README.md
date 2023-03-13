# Project Title

EmojiApp

## GitHub link:

Access this project on Git:
https://github.com/joaobernardino77/EmojiApp

## Table of Content:

- [About The App](#about-the-app)
- [Technologies](#technologies)
- [Setup](#setup)
- [Run](#run)
- [Approach](#approach)
- [Author](#author)

## About The App

EmojiApp is an app that allows the user to decode, sign and submit emoji(s) to a calendar. Decoding emojis can be done without any further requirement, all other operations must require user to be connected to the MetaMask account. The app consists on two pages. The main one is a calendar where user can see all saved events. The other one is the emoji event page where user can set an event with the loaded emojis

## Technologies

Application made using React

## Setup

- download or clone the repository
- execute `npm install`

## Run

- to run the app execute `npm start`

## Approach

First i have defined how the emojis were passed using the path. Because there can be combined emojis i have defined the '&' character to separate emojis. The emojis code are passed in the format U+XXXX (here is a link to a list of emojis and their respective code). As an example of a single emoji we can have U+1F600 and the example of a combined emoji we can have U+1F636U+200DU+1F32BU+FE0F. So if user wants both emojis on the same event the path he needs to use is U+1F928&U+1F636U+200DU+1F32BU+FE0F
When user enters both calendar or event page, if is not connected or has a saved account cached, he will be asked to connect
All data on a data structure is saved using react useContext and any change on it goes to localStorage to be persistent (in case it exists it gets loaded initially to the context from it)
In that structure the address of the MetaMask account is saved (when we detect a disconect on the account it resets that adress and refreshes the page), and we also save the data for the users. On the user data it is saved not only the events that user adds but also an object with all signed emojis in order to not asking user to sign again repeated emojis. those signed emojis however gets validated when user pick a calendar date for an event and in case there are no longer valid they are removed from that list and user is requested to sign the emojis again (only the ones that are no longer valid it doens't need to sign all the emojis of the event) .

## Author

[João Bernardino] https://github.com/joaobernardino77

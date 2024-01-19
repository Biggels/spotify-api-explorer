const axios = require('axios');
const auth = require('./auth');
const express = require('express');
require('dotenv').config(); // loads values from the .env file into process.env

const clientID = process.env.CLIENT_ID; // we then load the secret from that .env file, and ignore it in our .gitignore file, so it doesn't get pushed
const clientSecret = process.env.CLIENT_SECRET;


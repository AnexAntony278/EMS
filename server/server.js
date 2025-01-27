require('dotenv').config();
const express = require('express');
const cors = require('cors');
const queries = require('./models/queries.js')
const app = express();
app.use(cors());
app.use(express.json());


app.post('/login', (request, response) => {
    const { email, password } = request.body;
    if (queries.isValidUser(email, password)) {
        response.status(200).send(`Auth suces for email : ${email} and pass: ${password}`);
    } else {
        response.status(401).send(`invalid email or password`);
    }
});


app.listen(process.env.SERVER_PORT, () => {
    console.log('\nServer Running..');
})
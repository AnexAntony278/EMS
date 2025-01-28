require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
app.use(express.json())
app.use(cors());
const jwt = require('jsonwebtoken');

const query = require('./models/queries.js')
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    query.isValid(email, password).then((isValidUser) => {
        if (isValidUser) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1hr' });
            res.status(200).send(token);
            console.log(token)
        } else {
            res.status(401).send('Login Failed');
        }
    })
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`\nServer Running at ${process.env.SERVER_PORT}`);
});

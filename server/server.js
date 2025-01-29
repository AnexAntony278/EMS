require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
app.use(express.json())
app.use(cors());
const query = require('./models/queries.js');
const db = require('./config/db_config.js');

app.post('/login', async (request, response) => {
    const { email, password } = request.body;
    try {
        const isValidUser = await query.isValid(email, password);
        console.log("login", isValidUser);
        if (isValidUser) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1hr' });
            return response.status(200).send(token);
        } else {
            return response.status(401).send('Login Failed.');
        }
    } catch (error) {
        console.log(error);
        return response.status(500).send('Server Error');
    }
});

app.post('/signup', async (request, response) => {
    const { name, email, password, role } = request.body;
    try {
        // check for duplicate mail 
        const isValidUser = await query.isValid(email, password);
        if (isValidUser) {
            return response.status(409).send('User already exists');
        }
        const result = await query.signUser(name, email, password, role);
        if (result) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1hr' });
            return response.status(200).send(token);
        } else {
            return response.status(401).send('Signup Failed');
        }
    } catch (error) {
        console.error(error);
        return response.status(500).send('Server error');
    }
});

app.post('/events', async (request, response) => {
    const { host_id, name, description, location, start_time, end_time } = request.body;
    try {
        db.query("INSERT INTO Events(host_id, name, description, location, start_time, end_time)");
    } catch (error) {

    }
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`\nServer Running at ${process.env.SERVER_PORT}`);
});

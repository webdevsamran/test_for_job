const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const NodeCache = require('node-cache');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Cache instance
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

app.get('/holidays', async (req, res) => {
    const { country, year } = req.query;

    if (!country || !year) {
        return res.status(400).json({ error: 'Country and year are required' });
    }

    const cacheKey = `${country}-${year}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        const response = await axios.get(`https://calendarific.com/api/v2/holidays`, {
            params: {
                api_key: process.env.CALENDARIFIC_API_KEY,
                country,
                year,
            },
        });


        const holidays = response.data;
        cache.set(cacheKey, holidays);
        res.json(holidays);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from Calendarific API' });
    }
});

app.get('/countries', async (req, res) => {
    try {
        const response = await axios.get(`https://calendarific.com/api/v2/countries`, {
            params: {
                api_key: process.env.CALENDARIFIC_API_KEY,
            },
        });

        const countries = response.data.response.countries;
        res.json(countries);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from Calendarific API' });
    }
});

// Only start the server if this script is executed directly, not required by another module (like in tests)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port http://127.0.0.1:${port}`);
    });
}

module.exports = app;

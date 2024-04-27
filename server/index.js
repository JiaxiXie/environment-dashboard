const express = require('express');
const csv = require('csv-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csvFilePath = path.join(__dirname, 'factory_data.csv');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
    origin: 'http://localhost:3000'
}));

let data = [];

fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        data.push(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });

app.get('/api/data', (req, res) => {
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
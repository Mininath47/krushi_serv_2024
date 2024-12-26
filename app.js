const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
 require('dotenv').config()

const app = express();
app.use(cors());

const url = process.env.MongoPath; // Replace with your MongoDB connection string
const dbName = 'StateDrop'; // Replace with your database name
let db;

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log("Connected to MongoDB");
        db = client.db(dbName);
    })
    .catch(err => console.error("Error connecting to MongoDB:", err));

// Route to fetch all states
app.get('/state', (req, res) => {
    db.collection('State').find({}).toArray()
        .then(documents => res.send(documents))
        .catch(err => {
            console.error("Error fetching states:", err);
            res.status(500).send("Internal Server Error");
        });
});
app.get('/khat', (req, res) => {
    db.collection('Khat').find({}).toArray()
        .then(documents => res.send(documents))
        .catch(err => {
            console.error("Error fetching states:", err);
            res.status(500).send("Internal Server Error");
        });
});

// Route to fetch districts by state
app.get('/state/:stateName', (req, res) => {
    const stateName = req.params.stateName;
    db.collection('State').findOne({ 'states.name': stateName })
        .then(document => {
            if (document) {
                const state = document.states.find(state => state.name === stateName);
                res.send(state.districts);
            } else {
                res.status(404).send("State not found");
            }
        })
        .catch(err => {
            console.error("Error fetching districts:", err);
            res.status(500).send("Internal Server Error");
        });
});

// Route to fetch subdistricts by district
app.get('/state/:stateName/:districtName', (req, res) => {
    const { stateName, districtName } = req.params;
    db.collection('State').findOne({ 'states.name': stateName })
        .then(document => {
            if (document) {
                const state = document.states.find(state => state.name === stateName);
                const district = state.districts.find(district => district.name === districtName);
                if (district) {
                    res.send(district.subdistricts);
                } else {
                    res.status(404).send("District not found");
                }
            } else {
                res.status(404).send("State not found");
            }
        })
        .catch(err => {
            console.error("Error fetching subdistricts:", err);
            res.status(500).send("Internal Server Error");
        });
});

// Route to fetch villages by subdistrict
app.get('/state/:stateName/:districtName/:subdistrictName', (req, res) => {
    const { stateName, districtName, subdistrictName } = req.params;
    db.collection('State').findOne({ 'states.name': stateName })
        .then(document => {
            if (document) {
                const state = document.states.find(state => state.name === stateName);
                const district = state.districts.find(district => district.name === districtName);
                const subdistrict = district.subdistricts.find(sub => sub.name === subdistrictName);
                if (subdistrict) {
                    res.send(subdistrict.villages);
                } else {
                    res.status(404).send("Subdistrict not found");
                }
            } else {
                res.status(404).send("State not found");
            }
        })
        .catch(err => {
            console.error("Error fetching villages:", err);
            res.status(500).send("Internal Server Error");
        });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});

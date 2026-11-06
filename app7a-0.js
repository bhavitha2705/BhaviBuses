
const express = require("express");
const mysql = require("mysql8");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// Connection with bus database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "bhavitha@27",
    database: "bus"
});

db.connect((err) => {
    if (err)
        throw err;
    console.log("Connected to MySQL");
});

// TO GET DETAILS OF ALL BUSES
app.get("/buses", (req, res) => {
    db.query(
        "SELECT * FROM bus",
        (err, result) => {
            if (err) throw err;
            res.json(result);
        }
    );
});

// TO GET DETAILS OF ONE BUS
app.get("/buses/:bus_id", (req, res) => {
    db.query(
        "SELECT * FROM bus WHERE bus_id=?",
        [req.params.bus_id],
        (err, result) => {
            if (err) throw err;
            res.json(result);
        }
    );
});

// TO INSERT BUS DATA INTO bus TABLE
app.post("/buses", (req, res) => {
    const {
        bus_id,
        bus_no,
        source,
        destination,
        departuretime,
        total_seats
    } = req.body;

    db.query(
        "INSERT INTO bus (bus_id, bus_no, source, destination, departuretime, total_seats) VALUES (?, ?, ?, ?, ?, ?)",
        [
            bus_id,
            bus_no,
            source,
            destination,
            departuretime,
            total_seats
        ],
        (err) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            res.send("Bus Inserted");
        }
    );
});

// TO UPDATE BUS DETAILS
app.put("/buses/:bus_id", (req, res) => {
    const {
        bus_no,
        source,
        destination,
        departuretime,
        total_seats
    } = req.body;

    db.query(
        "UPDATE bus SET bus_no=?, source=?, destination=?, departuretime=?, total_seats=? WHERE bus_id=?",
        [
            bus_no,
            source,
            destination,
            departuretime,
            total_seats,
            req.params.bus_id
        ],
        (err, result) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }

            if (result.affectedRows == 0)
                res.status(404).send("Bus NOT found");
            else
                res.send("Bus Updated");
        }
    );
});

// TO DELETE BUS DETAILS
app.delete("/buses/:bus_id", (req, res) => {
    db.query(
        "DELETE FROM bus WHERE bus_id=?",
        [req.params.bus_id],
        (err, result) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }

            if (result.affectedRows == 0)
                res.status(404).send("Bus NOT found to delete");
            else
                res.send("Bus Deleted");
        }
    );
});

// Server listening on port 3000
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});

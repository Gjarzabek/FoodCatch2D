const express = require('express');
const port = 9000;

const app = express();

app.use(express.static('dist'));
app.use(express.static('assets'));

app.get("/", (req, res) => {
    res.sendFile(__dirname  + "/index.html");
});

app.listen(port, () => {
    console.log(`Game served at http://localhost:${port}`);
});
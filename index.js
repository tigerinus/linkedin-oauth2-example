const express = require('express');
const app = express();
const port = 4000;

app.use(express.static('public'));


app.post("/auth", (req, res) => {
	res.send(`${req.query['code']} ${req.query['state']}`);
});

app.listen(port, () => {
	console.log(`App is served at http://localhost:${port}`);
});




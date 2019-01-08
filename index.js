const express = require('express');
const request = require('request');
const app = express();
const port = 4000;

app.use(express.static('public'));


app.get("/auth", (req, res) => {
    var code = req.query['code'];
    var client_id = req.query['state']; // using state value as client_id, to know which app we are dealing with.

    request.post('https://www.linkedin.com/oauth/v2/accessToken', {
        form: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: `http://localhost:${port}/auth`,
            client_id: '77tpo9igafy35s',
            client_secret: process.env.CLIENT_SECRET,
        }
    }, (err, r, body) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        
        res.status(200).json(body);
    });
});

app.listen(port, () => {
	console.log(`App is served at http://localhost:${port}`);
});




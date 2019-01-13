const express = require('express');
const request = require('request');
const app = express();
const port = 4000;

const getPerson = (accessToken, next) => {
    request.get("https://api.linkedin.com/v1/people/~?format=json", {
        'auth': {
            'bearer': accessToken
        }
    }, next);
};

const renderPDF = (res) => (error, r, body) => {
    if (error) {
        res.status(500).send(error);
    }

    var person = JSON.parse(body);

    var result = `
        <html>
            <h1>${person.firstName} ${person.lastName}</h1>
            <p>${person.headline}</p>
        </html>
    `

    res.status(200).send(result);
};

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
        
        var accessToken = JSON.parse(body).access_token;

        getPerson(accessToken, renderPDF(res));
    });
});

app.listen(port, () => {
	console.log(`App is served at http://localhost:${port}`);
});




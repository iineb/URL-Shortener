const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require('request');
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("pages/index", {
        shorten: null,
        error: null
    });
});

app.post("/", function(req, res) {
    let ownUrl = req.body.ownUrl;
    let url = "https://rel.ink/api/links/";
    let requestData = {
        url: ownUrl
    };
    console.log(ownUrl);
    request(url, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        json: true,
        body: requestData
    }, function(err, response, body) {
        if (err) {
            res.render("index", {
                shorten: null,
                error: "There is an error!"
            });
        } else {
            let shorten = body;
            let shortenText;
            console.log(body);
            if (ownUrl) {
                shortenText = `The new URL is ${url}${shorten.hashid}.`;
            } else {
                shortenText = "Please enter a URL";
            }
            res.render("pages/index", {
                shorten: shortenText,
                error: null
            });
        }
    });
});

app.listen(port, () => console.log(`Listing on port ${port}`));

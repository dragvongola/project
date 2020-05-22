const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, function () {
  console.log("Listening to port 3000");
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});
app.post("/", function (req, res) {
  let firstName = req.body.fName;
  let lastName = req.body.lName;
  let email = req.body.email;

  //mailchimp format
  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  let jsonData = JSON.stringify(data);

  let options = {
    method: "POST",
    auth: "azril:5da82c64c10d0e938ecc09c840131515-us18",
  };

  const request = https.request(
    "https://us18.api.mailchimp.com/3.0/lists/f6683ec1a1",
    options,
    function (response) {
      console.log(response);
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }

      response.on("data", function (data) {
        //console.log(JSON.parse(data));
      });
    }
  );

  //request.write(jsonData);
  request.end();
});

//apikey
//5da82c64c10d0e938ecc09c840131515-us18

//audience key
//f6683ec1a1

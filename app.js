const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const request = require("request");
const moment = require("moment");

const port = 5000;
const hostname = "localhost";
app.use(bodyParser.json());
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("MPESA DARAJA API WITH NODE JS");
  var timeStamp = moment().format("YYYYMMDDHHmmss");
  console.log(timeStamp);
});

//ACCESS TOKEN ROUTE
app.get("/access_token", (req, res) => {
  getAccessToken()
    .then((accessToken) => {
      res.send("😀 Your access token is " + accessToken);
    })
    .catch(console.log);
});


//MPESA STK PUSH ROUTE
app.get("/stkpush", (req, res) => {
  getAccessToken()
    .then((accessToken) => {
      const url =
          "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        auth = "Bearer " + accessToken;
      var timestamp = moment().format("YYYYMMDDHHmmss");
      const password = new Buffer.from(
        "174379" +
          "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
          timestamp
      ).toString("base64");

      request(
        {
          url: url,
          method: "POST",
          headers: {
            Authorization: auth,
          },
          json: {
            BusinessShortCode: "174379",
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: parseInt(req.query.amount),
            PartyA: "254768168060",
            PartyB: "174379",
            PhoneNumber: "", // REPLACE WITH YOUR PHONE NUMBER
            CallBackURL: "", // REPLACE WITH YOUR CALLBACK URL
            AccountReference: "SIFUNA PAY",
            TransactionDesc: "Mpesa Daraja API stk push test",
          },
        },
        function (error, response, body) {
          if (error) {
            console.log(error);
          } else {
            res.redirect("http://localhost:3000/confirm");
          }
        }
      );
    })
    .catch(console.log);
});

 
      
// ACCESS TOKEN FUNCTION
function getAccessToken() {
  const consumer_key = "";// REPLACE IT WITH YOUR CONSUMER KEY
  const consumer_secret = ""; // REPLACE IT WITH YOUR CONSUMER SECRET
  const url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth =
    "Basic " +
    new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");
  return new Promise((response, reject) => {
    request(
      {
        url: url,
        headers: {
          Authorization: auth,
        },
      },
      function (error, res, body) {
        var jsonBody = JSON.parse(body);
        if (error) {
          reject(error);
        } else {
          const accessToken = jsonBody.access_token;
          response(accessToken);
        }
      }
    );
  });
}


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
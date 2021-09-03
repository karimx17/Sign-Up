//Requiring .env as early as possible (best practice)
require('dotenv').config()


//Requiring mailchimp's module
//For this we need to install the npm module @mailchimp/mailchimp_marketing. To do that we write:
//npm install @mailchimp/mailchimp_marketing
const mailchimp = require("@mailchimp/mailchimp_marketing");

//Requiring express and body parser and initializing the constant "app"
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

//Using bod-parser
app.use(bodyParser.urlencoded({
    extended: true
}));

//The public folder which holds the CSS
app.use(express.static(__dirname + "/"));

//Listening on port 3000 and if it goes well then logging a message saying that the server is running
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running at port 3000");
});

//Sending the signup.html file to the browser as soon as a request is made on localhost:3000
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

//Setting up MailChimp
mailchimp.setConfig({
    apiKey: process.env.API_KEY,

    server: process.env.SERVER
});

//As soon as the sign in button is pressed execute this
app.post("/", function (req, res) {

    const firstName = req.body.firstName;
    const secondName = req.body.secondName;
    const email = req.body.email;

    const listId = process.env.LIST_ID;

    //Creating an object with the users data
    const subscribingUser = {
        firstName: firstName,
        lastName: secondName,
        email: email
    };
    
    //Uploading the data to the server
    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });

        //If all goes well logging the contact's id
        res.sendFile(__dirname + "/success.html")
        console.log(
            `Successfully added contact as an audience member. The contact's id is ${
	response.id}.`
        );
    }
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});
const admin = require('firebase-admin');
const express = require('express');
require('dotenv').config();


admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    //   databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    
});

const app = express();
app.use(express.static("public"));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.post('/sendNotification', (req, res) => {


    const { targetToken, title, message } = req.body;


    const payload = {
        notification: {
            title: title,
            body: message
        }
    };

    const message2 = {
        token: targetToken,
        ...payload
    };
    admin.messaging().send(message2) 
        .then(response => {
            res.status(200).send('Notification sent successfully!');
        })
        .catch(error => {
            console.error('Error sending notification:', error);
            res.status(500).send('Error sending notification.');
        });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
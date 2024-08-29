const admin = require('firebase-admin');
const mApp = require('express');
const path =require('path');
const serviceAccount= require(path.join(__dirname, 'serviceKey.json'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // credential: admin.credential.applicationDefault(),
    
});

const app = mApp();
app.use(mApp.json()); 
app.use(mApp.urlencoded({ extended: true })); 


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
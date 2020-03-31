'use-strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotificaiton = functions.firestore.document(`Users/{user_id}/Tasks/{tasks_id}`).onWrite((change, context)=> {
    const user_id = context.params.user_id;
    const tasks_id = context.params.tasks_id;
    
    return admin.firestore().doc(`Users/${user_id}/Tasks/${tasks_id}`).get().then(snapshot => {
        
        const to_data = admin.firestore().doc(`Users/${user_id}`).get();

        return Promise.all([snapshot, to_data]).then(result => {
            
            const from_name = result[0].data().username;
            const to_name = result[1].data().username; 
            const tokenId = result[1].data().tokenId; 
            console.log("From: " + from_name + " to : " + to_name);
            
            const payload = {
                notification: {
                    title: "Request accepted", 
                    body: from_name + " has accepted your request",
                    icon: "default" 
                }
            };
            return admin.messaging().sendToDevice(tokenId, payload).then(result => {
                console.log("Notification sent")
                return null;
            })
            
        });
    });
});





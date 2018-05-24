const fn = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = fn.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.new_post_house_keeping = fn.firestore
    .document('posts/{id}')
    .onCreate( (snap, context) => {
        try {
            const postId = context.params.id;
            const postRef = admin.firestore().collection('posts').doc(postId)
            return postRef.update({
                liked_by: snap.data().author, 
                likes: 1, 
                score: 1
            })

            // count the likes by all users

            // count the tag counts by each user

            // cannot use authid here as it is not yet supported by FB functions. keep and eye on it
        } catch (err) {
            console.log('Error getting documents', err)
        }

});

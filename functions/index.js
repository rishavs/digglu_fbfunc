const fn = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = fn.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

exports.like_post_count = fn.firestore
    .document('sec_evt_like_post/{id}')
    .onWrite((snap, context) => {
        try {
            // Get an object with the current document value.
            // If the document does not exist, it has been deleted.
            // const document = change.after.exists ? change.after.data() : null;

            // Get an object with the previous document value (for update or delete)
            // const oldDocument = change.before.data();
            
            const postId = context.params.id.slice(8);
            console.log("Updating likes for the post: " + postId)
            
            const postRef = admin.firestore().collection('posts').doc(postId)
            const likeRef = admin.firestore().collection('sec_evt_like_post').doc(context.params.id)
            
            let new_count = likeRef.get().data().users.length
            console.log("New count of like is :" + new_count)

            return postRef.update({
                likes: [new_count]
            })

        } catch (err) {
            console.log('Error getting documents', err)
        }
    });

exports.new_post_house_keeping = fn.firestore
    .document('posts/{id}')
    .onCreate((snap, context) => {
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

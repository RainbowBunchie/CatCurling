// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
apiKey: "AIzaSyB4GLvhJf7dk5OjzvILZ4NdwTRFeT9lXDQ",
authDomain: "catcurling-f7ad1.firebaseapp.com",
databaseURL: "https://catcurling-f7ad1.firebaseio.com",
projectId: "catcurling-f7ad1",
storageBucket: "catcurling-f7ad1.appspot.com",
messagingSenderId: "611740374024"
};
firebase.initializeApp(config);
firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

//Get element in highscore page
const highscore = document.getElementById('highscore-list')

//Reference
const database = firebase.database()
const ref = database.ref('highscore')
ref.on('value', gotData, errData)

function gotData(data){
	console.log(data.val())
}

function errData(err){
	console.log("Err: ")
	console.log(err)
}



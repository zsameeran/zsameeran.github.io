// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCVv-S_UPaeQXdZszo5SglASxEAtwThk7g",
  authDomain: "skillbuddy-7273b.firebaseapp.com",
  databaseURL: "https://skillbuddy-7273b.firebaseio.com",
  projectId: "skillbuddy-7273b",
  storageBucket: "skillbuddy-7273b.appspot.com",
  messagingSenderId: "591655891854",
  appId: "1:591655891854:web:5d441b5cb4a901ace92adf",
  measurementId: "G-LLMM5PTLS3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


//function for simple email and password login
function login() {
  var email_field = document.getElementById("email_input").value;
  var pass_field = document.getElementById("password_input").value;
  firebase.auth().signInWithEmailAndPassword(email_field, pass_field).then(function () {

    var user = firebase.auth().currentUser;
    if (user) {
      alert("user is signed in");
      alert(user.displayName);
    }
    else {
    
      alert("user is NOT signed in");
    }
    


  })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      alert(errorMessage);
      
    });
};


//function for google sign in
function googleSignin() {

  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // we can take user info. from here "user"


  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    alert(email);
    // ...
  });
}


function getusercred(guser) {
  alert(guser.displayName);

};




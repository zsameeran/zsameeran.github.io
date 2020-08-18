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
// checks the changed state of the account 


firebase.auth().onAuthStateChanged(function (user) {
  if (user) {

    showAlert("user already signed in sign out first and then Sign-up", true, false);
    // User is signed in.

    if (user.displayName == null) {
      document.getElementById("user-or-login").style.display = "block";
    }
    else {

      document.getElementById("user-or-login").style.display = "block";
      document.getElementById("user-or-login").innerHTML = user.displayName;
    }


    if (user.photoURL == null) {
      //check for gender and then
      if (gender == "female") {
        document.getElementById("avatar-image").src = "images/avatarFemale.png";

      }
      else {
        document.getElementById("avatar-image").src = "images/avatarMale.png";
      }

    }
    else {
      document.getElementById("avatar-image").src = user.photoURL;
    }

  } else {
    document.getElementById("user-or-login").style.display = "none";
    // No user is signed in.
  }
});



///////////////////////////////////////////////////////////////////////////
/* SIgn up function*/

function sign_up() {
 
  var signup_spinner = document.getElementById("Signup-id");
  signup_spinner.className += "spinner-border spinner-border-sm" ;
  
  var email = document.getElementById("email_field");
  var pass = document.getElementById("password_field");
  var re_enter = document.getElementById("reenter_field");

  //checks whether the password matches and then creates account
  if (pass.value == re_enter.value) {

    firebase.auth().createUserWithEmailAndPassword(email.value, pass.value).then(function (result) {
      // showAlert("User Account created successfully", true , false);

      var user = firebase.auth().currentUser;

      user.sendEmailVerification().then(function () {
        // Email sent.
        
        signup_spinner.classList.remove("spinner-border");
        $("#exampleModalLong").modal()
        

      }).catch(function (error) {
        // An error happened.
        alert(error);
      });

    }).catch(function (error) {
      // Handle Errors here.
      
      signup_spinner.classList.remove("spinner-border");
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);

      // ...
    });

  }
  else {
    var signup_spinner = document.getElementById("Signup-id");
    signup_spinner.classList.remove("spinner-border");
   // showAlert("Password doesnt match", true)
    alert("password doesnt match")
  }

}







///////////////////////////////////////////////////////////////////
//email confirmation function
function confirm() {
  window.location.href = "fill_profile.html";
}
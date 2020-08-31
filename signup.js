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
var stackCounter = 0;


firebase.auth().onAuthStateChanged(function (user) {
  if (user) {

    
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
    showAlert("user already signed in. Sign out first and then Sign-up", "orange");
  } else {
    document.getElementById("user-or-login").style.display = "none";
    // No user is signed in.
  }
});



///////////////////////////////////////////////////////////////////////////
/* SIgn up function*/

function sign_up() {

  var signup_spinner = document.getElementById("Signup-id");
  signup_spinner.className += "spinner-border spinner-border-sm";
  
  var email = document.getElementById("email_field");
  var pass = document.getElementById("password_field");
  var re_enter = document.getElementById("reenter_field");
  var userPassword = btoa(pass.value);

  //checks whether the password matches and then creates account
  if (pass.value == re_enter.value) {

    firebase.auth().createUserWithEmailAndPassword(email.value, pass.value).then(function (result) {
      // showAlert("User Account created successfully", true , false);

      var user = firebase.auth().currentUser;

      user.sendEmailVerification().then(function () {
        // Email sent.
        sessionStorage.setItem('user_emailAddress', email.value);
        sessionStorage.setItem('user_pass', userPassword);
        signup_spinner.classList.remove("spinner-border");
        signup_spinner.classList.remove("spinner-border-sm");
        showToast("WE HAVE SENT YOU A VERIFICATION EMAIL.PLEASE VERIFY YOUR EMAIL", null);
       
      }).catch(function (error) {
        // An error happened.
        showAlert(error.message , "red");
      });

    }).catch(function (error) {
      // Handle Errors here.

      signup_spinner.classList.remove("spinner-border");
      signup_spinner.classList.remove("spinner-border-sm");
      var errorCode = error.code;
      var errorMessage = error.message;
      showAlert(errorMessage ,"red");

      // ...
    });

  }
  else {
    var signup_spinner = document.getElementById("Signup-id");
    signup_spinner.classList.remove("spinner-border");
    signup_spinner.classList.remove("spinner-border-sm");
   
    showAlert("password doesnt match","orange");
  }

}









//////////////////////////////////////////////////////////////////////
//toast function

function showToast(message, link) {


  if (stackCounter == 0) {
    var x = document.getElementById("snackbar");
    x.innerHTML = message;
    if (link == null) {
      document.getElementById("snackbar-link").href = "javascript: void(0)";
      x.className = "show";
      stackCounter = 1;
    }
    else {
      document.getElementById("snackbar-link").href = link;
      x.className = "show";
      stackCounter = 1;
    }
    // Add the "show" class to DIV
    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); stackCounter = 0; window.location.href = "fill_profile.html"; }, 5000);
  }
  else if (stackCounter == 1) {
    var y = document.getElementById("snackbar1");

    y.innerHTML = message;
    if (link == null) {
      document.getElementById("snackbar-link1").href = "javascript: void(0)";
      y.className = "show";
      stackCounter = 2;
    }
    else {
      document.getElementById("snackbar-link1").href = link;
      y.className = "show";
      stackCounter = 2;
    }
    setTimeout(function () { y.className = y.className.replace("show", ""); stackCounter = 0; }, 5000);
  }

}

function showAlert(message , backColor){
  customAlert = document.getElementById("snackbar-alert");
  customAlert.innerHTML = message;
  customAlert.className = "show";

  if(backColor!=null){
  customAlert.style.backgroundColor = backColor;
  }
  setTimeout(function () { customAlert.className = customAlert.className.replace("show", ""); }, 2000);

}

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


var signup_spinner = document.getElementById("verify-id");
// country  code dropdown intialization
var input = document.querySelector("#phone");
var iti = intlTelInput(input);
var appVerifier = window.recaptchaVerifier;
window.onload = function () {
  appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  appVerifier.render();
}

function sendOtp() {

  var countryData = iti.getSelectedCountryData();
  var phone_number = "+" + countryData.dialCode + document.getElementById("phone").value;
  //alert(phone_number);


  firebase.auth().signInWithPhoneNumber(phone_number, appVerifier)
    .then(function (confirmationResult) {

      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      //alert("msg sent");
      document.getElementById("msg-sent-text").style.display = "block";

    }).catch(function (error) {
      // Error; SMS not sent
      alert(error);
      // ...
    });

}

function verify_otp() {
  console.log("in funct");
 // signup_spinner.className += "spinner-border spinner-border-sm";

  var otp = document.getElementById("verification-code").value;
    confirmationResult.confirm(otp).then(function (result) {
      // User signed in successfully.
      console.log("in success");
      console.log(otp);
      alert("registered succesfully");
      replaceAccount();
      
    }).catch(function (error) {
      // User couldn't sign in (bad verification code?)
      // ...
      console.log("in error");
      //signup_spinner.classList.remove("spinner-border");
      alert(error.message);
    });
 
}

function replaceAccount() {
//alert("heyyy");
  var last_email = sessionStorage.getItem('user_emailAddress');
  var last_pass = sessionStorage.getItem('user_pass');

  ///////////////////////////////////////////////////////////////////
  //signout fucnction

 
  var user = firebase.auth().currentUser;


  firebase.auth().signOut().then(function () {
    // Sign-out successful.
    //alert("signout success");
    //var test1="zzzsam13@gmail.com"
    //var test2="zingre"
    
  user.delete().then(function() {
    // User deleted.
  }).catch(function(error) {
    // An error happened.
  });
    var temp_pass = atob(last_pass);
    firebase.auth().signInWithEmailAndPassword(last_email, temp_pass).then(function (result) {
      //alert("sign in success");
      sessionStorage.removeItem('user_pass');
      sessionStorage.setItem('isPhoneVerified' , true);
      //signup_spinner.classList.remove("spinner-border");
      window.location.href = "index.html";

    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
     // signup_spinner.classList.remove("spinner-border");
      alert(errorMessage);

    });
  }).catch(function (error) {
    // An error happened.
    alert(error);
  });

 /* user.delete().then(function () {
    // User deleted.
    // alert("delete success");

   // console.log(last_email);
   // console.log(atob(last_pass));
    
  }).catch(function (error) {
    // An error happened.
    //signup_spinner.classList.remove("spinner-border");
    alert(error);
  });*/
}


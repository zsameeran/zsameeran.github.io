
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



// country  code dropdown intialization
var input = document.querySelector("#phone");
var iti = intlTelInput(input);
var appVerifier = window.recaptchaVerifier;
window.onload = function(){
    appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    appVerifier.render();
}

function sendOtp(){

var countryData = iti.getSelectedCountryData();
var phone_number = "+" + countryData.dialCode + document.getElementById("phone").value;
alert(phone_number);


firebase.auth().signInWithPhoneNumber(phone_number, appVerifier)
    .then(function (confirmationResult) {
        
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
        alert("msg sent");
    }).catch(function (error) {
      // Error; SMS not sent
      alert(error);
      // ...
    });

}

function verify_otp(){
var otp = document.getElementById("verification-code").value;

confirmationResult.confirm(otp).then(function (result) {
    // User signed in successfully.
    var user = result.user;
    // ...
    alert("registered succesfully");
    replaceAccount();
  }).catch(function (error) {
    // User couldn't sign in (bad verification code?)
    // ...
    alert(error.message);
  });
}


function replaceAccount(){

var last_email = sessionStorage.getItem('email');
var last_pass = sessionStorage.getItem('password'); 


}

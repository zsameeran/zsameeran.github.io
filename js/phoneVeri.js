



var last_email;
var last_pass;
var googleUser;
var signup_spinner = document.getElementById("verify-id");
// country  code dropdown intialization
var input = document.querySelector("#phone");
var iti = intlTelInput(input);
var appVerifier = window.recaptchaVerifier;
window.onload = function () {
  appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  appVerifier.render();
}
googleUser = sessionStorage.getItem('isGoogleUser');
console.log(googleUser);
if (googleUser != 'true') {
  last_email = sessionStorage.getItem('user_emailAddress');
  last_pass = atob(sessionStorage.getItem('user_pass'));

  if (last_email == null || last_pass == null) {
    $("#loginModal").modal('show');
  }

}
else {


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
      document.getElementById("sent-text").style.display = "block";
      document.getElementById("verify").style.backgroundColor = "#cf6add";
    }).catch(function (error) {
      // Error; SMS not sent
      alert(error);
      // ...
    });

}

function verify_otp() {

  // signup_spinner.className += "spinner-border spinner-border-sm";
  var signup_spinner = document.getElementById("verify-id");
  signup_spinner.className += " spinner-border spinner-border-sm";
  var otp = document.getElementById("verification-code").value;
  if (otp != "") {
    confirmationResult.confirm(otp).then(function (result) {

      //alert("registered succesfully");
      replaceAccount();

    }).catch(function (error) {
      // User couldn't sign in (bad verification code?)
      // ...

      //signup_spinner.classList.remove("spinner-border");
      alert(error.message);
    });
  }
  else {
    alert("enter otp");
    signup_spinner.classList.remove("spinner-border");
    signup_spinner.classList.remove("spinner-border-sm");
  }
}



function replaceAccount() {
  //alert("heyyy");


  ///////////////////////////////////////////////////////////////////
  //signout fucnction

  var user = firebase.auth().currentUser;

  firebase.auth().signOut().then(function () {
    // Sign-out successful.

    user.delete().then(function () {
      // User deleted.
      // alert("delete success");
      if (googleUser != 'true') {
        firebase.auth().signInWithEmailAndPassword(last_email, last_pass).then(function (result) {
          //alert("sign in success");
          
          //signup_spinner.classList.remove("spinner-border");
          signup_spinner.classList.remove("spinner-border");
          signup_spinner.classList.remove("spinner-border-sm");
          window.location.href = "index.html";
        }).catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ..
          signup_spinner.classList.remove("spinner-border");
          signup_spinner.classList.remove("spinner-border-sm");
          // signup_spinner.classList.remove("spinner-border");
          alert(errorCode);
          console.log(errorCode);
        });

      }
      else {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;

         
          window.location.href = "index.html";

        }).catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          signup_spinner.classList.remove("spinner-border");
          signup_spinner.classList.remove("spinner-border-sm");
          alert("PLEASE LOGIN AGAIN TO VERIFY");
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
      }
      // console.log(last_email);
      // console.log(atob(last_pass));

    }).catch(function (error) {
      // An error happened.
      //signup_spinner.classList.remove("spinner-border");
      signup_spinner.classList.remove("spinner-border");
      signup_spinner.classList.remove("spinner-border-sm");
      alert(error);
    });


  }).catch(function (error) {
    // An error happened.
    signup_spinner.classList.remove("spinner-border");
    signup_spinner.classList.remove("spinner-border-sm");
    alert(error);
  });

}




function login() {
  var email_field = document.getElementById("email_input").value;
  var pass_field = document.getElementById("password_input").value;

  firebase.auth().signInWithEmailAndPassword(email_field, pass_field).then(function (result) {
    var userPassword = btoa(pass_field);
    sessionStorage.setItem('user_emailAddress', email_field);
    sessionStorage.setItem('user_pass', userPassword);
    alert("LOGIN SUCCESSFULL. YOU MAY VERIFY YOUR PHONE NUMBER NOW.");
    $("#loginModal").modal('hide');

  })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      alert(errorMessage);
    });
}
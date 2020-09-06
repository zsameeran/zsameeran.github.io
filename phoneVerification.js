




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
      document.getElementById("sent-text").style.display = "block";
      document.getElementById("verify").style.backgroundColor="#cf6add";
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
  if(otp!=""){
  confirmationResult.confirm(otp).then(function (result) {
  
    //alert("registered succesfully");
    replaceAccount();

  }).catch(function (error) {
    // User couldn't sign in (bad verification code?)
    // ...
    console.log("in error");
    //signup_spinner.classList.remove("spinner-border");
    alert(error.message);
  });
  }
  else{
    alert("enter otp");
    signup_spinner.classList.remove("spinner-border");
    signup_spinner.classList.remove("spinner-border-sm");
  }
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

    user.delete().then(function () {
      // User deleted.
      // alert("delete success");

       firebase.auth().signInWithEmailAndPassword(last_email, atob(last_pass)).then(function (result) {
        //alert("sign in success");
        sessionStorage.removeItem('user_pass');
        //signup_spinner.classList.remove("spinner-border");
        signup_spinner.classList.remove("spinner-border");
        signup_spinner.classList.remove("spinner-border-sm");
        window.location.href = "index.html";
  
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        signup_spinner.classList.remove("spinner-border");
        signup_spinner.classList.remove("spinner-border-sm");
        // signup_spinner.classList.remove("spinner-border");
        alert(errorMessage);
        
  
      });
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


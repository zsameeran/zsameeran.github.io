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
var storage = firebase.storage();
var Database = firebase.database();

var emailVerified;
var userID;
var User;
var user_gender;
var user_ProfileImage;
var user_firstName;
var user_lastName;
var user_phoneNumber;
var user_employmentStatus;
var user_linkedin;
var user_educational;
var userDataItem = {};
var user_data = {};
var stackCounter = 0;


//var test = sameeran;
// checks the changed state of the account 
firebase.auth().onAuthStateChanged(function (user) {

  if (user) {



    userID = firebase.auth().currentUser.uid;
    emailVerified = user.emailVerified;
    User = user;

    if (sessionStorage.getItem('localUserInfo') == null) {
      //CHECKS FOR GOOGLE SIGN IN

      if (user.displayName == undefined) {
        get_logind_user_data(userID);
      }
      else {

        show_login(user);
        set_userprofileImage();
      }
    }

    else {
      console.log("in else");
      user_data = sessionStorage.getItem('localUserInfo');
      user_data = JSON.parse(user_data);

      show_login(user);
      set_userprofileImage();
    }

    document.getElementById("reg-prof").innerHTML = "My Profile";
    document.getElementById("reg-prof").setAttribute("href", "userProfile.html")
    // email verification CHECKPOINT
    if (emailVerified == false) {

      // Get the snackbar DIV
      showToast("EMAIL NOT VERIFIED PLEASE VERIFY", null);
      //showAlert("Your Email or Phone Number is not verified.Click the link to Verify", true, true);
    }
    else {
      // showAlert("", false, false);

    }
  }
  else {
    document.getElementById("login-image").style.display = "none";
    // No user is signed in.
  }
});



///////////////////////////////////////////////////////////////////////////////////////
// FOR LOGIN PAGE

function login() {
  var email_field = document.getElementById("email_input").value;
  var pass_field = document.getElementById("password_input").value;
  console.log(pass_field);
  var remember_check = document.getElementById("check_box");
  if (remember_check.checked == false) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(function () {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        //alert("persistance oned");
        // New sign-in will be persisted with session persistence.       
      })
      .catch(function (error) {
        // Handle Errors here.

        var errorCode = error.code;
        var errorMessage = error.message;
        // alert(errorMessage+"peraistace vala");
      });
  }
  firebase.auth().signInWithEmailAndPassword(email_field, pass_field).then(function (result) {

    window.location.href = "index.html";

  })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      alert(errorMessage);

    });
}



function google_sign() {

  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).then(function (result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;

    // showAlert("Sign-In Successfull", true, false);
    window.location.href = "fill_profile.html";

  }).catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

}



///////////////////////////////////////////////////////////////////
//signout fucnction
function sign_out() {

  firebase.auth().signOut().then(function () {
    // Sign-out successful.
    sessionStorage.clear();
    window.location.href = "index.html"

  }).catch(function (error) {
    // An error happened.
    alert(error);
  });
}


// country  code dropdown intialization
var input = document.querySelector("#phone");
var iti = intlTelInput(input);



/////////////////////////////////////////////////////////////////
//profile form function
function get_info() {
  var signup_spinner = document.getElementById("submit-id");
  signup_spinner.className += "spinner-border spinner-border-sm";

  var countryData = iti.getSelectedCountryData();
  var first_name = document.getElementById("f_name").value.trim();
  var last_name = document.getElementById("l_name").value.trim();
  var dob_day = document.getElementById("day").value;
  var dob_month = document.getElementById("month").value;
  if (dob_day == "" || dob_month == "") {
    alert("enter date properly");
    signup_spinner.classList.remove("spinner-border");
    return;
  }
  var dob_year = document.getElementById("year").value;
  var user_dob = get_dob(dob_day, dob_month, dob_year);
  var phone_number = "+" + countryData.dialCode + document.getElementById("phone").value;
  var user_linkedin = document.getElementById("link_input").value.trim();
  var user_educational = document.getElementById("edu_detail_drop").value;
  var user_field_major = document.getElementById("field_input").value.trim();
  var user_employment_status = document.getElementById("employment_input").value;

  if (first_name != null && last_name != null && phone_number != null && user_linkedin != null
    && user_educational != "nothing" && user_employment_status != "nothing" && user_field_major != null && user_gender != undefined) {
    //update these info to firebase
    upload_info(first_name, last_name, phone_number, user_linkedin, user_educational
      , user_field_major, user_employment_status, user_dob, signup_spinner);
  }
  else {
    signup_spinner.classList.remove("spinner-border");
    alert("enter all fields");
  }

}



function get_dob(dob_day, dob_month, dob_year) {



  return dob_day + "/" + dob_month + "/" + dob_year;

}


var file = {}
function chooseFile(e) {

  file = e.target.files[0];

}

function upload_info(first_name, last_name, phone_number, user_linkedin, user_educational
  , user_field_major, user_employment_status, user_dob, signup_spinner) {

  var Database = firebase.database();
  var database = Database.ref().child("User");
  userID = firebase.auth().currentUser.uid;
  var userRef = database.child(userID);
  userDataItem = {
    "firstName": first_name,
    "lastName": last_name,
    "Gender": user_gender,
    "phoneNumber": phone_number,
    "linkedin": user_linkedin,
    "educational": user_educational,
    "fieldMajor": user_field_major,
    "employmentStatus": user_employment_status,
    "dob": user_dob,
  };

  storage.ref('user/' + userID + '/profile').put(file).then(function () {
    //alert("image uploaded");

    userRef.set(userDataItem, function (error) {
      if (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        // alert(errorMessage);
      }
      else {
        // showAlert("Profile Added successfully!", true, false);
        sessionStorage.setItem('localUserInfo', JSON.stringify(userDataItem));

        signup_spinner.classList.remove("spinner-border");


        window.location.href = "phoneVerification.html";

      }

    })

    //showAlert("image uploaded", true, false);
  }).catch(error => {

    alert(error.message);

  })

}



function showAlert(alertText, doshow, dolink) {
  if (doshow && dolink) {
    document.getElementById("alert").style.display = "block";
    document.getElementById("alert-text").innerHTML = alertText;
    document.getElementById("alert-link").style.display = "inline-block";
  }
  else if (doshow && !dolink) {
    document.getElementById("alert").style.display = "block";
    document.getElementById("alert-link").style.display = "none";
    document.getElementById("alert-text").innerHTML = alertText;
  }
  else if (!doshow && !dolink) {
    document.getElementById("alert").style.display = "none";
  }
}
function getGender(gvalue) {
  user_gender = gvalue;
};


function get_logind_user_data(userID) {
  //user's DISPLAYING FIRSTNAME CHECKPOINT 1
  Database.ref('User/' + userID).once('value').then(function (snapshot) {
    if (snapshot.exists()) {
      Database.ref('User/' + userID).once('value').then(function (snapshot) {
        userDataItem["firstName"] = snapshot.val().firstName;
        userDataItem["gender"] = snapshot.val().Gender;
        userDataItem["lastName"] = snapshot.val().lastName;
        userDataItem["phoneNumber"] = snapshot.val().phoneNumber;
        userDataItem["educational"] = snapshot.val().educational;
        userDataItem["employmentStatus"] = snapshot.val().employmentStatus;
        userDataItem["fieldMajor"] = snapshot.val().fieldMajor;
        userDataItem["linkedin"] = snapshot.val().linkedin;


        sessionStorage.setItem('localUserInfo', JSON.stringify(userDataItem));

        firebase.storage().ref('user/' + userID + '/profile').getDownloadURL().then(imgUrl => {

          userDataItem["profileImage"] = imgUrl;

          sessionStorage.setItem('localUserInfo', JSON.stringify(userDataItem));
          show_login(User);
          set_userprofileImage();
          //console.log(user_data);

        }).catch(function (error) {
          // Handle Errors here.
          show_login(User);
          set_userprofileImage();
          var errorCode = error.code;
          var errorMessage = error.message;

        });
      });
    }

    else {

      show_login(User);
      set_userprofileImage();
    }
  });
}


function show_login(User) {

  //DISPLAYING NAMES OF USER AND OTHER STUFFS
  document.getElementById("home-login").style.display = "none";
  document.getElementById("user-drop").style.display = "block";

  if (User.displayName == null) {
    if (user_data['firstName'] != undefined) {
      document.getElementById("user-drop-name").innerHTML = user_data.firstName;
    }
    else {
      showToast("PLEASE FILL YOUR PROFILE.CLICK HERE TO FILL", "fill_profile.html")
    }
  }
  else {
    document.getElementById("user-drop-name").innerHTML = User.displayName;
  }
}




function set_userprofileImage() {
  console.log(user_data);
  //DIsplaying user profile iMAGE IF EXISTS OR AVATAR ACCORDING TO GENDER
  if (User.photoURL == null) {

    if (user_data['profileImage'] == undefined) {
      if (user_gender == "female") {
        document.getElementById("login-image").src = "images/avtar_female.png";
      }

      else {
        document.getElementById("login-image").src = "images/avtar_male.png";
      }
    }
    else {

      document.getElementById("login-image").src = user_data.profileImage;
    }
  }
  else {

    document.getElementById("login-image").src = User.photoURL;
  }

  if (user_gender == "female") {
    document.getElementById("reg-prof-image").src = "images/avtar_female.png";
  }

  else {
    document.getElementById("reg-prof-image").src = "images/avtar_male.png";
  }

}


function password_reset() {

  var emailAddress = document.getElementById("email_input").value;
  alert(emailAddress);
  if (emailAddress != "") {
    var auth = firebase.auth();

    auth.sendPasswordResetEmail(emailAddress).then(function () {
      // Email sent.
      $(".modal").modal('show');
    }).catch(function (error) {
      // An error happened.
      alert(error.Message);
    });
  }
  else {
    alert("Enter Email address");
  }

}



function showToast(message, link) {
  var x = document.getElementById("snackbar");
  console.log("1");
  if (stackCounter == 0) {
    console.log("2");
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
    setTimeout(function () { x.className = x.className.replace("show", ""); stackCounter = 0; }, 10000);
  }
  else if (stackCounter == 1) {
    console.log("3");
    x.innerHTML = message;
    if (link == null) {
      document.getElementById("snackbar-link").href = "javascript: void(0)";
      x.className = "show";
      x.style.bottom = "60px";
      stackCounter = 2;
    }
    else {
      document.getElementById("snackbar-link").href = link;
      x.className = "show";
      x.style.bottom  = "80px";

      stackCounter = 2;
    }
    setTimeout(function () { x.className = x.className.replace("show", ""); stackCounter = 0; }, 10000);
  }

}


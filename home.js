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
var user_data;


var test = sameeran;
// checks the changed state of the account 
firebase.auth().onAuthStateChanged(function (user) {

  if (user) {
    
    
    userID = firebase.auth().currentUser.uid;
    emailVerified = user.emailVerified;
    User = user;
    sessionStorage.setItem('user_emailAddress',user.email);
    if(sessionStorage.getItem('localUserInfo') == null){
      //CHECKS FOR GOOGLE SIGN IN
    if (user.displayName == undefined) {
     get_logind_user_data(userID);
    }
    else {
      show_login(user);
      set_userprofileImage();
    }
    }

    else{
      
      user_data = sessionStorage.getItem('localUserInfo');      
      user_data = JSON.parse(user_data);
      console.log(user_data);
      console.log(user_data.user_firstName);
      show_login(user);
      set_userprofileImage();
    }
    

    document.getElementById("reg-prof").innerHTML = "My Profile";




    // email verification CHECKPOINT
    if (emailVerified == false) {
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
    window.location.href = "index.html";

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

  var countryData = iti.getSelectedCountryData();
  var first_name = document.getElementById("f_name").value.trim();
  var last_name = document.getElementById("l_name").value.trim();
  var dob_day = document.getElementById("day").value;
  var dob_month = document.getElementById("month").value;
  if (dob_day == "" || dob_month == "") {
    alert("enter date properly");
    return;
  }
  var dob_year = document.getElementById("year").value;
  var user_age = get_age(dob_day, dob_month, dob_year);
  var phone_number = "+" + countryData.dialCode + document.getElementById("phone").value;
  var user_linkedin = document.getElementById("link_input").value.trim();
  var user_educational = document.getElementById("edu_detail_drop").value;
  var user_field_major = document.getElementById("field_input").value.trim();
  var user_employment_status = document.getElementById("employment_input").value;
  
  if (first_name != null && last_name != null && phone_number != null && user_linkedin != null
    && user_educational != "nothing" && user_employment_status != "nothing" && user_field_major != null && user_gender != undefined) {
    //update these info to firebase
    upload_info(first_name, last_name, phone_number, user_linkedin, user_educational
      , user_field_major, user_employment_status);
  }
  else {
    alert("enter all fields");
  }

}



function get_age(dob_day, dob_month, dob_year) {

  var date = new Date();
  var current_day = date.getDate();
  var current_month = date.getMonth() + 1;
  var current_year = date.getFullYear();

  var user_age_year = Math.abs(current_year - dob_year);
  var user_age_month = Math.abs(current_month - dob_month);
  var user_age_day = Math.abs(current_day - dob_day);

  return user_age_day + "/" + user_age_month + "/" + user_age_year;

}


var file = {}
function chooseFile(e) {

  file = e.target.files[0];

}

function upload_info(first_name, last_name, phone_number, user_linkedin, user_educational
  , user_field_major, user_employment_status) {
  var Database = firebase.database();
  var database = Database.ref().child("User");
  userID = firebase.auth().currentUser.uid;
  var userRef = database.child(userID);
  var userData = {
    "firstName": first_name,
    "lastName": last_name,
    "Gender": user_gender,
    "phoneNumber": phone_number,
    "linkedin": user_linkedin,
    "educational": user_educational,
    "fieldMajor": user_field_major,
    "employmentStatus": user_employment_status,
  };

  storage.ref('user/' + userID + '/profile').put(file).then(function () {
    alert("image uploaded");

    userRef.set(userData, function (error) {
      if (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
      }
      else {
        // showAlert("Profile Added successfully!", true, false);
        window.location.href = "index.html";
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
        userDataItem["user_firstName"] = snapshot.val().firstName;
        userDataItem["user_gender"] = snapshot.val().Gender;
        userDataItem["user_lastName"] = snapshot.val().lastName;
        userDataItem["user_phoneNumber"] = snapshot.val().phoneNumber;
        userDataItem["user_educational"] = snapshot.val().educational;
        userDataItem["user_employmentStatus"] = snapshot.val().employmentStatus;
        userDataItem["user_fieldMajor"] = snapshot.val().fieldMajor;
        userDataItem["user_linkedin"] = snapshot.val().linkedin;
       
        sessionStorage.setItem('localUserInfo',JSON.stringify(userDataItem));

        firebase.storage().ref('user/' + userID + '/profile').getDownloadURL().then(imgUrl => {
          
          userDataItem["user_profileImage"] = imgUrl;
         
          sessionStorage.setItem('localUserInfo',JSON.stringify(userDataItem));
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
    if (user_data.user_firstName != undefined) {
      document.getElementById("user-drop-name").innerHTML = user_data.user_firstName;
    }
  }
  else {
    document.getElementById("user-drop-name").innerHTML = User.displayName;
  }
}




function set_userprofileImage() {

  //DIsplaying user profile iMAGE IF EXISTS OR AVATAR ACCORDING TO GENDER
  if (User.photoURL == null) {

    if (user_data.user_profileImage == null) {
      if (user_gender == "female") {
        document.getElementById("login-image").src = "images/avtar_female.png";
      }

      else {
        document.getElementById("login-image").src = "images/avtar_male.png";
      }
    }
    else {

      document.getElementById("login-image").src = user_data.user_profileImage;
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





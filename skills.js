
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
var Storage = firebase.storage();
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
var skill_category;
var wtmentorInfo = {};
var templateRequestQuery = ["", ""];
var userMentorAllotmentInfo = {};
var templateData = {
  "skill_title": "", "skill_about": "", "skill_summary": "", "skill_applications": "", "skill_mentorwork": ""
}

const param = new URLSearchParams(window.location.search);
var i = 0;
for (const [key, value] of param) {
  templateRequestQuery[i] = param.get(key);
  i++;
}



// checks the changed state of the account 
firebase.auth().onAuthStateChanged(function (user) {

  if (user) {

    userID = firebase.auth().currentUser.uid;
    emailVerified = user.emailVerified;
    User = user;


    //CHECKS FOR GOOGLE SIGN IN
    if (user.displayName == undefined) {

      get_logind_user_data(userID);
    }
    else {
      show_login(user);
      set_userprofileImage();
    }

    document.getElementById("reg-prof").innerHTML = "My Profile";
    // email verification CHECKPOINT
    if (emailVerified == false) {
      showToast("EMAIL NOT VERIFIED YET, PLEASE VERIFY", null);
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

if (templateRequestQuery[0] != "") {
  document.getElementById("containerss").style.display = "block";
  document.getElementById("overlay").style.display = "block";

  templateDataRequest(templateRequestQuery[0], templateRequestQuery[1]);
}



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
        userDataItem["dateOfBirth"] = snapshot.val().dob;
        userDataItem["email"] = User.email;

        firebase.storage().ref('user/' + userID + '/profile').getDownloadURL().then(imgUrl => {
          userDataItem["profileImage"] = imgUrl;

          show_login(User);
          set_userprofileImage();

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
    if (userDataItem['firstName'] != undefined) {
      document.getElementById("user-drop-name").innerHTML = userDataItem.firstName;
    }
  }
  else {
    document.getElementById("user-drop-name").innerHTML = User.displayName;
  }
}

function set_userprofileImage() {

  //DIsplaying user profile iMAGE IF EXISTS OR AVATAR ACCORDING TO GENDER
  if (User.photoURL == null) {

    if (userDataItem['profileImage'] == undefined) {
      if (user_gender == "female") {
        document.getElementById("login-image").src = "images/avtar_female.png";
      }

      else {
        document.getElementById("login-image").src = "images/avtar_male.png";
      }
    }
    else {

      document.getElementById("login-image").src = userDataItem['profileImage'];
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


function card_click(id) {
  var skill_request = id.split("_");

  window.location.href = "tempelate.html" + "?aadi=" + skill_request[0] + "&anta=" + skill_request[1];

}




function templateDataRequest(skillCategory, skillName) {

  Database.ref('skill_templateData/' + skillCategory + "/" + skillName).once('value').then(function (snapshot) {
    if (snapshot.exists()) {
      templateData.skill_title = snapshot.val().templateTitle;
      templateData.skill_about = snapshot.val().templateAbout;
      templateData.skill_summary = snapshot.val().templateSummary;
      templateData.skill_applications = snapshot.val().templateApplications;
      templateData.skill_mentorwork = snapshot.val().templateMentorwork;
      templateData.skill_applications = templateData.skill_applications.split(',');
      console.log(templateData.skill_title + templateData.skill_about + " " + templateData.skill_summary + templateData.skill_applications + templateData.skill_mentorwork);
      showTemplateData(templateData.skill_title, templateData.skill_about, templateData.skill_summary, templateData.skill_applications, templateData.skill_mentorwork);
    }
    else {
      alert("skill not found");
    }
  })
}


function showTemplateData(skill_title, skill_about, skill_summary, skill_applications, skill_mentorwork) {

  document.getElementById("skill-title").innerHTML = skill_title;
  document.getElementById("skill-discription").innerHTML = skill_about;
  document.getElementById("summary-text").innerHTML = skill_summary;
  document.getElementById("mentor-work").innerHTML = skill_mentorwork;
  var ul = document.getElementById("application-text-list");
  for (var i = 0; i < skill_applications.length; i++) {
    listItem = document.createElement('li');
    listItem.innerHTML = skill_applications[i];
    ul.appendChild(listItem);

  }
  document.getElementById("containerss").style.display = "none";
  document.getElementById("overlay").style.display = "none";

}


function getinfo() {

  //console.log(document.getElementById("target-text").value);

  if (document.getElementById("prior-text").value != "" && document.getElementById("target-text").value != "") {

    userMentorAllotmentInfo["userPrefLang"] = document.getElementById("lang-select").value;
    userMentorAllotmentInfo["userCommMedium"] = document.getElementById("com-medium").value;
    userMentorAllotmentInfo["userPriorExperience"] = document.getElementById("prior-text").value;
    userMentorAllotmentInfo["userTarget"] = document.getElementById("target-text").value;
    console.log(userMentorAllotmentInfo.userPrefLang);
    $("#infoModal").modal('hide');
    $("#confirmationModal").modal('show');
  }
  else {
    ShowAlert("enter all fields");
  }

}


function sendEmail() {

  Email.send({
    Host: "smtp.gmail.com",
    Username: "skillbuddy13",
    Password: "dronacharya",
    To: 'zzzsam13@gmail.com',
    From: "skillbuddy13@gmail.com",
    Subject: "MENTOR REQUEST (URGENT)",
    Body: "Mentor Request From " + userDataItem.firstName + " For Skill " + templateRequestQuery[1] + " Please contact the user with " + User.email + " S/he prefers " + userMentorAllotmentInfo.userPrefLang + " as language of communication. and " + userMentorAllotmentInfo.userCommMedium + " as acommunication medium.User have " + userMentorAllotmentInfo.userPriorExperience + " as prior Experience. and he have a target as " + userMentorAllotmentInfo.userTarget,
  }).then(
    message => alert(message),
    $("#confirmationModal").modal('hide'),
    $("#successModal").modal('show'),
  );



}

function askForMentor() {

  var user = firebase.auth().currentUser;
  console.log(user);
  if (user) {
    // User is signed in.
    if (userDataItem.firstName == undefined) {
      showToast("YOU HAVE NOT FILLED YOUR PROFILE. PLEASE FILL IT BEFORE ASKING FOR A MENTOR (CLICK HERE TO FILL) ", "fill_profile.html");
      window.location.href = "fill_profile.html";

    }
    else {
      
      if (emailVerified == false) {
        
        showAlert("EMAIL NOT VERIFIED. PLEASE VERIFY IT AND THEN CONTINUE", "red");
      }
      else {
        $("#infoModal").modal('show');
      }
    }

  }
  else {
    
    $("#loginModal").modal('show');

    // No user is signed in.
  }
}


function mentorAlloted() {
  window.location.href = "index.html";
}


///////////////////////////////////////////////////////////////////////////////////////
// FOR LOGIN PAGE

function login() {
  var email_field = document.getElementById("email_input").value;
  var pass_field = document.getElementById("password_input").value;

  firebase.auth().signInWithEmailAndPassword(email_field, pass_field).then(function (result) {
    window.location.href = "courses.html";
  })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...

      showAlert(errorMessage, "red");

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
    window.location.href = "courses.html";

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


function bMentor() {
  $('#beAMentorModal').modal('show');
}


function bMentorSure() {

  wtmentorInfo['name'] = document.getElementById("wtmentorName").value;
  wtmentorInfo['contact'] = document.getElementById("wtmentorContact").value;
  wtmentorInfo['email'] = document.getElementById("wtmentorEmail").value;
  wtmentorInfo['linkedin'] = document.getElementById("wtmentorLinkedin").value;
  wtmentorInfo['education'] = document.getElementById("wtmentorEducation").value;
  wtmentorInfo['skill'] = document.getElementById("wtmentorSkill").value;

  if (wtmentorInfo.name != "" && wtmentorInfo.contact != "" &&
    wtmentorInfo.email != "" && wtmentorInfo.skill != "") {

    $('#beAMentorModal').modal('hide');
    $('#bMentorConfirmation').modal('show');
  }
  else {
    showAlert("ENTER ALL FIELDS" , "red");
  }

}

function confirmMentor() {
  $('#bMentorConfirmation').modal('hide');
  
  document.getElementById("containerss").style.display = "block";
  document.getElementById("overlay").style.display = "block";
  Email.send({
    Host: "smtp.gmail.com",
    Username: "skillbuddy13",
    Password: "dronacharya",
    To: 'zzzsam13@gmail.com',
    From: "skillbuddy13@gmail.com",
    Subject: "SOMEONE WANTS TO BE A MENTOR",
    Body: " Requested From " + wtmentorInfo.name + " For Skill " + templateRequestQuery[1] + " Please contact the user with " + wtmentorInfo.email + " his contact no. is " + wtmentorInfo.contact + " and linkedin " + wtmentorInfo.linkedin + " his highest degree in education is " + wtmentorInfo.education + " He describe himself as: " + wtmentorInfo.skill + "please contact him/her",
  }).then(
    setTimeout(function showSuccessModal() {
      document.getElementById("containerss").style.display = "none",
        document.getElementById("overlay").style.display = "none",
        $("#mentorsuccessModal").modal('show');
    }, 3000),



  );

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


function showAlert(message, backColor) {
  customAlert = document.getElementById("snackbar-alert");
  customAlert.innerHTML = message;
  customAlert.className = "show";
  if (backColor != null) {
    customAlert.style.backgroundColor = backColor;
  }

  setTimeout(function () { customAlert.className = customAlert.className.replace("show", ""); }, 3000);

}


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
    setTimeout(function () { x.className = x.className.replace("show", ""); stackCounter = 0; }, 10000);
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
    setTimeout(function () { y.className = y.className.replace("show", ""); stackCounter = 0; }, 10000);
  }

}
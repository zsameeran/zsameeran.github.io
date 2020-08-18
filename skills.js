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
var UserData;
var skill_category;


var templateRequestQuery = ["", ""];
var userMentorAllotmentInfo = [];
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
        user_firstName = snapshot.val().firstName;
        user_gender = snapshot.val().Gender;
        user_lastName = snapshot.val().lastName;
        user_phoneNumber = snapshot.val().phoneNumber;
        user_educational = snapshot.val().educational;
        user_employmentStatus = snapshot.val().employmentStatus;
        user_FieldMajor = snapshot.val().fieldMajor;
        user_linkedin = snapshot.val().linkedin;



        firebase.storage().ref('user/' + userID + '/profile').getDownloadURL().then(imgUrl => {
          user_ProfileImage = imgUrl;

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
    if (user_firstName != undefined) {
      document.getElementById("user-drop-name").innerHTML = user_firstName;
    }
  }
  else {
    document.getElementById("user-drop-name").innerHTML = User.displayName;
  }
}

function set_userprofileImage() {

  //DIsplaying user profile iMAGE IF EXISTS OR AVATAR ACCORDING TO GENDER
  if (User.photoURL == null) {

    if (user_ProfileImage == undefined) {
      if (user_gender == "female") {
        document.getElementById("login-image").src = "images/avtar_female.png";
      }

      else {
        document.getElementById("login-image").src = "images/avtar_male.png";
      }
    }
    else {

      document.getElementById("login-image").src = user_ProfileImage;
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
      showTemplateData(templateData.skill_title, templateData.skill_about, templateData.skill_summary, templateData.skill_applications, templateData.skill_mentorwork);
    }
    else {
      alert("Skill doesnt exixts");
    }
  })
}


function showTemplateData(skill_title, skill_about, skill_summary, skill_applications, skill_mentorwork) {

  document.getElementById("skill-title").innerHTML = skill_title;
  document.getElementById("skill-discription").innerHTML = skill_about;
  document.getElementById("skill-summary").innerHTML = skill_summary;
  document.getElementById("mentor-work").innerHTML = skill_mentorwork;
  var ul = document.getElementById("application-unordered-list");
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
  if(document.getElementById("prior-text").value != "" && document.getElementById("target-text").value != ""){
  item = {}
  item["userPrefLang"] = document.getElementById("lang-select").value;
  item["userCommMedium"] = document.getElementById("com-medium").value;
  item["userPriorExperience"] = document.getElementById("prior-text").value;
  item["userTarget"] = document.getElementById("target-text").value;
  userMentorAllotmentInfo.push(item);
  $("#exampleModalCenter"). modal('hide');
  $("#exampleModalLong"). modal('show');
  }
  else{
    alert("enter all fields");
  }

}


function getMentor() {

  Email.send({
    Host: "smtp.gmail.com",
    Username: "skillbuddy13",
    Password: "dronacharya",
    To: 'zzzsam13@gmail.com',
    From: "skillbuddy13@gmail.com",
    Subject: "This is the subject",
    Body: "you have been alloted a mentor"

  }).then(
    message => alert(message)
  );


  $("#successModal"). modal('show');

}

function askForMentor(){

var user = firebase.auth().currentUser;

if (user) {
  // User is signed in.
  $("#exampleModalCenter"). modal('show');
} else {
  $("#myModal"). modal('show');
  // No user is signed in.
}
} 


function mentorAlloted(){
  window.location.href ="index.html";
}
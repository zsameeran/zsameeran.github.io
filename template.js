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
var skillCategory = "computer science";
var skillName = "python";

getTemplateData();

function getTemplateData() {
  console.log("in function");
  console.log(skillCategory);
  Database.ref('skill_templateData/' + skillCategory + "/" + skillName).once('value').then(function (snapshot) {
    console.log(snapshot.exists());
    var skill_title = snapshot.val().templateTitle;
    var skill_about = snapshot.val().templateAbout;
    var skill_summary = snapshot.val().templateSummary;
    var skill_applications = snapshot.val().templateApplications;
    var skill_mentorwork = snapshot.val().templateMentorwork;
    var application_arr = skill_applications.split(',');
    showTemplateData(skill_title, skill_about, skill_summary, skill_applications, skill_mentorwork, application_arr);

  })


}


function showTemplateData(skill_title, skill_about, skill_summary, skill_applications, skill_mentorwork, applicationArray) {

  document.getElementById("skill-title").innerHTML = skill_title;
  document.getElementById("skill-discription").innerHTML = skill_about;
  document.getElementById("skill-summary").innerHTML = skill_summary;

  document.getElementById("mentor-work").innerHTML = skill_mentorwork;
  var ul = document.getElementById("application-unordered-list");
  for (var i = 0; i < applicationArray.length; i++) {
    listItem = document.createElement('li');
    listItem.innerHTML = applicationArray[i];
    ul.appendChild(listItem);

  }

}

function getMentor(){

  Email.send({
    Host : "smtp.gmail.com",
    Username : "skillbuddy13",
    Password : "dronacharya",
    To : 'zzzsam13@gmail.com',
    From : "skillbuddy13@gmail.com",
    Subject : "This is the subject",
    Body : "Welcome to skillbuddy",
    Attachments : [
      {
        name : "smtpjs.png",
        path:"file:///C:/Users/zzzsa/Downloads/Mentor%20mail_temp.png"
      }]

  }).then(
  message => alert(message)
);

}



function connection_test(object){
  console.log(object);
}





















function uploadTemplateData() {

  var skillTitle = "C++ programming";
  var skillAbout = "C++,  a general-purpose programming language is an extension of the C programming language. Modern C++ now has" +
    "object-oriented, generic, and functional features in addition to facilities for low-level memory manipulation.";
  var skillSummary = "C++ is the language that is used everywhere but mainly in systems programming and embedded systems. Here system programming means for" +
    "developing the operating systems or drivers that interface with Hardware. Embedded system means things that are automobiles, robotics," +
    "and appliances. It is having a higher or rich community and developers, which helps in the easy hiring of developers and online solutions easily. ";
  var skillApplications = "Game, Animation, Web, Browser, Database Access, Media Access ,Compilers ,Operating Systems ,Scanning Software, Other Uses: it is used for medical and engineering applications, Computer-aided design systems. These applications are like MRI scans machines, CAM systems that are mainly used in hospitals, local, state and national government, and other departments for construction and mining, etc. applications of C++ is considered as a first preferred language to use among the developer when performance is considered for any developing application. ";
  var skillMentorwork = "Our expert mentors will communicate with you and guide you through the useful resources and help you clear your doubts.";

  var templateData = {
    "templateTitle": skillTitle,
    "templateAbout": skillAbout,
    "templateSummary": skillSummary,
    "templateApplications": skillApplications,
    "templateMentorwork": skillMentorwork,

  };

  Database.ref('skill_templateData/' + skillCategory + "/" + skillName).set(templateData, function (error) {

    if (error) {
      alert(error);
    }
    else {
      alert("data uploaded");
    }


  })

}

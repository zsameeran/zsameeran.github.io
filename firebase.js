
var Database
var storage
(function(){
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

  firebase.initializeApp(firebaseConfig);
   storage = firebase.storage();
   Database = firebase.database();
})();
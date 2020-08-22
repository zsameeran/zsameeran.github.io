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
var Database = firebase.database();
var storage = firebase.storage();
var userDataItem = {};
var userID;
var user_gender;
var User;
firebase.auth().onAuthStateChanged(function (user) {

    if (user) {
        document.getElementById("containerss").style.display = "block";
        document.getElementById("overlay").style.display = "block";
        console.log("in login");
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
        $('userNotLoggedModal').modal('show');
        // No user is signed in.
    }
});




function requestProfileData(userID) {

    Database.ref('User/' + userID).once('value').then(function (snapshot) {
        if (snapshot.exists()) {

            //fetch data ->
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
                    showProfileInfo();

                }).catch(function (error) {
                    showProfileInfo();
                    var errorCode = error.code;
                    var errorMessage = error.message;

                });
            });
        }

        else {
            $('#dataNotFoundModal').modal('show');
            //show_login(User);
            //set_userprofileImage();
        }
    });
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
    console.log(user_data.firstName);
    if (User.displayName == null) {
        if (user_data['firstName'] != undefined) {
            document.getElementById("user-drop-name").innerHTML = user_data.firstName;
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


    requestProfileData(userID);

}
/////////////////////////////////////////////////////////////////////////
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



/////////////////////////////////////////////////////////////////////////////////
//FUNCTION THAT DISPLAYS INFO ON PAGE
function showProfileInfo() {
    document.getElementById("userImage").src = userDataItem.profileImage;
    document.getElementById("myFirstName").innerHTML = userDataItem.firstName;
    document.getElementById("myLastName").innerHTML = userDataItem.lastName;
    document.getElementById("myDob").innerHTML = userDataItem.dateOfBirth;
    document.getElementById("myGender").innerHTML = userDataItem.gender;
    document.getElementById("myPhone").innerHTML = userDataItem.phoneNumber;
    document.getElementById("myEmail").innerHTML = userDataItem.email;
    document.getElementById("myLinkedin").innerHTML = userDataItem.linkedin;
    document.getElementById("myFieldMajor").innerHTML = userDataItem.fieldMajor;


    switch (userDataItem.educational) {
        case "sd":
            // code block
            document.getElementById("myHighestDegree").innerHTML = "School Degree(10th)";
            break;
        case "hsd":
            // code block
            document.getElementById("myHighestDegree").innerHTML = "High School Degree(12th)";
            break;
        case "bd":
            // code block
            document.getElementById("myHighestDegree").innerHTML = "Bachelor's Degree";
            break;
        case "md":
            // code block
            document.getElementById("myHighestDegree").innerHTML = "Master's Degree";
            break;
        case "dd":
            // code block
            document.getElementById("myHighestDegree").innerHTML = "Doctorate Degree";
            break;
        default:
        // code block
        document.getElementById("myHighestDegree").innerHTML = "Nothing";
    }

    switch (userDataItem.employmentStatus) {
        case "e":
            // code block
            document.getElementById("myEmployment").innerHTML = "Employed";
            break;
        case "se":
            // code block
            document.getElementById("myEmployment").innerHTML = "Self Employed";
            break;
        case "s":
            // code block
            document.getElementById("myEmployment").innerHTML = "Student";
            break;
        case "r":
            // code block
            document.getElementById("myEmployment").innerHTML = "Retired";
            break;
        case "o":
            // code block
            document.getElementById("myEmployment").innerHTML = "Other";
            break;
        default:
        // code block
        document.getElementById("myEmployment").innerHTML = "Not available";
    }
    document.getElementById("containerss").style.display = "none";
    document.getElementById("overlay").style.display = "none";


}

function editProfile(){
    sessionStorage.setItem('toshowpv',false);
    window.location.href="fill_profile.html";


}
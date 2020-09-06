

function notifyMe(){
var emailInput = document.getElementById("emailField").value;
var isvalid = validateEmail(emailInput);

if(emailInput != ""){
   if(isvalid == true){

Email.send({

   SecureToken: "47f5846d-75e9-4d2d-a592-2fec102c2cc5",
    To: 'parth.pedgaonkar18@vit.edu',
    From: "skillbuddy13@gmail.com",
    Subject: "notify alert",
    Body: "email " + emailInput +" has requested to notify",
 }).then(
    message => alert("Thank you for joining with us! We will get back to you. "),
      document.getElementById("emailField").value = "",
  );
}
else{
   alert("PLEASE ENTER VALID EMAIL ADDRESS");
}
}
else{
    alert("ENTER EMAIL");
}


}

function validateEmail(email) {
   const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(email);
 }
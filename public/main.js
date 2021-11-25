function expense() {
  var modalFriends = document.getElementById("friends-modal");
  modalFriends.style.display = "block";
}


let list = [];

// function for adding expense

function addFriend() {
  // code for retrieving values from of selected friend
  var checkboxes = document.getElementsByName('friends_list');
  list = [];
  for (var checkbox of checkboxes) {
    if (checkbox.checked) {
      // inserting friends in an array for further use
      list.push(checkbox.value);
      // console.log(checkbox.value);
    }
  }
  // displaying warning msg if frnd_list is empty
  if (list.length === 0) {
    document.getElementById("warning_frnd").style.display = "block";
  } else {
    var modalExp = document.getElementById("exp-modal");
    var modalFriends = document.getElementById("friends-modal");
    modalExp.style.display = "block";
    modalFriends.style.display = "none";

    var ll = list.length;
    ll = ll - 1;

    list.forEach((friend,i)=>{

     document.getElementById(i).textContent=friend;
     document.getElementById(i).style.display="block";
         console.log(document.getElementById("input"+i));
     document.getElementById("currency"+i).style.display="inline";
     document.getElementById("input"+i).style.display="inline";

    })

    //
    //
    // if (ll >= 1) {
    //   document.getElementById("frnd_names").value = list[0] + " and " + ll + " more ";
    // } else {
    //   document.getElementById("frnd_names").value = list[0];
    // }
// **setting value of place holder**
    document.getElementById("")
  }
}


function changeinValue(){
  document.getElementById("frnd_names").value = list;
}

function closeExp() {
  var modalExp = document.getElementById("exp-modal");
  list.forEach((friend,i)=>{

   document.getElementById(i).textContent="";
   document.getElementById(i).style.display="none";
       //console.log(document.getElementById("input"+i));
   document.getElementById("currency"+i).style.display="none";
   document.getElementById("input"+i).style.display="none";

  })
  list = [];
  closeFriend();
  modalExp.style.display = "none";
}

window.onclick = function(event) {
  var modalExp = document.getElementById("exp-modal");
  var modalFriends = document.getElementById("friends-modal");
  if (event.target == modalExp || event.target == modalFriends) {
    event.target.style.display = "none";
  }
}

function closeFriend() {
  list = [];
  var modalFriends = document.getElementById("friends-modal");
  // turning warning message off
  document.getElementById("warning_frnd").style.display = "none";
  // unchecking selected friends after closing the modal
  var checkboxes = document.getElementsByName('friends_list');
  for (var checkbox of checkboxes) {
    if (checkbox.checked) {
      checkbox.checked = false;
    }
  }
  // close modal
  modalFriends.style.display = "none";
}

function xyz() {
  document.getElementByClass(x).load("/xyz");
}

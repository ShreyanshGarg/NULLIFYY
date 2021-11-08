function expense() {
  var modalFriends = document.getElementById("friends-modal");
  modalFriends.style.display = "block";
}


let list = [];

// function for adding expense

function addFriend() {
  // code for retrieving values from of selected friend
  var checkboxes = document.getElementsByName('friends_list');
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

    document.getElementById("frnd_names").placeholder=list;

    var ll = list.length;
    ll = ll - 1;
    if (ll >= 1) {
      document.getElementById("frnd_names").value = list[0] + " and " + ll + " more ";
    } else {
      document.getElementById("frnd_names").value = list[0];
    }
// **setting value of place holder**
    document.getElementById("")
  }
}

function changeinValue(){
  document.getElementById("frnd_names").value = list;
}

function closeExp() {
  var modalExp = document.getElementById("exp-modal");
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

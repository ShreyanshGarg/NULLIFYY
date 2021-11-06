function expense() {
  var modalFriends = document.getElementById("friends-modal");
  modalFriends.style.display = "block";
}

function addFriend(divName) {
  var modalExp = document.getElementById("exp-modal");
  var modalFriends = document.getElementById("friends-modal");
  modalExp.style.display = "block";
  modalFriends.style.display = "none";
}

function closeExp() {
  var modalExp = document.getElementById("exp-modal");
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
  modalFriends.style.display = "none";
}

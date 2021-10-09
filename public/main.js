function expense(divName) {
  var modalExp = document.getElementById("exp-modal");
  modalExp.style.display = "block";
}

function closeExp() {
  var modalExp = document.getElementById("exp-modal");
  modalExp.style.display = "none";
}

window.onclick = function(event) {
  var modalExp = document.getElementById("exp-modal");
  if (event.target == modalExp) {
    modalExp.style.display = "none";
  }
}

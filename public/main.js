// Global variables
let list = [];
let name = "";
// ************Expense Modal Starts******************

// function for opening expense modal
function expense() {
  // closing already existing modal
  // closeFriend_settle();
  // opening the corrosponding modal
  let modalFriends = document.getElementById("friends-modal");
  modalFriends.style.display = "block";
}

// function for adding expense

function addFriend() {
  // code for retrieving values from of selected friend
  let checkboxes = document.getElementsByName("friends_list");
  list = [];
  for (let checkbox of checkboxes) {
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
    let modalExp = document.getElementById("exp-modal");
    let modalFriends = document.getElementById("friends-modal");
    modalExp.style.display = "block";
    modalFriends.style.display = "none";

    let ll = list.length;
    ll = ll - 1;

    let disp;
    list.length > 1 ? disp = "block" : disp = "none";
    document.querySelector(".group-name").style.display = disp;

    list.forEach((friend, i) => {
      document.getElementById(i).textContent = friend;
      document.getElementById(i).style.display = "block";
      console.log(document.getElementById("input" + i));
      document.getElementById("currency" + i).style.display = "inline";
      document.getElementById("input" + i).style.display = "inline";
      document.getElementById("input" + i).required = true;
    });

    document.getElementById("");
  }
}

function changeinValue() {
  document.getElementById("Save-btn").value = list;
}
// close Button on expense modal
function closeExp() {
  let modalExp = document.getElementById("exp-modal");
  list.forEach((friend, i) => {
    document.getElementById(i).textContent = "";
    document.getElementById(i).style.display = "none";
    //console.log(document.getElementById("input"+i));
    document.getElementById("currency" + i).style.display = "none";
    document.getElementById("input" + i).style.display = "none";
    document.getElementById("input" + i).required = false;
  });
  list = [];
  let form = document.getElementById("expense_form");
  form.reset();
  closeFriend();

  modalExp.style.display = "none";
}

window.onclick = function (event) {
  let modalExp = document.getElementById("exp-modal");
  let modalFriends = document.getElementById("friends-modal");
  let settleModel = document.getElementById("settle-modal");
  let paymentSettleModel = document.getElementById("payment-settle-modal");
  if (
    event.target == modalExp ||
    event.target == modalFriends ||
    event.target == settleModel ||
    event.target == paymentSettleModel
  ) {
    let form = document.getElementById("expense_form");
    form.reset();
    closeFriend();
    event.target.style.display = "none";
  }
};

function closeFriend() {
  list = [];
  let modalFriends = document.getElementById("friends-modal");
  // turning warning message off
  document.getElementById("warning_frnd").style.display = "none";
  // unchecking selected friends after closing the modal
  let checkboxes = document.getElementsByName("friends_list");
  for (let checkbox of checkboxes) {
    if (checkbox.checked) {
      checkbox.checked = false;
    }
  }
  // close modal
  modalFriends.style.display = "none";
}

// ************Settlement Modal Starts******************

// **function for opening expense-SETTLE modal
function settle() {
  // closing already existing modal
  // closeExp();
  // closeFriend();
  // opening the corrosponding modal
  let modalFriends = document.getElementById("settle-modal");
  modalFriends.style.display = "block";
}

// function for opening 2nd settle up modal
function settle_payment(id) {

  setTimeout(function () {
    let modalSettle = document.getElementById("settle-modal");
    let modalFriends = document.getElementById("payment-settle-modal");
    modalSettle.style.display = "none";
    modalFriends.style.display = "block";
    console.log(id);
    let Id = String(id);

    for (let i = 0; i < Id.length; i++) {
      if (Id[i] == ",") break;
      else name += Id[i];
    }
    
    let amount = Id.substring(name.length + 1, Id.length);
    console.log(amount);
    amount = amount * 1;
    amount = Math.abs(amount);
    // console.log(amount)
    // console.log(name)
    document.getElementById("user_logo").src =
      "https://ui-avatars.com/api/?name=" + String(name);

    document.getElementById("lender_name").innerHTML = name;
    document.getElementById("amount_paid").value = amount;
  }, 100);

}

// closing button on settle modal
function closeFriend_settle() {
  list = [];
  name = "";
  let modalSettle = document.getElementById("settle-modal");
  let modalFriends = document.getElementById("payment-settle-modal");
  // close modal
  modalFriends.style.display = "none";
  modalSettle.style.display = "none";
}

function changeinValueSettle() {
  document.getElementById("Save-btn-settle").value = name;
}

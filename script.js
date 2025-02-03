let selectedRow = null;

const SESSION_TIMEOUT = 30 * 60 * 1000;

// Load users from localStorage on page load
window.onload = function () {
  if (isSessionExpired()) {
    sessionStorage.clear();
    return;
  }
  loadUsers();
};

function onFormSubmit() {
  if (!validateEmail()) {
    alert("Please enter a valid email address.");
    return;
  }

  if (!validatePhone()) {
    alert("Please enter a valid phone number (10 digits).");
    return;
  }

  let formData = readFormData();
  if (selectedRow == null) {
    insertNewRecord(formData);
  } else {
    updateRecord(formData);
  }
  saveUsers();
  resetForm();
}

function readFormData() {
  return {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    dateCreated: new Date(),
    dateModified: "-",
  };
}

function insertNewRecord(data) {
  let table = document
    .getElementById("userList")
    .getElementsByTagName("tbody")[0];
  let newRow = table.insertRow(table.rows.length);

  newRow.insertCell(0).innerHTML = data.firstName;
  newRow.insertCell(1).innerHTML = data.lastName;
  newRow.insertCell(2).innerHTML = data.email;
  newRow.insertCell(3).innerHTML = data.phone;
  newRow.insertCell(4).innerHTML = data.dateCreated;
  newRow.insertCell(5).innerHTML = data.dateModified;

  let actionCell = newRow.insertCell(6);
  actionCell.innerHTML =
    '<button onclick="onEdit(this)">Edit</button> ' +
    '<button onclick="onDelete(this)">Delete</button>';
  let selectCell = newRow.insertCell(7);
  selectCell.innerHTML =
    '<input type="checkbox" class="rowCheckbox" onclick="updateDeleteButton()">';
}

function resetForm() {
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  selectedRow = null;
  document.querySelector(".form-action-buttons input[type='submit']").value =
    "Submit";
}

function onEdit(td) {
  selectedRow = td.parentElement.parentElement;
  document.getElementById("firstName").value = selectedRow.cells[0].innerHTML;
  document.getElementById("lastName").value = selectedRow.cells[1].innerHTML;
  document.getElementById("email").value = selectedRow.cells[2].innerHTML;
  document.getElementById("phone").value = selectedRow.cells[3].innerHTML;
  document.querySelector(".form-action-buttons input[type='submit']").value =
    "Update";
}

function updateRecord(formData) {
  selectedRow.cells[0].innerHTML = formData.firstName;
  selectedRow.cells[1].innerHTML = formData.lastName;
  selectedRow.cells[2].innerHTML = formData.email;
  selectedRow.cells[3].innerHTML = formData.phone;
  selectedRow.cells[5].innerHTML = new Date();

  saveUsers();
  resetForm();
}

function onDelete(td) {
  if (confirm("Are you sure to delete this record?")) {
    let row = td.parentElement.parentElement;
    row.parentElement.removeChild(row);
    resetForm();
  }
}

// Validate Email
function validateEmail() {
  let email = document.getElementById("email").value;
  let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

// Validate Phone
function validatePhone() {
  let phone = document.getElementById("phone").value;
  let phonePattern = /^[0-9]{10}$/; // Ensures exactly 10 digits
  return phonePattern.test(phone);
}

// Save Users to Session Storage using setItem
function saveUsers() {
  let users = [];
  let table = document
    .getElementById("userList")
    .getElementsByTagName("tbody")[0];

  for (let i = 0; i < table.rows.length; i++) {
    let row = table.rows[i];
    let user = {
      firstName: row.cells[0].innerHTML,
      lastName: row.cells[1].innerHTML,
      email: row.cells[2].innerHTML,
      phone: row.cells[3].innerHTML,
      dateCreated: row.cells[4].innerHTML,
      dateModified: row.cells[5].innerHTML,
    };
    users.push(user);
  }
  sessionStorage.setItem("users", JSON.stringify(users));
  sessionStorage.setItem("lastSaveTime", Date.now());
}

// Load Users from Session Storage using getItem
function loadUsers() {
  let users = JSON.parse(sessionStorage.getItem("users")) || [];
  let table = document
    .getElementById("userList")
    .getElementsByTagName("tbody")[0];

  users.forEach((user) => {
    let newRow = table.insertRow(table.rows.length);

    newRow.insertCell(0).innerHTML = user.firstName;
    newRow.insertCell(1).innerHTML = user.lastName;
    newRow.insertCell(2).innerHTML = user.email;
    newRow.insertCell(3).innerHTML = user.phone;
    newRow.insertCell(4).innerHTML = user.dateCreated;
    newRow.insertCell(5).innerHTML = user.dateModified;

    let actionCell = newRow.insertCell(6);
    actionCell.innerHTML =
      '<button onclick="onEdit(this)">Edit</button> ' +
      '<button onclick="onDelete(this)">Delete</button>';

    let selectCell = newRow.insertCell(7);
    selectCell.innerHTML =
      '<input type="checkbox" class="rowCheckbox" onclick="updateDeleteButton()">';
  });
}

function isSessionExpired() {
  let lastSaveTime = sessionStorage.getItem("lastSaveTime");
  if (!lastSaveTime) return true; // No last save time, consider it expired

  let currentTime = Date.now();
  let timeDifference = currentTime - lastSaveTime;

  return timeDifference > SESSION_TIMEOUT;
}

/*function sessionExpiredAction() {
    alert("Session has expired. Please reload the page.");
    sessionStorage.clear(); 
}*/

/*function onSessionTimeout() {
    if (isSessionExpired()) {
        sessionExpiredAction();
        alert("Session has expired. Please reload the page.");
    }
}*/

function toggleSelectAll() {
  let checkboxes = document.querySelectorAll(".rowCheckbox");
  let selectAll = document.getElementById("selectAll").checked;
  checkboxes.forEach((checkbox) => {
    checkbox.checked = selectAll;
  });
  updateDeleteButton();
}

function updateDeleteButton() {
  let checkboxes = document.querySelectorAll(".rowCheckbox:checked");
  let button = document.getElementById("deleteSelected");
  let deleteAllButton = document.getElementById("deleteAll");
  let totalRows = document.querySelectorAll("#userList tbody tr").length;

  button.innerText = `Delete Selected (${checkboxes.length})`;
  button.style.display = checkboxes.length > 0 ? "block" : "none";
  deleteAllButton.style.display = totalRows > 0 ? "block" : "none";

  let selectAllCheckbox = document.getElementById("selectAll");
  let allCheckboxes = document.querySelectorAll(".rowCheckbox");
  console.log(allCheckboxes, "allCheckboxes");
  console.log(checkboxes, "checkboxes");
  console.log(selectAllCheckbox, "selectAllCheckbox");

  if (allCheckboxes.length === checkboxes.length) {
    selectAllCheckbox.checked = true;
  } else {
    selectAllCheckbox.checked = false;
  }
}

function deleteSelected() {
  let checkboxes = document.querySelectorAll(".rowCheckbox:checked");
  let selectedCount = checkboxes.length;
  if (selectedCount === 0) return;
  if (!confirm(`Are you sure you want to delete ${selectedCount} records?`))
    return;

  checkboxes.forEach((checkbox) => {
    let row = checkbox.parentElement.parentElement;
    row.parentElement.removeChild(row);
  });

  saveUsers();
  updateDeleteButton();
}

function deleteAll() {
  let totalRows = document.querySelectorAll("#userList tbody tr").length;

  if (totalRows === 0) return;

  if (!confirm(`Are you sure you want to delete all ${totalRows} record(s)?`))
    return;

  let tableBody = document.querySelector("#userList tbody");
  tableBody.innerHTML = "";

  saveUsers();
  updateDeleteButton();
}

function filterTable() {
  let firstNameFilter = document.getElementById("filterFirstName").value;
  let lastNameFilter = document.getElementById("filterLastName").value;
  let emailFilter = document.getElementById("filterEmail").value;
  let phoneFilter = document.getElementById("filterPhone").value;

  let table = document
    .getElementById("userList")
    .getElementsByTagName("tbody")[0];
  let rows = table.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    let firstName = rows[i].cells[0].innerText;
    let lastName = rows[i].cells[1].innerText;
    let email = rows[i].cells[2].innerText;
    let phone = rows[i].cells[3].innerText;

    let matchesFirstName = firstName.includes(firstNameFilter);
    let matchesLastName = lastName.includes(lastNameFilter);
    let matchesEmail = email.includes(emailFilter);
    let matchesPhone = phone.includes(phoneFilter);

    if (matchesFirstName && matchesLastName && matchesEmail && matchesPhone) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}

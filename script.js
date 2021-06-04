let form = document.querySelector("form");
let companyListings = document.querySelector("ul");
let createCompanyBtn = document.querySelector(".create-company-profile-btn");
let createCompanyCancelBtn = document.querySelector("[value = 'Cancel']");
let companyListingsContainer = document.querySelector(
  ".company-listings-container"
);

let newCompanyFormContainer = document.querySelector(
  ".create-new-company-listing"
);

createCompanyBtn.addEventListener("click", function () {
  companyListingsContainer.style.display = "none";
  newCompanyFormContainer.style.display = "block";
});

createCompanyCancelBtn.addEventListener("click", function () {
  companyListingsContainer.style.display = "block";
  newCompanyFormContainer.style.display = "none";
});

if (!localStorage.getItem("gstDatabase")) {
  localStorage.setItem("gstDatabase", JSON.stringify([]));
} else {
  loadCompanies();
}

function loadCompanies() {
  let db = JSON.parse(localStorage.getItem("gstDatabase"));
  let lis = companyListings.querySelectorAll("li");
  for (let i = 0; i < lis.length; i++) {
    lis[i].remove();
  }
  for (let i = 0; i < db.length; i++) {
    let company = document.createElement("li");
    let deletBtn = document.createElement("button");
    deletBtn.innerText = "X";
    company.setAttribute("data-id", db[i].id);
    company.innerText = db[i].name;
    company.append(deletBtn);
    deletBtn.classList.add("delete-btn");
    deletBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      let id = e.currentTarget.parentElement.getAttribute("data-id");
      let db = JSON.parse(localStorage.getItem("gstDatabase"));
      db = db.filter(function (e) {
        return e.id != id;
      });
      localStorage.setItem("gstDatabase", JSON.stringify(db));
      e.currentTarget.parentElement.remove();
    });
    company.addEventListener("click", function () {
      sessionStorage.setItem("company-id", db[i].id);
      location.assign("bill-details.html");
    });
    companyListings.appendChild(company);
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  let formData = new FormData(e.currentTarget);
  let name = formData.get("new-company-name");
  let gst = formData.get("new-company-gst");
  let address = formData.get("new-company-address");
  let city = formData.get("new-company-city");
  let state = formData.get("new-company-state");
  let db = JSON.parse(localStorage.getItem("gstDatabase"));

  db.push({ id: Date.now(), name, gst, address, city, state });
  localStorage.setItem("gstDatabase", JSON.stringify(db));
  companyListingsContainer.style.display = "block";
  newCompanyFormContainer.style.display = "none";
  loadCompanies();
});

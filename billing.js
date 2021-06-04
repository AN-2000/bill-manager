let clientCompanyName = document.querySelector(".client-company-name");
let clientCompanyAddress = document.querySelector(".client-company-address");
let clientCompanyGST = document.querySelector(".client-company-gst");
let billDate = document.querySelector(".bill-date");
let totalText = document.querySelector(".total .amount");
let tbody = document.querySelector(".bill-table-container tbody");
let addNewItemBtn = document.querySelector(".add-new-item-btn");
let generateBillBtn = document.querySelector("#generate-bill");
let oldBillsBtn = document.querySelector("#old-bills");
let itemId = 1;

oldBillsBtn.addEventListener("click", function () {
  location.assign("old-bills.html");
});

if (!sessionStorage.getItem("currentBillItems")) {
  sessionStorage.setItem("currentBillItems", JSON.stringify([]));
} else {
  let data = JSON.parse(sessionStorage.getItem("currentBillItems"));
  if (data.length != 0) itemId = data[data.length - 1].itemId + 1;
  for (let i = 0; i < data.length; i++) {
    let tr = document.createElement("tr");
    tr.innerHTML = `<td data-item-id="${
      data[i].itemId
    }" data-first="false" contenteditable data-property="name">${
      data[i].name != undefined ? data[i].name : ""
    }</td>
  <td data-item-id="${
    data[i].itemId
  }" data-first="false" contenteditable data-property="qty">${
      data[i].qty != undefined ? data[i].qty : ""
    }</td>
  <td data-item-id="${
    data[i].itemId
  }" data-first="false" contenteditable data-property="price">${
      data[i].price != undefined ? data[i].price : ""
    }</td>
  <td data-item-id="${
    data[i].itemId
  }" data-first="false" contenteditable data-property="CGST">${
      data[i].CGST != undefined ? data[i].CGST : ""
    }</td>
  <td data-item-id="${
    data[i].itemId
  }" data-first="false" contenteditable data-property="SGST">${
      data[i].SGST != undefined ? data[i].SGST : ""
    }</td>
  <td data-item-id="${
    data[i].itemId
  }" data-first="false" data-property="Amount">${
      data[i].amount != undefined ? data[i].amount : ""
    }</td>
     <td data-item-id="${data[i].itemId}"><button>Delete</button></td>`;
    tbody.append(tr);
    let tds = tr.querySelectorAll("td");
    attachListenersToTableCells(tds);
  }
}

if (sessionStorage.getItem("clientName")) {
  clientCompanyName.value = sessionStorage.getItem("clientName");
}

if (sessionStorage.getItem("total")) {
  totalText.innerText = sessionStorage.getItem("total");
}

if (sessionStorage.getItem("clientAddress")) {
  clientCompanyAddress.value = sessionStorage.getItem("clientAddress");
}

if (sessionStorage.getItem("clientGST")) {
  clientCompanyGST.value = sessionStorage.getItem("clientGST");
}

if (sessionStorage.getItem("bill-date")) {
  billDate.value = sessionStorage.getItem("bill-date");
}

clientCompanyName.addEventListener("change", function (e) {
  sessionStorage.setItem("clientName", e.currentTarget.value);
});

clientCompanyAddress.addEventListener("change", function (e) {
  sessionStorage.setItem("clientAddress", e.currentTarget.value);
});

clientCompanyGST.addEventListener("change", function (e) {
  sessionStorage.setItem("clientGST", e.currentTarget.value);
});

billDate.addEventListener("change", function (e) {
  sessionStorage.setItem("bill-date", e.currentTarget.value);
});

addNewItemBtn.addEventListener("click", function (e) {
  let data = JSON.parse(sessionStorage.getItem("currentBillItems"));
  data.push({ itemId });
  sessionStorage.setItem("currentBillItems", JSON.stringify(data));
  let tr = document.createElement("tr");
  tr.innerHTML = `<td data-item-id="${itemId}" data-first="true" contenteditable data-property="name">Item Name</td>
  <td data-item-id="${itemId}" data-first="true" contenteditable data-property="qty">Qty</td>
  <td data-item-id="${itemId}" data-first="true" contenteditable data-property="price">Price</td>
  <td data-item-id="${itemId}" data-first="true" contenteditable data-property="CGST">CGST</td>
  <td data-item-id="${itemId}" data-first="true" contenteditable data-property="SGST">SGST</td>
  <td data-item-id="${itemId}" data-first="true" data-property="Amount">Amount</td>
   <td data-item-id="${itemId}" ><button>Delete</button></td>`;
  tbody.append(tr);
  itemId++;
  let tds = tr.querySelectorAll("td");
  attachListenersToTableCells(tds);
});

generateBillBtn.addEventListener("click", function () {
  if (
    sessionStorage.getItem("clientName") &&
    sessionStorage.getItem("total") &&
    sessionStorage.getItem("clientAddress") &&
    sessionStorage.getItem("currentBillItems") &&
    sessionStorage.getItem("bill-date") &&
    JSON.parse(sessionStorage.getItem("currentBillItems")).length > 0
  ) {
    let companyId = sessionStorage.getItem("company-id");
    let gstDatabase = JSON.parse(localStorage.getItem("gstDatabase"));
    let index = gstDatabase.findIndex(function (e) {
      return e.id == companyId;
    });
    if (!gstDatabase[index].bills) {
      gstDatabase[index].bills = [];
    }
    let bill = {
      clientName: sessionStorage.getItem("clientName"),
      clientAddress: sessionStorage.getItem("clientAddress"),
      total: sessionStorage.getItem("total"),
      items: JSON.parse(sessionStorage.getItem("currentBillItems")),
      date: sessionStorage.getItem("bill-date"),
    };
    gstDatabase[index].bills.push(bill);
    localStorage.setItem("gstDatabase", JSON.stringify(gstDatabase));
    location.assign("bill.html");
  } else {
    alert("Error: Incomplete details to generate bill");
  }
});

function attachListenersToTableCells(tds) {
  tds[tds.length - 1].addEventListener("click", function (e) {
    let id = e.currentTarget.getAttribute("data-item-id");
    let amountToSub = tds[tds.length - 2].innerText;
    if (amountToSub != "") {
      let t = Number(totalText.innerText) - Number(amountToSub);
      totalText.innerText = t;
      sessionStorage.setItem("total", t);
    }
    e.currentTarget.parentElement.remove();

    let data = JSON.parse(sessionStorage.getItem("currentBillItems"));
    data = data.filter(function (e) {
      return e.itemId != id;
    });
    sessionStorage.setItem("currentBillItems", JSON.stringify(data));
  });

  for (let i = 0; i < tds.length - 2; i++) {
    tds[i].addEventListener("click", function (e) {
      if (e.currentTarget.getAttribute("data-first") == "true") {
        e.currentTarget.setAttribute("data-first", false);
        e.currentTarget.innerHTML = "";
      }
    });
    tds[i].addEventListener("input", function (e) {
      let prop = e.currentTarget.getAttribute("data-property");
      let id = e.currentTarget.getAttribute("data-item-id");
      let data = JSON.parse(sessionStorage.getItem("currentBillItems"));
      let index = data.findIndex(function (e) {
        return e.itemId == id;
      });
      data[index][prop] = e.currentTarget.innerText;
      if (prop == "CGST") {
        tds[i + 1].innerText = e.currentTarget.innerText;
        data[index]["SGST"] = e.currentTarget.innerText;
      }

      if (prop == "SGST") {
        tds[i - 1].innerText = e.currentTarget.innerText;
        data[index]["CGST"] = e.currentTarget.innerText;
      }

      sessionStorage.setItem("currentBillItems", JSON.stringify(data));
      if (
        prop == "qty" ||
        prop == "SGST" ||
        prop == "CGST" ||
        prop == "price"
      ) {
        changeAmountAndTotal(
          tds[1].innerText,
          tds[2].innerText,
          tds[3].innerText,
          tds[5]
        );
      }
    });
  }
}

function changeAmountAndTotal(qtyVal, priceVal, cgstVal, amountRef) {
  let amount = 0;
  if (
    !Number.isNaN(Number(qtyVal)) &&
    !Number.isNaN(Number(priceVal)) &&
    !Number.isNaN(Number(cgstVal))
  ) {
    let principal = qtyVal * priceVal;
    amount = principal + (principal * (2 * cgstVal)) / 100;
  } else if (!Number.isNaN(Number(qtyVal)) && !Number.isNaN(Number(priceVal))) {
    amount = qtyVal * priceVal;
  }
  amount =round(amount);
  let id = amountRef.getAttribute("data-item-id");
  let data = JSON.parse(sessionStorage.getItem("currentBillItems"));
  let index = data.findIndex(function (e) {
    return e.itemId == id;
  });
  data[index]["amount"] = amount;
  console.log(data);
  sessionStorage.setItem("currentBillItems", JSON.stringify(data));

  amountRef.innerText = amount;

  let allAmountTds = document.querySelectorAll("[data-property='Amount']");
  let total = 0;
  for (let i = 0; i < allAmountTds.length; i++) {
    total += +allAmountTds[i].innerText;
  }
  total = round(total);
  totalText.innerText = total;
  sessionStorage.setItem("total", total);
}


function round(num) {
  var m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
}
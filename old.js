let db = JSON.parse(localStorage.getItem("gstDatabase"));
let id = sessionStorage.getItem("company-id");

let index = db.findIndex(function (e) {
  return (e.id = id);
});

let { name, gst, city, state, address } = db[index];

let bills = db[index].bills;

for (let i = 0; i < bills.length; i++) {
  drawBill(name, gst, city, state, address, bills[i]);
}

function drawBill(name, gst, address, city, state, bill) {
  let body = document.querySelector("body");
  let canvas = document.createElement("canvas");
  let hr = document.createElement("hr");
  body.append(canvas);
  body.append(hr);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let ctx = canvas.getContext("2d");
  ctx.rect(200, 0, canvas.width - 400, canvas.height);
  ctx.rect(200, canvas.height * 0.4, canvas.width - 400, canvas.height * 0.6);
  ctx.rect(200, canvas.height * 0.4, canvas.width - 400, canvas.height * 0.1);
  ctx.rect(200, canvas.height * 0.9, canvas.width - 400, canvas.height * 0.1);
  ctx.stroke();

  ctx.font = "30px Arial";
  ctx.fillText("Tax Invoice", canvas.width / 2 - 75, 50, 150);
  ctx.font = "25px Arial";
  ctx.fillText(name, 220, 100, 220);
  ctx.font = "20px Arial";
  ctx.fillText("GSTIN- " + gst, 220, 140, 300);
  ctx.fillText(address, 220, 170, 300);
  ctx.fillText(city, 220, 200, 220);
  ctx.fillText(state, 220, 230, 220);

  ctx.font = "25px Arial";
  ctx.fillText(bill["clientName"], canvas.width - 200 - 300 - 10, 100, 220);
  ctx.font = "20px Arial";
  let cGst = bill["clientGST"];
  if (!cGst) cGst = "";
  ctx.fillText(cGst, canvas.width - 200 - 300 - 10, 140, 220);
  ctx.fillText(bill["clientAddress"], canvas.width - 200 - 300 - 10, 170, 300);

  ctx.fillText("Date - " + todaysDate(), canvas.width / 2 - 75, 200, 150);

  ctx.moveTo(500, canvas.height * 0.4);
  ctx.lineTo(500, canvas.height * 0.9);
  ctx.moveTo(600, canvas.height * 0.4);
  ctx.lineTo(600, canvas.height * 0.9);
  ctx.moveTo(700, canvas.height * 0.4);
  ctx.lineTo(700, canvas.height * 0.9);
  ctx.moveTo(800, canvas.height * 0.4);
  ctx.lineTo(800, canvas.height * 0.9);
  ctx.moveTo(900, canvas.height * 0.4);
  ctx.lineTo(900, canvas.height);
  ctx.stroke();

  ctx.fillText("Item Name", 350 - 75, canvas.height * 0.45, 150);
  ctx.fillText("Qty", 550 - 15, canvas.height * 0.45, 30);
  ctx.fillText("Price", 650 - 20, canvas.height * 0.45, 40);
  ctx.fillText("CGST", 750 - 20, canvas.height * 0.45, 40);
  ctx.fillText("SGST", 850 - 20, canvas.height * 0.45, 40);
  ctx.fillText(
    "Amount",
    (canvas.width + 900 - 200) / 2 - 30,
    canvas.height * 0.45,
    60
  );

  ctx.fillText("Total", 350 - 75, canvas.height * 0.95, 150);
  ctx.fillText(
    "Rs. " + bill["total"],
    (canvas.width + 900 - 200) / 2 - 40,
    canvas.height * 0.95,
    80
  );

  let verticalPos = 0.55;
  let data = bill.items;
  for (let i = 0; i < data.length; i++) {
    ctx.fillText(data[i].name, 350 - 75, canvas.height * verticalPos, 150);
    ctx.fillText(data[i].qty, 550 - 15, canvas.height * verticalPos, 30);
    ctx.fillText(data[i].price, 650 - 20, canvas.height * verticalPos, 40);
    ctx.fillText(data[i].CGST + "%", 750 - 20, canvas.height * verticalPos, 40);
    ctx.fillText(data[i].SGST + "%", 850 - 20, canvas.height * verticalPos, 40);
    ctx.fillText(
      "Rs. " + data[i].amount,
      (canvas.width + 900 - 200) / 2 - 30,
      canvas.height * verticalPos,
      60
    );
    verticalPos += 0.05;
  }
}
function todaysDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  return today;
}

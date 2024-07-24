// * Table Body DOM
const tableBody = document.getElementById("table-body");

// Back button DOM
const backbtn = document.getElementById("back-button");

// ? Backbutton listener for when user click it redirects to index.html page
backbtn.addEventListener("click", () => {
  window.location = "./../Pages/index.html";
});

// ? Get the Data from local storage in JSON parsed
function getFromLocalStorage() {
  return JSON.parse(localStorage.getItem("Selected"));
}

// ? Creating the dyanmic tables row from fetching the data from localstorage
function createTableRow() {
  const data = getFromLocalStorage();
  Array.from(data).forEach((value, index) => {
    const tr = document.createElement("tr");
    const objvalues = Object.values(value);
    const td = document.createElement("td");
    td.innerHTML = index + 1;
    tr.appendChild(td);
    for (let i = 0; i < 3; i++) {
      const td = document.createElement("td");
      if (objvalues[i]) {
        Number(objvalues[i]) || Number(objvalues[i]) === 0
          ? (td.innerHTML = `$${objvalues[i]}`)
          : (td.innerHTML = `${objvalues[i]}`);
      } else {
        td.innerHTML = "....";
      }
      tr.appendChild(td);
    }
    tableBody.appendChild(tr);
  });
}
document.addEventListener("DOMContentLoaded", createTableRow);

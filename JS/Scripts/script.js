// * Storing all the option in the dropdown menu

// Select Tag DOM
const shippingMethods = document.getElementById("shipping-method");

// Invalid message for input box 1 DOM
const invalidmsg = document.getElementsByClassName("invalid-message-cost")[0];

// Invalid message for input box 2 DOM
const invalidMsgAdditional = document.getElementsByClassName(
  "invalid-message-additional"
)[0];

// Input Box DOM
const inputsbox = document.getElementsByClassName("cost-input");

// Add Button DOM
const addbtn = document.getElementById("addbtn");

// Submit button DOM
const submitBtn = document.getElementById("submitbtn");

// Shipping block main DOM
const divbox = document.getElementById("box-element");

let options = ["Pickup", "USPS", "FedEx", "UPS", "Free Shipping"];

// Array for storing the selected options
const selected = [];

// ? Creating the new option element inside the Select tag
function loadOptions() {
  options.forEach(addOptions);
}
loadOptions();

// ? Function to add the option with the given value in the dropdown menu
function addOptions(value) {
  const optionEle = document.createElement("option");
  optionEle.value = value;
  optionEle.innerHTML = value;
  optionEle.classList.add("fw-lighter");
  shippingMethods.appendChild(optionEle);
}

// ? Function for enabling and disabling the input box with add button
function inputBoxDisabling(isDisabled) {
  addbtn.disabled = isDisabled;
  isDisabled
    ? addbtn.classList.remove("btn-clicked")
    : addbtn.classList.add("btn-clicked");
  Array.from(inputsbox).forEach((value) => {
    value.disabled = isDisabled;
    value.value = "";
  });
}

// * By default input box is disabled on selecting the option from dropdown menu input is enabled
shippingMethods.addEventListener("change", function () {
  this.value !== "select" ? inputBoxDisabling(false) : inputBoxDisabling(true);
});

// ? If the inputbox and invalid message is shown remove the red border and invalid message from its.
Array.from(inputsbox).forEach((value, index) => {
  value.addEventListener("keypress", () => {
    value.classList.remove("is-invalid");
    invalidmsg.innerHTML = "";
    invalidMsgAdditional.innerHTML = "";
  });
});

// ? Removing the selected options from the dropdown menu
function removeSelectedOption(shipping) {
  Array.from(shippingMethods.children).forEach((value) => {
    if (value.value === shipping) {
      value.remove();
    }
  });
}

// ? Adding the selected option to the object for storing the added shipping
function handleOptions(costValue, shipping, additionalCostValue) {
  removeSelectedOption(shipping);
  inputBoxDisabling(true);
  selected.push({
    shipping: shipping,
    costValue: costValue,
    additionalCost: additionalCostValue,
  });
  enableSubmit();
  options = options.filter((value) => value !== shipping);
}

// * Function to create shipping block of the selected option.
function createBox(costValue, shipping, additionalCostValue) {
  handleOptions(costValue, shipping, additionalCostValue);
  shippingMethods.focus();
  const newdiv = document.createElement("div");
  newdiv.className = "selected-box p-2 rounded-1";

  const spanShipping = document.createElement("span");
  spanShipping.className = "fw-bold";
  spanShipping.innerHTML = shipping;
  newdiv.appendChild(spanShipping);

  const spanouter = document.createElement("span");

  const spanCost = document.createElement("span");
  spanCost.innerHTML = `$${costValue}`;
  spanouter.appendChild(spanCost);

  if (additionalCostValue) {
    const spanAdditional = document.createElement("span");
    spanAdditional.className = "subscript-cost";
    spanAdditional.innerHTML = `($${additionalCostValue})`;
    spanouter.appendChild(spanAdditional);
  }
  newdiv.appendChild(spanouter);

  const removebtn = document.createElement("button");
  removebtn.type = "button";
  removebtn.className = "px-2 py-0 rounded-1";
  removebtn.innerHTML = "Remove";
  removebtn.addEventListener("click", removeBlock);
  newdiv.appendChild(removebtn);

  divbox.appendChild(newdiv);
  setLocalStorage();
  emptyInputs();
}

// * These functions rounds the value to 2 decimal placesF
const roundedCost = (value) => {
  return Number(value).toFixed(2);
};

// * Submit button Enabled Functionality
function enableSubmit() {
  return selected.length <= 6 && selected.length !== 0
    ? (submitBtn.hidden = false)
    : (submitBtn.hidden = true);
}

// ? Fetch the data from the localstorage and map it according to it.
function loadFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("Selected"));
  if (data) {
    Array.from(data).forEach((value) => {
      createBox(value["costValue"], value["shipping"], value["additionalCost"]);
    });
  }
}

// ? Helper function to display error messages and add invalid class
const displayError = (element, message, errorElement) => {
  errorElement.innerHTML = message;
  element.classList.add("is-invalid");
};

// * Add button functionality various validation to check if any input box is empty or not
function doValidation() {
  const inputbox1 = commonValidation(
    inputsbox[0],
    true,
    /^(?!0+$)\d*\.?\d*[1-9]\d*$/,
    "Enter Correct Numbers or Number Greater than 0 *"
  );
  const inputbox2 = commonValidation(
    inputsbox[1],
    false,
    /^(?!0+$)\d*\.?\d*[1-9]\d*$/,
    "Enter Correct Numbers or Number Greater than 0 *"
  );
  if (inputbox1 && inputbox2) {
    createBox(
      roundedCost(inputbox1),
      shippingMethods.value,
      inputbox2 === true ? null : roundedCost(inputbox2)
    );
  }
}

// * on enter press button these should work
document.addEventListener("keypress", function (e) {
  if (e.key === "Enter" && selected.length !== 5) {
    doValidation();
  }
});

// * when add button is clicked, validate the input boxes
addbtn.addEventListener("click", doValidation);

// * Function to get the input box invalid message
function getErrorMsgElement(inputRef) {
  return inputRef.parentElement.parentElement.querySelector(".invalid-message");
}

// * To apply the validation to all input boxes
function commonValidation(inputref, required, regex, errMessage) {
  const inputValue = inputref.value;
  if (inputValue) {
    if (regex.test(String(inputValue).trim())) {
      return inputValue;
    } else {
      displayError(inputref, errMessage, getErrorMsgElement(inputref));
      return false;
    }
  } else {
    if (required) {
      displayError(
        inputref,
        "Field is required *",
        getErrorMsgElement(inputref)
      );
      return false;
    }
  }
  return true;
}

// ? Empty the value inside the textbox
function emptyInputs() {
  Array.from(inputsbox).forEach((value) => (value.value = ""));
}

// ? Remove button functionality
function removeBlock(e) {
  let targetBtn = e.target.parentElement.children[0].innerText;
  selected.pop();
  enableSubmit();
  options.push(targetBtn);
  addOptions(targetBtn);
  e.target.parentElement.remove();
  setLocalStorage();
}

// ? At each click Storing in the local Storage
function setLocalStorage() {
  const converted = JSON.stringify(selected);
  localStorage.setItem("Selected", converted);
}

// ? Event listener for button to take to table page
submitBtn.addEventListener("click", () => {
  window.location = "./table.html";
});

// * When the dom content is loaded retreive the data from local storage
document.addEventListener("DOMContentLoaded", loadFromLocalStorage);

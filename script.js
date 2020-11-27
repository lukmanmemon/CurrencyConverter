var input1 = document.getElementById("currentCurrency");
var input2 = document.getElementById("desiredCurrency");

// get the currency name that is selected from the drop-down lists
var sel = document.getElementById("currencyList1");
var selCopy = document.getElementById("currencyList2");
var currencyType1 = sel.options[sel.selectedIndex].value;
var currencyType2 = selCopy.options[selCopy.selectedIndex].value;

sel.addEventListener("change", function(e) {
   currencyType1 = e.target.value;
   console.log("C1 is: " + currencyType1);
});

selCopy.addEventListener("change", function(e) {
   currencyType2 = e.target.value;
   console.log("C2 is: " + currencyType2);
});

fetch("https://api.exchangeratesapi.io/latest?base=" + currencyType1 + "&symbols=" + currencyType2)
   .then(response => response.json())
   .then(data => {
      latestPrice = data.rates[currencyType2];
      console.log(latestPrice);
   });

fetch("https://api.exchangeratesapi.io/latest?base=" + currencyType2 + "&symbols=" + currencyType1)
   .then(response => response.json())
   .then(data => {
      latestPrice2 = data.rates[currencyType1];
      console.log(latestPrice2);
   });

// change input2 text when input1 text is changed
input1.addEventListener("input", function() {
   input2.value = (Math.round(input1.value * latestPrice * 100) / 100).toFixed(2);
   if (input1.value == "") {
      input2.value = "";
   }
});

// change input1 text when input2 text is changed
input2.addEventListener("input", function() {
   input1.value = (Math.round(input2.value * latestPrice2 * 100) / 100).toFixed(2);
   if (input2.value == "") {
     input1.value = "";
   }
});
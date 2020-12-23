var input1 = document.getElementById("currentCurrency");
var input2 = document.getElementById("desiredCurrency");

// get the currency name that is selected from the drop-down lists
var sel = document.getElementById("currencyList1");
var selCopy = document.getElementById("currencyList2");

var currencyType1 = sel.options[sel.selectedIndex].value;
var currencyType2 = selCopy.options[selCopy.selectedIndex].value;

function getUpdatedValue() {
   fetch("https://api.exchangeratesapi.io/latest?base=" + currencyType1 + "&symbols=" + currencyType2)
      .then(response => response.json())
      .then(data => {
         latestPrice = data.rates[currencyType2];
         input2.value = (Math.round(input1.value * latestPrice * 100) / 100).toFixed(2);
      });
}

// When currencyType1 changes
sel.addEventListener("change", function() {
   currencyType1 = this.value;
   getUpdatedValue();
});

// When currencyType2 changes
selCopy.addEventListener("change", function() {
   currencyType2 = this.value;
   getUpdatedValue();
});

getUpdatedValue();  
// change input2 text when input1 text changes
input1.addEventListener("input", function() {
   input2.value = (Math.round(input1.value * latestPrice * 100) / 100).toFixed(2);
   if (input1.value == "") {
      input2.value = "";
   }
});

fetch("https://api.exchangeratesapi.io/latest?base=" + currencyType2 + "&symbols=" + currencyType1)
   .then(response => response.json())
   .then(data => {
      latestPrice2 = data.rates[currencyType1];
   });

// change input1 text when input2 text changes
input2.addEventListener("input", function() {
   input1.value = (Math.round(input2.value * latestPrice2 * 100) / 100).toFixed(2);
   if (input2.value == "") {
     input1.value = "";
   }
});
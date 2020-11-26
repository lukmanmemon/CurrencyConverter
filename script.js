var input1 = document.getElementById("currentCurrency");
var input2 = document.getElementById("desiredCurrency");

// get the currency name that is selected from the drop-down lists
var sel = document.getElementById("currencyList1");
var selCopy = document.getElementById("currencyList2");
var currencyType1 = sel.options[sel.selectedIndex].value;
var currencyType2 = selCopy.options[selCopy.selectedIndex].value;

sel.addEventListener("change", function(e) {
   currencyType1 = e.target.value;
});

selCopy.addEventListener("change", function(e) {
   currencyType2 = e.target.value;
});

access_key = "Y7oectsUgkH5oeuY5L2JqJn8lo9fIO2IOth9QaEVsFo2svY"; // Your API access key
symbol = currencyType1 + "/" + currencyType2;
symbolReversed = currencyType2 + "/" + currencyType1;
amount = input1.value;
amount2 = input2.value;

fetch("https://fcsapi.com/api-v2/forex/latest?symbol=" + symbol + "&access_key=" + access_key)
   .then(response => response.json())
   .then(data => {
      latestPrice = data.response[0].price;
   });

// execute the conversion using the "converter" endpoint:
fetch("https://fcsapi.com/api-v2/forex/converter?symbol=" + symbol + "&amount=" + amount + "&access_key=" + access_key)
   .then(response => response.json())
   .then(data => {
      updatedAmount = input2.value = (Math.round(data.response.total * 100) / 100).toFixed(2);  
   });

// change input2 text when input1 text is changed
input1.addEventListener("input", function() {
   input2.value = (Math.round(input1.value * latestPrice * 100) / 100).toFixed(2);
   if (input1.value == "") {
      input2.value = "";
   }
});

fetch("https://fcsapi.com/api-v2/forex/latest?symbol=" + symbolReversed + "&access_key=" + access_key)
   .then(response => response.json())
   .then(data => {
      latestPrice2 = data.response[0].price; 
   });

// change input1 text when input2 text is changed
input2.addEventListener("input", function() {
   input1.value = (Math.round(input2.value * latestPrice2 * 100) / 100).toFixed(2);
   if (input2.value == "") {
     input1.value = "";
   }
});
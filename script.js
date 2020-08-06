var input1 = document.getElementById("currentCurrency");
var input2 = document.getElementById("desiredCurrency");

// get the currency name that is selected from the drop-down lists
var sel = document.getElementById("currencyList1");
var currencyType1 = sel.selectedOptions[0].text;
var selCopy = document.getElementById("currencyList2");
var currencyType2 = selCopy.selectedOptions[0].text;

sel.addEventListener("change", function() {
   currencyType1 = this.value;
   console.log(currencyType1);
});

selCopy.addEventListener("change", function() {
   currencyType2 = this.value;
   console.log(currencyType2);
});



access_key = "Y7oectsUgkH5oeuY5L2JqJn8lo9fIO2IOth9QaEVsFo2svY"; // Your API access key
symbol = currencyType1 + "/" + currencyType2;
symbolReversed = currencyType2 + "/" + currencyType1;
console.log(symbol);
amount = input1.value;
amount2 = input2.value;

$.ajax({ 
   url: "https://fcsapi.com/api-v2/forex/latest?symbol=" + symbol + "&access_key=" + access_key, 
   type: "POST", // GET or POST 
   dataType: "json", 
   success: function(data) { 
      latestPrice = data.response[0].price; 
   }
}); 

// execute the conversion using the "converter" endpoint:
$.ajax({ 
    url: "https://fcsapi.com/api-v2/forex/converter?symbol=" + symbol + "&amount=" + amount + "&access_key=" + access_key, 
    type: "POST", // GET or POST 
    dataType: "json", 
    success: function(data) { 
         updatedAmount = input2.value = data.response.total;
         // change input2 text when input1 text is changed
         input1.addEventListener("input", function() {
            
            input2.value = input1.value * latestPrice;
            if (input1.value == "") {
               input2.value = "";
            }
         });
    }
}); 

$.ajax({ 
   url: "https://fcsapi.com/api-v2/forex/latest?symbol=" + symbolReversed + "&access_key=" + access_key, 
   type: "POST", // GET or POST 
   dataType: "json", 
   success: function(data) { 
      latestPrice2 = data.response[0].price; 
   }
}); 

// change input1 text when input2 text is changed
input2.addEventListener("input", function() {
   input1.value = input2.value * latestPrice2;
   if (input2.value == "") {
     input1.value = "";
   }
});







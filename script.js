var input1 = document.getElementById("currentCurrency");
var input2 = document.getElementById("desiredCurrency");

// Get the currency name that is selected from the drop-down lists
var sel = document.getElementById("currencyList1");
var selCopy = document.getElementById("currencyList2");
var currencyType1 = sel.options[sel.selectedIndex].value;
var currencyType2 = selCopy.options[selCopy.selectedIndex].value;

function inputValidation(input) {
   input.onkeydown = function(e) {
      if (e.keyCode == 189) {
          return false;
      }
   }
}

function getUpdatedValue() {
   fetch("https://api.frankfurter.app/latest?from=" + currencyType1 + "&to=" + currencyType2)
      .then(response => response.json())
      .then(data => {
         latestPrice = data.rates[currencyType2];
         input2.value = (Math.round(input1.value * latestPrice * 100) / 100).toFixed(2);
      });
}

function getUpdatedValue2() {
   fetch("https://api.frankfurter.app/latest?from=" + currencyType2 + "&to=" + currencyType1)
      .then(response => response.json())
      .then(data => {
         latestPrice2 = data.rates[currencyType1];
      });
}

getUpdatedValue();
getUpdatedValue2();

// When currencyType1 changes
sel.addEventListener("change", function() {
   currencyType1 = this.value;
   getUpdatedValue();
   getUpdatedValue2();
   plotChart();
});

// When currencyType2 changes
selCopy.addEventListener("change", function() {
   currencyType2 = this.value;
   getUpdatedValue();
   getUpdatedValue2();
   plotChart();
});

// Change input2 text when input1 text changes
input1.addEventListener("input", function() {
   inputValidation(input1);
   input2.value = (Math.round(input1.value * latestPrice * 100) / 100).toFixed(2);
   if (input1.value == "") {
      input2.value = "";
   }
});

// Change input1 text when input2 text changes
input2.addEventListener("input", function() {
   inputValidation(input2);
   input1.value = (Math.round(input2.value * latestPrice2 * 100) / 100).toFixed(2);
   if (input2.value == "") {
     input1.value = "";
   }
});

var inputDate1 = document.getElementById("start");
var inputDate2 = document.getElementById("end");

var today = new Date().toISOString().slice(0, 10);
var priorDate = new Date(); 

// Get today's date
function getTodaysDate() {
   inputDate2.value = today;
}

// Get date from one year ago
function getYearOldDate() {
   var oneYearAgo = priorDate.getDate() - 365;
   priorDate.setDate(oneYearAgo);
   inputDate1.value = priorDate.toISOString().slice(0, 10);
}

getTodaysDate();
getYearOldDate();

// Sets the latest date user can select as today's date
document.getElementById("end").setAttribute("max", today);
document.getElementById("start").setAttribute("max", today);

var startDate = inputDate1.value;
var endDate = inputDate2.value;

inputDate1.addEventListener("change", function() {
   startDate = this.value;
   plotChart();
   incorrectDateRange();
});

inputDate2.addEventListener("change", function() {
   endDate = this.value;
   plotChart();
   incorrectDateRange();
});

function incorrectDateRange() {
   if (Date.parse(startDate) >= Date.parse(endDate)) {
      alert(startDate + " to " + endDate + " is an invalid range.\n\n Please select the correct start and end dates.");
   }
}

function BuildChart(labels, values, chartTitle) {
   var data = {
       labels: labels,
       datasets: [{
           label: chartTitle,
           data: values,
           backgroundColor: 'lightgrey',
           borderColor: 'darkblue',
           pointBackgroundColor: 'white',
           pointHoverBackgroundColor: 'cyan'
       }],
   };

   var ctx = document.getElementById("myChart").getContext('2d');
   if (window.bar != undefined) {
      window.bar.destroy(); 
   }
   window.bar = new Chart(ctx, {
       type: 'line',
       data: data,
       options: {
           responsive: false, 
           maintainAspectRatio: true,
           elements: {
               line: {
                  tension: 0 // disable curves
               },
               point: {
                  radius: 1
               }
           }, 
           scales: {
               xAxes: [{
                  scaleLabel: {
                     display: true
                  },
                  gridLines: {
                     display: false
                  }
               }],
               yAxes: [{
                  scaleLabel: {
                     display: true    
                  },
                  gridLines: {
                     display: true
                  }
               }]
           },
       }
   });

}

function plotChart() {
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         var data = JSON.parse(this.response);
         historicalRates = data.rates;

         arrayOfDates = [];
         arrayOfValues = [];
         for (let date in historicalRates) {
            arrayOfDates.push(date);
            currencyValue = historicalRates[date];
            for (let key in currencyValue) {
               arrayOfValues.push(currencyValue[key]);
            }
         }
         // Set dates for graph
         var labels = arrayOfDates;
         // Set values for graph
         var values = arrayOfValues;

         BuildChart(labels, values, "Currency conversion rate");
      }
   };
   xhttp.open("GET", "https://api.frankfurter.app/" + startDate + ".." + endDate + "?from=" + currencyType1 + "&to=" + currencyType2, true);
   xhttp.send();
 }

 plotChart();
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
   plotChart();
});

// When currencyType2 changes
selCopy.addEventListener("change", function() {
   currencyType2 = this.value;
   getUpdatedValue();
   plotChart();
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

var inputDate1 = document.getElementById("start");
var inputDate2 = document.getElementById("end");
// Get today's date
var today = new Date();
var dd = String("0" + today.getDate()).slice(-2);
var mm = String("0" + today.getMonth() + 1).slice(-2);
var yyyy = String(today.getFullYear());
today = yyyy + '-' + mm + '-' + dd;
// Get date from one month ago
var monthAgo = new Date();
monthAgo.setDate(monthAgo.getDate() - 30);
var ddOld = String("0" + monthAgo.getDate()).slice(-2);
var mmOld = String("0" + monthAgo.getMonth() + 2).slice(-2);
var yyyyOld = String(monthAgo.getFullYear());
monthAgoDate = yyyyOld + '-' + mmOld + '-' + ddOld;
console.log(monthAgo);
console.log(monthAgoDate);
// sets the latest date user can select as today's date
document.getElementById("end").setAttribute("max", today);
document.getElementById("start").setAttribute("max", today);

inputDate1.value = monthAgoDate;
inputDate2.value = today;
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
           label: chartTitle, // Name the series
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
         // Sort JSON Object by date
         function sortObjectByKeys(o) {
            return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
         }
         var sortedData = sortObjectByKeys(historicalRates);
         arrayOfDates = [];
         arrayOfValues = [];
         for (let date in sortedData) {
            arrayOfDates.push(date);
            currencyValue = sortedData[date];
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
   xhttp.open("GET", "https://api.exchangeratesapi.io/history?start_at=" + startDate + "&end_at=" + endDate + "&symbols=" + currencyType2 + "&base=" + currencyType1, true);
   xhttp.send();
 }

 plotChart();
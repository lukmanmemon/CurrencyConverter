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
   getHistoricalData();
   plotGraph();
});

// When currencyType2 changes
selCopy.addEventListener("change", function() {
   currencyType2 = this.value;
   getUpdatedValue();
   getHistoricalData();
   plotGraph();
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

var today = new Date();

var dd = String("0" + today.getDate()).slice(-2);
var mm = String("0" + today.getMonth() + 1).slice(-2);
var yyyy = String(today.getFullYear());
today = yyyy + '-' + mm + '-' + dd;
// sets the latest date user can select as today's date
document.getElementById("end").setAttribute("max", today);
document.getElementById("start").setAttribute("max", today);

inputDate2.value = today;
var startDate = inputDate1.value;
var endDate = inputDate2.value;

function getHistoricalData() {
   fetch("https://api.exchangeratesapi.io/history?start_at=" + startDate + "&end_at=" + endDate + "&symbols=" + currencyType2 + "&base=" + currencyType1)
   .then(response => response.json())
   .then(data => {
      historicalRate = data.rates;
      d = [];
      c = [];
      for(let date in historicalRate) {
         d.push(date);
         currencyValue = historicalRate[date];
         for(let key in currencyValue) {
            c.push(currencyValue[key]);
         }
      }
      console.log(d);
      console.log(c);
   });
}




inputDate1.addEventListener("change", function() {
   startDate = this.value;
   getHistoricalData();
   plotGraph();
});

inputDate2.addEventListener("change", function() {
   endDate = this.value;
   getHistoricalData();
   plotGraph();

});


function BuildChart(labels, values, chartTitle) {
   var data = {
       labels: labels,
       datasets: [{
           label: chartTitle, 
           data: values,
           backgroundColor: 'lightgrey',
           borderColor: 'darkblue',
           pointBackgroundColor: 'white'
               
           
       }],
   };

   var ctx = document.getElementById("myChart").getContext('2d');
   var myChart = new Chart(ctx, {
       type: 'line',
       data: data,
       options: {
           responsive: false, 
           maintainAspectRatio: true, 
           scales: {
               xAxes: [{
                       scaleLabel: {
                       display: true,
                       labelString: 'Date'
                   }
               }],
               yAxes: [{
                   scaleLabel: {
                       display: true,
                       labelString: 'Currency Rate'
                   }
               }]
           },
       }
   });

   return myChart;
}

function plotGraph() {
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         var data = JSON.parse(this.response);
         historicalRate = data.rates;
         d = [];
         c = [];
         for(let date in historicalRate) {
            d.push(date);
            currencyValue = historicalRate[date];
            for(let key in currencyValue) {
            c.push(currencyValue[key]);
            }
         }
         console.log(d);
         console.log(c);

         // Set dates for graph
         var labels = d;
      
         // Set values for graph
         var values = c;

         BuildChart(labels, values, "Currency conversion rate");
      }
   };
   xhttp.open("GET", "https://api.exchangeratesapi.io/history?start_at=" + startDate + "&end_at=" + endDate + "&symbols=" + currencyType2 + "&base=" + currencyType1, true);
   xhttp.send();
 }

 plotGraph();



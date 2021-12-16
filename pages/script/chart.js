let temp = [];
let humidity = [];
let lightLevel = [];
let xValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];


fetch('/chart', {method: 'GET'})
.then(async (response) => {
  const data = await response.json();

  for(const item of data){
    temp.unshift(item.temperature)
    humidity.unshift(item.humidity)
    lightLevel.unshift(item.lightlevel)
  }

  console.log(xValues, temp, humidity, lightLevel)
new Chart("myChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      borderColor: "blue",
      data: temp,
      fill: false
    },{
      data: humidity,
      borderColor: "green",
      fill:false
    },{
      data: lightLevel,
      borderColor: "yellow",
      fill: false
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Last 50 received data from LPC(Chronological order)"
    }
  }
});
})


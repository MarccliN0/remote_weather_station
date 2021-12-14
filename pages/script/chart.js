let temp = [];
let humidity = [];
let lightLevel = [];
let xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
11, 12, 13, 14, 15, 16, 17, 18, 19, 20];


fetch('/chart', {method: 'GET'})
.then(async (response) => {
  const data = await response.json();
  console.log(data);

  for(const item of data){
    temp.push(item.temperature)
    humidity.push(item.humidity)
    lightLevel.push(item.lightLevel)
  }

  console.log(xValues, temp, humidity)
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
      borderColor: "green",
      fill: false
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Data"
    }
  }
});
})


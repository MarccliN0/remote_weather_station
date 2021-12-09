var xValues = ["Lizard", "Snake", "Green plant", "Cactus", "Hamster", "Manual"];
var yValues = [78, 35, 67, 8, 21, 112];
var barColors = ["red", "green","blue","orange","brown","yellow"];

new Chart("myChart", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    title: {
      display: true,
      text: "Time used in all modes"
    }
  }
});
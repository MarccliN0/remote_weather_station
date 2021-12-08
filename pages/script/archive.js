let bTI = document.querySelector('.backToIndex')
let showhGraph = document.querySelector('.showGraph')

bTI.addEventListener('click', () => {
  window.location = '/index'
})

showhGraph.addEventListener('click', () =>  {
  var x = document.querySelector(".graph_button");
  if (x.hidden == true) {
    x.hidden = false;
  } else {
    x.hidden = true;
  }
})
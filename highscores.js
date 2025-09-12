const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const clearScoresBtn =document.getElementById("clearScoresBtn");

 highScoresList.innerHTML = highScores
 .map( score => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;
  })
    .join("");

  clearScoresBtn.addEventListener("click",()=>{
    localStorage.removeItem("highScores");
    highScoresList.innerHTML = "<lib> No High Scores Yet. </lib>";
  })

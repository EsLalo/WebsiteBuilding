const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const clearScoresBtn =document.getElementById("clearScoresBtn");

// Sort highest → lowest
highScores.sort((a, b) => b.score - a.score);

// Limit to top 10
highScores = highScores.slice(0, 10);

 highScoresList.innerHTML = highScores
 .map( score => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;
  })
    .join("");

  clearScoresBtn.addEventListener("click",()=>{
    localStorage.removeItem("highScores");
    highScoresList.innerHTML = "<li> No High Scores Yet. </li>";
  });
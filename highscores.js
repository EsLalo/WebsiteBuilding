// Get DOM elements
const highScoresList = document.getElementById("highScoresList");
const clearScoresBtn = document.getElementById("clearScoresBtn");

// Load scores or empty array
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// Sort highest → lowest
highScores.sort((a, b) => b.score - a.score);

// Limit to top 10
highScores = highScores.slice(0, 10);

// Render scores or show empty message
if (highScores.length === 0) {
    highScoresList.innerHTML = `<li>No High Scores Yet.</li>`;
} else {
    highScoresList.innerHTML = highScores
        .map(score => `<li class="high-score">${score.name} - ${score.score}</li>`)
        .join("");
}

// Clear button
clearScoresBtn.addEventListener("click", () => {
    localStorage.removeItem("highScores");
    highScoresList.innerHTML = `<li>No High Scores Yet.</li>`;
});


/*  COMMENT OUT Trying and testing new code temp comment

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

*/

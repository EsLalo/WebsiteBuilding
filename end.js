const username=document.getElementById('username');
const saveScoreBtn=document.getElementById('saveScoreBtn');
const mostRecentScore=localStorage.getItem('mostRecentScore');
const finalScore=document.getElementById('finalScore');

const highScores =JSON.parse(localStorage.getItem("highScores")) || [];
const MAX_HIGH_SCORES =5;

finalScore.innerText = mostRecentScore;

// Enable save button only when username has text
username.addEventListener('keyup',() => {
    saveScoreBtn.disabled = !username.value;
});

function saveHighScore(e) {
    e.preventDefault();

    const score = {
        score: parseInt(mostRecentScore),
        name: username.value
    };

    highScores.push(score);

    // Sort highest → lowest
    highScores.sort((a, b) => b.score - a.score);

    // Keep top 5
    highScores.splice(MAX_HIGH_SCORES);

    // Save back to localStorage
    localStorage.setItem('highScores', JSON.stringify(highScores));

    // Redirect (relative path for GitHub Pages)
    window.location.assign('highscores.html');
}



/*
const saveHighScore =(e) => {
    console.log("Clicked the Save Button");
    e.preventDefault();

    const score ={
        score: parseInt(mostRecentScore),
        name: username.value
    };
    highScores.push(score);
    highScores.sort((a,b)=> b.score - a.score);
    highScores.splice(MAX_HIGH_SCORES);
    localStorage.setItem('highScores',JSON.stringify(highScores));
    window.location.assign('/highscores.html');

};

*/

const username=document.getElementById('username');
const saveScoreBtn=document.getElementById('saveScoreBtn');
const mostRecentScore=localStorage.getItem('mostRecentScore');
const finalScore=document.getElementById('finalScore');

const highScores =JSON.parse(localStorage.getItem("highScores")) || [];
const MAX_HIGH_SCORES =5;


finalScore.innerText = mostRecentScore;

username.addEventListener('keyup',()=>{
    saveScoreBtn.disabled = !username.value;
});


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
// read in a file and search for top 10 to store in an array

// change html elements to outptu to page

document.addEventListener('DOMContentLoaded', function() {
  fetch('/getTestScores')
    .then(response => response.json())
    .then(dataArray => {
      // Parse the scores and usernames
      const scoresAndNames = dataArray.map(line => {
        const [score, username] = line.split(',');
        return { score: parseInt(score), username };
      });
      
      // Sort scores in descending order
      scoresAndNames.sort((a, b) => b.score - a.score);
      
      const scoreList = document.getElementById('scoreList');
      
      // Display the top 10 scores with numbering
      const topScores = scoresAndNames.slice(0, 10);
      topScores.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.username} - ${entry.score} WPM`;
        scoreList.appendChild(listItem);
      });
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
});

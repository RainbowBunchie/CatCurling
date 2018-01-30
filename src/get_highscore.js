//Get element in highscore page
const highscore = document.getElementById('highscore-list')
console.log(highscore)

//Reference
const database = firebase.database()
const ref = database.ref('highscore')
ref.on('value', gotData, errData)

function gotData(data){
	highscore.innerHTML =
		`<tr>`+
			`<th>Place</th>`+
			`<th>Name</th>`+
			`<th>Points</th>`+
		`</tr>`
	players = data.val().sort(function(a, b) { 
  		return b.score > a.score
	}).slice(0,5);

	let i = 1
	for(let entry of players){
		if(entry != null){
			highscore.innerHTML += 
			`<tr>`+
		    	`<td>${i++}</td>`+
		    	`<td>${entry.name}</td>`+
		    	`<td>${entry.score}</td>`+
	        `</tr>`;
		}
	}
}

function errData(err){
	console.log("Err: ")
	console.log(err)
}
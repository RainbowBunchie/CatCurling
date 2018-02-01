// Initialize Firebase
// TODO: Replace with your project's customized code snippet
export default function(name, points, id){
	const database = firebase.database();
	let ref = database.ref('highscore')
	ref.once('value', gotData, errData)

	function gotData(data){
		id = data.val().length;
		ref = database.ref('highscore' + '/' + id.toString()).set({
			name: name,
			score: points
		})
	}

	function errData(err){
		console.log("Err: ")
		console.log(err)
	}
}




var written_tweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//Filter to just the written tweets
	var tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	written_tweets = tweet_array.filter(function(tweet) {
		return tweet.written;
	});
}

function addEventHandlerForSearch() {
	//Search the written tweets as text is entered into the search box, and add them to the table
	var searchBox = document.getElementById('textFilter');
	var table = document.getElementById('tweetTable');

	// start w empty values, not ???
	document.getElementById('searchCount').innerText = 0;
	document.getElementById('searchText').innerText = "";

	searchBox.addEventListener('keyup', function() {
		var search = searchBox.value;
		document.getElementById('searchText').innerText = search;

		// clear table of contents if search empty
		if (search == "") {
			table.innerHTML = "";
			document.getElementById('searchCount').innerText = 0;
			return;
		}
		var matches = written_tweets.filter(function(tweet) {
			return tweet.writtenText.includes(search);
		});

		document.getElementById('searchCount').innerText = matches.length;
		
		var rows = "";
		for (var i = 0; i < matches.length; i++) {
			rows += matches[i].getHTMLTableRow(i + 1);
		}
		table.innerHTML = rows;
	});
}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});
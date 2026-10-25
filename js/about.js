function setClassText(className, value) {
	var elements = document.getElementsByClassName(className);
	for (var i = 0; i < elements.length; i++) {
		elements[i].innerText = value;
	}
}

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	// sort the tweets from oldest to newest
	tweet_array.sort(function(a, b) {
		return a.time - b.time;
	});

	// earlest and latest tweet dates
	var earliest = tweet_array[0].time;
	var latest = tweet_array[tweet_array.length - 1].time;

	// formatting dates to be like "tuesday, october 20, 2026"
	// also updates the spans
	var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
	document.getElementById('firstDate').innerText = earliest.toLocaleDateString('en-us', options);
	document.getElementById('lastDate').innerText = latest.toLocaleDateString('en-us', options);

	var completed = tweet_array.filter(function(tweet) { 
		return tweet.source == "completed_event"; });
	var achievements = tweet_array.filter(function(tweet) {
		return tweet.source == "achievement"; });
	var live = tweet_array.filter(function(tweet) {
		return tweet.source == "live_event"; });
	var misc = tweet_array.filter(function(tweet) {
		return tweet.source == "miscellaneous" });
	var total = tweet_array.length;

	// turns the count into a percentage
	function percent(count) {
		return math.format(count / total*100, {notation: 'fixed', precision: 2}) + "%";
}
	setClassText('completedEvents', completed.length);
	setClassText('completedEventsPct', percent(completed.length));
	setClassText('achievements', achievements.length);
	setClassText('achievementsPct', percent(achievements.length));
	setClassText('miscellaneous', misc.length);
	setClassText('miscellaneousPct', percent(misc.length));
	setClassText('liveEvents', live.length);
	setClassText('liveEventsPct', percent(live.length));

	// counts how many completed events include the text the user wrote
	var written = completed.filter(function(tweet) {
		return tweet.written;
	});
	setClassText('written', written.length);
	setClassText('writtenPct', math.format(written.length / completed.length *100,
		{notation: 'fixed', precision: 2}) + "%");
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
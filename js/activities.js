function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	var completed = tweet_array.filter(function(tweet) {
		return tweet.source == "completed_event";
	});

	var activityCounts = [];
	completed.forEach(function(tweet) {
		var found = false;
		for (var i = 0; i < activityCounts.length; i++) {
			if (activityCounts[i].activity == tweet.activityType) {
				activityCounts[i].count++;
				found = true;
		}
	}
	if (!found) {
		activityCounts.push({activity: tweet.activityType, count: 1});
		}
	});
	
	activityCounts.sort(function(a, b) {
		return b.count - a.count;
	});

	document.getElementById('numberActivities').innerText = activityCounts.length;
	document.getElementById('firstMost').innerText = activityCounts[0].activity;
	document.getElementById('secondMost').innerText = activityCounts[1].activity;
	document.getElementById('thirdMost').innerText = activityCounts[2].activity;




	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityCounts
	  },
	  "mark": "bar",
	  "encoding": {
		"x": {"field": "activity", "type": "nominal", "sort": "-y", "title": "Activity Type"},
		"y": {"field": "count", "type": "quantitative", "title": "Number of Tweets"},
	  }
	  
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	var first = activityCounts[0].activity;
	var second = activityCounts[1].activity;
	var third = activityCounts[2].activity;

	var distanceData = [];
	completed.forEach(function(tweet) {
		var type = tweet.activityType;
		if (type == first || type == second || type == third) {
			distanceData.push({time: tweet.time,distance: tweet.distance, activity: type});
		}
	});
	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "The distance people went in the top 3 activities each day",
	  "title": "Distance of the top three activities daily",
	  "data": {
	    "values": distanceData
	  },
	  "mark": "point",
	  "encoding": {
		"x": {"field": "time", "timeUnit": "day", "type": "ordinal", "title": "Time (Day)"},
		"y": {"field": "distance", "type": "quantitative", "title": "Distance"},
		"color": {"field": "activity", "type": "nominal", "title": "Activity"}
	  }
	};

	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	distance_vis_agg_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Average distance of the top three activities daily",
	  "title": "Average distance of the top three activities daily",
	  "data": {
	    "values": distanceData
	  },
	  "mark": "point",
	  "encoding": {
		"x": {"field": "time", "timeUnit": "day", "type": "ordinal", "title": "Time (Day)"},
		"y": {"field": "distance", "type": "quantitative", "aggregate": "mean", "title": "Mean Distance"},
		"color": {field: "activity", "type": "nominal", "title": "Activity"}
	  }
	};

	vegaEmbed('#distanceVisAggregated', distance_vis_agg_spec, {actions: false});

	// mean chart will be hidden at start
	var allChart = document.getElementById('distanceVis');
	var meanChart = document.getElementById('distanceVisAggregated');
	var button = document.getElementById('aggregate');
	meanChart.style.display = "none";
	allChart.style.display = "block";

	// the answers read from means chart
	document.getElementById('longestActivityType').innerText = "bike";
	document.getElementById('shortestActivityType').innerText = "walk";
	document.getElementById('weekdayOrWeekendLonger').innerText = "weekends";


	button.addEventListener('click', function() {
		if (meanChart.style.display == "none") {
			meanChart.style.display = "block";
			allChart.style.display = "none";
			button.innerText = "Show All Activities";
		} else {
			meanChart.style.display = "none";
			allChart.style.display = "block";
			button.innerText = "Show means";
		}
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
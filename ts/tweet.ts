class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        }
        if (this.text.includes("right now")) {
            return "live_event";
        }
        if (this.text.startsWith("Achieved") || this.text.includes("set a goal")) {
            return "achievement";
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        if (this.text.includes(" - ") && !this.text.includes("Check it out!")) {
            return true;
        }
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        // the user's text starts after - and ends at the link
        var start = this.text.indexOf(" - ") + 3;
        var end = this.text.indexOf("https://");
        if (end == -1) {
            end = this.text.length;
        }
        return this.text.substring(start, end);

    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        // find the unit
        var end = this.text.indexOf(" with @Runkeeper");
        if (end == -1) {
            end = this.text.indexOf(" - ");
        }
        // look before the users text
        var front = this.text.substring(0, end);
        var unitIndex = front.indexOf( " mi ");
        if (unitIndex == -1) {
            unitIndex = front.indexOf( " km ");
        }
        if (unitIndex == -1) {
            return "other";
        }
        return this.text.substring(unitIndex + 4, end);
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        var end = this.text.indexOf(" with @Runkeeper");
        if (end == -1) {
            end = this.text.indexOf(" - ");
        }
        var front = this.text.substring(0, end);
        var unitIndex = front.indexOf(" mi ");
        var isKm = false;
        if (unitIndex == -1) {
            unitIndex = front.indexOf(" km ");
            isKm = true;
        }
        if (unitIndex == -1) {
            return 0;
        }
        var start = this.text.indexOf(" a ") + 3;
        var number = parseFloat(this.text.substring(start, unitIndex));
        if (isKm) {
            return number / 1.609;
        }
        return number;
    }

    getHTMLTableRow(rowNumber:number):string {
        // wrap link in <a> tag
        var tweetText = this.text;
        var linkStart = this.text.indexOf("https://");
        if (linkStart != -1) {
            var linkEnd = this.text.indexOf(" ", linkStart);
            if (linkEnd == -1) {
                linkEnd = this.text.length;
            }
            
            var link = this.text.substring(linkStart, linkEnd);
            tweetText = this.text.substring(0, linkStart) + "<a href='" + link + "'>" + link + "</a>" + this.text.substring(linkEnd);
        }
        return "<tr><td>" + rowNumber + "</td><td>" + this.activityType + "</td><td>" + tweetText + "</td></tr>";
    }
}
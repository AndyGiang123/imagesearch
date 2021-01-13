var cheerio = require("cheerio"); 
var request = require("request");
var discord = require("discord.js");

var bot = new discord.Client();
//bot.login("token"); unique bot token

bot.on("ready", function() { console.log("bot is online!"); } );
bot.on("message", function(message) {

    var parts = message.content.split(" "); 
    if (parts[0] === "!pic") { 
        
        if(!parts[1]) { //!pic ______
            message.channel.send("Please enter something after '!pic'.")
        }
        else{
            image(message, parts);
        }
    }
    else if (parts[0] === "!help") {

        if(parts[1]){
            message.channel.send("Please just type '!help' for list of commands.");
        }
        else{
            const newEmbed = new discord.MessageEmbed()
            .setTitle("SearchBot Commands")
            .addFields(
                {name: 'Search for an image', value: '!pic {keyword} (for example, "!pic dog")'}
            )
            message.channel.send(newEmbed);
        }
    }
});
 
function image(message, parts) {

    var search = parts.slice(1).join(" ");
 
    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + search,
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    };

    request(options, function(error, response, responseBody) {
        if (error) {return;}
  
        $ = cheerio.load(responseBody);
        var links = $(".image a.link");
        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));

        console.log(urls);
        if (!urls.length) {
            message.channel.send("No image found!");
            return;
        }

        var urlToSend = urls[Math.floor(Math.random()*urls.length)]
    
        const newEmbed = new discord.MessageEmbed()
        .setTitle(search)
        .setImage(urlToSend);

        message.channel.send(newEmbed);
    });
}

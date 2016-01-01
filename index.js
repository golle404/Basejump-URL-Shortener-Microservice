var express = require("express");
var fs = require("fs");
var validator = require("validator");

var app = express();


app.get("/:id", function(req, res) {
	fs.readFile("data/short.json", {
		encoding: "utf-8"
	}, function(err, data) {
		if (err) throw err;
		fileData = JSON.parse(data);
		var match = fileData.data.filter(function(d) {
			return String(d.id) === req.params.id;
		})
		if (match.length === 0) {
			res.send(JSON.stringify({error: "No short url found for given input"}));
			} else {
			res.redirect(match[0].original_url);
		}
	})
})

app.get(/\/new\/(.+)/, function(req, res) {
	var url = req.params[0];
	var rsp = {};
	var host = req.headers["host"];

	if (validator.isURL(url)) {
		fs.readFile("data/short.json", {
			encoding: "utf-8"
		}, function(err, data) {
			if (err) throw err;
			fileData = JSON.parse(data);
			var match = fileData.data.filter(function(d) {
				return d.original_url === url;
			})
			if (match.length === 0) {
				rsp.original_url = url;
				rsp.short_url = host + "/" + fileData.data.length;
				fileData.data.push({
					original_url: url,
					id: fileData.data.length
				});
				fs.writeFile("data/short.json", JSON.stringify(fileData), {
					encoding: "utf-8"
				}, function(err) {
					if (err) throw err;
					console.log("saved");
				});
			} else {
				rsp.original_url = match[0].original_url;
				rsp.short_url = host + "/" + match[0].id;
			}
			res.send(JSON.stringify(rsp));
		})
	} else {
		rsp.error = "URL invalid";
		res.send(JSON.stringify(rsp));
	}
})
var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log("Listening at port " + port);
})
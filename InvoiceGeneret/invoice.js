var https = require("https");
var fs = require("fs");
var path = require("path");

function generateInvoice(invoice, filename, success, error) {
  var postData = JSON.stringify(invoice);
  var options = {
    hostname: "invoice-generator.com",
    port: 443,
    path: "/",
    method: "POST",
    headers: {
      Authorization: "Bearer sk_FYecfTXet0HmiQ6pAV9J69A3qzUdOWfz",
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  // Ensure the userInvoice directory exists
  const saveDirectory = path.join(__dirname, "userInvoice");
  if (!fs.existsSync(saveDirectory)) {
    fs.mkdirSync(saveDirectory, { recursive: true });
  }

  // Update the filename path to save in the userInvoice directory
  const filePath = path.join(saveDirectory, filename);

  var file = fs.createWriteStream(filePath);

  var req = https.request(options, function (res) {
    res
      .on("data", function (chunk) {
        file.write(chunk);
      })
      .on("end", function () {
        file.end();

        if (typeof success === "function") {
          success();
        }
      });
  });
  req.write(postData);
  req.end();

  if (typeof error === "function") {
    req.on("error", error);
  }
}

module.exports = { generateInvoice };

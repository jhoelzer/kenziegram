const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cssLink = `<link rel="stylesheet" type="text/css" media="screen" href="style.css" />`

const publicPath = "public/";
const uploadPath = './public/uploads/';
const port = 3000;

const app = express();
app.use(express.static(publicPath));
const upload = multer({ dest: uploadPath });

const uploadedFiles = [];

function displayImages (imageNames) {
    let outputString = "";
    for (let i = 0; i < imageNames.length; i++) {
        const name = imageNames[i];
        console.log(name);
        outputString += `<img src="uploads/${name}" style="width: 300px; margin: 20px;" />`;
    }
    return outputString;
}

app.get("/", function (req, res) {
    fs.readdir(uploadPath, function(err, items) {
        console.log(items);
        res.send(`
        ${cssLink}
        <h1 class="title">Welcome to Kenziegram!</h1>
        <form method="POST" enctype="multipart/form-data" action="http://localhost:3000/uploads">
            <fieldset>
                <div class="formDiv">
                    <label for="file">Choose a File</label>
                    <input type="file" id="file" name="myFile">
                    <button type="submit" class="button">Upload</button>
                </div>
            </fieldset>
        </form>
        <div id="displayDiv">
            ${displayImages(items)}
        </div>
        `);
    });
})

app.post("/uploads", upload.single("myFile"), function (req, res) {
    // request.file is the `myFile` file
    // request.body will hold the text fields, if there were any
    console.log("Uploaded: " + req.file.filename);
    uploadedFiles.push(req.file.filename);
    res.send(`
    ${cssLink}
    <div class="formDiv">
        <h1 class="title">Upload Successful</h1>
        <button class="button">
            <a href="/" id="link">Back</button>
    </div>
    <div id="uploadDisplay">
        <img src="uploads/${req.file.filename}" />
    </div>
    `);
});

app.listen(port, console.log("Listening on port " + port));
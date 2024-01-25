// koppel verwijzing
var d = document;

// lokale opslag van textarea ophalen
var savedContent = localStorage.getItem("notepadcontent");
var savedColor = localStorage.getItem("notepadColor");
var savedFontSize = localStorage.getItem("notepadFontSize");
var savedFontFamily = localStorage.getItem("notepadFontFamily");

// als er text opgeslagen is > laden
if (savedContent != null) {
    d.getElementById("textarea-notes").value = savedContent;
    applyFormatting(savedColor, savedFontSize, savedFontFamily);

    d.getElementById("colorSelect").value = savedColor;
    d.getElementById("fontSize").value = savedFontSize;
    d.getElementById("fontSelect").value = savedFontFamily;
}

// lokale opslag bijwerken
d.getElementById("textarea-notes").onkeyup = function () {
    var data = d.getElementById("textarea-notes").value;
    localStorage.setItem("notepadcontent", data);
};

// formatting bijwerken in lokale opslag
d.getElementById("colorSelect").addEventListener("change", function () {
    var selectedColor = this.value;
    d.getElementById("textarea-notes").style.color = selectedColor;
    localStorage.setItem("notepadColor", selectedColor);
});

d.getElementById("fontSize").addEventListener("change", function () {
    var selectedSize = this.value;
    d.getElementById("textarea-notes").style.fontSize = selectedSize;
    localStorage.setItem("notepadFontSize", selectedSize);
});

d.getElementById("fontSelect").addEventListener("change", function () {
    var selectedFontFamily = this.value;
    d.getElementById("textarea-notes").style.fontFamily = selectedFontFamily;
    localStorage.setItem("notepadFontFamily", selectedFontFamily);
});

// activatie van download en upload button
d.getElementById("downloadButton").addEventListener("click", function () {
    var fileName = prompt("Enter a name for the file:", "notepad.json");
    if (fileName !== null && fileName !== "") {
        download(fileName);
    }
});

d.getElementById("uploadButton").addEventListener("click", function () {
    d.getElementById("uploadFile").click();
});

// activatie file upload
d.getElementById("uploadFile").addEventListener("change", function () {
    handleFileSelect(this);
});

// text voorbereiden voor download
function download(fileName) {
    var content = d.getElementById("textarea-notes").value;
    var formatting = {
        color: d.getElementById("colorSelect").value,
        fontSize: d.getElementById("fontSize").value,
        fontFamily: d.getElementById("fontSelect").value
    };

    var fileContent = {
        text: content,
        formatting: formatting
    };

    var blob = new Blob([JSON.stringify(fileContent)], { type: "application/json" });
    var a = d.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName.endsWith(".json") ? fileName : fileName + ".json";
    d.body.appendChild(a);
    a.click();
    d.body.removeChild(a);
}

// bestand omzetten naar text met formatting
function handleFileSelect(input) {
    var file = input.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var fileContent = JSON.parse(e.target.result);

            var confirmUpload = confirm("Uploading a new file will overwrite the existing content. Are you sure?");
            if (confirmUpload) {
                d.getElementById("textarea-notes").value = fileContent.text;
                applyFormatting(fileContent.formatting.color, fileContent.formatting.fontSize, fileContent.formatting.fontFamily);
                localStorage.setItem("notepadcontent", fileContent.text);
                localStorage.setItem("notepadColor", fileContent.formatting.color);
                localStorage.setItem("notepadFontSize", fileContent.formatting.fontSize);
                localStorage.setItem("notepadFontFamily", fileContent.formatting.fontFamily);

                d.getElementById("colorSelect").value = fileContent.formatting.color;
                d.getElementById("fontSize").value = fileContent.formatting.fontSize;
                d.getElementById("fontSelect").value = fileContent.formatting.fontFamily;
            }
        };
        reader.readAsText(file);
    }
}

// formatting toepassen
function applyFormatting(color, fontSize, fontFamily) {
    d.getElementById("textarea-notes").style.color = color;
    d.getElementById("textarea-notes").style.fontSize = fontSize;
    d.getElementById("textarea-notes").style.fontFamily = fontFamily;
}

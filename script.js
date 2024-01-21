var d = document;

d.addEventListener('DOMContentLoaded', function(){
    var savedContent = localStorage.getItem("notepadcontent");
    if(savedContent != null){
        d.getElementById("textarea-notes").value = savedContent;
    }

    d.getElementById("textarea-notes").onkeyup = function(){
        var data = d.getElementById("textarea-notes").value;
        localStorage.setItem("notepadcontent", data);
    }

    d.getElementById("colorSelect").addEventListener("change", function() {
        var selectedColor = this.value;
        d.getElementById("textarea-notes").style.color = selectedColor;
    });

    d.getElementById("fontSize").addEventListener("change", function() {
        var selectedSize = this.value;
        d.getElementById("textarea-notes").style.fontSize = selectedSize;
    });

    d.getElementById("fontSelect").addEventListener("change", function() {
        var selectedFontFamily = this.value;
        d.getElementById("textarea-notes").style.fontFamily = selectedFontFamily;
    });

    d.getElementById("downloadButton").addEventListener("click", function() {
        download();
    });

    d.getElementById("uploadButton").addEventListener("click", function() {
        d.getElementById("uploadFile").click();
    });

    d.getElementById("uploadFile").addEventListener("change", function() {
        handleFileSelect(this);
    });
});

function download() {
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
    a.download = "notepad.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function handleFileSelect(input) {
    var file = input.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var fileContent = JSON.parse(e.target.result);
            d.getElementById("textarea-notes").value = fileContent.text;
            applyFormatting(fileContent.formatting.color, fileContent.formatting.fontSize, fileContent.formatting.fontFamily);
            localStorage.setItem("notepadcontent", fileContent.text);
            localStorage.setItem("notepadColor", fileContent.formatting.color);
            localStorage.setItem("notepadFontSize", fileContent.formatting.fontSize);
            localStorage.setItem("notepadFontFamily", fileContent.formatting.fontFamily);

            // Update label values after applying formatting
            d.getElementById("colorSelect").value = fileContent.formatting.color;
            d.getElementById("fontSize").value = fileContent.formatting.fontSize;
            d.getElementById("fontSelect").value = fileContent.formatting.fontFamily;
        };
        reader.readAsText(file);
    }
}

function applyFormatting(color, fontSize, fontFamily) {
    d.getElementById("textarea-notes").style.color = color;
    d.getElementById("textarea-notes").style.fontSize = fontSize;
    d.getElementById("textarea-notes").style.fontFamily = fontFamily;
}

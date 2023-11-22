document.addEventListener("DOMContentLoaded", function () {
    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        theme: "default",
        readOnly: false,
        autoCloseBrackets: true,
        matchBrackets: true,
    });

    var saveButton = document.getElementById("save");
    var newButton = document.getElementById("new");
    var footerInfo = document.getElementById("footer-info");
    var contentDiv = document.getElementById("content");

    saveButton.addEventListener("click", function () {
        var fileId = Math.random().toString(36).substring(7);
        var codeContent = editor.getValue();
        localStorage.setItem(fileId, codeContent);
        var link = "https://tg-botsnetwork.github.io/tgbotspaste//?file=" + fileId;
        document.getElementById("content").innerHTML = "Share this link: <a href='" + link + "' target='_blank'>" + link + "</a>";
        updateFooterInfo();
        saveButton.disabled = true; // Disable the save button after saving
    });


    newButton.addEventListener("click", function () {
        editor.setValue("");
        document.getElementById("content").innerHTML = "";
        saveButton.disabled = false; // Enable the save button when creating a new file
        updateFooterInfo();
    });

    // Check if a shared link is present in the URL
    var urlParams = new URLSearchParams(window.location.search);
    var fileIdParam = urlParams.get("file");

    if (fileIdParam) {
        // Display the shared code in read-only mode
        var sharedCode = localStorage.getItem(fileIdParam);
        if (sharedCode) {
            editor.setValue(sharedCode);
            editor.setOption("readOnly", "nocursor");
            saveButton.style.display = "none";
            newButton.style.display = "none";
        }
    }

    // Initial update of footer info
    updateFooterInfo();

    // Add listener to prevent viewing the page source
    document.addEventListener("keydown", function (e) {
        if (e.ctrlKey && e.key === "u") {
            e.preventDefault();
        }
    });

    // Add listener to prevent right-click context menu
    window.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });

    // Cookie Consent
    window.addEventListener("load", function () {
        window.cookieconsent.initialise({
            "palette": {
                "popup": { "background": "#f8f9fa" },
                "button": { "background": "#007bff" }
            },
            "position": "bottom",
            "content": {
                "message": "This website uses cookies to ensure you get the best experience on our website.",
                "dismiss": "Got it!",
                "link": "Learn more"
            }
        });
    });
});

function updateFooterInfo() {
    var content = editor.getValue();
    var wordCount = content.split(/\s+/).filter(function (word) {
        return word.length > 0;
    }).length;
    var lineCount = editor.lineCount();
    var length = content.length;

    var lineWrap = editor.getOption("lineWrapping");
    var wrapInfo = lineWrap ? "Wrapped" : "Not Wrapped";

    var infoText = `Words: ${wordCount} | Lines: ${lineCount} | Length: ${length} | Line Wrap: ${wrapInfo}`;
    footerInfo.textContent = infoText;
}

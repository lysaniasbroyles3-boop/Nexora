
// ==========================================
// NEXORA DOCS - DOCUMENT ENGINE
// ==========================================

const editor = document.getElementById("editor");
const documentName = document.getElementById("documentName");

const STORAGE_KEY = "nexora_docs_document_v1";
const NAME_KEY = "nexora_docs_name_v1";

// Formatting
function format(command) {
    editor.focus();
    document.execCommand(command, false, null);
    updateCounts();
    saveDocument();
}

function setFont(font) {
    editor.focus();
    document.execCommand("fontName", false, font);
    saveDocument();
}

function setSize(size) {
    editor.focus();
    document.execCommand("fontSize", false, size);
    saveDocument();
}

function setParagraph(tag) {
    editor.focus();
    document.execCommand("formatBlock", false, tag);
    saveDocument();
}

function setTextColor(color) {
    editor.focus();
    document.execCommand("foreColor", false, color);
    saveDocument();
}

function highlightText(color) {
    editor.focus();

    const supported = document.execCommand(
        "hiliteColor", false, color
    );

    if (!supported) {
        document.execCommand("backColor", false, color);
    }

    saveDocument();
}

// Insert a link
function insertLink() {
    const url = prompt("Enter the website address:");

    if (!url) return;

    try {
        const parsed = new URL(url);

        if (!["http:", "https:"].includes(parsed.protocol)) {
            alert("Please use an HTTP or HTTPS website address.");
            return;
        }

        editor.focus();
        document.execCommand("createLink", false, parsed.href);
        saveDocument();

    } catch {
        alert("Please enter a valid website address.");
    }
}

// Insert a table
function insertTable() {
    const rows = Number(prompt("How many rows? (1-10)", "3"));
    const columns = Number(prompt("How many columns? (1-8)", "3"));

    if (
        !Number.isInteger(rows) ||
        !Number.isInteger(columns) ||
        rows < 1 || rows > 10 ||
        columns < 1 || columns > 8
    ) {
        alert("Please enter valid table dimensions.");
        return;
    }

    let html = "<table><tbody>";

    for (let r = 0; r < rows; r++) {
        html += "<tr>";

        for (let c = 0; c < columns; c++) {
            html += "<td>&nbsp;</td>";
        }

        html += "</tr>";
    }

    html += "</tbody></table><p></p>";

    editor.focus();
    document.execCommand("insertHTML", false, html);
    saveDocument();
}

// Insert an image from a website URL
function insertImage() {
    const url = prompt("Enter an image URL:");

    if (!url) return;

    try {
        const parsed = new URL(url);

        if (!["http:", "https:"].includes(parsed.protocol)) {
            alert("Please enter a valid image URL.");
            return;
        }

        const image = document.createElement("img");
        image.src = parsed.href;
        image.alt = "Inserted document image";

        editor.focus();

        const selection = window.getSelection();

        if (selection && selection.rangeCount > 0 &&
            editor.contains(selection.anchorNode)) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(image);
        } else {
            editor.appendChild(image);
        }

        saveDocument();

    } catch {
        alert("Please enter a valid image URL.");
    }
}

// Document word and character counter
function updateCounts() {
    const text = editor.innerText.trim();

    const words = text
        ? text.split(/\s+/).length
        : 0;

    document.getElementById("wordCount").textContent =
        words + (words === 1 ? " word" : " words");

    document.getElementById("charCount").textContent =
        text.length + " characters";
}

// Save document
function saveDocument() {
    const status = document.getElementById("saveStatus");
    const message = document.getElementById("saveMessage");

    try {
        localStorage.setItem(STORAGE_KEY, editor.innerHTML);
        localStorage.setItem(NAME_KEY, documentName.value);

        status.textContent = "Saved ✓";
        message.textContent = "Your work is saved locally.";

    } catch (error) {
        status.textContent = "Save failed";
        message.textContent = "Browser storage is unavailable or full.";
    }

    updateCounts();
}

// Load document
function loadDocument() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const savedName = localStorage.getItem(NAME_KEY);

        if (saved !== null) {
            editor.innerHTML = saved;
        }

        if (savedName) {
            documentName.value = savedName;
        }

    } catch (error) {
        console.error("Could not load saved document.", error);
    }

    updateCounts();
}

// Create a new document
function newDocument() {
    if (!confirm("Create a new document? Your current document will be replaced.")) {
        return;
    }

    editor.innerHTML = "<h1>Untitled Document</h1><p>Start writing...</p>";
    documentName.value = "Untitled Document";

    saveDocument();
}

// Download document as an HTML file
function downloadDocument() {
    const safeName = documentName.value
        .replace(/[\\/:*?"<>|]/g, "")
        .trim() || "NEXORA-Document";

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${escapeHTML(safeName)}</title>
<style>
body {
    font-family: Arial, sans-serif;
    max-width: 850px;
    margin: 40px auto;
    padding: 25px;
    line-height: 1.6;
}
table { border-collapse: collapse; width: 100%; }
td, th { border: 1px solid #777; padding: 8px; }
img { max-width: 100%; }
</style>
</head>
<body>
${editor.innerHTML}
</body>
</html>`;

    const blob = new Blob([html], {
        type: "text/html;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = safeName + ".html";
    link.click();

    URL.revokeObjectURL(url);
}

// Escape document title
function escapeHTML(value) {
    return value.replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Menu information
function showMenuInfo(menu) {
    const messages = {
        File: "Use New to create a document, Download to export it, or Print to print it.",
        Edit: "Use the formatting toolbar for undo, redo, and editing.",
        View: "Your editor automatically adjusts to your screen size.",
        Insert: "Add tables, images, and links using the toolbar.",
        Format: "Change fonts, colors, headings, and alignment.",
        Tools: "Use the word counter and NEXORA AI writing assistant."
    };

    alert(messages[menu] || "NEXORA Docs");
}

// AI assistant preparation
function suggestAI(suggestion) {
    document.getElementById("aiPrompt").value = suggestion;
    document.getElementById("aiPrompt").focus();
}

function requestAI() {
    const promptText =
        document.getElementById("aiPrompt").value.trim();

    const response =
        document.getElementById("aiResponse");

    if (!promptText) {
        response.textContent = "Please enter a writing request first.";
        return;
    }

    response.textContent =
        "Your request is ready: " + promptText +
        "\n\nAn AI service has not been connected yet. " +
        "We'll connect this panel to a secure AI service in a later step.";
}

// Autosave when typing
let saveTimer;

editor.addEventListener("input", () => {
    document.getElementById("saveStatus").textContent = "Saving...";

    clearTimeout(saveTimer);

    saveTimer = setTimeout(() => {
        saveDocument();
    }, 500);

    updateCounts();
});

// Save document name
documentName.addEventListener("input", () => {
    saveDocument();
});

// Start NEXORA Docs
loadDocument();

console.log("NEXORA Docs loaded successfully!");

$(document).ready(function() {
    const markdownInput = $('#markdown-input');
    const livePreview = $('#live-preview');
    const downloadMdButton = $('#download-md');
    const downloadHtmlButton = $('#download-html');
    const converter = new showdown.Converter();

    // Toolbar buttons
    const boldBtn = $('#bold-btn');
    const italicBtn = $('#italic-btn');
    const headingBtn = $('#heading-btn');
    const listBtn = $('#list-btn');
    const linkBtn = $('#link-btn');
    const undoBtn = $('#undo-btn');
    const redoBtn = $('#redo-btn');
    const spellcheckBtn = $('#spellcheck-btn');
    const togglePreviewBtn = $('#toggle-preview-btn');

    let history = [markdownInput.val()];
    let historyIndex = 0;
    let previewVisible = true;

    // Initial example Markdown
    const exampleMarkdown = `# Welcome to my Markdown Editor!

    Here's some basic syntax:

    *   **Bold text**
    *   _Italic text_
    *   A list:
        *   Item 1
        *   Item 2

    [Link to Google](https://www.google.com)
    `;

    markdownInput.val(exampleMarkdown);
    updatePreview();
    history = [markdownInput.val()]; // Reset history after initial load

    function updatePreview() {
        const markdownText = markdownInput.val();
        const html = converter.makeHtml(markdownText);
        livePreview.html(html);
    }

    function saveHistory() {
        history = history.slice(0, historyIndex + 1);
        history.push(markdownInput.val());
        historyIndex++;
        if (history.length > 100) { // Limit history size
            history = history.slice(history.length - 100);
            historyIndex = history.length - 1;
        }
    }

    markdownInput.on('input', function() {
        updatePreview();
        saveHistory();
    });

    downloadMdButton.on('click', function() {
        const markdownText = markdownInput.val();
        downloadFile(markdownText, 'markdown.md', 'text/markdown');
    });

    downloadHtmlButton.on('click', function() {
        const htmlContent = livePreview.html();
        downloadFile(htmlContent, 'markdown.html', 'text/html');
    });

    function downloadFile(content, fileName, contentType) {
        const a = document.createElement('a');
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    // Toolbar functionality
    boldBtn.on('click', function() {
        insertTextAtCursor('**strong text**');
    });

    italicBtn.on('click', function() {
        insertTextAtCursor('*italicized text*');
    });

    headingBtn.on('click', function() {
        insertTextAtCursor('# Heading 1');
    });

    listBtn.on('click', function() {
        insertTextAtCursor('* List item');
    });

    linkBtn.on('click', function() {
        insertTextAtCursor('[Link text](http://example.com)');
    });

    undoBtn.on('click', function() {
        if (historyIndex > 0) {
            historyIndex--;
            markdownInput.val(history[historyIndex]);
            updatePreview();
        }
    });

    redoBtn.on('click', function() {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            markdownInput.val(history[historyIndex]);
            updatePreview();
        }
    });

   spellcheckBtn.on('click', function() {
        markdownInput.attr('spellcheck', markdownInput.attr('spellcheck') === 'false' ? 'true' : 'false');
    });

    togglePreviewBtn.on('click', function() {
        previewVisible = !previewVisible;
        $('.preview-section').toggle(previewVisible);
    });

    function insertTextAtCursor(text) {
        const start = markdownInput[0].selectionStart;
        const end = markdownInput[0].selectionEnd;
        const currentValue = markdownInput.val();
        markdownInput.val(currentValue.substring(0, start) + text + currentValue.substring(end));
        markdownInput[0].selectionStart = start + text.length;
        markdownInput[0].selectionEnd = start + text.length;
        updatePreview();
        saveHistory();
    }
});
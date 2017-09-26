var dropbox = document.getElementById('dropbox');
var pdfText = document.getElementById('pdfText');
var popup = document.getElementById('popup');

dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);
pdfText.addEventListener("mouseup", getSelectedText, false);
pdfText.addEventListener("mouseout", getSelectedText, false);
pdfText.addEventListener("contextmenu", openPopup, false);
pdfText.addEventListener("click", function(){
    popup.hidden = true;
});
pdfText.addEventListener("blur", function(){
    //popup.hidden = true;
});

function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
}

function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;

    if (files[0].type != 'application/pdf') {
        return;
    }

    handleFiles(files);
}

var mySelection;

function getSelectedText(e) {
    mySelection = window.getSelection().toString();
}

function openPopup(e) {
    e.preventDefault();
    var d = document.getElementById('popup');
    if (mySelection != '') {
        d.hidden = false;
        d.style.left = e.pageX+'px';
        d.style.top = e.pageY+'px';
    }
    else d.hidden = true;
}

function setData(field) {
    document.getElementById(field).value = mySelection;
    popup.hidden = true;
    
}

function proccesedFileView() {
    document.getElementById('pdfText').hidden = false;
    document.getElementById('frame').hidden = true;
}

function originalFileView() {
    document.getElementById('pdfText').hidden = true;
    document.getElementById('frame').hidden = false;
    popup.hidden = true;
}

function updateDueDate(selectedObject) {
    var index= selectedObject.selectedIndex;
    var item = selectedObject[index].textContent;
    document.getElementById('dueDate').value = item;
}

function resetFields() {
    document.getElementById('fileNum').value = "";
    document.getElementById('deliveryDate').value = "";
    document.getElementById('dueDate').value = "";
    document.getElementById('selectDates').innerHTML = "";
    document.getElementById('pdfText').textContent = "";
    document.getElementById('commentText').value = "";
    document.getElementById('parsingStatus').innerHTML = "Parsing status: "
}

function newDueDate(obj) {
    console.log(obj.value);
}
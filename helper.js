var dropbox = document.getElementById('dropbox');
var pdfText = document.getElementById('pdfText');

dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);
pdfText.addEventListener("mouseup", getSelectedText, false);
pdfText.addEventListener("mouseout", getSelectedText, false);

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

function getSelectedText() {
    mySelection = window.getSelection().toString();
}

function addComment() {
    if (mySelection != undefined) {
        document.getElementById('commentText').textContent = mySelection; 
    }
    else {
        console.log('nothing selected');
    }

}

function proccesedFileView() {
    document.getElementById('pdfText').hidden = false;
    document.getElementById('frame').hidden = true;
}

function originalFileView() {
    document.getElementById('pdfText').hidden = true;
    document.getElementById('frame').hidden = false;
}

function updateStatus(selectedObject) {
    // var index = selectedObject.selectedIndex;
    // console.log(selectedObject[index].textContent);
}

function resetFields() {
    document.getElementById('fileNum').value = "";
    document.getElementById('deliveryDate').value = "";
    document.getElementById('selectDates').innerHTML = "";
    document.getElementById('newDate').value = "";
    document.getElementById('pdfText').textContent = "";
    document.getElementById('commentText').textContent = "Comment here";
}

function newDueDate(obj) {
    console.log(obj.value);
}
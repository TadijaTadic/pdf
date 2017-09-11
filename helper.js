var dropbox = document.getElementById('dropbox');
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);

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

handleFiles(files);
}

function updateStatus(selectedObject) {
    // var index = selectedObject.selectedIndex;
    // console.log(selectedObject[index].textContent);
}

function resetFields() {
    document.getElementById('fileNum').value = "";
    document.getElementById('deliveryDate').value = "";
    document.getElementById('selectDates').innerHTML = "";
}

function newDueDate(obj) {
    console.log(obj.value);
}
var table = document.getElementById("uploadedFilesTable");
var uploadedFiles;
var rowIndex;
var fileObject;

function handleFiles(files) {
  deleteTable();
  uploadedFiles = files;
  
  for (var index = 0; index < files.length; index++) {
    var file = files[index];

    var row = table.insertRow(index);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    var fileNumber = window.localStorage.getItem(`${file.name}+"ID"`);

    cell1.innerHTML = fileNumber ? fileNumber : "";
    cell1.style.width = "30%";
    cell2.innerHTML = `<button type="button" class="btn btn-link">${file.name}</button>`;

    row.addEventListener("mousedown", rowClicked);
    cell2.addEventListener("click", fileClicked);
  }

  var header = table.createTHead();
  
  var hRow = header.insertRow(0);     
  var hCell1 = hRow.insertCell(0);
  var hCell2 = hRow.insertCell(1);

  hCell1.innerHTML = "<b>File Number</b>";
  hCell2.innerHTML = "<b>File Name</b>";
}

function rowClicked() {
  rowIndex = this.rowIndex-1;
}

function fileClicked() {
  fileObject = uploadedFiles[rowIndex];
  document.getElementById('uploadPage').hidden = true;
  document.getElementById('wrapper').hidden = false;
  openForm();
}

function deleteTable() {
  if (table.rows.length > 0) {
    table.deleteTHead();
    table.removeChild(table.getElementsByTagName("tbody")[0]);
  }
}
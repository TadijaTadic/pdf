var selectedFile, fileUrl, fileName;

var uploadedDoucuments = window.localStorage;

var user = 'dc8e7c4e42eb80daa06cbf024f9898671c33f62d';
var parser_id = 'oofdtinkseah';

function handleFiles(files) {
  resetFields();
  selectedFile = files[0];
  fileUrl = URL.createObjectURL(selectedFile);
  var el = document.getElementById('frame');
  el.src = fileUrl;
  el.hidden = false;
  document.getElementById('pdfText').hidden = true;
  document.getElementById('btnOriginal').hidden = false;
  document.getElementById('btnProcessed').hidden = false;

  if (uploadedDoucuments.getItem(selectedFile.name) != undefined) {
    getData();
  }
  else {
    uploadPdf();
  }
  //uploadPdf();
}

//GET https://api.docparser.com/v1/results/<PARSER_ID>/<DOCUMENT_ID>
function getData() {
  var document_id = uploadedDoucuments.getItem(selectedFile.name);
  var url = `https://api.docparser.com/v1/results/${parser_id}/${document_id}`;
  var req = new XMLHttpRequest();
  req.addEventListener("loadend", getParsedData);
  req.open('GET', url, true);
  req.responseType = 'json';
  req.setRequestHeader("Authorization", "Basic " + user);
  req.send();
}

//POST https://api.docparser.com/v1/document/upload/<PARSER_ID>
function uploadPdf() {
  var url = `https://api.docparser.com/v1/document/upload/${parser_id}`;
  var formData = new FormData();
  formData.append("file", selectedFile);

  var req = new XMLHttpRequest();
  req.addEventListener("loadend", uploadEnd);
  req.open('POST', url, true);
  req.responseType = 'json';
  req.setRequestHeader("Authorization", "Basic " + user);
  req.send(formData);
}

var counter = 0;

function getParsedData() {
  var result = this.response;

  if (result.error != undefined) {
    if (counter >= 10) {
      console.log('Parsing is taking too long')
      return;
    } else {
      counter++;
      console.log(counter);
      window.setTimeout(getData, 2000);
      return;
    }    
  }
  counter = 0;
  var number = result[0].ep__tracking_number;
  var date1 = result[0].ep__delivery_date_1;
  var date2 = result[0].ep__delivery_date_2;
  var due = result[0].office_action_date;
  var text = result[0].whole_text;
  var id_number = number != null ? number.number : undefined;
  var delivery_date1 = date1 != null ? date1.formatted : undefined;
  var delivery_date2 = date2 != null ? date2.formatted : undefined;
  var due_date = due != null ? due : undefined;

  document.getElementById('form').fileNum.value = id_number != undefined ? id_number : "";
  
  if (delivery_date1 != undefined || delivery_date2 != undefined) {
    var delivery_date = delivery_date1 != undefined ? delivery_date1 : delivery_date2;
    document.getElementById('form').deliveryDate.value = delivery_date;
  }
  if (due_date != null) {
    if (!Array.isArray(due_date)) {
      var select = document.getElementById('selectDates');
      var options = document.createElement('option');
      options.value = due_date.formatted;
      options.textContent = due_date.formatted;
      select.appendChild(options);
    }
    else {
      due_date.forEach(function(element, index) {
        var select = document.getElementById('selectDates');
        var options = document.createElement('option');
        options.value = element.formatted;
        options.textContent = element.formatted;
        select.appendChild(options);
      });
    }
  }
  if (text != null) {
    document.getElementById('pdfText').textContent = text;
  }  
}

function uploadEnd() {
  var result = this.response;
  uploadedDoucuments.setItem(selectedFile.name, result.id);
  window.setTimeout(getData, 2000);
}
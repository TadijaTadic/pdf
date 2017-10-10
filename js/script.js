var selectedFile, fileUrl, fileName;

var uploadedDoucuments = window.localStorage;

var user = 'dc8e7c4e42eb80daa06cbf024f9898671c33f62d';
var parser_id = 'oofdtinkseah';
var intervalId;

function openForm() {
  resetFields();
  selectedFile = fileObject;
  fileUrl = URL.createObjectURL(selectedFile);
  var el = document.getElementById("frame");
  el.src = fileUrl;
  el.hidden = false;
  document.getElementById("pdfText").hidden = true;
  document.getElementById("btnOriginal").hidden = false;
  document.getElementById("btnProcessed").hidden = false;

  if (uploadedDoucuments.getItem(selectedFile.name) != undefined) {
    getData();
  }
  else {
    uploadPdf();
  }
  
}

//GET https://api.docparser.com/v1/results/<PARSER_ID>/<DOCUMENT_ID>
function getData() {
  var document_id = uploadedDoucuments.getItem(selectedFile.name);
  var url = `https://api.docparser.com/v1/results/${parser_id}/${document_id}`;
  var req = new XMLHttpRequest();
  req.addEventListener("loadend", getParsedData, false);
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
var timeoutId;

function getParsedData() {
  var result = this.response;

  if (result.error != undefined) {
    if (counter == 10) {
      document.getElementById('parsingStatus').innerHTML = 'Parsing is taking too long.';
      counter = 0;
      return;
    } else {
      counter++;
      document.getElementById('parsingStatus').innerHTML = 'Document is being parsed.';
      progressBar(counter*10);
      timeoutId = window.setTimeout(getData, 2000);
      return;
    }   
  }
  counter = 0;
  document.getElementById('parsingStatus').innerHTML = 'File parsed.';
  progressBar(100);

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
      document.getElementById('dueDate').value = due_date.formatted;
      var menu = document.getElementById('dropMenu');
      var button = document.createElement("button");
      button.addEventListener("click", setDueDate);
      button.type = "button";
      button.className = "dropdown-item";
      let text = document.createTextNode(due_date.formatted);
      button.appendChild(text);
      menu.appendChild(button);
    }
    else {
      due_date.forEach(function(element, index) {
        document.getElementById('dueDate').value = due_date.formatted;
        var menu = document.getElementById('dropMenu');
        var button = document.createElement("button");
        button.addEventListener("click", setDueDate);
        button.type = "button";
        button.className = "dropdown-item";
        let text = document.createTextNode(element.formatted);
        button.appendChild(text);
        menu.appendChild(button);
      });
      document.getElementById('dueDate').value = due_date[0].formatted;
    }
  }
  if (text != null) {
    document.getElementById('pdfText').textContent = text;
  }

  window.localStorage.setItem(`${selectedFile.name}+"ID"`, id_number);
}

function uploadEnd() {
  var result = this.response;
  uploadedDoucuments.setItem(selectedFile.name, result.id);
  window.setTimeout(getData, 2000);
}

function progressBar(width) {
  var pbar = document.getElementById('pbar');
  var current = pbar.style.width;
  var next = width;
  var str = next.toString();
  var final = str + '%';
  pbar.style.width = final;
}

function cancelGetData() {
  counter = 0;
  progressBar(0);
  document.getElementById('parsingStatus').innerHTML = 'Operation canceled';
  clearTimeout(timeoutId);
}

function sendData(form) {
  var fileNumber = form.elements.fileNum.value;
  var deliveryDate = form.elements.deliveryDate.value.trim();
  var dueDate = form.elements.dueDate.value.trim();
  var date = new Date();
  var commentText = form.elements.commentText.value;
  var status = parseInt(form.elements.newStatus.value, 10);

  var parts = deliveryDate.split(".");
  deliveryDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
  parts = dueDate.split(".");
  dueDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
  var today = formatDate(date);

  var data = JSON.stringify({
    "Code": fileNumber,
    "DeliveryDate": deliveryDate,
    "Date": today,
    "Note": commentText,
    "OrderStatusId": status,
    "CustomData": { "dueDate": dueDate }, 
    "UserId": 7364
  });
  var url = "http://order.demo.reqster.com/api/Order";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("SkipAuth", "true");
  xhr.send(data);

  xhr.onreadystatechange = function() {
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      alert("Your data is successfully sent.");
      resetFields();
      goBack();
    }
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 400) {
      var result = xhr.responseText;
      var message = JSON.parse(result);
      alert(xhr.responseText);
    }
  }
}

function formatDate(date) {
  var dd = date.getDate();
  var mm = date.getMonth()+1;
  var yyyy = date.getFullYear();
  if(dd<10) {
    dd = '0'+dd
  } 
  if(mm<10) {
      mm = '0'+mm
  } 
  return yyyy + '.' + mm + '.' + dd;
}

function setDueDate() {
  document.getElementById("dueDate").value = this.textContent;
  document.getElementById("popupDates").hidden = true;
}

function chooseDates(e) {
  var d = document.getElementById('popupDates');
  d.hidden = false;
  d.style.left = e.pageX-e.offsetX+85+'px';
  d.style.top = e.pageY-e.offsetY+'px';
}

function hidePopup() {
  setTimeout(() => document.getElementById("popupDates").hidden = true, 100);
}

function removeElementsFromPopup() {
  var parent = document.getElementById("dropMenu");
  var children = Array.from(parent.children);
  children.forEach(function(child) {
    parent.removeChild(child);
  }, this);
}

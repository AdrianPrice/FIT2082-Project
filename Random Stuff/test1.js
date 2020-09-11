"use strict";

var _launcher = require("../launcher.js");

var GRAPHING = _interopRequireWildcard(_launcher);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var inputElement = document.getElementById("input");
document.getElementById("submitGraph").onclick = addGraph;

inputElement.addEventListener("change", getFile);
var input;
function getFile(event) {
  input = event.target;
  if ('files' in input && input.files.length > 0) {
    placeFileContent(document.getElementById('content-target'), input.files[0]);
  }
}
var formattedContent;
function placeFileContent(target, file) {
  readFileContent(file).then(function (content) {
    formattedContent = formatData(content);
  }).catch(function (error) {
    return console.log(error);
  });
}

function readFileContent(file) {
  var reader = new FileReader();
  return new Promise(function (resolve, reject) {
    reader.onload = function (event) {
      return resolve(event.target.result);
    };
    reader.onerror = function (error) {
      return reject(error);
    };
    reader.readAsText(file);
  });
}

function formatData(data) {
  if (document.getElementById("Bar").checked) {

    return data.split('\n');
  } else {

    var dataVal = data.split('\n');
    console.log(dataVal);
    dataVal = dataVal.map(function (elem) {
      return elem.split(",");
    });
    dataVal = dataVal.map(function (elem) {
      return [parseInt(elem[0]), parseInt(elem[1])];
    });
    console.log(dataVal);
    return dataVal;
  }
}

function addGraph() {
  var message = document.getElementById("successMessage");
  message.style.visibility = "visible";
  if (document.getElementById("Bar").checked || document.getElementById("Scatter").checked) {
    if (inputElement.value != "") {
      var title = document.getElementById("titleInput").value;

      if (document.getElementById("Bar").checked) {
        GRAPHING.addGraphFromFile(formattedContent, title, 'bar');
        document.getElementById("Bar").checked = false;
      } else {
        document.getElementById("Scatter").checked = false;
        GRAPHING.addGraphFromFile(formattedContent, title, 'scatter');
      }

      document.getElementById("titleInput").value = "";
      inputElement.value = "";

      message.textContent = "Successfully added graph";
      message.style.color = "green";
    } else {
      message.textContent = "Please select a file";
      message.style.color = "red";
    }
  } else {
    message.textContent = "Please select graph type";
    message.style.color = "red";
  }
}

import * as GRAPHING from './launcher.js'
const inputElement = document.getElementById("input");
document.getElementById("submitGraph").onclick = addGraph;

inputElement.addEventListener("change", getFile);
var input;
function getFile(event) {
	input = event.target
  if ('files' in input && input.files.length > 0) {
	  placeFileContent(
      document.getElementById('content-target'),
      input.files[0])
  }
}
var formattedContent;
function placeFileContent(target, file) {
	readFileContent(file).then(content => {
  	formattedContent = formatData(content)
  }).catch(error => console.log(error))
}

function readFileContent(file) {
	const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}

function formatData(data) {
  if (document.getElementById("Bar").checked || document.getElementById("Line").checked) {
    
    let dataVal = data.split('\n');
    dataVal = dataVal.map(elem => elem.split(","))
    dataVal = dataVal.map(elem => [elem[0], parseFloat(elem[1])])
    return dataVal;
  } else if (document.getElementById("Scatter").checked) {
    let dataVal = data.split('\n');
    dataVal = dataVal.map(elem => elem.split(","))
    dataVal = dataVal.map(elem => [parseInt(elem[0]), parseInt(elem[1])])
    return dataVal;
  } else if (document.getElementById("Australia").checked) {
    let dataVal = data.split('\n');
    return dataVal;
  } else if (document.getElementById("multiLine").checked) {
    let dataVal = data.split('\n\n');
    let seriesTitles = dataVal[0].split('\n');
    let datas = dataVal.slice(1);
    datas = datas.map(series => series.split('\n'));
    datas.forEach(series => series.shift())
    datas = datas.map(series => series.map(elem => elem.split(",")))
    datas = datas.map(series => series.map(elem => [elem[0], parseFloat(elem[1])]))

    return [seriesTitles, [datas]]
  }
}

function addGraph() {
  const message = document.getElementById("successMessage")
  message.style.visibility = "visible";
  if (document.getElementById("Bar").checked || document.getElementById("Scatter").checked || document.getElementById("Line").checked|| document.getElementById("Australia").checked|| document.getElementById("multiLine").checked) {
    if (inputElement.value != "") {
      let title = document.getElementById("titleInput").value;

      if (document.getElementById("Bar").checked) {
        GRAPHING.addGraphFromFile(formattedContent, title, 'bar')
        document.getElementById("Bar").checked = false;
      } else if (document.getElementById("Scatter").checked) {
        document.getElementById("Scatter").checked = false;
        console.log(formattedContent)
        GRAPHING.addGraphFromFile(formattedContent, title, 'scatter')
      } else if (document.getElementById("Line").checked) {
        document.getElementById("Line").checked = false;
        GRAPHING.addGraphFromFile(formattedContent, title, 'line')
      } else if (document.getElementById("Australia").checked) {
        document.getElementById("Australia").checked = false;
        GRAPHING.addGraphFromFile(formattedContent, title, 'australia')
      }else if (document.getElementById("multiLine").checked) {
        document.getElementById("multiLine").checked = false;
        GRAPHING.addGraphFromFile(formattedContent, title, 'multiLine')
      }

      document.getElementById("titleInput").value = "";
      inputElement.value = "";

      message.textContent = "Successfully added graph"
      message.style.color = "green";
    } else {
      message.textContent = "Please select a file"
      message.style.color = "red";
    }
  } else {
    message.textContent = "Please select graph type"
    message.style.color = "red";
  }

  setTimeout(() => message.style.visibility = "hidden", 10000)
  
}
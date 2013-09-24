var dropZoneOne = document.querySelector('#drop-target-one'),
		dropZoneUl = document.querySelector('#drop-target-one ul'),
		dropMessage = document.querySelector('#dropMessage'),
		dragElements = document.querySelectorAll('#drag-elements li'),
		elementDragged = null,
		dropZoneTwo = document.querySelector('#dd-files'),
		fileContentPane = document.querySelector('#file-content');

var someData = {
	one: {
		id: "ID: One",
		cls: "Class: None"
	},
	two: {
		id: "ID: two",
		cls: "Class: None"
	},
	three: {
		id: "ID: three",
		cls: "Class: None"
	},
	four: {
		id: "ID: four",
		cls: "Class: None"
	},
	five: {
		id: "ID: five",
		cls: "Class: None"
	}
}

for(var i = 0; i < dragElements.length; i++){
	dragElements[i].addEventListener('dragstart', function(e){
		console.log("Drag Start");
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text', this.innerHTML + ":" + this.id);
		elementDragged = this;
		this.style.opacity = 0.4;
	});

	dragElements[i].addEventListener('dragend', function(e){
		console.log("Drag end");
		elementDragged = null;
	});
}

dropZoneOne.addEventListener('dragover', function(e){
	if(e.preventDefault){
		e.preventDefault();
	}
	e.dataTransfer.dropEffect = 'move';

	return false;
});

dropZoneOne.addEventListener('dragenter', function(e){
	console.log('Drag enter');
	this.className = 'over';
});

dropZoneOne.addEventListener('dragleave', function(e){
	console.log('Drag Leave');
	this.className = "";
	this.removeAttribute("class");
});

dropZoneOne.addEventListener('drop', function(e){
	console.log('Drop');
	if(e.preventDefault) e.preventDefault();
	if(e.stopPropagation) e.stopPropagation();

	this.className = "";
	this.removeAttribute("class");
	var data = e.dataTransfer.getData('text'),
			dataArr = data.split(":"),
			html = dataArr[0],
			id = dataArr[1],
			metadata = someData[id];
	dropMessage.innerHTML = "Dropped " + html + ", " + metadata.id + " " + metadata.cls;
	var elementDraggedClone = elementDragged.cloneNode(true);
	//dropZoneUl.appendChild(elementDraggedClone);
	dropZoneUl.appendChild(elementDragged);
	elementDragged.style.opacity = 1;
	elementDraggedClone.style.opacity = 1;

	//document.querySelector('#drag-elements').removeChild(elementDragged);

	return false;
});

// Code for dropping the files

dropZoneTwo.addEventListener('dragover', function(e){
	if(e.preventDefault) e.preventDefault();
	if(e.stopPropagation) e.stopPropagation();

	e.dataTransfer.dropEffect = 'copy';
});

dropZoneTwo.addEventListener('dragenter', function(e){
	console.log('Drag enter');
	this.className = 'over';
});

dropZoneTwo.addEventListener('dragleave', function(e){
	console.log('Drag Leave');
	this.className = "";
	this.removeAttribute("class");
});

dropZoneTwo.addEventListener('drop', function(e){
	if(e.preventDefault) e.preventDefault();
	if(e.stopPropagation) e.stopPropagation();

	this.className = "";
	this.removeAttribute("class");

	var fileList = 	e.dataTransfer.files;
	if(fileList.length > 0){
		if (fileList[0].type.match('image.*')) {
      readFileImage(fileList[0]);;
    } else {
    	readFileText(fileList[0]);
    }
	}
});

function readFileText(file){
	var reader = new FileReader();

	reader.onloadend = function(e){
		if(e.target.readyState == FileReader.DONE){
			var content = e.target.result; // can also do reader.result
			fileContentPane.innerHTML += "\n\n<strong>File: " + file.name + "</strong>\n\n" + content + "\n\n Type: " + (file.type || 'NA') + "\n\n Last Modified date: " + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'NA') + "\n\n Size: " + file.size;
		}
	}

	reader.readAsBinaryString(file);
}

function readFileImage(file){
	var reader = new FileReader();

	reader.onloadend = function(e){
		if(e.target.readyState == FileReader.DONE){
			var content = e.target.result; // can also do reader.result
			fileContentPane.innerHTML += '<img class="thumb" src="' + content + '" title="' + file.name + '" /><span>' + file.name + '</span>\n\n';
		}
	}

	reader.readAsDataURL(file);
}

// Sorting Elements
var elems = document.querySelectorAll('#sort-elements li'),
		dragSrcElem = null;
		//dragIcon = document.createElement('img');

//dragIcon.src = "download.png";
//dragIcon.width = "100";

function handleDragStart(e){
	this.classList.add('dragging');
	dragSrcElem = this;
	e.dataTransfer.effectAllowed = 'move';
	//e.dataTransfer.setDragImage(dragIcon, -10, -10);
	e.dataTransfer.setData('text', this.innerHTML + ":" + this.getAttribute('data-order'));
}

function handleDragEnd(e){
	[].forEach.call(elems, function(elem){
		elem.classList.remove('dragging');
	})
}

function handleDragEnter(e){
	if(!this.classList.contains('dragging')){
		this.classList.add('over');
	}
}

function handleDragOver(e){
	e.preventDefault();

	e.dataTransfer.dropEffect = 'move';

	return false;
}

function handleDragLeave(e){
	this.classList.remove('over');
}

function handleDrop(e){
	e.preventDefault();
	e.stopPropagation();

	this.classList.remove('over');
	dragSrcElem.innerHTML = this.innerHTML;
	dragSrcElem.setAttribute('data-order', this.getAttribute('data-order'));
	var data = e.dataTransfer.getData('text'),
			dataArr = data.split(':'),
			html = dataArr[0],
			order = dataArr[1];
	this.innerHTML = html;
	this.setAttribute('data-order', order);
}

[].forEach.call(elems, function(elem){
	elem.addEventListener('dragstart', handleDragStart, false);
	elem.addEventListener('dragenter', handleDragEnter, false);
	elem.addEventListener('dragover', handleDragOver, false);
	elem.addEventListener('drop', handleDrop, false);
	elem.addEventListener('dragleave', handleDragLeave, false);
	elem.addEventListener('dragend', handleDragEnd, false);
})

// Reading files in javascript using the File APIs
if(window.File && window.FileReader && window.FileList && window.Blob){
	function handleFileSelect(e){
		var files = this.files; // FileList Object, can also so e.target.files

		var output = [];
		for(var k = 0, f; f = files[k]; k++){
			if (f.type.match('image.*')) {
				console.log("REading images");
        readFileImage(f);;
      } else {
      	readFileText(f);
      }
			output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'NA', ') -', f.size, ' bytes, last modified: ', f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'NA', '</li>');
		}

		document.querySelector('#listOfSelectedFiles').innerHTML = '<ul>' + output.join('') + '</ul>';
	}

	document.querySelector('#files').addEventListener('change', handleFileSelect, false);


	// Slicing and reading the part of the file
	function readBlob(opt_startByte, opt_stopByte, file) {
    var start = parseInt(opt_startByte) || 0;
    var stop = parseInt(opt_stopByte) || (file.size - 1);

    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
        document.getElementById('byte_content').textContent += "\n\n" + evt.target.result;
        document.getElementById('byte_range').textContent += 
            ['\n\n', 'Read bytes: ', start + 1, ' - ', stop + 1,
             ' of ', file.size, ' byte file'].join('');
      }
    };

    
  	var blob = file.slice(start, stop + 1);
  	reader.readAsBinaryString(blob);
  }
  
  document.querySelector('.readBytesButtons').addEventListener('click', function(evt) {
    if (evt.target.tagName.toLowerCase() == 'button') {
      var startByte = evt.target.getAttribute('data-startbyte');
      var endByte = evt.target.getAttribute('data-endbyte');

      var files = document.getElementById('files').files;
	    if (!files.length) {
	      alert('Please select a file!');
	      return;
	    }

	    [].forEach.call(files, function(file){
      	readBlob(startByte, endByte, file);
    	});
    }
  }, false);

} else {
	alert('The File APIs are not fully supported in this browser');
}

// Monitoring the progress of a file upload

(function(){
	var reader,
		progress = document.querySelector('.percent');

		function abortRead(){
			reader.abort();
		}

		function errorHandler(e){
			switch(e.target.error.code){
				case e.target.error.NOT_FOUND_ERR:
					alert('File Not Found!!');
					break;
				case e.target.error.NOT_READABLE_ERR:
					alert('File not readable');
					break;
				case e.target.error.ABORT_ERR:
					break;
				default:
					alert('An error occured during reading this file');
			};
		}

		function updateProgress(e){
			// event is a ProgressEvent
			if(e.lengthComputable){
				var percentLoaded = Math.round((e.loaded / e.total) * 100);
				// increase the progress bar length
				if(percentLoaded < 100){
					progress.style.width = percentLoaded + '%';
					progress.textContent = percentLoaded + '%';
				}
			}
		}

		function handleFileSelect(evt) {
	    // Reset progress indicator on new file selection.
	    progress.style.width = '0%';
	    progress.textContent = '0%';

	    reader = new FileReader();

	    reader.onerror = errorHandler;
	    reader.onprogress = updateProgress;
	    reader.onabort = function(e) {
	      alert('File read cancelled');
	    };
	    reader.onloadstart = function(e) {
	      document.getElementById('progress_bar').className = 'loading';
	    };
	    reader.onload = function(e) {
	      // Ensure that the progress bar displays 100% at the end.
	      progress.style.width = '100%';
	      progress.textContent = '100%';
	      setTimeout("document.getElementById('progress_bar').className='';", 2000);
	    }

	    // Read in the image file as a binary string.
	    reader.readAsBinaryString(evt.target.files[0]);
	  }

	  document.getElementById('trackFileProgress').addEventListener('change', handleFileSelect, false);

}());
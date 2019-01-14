// ************************ Drag and drop ***************** //
let dropArea = document.getElementById("drop-area")

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)   
  document.body.addEventListener(eventName, preventDefaults, false)
})

// Highlight drop area when item is dragged over it
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('active')
}

function handleDrop(e) {
  var dt = e.dataTransfer
  var files = dt.files

  handleFiles(files)
}


function handleFiles(files) {
    if (files.length) {
        file = files[0]
        previewFile(file)
    }
}

function previewFile(file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
        let img = document.createElement('img')
        img.src = reader.result
        document.getElementById('gallery').appendChild(img)
        
        setTimeout(() => {
        var c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        console.log("width = " + img.width);
        var ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var idata = ctx.getImageData(0, 0, img.width, img.height);
        
        var ind;
        var intense;
        var update;
        var base;
        for (var y = 0; y < img.height; y ++)
        for (var x = 0; x < img.width; x ++) {
            ind = (y * img.width + x) * 4;
            intense = idata.data[ind] + idata.data[ind + 1] + idata.data[ind + 2];
            base = x % 16 > 7 ? 230 : 25;
            if ((x % 16 === 0) || (x % 16 === 15) || (x % 16 === 7) || (x % 16 === 8)) base = 128;
            update = base + (128 + intense) / 35;
            idata.data[ind] = update;
            idata.data[ind + 1] = update;
            idata.data[ind + 2] = update;
        }
        ctx.putImageData(idata, 0, 0);
        document.getElementById('gallery').appendChild(c);
        }, 200);
    }
}

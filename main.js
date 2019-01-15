// ************************ Drag and drop ***************** //
let dropArea = document.getElementById("drop-area");

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    dropArea.classList.add('highlight');
}

function unhighlight(e) {
    dropArea.classList.remove('active');
}

function handleDrop(e) {
    var dt = e.dataTransfer;
    var files = dt.files;

    handleFiles(files)
}

function handleFiles(files) {
    if (files.length) {
        file = files[0];
        previewFile(file)
    }
}

function processIII(idata, width, height) {
    var ind, residue, intense, update, base;
    var step = 16;
    var scale = 16;
    for (var y = 0; y < height; y++)
        for (var x = 0; x < width; x++) {
            ind = (y * width + x) * 4;
            intense = (idata.data[ind] + idata.data[ind + 1] + idata.data[ind + 2]) / 3;
            residue = (x + 4) % step;
            base = residue > (step / 2 - 1) ? 230 : 25;

            if ((residue === 0) || (residue === (step - 1)) || (residue === (step / 2 - 1)) || (residue === (step / 2))) {
                base = 128;
            }
            update = base + (128 + intense) / scale;
            idata.data[ind] = update;
            idata.data[ind + 1] = update;
            idata.data[ind + 2] = update;
        }

    return idata;
}

var canvas = document.createElement('canvas');
jQuery('#result').append(canvas);

$("#result-close").off().on('click', function () {
    jQuery('#result').removeClass('_visible');
});

$("#result-save").off().on('click', function () {
    //canvas.toBlob(function (blob) {
    //    saveAs(blob, 'illusion.png');
    //});
    var dt = canvas.toDataURL('image/png');
    /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
    dt = dt.replace(/^data:image\/[^;]*/, 'data:image/octet-stream');

    /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
    dt = dt.replace(/^data:application\/octet-stream/, 'data:image/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=illusion.png');

    window.open(dt);
    //window.href = dt;
});

function previewFile(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
        var img = new Image();
        img.onload = function () {
            var width = 1024;
            var height = width * img.height / img.width;
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');

            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
            var idata = ctx.getImageData(0, 0, width, height);

            idata = processIII(idata, width, height);

            ctx.putImageData(idata, 0, 0);

            jQuery('#result').addClass('_visible');
        };
        img.src = reader.result;
    }
}

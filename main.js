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
    dropArea.classList.remove('highlight');
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

            update = base + (128 + intense) / scale;
            idata.data[ind] = update;
            idata.data[ind + 1] = update;
            idata.data[ind + 2] = update;
        }

    return idata;
}

function process___(idata, width, height) {
    var ind, residue, intense, update, base;
    var step = 16;
    var scale = 16;
    for (var y = 0; y < height; y++)
        for (var x = 0; x < width; x++) {
            ind = (y * width + x) * 4;
            intense = (idata.data[ind] + idata.data[ind + 1] + idata.data[ind + 2]) / 3;
            residue = (y + 4) % step;
            base = residue > (step / 2 - 1) ? 230 : 25;

            update = base + (128 + intense) / scale;
            idata.data[ind] = update;
            idata.data[ind + 1] = update;
            idata.data[ind + 2] = update;
        }

    return idata;
}

function processZZZ(idata, width, height) {
    var ind, residue, intense, update, base;
    var step = 16;
    var scale = 16;
    var wise = 64;
    for (var y = 0; y < height; y++)
        for (var x = 0; x < width; x++) {
            ind = (y * width + x) * 4;
            intense = (idata.data[ind] + idata.data[ind + 1] + idata.data[ind + 2]) / 3;

            if (y % wise < (wise / 2)) {
                residue = step - (width + y - x) % step;
            } else {
                residue = (y + x) % step;
            }
            base = residue > (step / 2 - 1) ? 230 : 25;

            update = base + (128 + intense) / scale;
            idata.data[ind] = update;
            idata.data[ind + 1] = update;
            idata.data[ind + 2] = update;
        }

    return idata;
}

function processOOO(idata, width, height, invert) {
    var ind, intense, update, base;
    var step = 16;
    var scale = 16;
    var yd, xd;
    for (var y = 0; y < height; y++)
        for (var x = 0; x < width; x++) {
            ind = (y * width + x) * 4;
            intense = (idata.data[ind] + idata.data[ind + 1] + idata.data[ind + 2]) / 3;

            yd = (y % step < (step / 2)) ? y % step : step - y % step;
            xd = (x % step < (step / 2)) ? x % step : step - x % step;

            if (invert) {
                base = ((xd * xd) + (yd * yd)) > 25 ? 25 : 230;
            } else {
                base = ((xd * xd) + (yd * yd)) > 25 ? 230 : 25;
            }

            update = base + (128 + intense) / scale;
            idata.data[ind] = update;
            idata.data[ind + 1] = update;
            idata.data[ind + 2] = update;
        }

    return idata;
}

var selectedEffect = "horizontal";

var canvas = document.createElement('canvas');
jQuery('#result').append(canvas);

$("#result-close").off().on('click', function () {
    jQuery('#result').removeClass('_visible');
});

$("#result-open").off().on('click', function () {
    var dt = canvas.toDataURL('image/png');
    window.open(dt);
});

function previewFile(file) {
    dropArea.classList.remove('active');
    loadImage(file, function (img) {
        var width = 1024;
        var height = width * img.height / img.width;
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
        var idata = ctx.getImageData(0, 0, width, height);

        switch (selectedEffect) {
            case 'horizontal':
                idata = processIII(idata, width, height);
                break;
            case 'vertical':
                idata = process___(idata, width, height);
                break;
            case 'zigzag':
                idata = processZZZ(idata, width, height);
                break;
            case 'dots':
                idata = processOOO(idata, width, height);
                break;
            case 'idots':
                idata = processOOO(idata, width, height, true);
                break;
        }

        ctx.putImageData(idata, 0, 0);

        jQuery('#result').addClass('_visible');
        jQuery('a').attr('href', canvas.toDataURL('image/png'));

        jQuery('#fileElem').val(null);
    }, {orientation: 1})
}

function updateDescription() {
    var text = '';
    switch (selectedEffect) {
        case 'horizontal':
            text = 'Horizontal lines pattern';
            break;
        case 'vertical':
            text = 'Vertical lines pattern';
            break;
        case 'zigzag':
            text = 'Zigzag lines pattern';
            break;
        case 'dots':
            text = 'Small black circles pattern';
            break;
        case 'idots':
            text = 'Small white circles pattern';
            break;
    }
    $('.effect-description').html(text);
}

updateDescription();

function updateSelection(modifier) {
    $('.effects-selector__item').removeClass('_selected');
    $('.effects-selector__item.' + modifier).addClass('_selected');
}

$('.effects-selector__item._horizontal').off().on('click', function () {
    updateSelection('_horizontal');
    selectedEffect = "horizontal";
    updateDescription();
});

$('.effects-selector__item._vertical').off().on('click', function () {
    updateSelection('_vertical');
    selectedEffect = "vertical";
    updateDescription();
});

$('.effects-selector__item._zigzag').off().on('click', function () {
    updateSelection('_zigzag');
    selectedEffect = "zigzag";
    updateDescription();
});

$('.effects-selector__item._dots').off().on('click', function () {
    updateSelection('_dots');
    selectedEffect = "dots";
    updateDescription();
});

$('.effects-selector__item._idots').off().on('click', function () {
    updateSelection('_idots');
    selectedEffect = "idots";
    updateDescription();
});
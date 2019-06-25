var noImages = 0; // chosen by the user from the dropdown list
var imgCount = 1; // images uploaded yet, excepting the frame
var sound = new Audio(); // beep sound
sound.src = "http://www.soundjay.com/button/beep-07.wav";

function setNoImages() { // prepares canvas and thumbnails with placeholders
    noImages = document.getElementById("noImages").value;
    +noImages; // converts to int
    document.getElementById("img1").style.display = (noImages >= 1) ? "block" : "none";
    document.getElementById("img2").style.display = (noImages > 1) ? "block" : "none";
    document.getElementById("img3").style.display = (noImages > 2) ? "block" : "none";
    document.getElementById("img4").style.display = (noImages > 3) ? "block" : "none";
    reset();
    sound.play();
}

function drawPlaceholders() {  // draws placeholders on canvas
    var canvas = document.getElementById("mainCanvas");
    var context = canvas.getContext("2d");
    var image = new Image();
    if(noImages == 1){ // depending on how many pictures the user thinks he will upload
        image.onload = function() {
            context.drawImage(image, 33, 33, 633, 633);
        }
    }
    else if(noImages == 2){
        image.onload = function() { 
            context.drawImage(image, 33, 33, 633, 300);
            context.drawImage(image, 33, 366, 633, 300);
        }
    }
    else if(noImages == 3){
        image.onload = function() { 
            context.drawImage(image, 33, 33, 300, 300);
            context.drawImage(image, 366, 33, 300, 633);
            context.drawImage(image, 33, 366, 300, 300);
        }
    }
    else if(noImages == 4){
        image.onload = function() {
            context.drawImage(image, 33, 33, 300, 300);
            context.drawImage(image, 33, 366, 300, 300);
            context.drawImage(image, 366, 33, 300, 300);
            context.drawImage(image, 366, 366, 300, 300);
        }
    }
    image.src = "img/placeholder.jpg";
}

function setFrame() { // setting the frame for the collage
    var file = $("#uploadBackground")[0].files[0];
    var canvas = document.getElementById("mainCanvas");
    var context = canvas.getContext("2d");
    var fileReader = new FileReader();
    fileReader.addEventListener("load", function () {
        var frame = new Image();
        frame.src = this.result;
        frame.onload = function () {
            context.drawImage(frame, 0, 0, 700, 700);  
            drawPlaceholders(); // redraws placeholders over selected background 
        };
    }, false);
    fileReader.readAsDataURL(file);
    sound.play();
}

function upload(input) { // uploading the images used in the collage
    if (input.files[0]) {
        var canvas = document.getElementById("mainCanvas");
        var context = canvas.getContext("2d");
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
        	if(imgCount == 1) { // if it is the first image uploaded
        		document.getElementById("img1").setAttribute('src',e.target.result);
    			imgCount++;
                var image = new Image();
    			if(noImages == 1){ // and only 1 image will be uploaded
        			image.onload = function() { 
                        context.drawImage(image, 33, 33, 633, 633);
                    }
    			}
                else if(noImages == 2){ // and 2 images will be uploaded
                    image.onload = function() { 
                        context.drawImage(image, 33, 33, 633, 300);
                    }
                }
                else if(noImages == 3){ // and 3 images will be uploaded
                    image.onload = function() { 
                        context.drawImage(image, 33, 33, 300, 300);
                    }
                }
                else if(noImages == 4){ // and 4 images will be uploaded
                    image.onload = function() { 
                        context.drawImage(image, 33, 33, 300, 300);
                    }
                }
                image.src = e.target.result;
        	}
        	else if(imgCount == 2){ // if it is the second image uploaded
        		document.getElementById("img2").setAttribute('src',e.target.result);
    			imgCount++;
    			var image = new Image();
                if(noImages == 2){
                    image.onload = function() {  // and only 2 images will be uploaded
                        context.drawImage(image, 33, 366, 633, 300);
                    }
                }
                else if(noImages == 3){
                    image.onload = function() {  // and 3 images will be uploaded
                        context.drawImage(image, 366, 33, 300, 633);
                    }
                }
                else if(noImages == 4){
                    image.onload = function() {  // and 4 images will be uploaded
                        context.drawImage(image, 366, 33, 300, 300);
                    }
                }
                image.src = e.target.result;
        	}
        	else if(imgCount == 3){ // if it is the third image uploaded
        		document.getElementById("img3").setAttribute('src',e.target.result);
    			imgCount++;
    			var image = new Image();
    			if(noImages == 3){
                    image.onload = function() {  // and only 3 images will be uploaded
                        context.drawImage(image, 33, 366, 300, 300);
                    }
                }
                else if(noImages == 4){
                    image.onload = function() {  // and 4 images will be uploaded
                        context.drawImage(image, 33, 366, 300, 300);
                    }
                }
                image.src = e.target.result;
        	}
        	else if(imgCount == 4){ // if it is the fourth image uploaded
        		document.getElementById("img4").setAttribute('src',e.target.result);
    			imgCount++;
    			var image = new Image();
    			if(noImages == 4){
                    image.onload = function() { // it will be the last one
                        context.drawImage(image, 366, 366, 300, 300);
                    }
                }
                image.src = e.target.result;
        	}
        };
        fileReader.readAsDataURL(input.files[0]);
        sound.play();
    }
}

function dragDrop(event) { // drag & drop event on "Choose file" filepicker area
    event.preventDefault();
	event.dataTransfer.dropEffect = "copy";
}

function effect(style) { // effects applied on the whole canvas (the frame also)
    var canvas = document.getElementById("mainCanvas");
    var context = canvas.getContext("2d");
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var pixelData = imageData.data;
    switch(style){
        case "grayscale":
            for (let i = 0; i < pixelData.length; i += 4)
                pixelData[i] = pixelData[i + 1] = pixelData[i + 2] = Math.round((pixelData[i] + pixelData[i + 1] + pixelData[i + 2]) / 3);
            break;
        case "brighten":
            for (var i = 0; i < pixelData.length; i += 4) {
                pixelData[i] += 25;
                pixelData[i + 1] += 25;
                pixelData[i + 2] += 25;
            }
            break;
        case "sepia":
            for (var i = 0; i < pixelData.length; i += 4) {
                pixelData[i] = (pixelData[i] * .392) + (pixelData[i + 1] * .768) + (pixelData[i + 2] * .188);
                pixelData[i + 1] = (pixelData[i] * .348) + (pixelData[i + 1] * .685) + (pixelData[i + 2] * .167);
                pixelData[i + 2] = (pixelData[i] * .271) + (pixelData[i + 1] * .533) + (pixelData[i + 2] * .130);
            }
            break;
        case "threshold":
            for (var i = 0; i < pixelData.length; i += 4) {
                var r = pixelData[i];
                var g = pixelData[i + 1];
                var b = pixelData[i + 2];
                var v = (0.2125 * r + 0.7151 * g + 0.0721 * b >= 128) ? 255 : 0;
                pixelData[i] = pixelData[i + 1] = pixelData[i + 2] = v
            }
            break;
        case "darken":
            for (var i = 0; i < pixelData.length; i += 4) {
                pixelData[i] -= 25;
                pixelData[i + 1] -= 25;
                pixelData[i + 2] -= 25;
            }
            break;
        case "negative":
            for (var i = 0; i < pixelData.length; i += 4) { 
                pixelData[i] = 255 - pixelData[i];
                pixelData[i + 1] = 255 - pixelData[i + 1];
                pixelData[i + 2] = 255 - pixelData[i + 2];
            }
            break;
    }
    context.putImageData(imageData, 0, 0);
    sound.play();
}

function reset() { //resets the canvas and redraws the placegolders if the noImages is selected
    var canvas = document.getElementById("mainCanvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("img1").setAttribute('src', "img/placeholder.jpg");
    document.getElementById("img2").setAttribute('src', "img/placeholder.jpg");
    document.getElementById("img3").setAttribute('src', "img/placeholder.jpg");
    document.getElementById("img4").setAttribute('src', "img/placeholder.jpg");
    imgCount = 1;
    drawPlaceholders();
    sound.play();
}

function download(){ // downloads the collage / canvas		
	var canvas = document.getElementById("mainCanvas");
	var collageImage = new Image();
	collageImage.setAttribute('crossorigin', '');
    collageImage.src = canvas.toDataURL("image/jpg").replace("image/jpg","image/octet-stream");
	var anchor = document.createElement('a');
    anchor.download = 'collage.jpg';
    anchor.href = collageImage.src;
    anchor.click();
    sound.play();
}
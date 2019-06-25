(function () {
    'use strict';
    
    let app = {
        originalImage: null,
        processedImage: null,
        downloadLink: null,
        loader: null,
        currentEffect: null
    }

    app.changeEffect = function(effect){
        if(effect !== app.currentEffect)
        {
            app.currentEffect = effect;
            app.drawImage();
        }
    }

    app.drawImage = function() {
        app.loader.removeAttribute('hidden'); // showing the spinner

        let processingCanvas = document.createElement('canvas'); // creating the canvas
        processingCanvas.width = app.originalImage.naturalWidth;
        processingCanvas.height = app.originalImage.naturalHeight;
        let context = processingCanvas.getContext("2d"); // creating the context
        context.drawImage(app.originalImage, 0, 0, processingCanvas.width, processingCanvas.height);

        switch (app.currentEffect) { // the switch for all the filters that can be applied
            case "reset":
                app.reset(context);
                break;
            case "grayscale":
                app.grayscale(context);
                break;
            case "brightness":
                app.brightness(context);
                break;
            case "darkness":
                app.darkness(context);
                break;
            case "threshold":
                app.threshold(context);
                break;
            case "sepia":
                app.sepia(context);
                break;
            case "negative":
                app.negative(context);
                break;
        }    

        var slider = document.getElementById('resolution'); //resizing function using slider
        slider.onchange = function () { // onChange event reacts when you move & release the slider
            context.clearRect(0, 0, processingCanvas.width, processingCanvas.height); //clear canvas

            context.drawImage(app.originalImage, 0, 0, context.canvas.width * slider.value / 100, context.canvas.height * slider.value / 100);
                        
            processingCanvas.toBlob(function (blob) { // displaying the drawn image
                let blobUrl = URL.createObjectURL(blob);
                app.processedImage.src = blobUrl;
                app.downloadLink.href = blobUrl;
            }, "image/png");
        }

        var sliderOp = document.getElementById('opacity'); //altering the opacity
        sliderOp.oninput = function () { // onInput event reacts instantaneous, without needing to "mouseUp"
            context.globalAlpha = sliderOp.value / 100;
        }

        document.getElementById("btnCrop").addEventListener("click", function () { // cropping the image
            var startX = parseInt(document.getElementById("startX").value); // starting point of cropping
            var startY = parseInt(document.getElementById("startY").value);
            var newW = parseInt(document.getElementById("newW").value); // the new size of the image
            var newH = parseInt(document.getElementById("newH").value);
            var img = document.getElementById('processedImage');

            context.clearRect(0, 0, processingCanvas.width, processingCanvas.height); // cleaning the canvas
            context.drawImage(img, startX, startY, newW, newH, 0, 0, newW, newH);

            processingCanvas.toBlob(function (blob) {
                let blobUrl = URL.createObjectURL(blob);
                app.processedImage.src = blobUrl;
                app.downloadLink.href = blobUrl;
            }, "image/png");
        });

        document.getElementById("rectangle").addEventListener("click", function () { // drawing a rectangle
            context.strokeStyle = "orange"; // colour
            context.lineWidth = "5"; // size
            context.strokeRect(50, 50, 1150, 700); // (starting points, dimensions) drawing only the outline

            processingCanvas.toBlob(function (blob) {
                let blobUrl = URL.createObjectURL(blob);
                app.processedImage.src = blobUrl;
                app.downloadLink.href = blobUrl;
            }, "image/png");
        });

        document.getElementById("triangle1").addEventListener("click", function () { // drawing triangles
            context.beginPath();
            context.moveTo(100, 600); // starting point
            context.lineTo(400, 600); // second corner
            context.lineTo(350, 300); // third corner
            context.closePath(); // connecting the corners

            context.lineWidth = 10; // the outline
            context.strokeStyle = '#222222'; // almost black
            context.stroke();
            context.fillStyle = "#eb5c19"; // filling the triangle
            context.fill();

            processingCanvas.toBlob(function (blob) {
                let blobUrl = URL.createObjectURL(blob);
                app.processedImage.src = blobUrl;
                app.downloadLink.href = blobUrl;
            }, "image/png");

            setTimeout(function () { // delaying the second triangle
                context.beginPath();
                context.moveTo(250, 600);
                context.lineTo(550, 600);
                context.lineTo(500, 300);
                context.closePath();

                context.lineWidth = 10;
                context.strokeStyle = '#222222';
                context.stroke();
                context.fillStyle = "#eb5c19";
                context.fill();

                processingCanvas.toBlob(function (blob) {
                    let blobUrl = URL.createObjectURL(blob);
                    app.processedImage.src = blobUrl;
                    app.downloadLink.href = blobUrl;
                }, "image/png");
            }, 1000); // by 1000 ms = 1s
        });

        document.getElementById("triangle2").addEventListener("click", function () { // smaller triangles
            context.beginPath();
            context.moveTo(150, 600);
            context.lineTo(350, 600);
            context.lineTo(320, 400);
            context.closePath();

            context.fillStyle = "#ffffff"; // only filled, without the outline
            context.fill();

            processingCanvas.toBlob(function (blob) {
                let blobUrl = URL.createObjectURL(blob);
                app.processedImage.src = blobUrl;
                app.downloadLink.href = blobUrl;
            }, "image/png");

            setTimeout(function () { // 1s delay
                context.beginPath();
                context.moveTo(300, 600);
                context.lineTo(500, 600);
                context.lineTo(470, 400);
                context.closePath();

                context.fillStyle = "#ffffff";
                context.fill();

                processingCanvas.toBlob(function (blob) {
                    let blobUrl = URL.createObjectURL(blob);
                    app.processedImage.src = blobUrl;
                    app.downloadLink.href = blobUrl;
                }, "image/png");
            }, 1000);
        });

        document.getElementById("lines").addEventListener("click", function () { // drawing the lines
            context.beginPath();
            context.moveTo(650, 600); // starting point, as drawing the triangles
            context.lineTo(900, 300); //drawing each line
            context.lineTo(930, 450);
            context.lineTo(1050, 300);
            context.lineTo(1100, 600); // but not connecting the points
            // if I would've used context.closePath(); it would've been an irregulate sharp pointy shape :)))
            
            context.lineWidth = 30; // size of the line
            context.strokeStyle = '#eb5c19';
            context.stroke(); // not using fill for lines!

            processingCanvas.toBlob(function (blob) {
                let blobUrl = URL.createObjectURL(blob);
                app.processedImage.src = blobUrl;
                app.downloadLink.href = blobUrl;
            }, "image/png");
        });

        document.getElementById("text").addEventListener("click", function () { // drawing text, pretty self-explanatory
            context.fillStyle = "orange";
            context.font = "90pt 'Yanone Kaffeesatz'";
            context.fillText("MULTI", 300, 180);
            context.fillText("MEDIA!!!", 800, 180);
            processingCanvas.toBlob(function (blob) {
                let blobUrl = URL.createObjectURL(blob);
                app.processedImage.src = blobUrl;
                app.downloadLink.href = blobUrl;
            }, "image/png");
        });

        document.getElementById("nota").addEventListener("click", function () { // drawing my grade
            context.fillStyle = "red";
            context.font = "30pt sans-serif";
            context.fillText("10!", 625, 150);

            context.beginPath(); // drawing a circle
            context.arc(650, 140, 50, 0, 2 * Math.PI, false); // the coordinates of the center & the radius
            context.lineWidth = 5;
            context.strokeStyle = "red";
            context.stroke(); // empty circle

            processingCanvas.toBlob(function (blob) {
                let blobUrl = URL.createObjectURL(blob);
                app.processedImage.src = blobUrl;
                app.downloadLink.href = blobUrl;
            }, "image/png");
        });

        processingCanvas.toBlob(function(blob){
            let blobUrl = URL.createObjectURL(blob);
            app.processedImage.src = blobUrl;
            app.downloadLink.href = blobUrl;
        },"image/png");

        app.loader.setAttribute('hidden', ''); // hides the spinner
    }
    
    // FILTERS
    app.reset = function(context){ // back to normal: no filter
        
    }

    app.grayscale = function (context) { // black & white filter
        let imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        let pixels = imageData.data;
        for (let i = 0; i < pixels.length; i += 4)
            pixels[i] = pixels[i + 1] = pixels[i + 2] = Math.round((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);
        context.putImageData(imageData, 0, 0); 
    }

    app.brightness = function(context){ // +25% brighter
        let imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        let pixels = imageData.data;
        for (var i = 0; i < pixels.length; i += 4) {
            pixels[i] += 25;
            pixels[i + 1] += 25;
            pixels[i + 2] += 25;
        }
        context.putImageData(imageData, 0, 0);
    };

    app.darkness = function (context) { // -25% brighter OR +25% darker
        let imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        let pixels = imageData.data;
        for (var i = 0; i < pixels.length; i += 4) {
            pixels[i] -= 25;
            pixels[i + 1] -= 25;
            pixels[i + 2] -= 25;
        }
        context.putImageData(imageData, 0, 0);
    };

    app.threshold = function (context) { // threshold filter
        let imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        let pixels = imageData.data;
        for (var i = 0; i < pixels.length; i += 4) {
            var r = pixels[i];
            var g = pixels[i + 1];
            var b = pixels[i + 2];
            var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= 128) ? 255 : 0;
            pixels[i] = pixels[i + 1] = pixels[i + 2] = v
        }
        context.putImageData(imageData, 0, 0);
    };

    app.sepia = function (context) { // sepia filter
        let imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        let pixels = imageData.data;
        for (var i = 0; i < pixels.length; i += 4) {
            pixels[i] = (pixels[i] * .393) + (pixels[i + 1] * .769) + (pixels[i + 2] * .189);
            pixels[i + 1] = (pixels[i] * .349) + (pixels[i + 1] * .686) + (pixels[i + 2] * .168);
            pixels[i + 2] = (pixels[i] * .272) + (pixels[i + 1] * .534) + (pixels[i + 2] * .131);
        }
        context.putImageData(imageData, 0, 0);
    }

    app.negative = function (context) { // invert colours
        let imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        let pixels = imageData.data;
        for (var i = 0; i < pixels.length; i += 4) { 
            pixels[i] = 255 - pixels[i];
            pixels[i + 1] = 255 - pixels[i + 1];
            pixels[i + 2] = 255 - pixels[i + 2];
        }
        context.putImageData(imageData, 0, 0);
    }

    app.updateCanvasSize = function () { // resizing the canvas when resizing the browser window
        app.processedCanvas.width = app.processedCanvas.clientWidth;

        if (app.originialImage.src !== "") {
            app.drawImage();
        }
    }

    // EVENTS
    $(function () {
        app.originalImage = document.createElement("img");
        app.downloadLink = document.getElementById("downloadLink");
        app.processedImage = document.getElementById("processedImage");
        app.loader = document.querySelector('.loader');
                
        app.originalImage.addEventListener("load",function(){
            app.currentEffect = null;
            app.changeEffect("normal");
        });

        $('.effectType').click(function () { // filter applying function
            app.changeEffect($(this).data("effect"));
        });

        document.getElementById("fileBrowser").addEventListener("change",function(e){ // filePicker
             let reader = new FileReader(); // creating a new reader
             reader.onload = function(event){
                 app.originalImage.src = event.target.result; // and attaching events
             }
             reader.readAsDataURL(e.target.files[0]); // loading the file
        });

        // DRAG&DROP EVENTS - couldn't make it work in the same time with the filepicker
        document.addEventListener("dragover", function (e) {
            e.preventDefault();
        }, false);

        document.addEventListener("drop", function (e) {
            e.preventDefault(); // prevents the "COPY", we want "MOVE"
            var files = e.dataTransfer.files;
            if (files.length > 0) {
                var file = files[0];
                if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
                    var reader = new FileReader();
                    reader.onload = function (evt) {
                        //$("#processedImage") // just a failed try
                        $("<img></img>")
                            .load(function () { drawImageDD(this); })
                            .attr("src", e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
        }, false);
        function drawImageDD(img) {
            var cW = img.width, cH = img.height;

            $("#processedImage").attr({ width: cW, height: cH });

            var context = $("#processedImage")[0].getContext("2d");
            context.drawImage(img, 0, 0);
        }

        window.addEventListener("resize", function(){app.updateCanvasSize()}); // for when resizing the browser window
    });
})();


var backgroundColor = "transparent";

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("time_input").value = "";
    document.getElementById("imageSize_input").value = "256";
    addListener();
    drawClock();

    (function(w,d) {
        'use strict';
     
        var btn = d.querySelector( 'button' );
        var svg = d.querySelector( 'svg' );
        var canvas = d.querySelector( 'canvas' );
     
        var imageName ='clock';
     
     function triggerDownload ( imgURI ) {
     
        var evt = new MouseEvent( 'click', {
            view: w,
            bubbles: false,
            cancelable: true
         });
     
        var a = d.createElement( 'a' );
            a.setAttribute( 'download', imageName + '.png' );
            a.setAttribute( 'href', imgURI );
            a.setAttribute( 'target', 'blank' );
            a.dispatchEvent(evt);
         }
     
        btn.addEventListener( 'click', function () {
     
             // update the size of the svg and canvas to export the image with the desired size
             var imageSize = document.getElementById("imageSize_input").value;
             document.getElementById("canvas").setAttribute('width',imageSize);
             document.getElementById("canvas").setAttribute('height',imageSize);
             document.getElementById("clock-svg").setAttribute('width',imageSize);
             document.getElementById("clock-svg").setAttribute('height',imageSize);      
     
             if (document.getElementById("white_background_input").checked) {
                 backgroundColor = "white";
             } else {
                 backgroundColor = "transparent";
             }
             drawClock(document.getElementById("time_input").value);
     
             var ctx = canvas.getContext( '2d' );
             var data = ( new XMLSerializer() ).serializeToString( svg );
             var DOMURL = w.URL || w.webkitURL || w;
     
             var img = new Image();
             var svgBlob = new Blob( [data], { type: 'image/svg+xml;charset=utf-8' } );
             var url = DOMURL.createObjectURL( svgBlob );
     
             img.onload = function () {
                 ctx.drawImage( img, 0, 0 );
                 DOMURL.revokeObjectURL( url );
     
                 var imgURI = canvas
                     .toDataURL( 'image/png' )
                     .replace( 'image/png', 'image/octet-stream' );
     
                 triggerDownload( imgURI );
     
                 document.getElementById("clock-svg").setAttribute('width',256);
                 document.getElementById("clock-svg").setAttribute('height',256);
     
                 document.getElementById("canvas").setAttribute('width',0);
                 document.getElementById("canvas").setAttribute('height',0);
             };
     
             img.src = url;
             d.querySelector( 'h2' ).classList.remove( 'hide' );
         });
     }(window, document));
}, false);


function makeSVG(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}

function drawClock(timeString) {

    var centerX = 1000;
    var centerY = 1000;

    var clockSVG = document.getElementById('clock-svg');
    clockSVG.innerHTML = "";
    var circle= makeSVG('circle', {cx: centerX, cy: centerY, r:900, stroke: 'black', 'stroke-width': 50, fill: backgroundColor});
    clockSVG.appendChild(circle);

    var minuteLineLength = 100;
    var hourLineLength = 150;
    for (i = 0; i < 60; i++) {
        var angle = 6*i * Math.PI/180;
        var lineLength = minuteLineLength;

        // change line formatting for hours
        if (i%5 == 0) {
            lineLength = hourLineLength;
        }

        // create the line
        var minuteLine = createAngularPath(angle,centerX,centerY,800,lineLength,30);
        clockSVG.appendChild(minuteLine);
    }

    var middle = makeSVG('circle', {cx: centerX, cy: centerY, r:80, stroke: 'black', 'stroke-width': 0, fill: 'black'});
    clockSVG.appendChild(middle);

    if (!(timeString == "" || (typeof timeString == 'undefined'))) {

        var time = timeString.split(":");
        var hours = parseInt(time[0]);
        var minutes = parseInt(time[1]);

        // only hours from 0 to 12 are used
        if (hours >= 12) {
            hours = hours - 12;
        }

        var hoursInterpol = hours + minutes/60;

        var angle = -(hoursInterpol+6)*(360/12) * Math.PI/180;
        var hoursLine = createAngularPath(angle,centerX,centerY,500,500,70);
        clockSVG.appendChild(hoursLine);

        var angle = -(minutes+30)*(360/60) * Math.PI/180;
        var minutesLine = createAngularPath(angle,centerX,centerY,700,700,50);
        clockSVG.appendChild(minutesLine);
    }
}

function createAngularPath(angle,centerX,centerY,outerRadius,lineLength,strokeWidth) {

    var xStart = centerX + (outerRadius - lineLength) * Math.sin(angle);
    var xEnd = centerX + outerRadius * Math.sin(angle);
    var yStart = centerY + (outerRadius - lineLength) * Math.cos(angle);
    var yEnd = centerY + outerRadius * Math.cos(angle);

    var path = "M" + xStart + "," + yStart + " L" + xEnd + "," + yEnd;

    if (typeof strokeWidth == 'undefined') {
        strokeWidth = 50;
    }

    var linePath = makeSVG('path', {d: path, stroke: 'black', 'stroke-width': strokeWidth});
    return linePath;
}

function addListener() {

    document.getElementById("time_input").addEventListener("change", function() {
        drawClock(this.value)
    });

    document.getElementById("white_background_input").addEventListener("change", function() {
        if (this.checked) {
            backgroundColor = "white";
        } else {
            backgroundColor = "transparent";
        }
        console.log("background color changed");
    });
}


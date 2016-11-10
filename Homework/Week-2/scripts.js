/**
 * scripts.js
 *
 *
 *
 *
 *
 */

var dates = []
var temp = []
var data = []

// load data by writing js to select text area then accesses its content
var rawdata = document.getElementById("rawdata").innerHTML;

// creates array with lines of data
var lines = rawdata.split('\n');

// creates array with all dates and temperatures
for (var i = 1; i < lines.length; i++) {
    lines[i] = lines[i].replace(/\s/g, '');
    dates[i - 1] = lines[i].split(',')[0];
    temp[i - 1] = lines[i].split(',')[1];
}

// adds dates and temperature objects to array
for (var i = 0; i < dates.length; i++) {
    data.push({
        date: new Date(dates[i] = dates[i].replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')),
        temp: parseInt(temp[i])
    });
}

console.log(data);

// function to transform data to valid data points
function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// This gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// Implement your solution here:
 		var alpha = ...;
	var beta = ...;

	return function(x){
		return alpha * x + beta;
	};
}



function draw() {
      var canvas = document.getElementById("canvas");
      if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        drawImage(image, x, y, width, height)
        ctx.moveTo(30,96);
        ctx.lineTo(70,66);
        ctx.lineTo(103,76);
        ctx.lineTo(170,15);
        ctx.stroke();

      }
}

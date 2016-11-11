/**
 * scripts.js
 *
 * Eline Jacobse
 * Data Processing
 * Student.nr: 11136235
 *
 * Script that gets temperature data from De Bilt in 2015
 * and draws a line graph with the data points
 */

// arrays for temperatures, dates and all data
var dates = []
var temp = []
var data = []

// load rawdata from page
var rawdata = document.getElementById("rawdata").innerHTML;

// creates array with lines of data
var lines = rawdata.split('\n');

// creates array with all dates and temperatures, removing spaces
for (var i = 1; i < lines.length; i++) {
    lines[i] = lines[i].replace(/\s/g, '');
    dates[i - 1] = lines[i].split(',')[0];
    temp[i - 1] = lines[i].split(',')[1];
}

// adds dates and temperature objects to array
for (var i = 0; i < dates.length - 1; i++) {
    data.push({
        date: new Date(dates[i] = dates[i].replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')),
        temp: parseInt(temp[i])
    });
}

// function to transform data to valid data points
function createTransform(domain, range) {
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
    var alpha = (range[1] - range[0]) / (domain[1] - domain[0]);
    var beta = range[0] - alpha * domain[0];

	return function(x) {
		return alpha * x + beta;
	};
}

// function finds the lowest and heighest temperature point
var lowest_temp = 0;
var highest_temp = 0;
for (var i = 0; i <= data.length - 1; i++) {
    var tmp = data[i].temp;
    if (tmp < lowest_temp) {
        lowest_temp = tmp;
    }
    if (tmp > highest_temp) {
        highest_temp = tmp;
    }
}

// width and height of canvas, and width and height of graph
var width = 700;
var height = 400;
var graph_width = 640;
var graph_height = 340;
var padding = 30;
var x_points = [];

// the coordinates for the y-axis (-50 being the lowest point, 350 the heighest)
var transform_y = createTransform([-50, 350], [graph_height + padding, 0 + padding]);

// the first and last day of the year in milliseconds
var first_day = data[0].date.getTime();
var last_day = data[364].date.getTime();

// the coordinates for the x-axis
var transform_x = createTransform([first_day, last_day], [0 + padding, graph_width + padding]);

// all data points for x-axis (dates)
for (var i = 0; i <= data.length - 1; i++) {
        var day = data[i].date.getTime();
        x_points.push(day);
}

// set up canvas for drawing
var ctx;

// draw all data on the canvas
function draw() {
    var canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#12a3bc";
    ctx.lineWidth = 1.5;

    // draw data points
    ctx.beginPath();
    ctx.moveTo(transform_x(x_points[0]), transform_y(data[0].temp));
    for (var i = 1; i < data.length; i++) {
        ctx.lineTo(transform_x(x_points[i]), transform_y(data[i].temp));
    }
    ctx.stroke();
    ctx.closePath();

    // call functions to draw axes and info
    drawaxes();
    drawInfo();
}

function drawaxes(){
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    // draw y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, graph_height + padding);
    ctx.stroke();

    // draw x-axis
    ctx.beginPath();
    ctx.moveTo(padding, graph_height + padding);
    ctx.lineTo(graph_width + padding, graph_height + padding);
    ctx.stroke();
    ctx.closePath();
}

function drawInfo(){
    ctx.font = "10pt Helvetica";
    ctx.lineWidth = 0.5;
    ctx.fillStyle = "#444444";
    ctx.strokeStyle = "grey";

    // draw the info for the y-axis
    var y_val = 350;
    ctx.fillText("Temperature", 2, 10);
    for (var i = 0; i < 9; i++) {
        ctx.fillText(y_val/10, 5, transform_y(y_val));
        y_val -= 50;
    }

    // months of the year and days that these months start
    var months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var days = [0, 1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

    // put the months of the year on the x-axis
    for (var i = 0; i < months.length; i++) {
        ctx.fillText(months[i], transform_x(x_points[days[i]]) + 5, graph_height + padding + 25);
        ctx.beginPath();
        ctx.moveTo(transform_x(x_points[days[i + 1]]), graph_height + padding + 10);
        ctx.lineTo(transform_x(x_points[days[i + 1]]), graph_height + padding);
        ctx.stroke();
    }

    // draw horizontal lines for the temperatures
    y_val = 350;
    for (var i = 0; i < 9; i++) {
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(padding, transform_y(y_val));
        ctx.lineTo(graph_width + padding, transform_y(y_val));
        ctx.stroke();
        y_val -= 50;
    }

    // draw a bold line where the temperature is 0
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.8;
    ctx.moveTo(padding, transform_y(0));
    ctx.lineTo(graph_width + padding, transform_y(0));
    ctx.stroke();
    ctx.closePath();
}

/**
 * d3line.js
 *
 * Eline Jacobse
 * Data Processing
 * Student.nr: 11136235
 *
 */

// set up margins, width and height for svg
var margin = {top: 50, right: 60, bottom: 80, left: 50},
    width = 750 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// parse the date/time
var formatTime = d3.time.format("%Y%m%d");
    bisectDate = d3.bisector(function(d) { return d.date; }).left;

// set the ranges
var x = d3.time.scale()
    .range([0, width]);
var y = d3.scale.linear()
    .range([height, 0]);

// define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(12);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(10);

// define the line
var valueLine = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.avg); })

// create svg with the specified size
var svg = d3.select(".graph")
    .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .attr("class", "linegraph")
    .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.json("knmi_2015.json", function(error, data) {
    data.forEach(function(d) {
        d.date = formatTime.parse(String(d.date));
        d.avg = d.avg / 10;
    });

    var lineSvg = svg.append("g");

    var focus = svg.append("g")
        .style("display", "none");

    // scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    var min = d3.min(data, function(d) { return d.avg; });
    y.domain([min - 5, d3.max(data, function(d) { return d.avg; }) + 1]);

    // add the line path
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueLine(data));

    // add the xAxis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
         .style("text-anchor", "end")
         .attr("dx", "-.8em")
         .attr("dy", "-.55em")
         .attr("transform", "rotate(-90)");

    // add the yAxis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Temperature in °C");

    // append a horizontal line
    focus.append("line")
        .attr("class", "x")
        .attr("y1", 0)
        .attr("y2", height);

    // append the circle to line
    focus.append("circle")
        .attr("class", "y")
        .attr("id", "value_circle")
        .attr("r", 4);

    // add average temperature to graph
    focus.append("text")
        .attr("class", "temp")
        .attr("dx", 8)
        .attr("dy", "-.3em");

    // add date to text
    focus.append("text")
        .attr("class", "date")
        .attr("dx", 8)
        .attr("dy", "-.3em");

    // append the rectangle to capture mouse
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    formatDate = d3.time.format("%d %b");

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

            // add circle to graph
            focus.select("circle.y")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.avg) + ")");

            // add temperature text to graph
            focus.select("text.temp")
                .attr("transform", "translate(" + x(d.date) + "," + y(-5) + ")")
                .text(d.avg + '°C');

            // add date to graph
            focus.select("text.date")
                .attr("transform", "translate(" + x(d.date) + "," + y(-3) + ")")
                .text(formatDate(d.date));

            // add the horizontal line
            focus.select(".x")
                .attr("transform", "translate(" + x(d.date) + "," + y(d.avg) + ")")
                .attr("y2", height - y(d.avg));
    }
});

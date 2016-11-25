/**
 * barchart.js
 *
 * Eline Jacobse
 * Data Processing
 * Student.nr: 11136235
 *
 * A barchart in D3 showing the amount of tourists in Utrecht
 * by their country of origin
 */

// set up margins, width and height for svg
var margin = {top: 20, right: 20, bottom: 110, left: 50},
    width = 550 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// create svg with the specified size
var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "barchart")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set up scale for x and y-axis
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .09);

var y = d3.scale.linear()
    .range([height, 0]);

// set up axes
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

// set up tooltip for numbers
var tip = d3.tip()
    .attr("class", "d3-tip")
    .html(function(d) {
          return d3.format(",")(d.aantal);
      });

// get data from json file
d3.json("../toerisme-utrecht.json", function(error, data) {
    data.forEach(function(d) {
        d.aantal = +d.aantal
    });

    // set up the domain for x and y-axis
    x.domain(data.map(function(d) { return d.land; }));
    y.domain([0, d3.max(data, function(d) { return d.aantal; })]);

    // draw the x axis and labels
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

    // draw the y axis and labels
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("aantal");

    // call tooltip
    svg.call(tip);

    // draw bars of chart
    svg.selectAll("bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.land); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.aantal); })
        .attr("height", function(d) { return height - y(d.aantal);})

        //show and hide the tooltip during mouse events
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

});

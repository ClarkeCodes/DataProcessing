/**
 * d3lineExtended.js
 *
 * Eline Jacobse
 * Data Processing
 * Student.nr: 11136235
 *
 */


// set up queue to load data
queue()
    .defer(d3.json, "knmi_2014.json")
    .defer(d3.json, "knmi_2015.json")
    .await(makeGraph);

// set up global variables for graph function
var updateGraph;
var revertGraph;

// set up margins, width and height for svg
var margin = {top: 40, right: 80, bottom: 80, left: 80},
    width = 750 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

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

// define the three lines
var avgLine = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.avg); })

var minLine = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.min); })

var maxLine = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.max); })

// create svg with the specified size
var svg = d3.select(".graph")
    .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .attr("class", "linegraph")
    .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function makeGraph(error, data_2014, data_2015) {
    // standard data is for 2015
    data = data_2015
    data.forEach(function(d) {
        d.date = formatTime.parse(String(d.date));
        d.avg = d.avg / 10;
        d.max = d.max / 10;
        d.min = d.min / 10;
    });
    // format data for 2014
    data_2014.forEach(function(d) {
        d.date = formatTime.parse(String(d.date));
        console.log(d)
        d.avg = d.avg / 10;
        d.max = d.max / 10;
        d.min = d.min / 10;
    });

    // set up line and focus for interactivity
    var lineSvg = svg.append("g");
    var focus = svg.append("g")
        .style("display", "none");

    // scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    var min = d3.min(data, function(d) { return Math.min(d.min, d.avg, d.max); });
    y.domain([min - 5, d3.max(data, function(d) { return Math.max(d.min, d.avg, d.max); }) + 5]);

    // add lines for average, min and max temperature
    svg.append("path")
        .attr("class", "line avg")
        .attr("d", avgLine(data));

    svg.append("path")
        .attr("class", "line min")
        .attr("d", minLine(data));

    svg.append("path")
        .attr("class", "line max")
        .attr("d", maxLine(data));

    // add the x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

    // add the y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Temperature (°C)");

    // append a horizontal line
    focus.append("line")
        .attr("class", "x")
        .attr("y1", 0)
        .attr("y2", height);

    // append three circles for the different lines (for mouseover)
    focus.append("circle")
        .attr("class", "y1")
        .attr("id", "value_circle_avg")
        .attr("r", 4);
    focus.append("circle")
        .attr("class", "y2")
        .attr("id", "value_circle_min")
        .attr("r", 4);
    focus.append("circle")
        .attr("class", "y3")
        .attr("id", "value_circle_max")
        .attr("r", 4);

    // add text placeholders for date and temperatures
    focus.append("text")
        .attr("class", "date")
        .attr("dx", 8)
        .attr("dy", "-.3em");
    focus.append("text")
        .attr("class", "max_temp")
        .attr("dx", 8)
        .attr("dy", "-.3em");
    focus.append("text")
        .attr("class", "avg_temp")
        .attr("dx", 8)
        .attr("dy", "-.3em");
    focus.append("text")
        .attr("class", "min_temp")
        .attr("dx", 8)
        .attr("dy", "-.3em");

    // append rectangle to register movement of mouse
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    // date formatter for displaying the days
    formatDate = d3.time.format("%d %b");

    // function for moving over the graph
    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        // add a circle to each line of the graph
        focus.select("circle.y1")
            .attr("transform", "translate(" + x(d.date) + "," + y(d.avg) + ")");
        focus.select("circle.y2")
            .attr("transform", "translate(" + x(d.date) + "," + y(d.min) + ")");
        focus.select("circle.y3")
            .attr("transform","translate(" + x(d.date) + "," + y(d.max) + ")");

        // add text to be displayed when moving cursor over graph
        focus.select("text.date")
            .attr("transform", "translate(" + (width - 80) + "," + (height - 300) + ")")
            .text(formatDate(d.date));

        focus.select("text.max_temp")
            .attr("transform", "translate(" + (width - 80) + "," + (height - 285) + ")")
            .text('Max.: ' + d.max + '°C');

        focus.select("text.avg_temp")
            .attr("transform","translate(" + (width - 80) + "," + (height - 270) + ")")
            .text('Avg.: ' + d.avg + '°C');

        focus.select("text.min_temp")
            .attr("transform", "translate(" + (width - 80) + "," + (height - 255) + ")")
            .text('Min.: ' + d.min + '°C');

        // add horizontal line
        focus.select(".x")
            .attr("transform","translate(" + x(d.date) + "," + y(d.avg) + ")")
            .attr("y2", height - y(d.avg));

    }
    updateGraph = function() {
        data = data_2014;
        // scale the range on x-axis of data
        x.domain(d3.extent(data, function(d) { return d.date; }));

        // select svg to change
        var svg = d3.select("body").transition();

        // change the lines in graph
        svg.select(".min")
            .duration(750)
            .attr("d", minLine(data));

        svg.select(".avg")
            .duration(750)
            .attr("d", avgLine(data));

        svg.select(".max")
            .duration(750)
            .attr("d", maxLine(data));

        // change the x-axis
        svg.select(".x.axis")
            .duration(750)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)");

    }

    revertGraph = function() {
        data = data_2015;

        // scale the range on x-axis of data
        x.domain(d3.extent(data, function(d) { return d.date; }));

        // select svg to change
        var svg = d3.select("body").transition();

        // change the lines in graph
        svg.select(".min")
            .duration(750)
            .attr("d", minLine(data));

        svg.select(".avg")
            .duration(750)
            .attr("d", avgLine(data));

        svg.select(".max")
            .duration(750)
            .attr("d", maxLine(data));

        // change the x-axis
        svg.select(".x.axis")
            .duration(750)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)");
    }
};

// change graph to selected value (year)
window.toggle = function(d) {
    if(d.value=="2014") {
        updateGraph();
    }
    else if(d.value=="2015") {
        revertGraph();
    }
};

/**
 * d3linkedViews.js
 *
 * Eline Jacobse
 * Data Processing
 * Student.nr: 11136235
 *
 */

// set up global variables for graph functions
var updateMap;
var revertMap;

// set up margins, width and height for the scatterplot svg
var margin = {
        top: 10,
        right: 20,
        bottom: 110,
        left: 50
    },
    width = 600 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

// create svg for the scatterplot
var scatterplot = d3.select("#chartcontainer").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "scatterplot")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// all colors to be used for the data (source: http://colorbrewer2.org/)
var all_colors = ["#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"];
var color_values = [44.6, 40.7, 36.7, 32.7, 28.7, 24.7, 20.8, 16.8, 16.7];

// color values to be used for dropown menu
var new_values = [5, 10, 15, 20, 25, 30, 35, 40, 45];
var colorScale;

// get data from csv file
d3.csv("data.csv", function(error, data) {
    if (error) throw error;
    var dataset = {};

    // set up dictionary with country per_thousands to codes
    var codes = {};
    for (var i = 0; i < country_codes.length; i++) {
        codes[country_codes[i][2]] = country_codes[i][1];
    }

    colorScale = d3.scale.quantile()
        .domain(color_values)
        .range(all_colors);

    // create dataset in map format
    data.forEach(function(d) {
        d.rank = +d.rank;
        d.hpi = +d.hpi;
        d.happy_years = +d.happy_years;
        var iso = codes[d.country];
        dataset[iso] = {
            rank: d.rank,
            hpi: d.hpi,
            happy_years: d.happy_years,
            fillColor: colorScale(d.hpi)
        };
    });

    // create datamap
    var map = new Datamap({
        element: document.getElementById('mapcontainer'),
        // slightly zoomed in map projection
        setProjection: function(element) {
            var projection = d3.geo.equirectangular()
                .center([19, -3])
                .rotate([4.4, 0])
                .scale(150)
                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
            var path = d3.geo.path()
                .projection(projection);
            return {
                path: path,
                projection: projection
            };
        },
        fills: {
            // fill for countries without data
            defaultFill: '#e2e2e2'
        },
        data: dataset,
        done: function(map) {
            d3.selectAll('.datamaps-subunit')
                .on('mouseover', function(geo) {
                    // change fillcolor on mouseover
                    d3.select(this)
                        .style("fill", "black");

                    // highlight value of country in scatterplot and table
                    var country_code = codes[geo.properties.name];
                    highlightCircle(country_code);
                    highlightTable(country_code);
                })
                .on('mouseout', function(geo) {
                    // change fill back to previous color
                    d3.select(this)
                        .style("fill", function() {
                            // map return to grey if there is no data
                            if (dataset[country_code] === undefined) {
                                return '#e2e2e2';
                            } else {
                                return dataset[country_code].fillColor;
                            }
                        });
                    var country_code = codes[geo.properties.name];
                    revertCircle(country_code);
                });
        }
    });

    // attributes for map
    var mapWidth = 550;
    var mapHeight = 350;

    // set up attributes for legend
    var legendWidth = 110,
        legendHeight = 500;

    // create svg for legend
    var svg = d3.select(".datamap").append("svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .attr("id", "legendContainer");

    var legend = svg.selectAll("g.legend")
        .data(color_values)
        .enter().append("g")
        .attr("class", "legend");

    // width and height for rects of legend
    var r_width = 20,
        r_height = 20;

    var legendLabels = ["44.6 >", "40.7 - 44.6", "36.7 - 40.6", "32.7 - 36.6", "28.7 -32.6", "24.8 - 28.6", "20.8 - 24.7", "16.8 - 20.7", "< 16.7"];
    legendLabels.reverse();

    makeLegend();
    makeScatterPlot();

    function makeLegend() {
        color_values.reverse();

        // add containers for legend
        legend.append("rect")
            .attr("x", 20)
            .attr("y", function(d, i) { return legendHeight - (i * r_height) - 2 * r_height; })
            .attr("width", r_width)
            .attr("height", r_height)
            .style("fill", function(d, i) { return colorScale(color_values[i]); })
            .style("opacity", 0.8);

        // add labels to legend
        legend.append("text")
            .attr("x", 45)
            .attr("y", function(d, i) { return legendHeight - (i * r_height) - r_height - 5; })
            .text(function(d, i) { return legendLabels[i]; });

        // inital legend title
        svg.append("text")
            .attr("id", "legendTitle")
            .attr("x", 20)
            .attr("y", 290)
            .text("HPI");
    }

    function highlightCircle(country) {
        var new_circle = 'circle#' + country;
        d3.select(new_circle)
            .transition()
            .duration(100)
            .attr('r', 15)
            .attr('stroke-width', 2);
    }

    function revertCircle(country) {
        var new_circle = 'circle#' + country;
        d3.select(new_circle)
            .transition()
            .duration(100)
            .attr('r', 5)
            .attr('stroke-width', 0.5);
    }

    function highlightCountry(country) {
        var updateCountry = '.datamaps-subunit.' + country;
        var selected = d3.selectAll(updateCountry)
            .style("fill", "black");
    }

    function revertCountry(country) {
        var updateCountry = '.datamaps-subunit.' + country;
        var selected = d3.selectAll(updateCountry)
            .style("fill", dataset[country].fillColor);
    }

    // functions to toggle map updates
    updateMap = function() {
        // create new colorscale
        colorScale = d3.scale.quantile()
            .domain(new_values)
            .range(all_colors);

        // create dataset in map format
        var new_data = {};
        data.forEach(function(d) {
            var iso = codes[d.country];
            new_data[iso] = { fillColor: colorScale(d.happy_years) };
        });

        // update map colors
        map.updateChoropleth(new_data);
        updateLegend();
        updateTable();
        updateCircles();
    };

    revertMap = function() {
        // set scale to original colors
        colorScale = d3.scale.quantile()
            .domain(color_values)
            .range(all_colors);

        // create dataset in map format
        var new_data = {};
        data.forEach(function(d) {
            var iso = codes[d.country];
            new_data[iso] = { fillColor: colorScale(d.hpi) };
        });

        // change values back
        map.updateChoropleth(new_data);
        revertLegend();
        revertTable();
        revertCircles();
    };

    function updateLegend() {
        // remove current legend labels and title
        d3.selectAll("g.legend text")
            .remove();
        d3.selectAll("#legendTitle")
            .remove();

        var newLabels = ["45+", "40 - 45", "35 - 40", "30 - 35", "25 - 30", "20 - 25", "15 - 20", "10 - 15", "<10"];
        newLabels.reverse();

        // add new labels to legend
        legend.append("text")
            .attr("x", 45)
            .attr("y", function(d, i) { return legendHeight - (i * r_height) - r_height - 5; })
            .text(function(d, i) { return newLabels[i]; });

        // add new legend title
        svg.append("text")
            .attr("id", "legendTitle")
            .attr("x", 10)
            .attr("y", 290)
            .text("Happy Years");
    }

    function revertLegend() {
        // remove current labels and title
        d3.selectAll("g.legend text")
            .remove();
        d3.selectAll("#legendTitle")
            .remove();

        // add new labels to legend
        legend.append("text")
            .attr("x", 45)
            .attr("y", function(d, i) { return legendHeight - (i * r_height) - r_height - 5; })
            .text(function(d, i) { return legendLabels[i]; });

        // add new legend title
        svg.append("text")
            .attr("id", "legendTitle")
            .attr("x", 20)
            .attr("y", 290)
            .text("HPI");
    }

    function updateCircles() {
        // change color of circles to values of happy years
        var circles = scatterplot.selectAll('circle')
            .attr("fill", function(d) { return colorScale(d.happy_years); });
    }

    function revertCircles() {
        // change color of circled to HPI
        var circles = scatterplot.selectAll('circle')
            .attr("fill", function(d) { return colorScale(d.hpi); });
    }

    function makeScatterPlot() {

        var xScale = d3.scale.linear()
            .domain([
                d3.min([0, d3.min(data, function(d) { return d.wellbeing; })]),
                d3.max([0, d3.max(data, function(d) { return d.wellbeing; })])])
            .range([0, width]);

        var yScale = d3.scale.linear()
            .domain([
                d3.min([0, d3.min(data, function(d) { return d.happy_years; })]),
                d3.max([0, d3.max(data, function(d) { return d.happy_years; })])])
            .range([height, 0]);

        // set up x and y axis
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .ticks(10)
            .orient('bottom');
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .ticks(10)
            .orient('left');

        // add circles to scatterplot
        var circles = scatterplot.selectAll('circle')
            .data(data)
            .enter()
           .append('circle')
            .attr('cx', function(d) { return xScale(d.wellbeing); })
            .attr('cy', function(d) { return yScale(d.happy_years);})
            .attr('r', '5')
            .attr('stroke', 'black')
            .attr('stroke-width', 0.8)
            .attr('id', function(d) { return codes[d.country]; })
            .attr('fill', function(d) { return colorScale(d.hpi); })
            .on('mouseover', function() {
                // make circles big on mouseover
                d3.select(this)
                    .attr('r', 10)
                    .attr('stroke-width', 2);

                // highlight country and table row
                var country_code = d3.select(this).attr('id');
                highlightCountry(country_code);
                highlightTable(country_code);
            })
            .on('mouseout', function() {
                // make circle small again
                d3.select(this)
                    .transition()
                    .duration(100)
                    .attr('r', 5)
                    .attr('stroke-width', 0.5);

                // undo higlhight on map and table
                var country_code = d3.select(this).attr('id');
                revertCountry(country_code);
                revertTable(country_code);
            });

        // create x-axis
        scatterplot.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
            .append('text')
            .attr('class', 'label')
            .attr('y', -10)
            .attr('x', width)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Wellbeing (1 - 10)');

        // create y-axis
        scatterplot.append('g')
            .attr('class', 'axis')
            .call(yAxis)
            .append('text')
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .attr('x', 0)
            .attr('y', 5)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Happy Life Years');
    }

    // The table generation function
    function makeTable(data, columns) {
        var table = d3.select("#tablecontainer").append("table")
            .attr("class", "table table-hover")
            .attr("id", "info_table"),
            thead = table.append("thead")
            .attr("class", "thead-inverse"),
            tbody = table.append("tbody");

        // append the header row
        thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function(column) { return column; });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr")
            .attr("id", function(d) { return codes[d.country]; })
            .on("mouseover", function() {
                var country_code = d3.select(this).attr("id");
                highlightCountry(country_code);
                highlightCircle(country_code);

            })
            .on("mouseout", function() {
                var country_code = d3.select(this).attr("id");
                revertCountry(country_code);
                revertCircle(country_code);
            });

        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function(row) {
                return columns.map(function(column) {
                    return {
                        column: column,
                        value: row[column]
                    };
                });
            })
            .enter()
            .append("td")
            .html(function(d) { return d.value; });

        return table;
    }

    // render the table
    var table = makeTable(data, ["rank", "country", "hpi", "happy_years"]);

    // sort values in table by HPI
    table.selectAll("tbody tr")
        .sort(function(a, b) { return d3.descending(a.hpi, b.hpi); });

    // format table header
    table.selectAll("thead th")
        .text(function(column) { return column.charAt(0).toUpperCase() + column.substr(1); });

    // sorts table in order of happy years
    function updateTable() {
        table.selectAll("tbody tr")
            .sort(function(a, b) { return d3.descending(a.happy_years, b.happy_years); });
    }

    // sorts table by HPI
    function revertTable() {
        table.selectAll("tbody tr")
            .sort(function(a, b) { return d3.descending(a.hpi, b.hpi); });
    }
});

// change graph to selected value (year)
window.toggle = function(d) {
    if (d.value == "happy_years") {
        updateMap();
    } else if (d.value == "HPI") {
        revertMap();
    }
};

function highlightTable(country) {
    // set background color to white for all rows
    d3.selectAll("tr")
        .style("background-color", "#fff");

    // highlight selected country in table
    var country_id = "tr#" + country;
    var tr = d3.selectAll(country_id)
        .style("background-color", '#ffeb3b');
}

// function that lets users search for a country
// adapted from this example: http://www.w3schools.com/howto/howto_js_filter_table.asp
function searchTable() {
    // Declare variables
    var input, filter, table, tr, td, i;
    input = document.getElementById("tableInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("info_table");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

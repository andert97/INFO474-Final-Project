"use-strict";

let data = "";
let data2 = "";
let data3 ="";

//let svg = ""; // keep SVG reference in global scope
let toolTip = "";

const msm = {
    width: 1000,
    height: 800,
    marginAll: 50,
    marginLeft: 50,
}
const small_msm = {
    width: 500,
    height: 500,
    marginAll: 50,
    marginLeft: 80
}

// load data and make scatter plot after window loads
window.onload = function () {
    toolTip = d3.select("#popChart")
        .append('svg')
        .attr('width', small_msm.width)
        .attr('height', small_msm.height);
    
    data = d3.csv("state_cuisines.csv");
    data2 = d3.csv("state_cuisines_avgs.csv");
    data3 = d3.json("us-states.json");
}
    
//function barChart(state, toolTip) {
function barChart(state, avgData) {

    return div.text(state); 

    //let stateData = data2[state];
    // let data = d3.csv("state_cuisines_avgs.csv")
    //console.log(avgData[5]);
    //return div.text(stateData);

    //let category = stateData.map((row) => )

    // var x = d3.scale.ordinal().rangeRoundBands([0, small_msm.width], .05);

    // var y = d3.scale.linear().range([small_msmheight, 0]);

    // var xAxis = d3.div.axis()
    //     .scale(x)
    //     .orient("bottom")
    //     //.tickFormat(d3.time.format("%Y-%m"));

    // var yAxis = d3.div.axis()
    //     .scale(y)
    //     .orient("left")
    //     .ticks(10);

    // var tooltip = d3.select("body").append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom)
    // .append("g")
    //     .attr("transform", 
    //         "translate(" + margin.left + "," + margin.top + ")");

    // d3.csv("bar-data.csv", function(error, data) {

    //     data.forEach(function(d) {
    //         d.date = parseDate(d.date);
    //         d.value = +d.value;
    //     });
        
    // x.domain(data.map(function(d) { return d.date; }));
    // y.domain([0, d3.max(data, function(d) { return d.value; })]);

    // svg.append("g")
    //     .attr("class", "x axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis)
    //     .selectAll("text")
    //     .style("text-anchor", "end")
    //     .attr("dx", "-.8em")
    //     .attr("dy", "-.55em")
    //     .attr("transform", "rotate(-90)" );

    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis)
    //     .append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 6)
    //     .attr("dy", ".71em")
    //     .style("text-anchor", "end")
    //     .text("Value ($)");

    // svg.selectAll("bar")
    //     .data(data)
    //     .enter().append("rect")
    //     .style("fill", "steelblue")
    //     .attr("x", function(d) { return x(d.date); })
    //     .attr("width", x.rangeBand())
    //     .attr("y", function(d) { return y(d.value); })
    //     .attr("height", function(d) { return height - y(d.value); });

    //});

        //return div.text("hello");

        // var x = d3.scaleBand()
        //         .range([0, 500])
        //         .padding(0.1);
        // var y = d3.scaleLinear()
        //         .range([500, 0]);

        // // Scale the range of the data in the domains
        // x.domain(data2.map(function(d) { return d.Category }));

        // y.domain([0, d3.max(data, function(d) { return d.Rating})]);

        // // append the rectangles for the bar chart
        // svg.selectAll("rect")
        // //div.append("rect")
        //     .data(data2)
        //     .enter().append("rect")
        //     .attr("class", "bar")
        //     .attr("x", function(d) { return x(d.Category); })
        //     .attr("width", x.bandwidth())
        //     .style("color", "green")
        //     .attr("y", function(d) { return y(d.Rating); })
        //     .attr("height", function(d) { return height - y(d.Rating); });

        // // add the x Axis
        // svg.append("g")
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(d3.axisBottom(x));

        // // add the y Axis
        // svg.append("g")
        //     .call(d3.axisLeft(y));


}

// draw the axes and ticks
function drawAxes(limits, x, y, svgContainer, msm) {
    // return x value from a row of data
    let xValue = function (d) {
        return +d[x];
    }

    // function to scale x value
    let xScale = d3.scaleLinear()
        .domain([limits.xMin - 0.5, limits.xMax + 0.5]) // give domain buffer room
        .range([0 + msm.marginAll, msm.width - msm.marginAll])

    // xMap returns a scaled x value from a row of data
    let xMap = function (d) {
        return xScale(xValue(d));
    };

    // plot x-axis at bottom of SVG
    let xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
    svgContainer.append("g")
        .attr('transform', 'translate(0, ' + (msm.height - msm.marginAll) + ')')
        .call(xAxis);

    // return y value from a row of data
    let yValue = function (d) {
        return +d[y]
    }

    // function to scale y
    let yScale = d3.scaleLinear()
        .domain([limits.yMax + 5, limits.yMin - 5]) // give domain buffer
        .range([0 + msm.marginAll, msm.height - msm.marginAll])

    // yMap returns a scaled y value from a row of data
    let yMap = function (d) {
        return yScale(yValue(d));
    };

    // plot y-axis at the left of SVG
    let yAxis = d3.axisLeft().scale(yScale);
    svgContainer.append('g')
        .attr('transform', 'translate(' + msm.marginAll + ', 0)')
        .call(yAxis);

    // return mapping and scaling functions
    return {
        x: xMap,
        y: yMap,
        xScale: xScale,
        yScale: yScale
    };
}

// draw the axes and ticks
function drawAxes2(limits, x, y, svgContainer, msm) {
    // return x value from a row of data
    let xValue = function (d) {
        return +d[x];
    }

    // function to scale x value
    let xScale = d3.scaleLinear()
        .domain([limits.xMin - 0.5, limits.xMax + 0.5]) // give domain buffer room
        .range([0 + msm.marginAll, msm.width - msm.marginAll])

    // xMap returns a scaled x value from a row of data
    let xMap = function (d) {
        return xScale(xValue(d));
    };

    // plot x-axis at bottom of SVG
    let xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
    svgContainer.append("g")
        .attr('transform', 'translate(0, ' + (msm.height - msm.marginAll) + ')')
        .call(xAxis);

    // return y value from a row of data
    let yValue = function (d) {
        return +d[y]
    }

    // function to scale y
    let yScale = d3.scaleLinear()
        .domain([limits.yMax + 5, limits.yMin - 5]) // give domain buffer
        .range([0 + msm.marginAll, msm.height - msm.marginAll])

    // yMap returns a scaled y value from a row of data
    let yMap = function (d) {
        return yScale(yValue(d));
    };

    // plot y-axis at the left of SVG
    let yAxis = d3.axisLeft().scale(yScale).tickFormat(function(d){return d/1000000 + "M"});;
    svgContainer.append('g')
        .attr('transform', 'translate(' + msm.marginAll + ', 0)')
        .call(yAxis);

    // return mapping and scaling functions
    return {
        x: xMap,
        y: yMap,
        xScale: xScale,
        yScale: yScale
    };
}

// find min and max for arrays of x and y
function findMinMax(x, y) {

    // get min/max x values
    let xMin = d3.min(x);
    let xMax = d3.max(x);

    // get min/max y values
    let yMin = d3.min(y);
    let yMax = d3.max(y);

    // return formatted min/max data as an object
    return {
        xMin: xMin,
        xMax: xMax,
        yMin: yMin,
        yMax: yMax
    }
}

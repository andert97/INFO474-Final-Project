"use strict";
(function () {
    var selectedYear = "";
    // wait until window loads to execute code
    window.onload = function () {
        // set the dimensions and margins of the graph
        var margin = { top: 20, right: 20, bottom: 30, left: 40 },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // set the ranges
        var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
        var y = d3.scaleLinear()
            .range([height, 0]);

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // d3.select('#title')
        //     .attr('position', 'relative')
        //     .attr('left', '50px');

        svg.append('text')
            .attr('x', 450)
            .attr('y', 480)
            .attr('font-size', '12px')
            .text("Cuisines");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr('font-size', '12px')
            .style("text-anchor", "middle")
            .text("Count of Restaurants");

        // get the data
        d3.csv("yelp_academic_dataset_business.csv", function (data) {
            // define count object that holds count for each city
            var countObj = {};

            // count how much each city occurs in list and store in countObj
            data.forEach(function (d) {
                var city = d['categories'];
                if (countObj[city] === undefined) {
                    countObj[city] = 0;
                } else {
                    countObj[city] = countObj[city] + 1;
                }
            });
            // now store the count in each data member
            data.forEach(function (d) {
                var city = d['categories'];
                d.count = countObj[city];
            });

            var filteredData = data.filter(function (d) {
                return d['categories'] == "Chinese" || d['categories'] == "Italian" ||
                    d['categories'] == "Mexican" || d['categories'] == "Japanese" || d['categories'] == "Indian" ||
                    d['categories'] == "American" || d['categories'] == "French" || d['categories'] == "Greek" ||
                    d['categories'] == "Peruvian" || d['categories'] == "Vietnamese"
            });

            const tooltip = d3.select('body').append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);

            x.domain(filteredData.map(function (d) { return d['categories']; }));
            y.domain([0, d3.max(filteredData, function (d) { return d.count; })]);

            svg.selectAll(".bar")
                .data(filteredData)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) { return x(d['categories']); })
                .attr("width", x.bandwidth())
                .attr("y", function (d) { return y(d.count); })
                .attr("height", function (d) { return height - y(d.count); })
                .on('mouseover', (d) => {
                    tooltip.transition().duration(200).style('opacity', 0.9);
                    tooltip.html(`Count of ${d.categories} Restaurants: <span>${d.count}</span>`)
                        .style('left', `${d3.event.layerX}px`)
                        .style('top', `${(d3.event.layerY - 28)}px`);
                })
                .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0));

            // add the x Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // add the y Axis
            svg.append("g")
                .call(d3.axisLeft(y));

            var dropDown = d3.select("#yearfilter").append("select")
                .attr("name", "location");

            dropDown.append("option")
                .text("All");

            var options = dropDown.selectAll("option")
                .data(d3.map(filteredData, function (d) { return d["city"]; }).keys())
                .enter()
                .append("option");


            options.text(function (d) { return d; })
                .attr("value", function (d) { return d["city"]; });

            dropDown.on("change", function () {
                var selected = this.value;
                if (selected == "All") {
                    svg.selectAll("*").remove();
                    selectedYear = "";
                    // define count object that holds count for each city
                    var countObj = {};

                    // count how much each city occurs in list and store in countObj
                    data.forEach(function (d) {
                        var city = d['categories'];
                        if (countObj[city] === undefined) {
                            countObj[city] = 0;
                        } else {
                            countObj[city] = countObj[city] + 1;
                        }
                    });
                    // now store the count in each data member
                    data.forEach(function (d) {
                        var city = d['categories'];
                        d.count = countObj[city];
                    });

                    var filteredData = data.filter(function (d) {
                        return d['categories'] == "Chinese" || d['categories'] == "Italian" ||
                            d['categories'] == "Mexican" || d['categories'] == "Japanese" || d['categories'] == "Indian" ||
                            d['categories'] == "American" || d['categories'] == "French" || d['categories'] == "Greek" ||
                            d['categories'] == "Peruvian" || d['categories'] == "Vietnamese"
                    });

                    const tooltip = d3.select('body').append('div')
                        .attr('class', 'tooltip')
                        .style('opacity', 0);

                    x.domain(filteredData.map(function (d) { return d['categories']; }));
                    y.domain([0, d3.max(filteredData, function (d) { return d.count; })]);

                    svg.selectAll(".bar")
                        .data(filteredData)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", function (d) { return x(d['categories']); })
                        .attr("width", x.bandwidth())
                        .attr("y", function (d) { return y(d.count); })
                        .attr("height", function (d) { return height - y(d.count); })
                        .on('mouseover', (d) => {
                            tooltip.transition().duration(200).style('opacity', 0.9);
                            tooltip.html(`Count of ${d.categories} Restaurants: <span>${d.count}</span>`)
                                .style('left', `${d3.event.layerX}px`)
                                .style('top', `${(d3.event.layerY - 28)}px`);
                        })
                        .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0));

                    // add the x Axis
                    svg.append("g")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x));

                    // add the y Axis
                    svg.append("g")
                        .call(d3.axisLeft(y));

                    makeLabels();
                } else {
                    svg.selectAll("*").remove();

                    selectedYear = selected;

                    // define count object that holds count for each city
                    var countObj = {};

                    var cityData = data.filter(function (d) { return d['city'] == selected; });

                    // count how much each city occurs in list and store in countObj
                    cityData.forEach(function (d) {
                        var city = d['categories'];
                        if (countObj[city] === undefined) {
                            countObj[city] = 0;
                        } else {
                            countObj[city] = countObj[city] + 1;
                        }
                    });
                    // now store the count in each data member
                    cityData.forEach(function (d) {
                        var city = d['categories'];
                        d.count = countObj[city];
                    });

                    filteredData = cityData.filter(function (d) {
                        return d['categories'] == "Chinese" || d['categories'] == "Italian" ||
                            d['categories'] == "Mexican" || d['categories'] == "Japanese" || d['categories'] == "Indian" ||
                            d['categories'] == "American" || d['categories'] == "French" || d['categories'] == "Greek" ||
                            d['categories'] == "Peruvian" || d['categories'] == "Vietnamese"
                    });

                    x.domain(filteredData.map(function (d) { return d['categories']; }));
                    y.domain([0, d3.max(filteredData, function (d) { return d.count; })]);

                    svg.selectAll(".bar")
                        .data(filteredData)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", function (d) { return x(d['categories']); })
                        .attr("width", x.bandwidth())
                        .attr("y", function (d) { return y(d.count); })
                        .attr("height", function (d) { return height - y(d.count); })
                        .on('mouseover', (d) => {
                            tooltip.transition().duration(200).style('opacity', 0.9);
                            tooltip.html(`Count of ${d.categories} Restaurants: <span>${d.count}</span>`)
                                .style('left', `${d3.event.layerX}px`)
                                .style('top', `${(d3.event.layerY - 28)}px`);
                        })
                        .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0));

                    // add the x Axis
                    svg.append("g")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(x));

                    // add the y Axis
                    svg.append("g")
                        .call(d3.axisLeft(y));

                    makeLabels();
                }
            });
        });

        // make title and axes labels
        function makeLabels() {
            if (selectedYear != "") {
                d3.select('h1')
                    .text("Popular Cuisines in " + selectedYear);
            } else {
                d3.select('h1')
                    .text("Popular Cuisines");
            }

            svg.append('text')
                .attr('x', 450)
                .attr('y', 480)
                .attr('font-size', '12px')
                .text("Cuisines");

            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .attr('font-size', '12px')
                .style("text-anchor", "middle")
                .text("Count of Restaurants");
        }
    }
})();
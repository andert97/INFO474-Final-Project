'use strict';


let data = "no data"
let allGenData = "no data"
let svgScatterPlot = "" // keep SVG reference in global scope
let funcs = "" // scaling and mapping functions
var gens = 'All'
var legendary = 'All Pokemon'

const m = {
    width: 1500,
    height: 800,
    marginAll: 50
}

const colors = {

  "American": "#4E79A7",

  "Chinese": "#A0CBE8",

  "Indian": "#F28E2B", 

  "Italian": "#59A14F",

  "Japanese": "#8CD17D",

  "Mexican": "#B6992D",
  
  "Unverified": "#8B0000"
}



// load data and make scatter plot after window loads
svgScatterPlot = d3.select('body')
  .append('svg')
  .attr('width', m.width)
  .attr('height', m.height)

// d3.csv is basically fetch but it can be be passed a csv file as a parameter
d3.csv("./yelp_academic_dataset_business.csv")
  .then((csvData) => {
    data = csvData
    let genData = csvData.filter((row) => row['city'] == "Las Vegas")
    allGenData = genData.filter((row) => row['categories'].includes("Restaurants"))
    funcs = makeAxesAndLabels()
    makeScatterPlot("All", funcs) // initial scatter plot
})
.then(() => {
   
    var dropdownChange = function() {
      var selected = d3.select(this).property('value'),
      newData = selected  
      gens = newData                      
      makeScatterPlot(newData, funcs);
    };
   
  
    var generations = ['All', 88901, 89101, 89102, 89104, 89106, 89107, 89108, 89109, 89110, 89117, 89124,
    89128, 89129, 89130, 89131, 89133, 89134, 89136, 89138, 89143, 89144, 89145, 89146, 89147, 89149, 
    89154, 89155, 89162, 89166]; 
  var dropdown = d3.select("#vis-container")
.insert("select", "svg")
.on("change", dropdownChange);
dropdown.selectAll("option")
                    .data(generations)
                  .enter().append("option")
                    .attr("value", function (d) { return d; })
                    .text(function (d) {
                        return d; // capitalize 1st letter
                    });

                    
})

function makeAxesAndLabels() {
    // get fertility_rate and life_expectancy arrays
    const specialD = data.map((row) => parseFloat(row["stars"]))
    const total = data.map((row) => parseFloat(row["review_count"]))

    // find limits of data
    const limits = findMinMax(specialD, total)
    // draw axes and return scaling + mapping functions
    const funcs = drawAxes(limits, "stars", "review_count", svgScatterPlot, 
        {min: m.marginAll, max: m.width - m.marginAll}, {min: m.marginAll, max: m.height - m.marginAll})

    // draw title and axes labels
    makeLabels()

    return funcs
}
  

// make scatter plot with trend line
function makeScatterPlot(generation, funcs) {
 

  if(generation != "All") {
    data = allGenData.filter((row) => row['postal_code'] == generation)
  }  
  else{
    data = allGenData
  }
  // plot data as points and add tooltip functionality
  plotData(funcs) 
}


// make title and axes labels
function makeLabels() {
  svgScatterPlot.append('text')
    .attr('x', 50)
    .attr('y', 30)
    .attr('id', "title")
    .style('font-size', '14pt')
    .text("Las Vegas's Favorite Food")

  svgScatterPlot.append('text')
    .attr('x', 700)
    .attr('y', 785)
    .attr('id', "x-label")
    .style('font-size', '15pt')
    .text('Stars')

  svgScatterPlot.append('text')
    .attr('transform', 'translate(15, 300)rotate(-90)')
    .style('font-size', '15pt')
    .text('Total Amount of Reviews')
}

function findColor(categories){
  if(categories.includes('American')){
    return 'American'
  }
  else if(categories.includes('Japanese')){
    return 'Japanese'
  }
  else if(categories.includes('Chinese')){
    return 'Chinese'
  }
  else if(categories.includes('Indian')){
    return 'Indian'
  }
  else if(categories.includes('Italian')){
    return 'Italian'
  }
  else if(categories.includes('Mexican')){
    return 'Mexican'
  }
  else{
    return 'Unverified'
  }
}

// plot all the data points on the SVG
// and add tooltip functionality
function plotData(map) {
  // get population data as array
  //let pop_data = data.map((row) => +row["pop_mlns"])
  //let pop_limits = d3.extent(pop_data)
  // make size scaling function for population
  //let pop_map_func = d3.scaleLinear()
  //  .domain([pop_limits[0], pop_limits[1]])
  //  .range([3, 20])

  // mapping functions
  let xMap = map.x
  let yMap = map.y
  // make tooltip
  let div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("height", "50px")
  .style("width", "80px")
  /*******************************************************
   * Enter, Update, Exit pattern
   *******************************************************/
  // reference to the start of our update
  // append new data to existing points
  let update = svgScatterPlot.selectAll('circle')
    .data(data)

  // add new circles
  update
    .enter()
    .append('circle')
      .attr('cx', xMap)
      .attr('cy', yMap)
      .attr('r', 10)
      .style('stroke', 'black')
      .style('stroke-width', 1)
      .style('fill', (d) => colors[findColor(d['categories'])])

      // add tooltip functionality to points
      .on("mouseover", (d) => {
        div.transition()
          .duration(200)
          .style("opacity", .9)
        div.html( d["name"] 
        )
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
      })
      .on("mouseout", (d) => {
        div.transition()
          .duration(500)
          .style("opacity", 0)
      })

  // update.exit() returns the elements we no longer need
  update.exit().remove() // remove old elements
  
  // animate the update
  // note: new elements CANNOT be animated
  update.transition().duration(500)
    .attr('cx', xMap)
    .attr('cy', yMap)
    .attr('r', 10)
  
  /*******************************************
   * Enter, Update, Exit end
   ******************************************/
}

// draw the axes and ticks
// x -> the name of the field on the x axis
// y -> the name of the field on the y axis
// svg -> the svgContainer to draw on
// rangeX -> and object of the form {min: yourXMinimum, max: yourXMaximum}
// rangeY -> and object of the form {min: yourYMinimum, max: yourYMaximum}
function drawAxes(limits, x, y, svg, rangeX, rangeY) {
  // return x value from a row of data
  let xValue = function(d) { return +d[x] }

  // function to scale x value
  let xScale = d3.scaleLinear()
    .domain([limits.xMin, limits.xMax]) // give domain buffer room
    .range([rangeX.min, rangeX.max])

  // xMap returns a scaled x value from a row of data
  let xMap = function(d) { return xScale(xValue(d)) }

  // plot x-axis at bottom of SVG
  let xAxis = d3.axisBottom().scale(xScale).ticks(10)
  svg.append("g")
    .attr('transform', 'translate(0, ' + rangeY.max + ')')
    .attr('id', "x-axis")
    .call(xAxis)

  // return y value from a row of data
  let yValue = function(d) { return +d[y]}

  // function to scale y
  let yScale = d3.scaleLinear()
    .domain([limits.yMax, limits.yMin]) // give domain buffer
    .range([rangeY.min, rangeY.max])

  // yMap returns a scaled y value from a row of data
  let yMap = function (d) { return yScale(yValue(d)) }

  // plot y-axis at the left of SVG
  let yAxis = d3.axisLeft().scale(yScale).ticks(20)
  svg.append('g')
    .attr('transform', 'translate(' + rangeX.min + ', 0)')
    .attr('id', "y-axis")
    .call(yAxis)

  // return mapping and scaling functions
  return {
    x: xMap,
    y: yMap,
    xScale: xScale,
    yScale: yScale
  }
}

// find min and max for arrays of x and y
function findMinMax(x, y) {

  // get min/max x values
 // let xMin = d3.min(x)
  let xMin = 0
  //let xMax = d3.max(x)
  let xMax = 5
  // get min/max y values
 // let yMin = d3.min(y)
  //let yMax = d3.max(y)
  let yMin = 0
  let yMax = 9000
  // return formatted min/max data as an object
  return {
    xMin : xMin,
    xMax : xMax,
    yMin : yMin,
    yMax : yMax
  }
}

// format numbers
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}



//let timeExtent = d3.extent(allYearsData.map((row) => row["time"]))





/*dropdown.selectAll("option")
                    .data(timeExtent)
                  .enter().append("option")
                    .attr("value", function (d) { return d; })
                    .text(function (d) {
                        return d; // capitalize 1st letter
                    });*/


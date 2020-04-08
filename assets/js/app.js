// @TODO: YOUR CODE HERE!
//  Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from the data.csv file
// =================================
d3.csv("./assets/data/data.csv").then(function (censusData) {
  //Format the data
  censusData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Step 5: Create the scales for the chart
  // =================================
  var xLinearScale = d3
    .scaleLinear()
    .domain([8.5, d3.max(censusData, (d) => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3
    .scaleLinear()
    .domain([4, d3.max(censusData, (d) => d.healthcare)])
    .range([height, 0]);

  // Step 7: Create the axes
  // =================================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 8: Append the axes to the chartGroup
  // ==============================================
  // Add x-axis
  chartGroup
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Add y-axis
  chartGroup.append("g").call(leftAxis);

  //Append circles
  chartGroup
    .append("g")
    .selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", (d) => xLinearScale(d.poverty))
    .attr("cy", (d) => yLinearScale(d.healthcare))
    .attr("r", 10)
    .style("fill", "lightblue");

  // Add state labels to the points
  var circleLabels = chartGroup
    .selectAll(null)
    .data(censusData)
    .enter()
    .append("text")
    .attr("x", (d) => xLinearScale(d.poverty))
    .attr("y", (d) => yLinearScale(d.healthcare) + 4)
    .text((d) => d.abbr)
    .attr("font-size", "10px")
    .attr("font-weight", "bold")
    .attr("fill", "white")
    .attr("text-anchor", "middle");

  //append x axis label
  chartGroup
    .append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .text("In Poverty (%)");

  // append y axis
  chartGroup
    .append("text")
    .attr("transform", `translate(-30, ${height / 2}) rotate(-90)`)
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .text("Lacks Healthcare (%)");
});

// @TODO: YOUR CODE HERE!
//  Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper,
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

// Draw x-axis groups
var xAxis = chartGroup.append("g").attr("transform", `translate(0, ${height})`);

// Draw y-axis groups
var yAxis = chartGroup.append("g");

// Draw circles
var circles;

//Draw circle labels
var circleLabels;

//Initialize Tooltip
var toolTip = d3.tip().attr("class", "tooltip");

// Create the tooltip in chartGroup.
chartGroup.call(toolTip);

//DRAW AXIS LABELS
//Append x axis label
function xAxisLabel(name, d) {
  return chartGroup
    .append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + d})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .classed("axis-label", true)
    .text(name);
}
var povertyAxis = xAxisLabel("In Poverty %", 20);
var ageAxis = xAxisLabel("Age (Median)", 40);
var incomeAxis = xAxisLabel("Household Income (Median)", 60);

// Append y axis
function yAxisLabel(name, d) {
  return chartGroup
    .append("text")
    .attr("transform", `translate(-${d}, ${height / 2}) rotate(-90)`)
    .attr("font-size", "14px")
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .classed("axis-label", true)
    .text(name);
}
var healthcareAxis = yAxisLabel("Lacks Healthcare (%)", 30);
var smokeAxis = yAxisLabel("Smoke (%)", 50);
var obesityAxis = yAxisLabel("Obese (%)", 70);

//Function to create/update graph
function drawGraph(censusData, x = "poverty", y = "healthcare") {
  // Create the scales for the chart
  // =================================
  var xLinearScale = d3
    .scaleLinear()
    .domain(d3.extent(censusData, (d) => d[x]))
    .range([0, width]);

  var yLinearScale = d3
    .scaleLinear()
    .domain(d3.extent(censusData, (d) => d[y]))
    .range([height, 0]);

  // Create the axes
  // =================================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append the axes to the chartGroup
  // ==============================================
  // Add x-axis
  xAxis.transition().duration(500).call(bottomAxis);

  // Add y-axis
  yAxis.transition().duration(500).call(leftAxis);

  //Append circles
  circles
    .transition()
    .duration(500)
    .attr("cx", (d) => xLinearScale(d[x]))
    .attr("cy", (d) => yLinearScale(d[y]))
    .attr("r", 10)
    .style("fill", "lightblue");

  // Add state labels to the points
  circleLabels
    .transition()
    .duration(500)
    .attr("x", (d) => xLinearScale(d[x]))
    .attr("y", (d) => yLinearScale(d[y]) + 4)
    .attr("font-size", "10px")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .attr("text-anchor", "middle");

  // X AXIS On Clicks
  povertyAxis.classed("active", x == "poverty").on("click", () => {
    drawGraph(censusData, "poverty", y);
  });

  ageAxis.classed("active", x == "age").on("click", () => {
    drawGraph(censusData, "age", y);
  });

  incomeAxis.classed("active", x == "income").on("click", () => {
    drawGraph(censusData, "income", y);
  });

  // Y AXIS On Clicks
  healthcareAxis.classed("active", y == "healthcare").on("click", () => {
    drawGraph(censusData, x, "healthcare");
  });

  smokeAxis.classed("active", y == "smokes").on("click", () => {
    drawGraph(censusData, x, "smokes");
  });

  obesityAxis.classed("active", y == "obesity").on("click", () => {
    drawGraph(censusData, x, "obesity");
  });

  toolTip.html(
    (d) =>
      `${d.state}<hr style="margin-bottom:0;background-color:white">${x}: ${d[x]}<br/>${y}: ${d[y]}`
  );
}

// Import data from the data.csv file
// =================================
d3.csv("./assets/data/data.csv").then(function (censusData) {
  //Format the data
  censusData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    data.age = +data.age;
    data.income = +data.income;
  });

  circles = chartGroup
    .append("g")
    .selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle");

  circleLabels = chartGroup
    .append("g")
    .selectAll("text")
    .data(censusData)
    .enter()
    .append("text")
    .text((d) => d.abbr)
    // Create "mouseover" event listener to display tooltip
    .on("mouseover", (d) => toolTip.show(d, this))
    // Step 4: Create "mouseout" event listener to hide tooltip
    .on("mouseout", (d) => toolTip.hide(d, this));

  //Update Graph
  drawGraph(censusData);
});

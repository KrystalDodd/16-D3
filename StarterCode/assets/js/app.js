// @TODO: YOUR CODE HERE!
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

 
var svgWidth = 800;
var svgHeight = 600;

var margin = {
  top: 60,
  right: 60,
  bottom: 70,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import data from the CSV file
var csvFile = "assets/data/data.csv"
d3.csv(csvFile)
  .then(function(newsData) {

    // Parse Data/Cast as numbers
    newsData.forEach(function(data) {
      data.poverty = +data.poverty
      data.healthcare = +data.healthcare;
    });

     console.log(newsData)
  


    // Scale functions
    var xLinearScale= d3.scaleLinear()
      .domain([
        d3.min(newsData, d => d.poverty)*0.9, 
        d3.max(newsData, d => d.poverty)*1.1
      ])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([
        d3.min(newsData, d => d.healthcare)*0.9,
        d3.max(newsData, d => d.healthcare)*1.1
      ])
      .range([height, 0]);

    // Axis functions
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
    
    chartGroup.append("g")
      .call(yAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(newsData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "10")
      .attr("fill", "lightblue");

    // Add States to Circles
    var textgroup = chartGroup.selectAll()
      .data(newsData)
      .enter()
      .append("text")
      .text(d => (d.abbr))
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare)+4)
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .style("font-weight", "700")
      .style('fill', 'black');

    // Tool tip
    var tooltip = d3.tip()
      .attr("class", "tooltip")
      .offset([35, -75])
      .html(function(d) {
        return(`${d.state}<br>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`);
      });

    // create tooltip
    chartGroup.call(tooltip);

    // Create event listeners for circles and text group
  

      circlesGroup.on("mouseover", function(d) {
      tooltip.show(d, this);
      d3.select(this).style("stroke", "black");
    })
      .on("mouseout", function(d) {
        tooltip.hide(d);
        d3.select(this).style("stroke", "white");
      });

    textgroup.on("mouseover", function(d) {
        tooltip.show(d, this);
        d3.select(this).style("stroke", "black");
      })
        .on("mouseout", function(d) {
          tooltip.hide(d);
          d3.select(this).style("stroke", "white");
        });   

    // Axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 20)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)")
      .style("font-weight", "500");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.2}, ${height + margin.top - 10})`)
      .attr("class", "axisText")
      .text("In Poverty (%)")
      .style("font-weight", "500");
  });

}

makeResponsive();

var svgWidth = 790;
var svgHeight = 460;

var chartMargin = {
    top: 30,
    right: 30,
    bottom: 100,
    left: 100
};

var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);
// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

var chosenXAxis = "age_18_to_24_obese" || "age_25_to_34_obese" || "age_35_to_44_obese" || "age_45_to_54_obese" || "age_55_to_64_obese" || "age_65_up_obese";
var chosenYAxis = "male_obese" || "female_obese";

function xScale(data, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.9, d3.max(data, d => d[chosenXAxis]) * 1.1])
        .range([0, chartWidth]);
    return xLinearScale;
}

function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

function yScale(data, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.65, d3.max(data, d => d[chosenYAxis]) * 1.05])
        .range([chartHeight, 0]);
    return yLinearScale;
}

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}

function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
        .duration(1000)
        .attr("dx", d => newXScale(d[chosenXAxis]))
        .attr("dy", d => newYScale(d[chosenYAxis]));
    return textGroup;
}

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "age_18_to_24_obese") {
        var xlabel = "Age 18 to 24 Obese (%):";
    } else if (chosenXAxis === "age_25_to_34_obese") {
        var xlabel = "Age 25 to 34 Obese (%)";
    } else if (chosenXAxis === "age_35_to_44_obese") {
        var xlabel = "Age 35 to 44 Obese (%)";
    } else if (chosenXAxis === "age_45_to_54_obese") {
        var xlabel = "Age 45 to 54 Obese (%)";
    } else if (chosenXAxis === "age_55_to_64_obese") {
        var xlabel = "Age 55 to 64 Obese (%)";
    } else if (chosenXAxis === "age_65_up_obese") {
        var xlabel = "Age 65 and Up Obese (%)";
    }
    if (chosenYAxis === "male_obese") {
        var ylabel = "Male Obese (%):";
    } else if (chosenYAxis === "female_obese") {
        var ylabel = "Female Obese (%):";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([-8, 0])
        .html(function(d) {
            return (`${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);
    circlesGroup.on('mouseover', function(d) { toolTip.show(d, this); })
        .on("mouseout", function(d) { toolTip.hide(d, this); });
    return circlesGroup;
}

d3.csv("data.csv").then(function(data) {
        console.log(data);
        data.forEach(function(d) {
            d.male = +d.male_obese;
            d.female = +d.female_obese;
            d.age_18_to_24_obese = +d.age_18_to_24_obese;
            d.age_25_to_34_obese = +d.age_25_to_34_obese;
            d.age_35_to_44_obese = +d.age_35_to_44_obese;
            d.age_45_to_54_obese = +d.age_45_to_54_obese;
            d.age_55_to_64_obese = +d.age_55_to_64_obese;
            d.age_65_up_obese = +d.age_65_up_obese;
        });

        var xLinearScale = xScale(data, chosenXAxis);
        var yLinearScale = yScale(data, chosenYAxis);

        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .classed("y-axis", true)
            .call(leftAxis);

        // var chart = chartGroup.append("g").data(data).enter();
        var circlesGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
    })
    .style("opacity", 0.5)
    .style("fill", function(d) {
        if ((d.male_obese)) { return "red"; }
        if ((d.female_obese)) { return "green"; }
    })
    .style("stroke", "grey");
var textGroup = chartGroup.selectAll('text')
    .data(data, function(d, i) { return d + i; })
    .enter()
    .append("text")
    .text(function(d) {
        return d.abbr;
    })


var xlabelsGroup = chartGroup.append("g");
var ylabelsGroup = chartGroup.append("g");

var age_18_to_24_obeseLabel = xlabelsGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top +10})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .attr("value", "poverty")
    .classed("active", true)
    .text("In Poverty (%)");

var age_25_to_34_obeseLabel = xlabelsGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top +30})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .attr("value", "age")
    .classed("active", true)
    .text("Age (Median)");

var age_35_to_44_obeseLabel = xlabelsGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top +50})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .attr("value", "income")
    .classed("active", true)
    .text("Household Income (Median)");

var age_45_to_54_obeseLabel = xlabelsGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top +50})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .attr("value", "income")
    .classed("active", true)
    .text("Household Income (Median)");

var age_55_to_64_obeseLabel = xlabelsGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top +50})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .attr("value", "income")
    .classed("active", true)
    .text("Household Income (Median)");
var age_65_up_obeseLabel = xlabelsGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top +50})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .attr("value", "income")
    .classed("active", true)
    .text("Household Income (Median)");

var male_obeseLabel = ylabelsGroup.append("text")
    .text("Lacks Healthcare (%)")
    .attr("y", 0 - chartMargin.left + 40)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .attr("transform", "rotate(-90)")
    .attr("value", "healthcare")
    .classed("active", true)
    .style("text-anchor", "middle");

var female_obeseLabel = ylabelsGroup.append("text")
    .text("Smokes (%)")
    .attr("y", 0 - chartMargin.left + 20)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .attr("transform", "rotate(-90)")
    .attr("value", "smokes")
    .classed("active", true)
    .style("text-anchor", "middle");

var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

xlabelsGroup.selectAll("text")
    .on("click", function() {
        var xValue = d3.select(this).attr("value");
        console.log("xVal:", xValue);
        chosenXAxis = xValue;
        console.log("chosenX:", chosenXAxis);
        xLinearScale = xScale(data, chosenXAxis);
        xAxis = renderXAxes(xLinearScale, xAxis);
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        if (chosenXAxis === "age_18_to_24_obese") {
            age_18_to_24_obeseLabel
                .classed("active", true)
                .classed("inactive", false);
            age_25_to_34_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            age_35_to_44_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            age_45_to_54_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            age_55_to_64_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            age_65_up_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
        } else if (chosenXAxis === "age_25_to_34_obese") {
            age_18_to_24_obeseLabel
                .classed("active", true)
                .classed("inactive", false);
            age_25_to_34_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            age_35_to_44_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            age_45_to_54_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            age_55_to_64_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            age_65_up_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
        } else {
            age_18_to_24_obeseLabel
                .classed("active", true)
                .classed("inactive", false);
            age_25_to_34_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            age_35_to_44_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            age_45_to_54_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            age_55_to_64_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            age_65_up_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
        }
    });

ylabelsGroup.selectAll("text")
    .on("click", function() {
        var yValue = d3.select(this).attr("value");
        console.log("yVal:", yValue);
        chosenYAxis = yValue;
        console.log("chosenY:", chosenYAxis);
        yLinearScale = yScale(data, chosenYAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        if (chosenYAxis === "male_obese") {
            male_obeseLabel
                .classed("active", true)
                .classed("inactive", false);
            female_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
        } else if (chosenYAxis === "female_obese") {
            male_obeseLabel
                .classed("active", true)
                .classed("inactive", false);
            female_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
        } else {
            male_obeseLabel
                .classed("active", true)
                .classed("inactive", false);
            female_obeseLabel
                .classed("active", false)
                .classed("inactive", true);
        }
    });
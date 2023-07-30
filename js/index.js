var priceTab = new bootstrap.Tab(document.querySelector('#price'))
var countryTab = new bootstrap.Tab(document.querySelector('#country'))
var varietyTab = new bootstrap.Tab(document.querySelector('#variety'))

colorYellow = "#FFFF00";   //Yellow
colorBlue = "#0000FF";   //Blue
colorGreen = "#008000"; //Green
colorRed = "#FF0000";  //Red
colorBlack = "#000000";  //Black

const varietyColor = d3.scaleOrdinal()
    .domain(["Sauvignon Blanc", "Chardonnay", "Red Blend", "Merlot", "Pinot Noir"])
    .range([colorYellow, colorBlue, colorGreen, colorRed, colorBlack])
const countryColor = d3.scaleOrdinal()
    .domain(["England", "India", "Mexico", "Spain", "US"])
    .range([colorYellow, colorBlue, colorGreen, colorRed, colorBlack])
const provinceColor = d3.scaleOrdinal()
    .domain(["Valle de Guadalupe", "America", "Central Spain", "England", "Nashik"])
    .range([colorYellow, colorBlue, colorGreen, colorRed, colorBlack])

colorMap = {
    'variety': [varietyColor, 'variety'],
    'country': [countryColor, 'country'],
    'province': [provinceColor, 'province'],
}

function writePriceCharts(data) {
    document.getElementById("chart-price").innerHTML = "";
    renderPriceChart(data);
}
function writeCountryCharts(data) {
    document.getElementById("chart-country").innerHTML = "";
    renderCountryChart(data);
}
function writeVarietyCharts(data) {
    document.getElementById("chart-variety").innerHTML = "";
    renderVarietyChart(data);
}

d3.csv("data/original_winemag-data.csv").then(function (data) {
    renderPriceChart(data);
    var tabElms = document.querySelectorAll('a[data-bs-toggle="list"]')
    tabElms.forEach(function (tabElm) {
        tabElm.addEventListener('shown.bs.tab', function (event) {
            switch (event.target.getAttribute("id")) {
                case 'price':
                    writePriceCharts(data);
                    break;
                case 'country':
                    writeCountryCharts(data);
                    break;
                case 'variety':
                    writeVarietyCharts(data);
                    break;
                default:
                    break;
            }
        })
    });
    document.getElementById('colorSelect').addEventListener('change', function () {
        switch (this.value) {
            case 'variety':
                document.getElementById('selectPills').innerHTML = `
                <div><span class="badge rounded-pill text-dark" style="background-color: ${colorYellow};">Sauvignon Blanc</span></div>
                <div><span class="badge rounded-pill" style="background-color: ${colorBlue};">Chardonnay</span></div>
                <div><span class="badge rounded-pill" style="background-color: ${colorGreen};">Red Blend</span></div>
                <div><span class="badge rounded-pill" style="background-color: ${colorRed};">Merlot</span></div>
                <div><span class="badge rounded-pill" style="background-color: ${colorBlack};">Pinot Noir</span></div>
                `;
                break;
            case 'country':
                document.getElementById('selectPills').innerHTML = `
                <div><span class="badge rounded-pill text-dark" style="background-color: ${colorYellow};">England</span></div>
                <div><span class="badge rounded-pill" style="background-color: ${colorBlue};">India</span></div>
                <div><span class="badge rounded-pill" style="background-color: ${colorGreen};">Mexico</span></div>
                <div><span class="badge rounded-pill" style="background-color: ${colorRed};">Spain</span></div>
                <div><span class="badge rounded-pill" style="background-color: ${colorBlack};">US</span></div>
                `;
                break;
            case 'province':
                document.getElementById('selectPills').innerHTML = `
                <div><span class="badge rounded-pill text-dark" style="background-color: ${colorYellow};">Valle de Guadalupe</span></div>
                <div><span class="badge rounded-pill" style="background-color: ${colorBlue};">America</span></div>
                <div><span class="badge rounded-pill" style="background-color: ${colorGreen};">Central Spain</span></div>
                <div><span class="badge rounded-pill" style="background-color: ${colorRed};">England</span></div>
                <div><span class="badge rounded-pill" style="background-color: ${colorBlack};">Nashik</span></div>
                `;
                break;
            default:
                break;
        }
        writePriceCharts(data);
        writeCountryCharts(data);
        writeVarietyCharts(data);
    });
})


function renderPriceChart(data) {
    priceToolTip = d3.select("#chart-price")
        .append("div")
        .attr("class", "tooltip")
    priceToolTipMouseOver = function (event, d) { priceToolTip.style("opacity", .65) }
    priceToolTipMouseMove = function (event, d) {
        priceToolTip
            .html(d.points)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 50) + "px")
    }
    priceToolTipMouseLeave = function (event, d) {
        priceToolTip
            .transition()
            .duration(500)
        priceToolTip.style("opacity", 0)
    };
    priceAnnotations = d3.annotation()
        .annotations([{
            note: {
                label: "Positive correlation with price, with some outliers.",
            },
            x: 220,
            y: 140,
            dy: -65,
            dx: 55
        }])

    colorPair = colorMap[document.getElementById("colorSelect").value]
    margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    svg1 = d3.select("#chart-price")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    x1 = d3.scaleLinear()
        .domain([0, 120])
        .range([0, width]);
    svg1.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x1))
    y1 = d3.scaleLinear()
        .domain([75, 100])
        .range([height, 0]);
    svg1.append("g")
        .call(d3.axisLeft(y1));
    svg1.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return x1(d.price); })
        .attr("cy", function (d) { return y1(d.points); })
        .attr("r", 4)
        .style("fill", function name(d) { return colorPair[0](d[colorPair[1]]) })
        .on("mouseover", priceToolTipMouseOver)
        .on("mousemove", priceToolTipMouseMove)
        .on("mouseleave", priceToolTipMouseLeave)
    svg1.append("g").call(priceAnnotations)
    svg1.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Price");
    svg1.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Quality");
}

function renderCountryChart(data) {
    countryToolTip = d3.select("#chart-country")
        .append("div")
        .attr("class", "tooltip")
    countryToolTipMouseOver = function (event, d) { countryToolTip.style("opacity", .65) }
    countryToolTipMouseMove = function (event, d) {
        countryToolTip
            .html("Quality: " + d.points + "<br>" +
                 "Country: " + d.country)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 50) + "px")
    }
    countryToolTipMouseLeave = function (event, d) {
        countryToolTip
            .transition()
            .duration(500)
        countryToolTip.style("opacity", 0)
    };

    countryAnnotations = d3.annotation()
        .annotations([{
            note: {
                label: "Range of Quality by Country.",
            },
            x: 220,
            y: 140,
            dy: -65,
            dx: 55
        }])

    margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    svg1 = d3.select("#chart-country")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    x1 = d3.scaleLinear()
        .domain([0, 5])
        .range([0, width]);
    svg1.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x1))
    y1 = d3.scaleLinear()
        .domain([75, 100])
        .range([height, 0]);
    svg1.append("g")
        .call(d3.axisLeft(y1));
    svg1.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return x1(d.countryCode); })
        .attr("cy", function (d) { return y1(d.points); })
        .attr("r", 4)
        .style("fill", function name(d) { return colorPair[0](d[colorPair[1]]) })
        .on("mouseover", countryToolTipMouseOver)
        .on("mousemove", countryToolTipMouseMove)
        .on("mouseleave", countryToolTipMouseLeave)
    svg1.append("g").call(countryAnnotations)
    svg1.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Country Code");
    svg1.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Quality");
}

function renderVarietyChart(data) {
    varietyToolTip = d3.select("#chart-variety")
        .append("div")
        .attr("class", "tooltip")
    varietyToolTipMouseOver = function (event, d) { varietyToolTip.style("opacity", .65) }
    varietyToolTipMouseMove = function (event, d) {
        varietyToolTip
           .html("Quality: " + d.points + "<br>" +
                 "Variety: " + d.variety)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 50) + "px")
    }
    varietyToolTipMouseLeave = function (event, d) {
        varietyToolTip
            .transition()
            .duration(500)
        varietyToolTip.style("opacity", 0)
    };
    varietyAnnotations = d3.annotation()
        .annotations([{
            note: {
                label: "Range of Quality by Variety.",
            },
            x: 220,
            y: 140,
            dy: -65,
            dx: 55
        }])
    margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    svg1 = d3.select("#chart-variety")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    x1 = d3.scaleLinear()
        .domain([0, 5])
        .range([0, width]);
    svg1.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x1))
    y1 = d3.scaleLinear()
        .domain([75, 100])
        .range([height, 0]);
    svg1.append("g")
        .call(d3.axisLeft(y1));
    svg1.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("cx", function (d) { return x1(d.VarietyCode); })
        .attr("cy", function (d) { return y1(d.points); })
        .attr("r", 4)
        .style("fill", function name(d) { return colorPair[0](d[colorPair[1]]) })
        .on("mouseover", varietyToolTipMouseOver)
        .on("mousemove", varietyToolTipMouseMove)
        .on("mouseleave", varietyToolTipMouseLeave)
    svg1.append("g").call(varietyAnnotations)
    svg1.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("Variety Code");
    svg1.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Quality");
}

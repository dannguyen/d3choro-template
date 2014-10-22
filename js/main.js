

function hello_map(div_id, csv_file){
  var width = 960,      // TK
      height = 600;      // TK

  var projection = d3.geo.albersUsa()
    .translate([width / 2, height / 2]);

    // TK quantize config
  var quantConfig = d3.scale.quantize()
    .domain([0, .15])  // TK
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

  // initialize visualization
  var viz = d3.select("#" + div_id).append("svg")
      .attr("width", width)
      .attr("height", height);


  // TK initialize tip
  var toolTip = d3.tip().attr('class', 'd3-tip').html(
    function(d){
      return "hi " + rateById.get(d.id);
    });

  var rateById = d3.map();

  queue()
    .defer(d3.json, "/us.json")
    .defer(d3.csv, csv_file, function(d) { rateById.set(d.id, +d.rate); }) // TK column headers
    .await(function(err, data){
      console.log(err)
      onDataLoad(err, data, viz, projection, toolTip, quantConfig, rateById);
    });


  d3.select(self.frameElement).style("height", height + "px");
}

function onDataLoad(error, us_data, svg, projection, tool_tip, quantize_op, rate_by_id) {


  var path = d3.geo.path()
    .projection(projection);

  svg.call(tool_tip);
  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(topojson.feature(us_data, us_data.objects.counties).features)
    .enter().append("path")
      .attr("class", function(d) { return quantize_op(rate_by_id.get(d.id)); })
      .attr("d", path)
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide);
  svg.append("path")
      .datum(topojson.mesh(us_data, us_data.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);
}





hello_map('map-box', '/data.csv');

hello_map('map-box-2', '/data.csv');






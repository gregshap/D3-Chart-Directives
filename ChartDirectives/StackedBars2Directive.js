var dash2;
(function() {
  var namespace = angular.module('dash2.charts.stack2', []);
  namespace.directive('dash2Stacked2', function() {
          return {
            restrict: 'E',
            scope: {
              val: '='
            },
            link: function (scope, element, attrs) {

            	//Based on http://bl.ocks.org/mbostock/4679202


        		//GENERAL SETUP
            var parseDate = d3.time.format("%Y-%m").parse,
				    formatYear = d3.format("02d"),
				    formatDate = function(d) { return "Q" + ((d.getMonth() / 3 | 0) + 1) + formatYear(d.getFullYear() % 100); };

				  var margin = {top: 10, right: 20, bottom: 20, left: 40},
				      width = 960 - margin.left - margin.right,
				      height = 500 - margin.top - margin.bottom;

				  var y0 = d3.scale.ordinal()
				      .rangeRoundBands([height, 0], .2);

				  var y1 = d3.scale.linear()
				  				.rangeRound([height,0]);

				  var y2 = d3.scale.linear()
				  				.rangeRound([height, 0])

				  var x = d3.scale.ordinal()
				      .rangeRoundBands([0, width], .1, 0);

				  var xAxis = d3.svg.axis()
				      .scale(x)
				      .orient("bottom")
				      .tickFormat(formatDate);

          var yAxis = d3.svg.axis()
              .scale(y2)
              .orient("left")
              .tickFormat(d3.format(".2s"));

				  var nest = d3.nest()
				      .key(function(d) { return d.group; });

				  var stack = d3.layout.stack()
				      .values(function(d) { return d.values; })
				      .x(function(d) { return d.label; })
				      .y(function(d) { return d.value; })
				      .out(function(d, y0) { d.valueOffset = y0; });

          var color = d3.scale.linear()
              .range(["#1caa58", "#E44492", "#3498db"]);

				  var svg = d3.select("body").append("svg")
				      .attr("width", width + margin.left + margin.right)
				      .attr("height", height + margin.top + margin.bottom)
				      .attr("class", "dash2-container")
				    .append("g")
				      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				  	var tip = d3.tip()
                  .attr('class', 'dash2-tooltip')
                  .offset([-10, 0])
                  .html(function(d) {
                  return "<strong>"+ d.label + "<span>" + d.value + "</span>";
                })
		      //END GENERAL SETUP

          		scope.$watch('val', function (newVal, oldVal) {

					// clear any elements inside of the directive
					svg.selectAll('*').remove();

					// if 'val' is undefined, exit
					if (!newVal) {
					console.log("exit directive");
					return;
					}

					//Get the base data for our chart. 
					//Make a deep copy, because we're going to play around with the data format
					var data = JSON.parse(JSON.stringify(newVal));



				     var logdata = JSON.parse(JSON.stringify(data));

				    data.forEach(function(d) {
				      d.label = parseDate(d.date);
				      d.value = +d.value;
				    });

				    var dataByGroup = nest.entries(data);

				    stack(dataByGroup);
				    console.log (dataByGroup);
				    x.domain(dataByGroup[0].values.map(function(d) { return d.label; }));
				    y0.domain(dataByGroup.map(function(d) { return d.key; }));
				    y1.domain([0, d3.max(data, function(d) { return d.value; })]).range([y0.rangeBand(), 0]);
  					y2.domain([0, d3.max(data, function(d) { return d.value })]);

  					color.domain([0, Math.floor(dataByGroup.length / 2) ,dataByGroup.length - 1])

  					svg.call(tip);

				    var group = svg.selectAll(".group")
				        .data(dataByGroup)
				      .enter().append("g")
				        .attr("class", "group")
				        .attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });

				    group.selectAll("rect")
				        .data(function(d) { return d.values; })
				      .enter().append("rect")
				        .attr("x", function(d) { return x(d.label); })
				        .attr("y", function(d) { return y1(d.value); })
				        .attr("width", x.rangeBand())
				        .attr("height", function(d) { return y0.rangeBand() - y1(d.value); })
				        .style("color", function(d) { return color(d.group); })
				        .attr("class", "dash2-datapoint")
	              .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

				    svg.filter(function(d, i) { return !i; }).append("g")
				        .attr("class", "x axis")
				        .attr("transform", "translate(0," + (height - 20) + ")")
				        .call(xAxis);

				    svg.filter(function(d, i) { return !i; }).append("g")
				        .attr("class", "y axis")
				        .attr("transform", "translate(" + 0 + ","+ -20 +")")
				        .call(yAxis);

				    // d3.selectAll("input").on("change", change);

				    // var timeout = setTimeout(function() {
				    //   d3.select("input[value=\"stacked\"]").property("checked", true).each(change);
				    // }, 2000);

				    // function change() {
				    //   // clearTimeout(timeout);
				    //   transitionStacked();
				    // }
				    console.log(dataByGroup)
              var legend = svg.selectAll(".legend")
                .data(dataByGroup)
              .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
				        .style("fill", function (d, i) {  return color(i) });

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { console.log(d); return d.label; });


				    function transitionMultiples() {
				      var t = svg.transition().duration(750),
				          g = t.selectAll(".group").attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
				      g.selectAll("rect").attr("y", function(d) { return y1(d.value); });
				      g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2); })
				    }

				    function transitionStacked() {
				      var t = svg.transition().duration(750),
				          g = t.selectAll(".group").attr("transform", "translate(0," + y0(y0.domain()[0]) + ")");
				      g.selectAll("rect").attr("y", function(d) { return y1(d.value + d.valueOffset); });
				      g.select(".group-label").attr("y", function(d) { return y1(d.values[0].value / 2 + d.values[0].valueOffset); })
				    }

				    transitionStacked();

              });
              
          }
        }

  });
})(dash2 || (dash2 = {}));
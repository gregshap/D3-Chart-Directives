var dash2;
(function() {
  var namespace = angular.module('dash2.charts.groupedbar', []);
  namespace.directive('dash2Grouped', function() {
          return {
            restrict: 'E',
            scope: {
              val: '='
            },
            link: function (scope, element, attrs) {

                console.log("indyVar");
                console.log(attrs.independentvariable);
                console.log("indyVar");
                
                /**************************************************
                *
                * Setup that is not dependent on the actual dataset
                *
                ****************************************************/
                //Todo: set these as directive attributes
                var margin = {top: 20, right: 20, bottom: 120, left: 40},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var x0 = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1);

                var x1 = d3.scale.ordinal();

                var y = d3.scale.linear()
                    .range([height, 0]);

                var color = d3.scale.ordinal()
                    .range(["#1caa58", "#3498db"]);

                var xAxis = d3.svg.axis()
                    .scale(x0)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .tickFormat(d3.format(".2s"));

                /**************************************************
                * End of data agnostic setup
                ****************************************************/


                //set up initial svg object
                var svg = d3.select(element[0]).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                /*****************************************************
                * Define our axes
                ******************************************************/
                var INDEPENDENT_VARIABLE = attrs.independentvariable;
                var DEPENDENT_AXIS_LABEL = attrs.dependentlabel;


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

                  //Get the column names for dependent dimensions
                  //d3.keys returns an array containing the property namesof the specified object
                  
                  var childBarNames = d3.keys(data[0]).filter(function(key) { 
                                                                        return key !== INDEPENDENT_VARIABLE; 
                                                                      });

                  console.log(childBarNames);
                  console.log(d3.keys(data[0]));

                  //Add the child field values as a separate property
                  data.forEach(function(d) {
                      d.childBars = childBarNames.map(function(name) { 
                                                      return {name: name, value: +d[name]}; 
                                                    });
                      });


                  x0.domain(data.map(function(d) { return d[INDEPENDENT_VARIABLE]; }));   //x0, the ticks across the x axis
                  x1.domain(childBarNames).rangeRoundBands([0, x0.rangeBand()]);          //x1, the groups
                  y.domain([0, d3.max(data, function(d) { return d3.max(d.childBars, function(d) { return d.value; }); })]);

                  svg.append("g")
                      .attr("class", "x axis")
                      .attr("transform", "translate(0," + height + ")")
                      .call(xAxis)
                      .selectAll("text")  
                            .style("text-anchor", "end")
                            .attr("dx", "-.8em")
                            .attr("dy", ".15em")
                            .attr("transform", function(d) {
                                return "rotate(-65)" 
                            });

                  svg.append("g")
                      .attr("class", "y axis")
                      .call(yAxis)
                    .append("text")
                      .attr("transform", "rotate(-90)")
                      .attr("y", 6)
                      .attr("dy", ".71em")
                      .style("text-anchor", "end")
                      .text(DEPENDENT_AXIS_LABEL);

                  var fieldx0 = svg.selectAll(".TickVariable")
                          .data(data)
                        .enter().append("g")
                          .attr("class", "g")
                          .attr("transform", function(d) { return "translate(" + x0(d[INDEPENDENT_VARIABLE]) + ",0)"; });

                  fieldx0.selectAll("rect")
                      .data(function(d) { return d.childBars; })
                    .enter().append("rect")
                      .attr("width", x1.rangeBand())
                      .attr("x", function(d) { return x1(d.name); })
                      .attr("y", function(d) { return y(d.value); })
                      .attr("height", function(d) { return height - y(d.value); })
                      .style("fill", function(d) { return color(d.name); });

                  var legend = svg.selectAll(".legend")
                      .data(childBarNames.slice())
                    .enter().append("g")
                      .attr("class", "legend")
                      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

                  legend.append("rect")
                      .attr("x", width - 18)
                      .attr("width", 18)
                      .attr("height", 18)
                      .style("fill", color);

                  legend.append("text")
                      .attr("x", width - 24)
                      .attr("y", 9)
                      .attr("dy", ".35em")
                      .style("text-anchor", "end")
                      .text(function(d) { return d; });


                });
                
            }
          }

    });
})(dash2 || (dash2 = {}));
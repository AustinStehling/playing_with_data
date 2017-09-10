
d3.csv("../csv/homeless_population.csv")
  .row((data)=> {return { State: data.State,
                          Homeless: Number(data.Homeless),
                          Population: Number(data.Population),
                          Temperature: Number(data.Temperature),
                          Income: Number(data.Income),
                          Location: Number(data.Location)
                        };})
  .get((error, data)=> {

      let height = 350;
      let width = 1000;

      let maxPop = d3.max(data, (data) => { return data.Homeless; });
      let minPop = d3.min(data, (data) => { return data.Homeless; });
      let maxIncome = d3.max(data, (data) => { return data.Income; });
      let minIncome = d3.min(data, (data) => { return data.Income; });
      let maxRatio = d3.max(data, (data)=> { return data.Homeless / data.Population; });
      let minRatio = d3.min(data, (data)=> { return data.Homeless / data.Population; });


      let y = d3.scaleLog()
                .domain([minPop - 10, maxPop + 10])
                .range([height, 0]);
      let x = d3.scaleLog()
                .domain([minIncome - 1000, maxIncome + 3000])
                .range([0, width]);
      let r = d3.scaleSqrt()
                .domain([minRatio, maxRatio])
                .range([10, 50])

      let yAxis = d3.axisLeft(y);
      let xAxis = d3.axisBottom(x);

      let svg = d3.select('body').append('svg')
                  .attr('height', '100%')
                  .attr('width', '100%')
                  .append('g')
                  .attr('transform', 'translate(50, 50)');

      let div = d3.select('body').append('div')
                  .attr('class', 'tooltip')
                  .style('opacity', 0);

      // let voronoi = d3.voronoi()
      //                 .x((data) => { return x(data.Income); })
      //                 .y((data) => { return y(data.Homeless); })
      //                 .size([width, height])(data);

      let colors = d3.scaleOrdinal(d3.schemeSet1);

      let chartGroup = svg.selectAll('circle')
                        .data(data)
                        .enter()
                        .append('circle')
                        .attr('class', (data, index) => { return data.State })
                        .attr('cy', (data) => { return y(data.Homeless); })
                        .attr('cx', (data) => { return x(data.Income); })
                        .attr('r', (data) => { return r(data.Homeless / data.Population); })
                        // .attr('stroke','black')
                        .attr('stroke-width',1)
                        .attr('opacity', 0.8)
                        .attr('fill', (data) => { return colors(data.Location)})
                            .on('mouseover', (data) => {
                                div.transition()
                                  .duration(200)
                                  .style('opacity', 1);
                                div.html(data.State)
                                  .style("left", (d3.event.pageX) + 'px')
                                  .style("top", (d3.event.pageY) + 'px');
                                })
                              .on('mouseout', (data) => {
                                div.transition()
                                  .duration(500)
                                  .style('opacity', 0);
                              });


      //   .on('mouseover', (data) => {
      //       div.transition()
      //         .duration(200)
      //         .style('opacity', 1);
      //       div.html(data.State)
      //         .style("left", (d3.event.pageX) + 'px')
      //         .style("top", (d3.event.pageY) + 'px');
      //       })
      //     .on('mouseout', (data) => {
      //       div.transition()
      //         .duration(500)
      //         .style('opacity', 0);
      //     });

      // svg.selectAll('circle.groupSmall')
      //   .data(data)
      //   .enter()
      //   .append('circle')
      //   .attr('class', 'groupSmall')
      //   .attr('cy', (data) => { return y(data.Temperature); })
      //   .attr('cx', (data) => { return x(data.Income); })
      //   .attr('r', (data) => { return r(data.Homeless); })
      //   .attr('stroke','black')
      //   .attr('stroke-width',1)
      //
      // let line = d3.line()
      //               .x((data) => { return x(data.Temperature); })
      //               .y((data) => { return y(data.Income); })

      // let line2 = d3.line()
      //               .x((data) => { return x(data.Date); })
      //               .y((data) => { return y(data.Families); })
      //
      // let line3 = d3.line()
      //               .x((data) => { return x(data.Date); })
      //               .y((data) => { return y(data.Singles); })
      //
      // let line4 = d3.line()
      //               .x((data) => { return x(data.Date); })
      //               .y((data) => { return y(data.Couples); })

      // chartGroup.append('path').attr('d', line(data));
      // chartGroup.append('path').attr('d', line2(data));
      // chartGroup.append('path').attr('d', line3(data));
      // chartGroup.append('path').attr('d', line4(data));
      svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0, '+height+')').call(xAxis)
      svg.append('g').attr('class', 'y axis').call(yAxis)

  });

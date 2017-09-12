d3.csv('../csv/homeless_population.csv')
  .row((data) => {
    return {
      State: data.State,
      PercentHomeless: Number(data.Homeless) / Number(data.Population)
    };
  })
  .get((error, data) => {

    let width = 650;
    let height = 600;

    let maxRadius = d3.max(data, (data) => { return data.PercentHomeless; })
    let minRadius = d3.min(data, (data) => { return data.PercentHomeless; })

    let svg = d3.selectAll('section')
               .append('svg')
               .attr('height', height)
               .attr('width', width)
               .append('g')
               .attr('transform', 'translate(0, 0)')

    let colors = d3.scaleOrdinal(d3.schemePaired);

    let simulation = d3.forceSimulation()
                      .force('x', d3.forceX(width/2).strength(0.5))
                      .force('y', d3.forceY(height/2).strength(0.5))
                      .force('collide', d3.forceCollide((data) => { return r(data.PercentHomeless) + 3; }))

    let r = d3.scaleSqrt()
              .domain([minRadius, maxRadius])
              .range([15,75])


    let circles = svg.selectAll('circles')
                  .data(data)
                  .enter()
                  .append('circle')
                  .attr('stroke', 'black')
                  .attr('opacity', 1)
                  .attr('fill', (data) => { return colors(data.State); })
                  .attr('r', (data) => { return r(data.PercentHomeless); })
                  .on('mouseover', mouseOn)
                  .on('mouseout', mouseOff)

   function mouseOn(data) {
     circles
      .style('opacity', 0.5)
     d3.select(this)
     .attr('r', r(data.PercentHomeless) * 1.5)
     .style('opacity', 1)

    //  simulation
    //   .force('collide', d3.forceCollide((data) => { return r(data.PercentHomeless * 1.5) + 3; }))
   }

   function mouseOff(data) {
     circles
      .style('opacity', 1)
     d3.select(this)
     .attr('r', r(data.PercentHomeless))
     .style('opacity', 1)

    //  simulation
    //   .force('collide', d3.forceCollide((data) => { return r(data.PercentHomeless) + 3; }))
   }

   let texts = svg.selectAll(null)
                .data(data)
                .enter()
                .append('text')
                .text((data) => { return data.State; } )
                .attr('color', 'black')
                .attr('font-size', 10)


    let ticked = () => {
      circles
        .attr('cx', (data) => { return data.x; })
        .attr('cy', (data) => { return data.y; })
      texts
        .attr('x', (data) => { return data.x; })
        .attr('y', (data) => { return data.y;  })
    };



    simulation.nodes(data)
      .on('tick', ticked)


  });

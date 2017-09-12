d3.csv('./csv/homeless_population.csv')
  .row((data) => {
    return {
      State: data.State,
      PercentHomeless: Number(data.Homeless) / Number(data.Population),
      Homeless: Number(data.Homeless)
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

    let div = d3.select('section')
                .append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0)

    let colors = d3.scaleOrdinal(d3.schemeGnBu[3]);

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
     d3.select(this)
       .attr('r', r(data.PercentHomeless) * 1.5)

     simulation
      .force('collide', d3.forceCollide((data) => { return r(data.PercentHomeless * 1.3) + 3; }))
      .alpha(0.005)
      .restart();

    div.transition()
      .duration(200)
      .style('opacity', 1);
      div.html(data.State + ', ' + 'Homeless Population: ' + data.Homeless)
      .style("left", (d3.event.pageX) + 'px')
      .style("top", (d3.event.pageY) + 'px');

    texts.transition()
      .duration(100)
      .style('opacity', 0);

   }

   function mouseOff(data) {
     d3.select(this)
       .attr('r', r(data.PercentHomeless))

     simulation
      .force('collide', d3.forceCollide((data) => { return r(data.PercentHomeless) + 3; }))
      .alpha(0.005)
      .restart();

    div.transition()
      .duration(500)
      .style('opacity', 0);

    texts.transition()
      .duration(1000)
      .style('opacity', 1);
   }


   let texts = svg.selectAll('section')
                .data(data)
                .enter()
                .append('text')
                .text((data) => { return data.State; })
                .attr('color', 'black')
                .attr('font-size', 11)


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

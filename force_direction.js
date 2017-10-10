d3.csv('./csv/bordering_states.csv')
  .row((data) => { return { source: data.source,
                            target: data.target
                         };})
  .get((error, data) => {
      let height = 1000;
      let width = 1000;

      var nodesList = {}

      data.forEach((link) => {
        link.source = nodesList[link.source] ||
          (nodesList[link.source] = { name: link.source });
        link.target = nodesList[link.target] ||
          (nodesList[link.target] = { name: link.target });
      });

      let div = d3.select('body')
                .append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);

      let nodes = d3.values(nodesList)

      let svg = d3.selectAll('section')
                  .append('svg')
                  .attr('width', "100%")
                  .attr('height', height)

      // svg.append('text')
      //   .attr('x', 137)
      //   .attr('y', 100)
      //   .attr('font-size', 30)
      //   .attr('fill', 'lightcoral')
      //   .text('States and Their Neighbors')

      let tick = () => {
        link.attr('x1', (d) => { return d.source.x; })
        .attr('y1', (d) => { return d.source.y; })
        .attr('x2', (d) => { return d.target.x; })
        .attr('y2', (d) => { return d.target.y; })

        node.attr('cx', (d) => { return d.x; })
        .attr('cy', (d) => { return d.y; })
      }

      let force = d3.layout.force()
        .size([width, height])
        .nodes(nodes)
        .links(data)
        .charge(-350)
        .linkDistance(80)
        .on('tick', tick)
        .stop()
        .start();


      let link = svg.selectAll('.link')
        .data(data)
        .enter()
        .append('line')
        .attr('class', 'link');

      let node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('r', 25)
        .attr('fill', '#1253A4')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .on('mouseover', circleBig)
        .on('mouseout', circleSmall)
        .call(force.drag);


          function circleBig (data) {
            d3.select(this)
            .attr('r', 40)
            .style('fill', '#F26964')

            div.transition()
              .duration(200)
              .style('opacity', 1);
            div.html(data.name)
              .style("left", (d3.event.pageX) + 'px')
              .style("top", (d3.event.pageY) + 'px');
          }

          function circleSmall (data) {
            d3.select(this)
            .attr('r', 25)
            .style('fill', "#1253A4")

            div.transition()
              .duration(500)
              .style('opacity', 0);
          }

  });

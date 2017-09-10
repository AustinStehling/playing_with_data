d3.csv('../csv/bordering_states.csv')
  .row((data) => { return { source: data.source,
                            target: data.target
                         };})
  .get((error, data) => {
      let height = 600;
      let width = 600;

      var nodesList = {}

      data.forEach((link) => {
        link.source = nodesList[link.source] ||
          (nodesList[link.source] = { name: link.source });
        link.target = nodesList[link.target] ||
          (nodesList[link.target] = { name: link.target });
      });

      let div = d3.select('body').append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);

      let nodes = d3.values(nodesList)

      let svg = d3.selectAll('section')
                  .append('svg')
                  .attr('width', '100%')
                  .attr('height', height)

      svg.append('text')
        .attr('x', 137)
        .attr('y', 100)
        .attr('font-size', 30)
        .attr('fill', 'lightcoral')
        .text('States and Their Neighbors')

      let tick = () => {
        link.attr('x1', (d) => { return d.source.x; })
        .attr('y1', (d) => { return d.source.y; })
        .attr('x2', (d) => { return d.target.x; })
        .attr('y2', (d) => { return d.target.y; })

        node.attr('cx', (d) => { return d.x; })
        .attr('cy', (d) => { return d.y; })
      }

      var force = d3.layout.force()
        .size([width, height])
        .nodes(nodes)
        .links(data)
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
        .attr('r', 7)
        .attr('fill', 'lightseagreen')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .on('mouseover', (data) => {
          div.transition()
            .duration(200)
            .style('opacity', 1);
          div.html(data.name)
            .style("left", (d3.event.pageX) + 'px')
            .style("top", (d3.event.pageY) + 'px');
          })
        .on('mouseout', (data) => {
          div.transition()
            .duration(500)
            .style('opacity', 0);
        })
        .call(force.drag);

      node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text((d) => { return d.name; })
  });

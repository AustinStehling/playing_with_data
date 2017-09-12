
d3.csv("./csv/world_median_age.csv")
  .row((data) => { return {
      Country: data.country,
      Age: Number(data.age),
      gdp: Number(data.gdp)
    };
  })
  .get((error, data)=> {
      let height = 350;
      let width = 800;
      padding = 50;

      let maxAge = d3.max(data, (data) => { return data.Age; });
      let minAge = d3.min(data, (data) => { return data.Age; });
      let maxGdp = d3.max(data, (data) => { return data.gdp; });
      let minGdp = d3.min(data, (data) => { return data.gdp; });
      let maxRatio = d3.max(data, (data)=> { return data.gdp; });
      let minRatio = d3.min(data, (data)=> { return data.gdp; });


      let y = d3.scaleLinear()
                .domain([minAge - 10, maxAge + 10])
                .range([height-padding, padding]);
      let x = d3.scaleLog()
                .domain([minGdp - 50, maxGdp + 25000])
                .range([padding, width-padding]);
      let r = d3.scaleSqrt()
                .domain([minRatio, maxRatio])
                .range([3, 15])

      let yAxis = d3.axisLeft(y);
      let xAxis = d3.axisBottom(x);

      let svg = d3.select('section').append('svg')
                  .attr('height', '100%')
                  .attr('width', '100%')
                  .append('g')
                  .attr('transform', 'translate(50, 50)');

      let div = d3.select('body')
                  .append('div')
                  .attr('class', 'tooltip')
                  .style('opacity', 0);

      let colors = d3.scaleOrdinal(d3.schemeBlues[9]);

      let circles = svg.selectAll('circle')
                      .data(data)
                      .enter()
                      .append('circle')
                      .attr('class', (data, index) => { return data.Country })
                      .attr('cy', (data) => { return y(data.Age); })
                      .attr('cx', (data) => { return x(data.gdp); })
                      .attr('r', (data) => { return r(data.gdp); })
                      .attr('stroke','black')
                      .attr('stroke-width',1)
                      .attr('opacity', 0.8)
                      .attr('fill', (data) => { return colors(data.Country)})
                      .on('mouseover', mouseOn)
                      .on('mouseout', mouseOut);

      function mouseOn(data) {
        circles
          .style('opacity', 0.3)

        d3.select(this)
          .attr('r', r(data.gdp) * 2)
          .style('opacity', 1)
          .style('fill', 'darkorange')

        div.transition()
          .duration(200)
          .style('opacity', 1);
        div.html(data.Country + ', GDP(PPP): $' + data.gdp)
          .style("left", (d3.event.pageX) + 'px')
          .style("top", (d3.event.pageY) + 'px');

      }

      function mouseOut(data) {
        d3.select(this)
          .attr('r', r(data.gdp))
          .style('opacity', 0.8)
          .style('fill', colors(data.Country))

        circles
          .style('opacity', 0.8)

        div.transition()
          .duration(500)
          .style('opacity', 0);
      }

      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0, '+(height - padding)+')')
        .call(xAxis)

      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate('+padding+', 0)')
        .call(yAxis)

      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate('+5+', '+(height/2)+')rotate(-90)')
        .attr('font-size', 25)
        .text('Median Age')

      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate( '+(width/2)+','+height+')')
        .attr('font-size', 25)
        .text('GDP (PPP)')

      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate( '+(width/2)+','+-5+')')
        .attr('font-size', 25)
        .text('Countries: Median Age vs Spending Power')

  });

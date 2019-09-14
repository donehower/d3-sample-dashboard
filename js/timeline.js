Timeline = function(_parentElement) {
  this.parentElement = _parentElement;

  this.initVis();
};

Timeline.prototype.initVis = function(){
  var vis = this;

  vis.margin = {left:80, right:100, top:0, bottom:30};
  vis.height = 130 - vis.margin.top - vis.margin.bottom;
  vis.width = 800 - vis.margin.left - vis.margin.right;

  vis.svg = d3.select(vis.parentElement)
    .append('svg')
      .attr('width', vis.width + vis.margin.left + vis.margin.right)
      .attr('height', vis.height + vis.margin.top + vis.margin.bottom);

  vis.g = vis.svg.append('g')
    .attr('transform', `translate(${vis.margin.left}, ${vis.margin.top})`);

  vis.t = function() { return d3.transition().duration(1000); }

  vis.x = d3.scaleTime().range([0, vis.width]);
  vis.y = d3.scaleLinear().range([vis.height, 0]);

  vis.xAxisCall = d3.axisBottom()
      .ticks(4);

  vis.xAxis = vis.g.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${vis.height})`);

  vis.areaPath = vis.g.append('path')
    .attr('fill', '#ccc')

  vis.brush = d3.brushX()
    .handleSize(10)
    .extent([[0, 0], [vis.width, vis.height]])
    .on('brush', brushed);

  vis.brushComponent = vis.g.append('g')
    .attr('class', 'brush')
    .call(vis.brush);

  vis.wrangleData();
};

Timeline.prototype.wrangleData = function(){
  var vis = this;

  vis.coin = $('#coin-select').val()
  vis.yVariable = $('#var-select').val()

  vis.data = filteredData[vis.coin];

  vis.updateVis();
};

Timeline.prototype.updateVis = function(){
  var vis = this;

  vis.x.domain(d3.extent(vis.data, d => { return d.date; }));
  vis.y.domain([0, d3.max(vis.data, d => { return d[vis.yVariable]; }) ]);

  vis.xAxisCall.scale(vis.x);

  vis.xAxis.transition(vis.t()).call(vis.xAxisCall)

  vis.area = d3.area()
    .x(d => { return vis.x(d.date); })
    .y0(vis.height)
    .y1(d => {return vis.y(d[vis.yVariable]); })

  vis.areaPath
    .data([vis.data])
    .attr('d', vis.area);
};

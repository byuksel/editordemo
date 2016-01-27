$( document ).ready(function() {
  var STATEMACH = { NONE: 0, RECTINIT: 1, RECTDRAG:2, CIRCINIT:3, CIRCDRAG:4, SELECTDRAG:5 };
  var state = STATEMACH.NONE;
  var dragaround = [];
  var antihistory = [];
  var lastelem;
  var id = 0;
  var domElem = document.getElementById("outgraph");
  var width = Math.abs(domElem.offsetWidth);
  var height = Math.abs(domElem.offsetHeight);
  var holder = d3.select("#outgraph")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  $('#rectbut').click(function() {
    state = STATEMACH.RECTINIT;
    if (dragaround.length > 0) {
      dragaround[0].remove();
      dragaround[1].remove();
    }
  });
  $('#circbut').click(function() {
    state = STATEMACH.CIRCINIT;
    if (dragaround.length > 0) {
      dragaround[0].remove();
      dragaround[1].remove();
    }
  });
  holder.on("mousedown", function() {
    var coor = d3.mouse(this);
    var parent = this;
    var clientX = coor[0];
    var clientY = coor[1];
    if (state === STATEMACH.NONE) {
      return;
    } else if (state === STATEMACH.RECTINIT) {
      antihistory = [];
      lastelem = holder.append("rect")
        .attr("x", clientX - 5)    
        .attr("y", clientY - 5)     
        .attr("initx", clientX - 5)    
        .attr("inity", clientY - 5)     
        .attr("height", 10)
        .attr("width", 10)
        .attr("fill", "transparent")
        .attr("stroke", "blue")
        .on("mousedown", function() {
          if (state !== STATEMACH.NONE) return;
          var bbox = this.getBBox();
          this.id = "u";
          var drawbox = holder.insert("rect", "#u")
              .attr("x", bbox.x-2)
              .attr("y", bbox.y-2)
              .attr("height", bbox.height+4)
              .attr("width", bbox.width+4)
              .attr("stroke-dasharray", "3,3")
              .attr("stroke", "black")
              .attr("fill", "transparent");
          var circlebox = holder.insert("circle", "#u")
              .attr("cx", bbox.x + bbox.width+2)
              .attr("cy", bbox.y + bbox.height+2)
              .attr("r", 5)
              .attr("stroke", "black")
              .attr("fill", "black")
              .on("mousedown", function() {
                state = STATEMACH.SELECTDRAG;
                dragaround[1].attr('dragx', d3.event.screenX);
                dragaround[1].attr('dragy', d3.event.screenY); })
              .on("mousemove", function() {
                if (state !== STATEMACH.SELECTDRAG) return;
                var deltaX = Number(d3.select(this).attr('dragx')) - d3.event.screenX;
                var deltaY = Number(d3.select(this).attr('dragy'))-  d3.event.screenY;
                dragaround[1].attr('cx', Number(dragaround[1].attr('cx')) - deltaX);
                dragaround[1].attr('cy' ,Number(dragaround[1].attr('cy')) - deltaY);
                dragaround[1].attr('dragx', d3.event.screenX);
                dragaround[1].attr('dragy', d3.event.screenY);
                dragaround[0].attr('width', Number(dragaround[0].attr('width')) - deltaX);
                dragaround[0].attr('height' ,Number(dragaround[0].attr('height')) - deltaY);
                dragaround[3].attr('width', Number(dragaround[3].attr('width')) - deltaX);
                dragaround[3].attr('height' ,Number(dragaround[3].attr('height')) - deltaY);
              });
          this.id = "";
          if (dragaround.length > 0) {
            dragaround[0].remove();
            dragaround[1].remove();
          }
          dragaround[0] = drawbox;
          dragaround[1] = circlebox;
          dragaround[2] = null;
          dragaround[3] = d3.select(this);
          
          d3.select(this).attr('state', 'drag');
          d3.select(this).attr('dragx', d3.event.screenX);
          d3.select(this).attr('dragy', d3.event.screenY);
        })
        .on("mousemove", function() {
          if (state !== STATEMACH.NONE) return;
          if ('drag' === d3.select(this).attr('state')) {
            var deltaX = Number(d3.select(this).attr('dragx')) - d3.event.screenX;
            var deltaY = Number(d3.select(this).attr('dragy'))-  d3.event.screenY;
            dragaround[0].attr('x', Number(dragaround[0].attr('x')) - deltaX);
            dragaround[0].attr('y' ,Number(dragaround[0].attr('y')) - deltaY);
            dragaround[1].attr('cx', Number(dragaround[1].attr('cx')) - deltaX);
            dragaround[1].attr('cy' ,Number(dragaround[1].attr('cy')) - deltaY);
            d3.select(this).attr('x', Number(d3.select(this).attr('x')) - deltaX);
            d3.select(this).attr('y' ,Number(d3.select(this).attr('y')) - deltaY);
            d3.select(this).attr('dragx', d3.event.screenX);
            d3.select(this).attr('dragy', d3.event.screenY);
          }})
        .on("mouseup", function() {
          if (state !== STATEMACH.NONE) return;
          d3.select(this).attr('state', '');
        })
        .on("mouseout", function() {
          if (state !== STATEMACH.NONE) return;
          d3.select(this).attr('state', '');
        });
      state = STATEMACH.RECTDRAG;
    } else if (state === STATEMACH.CIRCINIT) {
      event.stopPropagation();
      antihistory = [];
      lastelem = holder.append("ellipse")
        .attr("cx", clientX - 5)        
        .attr("cy", clientY- 5)        
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("fill", "transparent")
        .attr("stroke", "red")
        .on("mousedown", function() {
          if (state !== STATEMACH.NONE) return;
          var bbox = this.getBBox();
          this.id = "u";
          var drawbox = holder.insert("rect", "#u")
              .attr("x", bbox.x)
              .attr("y", bbox.y)
              .attr("height", bbox.height)
              .attr("width", bbox.width)
              .attr("stroke-dasharray", "3,3")
              .attr("stroke", "black")
              .attr("fill", "transparent");
          var circlebox = holder.insert("circle", "#u")
              .attr("cx", bbox.x + bbox.width)
              .attr("cy", bbox.y + bbox.height)
              .attr("r", 5)
              .attr("stroke", "black")
              .attr("fill", "black")
              .on("mousedown", function() {
                state = STATEMACH.SELECTDRAG;
                dragaround[1].attr('dragx', d3.event.screenX);
                dragaround[1].attr('dragy', d3.event.screenY); });
          this.id = "";
          if (dragaround.length > 0) {
            dragaround[0].remove();
            dragaround[1].remove();
          }
          dragaround[0] = drawbox;
          dragaround[1] = circlebox;
          dragaround[2] = d3.select(this);
          dragaround[3] = null;
          d3.select(this).attr('state', 'drag');
          d3.select(this).attr('dragx', d3.event.screenX);
          d3.select(this).attr('dragy', d3.event.screenY);
        })
        .on("mousemove", function() {
          if (state !== STATEMACH.NONE) return;
          if ('drag' === d3.select(this).attr('state')) {
            var deltaX = Number(d3.select(this).attr('dragx')) - d3.event.screenX;
            var deltaY = Number(d3.select(this).attr('dragy'))-  d3.event.screenY;
            d3.select(this).attr('cx', Number(d3.select(this).attr('cx')) - deltaX);
            d3.select(this).attr('cy' ,Number(d3.select(this).attr('cy')) - deltaY);
            d3.select(this).attr('dragx', d3.event.screenX);
            d3.select(this).attr('dragy', d3.event.screenY);
            dragaround[0].attr('x', Number(dragaround[0].attr('x')) - deltaX);
            dragaround[0].attr('y' ,Number(dragaround[0].attr('y')) - deltaY);
            dragaround[1].attr('cx', Number(dragaround[1].attr('cx')) - deltaX);
            dragaround[1].attr('cy' ,Number(dragaround[1].attr('cy')) - deltaY);
          }})
        .on("mouseup", function() {
          if (state !== STATEMACH.NONE) return;
          d3.select(this).attr('state', '');
        })
        .on("mouseout", function() {
          if (state !== STATEMACH.NONE) return;
          d3.select(this).attr('state', '');
        });
      state = STATEMACH.CIRCDRAG;
    }
  });
  holder.on("mousemove", function(event) {
    var coor = d3.mouse(this);
    var clientX = coor[0];
    var clientY = coor[1];
    //*********
    if (state === STATEMACH.SELECTDRAG) {
      var deltaX = Number(dragaround[1].attr('dragx')) - d3.event.screenX;
      var deltaY = Number(dragaround[1].attr('dragy'))-  d3.event.screenY;
      if (Number(dragaround[0].attr('width')) - deltaX <=0   || Number(dragaround[0].attr('height')) - deltaY<= 0) return;
      dragaround[1].attr('cx', Number(dragaround[1].attr('cx')) - deltaX);
      dragaround[1].attr('cy' ,Number(dragaround[1].attr('cy')) - deltaY);
      dragaround[1].attr('dragx', d3.event.screenX);
      dragaround[1].attr('dragy', d3.event.screenY);
      dragaround[0].attr('width', Number(dragaround[0].attr('width')) - deltaX);
      dragaround[0].attr('height' ,Number(dragaround[0].attr('height')) - deltaY);
      if (dragaround[2]) {
        dragaround[2].attr('cx', Number(dragaround[2].attr('cx')) - deltaX/2);
        dragaround[2].attr('cy' ,Number(dragaround[2].attr('cy')) - deltaY/2);
        dragaround[2].attr('rx', Number(dragaround[2].attr('rx')) - deltaX/2);
        dragaround[2].attr('ry' ,Number(dragaround[2].attr('ry')) - deltaY/2);
      } else if (dragaround[3]) {
        dragaround[3].attr('width', Number(dragaround[3].attr('width')) - deltaX);
        dragaround[3].attr('height' ,Number(dragaround[3].attr('height')) - deltaY);
      }
      
    }
    //***********
    if (state === STATEMACH.NONE) {
      return;
    } else if (state === STATEMACH.RECTDRAG) {
      d3.event.stopPropagation();
      var oldx = Number(lastelem.attr("initx"));
      var oldy = Number(lastelem.attr("inity"));
      var newW = clientX - oldx;
      var newH = clientY - oldy;
      var newX = oldx;
      var newY = oldy;
      if (newW < 0) {
        newX += newW;
        newW = -1 * newW;
      }
      if (newH < 0) {
        newY += newH;
        newH = -1 * newH;
      }
      lastelem
        .attr("x", newX)
        .attr("y", newY)
        .attr("height", newH)
        .attr("width", newW);
    } else if (state === STATEMACH.CIRCDRAG) {
      var oldx = lastelem.attr("cx");
      var oldy = lastelem.attr("cy");
      var newR = Math.sqrt((clientX - oldx) * (clientX - oldx) +  
                           (clientY - oldy) * (clientY - oldy));
      lastelem.attr("rx", newR);
      lastelem.attr("ry", newR);
    };
  });
  $('#outgraph').mouseup(function(event) {
    //*****
    if (state === STATEMACH.SELECTDRAG) {
      state = STATEMACH.NONE;
      return;
    }
    //******
    if (state === STATEMACH.NONE) {
      return;
    } else if (state === STATEMACH.RECTDRAG) {
      event.stopPropagation();
      state = STATEMACH.RECTINIT;
    } else if (state === STATEMACH.CIRCDRAG) {
      state = STATEMACH.CIRCINIT;
    };
  });
  $('#undobut').click(function() {
    if (dragaround.length > 0) {
      dragaround[0].remove();
      dragaround[1].remove();
    }
    var lastchild = holder[0][0].lastChild;
    if (lastchild) {
      holder[0][0].removeChild(lastchild);
      antihistory.push(lastchild);
    }
  });
  $('#redobut').click(function() {
    if (dragaround.length > 0) {
      dragaround[0].remove();
      dragaround[1].remove();
    }
    var lastchild = antihistory.pop();
    if (lastchild) {
      holder[0][0].appendChild(lastchild);
    }
  });
  $('#selbut').click(function() {
    state = STATEMACH.NONE;
  });
});

var $, d3;
require("./cbpp_sparkline.scss");
var Sparkline = function(data, u_options) {
  var options = {
    /*defaults*/
    type:"line",
    style: {
      "stroke-width":1,
      "stroke":"#0C61A4"
    },
    height:"1.5em",
    aspectRatio:3
  };
  $.extend(true, options, u_options);
  var svg;
  function createElement() {
    var outer = $(document.createElement("div")).addClass("cbpp-sparkline-outer");
    var inner = $(document.createElement("div")).addClass("cbpp-sparkline-inner");
    svg = d3.select(inner[0]).append("svg");
    svg.attr("viewBox", [0, 0, 10*options.aspectRatio, 10].join(" "));
    outer.append(inner);
    var height = process_units(options.height);
    var width = (height[0]*options.aspectRatio) + height[1];
    outer.css("width",width);
    outer.css("padding-bottom", (100/options.aspectRatio) + "%");
    return outer;
  }

  function process_units(measure) {
    var r = ["",""];
    var number_part = true;
    measure += "";
    for (var i = 0, ii = measure.length; i<ii; i++) {
      if (isNaN(measure[i]*1) && measure[i]!==".") {
        number_part = false;
      }
      if (number_part) {
        r[0] = (r[0] + "") + (measure[i] + "");
      } else {
        r[1] = (r[1] + "") + (measure[i] + "");
      }
    }
    r[0] = r[0]*1;
    return r;
  }

  function makeSparkline() {
    var coords = makeCoords(data, options.aspectRatio);
    var min = coords.min;
    var max = coords.max;
    var minCoord, maxCoord;
    coords = coords.coords;
    var pathString = "M";
    for (var i = 0, ii = coords.length; i<ii; i++) {
      pathString += (coords[i][0] + "," + coords[i][1]);
      if (i < ii - 1) {
        pathString += "L";
      }
      if (i===min) {
        minCoord = coords[i];
      }
      if (i===max) {
        maxCoord = coords[i];
      }
    }
    var path = svg.append("path")
      .attr("d",pathString)
      .attr("fill","none");
    for (var attr in options.style) {
      if (options.style.hasOwnProperty(attr)) {
        path.attr(attr, options.style[attr]);
      }
    }
    if (options.dots) {
      if (options.dots.min) {
        if (options.dots.min.include) {
          makeDot(svg, minCoord, $.extend(true, options.style, (options.dots.all || {}), options.dots.min));
        }
      }
      if (options.dots.max) {
        if (options.dots.max.include) {
          makeDot(svg, maxCoord, $.extend(true, options.style, (options.dots.all || {}), options.dots.max));
        }
      }
      if (options.dots.start) {
        if (options.dots.start.include) {
          makeDot(svg, coords[0], $.extend(true, options.style, (options.dots.start || {}), options.dots.start));
        }
      }
      if (options.dots.end) {
        if (options.dots.end.include) {
          makeDot(svg, coords[coords.length-1], $.extend(true, options.style, (options.dots.end || {}), options.dots.end));
        }
      }
    }


  }

  var wrapper = createElement();
  makeSparkline();
  return wrapper;

};

function makeDot(svg, coord, options) {
  var circle = svg.append("circle")
    .attr("cx",coord[0])
    .attr("cy",coord[1])
    .attr("r",1.5);
  for (var attr in options) {
    if (options.hasOwnProperty(attr)) {
      circle.attr(attr, options[attr]);
    }
  }
}

function makeCoords(d, ar) {
  var min, max;
  var minx, maxx;
  for (var i = 0, ii = d.length; i<ii; i++) {
    min = Math.min(min || d[i], d[i]);
    if (d[i]===min) {
      minx = i;
    }
    max = Math.max(max || d[i], d[i]);
    if (d[i]===max) {
      maxx = i;
    }
  }
  var h = max - min;
  var w = 10*ar;
  function p2c_x(x) {
    return x/d.length * w;
  }
  function p2c_y(y) {
    return (y - min)/h * -10+10;
  }
  var r = [];
  for (i = 0, ii = d.length; i<ii; i++) {
    r.push([
      p2c_x(i),
      p2c_y(d[i])
    ]);
  }
  return {
    coords: r,
    min : minx,
    max: maxx
  };
}
module.exports = function(_$, _d3) {
  $ = _$;
  d3 = _d3;
  return Sparkline;
};
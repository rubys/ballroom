var clock = 0;
var paused = false;
var advance = false;
var direction = +1;

function pause() {
  paused = true;
  advance = true;
}

function play() {
  paused = false;
  direction = +1;
}

function next() {
  if (!paused) return;
  advance = 2;
  direction = +1;
}

function prev() {
  if (!paused || !clock) return;
  clock--;
  advance = 2;
  direction = -1;
}

function clone(object) {
  return JSON.parse(JSON.stringify(object));
}

function merge(destination, source) {
 for (var property in source) {
   if (typeof source[property] === "object") {
     destination[property] = destination[property] || {};
     merge(destination[property], source[property]);
   } else {
     destination[property] = source[property];
   }
 }
 return destination;
};

var shoes = clone(initial);

// "compile" script
var count = 0;
var routine = []
var floor = {}
function compile() {
  var figure = null;
  if (aside.beats) bpm = parseFloat(aside.beats.value);
  if (aside.bpm) aside.bpm.textContent = bpm;

  floor = {
    minx: Math.min.apply(Math, [
      initial.follower.right.x, initial.follower.left.x,
      initial.leader.right.x, initial.leader.left.x
    ]),
    miny: Math.min.apply(Math, [
      initial.follower.right.y, initial.follower.left.y,
      initial.leader.right.y, initial.leader.left.y
    ]),
    maxx: Math.max.apply(Math, [
      initial.follower.right.x, initial.follower.left.x,
      initial.leader.right.x, initial.leader.left.x
    ]),
    maxy: Math.max.apply(Math, [
      initial.follower.right.y, initial.follower.left.y,
      initial.leader.right.y, initial.leader.left.y
    ])
  }

  var save = shoes;
  shoes = clone(initial);
  routine.length = 0;

  var step;
  var queue = clone(steps);
  while (queue.length) {
    step = queue.shift();

    // optionally reset count
    if (step.count) count = step.count;

    // find step (adding to routine as needed)
    if (step.time < 0) {
      step.time = -step.time;
    } else {
      var ops = step;
      for (var i=0; i<step.time*4; i++) {
	if (count && routine.length % 4 == 0) {
	  ops.count = count++;
	}
	routine.push(ops);
	ops = {}
      }
    }
    merge(routine[routine.length-step.time*4], step);
    step = routine[routine.length-step.time*4];

    // start image one 'frame' early
    if (step.image && routine.length > step.time*4) {
      routine[routine.length-step.time*4-1].image = step.image;
    }

    // bookend figure (used for reverse)
    if (step.figure) {
      if (figure) routine[routine.length-step.time*4-1].figure = figure;
      figure = step.figure;
    }

    // compile steps
    ["leader", "follower"].forEach(function(person) {
      if (!step[person]) return;
      ["left", "right"].forEach(function(foot) {
	var ops = step[person][foot];
	if (!ops) return;

	// aliases for movement
	if (ops == 'forward') ops = step[person][foot] = {path: 'v,100'}
	if (ops == 'back') ops = step[person][foot] = {path: 'v-100'}
	if (ops == 'side') {
          if (foot == 'left') ops = step[person][foot] = {path: 'h-100'}
          if (foot == 'right')  ops = step[person][foot] = {path: 'h100'}
        }
	if (ops == 'together') {
          if (foot == 'right') ops = step[person][foot] = {path: 'h-100'}
          if (foot == 'left')  ops = step[person][foot] = {path: 'h100'}
        }

	// shorthand for position.path
	if (ops.path && !ops.position) {
	  ops.position = {path: ops.path};
	  delete ops.path;
	}

	// shorthand for orientation.rotate
	if (ops.rotate && !ops.orientation) {
	  ops.orientation = {rotate: ops.rotate};
	  delete ops.rotate;
	}

	ops.forward = {};
	if (!ops.reverse) ops.reverse = {};

	["position", "orientation", "ball", "heel"].forEach(function(attr) {
	  op = ops[attr];
	  if (!op) return;

	  // aliases for raising/lowering
	  if (op == 'up') {
	    op = {from: shoes[person].color, to: '#FFF'};
	  } else if (op == 'down') {
	    op = {to: shoes[person].color, from: '#FFF'};
	  }

	  ops.forward[attr] = op;

	  if (step.time) op.dur = Math.abs(60/bpm*step.time) + 's';

	  // apply rotation
	  if (op.rotate) {
	    var shoe = shoes[person][foot];
	    op.from = shoe.rotate; 
	    op.to = shoe.rotate + op.rotate;
            while (op.from <= 0 && op.to <= 0) {
               op.from += 360;
               op.to += 360;
            }
            while (op.from >=360 && op.to >= 360) {
               op.from -= 360;
               op.to -= 360;
            }
	    shoe.rotate += op.rotate;
	  }

	  // construct reverse
	  var last = routine[routine.length-1];
	  if (!last[person]) last[person] = {};
	  if (!last[person][foot]) last[person][foot] = {};
	  if (!last[person][foot].reverse) last[person][foot].reverse = {};
	  var reverse = last[person][foot].reverse;
	  reverse[attr] = clone(op); 
	  if (op.from !== undefined && op.to !== undefined) {
	    reverse[attr].from = op.to;
	    reverse[attr].to = op.from;
	  }

	  if (op.path) {
	    // parse path
	    var result = [];
	    var index = 0;
	    while (index < op.path.length) {
	      var match = op.path.slice(index).
		match(/[ ,]*([a-zA-Z]|[+-]?\d+\.?\d*)/);
	      if (match[1].match(/^[-\d]/)) {
		result.push(parseFloat(match[1]));
	      } else {
		result.push(match[1]);
	      }
	      index += match[0].length;
	    }

	    // normalize paths
	    for (var i=result.length-1; i>=0; i--) {
	      if (result[i] == 'v') {
		result.splice(i+1, 0, 0);
		result[i] = 'l';
	      } else if (result[i] == 'h') {
		result.splice(i+2, 0, 0);
		result[i] = 'l';
	      }
	    }
	    // determine rotation
	    var angle = shoes[person][foot].rotate % 360;
	    if (angle < 0) angle += 360;
	    var sin, cos;
	    if (angle < 180) {
	      var radians = angle/180*Math.PI
	      sin = Math.sin(radians)
	      cos = Math.cos(radians)
	    } else {
	      var radians = (angle-180)/180*Math.PI
	      sin = -Math.sin(radians)
	      cos = -Math.cos(radians)
	    }

	    // perform rotation
	    for (var i=result.length-1; i>0; i--) {
	      if (typeof(result[i])=="number") {
		if (typeof(result[i-1])=="number") {
		  var x = result[i-1]*cos + result[i]*sin;
		  var y = - result[i]*cos + result[i-1]*sin;
		  result[i-1] = x;
		  result[i] = y;
		  i--;
		}
	      }
	    }

	    // extract, normalize offset
	    var offset = result.slice(-2);
	    if (result[0] == 'M') result = result.slice(3)

	    // construct reverse
	    rpath = clone(result);
	    for (var i=0; i<rpath.length; i++) {
	      if (rpath[i] == "c") {
		[].splice.apply(rpath,
		  [i+3,0].concat(rpath.splice(i+1,2)))
		for (var j=1; j<5; j++) {
		  rpath[i+j] = rpath[i + 6 - j%2] - rpath[i+j]
		}
	      } else if (typeof(rpath[i]) == "number") {
		rpath[i] = -rpath[i];
	      }
	    }

	    // insert move commands
	    result.unshift('M', shoes[person][foot].x, shoes[person][foot].y);
	    shoes[person][foot].x += offset[0];
	    shoes[person][foot].y += offset[1];
	    rpath.unshift('M', shoes[person][foot].x, shoes[person][foot].y);
	    ops.forward.dest = rpath.slice(1,3).join(',')

            if (floor.minx > rpath[1]) floor.minx = rpath[1];
            if (floor.maxx < rpath[1]) floor.maxx = rpath[1];
            if (floor.miny > rpath[2]) floor.miny = rpath[2];
            if (floor.maxy < rpath[2]) floor.maxy = rpath[2];
	    
	    // serialize result, rpath
	    for (var i=result.length-1; i>0; i--) {
	      if (typeof(result[i])=="number") {
		if (typeof(result[i-1])=="number") {
		  result[i] = ',' + result[i];
		  rpath[i] = ',' + rpath[i];
		} else {
		  result[i] = result[i];
		  rpath[i] = rpath[i];
		}
	      }
	    }
	    op.path = result.join('');
	    reverse[attr].path = rpath.join('');
	  }
	});
      });
    });

    // queue up any substeps that are defined
    if (step.delay) {
      while (step.delay.length) {
        var substep = step.delay.pop();
        if (substep.time > 0) substep.time -= step.time;
        queue.unshift(substep);
      }
      delete step.delay;
    }
  }

  shoes = save;
}

// apply initial settings
["leader", "follower"].forEach(function(person) {
  var node = document.getElementById(person);
  if (!node) return;
  ["left", "right"].forEach(function(side) {
    var shoe = shoes[person][side];
    var color = shoes[person].color;
    shoe.node = node.getElementsByClassName(side)[0];
    shoe.title = shoe.node.getElementsByTagName("title")[0];

    // position
    shoe.position = shoe.node.getElementsByTagName("animateMotion")[0];
    shoe.position.setAttribute('path', "M0,0L" + shoe.x + ',' + shoe.y);
    shoe.position.setAttribute('dur', '0.01s');

    // orientation
    shoe.orientation = shoe.node.getElementsByTagName("animateTransform")[0]; 
    shoe.orientation.setAttribute('from', '0');
    shoe.orientation.setAttribute('to', shoe.rotate);
    shoe.orientation.setAttribute('dur', '0.01s');

    // ball
    shoe.ball = {fill: (shoe.ball == 'down') ? color : '#FFF'};
    shoe.ball.node = shoe.node.querySelector("animate.ball");
    shoe.ball.node.parentNode.setAttribute("fill", shoe.ball.fill);
    shoe.ball.node.parentNode.setAttribute("stroke", color);

    // heel
    shoe.heel = {fill: (shoe.heel == 'down') ? color : '#FFF'};
    shoe.heel.node = shoe.node.querySelector("animate.heel");
    shoe.heel.node.parentNode.setAttribute("fill", shoe.heel.fill);
    shoe.heel.node.parentNode.setAttribute("stroke", color);
  });
});

// capture paths
var path = {
  leader: document.getElementById('leader-path'),
  follower: document.getElementById('follower-path')
}

// capture aside targets
var aside = {
  figure: document.getElementById('figure'),
  count: document.getElementById('count'),
  text: document.getElementById('text'),
  note: document.getElementById('note'),
  image: document.getElementsByTagName('img')[0],
  beats: document.getElementById('beats'),
  bpm: document.getElementById('bpm'),
}

// dance
var timer = null;
var bpm = 60;

if (aside.beats) parseFloat(aside.beats.value);

function tic() {
  if (paused && !advance) return;

  step = routine[clock];

  if (!step) {
    aside.text.textContent = '';
    aside.note.textContent = '';
    path.leader.setAttribute('d', 'M0,0');
    path.follower.setAttribute('d', 'M0,0');
    paused = true;
    return;
  }

  clock += direction;

  if (step.figure) {
    aside.figure.textContent = step.figure;
  }

  if (step.count) {
    aside.count.textContent = 'count: ' + step.count;
  }

  if (step.image) {
//  aside.image.setAttribute('src', step.image);
  }

  if (advance && step.count && (step.leader || step.follower)) {
    if (advance == 1) {
      advance = false;
      clock -= direction;
      return;
    } else if (advance == 2) {
      if (direction == -1) {
        advance = false;
        clock++;
      } else {
        advance--;
      }
    }
  }

  for (var attr in step) {
    if (attr == 'text') {
      aside.text.textContent = step.text;
      aside.note.textContent = '';
    } if (attr == 'note') {
      aside.note.textContent = step.note;
    } else if (shoes[attr]) {
      var person = attr;
      for (var foot in step[person]) {
        shoe = shoes[person][foot];
        op = step[person][foot];
        op = (direction == -1 ? op.reverse : op.forward);
        if (!op) continue;

        if (op.position) {
          if (op.position.path) {
            path[person].setAttribute('d', op.position.path);
          }
          if (op.dest) {
            shoes[person][foot].title.textContent = op.dest;
          }
          for (var attr in op.position) {
            shoe.position.setAttribute(attr, op.position[attr]);
          }
          shoe.position.beginElement();
        }

        if (op.orientation) {
          for (var attr in op.orientation) {
            shoe.orientation.setAttribute(attr, op.orientation[attr]);
          }
          shoe.orientation.beginElement();
        }

        if (op.heel && op.heel.to != shoe.heel.fill) {
          for (var attr in op.heel) {
            shoe.heel.node.setAttribute(attr, op.heel[attr]);
          }
          shoe.heel.fill = shoe.heel.to;
          shoe.heel.node.beginElement();
        }

        if (op.ball && op.ball.to != shoe.ball.fill) {
          for (var attr in op.ball) {
            shoe.ball.node.setAttribute(attr, op.ball[attr]);
          }
          shoe.ball.fill = shoe.ball.to;
          shoe.ball.node.beginElement();
        }
      }
    }
  }

  if (bpm != parseFloat(aside.beats.value)) {
    clearInterval(timer);
    compile();
    timer = setInterval(tic, 60000/bpm/4);
  }
}

compile();

function resize() {
  var view = clone(floor);
  view.width = view.maxx - view.minx + 200;
  view.height = view.maxy - view.miny + 200;

  aside.width = document.getElementsByTagName('aside')[0].offsetWidth;

  var aspect = {
    x: (document.documentElement.clientWidth - aside.width)/view.width,
    y: document.documentElement.clientHeight/view.height
  };

  if (aspect.x < aspect.y) {
    var mid = (view.miny + view.maxy)/2;
    view.height = view.height / aspect.x * aspect.y;
    view.miny = mid - view.height/2;
    view.maxy = mid - view.height/2;
  } else {
    var mid = (view.minx + view.maxx)/2;
    view.width = view.width / aspect.y * aspect.x;
    view.minx = mid - view.width/2;
    view.maxx = mid - view.width/2;
  }

  var svg = document.getElementsByTagName('svg')[0];

  svg.setAttribute('viewBox',
   [view.minx-100, view.miny-100, view.width, view.height].join(',')) 
  svg.setAttribute('height', document.documentElement.clientHeight);
  svg.setAttribute('width', document.documentElement.clientWidth - aside.width);

  document.getElementById('wall').setAttribute('d',
    "M" + (view.minx-90) + "," + (view.miny-90) + 'h' + (view.width-20) + 
    'v' + (view.height-20) + 'h-' + (view.width-20) + "z");
}

resize();
window.addEventListener('resize', resize);

timer = setInterval(tic, 60000/bpm/4);

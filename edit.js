var aspect = "position";

var svg = document.getElementsByTagName('svg')[0];

window.removeEventListener('resize', resize);

var scale;
function resize() {
  var viewBox = svg.getAttribute('viewBox').split(/[, ]+/);
  viewBox[0] -= viewBox[2];
  viewBox[1] -= viewBox[3];
  viewBox[2] *= 3;
  viewBox[3] *= 3;
  viewBox = viewBox.map(function(n) {return parseFloat(n).toFixed()});
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('height', document.documentElement.clientHeight);
  svg.setAttribute('width', document.documentElement.clientWidth - aside.width);
  scale = viewBox[3] / document.documentElement.clientHeight;
};
window.addEventListener('resize', resize);
resize();

var selected = null;

function toggle(part) {
  var person = selected.node.parentNode.id;
  var from, to;
  if (part.checked) {
    from = '#FFF';
    to = shoes[person].color;
  } else {
    to = '#FFF';
    from = shoes[person].color;
  }
  selected[part.id].node.parentNode.setAttribute('fill', to);
  selected[part.id].node.setAttribute('from', from);
  selected[part.id].node.setAttribute('to', to);
  selected[part.id].node.setAttribute('dur', '0.5s');
  selected[part.id].node.beginElement();
  return false;
}

function select(event) {
  if (selected) {
    var stroke = shoes[selected.node.parentNode.id].color;
    var paths = selected.node.querySelectorAll('path');
    for (var i=0; i<paths.length; i++) {
      paths[i].setAttribute('stroke', stroke);
      paths[i].removeAttribute('stroke-width');
    }
  }

  var shoe;
  if (event.node) {
    shoe = event.localName;
  } else if (event.localName) {
    shoe = event;
  } else {
    shoe = event.currentTarget;
  }

  selected = shoes[shoe.parentNode.id][shoe.classList[0]];
  if (!selected.move) selected.move = {};
  if (!selected.move.x) selected.move.x = 0;
  if (!selected.move.y) selected.move.y = 0;
  if (!selected.move.rotate) selected.move.rotate = selected.rotate;

  if (event.clientX) {
    selected.move.event = event;
  }

  var paths = selected.node.querySelectorAll('path');
  for (var i=0; i<paths.length; i++) {
    paths[i].setAttribute('stroke', '#0F0');
    paths[i].setAttribute('stroke-width', 3);
  }

  document.getElementById("shoe").textContent = 
    selected.node.parentNode.id + "'s " +selected.node.classList[0];

  document.getElementById("position").textContent = 
    selected.x.toFixed() + ', ' + selected.y.toFixed();
  document.getElementById("orientation").textContent = selected.rotate;

  if (selected.ball.node.parentNode.getAttribute('fill') == '#FFF') {
    document.getElementById("ball").checked = false;
  } else {
    document.getElementById("ball").checked = true;
  }

  if (selected.heel.node.parentNode.getAttribute('fill') == '#FFF') {
    document.getElementById("heel").checked = false;
  } else {
    document.getElementById("heel").checked = true;
  }

  draw(selected);
}

function deselect(event) {
  if (event.type == 'mouseout' && aspect == 'orientation') return;
  if (selected.move && selected.move.event) delete selected.move['event'];
}

function selectBall(event) {
  aspect = "position";
}

function selectHeel(event) {
  aspect = "orientation";
}

function vectorLength(event) {
  return Math.sqrt((event.clientX-selected.x)*(event.clientX-selected.x) +
      (event.clientY-selected.y)*(event.clientY-selected.y));
}

function mouseMove(event) {
  if (!selected || !selected.move || !selected.move.event) return;

  if (aspect == 'position') {
    selected.move.x += (event.clientX-selected.move.event.clientX)*scale;
    selected.move.y += (event.clientY-selected.move.event.clientY)*scale;
    selected.move.event = event;
  } else if (aspect == 'orientation') {
    var rect = svg.getBoundingClientRect();
    var viewBox = svg.viewBox.baseVal;
    var dy = (event.clientY-rect.top)*scale+viewBox.y -
      selected.y-selected.move.y;
    var dx = (event.clientX-rect.left)*scale+viewBox.x -
      selected.x - selected.move.x;
    var angle = Math.atan2(-dx, dy) / Math.PI * 180;
    while (angle < selected.move.rotate - 180) angle += 360;
    while (angle > selected.move.rotate + 180) angle -= 360;
    selected.move.rotate = angle;
  }

  draw(selected);
}

function draw(shoe) {
  // remove animation
  shoe.position.removeAttribute('path');
  shoe.position.endElement();
  shoe.orientation.removeAttribute('from');
  shoe.orientation.removeAttribute('to');
  shoe.orientation.endElement();

  // move(translate) and rotate shoe
  shoe.position.parentNode.setAttribute('transform', 'translate(' + 
    (shoe.x + shoe.move.x) + ',' + 
    (shoe.y + shoe.move.y) + ')');
  shoe.orientation.parentNode.setAttribute('transform', 'rotate(' + 
    (shoe.move.rotate || shoe.rotate) + ')');

  // update aside
  document.getElementById("move").textContent = 
    (shoe.x + shoe.move.x).toFixed() + ', ' + 
    (shoe.y + shoe.move.y).toFixed();
  document.getElementById("rotate").textContent = 
    shoe.move.rotate ? (shoe.move.rotate/5).toFixed()*5 : 0;

  // draw path line
  var line = "M" + shoe.x + ',' + shoe.y + "L" + 
    (shoe.x + shoe.move.x) + ',' + (shoe.y + shoe.move.y);
  path[shoe.node.parentNode.id].setAttribute('d', line);

  window.getSelection().removeAllRanges();
} 

function rotate(input, angle, result) {
  if (!result) result = {};

  angle = angle % 360;
  if (angle < 0) angle += 360;
  var sin, cos;
  if (angle < 180) {
    var radians = angle/180*Math.PI;
    sin = Math.sin(radians);
    cos = Math.cos(radians);
  } else {
    var radians = (angle-180)/180*Math.PI;
    sin = -Math.sin(radians);
    cos = -Math.cos(radians);
  }

  result.x = input.x*cos + input.y*sin;
  result.y = -input.y*cos + input.x*sin;

  return result;
}

function move(x, y) {
  var movement = rotate({x: x, y: y}, selected.rotate);

  if (!selected.move) selected.move = {x: 0, y: 0, rotate: selected.rotate};

  selected.move.x += movement.x;
  selected.move.y += movement.y;

  draw(selected);
}

function turn(angle) {
  selected.move.rotate = 
    ((selected.move.rotate + angle)/angle).toFixed() * angle;
  draw(selected);
}

svg.addEventListener('mousemove', mouseMove);
svg.addEventListener('mouseup', deselect);

var targets = document.querySelectorAll('.right,.left');
for (var i=0; i<targets.length; i++) {
  targets[i].addEventListener('mousedown', select);

  var ball = targets[i].querySelector('.ball').parentNode;
  var heel = targets[i].querySelector('.heel').parentNode;
  ball.addEventListener('mousedown', selectBall);
  heel.addEventListener('mousedown', selectHeel);
}

select({currentTarget: document.querySelector("#follower .right")});

window.addEventListener('keydown', function(event) {
  if (document.activeElement.tagName.toLowerCase() == 'input') {
    if (event.keyCode != 13) return;
  }

  var step = 100;
  if (event.shiftKey) step = 10;
  if (event.ctrlKey) step = 1;
  if (event.metaKey) step = 1;

  if (event.keyCode == 32) { // space
    if (shoes.follower.right == selected) {
      select(shoes.leader.left.node);
    } else if (shoes.leader.left == selected) {
      select(shoes.follower.left.node);
    } else if (shoes.follower.left == selected) {
      select(shoes.leader.right.node);
    } else {
      select(shoes.follower.right.node);
    }

    event.preventDefault();
  } else if (event.keyCode == 37) { // left
    if (!event.altKey) {
      move(-step, 0);
    } else {
      turn(event.shiftKey ? -5 : -45);
    }
    event.preventDefault();
  } else if (event.keyCode == 38) { // up
    move(0, step);
    event.preventDefault();
  } else if (event.keyCode == 39) { // right
    if (!event.altKey) {
      move(step, 0);
    } else {
      turn(event.shiftKey ? 5 : 45);
    }
    event.preventDefault();
  } else if (event.keyCode == 40) { // down
    move(0, -step);
    event.preventDefault();
  } else if (event.keyCode == 52) { // 4
    if (selected == shoes.follower.right) {
      select(shoes.leader.left.node);
      move(0, 100);
      select(shoes.follower.right.node);
      move(0, -100);
    }
    event.preventDefault();
  } else if (event.keyCode == 27) { // esc
    ["leader", "follower"].forEach(function(person) {
      ["left", "right"].forEach(function(foot) {
        var shoe = shoes[person][foot];
        shoe.move = {x: 0, y: 0, rotate: shoe.rotate};
        draw(shoe);
      });
    });
    select(selected.node);
  } else if (event.keyCode == 81) { // q
    document.getElementById('duration').value = '1';
  } else if (event.keyCode == 83) { // s
    document.getElementById('duration').value = '2';

  } else if (event.keyCode == 13) { // enter

    var step = {time: document.getElementById('duration').value};
    if (routine.length == 0) {
      step.figure = document.getElementById('figure').value;
    }

    var text = document.getElementById('text').value;
    if (text) {
      step.text = text;
      document.getElementById('text').value = '';
    }

    var note = document.getElementById('note').value;
    if (note) {
      step.note = note;
      document.getElementById('note').value = '';
    }

    ["leader", "follower"].forEach(function(person) {
      ["left", "right"].forEach(function(foot) {
        var shoe = shoes[person][foot];
        if (!shoe.move) return;
        if (shoe.move.x || shoe.move.y || shoe.move.rotate != shoe.rotate) {
          if (!step[person]) step[person] = {}
          step[person][foot] = {}
          if (shoe.move.x || shoe.move.y) {
            var movement = rotate(shoe.move, shoe.rotate);
            movement.x = parseFloat(movement.x.toFixed(3));
            movement.y = parseFloat(movement.y.toFixed(3));
            step[person][foot].path = "l" + movement.x + ',' + movement.y;
            shoe.x += shoe.move.x;
            shoe.y += shoe.move.y;
          }
          if (shoe.move.rotate != shoe.rotate) {
            shoe.move.rotate = (shoe.move.rotate/5).toFixed()*5;
            step[person][foot].rotate = shoe.move.rotate - shoe.rotate;
            shoe.rotate = shoe.move.rotate;
          }
        }
        shoe.move = {x: 0, y: 0, rotate: shoe.rotate};
        draw(shoe);
      });
    });
    steps.push(step);
    compile();
    clock = routine.length;
    select(selected.node);
  } else {
    console.log(event.keyCode);
  }
});

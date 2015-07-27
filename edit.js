var svg = document.getElementsByTagName('svg')[0];
var viewBox = svg.getAttribute('viewBox').split(/[, ]+/);
viewBox[0] -= viewBox[2];
viewBox[1] -= viewBox[3];
viewBox[2] *= 3;
viewBox[3] *= 3;
svg.setAttribute('viewBox', viewBox);
var scale = viewBox[3] / document.documentElement.clientHeight;

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

  shoe = (event.localName ? event : event.currentTarget);
  selected = shoes[shoe.parentNode.id][shoe.classList[0]];

  if (event.clientX) {
    if (!selected.move) selected.move = {};
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
    selected.x + ', ' + selected.y;

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
}

function deselect(event) {
  if (selected.move && selected.move.event) delete selected.move['event'];
}

function mouseMove(event) {
  if (!selected || !selected.move || !selected.move.event) return;
  if (!selected.move.x) selected.move.x = 0;
  if (!selected.move.y) selected.move.y = 0;

  selected.move.x += (event.clientX-selected.move.event.clientX)*scale;
  selected.move.y += (event.clientY-selected.move.event.clientY)*scale;
  selected.move.event = event;

  draw(selected);
}

function draw(shoe) {
  selected.position.removeAttribute('path');
  selected.position.endElement();
  selected.position.parentNode.setAttribute('transform', 'translate(' + 
    (selected.x + selected.move.x) + ',' + 
    (selected.y + selected.move.y) + ')');

  document.getElementById("move").textContent = 
    (selected.x + selected.move.x).toFixed() + ', ' + 
    (selected.y + selected.move.y).toFixed();

  var person = selected.node.parentNode.id;
  var line = "M" + selected.x + ',' + selected.y + "L" + 
    (selected.x + selected.move.x) + ',' + (selected.y + selected.move.y);
  path[person].setAttribute('d', line);
} 

function move(x, y) {
  if (!selected.move) selected.move = {};
  if (!selected.move.x) selected.move.x = 0;
  if (!selected.move.y) selected.move.y = 0;

  // determine rotation
  var angle = selected.rotate % 360;
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

  selected.move.x += x*cos + y*sin;
  selected.move.y += -y*cos + x*sin;

  draw(selected);
}

var targets = document.querySelectorAll('.right,.left');
for (var i=0; i<targets.length; i++) {
  targets[i].addEventListener('mousedown', select);
  targets[i].addEventListener('mouseup', deselect);
  targets[i].addEventListener('mouseout', deselect);
  targets[i].addEventListener('mousemove', mouseMove);
}

select({currentTarget: document.querySelector("#follower .right")});

window.addEventListener('keydown', function(event) {
  var step = 100;
  if (event.shiftKey) step = 10;
  if (event.ctrlKey) step = 1;

  if (event.keyCode == 32) {
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
  } else if (event.keyCode == 37) {
    move(-step, 0);
    event.preventDefault();
  } else if (event.keyCode == 38) {
    move(0, step);
    event.preventDefault();
  } else if (event.keyCode == 39) {
    move(step, 0);
    event.preventDefault();
  } else if (event.keyCode == 40) {
    move(0, -step);
    event.preventDefault();
  }
});

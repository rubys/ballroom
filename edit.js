var aspect = "position";
var newFigure;

aside.input = {
  duration: document.getElementById('duration'),
  text: document.querySelector('input[name=text]'),
  note: document.querySelector('input[name=note]')
}

document.getElementById('editmode').addEventListener('click', function() {

  // create a new figure in the syllabus
  var name = document.getElementById('stepname').value;
  name = name || 'New Figure';
  newFigure = [];
  syllabus[dance].figures.push({figure: '-', name: name, steps: newFigure});

  // add it to the routine
  var routine = document.getElementById('routine');
  var index = syllabus[dance].figures.length - 1;
  var li = document.createElement('li');
  li.setAttribute('data-index', index);
  var span = document.createElement('span');
  span.textContent = syllabus[dance].figures[index].name;
  li.appendChild(span);
  routine.appendChild(li);

  // display count
  aside.count.textContent = 'count: ' + (count = 0);

  // resize floor
  document.getElementById('edit').style.display = 'block';
  showStage();
  if (scale < 1) {
    floor.minx /= scale/2;
    floor.miny /= scale/2;
    floor.maxx /= scale/2;
    floor.maxy /= scale/2;
  }
  resize();
  reset();

  // select first foot
  select(document.querySelector("#follower .right"));

  // eliminate wall
  document.querySelector("#wall").style.display = "none";
});

var svg = document.getElementsByTagName('svg')[0];

var selected = null

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
  if (selected && selected.node) {
    var stroke = shoes[selected.node.parentNode.id].color;
    var paths = selected.node.querySelectorAll('path');
    for (var i=0; i<paths.length; i++) {
      paths[i].setAttribute('stroke', stroke);
      paths[i].removeAttribute('stroke-width');
    }
  }

  var shoe;
  if (event.node) {
    shoe = event.node;
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
  if (selected.move && selected.move.event) delete selected.move['event'];
}

function selectBall(event) {
  aspect = "position";
}

function selectHeel(event) {
  aspect = "orientation";
}

function mouseMove(event) {
  if (!selected || !selected.move || !selected.move.event) {
    if (event.button == 1 || event.buttons == 1) {
      if (!selected) selected = {};
      if (selected.move && (selected.move.x || selected.move.y)) return;
      selected.move = {event: event, x: 0, y: 0};
      aspect = 'pan';
    } else {
      return;
    }
  }

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
  } else if (aspect == 'pan') {
    if (!event.button && !event.buttons) {
      aspect = 'position';
      delete selected.move;
      return;
    }
    var viewBox = svg.viewBox.baseVal;
    viewBox.x -= (event.clientX-selected.move.event.clientX)*scale;
    viewBox.y -= (event.clientY-selected.move.event.clientY)*scale;
    selected.move.event = event;
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

function move(x, y) {
  var movement = rotate({x: x, y: y}, selected.rotate);

  if (!selected.move) selected.move = {x: 0, y: 0, rotate: selected.rotate};

  selected.move.x += movement.x;
  selected.move.y += movement.y;

  draw(selected);
}

function moveTo(base, offset) {
  var movement = rotate(offset, base.rotate);

  if (!selected.move) selected.move = {x: 0, y: 0, rotate: selected.rotate};

  selected.move.x = (base.x + movement.x) - selected.x;
  selected.move.y = (base.y + movement.y) - selected.y;

  draw(selected);
}

function moveToPosition(event) {
  var forward;
  if (event.keyCode == 50) { // 2
  }
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

function selectNextFoot() {
  if (shoes.follower.right == selected) {
    select(shoes.leader.left);
  } else if (shoes.leader.left == selected) {
    select(shoes.follower.left);
  } else if (shoes.follower.left == selected) {
    select(shoes.leader.right);
  } else {
    select(shoes.follower.right);
  }
}

window.addEventListener('keydown', function(event) {
  if (document.activeElement.tagName.toLowerCase() == 'input') {
    if (event.keyCode != 13) return;
  }

  var step = 100;
  if (event.shiftKey) step = 10;
  if (event.ctrlKey) step = 1;
  if (event.metaKey) step = 1;

  if (event.keyCode == 32) { // space
    selectNextFoot();
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

  } else if (event.keyCode == 49) { // 1
    if (selected == shoes.follower.right) {
      if (!event.shiftKey) {
        select(shoes.leader.left);
        moveTo(shoes.leader.right, {x: -shoes.gap.legs.x, y: 0});
      }
      select(shoes.follower.right);
      moveTo(shoes.follower.left, {x: shoes.gap.legs.x, y: 0});
    } else if (selected == shoes.follower.left) {
      if (!event.shiftKey) {
        select(shoes.leader.right);
        moveTo(shoes.leader.left, {x: shoes.gap.legs.x, y: 0});
      }
      select(shoes.follower.left);
      moveTo(shoes.follower.right, {x: -shoes.gap.legs.x, y: 0});
    } else if (selected == shoes.leader.left) {
      if (!event.shiftKey) {
        select(shoes.follower.right);
        moveTo(shoes.follower.left, {x: shoes.gap.legs.x, y: 0});
      }
      select(shoes.leader.left);
      moveTo(shoes.leader.right, {x: -shoes.gap.legs.x, y: 0});
    } else if (selected == shoes.leader.right) {
      if (!event.shiftKey) {
        select(shoes.follower.left);
        moveTo(shoes.follower.right, {x: -shoes.gap.legs.x, y: 0});
      }
      select(shoes.leader.right);
      moveTo(shoes.leader.left, {x: shoes.gap.legs.x, y: 0});
    }
    event.preventDefault();

  } else if (event.keyCode == 50) { // 2
    if (selected == shoes.follower.right) {
      if (!event.shiftKey) {
        select(shoes.leader.left);
        moveTo(shoes.leader.right, {x: -shoes.gap.legs.x - shoes.step, y: 0});
      }
      select(shoes.follower.right);
      moveTo(shoes.follower.left, {x: shoes.gap.legs.x + shoes.step, y: 0});
    } else if (selected == shoes.follower.left) {
      if (!event.shiftKey) {
        select(shoes.leader.right);
        moveTo(shoes.leader.left, {x: shoes.gap.legs.x + shoes.step, y: 0});
      }
      select(shoes.follower.left);
      moveTo(shoes.follower.right, {x: -shoes.gap.legs.x - shoes.step, y: 0});
    } else if (selected == shoes.leader.left) {
      if (!event.shiftKey) {
        select(shoes.follower.right);
        moveTo(shoes.follower.left, {x: shoes.gap.legs.x + shoes.step, y: 0});
      }
      select(shoes.leader.left);
      moveTo(shoes.leader.right, {x: -shoes.gap.legs.x - shoes.step, y: 0});
    } else if (selected == shoes.leader.right) {
      if (!event.shiftKey) {
        select(shoes.follower.left);
        moveTo(shoes.follower.right, {x: -shoes.gap.legs.x - shoes.step, y: 0});
      }
      select(shoes.leader.right);
      moveTo(shoes.leader.left, {x: shoes.gap.legs.x + shoes.step, y: 0});
    }
    event.preventDefault();

  } else if (event.keyCode == 52) { // 4
    if (selected == shoes.follower.right) {
      if (!event.shiftKey) {
        select(shoes.leader.left);
        moveTo(shoes.leader.right, {x: -shoes.gap.legs.x, y: shoes.step});
      }
      select(shoes.follower.right);
      moveTo(shoes.follower.left, {x: shoes.gap.legs.x, y: -shoes.step});
    } else if (selected == shoes.follower.left) {
      if (!event.shiftKey) {
        select(shoes.leader.right);
        moveTo(shoes.leader.left, {x: shoes.gap.legs.x, y: shoes.step});
      }
      select(shoes.follower.left);
      moveTo(shoes.follower.right, {x: -shoes.gap.legs.x, y: -shoes.step});
    } else if (selected == shoes.leader.left) {
      if (!event.shiftKey) {
        select(shoes.follower.right);
        moveTo(shoes.follower.left, {x: shoes.gap.legs.x, y: -shoes.step});
      }
      select(shoes.leader.left);
      moveTo(shoes.leader.right, {x: -shoes.gap.legs.x, y: shoes.step});
    } else if (selected == shoes.leader.right) {
      if (!event.shiftKey) {
        select(shoes.follower.left);
        moveTo(shoes.follower.right, {x: -shoes.gap.legs.x, y: -shoes.step});
      }
      select(shoes.leader.right);
      moveTo(shoes.leader.left, {x: shoes.gap.legs.x, y: shoes.step});
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
    select(selected);
  } else if (event.keyCode == 81) { // q
    aside.input.duration.value = '1';
  } else if (event.keyCode == 83) { // s
    aside.input.duration.value = '2';

  } else if (event.keyCode == 13) { // enter

    var step = {time: parseFloat(aside.input.duration.value)};

    var text = aside.input.text.value;
    if (text) {
      step.text = text;
      aside.input.text.value = '';
    }

    var note = aside.input.note.value;
    if (note) {
      step.note = note;
      aside.input.note.value = '';
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
    newFigure.push(step);

    aside.count.textContent = 'count: ' + (count+=step.time);

    selectNextFoot();
    selectNextFoot();
  } else {
    console.log(event.keyCode);
  }
});

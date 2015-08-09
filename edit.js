var aspect = "position";
var newFigure;

var svg = document.getElementsByTagName('svg')[0];
var selected = null;
var nob = null;

aside.input = {
  duration: document.getElementById('duration'),
  text: document.querySelector('input[name=text]'),
  note: document.querySelector('input[name=note]')
}

document.getElementById('editmode').addEventListener('click', function() {

  // create a new figure in the syllabus
  var name = document.getElementById('stepname').value;
  name = name || 'New Figure';
  newFigure = {figure: '-', name: name, steps: []};
  syllabus[dance].figures.push(newFigure);

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
  reset(syllabus[dance].initial);

  // select first foot
  select(document.querySelector("#follower .right"));

  // eliminate syllabus and wall
  document.getElementById('syllabus').style.display="none";
  document.querySelector("#wall").style.display = "none";

  // webkit workaround
  setTimeout(function() {
    resize();
    select(selected);
  }, 200);
});

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

  nob = null;
  selected = shoes[shoe.parentNode.id][shoe.classList[0]];
  if (!('next' in selected)) selected.next = {};
  if (!('x' in selected.next)) selected.next.x = selected.x;
  if (!('y' in selected.next)) selected.next.y = selected.y;
  if (!('rotate' in selected.next)) selected.next.rotate = selected.rotate;

  if (event.clientX) {
    selected.next.event = event;
  }

  var paths = selected.node.querySelectorAll('path');
  for (var i=0; i<paths.length; i++) {
    paths[i].setAttribute('stroke', '#0F0');
    paths[i].setAttribute('stroke-width', 3);
  }

  document.getElementById("shoe").textContent = 
    selected.node.parentNode.id + "'s " +selected.node.classList[0];

  document.getElementById("position").textContent = 
    selected.prev.x.toFixed() + ', ' + selected.prev.y.toFixed();
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
  hideNobs();
}

function deselect(event) {
  if (selected && selected.next && selected.next.event) {
    delete selected.next.event;
  }
  if (nob && nob.event) delete nob.event;
}

function selectBall(event) {
  aspect = "position";
}

function selectHeel(event) {
  aspect = "orientation";
}

function mouseMove(event) {
  if (!selected || !selected.next || !selected.next.event) {
    if (event.button == 1 || event.buttons == 1) {
      if (!selected) selected = {};

      if (nob && nob.event) {
        move((event.clientX-nob.event.clientX)*scale,
             -(event.clientY-nob.event.clientY)*scale);
        nob.event = event;
        return;
      }

      if (selected.x != selected.prev.x || selected.y != selected.prev.y) {
        return;
      } else {
        selected.event = event;
        aspect = 'pan';
     }
    } else {
      return;
    }
  }

  if (aspect == 'position') {
    selected.x += (event.clientX-selected.next.event.clientX)*scale;
    selected.y += (event.clientY-selected.next.event.clientY)*scale;
    selected.event = event;
  } else if (aspect == 'orientation') {
    var rect = svg.getBoundingClientRect();
    var viewBox = svg.viewBox.baseVal;
    var dy = (event.clientY-rect.top)*scale+viewBox.y - selected.y;
    var dx = (event.clientX-rect.left)*scale+viewBox.x - selected.x;
    var angle = Math.atan2(-dx, dy) / Math.PI * 180;
    while (angle < selected.rotate - 180) angle += 360;
    while (angle > selected.rotate + 180) angle -= 360;
    selected.rotate = angle;
  } else if (aspect == 'pan') {
    if (!event.button && !event.buttons) {
      aspect = 'position';
      delete selected.next;
      return;
    }
    var viewBox = svg.viewBox.baseVal;
    viewBox.x -= (event.clientX-selected.next.event.clientX)*scale;
    viewBox.y -= (event.clientY-selected.next.event.clientY)*scale;
    selected.next.event = event;
  }

  if (selected) draw(selected);
}

function draw(shoe) {
  // remove animation
  shoe.position.removeAttribute('path');
  shoe.position.endElement();
  shoe.orientation.removeAttribute('from');
  shoe.orientation.removeAttribute('to');
  shoe.orientation.endElement();

  // move(translate) and rotate shoe
  shoe.position.endElement();
  shoe.position.parentNode.setAttribute('transform', 'translate(' + 
    shoe.x + ',' + shoe.y + ')');
  shoe.orientation.endElement();
  shoe.orientation.parentNode.setAttribute('transform', 'rotate(' + 
    shoe.rotate + ')');

  // update aside
  document.getElementById("move").textContent = 
    shoe.x.toFixed() + ', ' + shoe.y.toFixed();
  document.getElementById("rotate").textContent = 
    (shoe.rotate/5).toFixed()*5;

  // draw path line
  var line = "M" + shoe.prev.x + ',' + shoe.prev.y + 
    "L" + shoe.x + ',' + shoe.y;
  if (shoe.next.x1 || shoe.next.y1) {
    line = "M" + shoe.prev.x + ',' + shoe.prev.y + "C" + 
      shoe.next.x1 + ',' + shoe.next.y1 + ',' +
      shoe.next.x2 + ',' + shoe.next.y2 + ',' +
      shoe.x + ',' + shoe.y;
  }
  path[shoe.node.parentNode.id].setAttribute('d', line);

  window.getSelection().removeAllRanges();
} 

function move(x, y) {
  if (nob) {
    if (nob.which == 1) {
      selected.next.x1 += x;
      selected.next.y1 -= y;
    } else {
      selected.next.x2 += x;
      selected.next.y2 -= y;
    }
    drawNobs(selected);
  } else {
    var movement = rotate({x: x, y: y}, selected.rotate);
    selected.x += movement.x;
    selected.y += movement.y;
  }

  draw(selected);
}

function moveTo(base, offset) {
  var movement = rotate(offset, base.rotate);

  selected.x = base.x + movement.x;
  selected.y = base.y + movement.y;

  draw(selected);
}

function turn(angle) {
  selected.rotate = 
    ((selected.rotate + angle)/angle).toFixed() * angle;
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

document.getElementById('nob1').addEventListener('mousedown', function(event) {
  nob = {which: 1, event: event};
  event.preventDefault();
  event.stopPropagation();
});

document.getElementById('nob2').addEventListener('mousedown', function(event) {
  nob = {which: 2, event: event};
  event.preventDefault();
  event.stopPropagation();
});

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

function saveFigure() {
  post('post.cgi', 
    {dance: dance, figure: newFigure.name, steps: newFigure.steps},
    function(response) {
      if (response.status == 200) {
        console.log("file saved as: " + response.text);
      } else {
        console.log(response);
      }
    });
}

function drawNobs(selected) {
  if (!selected.next || !('x1' in selected.next)) return;

  document.querySelector('#nob1 path').setAttribute('d',
    "M" + selected.prev.x + ',' + selected.prev.y + 
      'L' + selected.next.x1 + ',' + selected.next.y1);
  document.querySelector('#nob1 circle').setAttribute('cx', selected.next.x1);
  document.querySelector('#nob1 circle').setAttribute('cy', selected.next.y1);

  document.querySelector('#nob2 path').setAttribute('d',
    "M" + selected.x + ',' + selected.y + 
      'L' + selected.next.x2 + ',' + selected.next.y2);
  document.querySelector('#nob2 circle').setAttribute('cx', selected.next.x2);
  document.querySelector('#nob2 circle').setAttribute('cy', selected.next.y2);
}

function hideNobs() {
  document.getElementById('nobs').style.display = 'none';
  nobs = null;
}

function moveToPosition(n, event) {
  var move = {x: 0, y: 0};
  if (n==1) move = {x: shoes.gap.legs.x, y: 0, rotate: 0};
  if (n==2) move = {x: shoes.gap.legs.x + shoes.step.side, y: 0, rotate: 0};
  if (n==3) move = {x: 45, y: -55, rotate: 20};
  if (n==4) move = {x: shoes.gap.legs.x, y: -shoes.step.forward, rotate: 0};
  if (n==5) move = {x: -5, y: -105, rotate: 30};

  if (n==4 && event.altKey) move.y = -move.y;

  var rmove = {x: -move.x, y: -move.y};
  if (n==3 || n==5) rmove.y = move.y;

  var match = (n != 3 && n != 5) && (selected.rotate != selected.prev.rotate);

  if (selected == shoes.follower.right) {
    if (!event.shiftKey) {
      select(shoes.leader.left);
      selected.rotate = shoes.leader.right.prev.rotate - move.rotate;
      moveTo(shoes.leader.right, {x: rmove.x, y: rmove.y});
    }
    select(shoes.follower.right);
    selected.rotate = shoes.follower.left.prev.rotate + move.rotate;
    moveTo(shoes.follower.left, {x: move.x, y: move.y});

  } else if (selected == shoes.follower.left) {
    if (!event.shiftKey) {
      select(shoes.leader.right);
      selected.rotate = shoes.leader.left.prev.rotate + move.rotate;
      moveTo(shoes.leader.left, {x: move.x, y: move.y});
    }
    select(shoes.follower.left);
    selected.rotate = shoes.follower.right.prev.rotate - move.rotate;
    moveTo(shoes.follower.right, {x: rmove.x, y: rmove.y});

  } else if (selected == shoes.leader.left) {
    if (!match) selected.rotate = shoes.leader.right.prev.rotate - move.rotate;
    moveTo(shoes.leader.right, {x: rmove.x, y: rmove.y});

    if (!event.shiftKey) {
      select(shoes.follower.right);
      if (match) {
        selected.rotate = shoes.leader.left.rotate + 180;
        while (selected.rotate - selected.prev.rotate >= 180) {
          selected.rotate -= 360;
        }
        while (selected.prev.rotate - selected.rotate > 180) {
          selected.rotate += 360;
        }
        moveTo({x: shoes.leader.left.x, y: shoes.leader.left.y,
          rotate: shoes.leader.left.rotate},
          shoes.gap.people);
      } else {
        selected.rotate = shoes.follower.left.prev.rotate + move.rotate;
        moveTo(shoes.follower.left, {x: move.x, y: move.y});
      }
    }

    select(shoes.leader.left);

  } else if (selected == shoes.leader.right) {
    if (!match) selected.rotate = shoes.leader.left.prev.rotate + move.rotate;
    moveTo(shoes.leader.left, {x: move.x, y: move.y});

    if (!event.shiftKey) {
      select(shoes.follower.left);
      if (match) {
        selected.rotate = shoes.leader.right.rotate + 180;
        while (selected.rotate - selected.prev.rotate >= 180) {
          selected.rotate -= 360;
        }
        while (selected.prev.rotate - selected.rotate > 180) {
          selected.rotate += 360;
        }
        moveTo({x: shoes.leader.right.x, y: shoes.leader.right.y,
          rotate: shoes.leader.right.rotate},
          shoes.gap.people);
      } else {
        selected.rotate = shoes.follower.right.prev.rotate - move.rotate;
        moveTo(shoes.follower.right, {x: rmove.x, y: rmove.y});
      }
    }

    select(shoes.leader.right);
  }
}

// copy support
document.addEventListener('copy', function(event) {
  if (newFigure) {
    event.clipboardData.setData('text/plain', JSON.stringify(newFigure.steps));
    event.preventDefault();
  }
});

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
    if (event.altKey) {
      turn(event.shiftKey ? -5 : -45);
    } else {
      move(-step, 0);
    }
    event.preventDefault();

  } else if (event.keyCode == 38) { // up
    move(0, step);
    event.preventDefault();

  } else if (event.keyCode == 39) { // right
    if (event.altKey) {
      turn(event.shiftKey ? 5 : 45);
    } else {
      move(step, 0);
    }
    event.preventDefault();

  } else if (event.keyCode == 40) { // down
    move(0, -step);
    event.preventDefault();

  } else if (event.keyCode == 49) { // 1
    moveToPosition(1, event);
    event.preventDefault();

  } else if (event.keyCode == 50) { // 2
    moveToPosition(2, event);
    event.preventDefault();

  } else if (event.keyCode == 51) { // 3
    moveToPosition(3, event);
    event.preventDefault();

  } else if (event.keyCode == 52) { // 4
    moveToPosition(4, event);
    event.preventDefault();

  } else if (event.keyCode == 53) { // 5
    moveToPosition(5, event);
    event.preventDefault();

  } else if (event.keyCode == 27) { // esc
    ["leader", "follower"].forEach(function(person) {
      ["left", "right"].forEach(function(foot) {
        var shoe = shoes[person][foot];
        shoe.x = shoe.prev.x;
        shoe.y = shoe.prev.y;
        shoe.rotate = shoe.prev.rotate;
        draw(shoe);
      });
    });
    if (selected) select(selected);

  } else if (event.keyCode == 67) { // c
    var nobs = document.getElementById('nobs');

    if (selected && selected.next && (selected.x || selected.y)) {
      if (selected.next.x1 || selected.next.y1) {
        if (nobs.style.display == 'none') {
          nobs.style.display = 'inherit';
        } else {
          hideNobs();
        }
      } else {
        var dx = selected.x - selected.prev.x;
        var dy = selected.y - selected.prev.y;
        var r = Math.sqrt(dx*dx + dy*dy)/2;
        var theta = Math.atan2(dy, dx);
        var shift = {x: r*Math.sin(theta+Math.PI/4),
          y: r*Math.cos(theta+Math.PI/4)};
        selected.next.x1 = selected.prev.x+shift.x;
        selected.next.y1 = selected.prev.y-shift.y;
        selected.next.x2 = selected.x-shift.x;
        selected.next.y2 = selected.y+shift.y;
        drawNobs(selected);
        draw(selected);
        nobs.style.display = 'inherit';
      }
    }

  } else if (event.keyCode == 81) { // q
    aside.input.duration.value = '1';

  } else if (event.keyCode == 82) { // r
    if (event.shiftKey && routine) {
      var debug = document.getElementById('debug'); 
      var data = JSON.stringify(routine, null, 2);
      if (debug.style.display == 'block' && debug.textContent == data) {
        debug.style.display = 'none';
      } else {
        debug.textContent = data;
        debug.style.display = 'block';
      }
    }

  } else if (event.keyCode == 83) { // s
    if (event.ctrlKey) {
      saveFigure();
    } else if (event.shiftKey && newFigure) {
      var debug = document.getElementById('debug'); 
      var data = JSON.stringify(newFigure.steps, null, 2);
      if (debug.style.display == 'block' && debug.textContent == data) {
        debug.style.display = 'none';
      } else {
        debug.textContent = data;
        debug.style.display = 'block';
      }
    } else {
      aside.input.duration.value = '2';
    }
    event.preventDefault();

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
        if (
          shoe.x != shoe.prev.x || shoe.y != shoe.prev.y ||
          shoe.rotate != shoe.prev.rotate
        ) {
          if (!step[person]) step[person] = {}
          if (!step[person][foot]) step[person][foot] = {}

          if (shoe.x != shoe.prev.x || shoe.y != shoe.prev.y) {
            var movement = rotate(
              {x: shoe.x - shoe.prev.x, y: shoe.y - shoe.prev.y}, shoe.rotate);
            movement.x = parseFloat(movement.x.toFixed(3));
            movement.y = parseFloat(movement.y.toFixed(3));
            if ('x1' in shoe.next) {
              var movement1 = rotate(
                {x: shoe.next.x1-shoe.prev.x, y: shoe.next.y1-shoe.prev.y},
                shoe.prev.rotate);
              var movement2 = rotate(
                {x: shoe.next.x2-shoe.prev.x, y: shoe.next.y2-shoe.prev.y},
                shoe.prev.rotate);
              step[person][foot].path = "c" + 
                parseFloat(movement1.x.toFixed(3)) + ',' +
                parseFloat(movement1.y.toFixed(3)) + ',' +
                parseFloat(movement2.x.toFixed(3)) + ',' +
                parseFloat(movement2.y.toFixed(3)) + ',' +
                movement.x + ',' + movement.y;
            } else {
              step[person][foot].path = "l" + movement.x + ',' + movement.y;
            }
            shoe.prev.x = shoe.x;
            shoe.prev.y = shoe.y;
          }
          if (shoe.rotate != shoe.prev.rotate) {
            shoe.rotate = (shoe.rotate/5).toFixed()*5;
            step[person][foot].rotate = shoe.rotate - shoe.prev.rotate;
            shoe.prev.rotate = shoe.rotate;
          }
        }
        shoe.next = {x: shoe.x, y: shoe.y, rotate: shoe.rotate};
        draw(shoe);
      });
    });
    newFigure.steps.push(step);
    compile();
    clock = routine.length;

    aside.count.textContent = 'count: ' + (count+=step.time);

    selectNextFoot();
    selectNextFoot();

  } else {
    lastKey = event.keyCode;
  }
});

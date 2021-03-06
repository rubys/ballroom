var aspect = "position";
var newFigure;

var svg = document.querySelector('#floor svg');
var selected = null;
var nob = null;

aside.input = {
  duration: document.getElementById('duration'),
  text: document.querySelector('input[name=text]'),
  note: document.querySelector('input[name=note]')
}

function suspend() {
  document.activeElement.blur();

  if (newFigure) {
    var step = newFigure.steps[aside.step] || {};
    aside.input.duration.value = step.time || 1;
    aside.input.text.value = step.text || '';
    aside.input.note.value = step.note || '';
  } else {
    selected = {};
  }

  if (!('step' in aside)) {
    ["leader", "follower"].forEach(function(person) {
      ["left", "right"].forEach(function(foot) {
        var shoe = shoes[person][foot];
        shoe.prev = {x: shoe.x, y: shoe.y, rotate: shoe.rotate};
      });
    });
  }
}

function editmode() {
  var routine = document.getElementById('routine');

  var name = document.getElementById('stepname').value;
  var listitems = routine.querySelectorAll('li')

  if (!name && listitems.length == 1) {
    // edit existing figure
    var index = listitems[0].getAttribute('data-index');
    newFigure = syllabus[dance].figures[index];
  } else {
    // create a new figure in the syllabus
    name = name || 'New Figure';
    newFigure = {figure: '-', name: name, steps: []};
    syllabus[dance].figures.push(newFigure);

    // add it to the routine
    var index = syllabus[dance].figures.length - 1;
    var li = document.createElement('li');
    li.setAttribute('data-index', index);
    var span = document.createElement('span');
    span.textContent = syllabus[dance].figures[index].name;
    li.appendChild(span);
    routine.appendChild(li);
  }

  // display count
  aside.count.textContent = 'count: ' + (count = 0);

  // resize floor
  document.getElementById('edit').style.display = 'block';
  floor = {};
  reset(clone(syllabus[dance].initial));
  showStage();
  if (!floor.padding) {
    var padding = Math.max(shoes.step.forward, shoes.step.side);
    floor.padding = {x: padding, y: padding}
  }
  resize();

  // select first foot
  select(document.querySelector("#follower .right"));

  // eliminate syllabus and wall
  document.getElementById('syllabus').style.display="none";
  document.querySelector("#wall").style.display = "none";

  // start pattern
  var pattern = syllabus[dance].pattern;
  if (pattern) {
    if (pattern[0].time) aside.input.duration.value = pattern[0].time;
    if (pattern[0].text) aside.input.text.value = pattern[0].text;
    if (pattern[0].note) aside.input.note.value = pattern[0].note;
  }

  // webkit workaround
  setTimeout(function() {
    resize();
    select(selected);
  }, 200);
};

document.getElementById('editmode').addEventListener('click', editmode);

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
  if (!newFigure || direction == -1) return;

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
  if (!('prev' in selected)) selected.prev = {};
  if (!('x' in selected.prev)) selected.prev.x = selected.x;
  if (!('y' in selected.prev)) selected.prev.y = selected.y;
  if (!('rotate' in selected.prev)) selected.prev.rotate = selected.rotate;

  if (event.clientX) selected.event = event;

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
  if (selected && selected.event) delete selected.event;
  if (nob && nob.event) delete nob.event;
}

function selectBall(event) {
  aspect = "position";
}

function selectHeel(event) {
  aspect = "orientation";
}

function mouseMove(event) {
  if (!newFigure) return;
  
  if (!selected || !selected.event) {
    if (event.button == 1 || event.buttons == 1) {
      if (!selected) selected = {};

      if (nob && nob.event) {
        move((event.clientX-nob.event.clientX)*scale,
             -(event.clientY-nob.event.clientY)*scale);
        nob.event = event;
        return;
      }

      if (
        'prev' in selected &&
        (selected.x != selected.prev.x || selected.y != selected.prev.y)
      ) {
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
    selected.x += (event.clientX-selected.event.clientX)*scale;
    selected.y += (event.clientY-selected.event.clientY)*scale;
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
    viewBox.x -= (event.clientX-selected.event.clientX)*scale;
    viewBox.y -= (event.clientY-selected.event.clientY)*scale;
    selected.event = event;
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
  document.getElementById("movex").textContent = shoe.x.toFixed();
  document.getElementById("movey").textContent = shoe.y.toFixed();
  document.getElementById("rotate").textContent = 
    (shoe.rotate/5).toFixed()*5;

  // draw path lines
  var line = '';
  var person = shoe.node.parentNode.id;

  ['left', 'right'].forEach(function (foot) {
    var shoe = shoes[person][foot];
    if (shoe.x != shoe.prev.x || shoe.y != shoe.prev.y) {
      var segment = "M" + shoe.prev.x + ',' + shoe.prev.y + 
        "L" + shoe.x + ',' + shoe.y;
      if ('x1' in shoe.next && 'y2' in shoe.next) {
        segment = "M" + shoe.prev.x + ',' + shoe.prev.y + "C" + 
          shoe.next.x1 + ',' + shoe.next.y1 + ',' +
          shoe.next.x2 + ',' + shoe.next.y2 + ',' +
          shoe.x + ',' + shoe.y;
      }
      line += segment;
    }
  });

  path[person].setAttribute('d', line);

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

  if (base.prev && 'rotate' in base.prev) {
    if (movement.x == 0 || movement.y == 0) {
        // eliminate full spins
        while (base.rotate - base.prev.rotate > 180) base.rotate -= 360;
        while (base.prev.rotate - base.rotate > 180) base.rotate += 360;
    } else {
      var right = (movement.x > 0);
      var forward = (movement.y > 0);
      if (right == forward) {
        // ensure clockwise
        while (base.rotate > base.prev.rotate) base.rotate -= 360;
        while (base.rotate + 360 < base.prev.rotate) base.rotate += 360;
      } else {
        // ensure counter-clockwise
        while (base.rotate < base.prev.rotate) base.rotate += 360;
        while (base.rotate - 360 > base.prev.rotate) base.rotate -= 360;
      }
    }
  }

  draw(selected);
}

function turn(angle) {
  selected.rotate = 
    ((selected.rotate + angle)/angle).toFixed() * angle;
  delete selected.undoRotate;
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
  if (n==1) move = {x: shoes.gap.legs.x, y: -shoes.gap.legs.y, rotate: 0};
  if (n==2) move = {x: shoes.gap.legs.x + shoes.step.side, 
    y: -shoes.gap.legs.y, rotate: 0};
  if (n==3) move = {x: 45, y: -55, rotate: 20};
  if (n==4) move = {x: shoes.gap.legs.x, 
    y: -shoes.gap.legs.y-shoes.step.forward, rotate: 0};
  if (n==5) move = {x: -5, y: -105, rotate: 30};

  if (n==4 && event.altKey) move.y = -move.y;

  var originalSelection = selected;

  if (selected.undoRotate) {
    selected.rotate = selected.prev.rotate;
    delete selected.undoRotate;
  }

  var match = (selected.rotate != selected.prev.rotate);

  if (n == 3 || n == 5) {
    selected.undoRotate = !match;
    match = false;
  }

  var rmove = {x: -move.x, y: -move.y};
  if (n==3 || n==5) rmove.y = move.y;

  if (selected == shoes.follower.right) {
    selected.rotate = shoes.follower.left.prev.rotate + move.rotate;
    moveTo(shoes.follower.left, {x: move.x, y: move.y});

    if (!event.shiftKey) {
      select(shoes.leader.left);
      selected.rotate = shoes.leader.right.prev.rotate - move.rotate;
      moveTo(shoes.leader.right, {x: rmove.x, y: rmove.y});
    }

  } else if (selected == shoes.follower.left) {
    selected.rotate = shoes.follower.right.prev.rotate - move.rotate;
    moveTo(shoes.follower.right, {x: rmove.x, y: rmove.y});

    if (!event.shiftKey) {
      select(shoes.leader.right);
      selected.rotate = shoes.leader.left.prev.rotate + move.rotate;
      moveTo(shoes.leader.left, {x: move.x, y: move.y});
    }

  } else if (selected == shoes.leader.left) {
    if (!match) selected.rotate = shoes.leader.right.prev.rotate - move.rotate;
    moveTo(shoes.leader.right, {x: rmove.x, y: rmove.y});

    if (!event.shiftKey) {
      select(shoes.follower.right);
      if (match) {
        selected.rotate = shoes.leader.left.rotate + 180;
        moveTo({x: shoes.leader.left.x, y: shoes.leader.left.y,
          rotate: shoes.leader.left.rotate},
          shoes.gap.people);
      } else {
        selected.rotate = shoes.follower.left.prev.rotate + move.rotate;
        moveTo(shoes.follower.left, {x: move.x, y: move.y});
      }
    }

  } else if (selected == shoes.leader.right) {
    if (!match) selected.rotate = shoes.leader.left.prev.rotate + move.rotate;
    moveTo(shoes.leader.left, {x: move.x, y: move.y});

    if (!event.shiftKey) {
      select(shoes.follower.left);
      if (match) {
        selected.rotate = shoes.leader.right.rotate + 180;
        moveTo({x: shoes.leader.right.x, y: shoes.leader.right.y,
          rotate: shoes.leader.right.rotate},
          shoes.gap.people);
      } else {
        selected.rotate = shoes.follower.right.prev.rotate - move.rotate;
        moveTo(shoes.follower.right, {x: rmove.x, y: rmove.y});
      }
    }
  }

  select(originalSelection);
}

// copy support
document.addEventListener('copy', function(event) {
  if (newFigure) {
    event.clipboardData.setData('text/plain', JSON.stringify(newFigure.steps));
    event.preventDefault();
  }
});

window.addEventListener('keydown', function(event) {
  if (!newFigure && event.keyCode != 69) return;

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

  } else if (event.keyCode == 48) { // 0
    /* align with partner */
    var movement;
    var orientation;

    if (selected == shoes.follower.right) {
      movement = rotate(shoes.gap.people, shoes.leader.left.rotate);
      selected.x = shoes.leader.left.x + movement.x;
      selected.y = shoes.leader.left.y + movement.y;
      orientation = shoes.leader.left.rotate + 180;
    } else if (selected == shoes.follower.left) {
      movement = rotate(shoes.gap.people, shoes.leader.right.rotate);
      selected.x = shoes.leader.right.x + movement.x;
      selected.y = shoes.leader.right.y + movement.y;
      orientation = shoes.leader.right.rotate + 180;
    } else if (selected == shoes.leader.right) {
      movement = rotate(shoes.gap.people, shoes.follower.left.rotate);
      selected.x = shoes.follower.left.x + movement.x;
      selected.y = shoes.follower.left.y + movement.y;
      orientation = shoes.follower.left.rotate - 180;
    } else if (selected == shoes.leader.left) {
      movement = rotate(shoes.gap.people, shoes.follower.right.rotate);
      selected.x = shoes.follower.right.x + movement.x;
      selected.y = shoes.follower.right.y + movement.y;
      orientation = shoes.follower.right.rotate - 180;
    }

    while (orientation - selected.rotate > 180) orientation -= 360;
    while (selected.rotate - orientation > 180) orientation += 360;
    selected.rotate = orientation;

    draw(selected);

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

  } else if (event.keyCode == 69) { // e
    editmode();

  } else if (event.keyCode == 80) { // p
    if (paused) {
      play();
    } else {
      pause();
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

    // continue pattern
    var pattern = syllabus[dance].pattern || [{}];
    if (pattern) pattern = pattern[(newFigure.steps.length+1) % pattern.length];

    if (pattern.time) aside.input.duration.value = pattern.time;

    var text = aside.input.text.value;
    if (text) {
      step.text = text;
      aside.input.text.value = pattern.text || '';
    }

    var note = aside.input.note.value;
    if (note) {
      step.note = note;
      aside.input.note.value = pattern.note || '';
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
              {x: shoe.x - shoe.prev.x, y: shoe.y - shoe.prev.y}, 
              shoe.prev.rotate);
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
            while (shoe.rotate - shoe.prev.rotate > 360) shoe.rotate -= 360;
            while (shoe.prev.rotate - shoe.rotate > 360) shoe.rotate += 360;
            shoe.rotate = (shoe.rotate/5).toFixed()*5;
            step[person][foot].rotate = shoe.rotate - shoe.prev.rotate;
            shoe.prev.rotate = shoe.rotate;
          }
        }
        shoe.next = {x: shoe.x, y: shoe.y, rotate: shoe.rotate};
        delete shoe.undoRotate;
        draw(shoe);
      });
    });

    var figure = newFigure;
    if (!figure) {
      if (!aside.listItem) return;
      var index = aside.listItem.getAttribute('data-index');
      figure = syllabus[dance].figures[index];
    }

    if (!('step' in aside) || aside.step >= figure.steps.length) {
      figure.steps.push(step);
      delete aside.step;
    } else {
      figure.steps[aside.step] = step;
      if (aside.step + 1 == figure.steps.length) delete aside.step;
    }

    var resumePoint = routine[clock] ? routine[clock].step : null;
    compile();
    clock = routine.length;
    if (resumePoint) {
      for (clock=0; clock<routine.length; clock++) {
        if (routine[clock].step && routine[clock].step.count) {
          count = routine[clock].step.count;
        }

        if (routine[clock].step == resumePoint) break;
      }
    } else {
      count--;
    }

    aside.count.textContent = 'count: ' + count;

    hideNobs();
    selectNextFoot();
    selectNextFoot();

  } else {
    lastKey = event.keyCode;
  }
});

function dblclick(source, operation) {
  source.addEventListener('dblclick', function(event) {
    var input = document.createElement('input');
    input.classList.add('edit');
    input.value = event.target.textContent;
    while (event.target.firstChild) event.target.firstChild.remove();
    event.target.appendChild(input);
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);

    input.addEventListener('blur', operation);

    input.addEventListener('keydown', function(event) {
      if (event.keyCode == 13) {
        input.blur();
        event.stopPropagation();
      }
    });
  });
}

dblclick(document.getElementById('rotate'), function(event) {
  selected.rotate = parseFloat(event.target.value);
  var parent = event.target.parentNode;
  while (parent.firstChild) parent.firstChild.remove();
  draw(selected);
});

dblclick(document.getElementById('movex'), function(event) {
  selected.x = parseFloat(event.target.value);
  var parent = event.target.parentNode;
  while (parent.firstChild) parent.firstChild.remove();
  draw(selected);
});

dblclick(document.getElementById('movey'), function(event) {
  selected.y = parseFloat(event.target.value);
  var parent = event.target.parentNode;
  while (parent.firstChild) parent.firstChild.remove();
  draw(selected);
});

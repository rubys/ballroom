var dance = 'rumba';
var dances = [];
var syllabus = {};

fetch(null, 'index.json', function(result) {
  if (window.location.hash.match(/^#\w+$/)) {
    dance = window.location.hash.substr(1)
  } else {
    window.location.hash = '#' + dance;
  };

  dances = result;
  var select = document.getElementById('dance');
  dances.forEach(function(name) {
    var option = document.createElement('option');
    option.textContent = name;
    if (name.toLowerCase() == dance) {
      document.querySelector('aside h1').textContent = name;
      option.selected = true;
    }
    select.appendChild(option);
  });
  displayMenu();

  select.addEventListener('change', function(event) {
    document.querySelector('aside h1').textContent = event.target.value;
    dance = event.target.value.toLowerCase();
    window.location.hash = '#' + dance;

    var routine = document.getElementById('routine');
    while (routine.hasChildNodes()) routine.lastChild.remove();

    svg.removeAttribute('viewBox');

    displayMenu();
    document.getElementById('stepname').value = '';
  });
});

window.addEventListener('hashchange', function(event) {
  var select = document.getElementById('dance');
  dance = window.location.hash.substr(1).toLowerCase();
  dances.forEach(function(name) {
    if (name.toLowerCase() == dance) select.value = name
  });
  select.dispatchEvent(new Event('change', {target: {value: dance}}));
});

document.querySelector('aside h1').addEventListener('click', function() {
  document.getElementById('syllabus').style.display="block";
  document.getElementById('edit').style.display = "none";
  document.querySelector('#wall').style.display = "none";
});

function displayMenu() {
  fetch(dance, 'index.json', function(definition) {
    syllabus[dance] = definition;
    var figures = definition.figures;

    // compute gaps
    shoes = definition.initial;
    shoes.gap = {
      people: {
        x: (Math.abs(shoes.leader.right.x - shoes.follower.left.x) +
	    Math.abs(shoes.leader.left.x - shoes.follower.right.x))/2,
        y: (Math.abs(shoes.leader.right.y - shoes.follower.left.y) +
	    Math.abs(shoes.leader.left.y - shoes.follower.right.y))/2
      },
      legs: {
        x: (Math.abs(shoes.leader.right.x - shoes.leader.left.x) +
	    Math.abs(shoes.follower.left.x - shoes.follower.right.x))/2,
        y: (Math.abs(shoes.leader.right.y - shoes.leader.left.y) +
	    Math.abs(shoes.follower.left.y - shoes.follower.right.y))/2
      }
    };

    if (!shoes.rotate) shoes.rotate = 0;
    if (!shoes.step) shoes.step = {};
    if (!shoes.step.forward) shoes.step.forward = 100;
    if (!shoes.step.side) shoes.step.side = 100;

    // find syllabus table
    var tbody = document.getElementsByTagName('tbody')[0];
    if (!tbody) {
      var table = document.getElementsByTagName('table')[0];
      tbody = document.createElement('tbody');
      table.appendChild(tbody);
    }

    // update syllabus table
    while (tbody.hasChildNodes()) tbody.lastChild.remove();

    var section = '1';

    for (var i=0; i<figures.length; i++) {
      var tr = document.createElement('tr');
      tr.setAttribute('data-index', i);
      var td = document.createElement('td');
      td.textContent = figures[i].figure;
      tr.appendChild(td);
      td = document.createElement('td');
      td.textContent = figures[i].name;
      tr.appendChild(td);
      tbody.appendChild(tr);

      // updates settings - rotate
      var rotate = document.getElementById('settings.rotate');
      rotate.value = shoes.rotate;
      rotate.addEventListener('change', function(event) {
        if (clock == 0) {
          var newshoes = clone(shoes);
          newshoes.rotate = parseFloat(event.currentTarget.value);
          reset(newshoes);
        }
        event.currentTarget.blur();
      });

      // updates settings - step size forward
      var step = document.getElementById('settings.stepsize');
      step.value = shoes.step.forward;
      step.addEventListener('change', function(event) {
        shoes.step.forward = parseFloat(event.currentTarget.value);
        event.currentTarget.blur();
      });

      // updates settings - step size side
      var side = document.getElementById('settings.sidesize');
      side.value = shoes.step.side;
      side.addEventListener('change', function(event) {
        shoes.step.side = parseFloat(event.currentTarget.value);
        event.currentTarget.blur();
      });

      // add section breaks
      if (figures[i].figure[0] != section) {
        tr.classList.add('section-break');
        section = figures[i].figure[0];
      }

      if (figures[i].file) {
        // make row clickable
        tr.addEventListener('click', function(event) {
          // update routine
          var index = event.currentTarget.getAttribute('data-index');
          var li = document.createElement('li');
          li.setAttribute('data-index', index);
          var span = document.createElement('span');
          span.textContent = figures[index].name;
          li.appendChild(span);
          document.getElementById('routine').appendChild(li);

          // fetch steps
          if (!figures[index].steps) {
            li.classList.add('loading');
            fetch(dance, figures[index].file, function(steps) {
              li.classList.remove('loading');
              figures[index].steps = steps;
            });
          }

          // clear stepname
          document.getElementById('stepname').value = '';

          // clear routine
          clock = routine.length = 0;
        });
      } else {
        // mark row as unavailable
        tr.classList.add('unavailable');

        tr.addEventListener('click', function(event) {
          // prefill stepname
          var index = event.currentTarget.getAttribute('data-index');
          document.getElementById('stepname').value = figures[index].name;
        });
      }
    }
  });
};

function collectSteps() {
  var steps = [];

  var list = document.querySelectorAll("#routine li");
  for (var i=0; i<list.length; i++) {
    var index = list[i].getAttribute('data-index');

    // make a copy, and point each element to the original step
    var original = syllabus[dance].figures[index].steps;
    var figure = clone(original);
    for (var j=0; j<original.length; j++) figure[j].step = j;

    // reset count at the beginning of the figure
    if (figure.length && !('count' in figure[0])) figure[0].count = 1;

    // concatenate figure to steps
    var length = steps.length;
    steps.push.apply(steps, figure);

    // if figure not empty, point to listItem from the first and last entry
    if (steps.length != length) {
      steps[length].listItem = list[i];
      steps[steps.length-1].listItem = list[i];
    }
  }

  return steps;
}

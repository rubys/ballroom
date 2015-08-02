var dance = 'rumba';
var dances = [];
var syllabus = {};

fetch(null, 'index.json', function(result) {
  dances = result;
  var select = document.getElementById('dance');
  dances.forEach(function(name) {
    var option = document.createElement('option');
    option.textContent = name;
    if (name == dance) option.selected = true;
    select.appendChild(option);
  });
  displayMenu();

  select.addEventListener('change', function(event) {
    document.querySelector('aside h1').textContent = event.target.value;
    dance = event.target.value.toLowerCase();

    var routine = document.getElementById('routine');
    while (routine.hasChildNodes()) routine.lastChild.remove();

    displayMenu();
  });
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

    var tbody = document.getElementsByTagName('tbody')[0];
    if (!tbody) {
      var table = document.getElementsByTagName('table')[0];
      tbody = document.createElement('tbody');
      table.appendChild(tbody);
    }

    while (tbody.hasChildNodes()) tbody.lastChild.remove();

    var routine = document.getElementById('routine');
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

      if (figures[i].figure[0] != section) {
        tr.classList.add('section-break');
        section = figures[i].figure[0];
      }

      if (figures[i].file) {
        tr.addEventListener('click', function(event) {
          var index = event.currentTarget.getAttribute('data-index');
          var li = document.createElement('li');
          li.setAttribute('data-index', index);
          var span = document.createElement('span');
          span.textContent = figures[index].name;
          li.appendChild(span);
          routine.appendChild(li);
          if (!figures[index].steps) {
            fetch(dance, figures[index].file, function(steps) {
              figures[index].steps = steps;
            });
          }
        });
      } else {
        tr.classList.add('unavailable');
      }
    }
  });
};

function collectSteps() {
  var steps = [];

  var list = document.querySelectorAll("#routine li");
  for (var i=0; i<list.length; i++) {
    var index = list[i].getAttribute('data-index');
    var length = steps.length;
    steps.push.apply(steps, clone(syllabus[dance].figures[index].steps));
    if (steps.length != length) {
      steps[length].listItem = list[i];
      steps[steps.length-1].listItem = list[i];
    }
  }

  return steps;
}

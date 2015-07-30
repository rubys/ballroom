var syllabus = {};

fetch('rumba', 'index.json', function(menu) {
  syllabus.rumba = menu;

  var tbody = document.getElementsByTagName('tbody')[0];
  if (!tbody) {
    var table = document.getElementsByTagName('table')[0];
    tbody = document.createElement('tbody');
    table.appendChild(tbody);
  }

  var routine = document.getElementById('routine');

  for (var i=0; i<menu.length; i++) {
    var tr = document.createElement('tr');
    tr.setAttribute('data-index', i);
    var td = document.createElement('td');
    td.textContent = menu[i].figure;
    tr.appendChild(td);
    td = document.createElement('td');
    td.textContent = menu[i].name;
    tr.appendChild(td);
    tbody.appendChild(tr);

    var figure = menu[i].figure;

    tr.addEventListener('click', function(event) {
      var index = event.currentTarget.getAttribute('data-index');
      var li = document.createElement('li');
      li.setAttribute('data-index', index);
      var span = document.createElement('span');
      span.textContent = menu[index].name;
      li.appendChild(span);
      routine.appendChild(li);
      if (!menu[index].steps) {
        fetch('rumba', menu[index].file, function(steps) {
          menu[index].steps = steps;
        });
      }
    });
  }
});

function collectSteps() {
  var steps = [];

  var list = document.querySelectorAll("#routine li");
  for (var i=0; i<list.length; i++) {
    var index = list[i].getAttribute('data-index');
    var length = steps.length;
    steps.push.apply(steps, syllabus[dance][index].steps);
    if (steps.length != length) {
      steps[length].listItem = list[i];
      steps[steps.length-1].listItem = list[i];
    }
  }

  return steps;
}

document.getElementById('floor').style.display="none";

function fetch(dance, file, callback) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var data = xhr.response || JSON.parse(xhr.responseText);
      callback(data);
    }
  }

  xhr.open('GET', 'data/' + dance + '/' + file, true);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.responseType = 'json';
  xhr.send();
}

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
      li.textContent = menu[index].name;
      routine.appendChild(li);
      if (!menu[index].steps) {
        fetch('rumba', menu[index].file, function(steps) {
          menu[index].steps = steps;
        });
      }
    });
  }
});

document.getElementById('floor').style.display="none";

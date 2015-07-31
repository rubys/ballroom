function clone(object) {
  return JSON.parse(JSON.stringify(object));
}

function merge(destination, source) {
 for (var property in source) {
   if (source[property] instanceof HTMLElement) {
     destination[property] = source[property];
   } else if (typeof source[property] === "object") {
     destination[property] = destination[property] || {};
     merge(destination[property], source[property]);
   } else {
     destination[property] = source[property];
   }
 }
 return destination;
};

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

function post(url, data, callback) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      callback({status: xhr.status, text: xhr.responseText});
    }
  }

  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
  xhr.responseType = 'text';
  xhr.send(JSON.stringify(data));
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

var initial = {
  follower: {
    color: "#9B111E",

    right: {
      ball: 'down',
      heel: 'up',
      x: -30,
      y: -65,
      rotate: 180
    },

    left: {
      ball: 'down',
      heel: 'down',
      x: 50,
      y: -65,
      rotate: 180
    }
  },

  leader: {
    color: "#000",

    left: {
      ball: 'down',
      heel: 'up',
      x: -50,
      y: 65,
      rotate: 0
    },

    right: {
      ball: 'down',
      heel: 'down',
      x: 30,
      y: 65,
      rotate: 0
    }
  }
};

var steps = [{
  figure: 'Rumba Box',
  count: 1,
  time: 2,
  text: 'slow',
  note: 'leader left forward / follower right back',
  leader: {left: 'forward'},
  follower: {right: 'back'},
  delay: [{
    time: -0.25,
    leader: {left: {heel: 'down'}, right: {heel: 'up'}},
    follower: {right: {heel: 'down'}, left: {heel: 'up'}}
  }]
},{
  time: 1,
  text: 'quick ...',
  note: 'collect / side',
  leader: {right: {path: 'c0,90,10,100,100,100'}},
  follower: {left: {path: 'c0,-90,-10,-100-100,-100'}},
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {left: {heel: "down"}, right: {heel: "up"}}
  }]
}, {
  time: 1,
  text: '... quick',
  note: 'together',
  leader: {left: 'together'},
  follower: {right: 'together'},
  delay: [{
    time: -0.25,
    leader: {left: {heel: "down"}, right: {heel: "up"}},
    follower: {right: {heel: "down"}, left: {heel: "up"}}
  }]
}, {
  time: 2,
  text: 'slow',
  note: 'leader right back / follower left forward',
  leader: {right: 'back'},
  follower: {left: 'forward'},
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {right: {heel: "up"}, left: {heel: "down"}}
  }]
}, {
  time: 1,
  text: 'quick ...',
  note: 'collect / side',
  leader: {left: {path: 'c0,-90,-10,-100,-100,-100'}},
  follower: {right: {path: 'c0,90,10,100,100,100'}},
  delay: [{
    time: -0.25,
    leader: {left: {heel: "down"}, right: {heel: "up"}},
    follower: {right: {heel: "down"}, left: {heel: "up"}}
  }]
}, {
  time: 1,
  text: '... quick',
  note: 'together',
  leader: {right: 'together'},
  follower: {left: 'together'},
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {left: {heel: "down"}, right: {heel: "up"}}
  }]
}, {
  figure: 'Underarm turn',
  count: 1,
  time: 2,
  text: 'slow',
  note: 'half a box',
  leader: {left: 'forward'},
  follower: {right: 'back'},
  delay: [{
    time: -0.25,
    leader: {left: {heel: 'down'}, right: {heel: 'up'}},
    follower: {right: {heel: 'down'}, left: {heel: 'up'}}
  }]
},{
  time: 1,
  text: 'quick ...',
  leader: {right: {path: 'c0,90,10,100,100,100'}},
  follower: {left: {path: 'c0,-90,-10,-100-100,-100'}},
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {left: {heel: "down"}, right: {heel: "up"}}
  }]
}, {
  time: 1,
  text: '... quick',
  leader: {left: 'together'},
  follower: {right: 'together'},
  delay: [{
    time: -0.25,
    leader: {left: {heel: "down"}, right: {heel: "up"}},
    follower: {right: {heel: "down"}, left: {heel: "up"}}
  }]
}, {
  time: 2,
  text: 'slow',
  leader: {right: 'back'},
  follower: {left: 'forward'},
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {right: {heel: "up"}, left: {heel: "down"}}
  }]
},{
  time: 1,
  text: 'quick ...',
  note: 'leader raises left hand',
  leader: {left: {path: 'c0,-90,-10,-100,-100,-100'}},
  follower: {right: {path: 'l50,20', rotate: 90}, left: {rotate: 45}},
  delay: [{
    time: -0.25,
    leader: {left: {heel: "down"}},
    follower: {left: {heel: "up"}}
  }]
}, {
  time: 1,
  text: '... quick',
  note: 'follower passes under arms',
  leader: {right: 'together'},
  follower: {
    left: {
      position: {path: 'c106.066,106.066,141.421,141.421,282.843,0'},
      rotate: 180
    },
    right: {rotate: 90}
  },
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {left: {heel: "down"}}
  }]
}, {
  time: 2,
  text: 'slow',
  leader: {left: 'forward'},
  follower: {right: {path: 'l0,50', rotate: 90}},
  delay: [{
    time: -0.25,
    leader: {left: {heel: 'down'}, right: {heel: 'up'}},
    follower: {left: {heel: 'up'}}
  }]
},{
  time: 1,
  text: 'quick ...',
  note: 'follower completes the turn',
  leader: {right: {path: 'c0,90,10,100,100,100'}},
  follower: {left: {
    path: 'c35.355,106.066,141.421,141.421,212.132,70.711',
    rotate: 135
  }},
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {left: {heel: "down"}}
  }]
}, {
  time: 1,
  text: '... quick',
  leader: {left: 'together'},
  follower: {right: {path: 'l30,50', rotate: 90}},
  delay: [{
    time: -0.25,
    leader: {left: {heel: "down"}, right: {heel: "up"}},
    follower: {left: {heel: "up"}, right: {heel: "down"}}
  }]
}, {
  time: 2,
  text: 'slow',
  note: 'half a box',
  leader: {right: 'back'},
  follower: {left: 'forward'},
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {left: {heel: "down"}, right: {heel: "up"}}
  }]
},{
  time: 1,
  text: 'quick ...',
  leader: {left: {path: 'c0,-90,-10,-100,-100,-100'}},
  follower: {right: {path: 'c0,90,10,100,100,100'}},
  delay: [{
    time: -0.25,
    leader: {left: {heel: "down"}, right: {heel: "up"}},
    follower: {right: {heel: "down"}, left: {heel: "up"}}
  }]
}, {
  time: 1,
  text: '... quick',
  leader: {right: 'together'},
  follower: {left: 'together'},
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {left: {heel: "down"}, right: {heel: "up"}}
  }]
}, {
  figure: 'Quick Chasses',
  count: 1,
  time: 2,
  text: 'slow',
  note: 'half a box',
  leader: {left: 'forward'},
  follower: {right: 'back'},
  delay: [{
    time: -0.25,
    leader: {left: {heel: 'down'}, right: {heel: 'up'}},
    follower: {right: {heel: 'down'}, left: {heel: 'up'}}
  }]
},{
  time: 1,
  text: 'quick ...',
  leader: {right: {path: 'c0,90,10,100,100,100'}},
  follower: {left: {path: 'c0,-90,-10,-100-100,-100'}},
  note: 'side 1',
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {left: {heel: "down"}, right: {heel: "up"}}
  }]
}, {
  time: 1,
  text: '... quick',
  note: 'together 1',
  leader: {left: 'together'},
  follower: {right: 'together'},
  delay: [{
    time: -0.25,
    leader: {left: {heel: "down"}, right: {heel: "up"}},
    follower: {right: {heel: "down"}, left: {heel: "up"}}
  }]
}, {
  time: 1,
  text: 'quick ...',
  note: 'side 2',
  leader: {right: 'side'},
  follower: {left: 'side'},
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {left: {heel: "down"}, right: {heel: "up"}}
  }]
}, {
  time: 1,
  text: '... quick',
  note: 'together 2',
  leader: {left: 'together'},
  follower: {right: 'together'},
  delay: [{
    time: -0.25,
    leader: {left: {heel: "down"}, right: {heel: "up"}},
    follower: {right: {heel: "down"}, left: {heel: "up"}}
  }]
}, {
  time: 1,
  text: 'quick ...',
  note: 'side 3',
  leader: {right: 'side'},
  follower: {left: 'side'},
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {left: {heel: "down"}, right: {heel: "up"}}
  }]
}, {
  time: 1,
  text: '... quick',
  note: 'together 3',
  leader: {left: 'together'},
  follower: {right: 'together'},
  delay: [{
    time: -0.25,
    leader: {left: {heel: "down"}, right: {heel: "up"}},
    follower: {right: {heel: "down"}, left: {heel: "up"}}
  }]
}, {
  time: 2,
  text: 'slow',
  note: 'half a box',
  leader: {right: 'back'},
  follower: {left: 'forward'},
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {right: {heel: "up"}, left: {heel: "down"}}
  }]
},{
  time: 1,
  text: 'quick ...',
  note: 'side 1',
  leader: {left: {path: 'c0,-90,-10,-100,-100,-100'}},
  follower: {right: {path: 'c0,90,10,100,100,100'}},
  delay: [{
    time: -0.25,
    leader: {left: {heel: "down"}, right: {heel: "up"}},
    follower: {right: {heel: "down"}, left: {heel: "up"}}
  }]
}, {
  time: 1,
  text: '... quick',
  note: 'together 1',
  leader: {right: 'together'},
  follower: {left: 'together'},
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {left: {heel: "down"}, right: {heel: "up"}}
  }]
}, {
  time: 1,
  text: 'quick ...',
  note: 'side 2',
  leader: {left: 'side'},
  follower: {right: 'side'},
  delay: [{
    time: -0.25,
    leader: {left: {heel: "down"}, right: {heel: "up"}},
    follower: {right: {heel: "down"}, left: {heel: "up"}}
  }]
}, {
  time: 1,
  text: '... quick',
  note: 'together 2',
  leader: {right: 'together'},
  follower: {left: 'together'},
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {left: {heel: "down"}, right: {heel: "up"}}
  }]
}, {
  time: 1,
  text: 'quick ...',
  note: 'side 3',
  leader: {left: 'side'},
  follower: {right: 'side'},
  delay: [{
    time: -0.25,
    leader: {left: {heel: "down"}, right: {heel: "up"}},
    follower: {right: {heel: "down"}, left: {heel: "up"}}
  }]
}, {
  time: 1,
  text: '... quick',
  note: 'together 3',
  leader: {right: 'together'},
  follower: {left: 'together'},
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {left: {heel: "down"}, right: {heel: "up"}}
  }]
}, {
  figure: 'Cross Lead Box',
  count: 1,
  time: 2,
  text: 'slow',
  note: 'half a box',
  leader: {left: 'forward'},
  follower: {right: 'back'},
  image: 'images/rumba/1d-cross-body-lead/pictures1104.png',
  delay: [{
    time: -0.25,
    leader: {left: {heel: 'down'}, right: {heel: 'up'}},
    follower: {right: {heel: 'down'}, left: {heel: 'up'}}
  }]
},{
  time: 1,
  text: 'quick ...',
  leader: {right: {path: 'c0,90,10,100,100,100'}},
  follower: {left: {path: 'c0,-90,-10,-100-100,-100'}},
  image: 'images/rumba/1d-cross-body-lead/pictures1122.png',
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {left: {heel: "down"}, right: {heel: "up"}}
  }]
}, {
  time: 1,
  text: '... quick',
  leader: {left: 'together'},
  follower: {right: 'together'},
  image: 'images/rumba/1d-cross-body-lead/pictures1144.png',
  delay: [{
    time: -0.25,
    leader: {left: {heel: "down"}, right: {heel: "up"}},
    follower: {right: {heel: "down"}, left: {heel: "up"}}
  }]
}, {
  time: 2,
  text: 'slow',
  note: 'leader rotates on step back',
  leader: {right: {path: 'l20,-80', rotate: -45}},
  follower: {left: {path: 'l20,80'}},
  image: 'images/rumba/1d-cross-body-lead/pictures1161.png',
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {right: {heel: "up"}, left: {heel: "down"}}
  }]
},{
  time: 1,
  text: 'quick ...',
  note: 'leader steps to the side',
  leader: {left: {path: 'c0,-100,0,-200,100,-200', rotate: -135}},
  follower: {right: {path: 'l80,200'}},
  image: 'images/rumba/1d-cross-body-lead/pictures1175.png',
  delay: [{
    time: -0.25,
    leader: {left: {heel: "down"}, right: {heel: "up"}},
    follower: {right: {heel: "down"}, left: {heel: "up"}}
  }]
}, {
  time: 1,
  text: '... quick',
  note: 'follower passes in front',
  leader: {right: {path: 'l-70.004,-19.092', rotate: -90}},
  follower: {left: {path: 'l130,260'}},
  image: 'images/rumba/1d-cross-body-lead/pictures1200.png',
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {right: {heel: "up"}}
  }]
}, {
  time: 2,
  text: 'slow',
  note: 'follower spirals',
  leader: {left: {path: 'l-46.669,46.669', rotate: -45}},
  follower: {right: {path: 'c250,100,0,320,-120,320', rotate: -180},
    left: {rotate: -180}},
  image: 'images/rumba/1d-cross-body-lead/pictures1214.png',
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {right: {heel: "down"}}
  }]
}, {
  time: 1,
  text: 'quick ...',
  note: 'side',
  leader: {right: {path: 'l0.707,174.655', rotate: -45}},
  follower: {left: {path: 'l-40,-180'}},
  image: 'images/rumba/1d-cross-body-lead/pictures1234.png',
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {left: {heel: "down"}, right: {heel: "up"}}
  }]
}, {
  time: 1,
  text: '... quick',
  note: 'together',
  leader: {left: {path: 'h80'}},
  follower: {right: {path: 'h-70'}},
  image: 'images/rumba/1d-cross-body-lead/pictures1256.png',
  delay: [{
    time: -0.25,
    leader: {left: {heel: "down"}, right: {heel: "up"}},
    follower: {right: {heel: "down"}, left: {heel: "up"}}
  }]
}, {
  time: 2,
  text: 'slow',
  note: 'half a box',
  leader: {right: 'back'},
  follower: {left: 'forward'},
  image: 'images/rumba/1d-cross-body-lead/pictures1266.png',
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {right: {heel: "up"}, left: {heel: "down"}}
  }]
},{
  time: 1,
  text: 'quick ...',
  leader: {left: {path: 'c0,-90,-10,-100,-100,-100'}},
  follower: {right: {path: 'c0,90,10,100,100,100'}},
  image: 'images/rumba/1d-cross-body-lead/pictures1287.png',
  delay: [{
    time: -0.25,
    leader: {left: {heel: "down"}, right: {heel: "up"}},
    follower: {right: {heel: "down"}, left: {heel: "up"}}
  }]
}, {
  time: 1,
  text: '... quick',
  leader: {right: 'together'},
  follower: {left: 'together'},
  image: 'images/rumba/1d-cross-body-lead/pictures1309.png',
  delay: [{
    time: -0.25,
    leader: {right: {heel: "down"}, left: {heel: "up"}},
    follower: {left: {heel: "down"}, right: {heel: "up"}},
    image: 'images/rumba/1d-cross-body-lead/pictures1346.png'
  }]
}];

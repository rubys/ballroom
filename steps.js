var initial = {
  follower: {
    color: "#9B111E",

    right: {
      x: 607,
      y: 304,
      rotate: 180
    },

    left: {
      x: 677,
      y: 304,
      rotate: 180
    }
  },

  leader: {
    color: "#000",

    left: {
      x: 587,
      y: 434,
      rotate: 0
    },

    right: {
      x: 657,
      y: 434,
      rotate: 0
    }
  }
};

var steps = [{
  count: 1,
  time: 2,
  text: 'slow',
  leader: {left: 'forward'},
  follower: {right: 'back'}
}, {
  time: -0.25,
  leader: {left: {heel: 'down'}, right: {heel: 'up'}},
  follower: {right: {heel: 'down'}, left: {heel: 'up'}}
},{
  time: 1,
  text: 'quick ...',
  leader: {right: {path: 'c0,-90,10,-100,100-100'}},
  follower: {left: {path: 'c0,90,-10,100-100,100'}}
}, {
  time: -0.25,
  leader: {right: {heel: "down"}, left: {heel: "up"}},
  follower: {left: {heel: "down"}, right: {heel: "up"}}
}, {
  time: 1,
  text: '... quick',
  leader: {left: {path: 'h100'}},
  follower: {right: {path: 'h-100'}}
}, {
  time: -0.25,
  leader: {left: {heel: "down"}, right: {heel: "up"}},
  follower: {right: {heel: "down"}, left: {heel: "up"}}
}, {
  time: 2,
  text: 'slow',
  leader: {right: 'back'},
  follower: {left: 'forward'}
}, {
  time: -0.25,
  leader: {right: {heel: "down"}, left: {heel: "up"}},
  follower: {right: {heel: "up"}, left: {heel: "down"}}
},{
  time: 1,
  text: 'quick ...',
  note: 'leader raises left hand',
  leader: {left: {path: 'c0,90,-10,100,-100,100'}},
  follower: {right: {path: 'l50-20', rotate: 90}, left: {rotate: 45}}
}, {
  time: -0.25,
  leader: {left: {heel: "down"}},
  follower: {left: {heel: "up"}}
}, {
  time: 1,
  text: '... quick',
  note: 'follower passes under arms',
  leader: {right: {path: 'h-100'}},
  follower: {
    left: {
      position: {path: 'c106.066,-106.066,141.421,-141.421,282.843,0.0'},
      rotate: 135
    },
    right: {rotate: 90}
  }
}, {
  time: -0.25,
  leader: {right: {heel: "down"}, left: {heel: "up"}},
  follower: {left: {heel: "down"}}
}, {
  time: 2,
  text: 'slow',
  leader: {left: 'forward'},
  follower: {right: {path: 'l0-50', rotate: 180}}
}, {
  time: -0.25,
  leader: {left: {heel: 'down'}, right: {heel: 'up'}},
  follower: {left: {heel: 'up'}}
},{
  time: 1,
  text: 'quick ...',
  leader: {right: {path: 'c0,-90,10,-100,100-100'}},
  follower: {left: {
    path: 'c100.0,-50.0,200.0,0.0,200.0,100.0',
    rotate: 180
  }}
}, {
  time: -0.25,
  leader: {right: {heel: "down"}, left: {heel: "up"}},
  follower: {left: {heel: "down"}}
}, {
  time: 1,
  text: '... quick',
  leader: {left: {path: 'h100'}},
  follower: {right: {path: 'l-50-30'}}
}, {
  time: -0.25,
  leader: {left: {heel: "down"}, right: {heel: "up"}},
  follower: {left: {heel: "up"}, right: {heel: "down"}}
}, {
  time: 2,
  text: 'slow',
  leader: {right: 'back'},
  follower: {left: 'forward'}
}, {
  time: -0.25,
  leader: {right: {heel: "down"}, left: {heel: "up"}},
  follower: {left: {heel: "down"}, right: {heel: "up"}}
},{
  time: 1,
  text: 'quick ...',
  leader: {left: {path: 'c0,90,-10,100,-100,100'}},
  follower: {right: {path: 'c0-90,10-100,100-100'}}
}, {
  time: -0.25,
  leader: {left: {heel: "down"}, right: {heel: "up"}},
  follower: {right: {heel: "down"}, left: {heel: "up"}}
}, {
  time: 1,
  text: '... quick',
  leader: {right: {path: 'h-100'}},
  follower: {left: {path: 'h100'}}
}, {
  time: -0.25,
  leader: {right: {heel: "down"}, left: {heel: "up"}},
  follower: {left: {heel: "down"}, right: {heel: "up"}}
}];

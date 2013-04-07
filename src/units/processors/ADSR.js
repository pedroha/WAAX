/**
 * @class ADSR
 */
WX.ADSR = function(json) {
  WX.Unit.Processor.call(this);
  this.label += "ADSR";
  Object.defineProperties(this, {
    _a: {
      writable: true,
      value: 0.005
    },
    _d: {
      writable: true,
      value: 0.015
    },
    _s: {
      writable: true,
      value: 0.35
    },
    _r: {
      writable: true,
      value: 0.015
    },
    _running: {
      writable: true,
      value: false
    },
    _defaults: {
      value: {
        a: 0.015,
        d: 0.015,
        s: 0.3,
        r: 0.05,
        gain: 0.0
      }
    }
  });
  this._inputGain.connect(this._outputGain);
  this.params = this._defaults;
  if (typeof json === "object") {
    this.params = json;
  }
};

WX.ADSR.prototype = Object.create(WX.Unit.Processor.prototype, {
  a: {
    enumerable: true,
    get: function() {
      return this._a;
    },
    set: function(value) {
      this._a = value;
    }
  },
  d: {
    enumerable: true,
    get: function() {
      return this._d;
    },
    set: function(value) {
      this._d = value;
    }
  },
  s: {
    enumerable: true,
    get: function() {
      return this._s;
    },
    set: function(value) {
      this._s = value;
    }
  },
  r: {
    enumerable: true,
    get: function() {
      return this._r;
    },
    set: function(value) {
      this._r = value;
    }
  },
  running: {
    enumerable: true,
    get: function() {
      return this._running;
    },
    set: function() {
      return;
    }
  },
  noteOn: {
    value: function(time) {
      var t = (time || WX.now),
          g = this._inputGain.gain;
      // cancel previous state
      g.cancelScheduledValues(t);
      g.setValueAtTime(g.value, t);
      g.linearRampToValueAtTime(0.0, t);
      // schedule event for attack, decay and sustain
      g.linearRampToValueAtTime(1.0, t + this._a);
      g.linearRampToValueAtTime(this._s, t + this._a + this._d);
      this._running = true;
    }
  },
  noteOff: {
    value: function(time) {
      var t = (time || WX.now),
          g = this._inputGain.gain;
      // cancel progress and force it into release phase
      g.cancelScheduledValues(t);
      g.setValueAtTime(g.value, t);
      // start release phase
      g.linearRampToValueAtTime(0.0, t + this._r);
      this._running = false;
    }
  }
});
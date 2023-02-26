// Dummy lambda function to test the deployment

var s = Object.defineProperty;
var a = Object.getOwnPropertyDescriptor;
var r = Object.getOwnPropertyNames;
var i = Object.prototype.hasOwnProperty;
var y = (e, t) => {
    for (var o in t) s(e, o, { get: t[o], enumerable: !0 });
  },
  u = (e, t, o, l) => {
    if ((t && typeof t == "object") || typeof t == "function")
      for (let n of r(t))
        !i.call(e, n) &&
          n !== o &&
          s(e, n, {
            get: () => t[n],
            enumerable: !(l = a(t, n)) || l.enumerable,
          });
    return e;
  };
var P = (e) => u(s({}, "__esModule", { value: !0 }), e);
var f = {};
y(f, { handler: () => c });
module.exports = P(f);
var c = async function (t, o) {
  return (
    console.log(`Event: ${JSON.stringify(t, null, 2)}`),
    console.log(`Context: ${JSON.stringify(o, null, 2)}`),
    { statusCode: 200, body: JSON.stringify({ message: "Hello from lambda!" }) }
  );
};
0 && (module.exports = { handler });

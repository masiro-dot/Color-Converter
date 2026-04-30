let colorDB = [];

fetch('./colors.json')
  .then(res => res.json())
  .then(data => {
    colorDB = data;
  });

function hexToRgb(hex) {
  hex = hex.replace('#','');
  return [
    parseInt(hex.substring(0,2),16),
    parseInt(hex.substring(2,4),16),
    parseInt(hex.substring(4,6),16)
  ];
}

function distance(a, b) {
  return Math.sqrt(
    (a[0]-b[0])**2 +
    (a[1]-b[1])**2 +
    (a[2]-b[2])**2
  );
}

function findNearest(rgb) {
  return colorDB.reduce((best, c) => {
    const d = distance(rgb, c.rgb);
    return d < best.d ? { color: c, d } : best;
  }, { color: null, d: Infinity }).color;
}

function convertColor() {
  const hex = document.getElementById("hex").value;
  const rgb = hexToRgb(hex);

  const result = findNearest(rgb);

  document.getElementById("result").innerHTML = `
    <b>RGB:</b> ${rgb}<br>
    <b>HEX:</b> ${hex}<br>
    <b>マンセル:</b> ${result.munsell}<br>
    <b>日本塗料:</b> ${result.jp}
  `;
}

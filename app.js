let colorDB = [];

// ==============================
// データ読み込み
// ==============================
fetch('./colors.json')
  .then(res => {
    if (!res.ok) throw new Error("colors.json が見つかりません");
    return res.json();
  })
  .then(data => {
    colorDB = data;
    console.log("✅ colorDB loaded:", colorDB.length);
  })
  .catch(err => {
    console.error("❌ JSON読み込みエラー:", err);
  });


// ==============================
// HEX → RGB
// ==============================
function hexToRgb(hex) {
  if (!hex) return null;

  hex = hex.replace('#','').trim();

  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }

  if (hex.length !== 6) return null;

  return [
    parseInt(hex.substring(0,2),16),
    parseInt(hex.substring(2,4),16),
    parseInt(hex.substring(4,6),16)
  ];
}


// ==============================
// 距離
// ==============================
function distance(a, b) {
  return (
    0.3 * (a[0]-b[0])**2 +
    0.59 * (a[1]-b[1])**2 +
    0.11 * (a[2]-b[2])**2
  );
}


// ==============================
// 近似検索（HEX用）
// ==============================
function findNearest(rgb) {
  let best = null;
  let minDist = Infinity;

  for (let c of colorDB) {
    const d = distance(rgb, c.rgb);
    if (d < minDist) {
      minDist = d;
      best = c;
    }
  }

  return best;
}


// ==============================
// HEX → 変換
// ==============================
function convertFromHex() {
  const hex = document.getElementById("hex").value;
  const rgb = hexToRgb(hex);

  if (!rgb) {
    alert("HEXが不正です");
    return;
  }

  const result = findNearest(rgb);
  showResult(result, hex);
}


// ==============================
// 日塗工 → 変換（完全一致）
// ==============================
function convertFromJP() {
  const jp = document.getElementById("jp").value.trim();

  const result = colorDB.find(c => c.jp === jp);

  if (!result) {
    alert("該当する色がありません");
    return;
  }

  showResult(result);
}


// ==============================
// マンセル → 変換（完全一致）
// ==============================
function convertFromMunsell() {
  const m = document.getElementById("munsell").value.trim();

  const result = colorDB.find(c => c.munsell === m);

  if (!result) {
    alert("該当する色がありません");
    return;
  }

  showResult(result);
}


// ==============================
// 表示
// ==============================
function showResult(result, inputHex = null) {

  if (!result) {
    alert("データ未ロード");
    return;
  }

  const hex = inputHex || result.hex;

  document.getElementById("result").innerHTML = `
    <div style="padding:10px; border:1px solid #ccc;">
      <div style="width:50px; height:50px; background:${hex}; margin-bottom:10px;"></div>
      <b>HEX:</b> ${hex}<br>
      <b>RGB:</b> ${result.rgb.join(", ")}<br>
      <b>マンセル値:</b> ${result.munsell}<br>
      <b>日塗工:</b> ${result.jp}
    </div>
  `;
}

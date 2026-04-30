let colorDB = [];

// ==============================
// データ読み込み（重要）
// ==============================
fetch('./colors.json')
  .then(res => {
    if (!res.ok) {
      throw new Error("colors.json が見つかりません");
    }
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
// HEX → RGB（3桁対応）
// ==============================
function hexToRgb(hex) {
  if (!hex) return null;

  hex = hex.replace('#','').trim();

  // 3桁対応 (#fff)
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
// RGB距離（視覚補正版）
// ==============================
function distance(a, b) {
  return (
    0.3 * (a[0]-b[0])**2 +
    0.59 * (a[1]-b[1])**2 +
    0.11 * (a[2]-b[2])**2
  );
}


// ==============================
// 最も近い色を探す
// ==============================
function findNearest(rgb) {

  if (!rgb || colorDB.length === 0) {
    console.warn("⚠️ データ未ロード or RGB不正");
    return null;
  }

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
// メイン処理（ボタン用）
// ==============================
function convertColor() {

  const hexInput = document.getElementById("hex").value;
  const rgb = hexToRgb(hexInput);

  if (!rgb) {
    alert("HEXの形式が正しくありません（例: #C87850）");
    return;
  }

  const result = findNearest(rgb);

  if (!result) {
    alert("データが読み込まれていません");
    return;
  }

  // 表示
  document.getElementById("result").innerHTML = `
    <div style="padding:10px; border:1px solid #ccc;">
      <div style="width:50px; height:50px; background:${hexInput}; margin-bottom:10px;"></div>
      <b>HEX:</b> ${hexInput}<br>
      <b>RGB:</b> ${rgb.join(", ")}<br>
      <b>マンセル:</b> ${result.munsell}<br>
      <b>日本塗料:</b> ${result.jp}
    </div>
  `;
}

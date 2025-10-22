import React, { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { feature } from "topojson-client";
import { scaleSequential } from "d3-scale";
import { interpolateTurbo } from "d3-scale-chromatic";
import worldTopo from "world-atlas/countries-110m.json";

// 生育率数据
const DATA_2022: Record<string, { name: string; rate: number; region: string }> = {
  // 数据保持不变...
  NGA: { name: "奈及利亞", rate: 4.52, region: "非洲" },
  AGO: { name: "安哥拉", rate: 5.70, region: "非洲" },
  COD: { name: "剛果（金）", rate: 5.49, region: "非洲" },
  MLI: { name: "馬里", rate: 5.35, region: "非洲" },
  BEN: { name: "貝寧", rate: 5.34, region: "非洲" },
  TCD: { name: "查德", rate: 5.24, region: "非洲" },
  UGA: { name: "烏干達", rate: 5.17, region: "非洲" },
  SOM: { name: "索馬利亞", rate: 5.12, region: "非洲" },
  SSD: { name: "南蘇丹", rate: 5.09, region: "非洲" },
  BDI: { name: "蒲隆地", rate: 4.90, region: "非洲" },
  GIN: { name: "幾內亞", rate: 4.78, region: "非洲" },
  MOZ: { name: "莫三比克", rate: 4.66, region: "非洲" },
  GNB: { name: "幾內亞比索", rate: 4.62, region: "非洲" },
  SDN: { name: "蘇丹", rate: 4.47, region: "非洲" },
  CMR: { name: "喀麥隆", rate: 4.44, region: "非洲" },
  AFG: { name: "阿富汗", rate: 4.43, region: "亞洲" },
  ZMB: { name: "尚比亞", rate: 4.42, region: "非洲" },
  TZA: { name: "坦尚尼亞", rate: 4.27, region: "非洲" },
  TGO: { name: "多哥", rate: 4.13, region: "非洲" },
  GNQ: { name: "赤道幾內亞", rate: 4.12, region: "非洲" },
  SEN: { name: "塞內加爾", rate: 4.06, region: "非洲" },
  BFA: { name: "布吉納法索", rate: 4.02, region: "非洲" },
  TLS: { name: "東帝汶", rate: 3.98, region: "亞洲" },
  CAF: { name: "中非共和國", rate: 3.94, region: "非洲" },
  LBR: { name: "賴比瑞亞", rate: 3.93, region: "非洲" },
  ETH: { name: "衣索比亞", rate: 3.84, region: "非洲" },
  PNG: { name: "巴布亞紐幾內亞", rate: 3.79, region: "大洋洲" },
  COG: { name: "剛果（布）", rate: 3.79, region: "非洲" },
  SLE: { name: "獅子山", rate: 3.61, region: "非洲" },
  TJK: { name: "塔吉克", rate: 3.56, region: "亞洲" },
  GHA: { name: "加納", rate: 3.56, region: "非洲" },
  GMB: { name: "甘比亞", rate: 3.52, region: "非洲" },
  PSE: { name: "巴勒斯坦", rate: 3.49, region: "亞洲" },
  MDG: { name: "馬達加斯加", rate: 3.47, region: "非洲" },
  ZWE: { name: "辛巴威", rate: 3.47, region: "非洲" },
  ERI: { name: "厄利垂亞", rate: 3.43, region: "非洲" },
  MRT: { name: "茅利塔尼亞", rate: 3.40, region: "非洲" },
  CIV: { name: "象牙海岸", rate: 3.40, region: "非洲" },
  PAK: { name: "巴基斯坦", rate: 3.32, region: "亞洲" },
  STP: { name: "聖多美普林西比", rate: 3.31, region: "非洲" },
  GAB: { name: "加彭", rate: 3.21, region: "非洲" },
  MWI: { name: "馬拉威", rate: 3.19, region: "非洲" },
  KEN: { name: "肯亞", rate: 3.16, region: "非洲" },
  RWA: { name: "盧安達", rate: 3.14, region: "非洲" },
  IRQ: { name: "伊拉克", rate: 3.10, region: "亞洲" },
  LBY: { name: "利比亞", rate: 3.00, region: "非洲" },
  DZA: { name: "阿爾及利亞", rate: 2.94, region: "非洲" },
  ISR: { name: "以色列", rate: 2.92, region: "亞洲" },
  NAM: { name: "納米比亞", rate: 2.89, region: "非洲" },
  JOR: { name: "約旦", rate: 2.87, region: "亞洲" },
  LSO: { name: "賴索托", rate: 2.85, region: "非洲" },
  YEM: { name: "葉門", rate: 2.82, region: "亞洲" },
  PHL: { name: "菲律賓", rate: 2.75, region: "亞洲" },
  SYR: { name: "敘利亞", rate: 2.69, region: "亞洲" },
  EGY: { name: "埃及", rate: 2.65, region: "非洲" },
  OMN: { name: "阿曼", rate: 2.64, region: "亞洲" },
  KAZ: { name: "哈薩克斯坦", rate: 2.58, region: "亞洲" },
  VUT: { name: "萬那杜", rate: 2.53, region: "大洋洲" },
  GTM: { name: "瓜地馬拉", rate: 2.52, region: "美洲" },
  KGZ: { name: "吉爾吉斯斯坦", rate: 2.45, region: "亞洲" },
  HTI: { name: "海地", rate: 2.44, region: "美洲" },
  SWZ: { name: "史瓦帝尼", rate: 2.37, region: "非洲" },
  PAN: { name: "巴拿馬", rate: 2.35, region: "美洲" },
  BWA: { name: "波札那", rate: 2.34, region: "非洲" },
  HND: { name: "宏都拉斯", rate: 2.33, region: "美洲" },
  ZAF: { name: "南非", rate: 2.27, region: "非洲" },
  MAR: { name: "摩洛哥", rate: 2.25, region: "非洲" },
  LAO: { name: "寮國", rate: 2.24, region: "亞洲" },
  KWT: { name: "科威特", rate: 2.21, region: "亞洲" },
  ECU: { name: "厄瓜多", rate: 2.21, region: "美洲" },
  FJI: { name: "斐濟", rate: 2.21, region: "大洋洲" },
  BOL: { name: "玻利維亞", rate: 2.20, region: "美洲" },
  VEN: { name: "委內瑞拉", rate: 2.18, region: "美洲" },
  KHM: { name: "柬埔寨", rate: 2.17, region: "亞洲" },
  ARG: { name: "阿根廷", rate: 2.15, region: "美洲" },
  PER: { name: "秘魯", rate: 2.15, region: "美洲" },
  SLV: { name: "薩爾瓦多", rate: 2.02, region: "美洲" },
  MMR: { name: "緬甸", rate: 1.97, region: "亞洲" },
  IDN: { name: "印尼", rate: 1.96, region: "亞洲" },
  GEO: { name: "喬治亞", rate: 1.95, region: "歐亞" },
  IRN: { name: "伊朗", rate: 1.91, region: "亞洲" },
  TUR: { name: "土耳其", rate: 1.90, region: "亞洲" },
  QAT: { name: "卡達", rate: 1.90, region: "亞洲" },
  FRA: { name: "法國", rate: 1.90, region: "歐洲" },
  SAU: { name: "沙烏地阿拉伯", rate: 1.87, region: "亞洲" },
  NZL: { name: "紐西蘭", rate: 1.85, region: "大洋洲" },
  NPL: { name: "尼泊爾", rate: 1.85, region: "亞洲" },
  USA: { name: "美國", rate: 1.84, region: "美洲" },
  PRK: { name: "朝鮮", rate: 1.81, region: "亞洲" },
  MYS: { name: "馬來西亞", rate: 1.73, region: "亞洲" },
  AUS: { name: "澳洲", rate: 1.73, region: "大洋洲" },
  SGP: { name: "新加坡", rate: 1.17, region: "亞洲" },
  KOR: { name: "韓國", rate: 1.12, region: "亞洲" },
  CHN: { name: "中國（含台灣、香港、澳門）", rate: 1.55, region: "亞洲" },
  CAN: { name: "加拿大", rate: 1.26, region: "美洲" },
  RUS: { name: "俄罗斯", rate: 1.41, region: "歐洲" },
  GRL: { name: "格陵兰", rate: 1.77, region: "" },
  BRA: { name: "巴西", rate: 1.62, region: "美洲" },
  JPN: { name: "日本", rate: 1.20, region: "亞洲" },
};

// ISO_N3(數字) → ISO3(字母)映射
const ISO3_MAP: Record<string, string> = {
  "004": "AFG", "008": "ALB", "012": "DZA", "020": "AND", "024": "AGO", "032": "ARG", "036": "AUS",
  "040": "AUT", "051": "ARM", "056": "BEL", "068": "BOL", "076": "BRA", "084": "BLZ", "090": "SLB",
  "100": "BGR", "104": "MMR", "108": "BDI", "112": "BLR", "116": "KHM", "120": "CMR", "124": "CAN",
  "148": "TCD", "152": "CHL", "156": "CHN", "158": "CHN", "170": "COL", "178": "COG", "180": "COD",
  "188": "CRI", "196": "CYP", "203": "CZE", "204": "BEN", "208": "DNK", "214": "DOM", "218": "ECU",
  "222": "SLV", "233": "EST", "246": "FIN", "250": "FRA", "260": "ATF", "268": "GEO", "270": "GMB",
  "276": "DEU", "288": "GHA", "300": "GRC", "304": "GRL", "320": "GTM", "324": "GIN", "328": "GUY",
  "332": "HTI", "340": "HND", "344": "HKG", "348": "HUN", "352": "ISL", "360": "IDN", "364": "IRN",
  "368": "IRQ", "372": "IRL", "376": "ISR", "380": "ITA", "384": "CIV", "398": "KAZ", "400": "JOR",
  "404": "KEN", "408": "PRK", "410": "KOR", "414": "KWT", "417": "KGZ", "418": "LAO", "422": "LBN",
  "428": "LVA", "430": "LBR", "434": "LBY", "440": "LTU", "442": "LUX", "450": "MDG", "454": "MWI",
  "458": "MYS", "466": "MLI", "478": "MRT", "480": "MUS", "484": "MEX", "496": "MNG", "504": "MAR",
  "508": "MOZ", "512": "OMN", "516": "NAM", "524": "NPL", "528": "NLD", "540": "NCL", "548": "VUT",
  "554": "NZL", "566": "NGA", "578": "NOR", "586": "PAK", "598": "PNG", "600": "PRY", "604": "PER",
  "608": "PHL", "620": "PRT", "626": "TLS", "634": "QAT", "642": "ROU", "643": "RUS", "646": "RWA",
  "662": "LCA", "682": "SAU", "686": "SEN", "694": "SLE", "702": "SGP", "704": "VNM", "705": "SVN",
  "710": "ZAF", "716": "ZWE", "724": "ESP", "728": "SSD", "732": "ESH", "736": "SDN", "740": "SUR",
  "748": "SWZ", "752": "SWE", "756": "CHE", "760": "SYR", "762": "TJK", "764": "THA", "768": "TGO",
  "780": "TTO", "784": "ARE", "788": "TUN", "792": "TUR", "804": "UKR", "818": "EGY", "826": "GBR",
  "840": "USA", "854": "BFA", "858": "URY", "862": "VEN", "887": "YEM", "894": "ZMB", "392": "JPN"
};

export default function WorldBirthRateDashboard() {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedCountry, setSelectedCountry] = useState<{name: string; rate: number; region: string} | null>(null);

  // 处理地理数据
  const featureCollection = useMemo(
    () => feature(worldTopo as any, (worldTopo as any).objects.countries),
    []
  );

  // 颜色比例尺和图例渐变
  const colorScale = useMemo(() => scaleSequential(interpolateTurbo).domain([6.7, 1.0]), []);
  const legendGradient = useMemo(
    () =>
      `linear-gradient(to right, ${scaleSequential(interpolateTurbo)
        .domain([1.0, 6.7])(1.0)}, ${scaleSequential(interpolateTurbo)
        .domain([1.0, 6.7])(6.7)})`,
    []
  );

  // 处理鼠标移动
  const handleMouseMove = (e: React.MouseEvent) => {
    let x = e.pageX + 15;
    let y = e.pageY + 15;

    // 防止 tooltip 出界
    const maxX = window.innerWidth - 160;
    const maxY = window.innerHeight - 60;
    if (x > maxX) x = maxX;
    if (y > maxY) y = maxY;

    setMousePos({ x, y });
  };

  // 获取统计信息
  const getStats = () => {
    const rates = Object.values(DATA_2022).map(d => d.rate);
    const maxRate = Math.max(...rates);
    const maxCountry = Object.values(DATA_2022).find(d => d.rate === maxRate);
    
    const minRate = Math.min(...rates);
    const minCountry = Object.values(DATA_2022).find(d => d.rate === minRate);
    
    const avgRate = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
    
    return { maxRate, maxCountry, minRate, minCountry, avgRate };
  };

  const stats = getStats();

  return (
    <div
      style={{
        fontFamily: "Inter, Roboto, sans-serif",
        background: "radial-gradient(circle at 50% 20%, #0f172a 0%, #020617 100%)",
        color: "#e2e8f0",
        minHeight: "100vh",
        padding: "20px 15px",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: "30px 20px",
          boxShadow: "0 0 40px rgba(56,189,248,0.2)",
          backdropFilter: "blur(16px)",
          position: "relative",
        }}
      >
        {/* 标题区域 */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <h1 style={{ 
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)", 
            fontWeight: 800, 
            color: "#38bdf8",
            margin: "0 0 10px 0",
            textShadow: "0 0 10px rgba(56,189,248,0.5)"
          }}>
            🌍 世界生育率地圖
          </h1>
          <p style={{ 
            marginTop: 0, 
            color: "#94a3b8", 
            fontSize: "1rem",
            maxWidth: 800,
            marginLeft: "auto",
            marginRight: "auto"
          }}>
            生育率表示每位女性的平均子女數。顏色越亮表示生育率越高；灰色為暫無資料。數據來源：2022年統計
          </p>
        </div>

        {/* 主要内容区域 - 地图和统计信息 */}
        <div style={{ 
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 20,
          marginBottom: 20
        }}>
          {/* 地图容器 */}
          <div
            style={{ 
              background: "#0b1120", 
              borderRadius: 18, 
              padding: 18,
              height: 550,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseMove={handleMouseMove}
          >
            <ComposableMap 
              projectionConfig={{ scale: 150 }}
              style={{ width: "100%", height: "100%" }}
            >
              <Geographies geography={featureCollection as any}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const isoNum = String((geo as any).id).padStart(3, "0");
                    const iso3 = ISO3_MAP[isoNum];
                    const d = iso3 ? DATA_2022[iso3] : undefined;
                    const fill = typeof d?.rate === "number" ? colorScale(d.rate) : "#1e293b";

                    return (
                      <Geography
                        key={(geo as any).rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke="#0f172a"
                        strokeWidth={0.4}
                        style={{
                          default: { outline: "none", transition: "all 0.3s ease" },
                          hover: {
                            outline: "none",
                            opacity: 0.9,
                            filter: "drop-shadow(0 0 6px #38bdf8)",
                            cursor: "pointer"
                          },
                          pressed: { outline: "none" },
                        }}
                        onMouseEnter={() => {
                          setTooltip(
                            d ? `${d.name}：${d.rate.toFixed(2)}` : 
                            iso3 ? `無資料（代碼：${iso3}）` : 
                            `無資料（ISO_N3：${isoNum}）`
                          );
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        onClick={() => d && setSelectedCountry(d)}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>

            {/* 色阶标尺 */}
            <div
              style={{
                position: "absolute",
                left: 14,
                bottom: 14,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 8,
                padding: "6px 10px",
                boxShadow: "0 0 8px rgba(56,189,248,0.3)",
                fontSize: 10,
                color: "#f1f5f9",
                width: 160,
              }}
            >
              <div style={{ marginBottom: 4, fontWeight: 600 }}>生育率</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 16, textAlign: "right" }}>1.0</span>
                <div style={{ flex: 1, height: 6, borderRadius: 4, background: legendGradient }} />
                <span style={{ width: 24 }}>6.7</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 2,
                  fontSize: 9,
                  color: "#94a3b8",
                }}
              >
                <span>低</span>
                <span>高</span>
              </div>
            </div>
          </div>

          {/* 统计信息面板 */}
          <div style={{
            background: "#0b1120",
            borderRadius: 18,
            padding: 20,
            display: "flex",
            flexDirection: "column",
          }}>
            <h2 style={{
              color: "#e2e8f0",
              margin: "0 0 20px 0",
              fontSize: 1.3rem,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: 10
            }}>
              生育率統計
            </h2>
            
            <div style={{ marginBottom: 25 }}>
              <div style={{ color: "#94a3b8", fontSize: 0.9rem, marginBottom: 5 }}>全球平均生育率</div>
              <div style={{ 
                fontSize: "1.8rem", 
                fontWeight: 700, 
                color: "#38bdf8",
                textShadow: "0 0 8px rgba(56,189,248,0.3)"
              }}>
                {stats.avgRate.toFixed(2)}
              </div>
            </div>
            
            <div style={{ marginBottom: 25 }}>
              <div style={{ color: "#94a3b8", fontSize: 0.9rem, marginBottom: 5 }}>最高生育率</div>
              <div style={{ 
                fontSize: "1.8rem", 
                fontWeight: 700, 
                color: "#f97316",
                textShadow: "0 0 8px rgba(249,115,22,0.3)"
              }}>
                {stats.maxRate.toFixed(2)}
              </div>
              <div style={{ fontSize: 0.85rem, color: "#cbd5e1", marginTop: 5 }}>
                {stats.maxCountry?.name} ({stats.maxCountry?.region})
              </div>
            </div>
            
            <div style={{ marginBottom: 25 }}>
              <div style={{ color: "#94a3b8", fontSize: 0.9rem, marginBottom: 5 }}>最低生育率</div>
              <div style={{ 
                fontSize: "1.8rem", 
                fontWeight: 700, 
                color: "#60a5fa",
                textShadow: "0 0 8px rgba(96,165,250,0.3)"
              }}>
                {stats.minRate.toFixed(2)}
              </div>
              <div style={{ fontSize: 0.85rem, color: "#cbd5e1", marginTop: 5 }}>
                {stats.minCountry?.name} ({stats.minCountry?.region})
              </div>
            </div>
            
            {selectedCountry && (
              <div style={{
                marginTop: auto,
                padding: 15,
                background: "rgba(56,189,248,0.1)",
                borderRadius: 12,
                border: "1px solid rgba(56,189,248,0.2)"
              }}>
                <div style={{ color: "#94a3b8", fontSize: 0.85rem, marginBottom: 5 }}>已選國家</div>
                <div style={{ fontSize: 1.1rem, fontWeight: 600, color: "#e2e8f0" }}>
                  {selectedCountry.name}
                </div>
                <div style={{ fontSize: 0.9rem, color: "#cbd5e1", margin: "5px 0" }}>
                  地區: {selectedCountry.region || "未知"}
                </div>
                <div style={{ fontSize: 1.3rem, fontWeight: 700, color: "#38bdf8" }}>
                  生育率: {selectedCountry.rate.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 信息说明卡片 */}
        <div style={{
          background: "rgba(11,17,32,0.7)",
          borderRadius: 16,
          padding: 20,
          border: "1px solid rgba(255,255,255,0.08)",
          marginTop: 10
        }}>
          <h3 style={{
            margin: "0 0 12px 0",
            color: "#94a3b8",
            fontSize: 1.1rem,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            <span>📊</span> 關於生育率
          </h3>
          <p style={{
            margin: 0,
            color: "#cbd5e1",
            fontSize: 0.9rem,
            lineHeight: 1.6
          }}>
            生育率是衡量人口增長的重要指標，反映一個國家或地區的人口增長潛力。高生育率通常出現在發展中國家，而低生育率則多見於發達國家。長期低生育率可能導致人口老齡化和勞動力短缺等問題。
          </p>
        </div>

        {/* 跟随鼠标的提示框 */}
        {tooltip && (
          <div
            style={{
              position: "fixed",
              top: mousePos.y,
              left: mousePos.x,
              background: "rgba(2,6,23,0.95)",
              padding: "8px 12px",
              border: "1px solid rgba(56,189,248,0.5)",
              borderRadius: 8,
              boxShadow: "0 0 12px rgba(56,189,248,0.4)",
              fontSize: 12,
              color: "#e2e8f0",
              pointerEvents: "none",
              zIndex: 9999,
              whiteSpace: "nowrap",
              transition: "all 0.1s ease-out"
            }}
          >
            {tooltip}
          </div>
        )}
      </div>
    </div>
  );
}

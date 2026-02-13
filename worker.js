const EXCLUDED_IPS = ["5.43.93.39"];

export default {
  async fetch(request, env) {
    const ip = request.headers.get("CF-Connecting-IP") || "";
    const isExcluded = EXCLUDED_IPS.includes(ip);

    let count = parseInt(await env.COUNTER.get("visitors")) || 0;

    if (!isExcluded) {
      count++;
      await env.COUNTER.put("visitors", count.toString());
    }

    const response = isExcluded
      ? generateBadge(count)
      : '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"/>';

    return new Response(response, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  },
};

function generateBadge(count) {
  const label = "visitors";
  const value = count.toString();
  const labelWidth = label.length * 7 + 10;
  const valueWidth = value.length * 7 + 10;
  const totalWidth = labelWidth + valueWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
  <linearGradient id="a" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <rect rx="3" width="${totalWidth}" height="20" fill="#555"/>
  <rect rx="3" x="${labelWidth}" width="${valueWidth}" height="20" fill="#4c1"/>
  <rect rx="3" width="${totalWidth}" height="20" fill="url(#a)"/>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="${labelWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${labelWidth / 2}" y="14">${label}</text>
    <text x="${labelWidth + valueWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${value}</text>
    <text x="${labelWidth + valueWidth / 2}" y="14">${value}</text>
  </g>
</svg>`;
}

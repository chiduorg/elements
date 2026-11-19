import {articleUrl} from '/engine/content/routes.js';

const state = {elements: [], byZ: new Map(), entries: new Map(), properties: {}, current: null};
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) document.documentElement.classList.add('reduce-motion');

const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? '').replace(/[&<>"]/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[char]));
const ISOTOPE_NOTE_EN = {
 '¹H 与 ²H 稳定；³H 半衰期 12.32 年':'¹H and ²H are stable; ³H has a half-life of 12.32 years',
 '³He 与 ⁴He 稳定':'³He and ⁴He are stable',
 '⁶Li 与 ⁷Li 稳定':'⁶Li and ⁷Li are stable',
 '¹²C 与 ¹³C 稳定；¹⁴C 半衰期 5,700 年':'¹²C and ¹³C are stable; ¹⁴C has a half-life of 5,700 years',
 '¹⁴N 与 ¹⁵N 稳定':'¹⁴N and ¹⁵N are stable',
 '¹⁶O、¹⁷O、¹⁸O 稳定':'¹⁶O, ¹⁷O and ¹⁸O are stable',
 '²⁰Ne、²¹Ne、²²Ne 稳定':'²⁰Ne, ²¹Ne and ²²Ne are stable',
 '²³Na 稳定':'²³Na is stable',
 '²⁴Mg、²⁵Mg、²⁶Mg 稳定':'²⁴Mg, ²⁵Mg and ²⁶Mg are stable',
 '²⁷Al 稳定':'²⁷Al is stable',
 '²⁸Si、²⁹Si、³⁰Si 稳定':'²⁸Si, ²⁹Si and ³⁰Si are stable',
 '³¹P 稳定':'³¹P is stable',
 '³²S、³³S、³⁴S、³⁶S 稳定':'³²S, ³³S, ³⁴S and ³⁶S are stable',
 '³⁵Cl 与 ³⁷Cl 稳定':'³⁵Cl and ³⁷Cl are stable',
 '³⁶Ar、³⁸Ar、⁴⁰Ar 稳定':'³⁶Ar, ³⁸Ar and ⁴⁰Ar are stable',
 '³⁹K 与 ⁴¹K 稳定；⁴⁰K 半衰期 1.25×10⁹ 年':'³⁹K and ⁴¹K are stable; ⁴⁰K has a half-life of 1.25×10⁹ years',
 '⁴⁰Ca、⁴²Ca、⁴³Ca、⁴⁴Ca、⁴⁶Ca 稳定；⁴⁸Ca 半衰期约 6×10¹⁹ 年':'⁴⁰Ca, ⁴²Ca, ⁴³Ca, ⁴⁴Ca and ⁴⁶Ca are stable; ⁴⁸Ca has a half-life of about 6×10¹⁹ years',
 '⁴⁶Ti–⁵⁰Ti 五种稳定同位素':'Five stable isotopes: ⁴⁶Ti–⁵⁰Ti',
 '⁵⁰Cr、⁵²Cr、⁵³Cr、⁵⁴Cr 稳定':'⁵⁰Cr, ⁵²Cr, ⁵³Cr and ⁵⁴Cr are stable',
 '⁵⁴Fe、⁵⁶Fe、⁵⁷Fe、⁵⁸Fe 稳定':'⁵⁴Fe, ⁵⁶Fe, ⁵⁷Fe and ⁵⁸Fe are stable',
 '⁵⁵Mn 稳定':'⁵⁵Mn is stable',
 '⁵⁸Ni、⁶⁰Ni、⁶¹Ni、⁶²Ni、⁶⁴Ni 稳定':'⁵⁸Ni, ⁶⁰Ni, ⁶¹Ni, ⁶²Ni and ⁶⁴Ni are stable',
 '⁵⁹Co 稳定':'⁵⁹Co is stable',
 '⁶³Cu 与 ⁶⁵Cu 稳定':'⁶³Cu and ⁶⁵Cu are stable',
 '⁶⁴Zn、⁶⁶Zn、⁶⁷Zn、⁶⁸Zn、⁷⁰Zn 稳定':'⁶⁴Zn, ⁶⁶Zn, ⁶⁷Zn, ⁶⁸Zn and ⁷⁰Zn are stable',
 '⁷⁹Br 与 ⁸¹Br 稳定':'⁷⁹Br and ⁸¹Br are stable',
 '⁷⁸Kr、⁸⁰Kr、⁸²Kr、⁸³Kr、⁸⁴Kr、⁸⁶Kr 稳定':'⁷⁸Kr, ⁸⁰Kr, ⁸²Kr, ⁸³Kr, ⁸⁴Kr and ⁸⁶Kr are stable',
 '¹⁰⁷Ag 与 ¹⁰⁹Ag 稳定':'¹⁰⁷Ag and ¹⁰⁹Ag are stable',
 '¹²⁷I 稳定':'¹²⁷I is stable',
 '¹³³Cs 稳定':'¹³³Cs is stable',
 '¹³⁸La 与 ¹³⁹La 稳定（¹³⁸La 为极长寿命放射性核）':'¹³⁸La and ¹³⁹La are stable (¹³⁸La is an extremely long-lived radionuclide)',
 '¹⁹⁷Au 稳定':'¹⁹⁷Au is stable',
 '¹⁸²W、¹⁸³W、¹⁸⁴W、¹⁸⁶W 稳定；¹⁸⁰W 半衰期约 1.8×10¹⁸ 年':'¹⁸²W, ¹⁸³W, ¹⁸⁴W and ¹⁸⁶W are stable; ¹⁸⁰W has a half-life of about 1.8×10¹⁸ years',
 '¹⁹⁰Pt、¹⁹²Pt、¹⁹⁴Pt–¹⁹⁶Pt、¹⁹⁸Pt 共六种稳定同位素':'Six stable isotopes: ¹⁹⁰Pt, ¹⁹²Pt, ¹⁹⁴Pt–¹⁹⁶Pt and ¹⁹⁸Pt',
 '¹⁹⁶Hg、¹⁹⁸Hg–²⁰²Hg、²⁰⁴Hg 共七种稳定同位素':'Seven stable isotopes: ¹⁹⁶Hg, ¹⁹⁸Hg–²⁰²Hg and ²⁰⁴Hg',
 '²⁰⁴Pb、²⁰⁶Pb、²⁰⁷Pb、²⁰⁸Pb 稳定':'²⁰⁴Pb, ²⁰⁶Pb, ²⁰⁷Pb and ²⁰⁸Pb are stable',
 '¹¹²Sn、¹¹⁴Sn–¹²⁰Sn、¹²²Sn、¹²⁴Sn 共十种稳定同位素':'Ten stable isotopes: ¹¹²Sn, ¹¹⁴Sn–¹²⁰Sn, ¹²²Sn and ¹²⁴Sn',
 '¹²⁴Xe、¹²⁶Xe、¹²⁸Xe–¹³²Xe、¹³⁴Xe、¹³⁶Xe 共九种稳定同位素':'Nine stable isotopes: ¹²⁴Xe, ¹²⁶Xe, ¹²⁸Xe–¹³²Xe, ¹³⁴Xe and ¹³⁶Xe',
 '¹³⁰Ba、¹³²Ba、¹³⁴Ba–¹³⁸Ba 共七种稳定同位素':'Seven stable isotopes: ¹³⁰Ba, ¹³²Ba and ¹³⁴Ba–¹³⁸Ba',
 '无稳定同位素':'No stable isotopes',
 '无稳定同位素；²³⁸U 半衰期 4.468×10⁹ 年，²³⁵U 半衰期 7.04×10⁸ 年':'No stable isotopes; ²³⁸U has a half-life of 4.468×10⁹ years, ²³⁵U of 7.04×10⁸ years'
};
const isotopeNoteEn = (note) => ISOTOPE_NOTE_EN[note] || note;

function occupancy(configuration) {
  const map = new Map();
  for (const match of String(configuration).matchAll(/(\d[spdf])(\d+)/g)) map.set(match[1], Number(match[2]));
  return map;
}

function deltaFor(element) {
  if (element.z === 1) return {shell: null, text: '氢是元素轴的起点，没有 Z−1 可比较。'};
  const previous = state.byZ.get(element.z - 1);
  if (!previous) return {shell: null, text: '缺少 Z−1 数据。'};
  const before = occupancy(previous.configuration), after = occupancy(element.configuration);
  let shell = null;
  for (const [name, count] of after) if (count !== (before.get(name) || 0)) shell = name;
  return {shell, previous};
}

function renderLadder() {
  const host = $('shell-ladder');
  if (!host) return;
  const shells = [[1, '1s²', 2], [2, '2s²2p⁶', 10], [3, '3s²3p⁶', 18], [4, '4s²3d¹⁰4p⁶', 36], [5, '5s²4d¹⁰5p⁶', 54], [6, '6s²4f¹⁴5d¹⁰6p⁶', 86], [7, '7s²5f¹⁴6d¹⁰7p⁶', 118]];
  const alkalis = [['Li', 3], ['Na', 11], ['K', 19], ['Rb', 37], ['Cs', 55], ['Fr', 87]];
  host.innerHTML = shells.map(([period, fill, z], index) => {
    const alkali = alkalis.find(([, value]) => state.byZ.get(value)?.period === period + 1);
    const start = state.byZ.get(index === 0 ? 1 : [0, 3, 11, 19, 37, 55, 87][index]);
    const end = state.byZ.get(z);
    const hub = state.entries.get(`elements.${end ? end.symbol.toLowerCase() : ''}`);
    const link = hub ? `<a class="el-ladder-hub" href="${esc(articleUrl(hub))}" data-en="End of this shell ↗">这一层结束 ↗</a>` : '';
    const restart = alkali ? `<a class="el-ladder-restart" href="#z-${alkali[1]}" data-en="${esc(alkali[0])} · new shell">${alkali[0]} · 新层开始</a>` : '<span class="el-ladder-restart is-muted" data-en="No next shell">暂无下一层</span>';
    const rangeEn = `${start ? `${start.symbol} (Z=${start.z})` : ''} → ${end ? `${end.symbol} (Z=${end.z})` : ''} · capacity ${z}`;
    return `<article class="el-step" data-shell="${z}">
      <div class="el-step-index">P${period}</div>
      <div class="el-step-body">
        <h3>${esc(fill)}</h3>
        <p data-en="${esc(rangeEn)}">${start ? `${esc(start.symbol)}（Z=${start.z}）` : ''} → ${end ? `${esc(end.symbol)}（Z=${end.z}）` : ''} · 容量 ${z}</p>
      </div>
      <div class="el-step-links">${link}${restart}</div>
    </article>`;
  }).join('');
}

function cell(element) {
  const classes = ['el-cell', `is-block-${element.block}`];
  if (element.closedShell) classes.push('is-closed');
  if (element.group === 1 && element.z > 1) classes.push('is-alkali');
  if (element.predicted) classes.push('is-predicted');
  const badge = element.closedShell ? '<span class="el-cell-dot" aria-hidden="true"></span>' : '';
  const label = `Z=${element.z} ${element.symbol} ${element.nameZh}${element.closedShell ? ' 闭壳' : ''}${element.predicted ? ' 预测' : ''}`;
  return `<button class="${classes.join(' ')}" type="button" data-z="${element.z}" id="cell-${element.z}" tabindex="-1" aria-label="${esc(label)}">
    <span class="el-cell-z">${element.z}</span>
    <strong class="el-cell-symbol">${esc(element.symbol)}</strong>
    <span class="el-cell-name" data-en="${esc(element.nameEn || element.nameZh)}">${esc(element.nameZh)}</span>${badge}
  </button>`;
}

function renderTable() {
  const host = $('periodic-table');
  if (!host) return;
  const main = state.elements.filter((element) => element.group !== null);
  const fblock = state.elements.filter((element) => element.fRow);
  const rows = [1, 2, 3, 4, 5, 6, 7];
  const mainGrid = rows.map((period) => {
    const cells = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((group) => {
      const element = main.find((item) => item.period === period && item.group === group);
      return element ? cell(element) : '<span class="el-cell is-empty" aria-hidden="true"></span>';
    }).join('');
    return cells;
  }).join('');
  const fRows = [1, 2].map((row) => {
    const items = fblock.filter((element) => element.fRow === row).sort((a, b) => a.z - b.z);
    return `<div class="el-f-row"><span class="el-f-label" data-en="${row === 1 ? 'Lanthanides' : 'Actinides'}">${row === 1 ? '镧系' : '锕系'}</span>${items.map(cell).join('')}</div>`;
  }).join('');
  host.innerHTML = `<div class="el-table-main" role="group" aria-label="主表：第 1–7 周期">${mainGrid}</div><div class="el-table-f" role="group" aria-label="镧系与锕系">${fRows}</div>`;
}

function badge(element) {
  const items = [];
  if (element.closedShell) items.push('<span class="el-badge is-closed" data-en="Closed-shell node">闭壳节点</span>');
  if (element.group === 1 && element.z > 1) items.push('<span class="el-badge is-alkali" data-en="Start of a new shell">新壳层起点</span>');
  if (element.predicted) items.push('<span class="el-badge is-predicted" data-en="Predicted configuration">构型为预测值</span>');
  return items.join('') || '<span class="el-badge" data-en="Standard element">标准元素</span>';
}

function renderDetail(element) {
  const host = $('detail');
  if (!host) return;
  const delta = deltaFor(element);
  const hub = element.closedShell ? state.entries.get(`elements.${element.symbol.toLowerCase()}`) : null;
  const props = state.properties[element.z] || {};
  const prevElement = delta.previous || null;
  const prevProps = prevElement ? (state.properties[prevElement.z] || {}) : {};
  const fmt = (value, digits) => Number.isFinite(value) ? Number(value).toFixed(digits).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1') : null;
  const predicted = element.predicted ? '<small>预测值</small>' : '';
  const metric = (current, previous, unit, digits, empty = '暂无数据') => {
    const value = fmt(current, digits);
    if (value === null) return element.predicted ? '预测值（暂无公认数值）' : empty;
    const suffix = unit ? ' ' + unit : '';
    const base = `<strong>${value}${suffix}</strong>${predicted}`;
    if (!prevElement || !Number.isFinite(previous)) return base;
    const change = current - previous;
    return `${base}<small>${esc(prevElement.symbol)} ${fmt(previous, digits)}${suffix} · ${change >= 0 ? '+' : '−'}${fmt(Math.abs(change), digits)}</small>`;
  };
  const isotopeRow = () => {
    const previousText = prevElement ? `<small data-en="${esc(prevElement.symbol)}: ${Number.isFinite(prevProps.stableIsotopes) ? (prevProps.stableIsotopes === 0 ? 'no stable isotopes' : `${prevProps.stableIsotopes} stable isotopes`) : 'has stable isotopes'}">${esc(prevElement.symbol)}：${Number.isFinite(prevProps.stableIsotopes) ? (prevProps.stableIsotopes === 0 ? '无稳定同位素' : `稳定同位素 ${prevProps.stableIsotopes} 种`) : '有稳定同位素'}</small>` : '';
    if (!Number.isFinite(props.stableIsotopes)) return `<span data-en="Has stable isotopes">有稳定同位素</span>${previousText}`;
    if (props.stableIsotopes === 0) return `<strong data-en="No stable isotopes">无稳定同位素</strong>${previousText}${props.isotopeNote ? `<small data-en="${esc(isotopeNoteEn(props.isotopeNote))}">${esc(props.isotopeNote)}</small>` : ''}`;
    return `<strong data-en="${props.stableIsotopes} stable isotopes">稳定同位素 ${props.stableIsotopes} 种</strong>${previousText}${props.isotopeNote ? `<small data-en="${esc(isotopeNoteEn(props.isotopeNote))}">${esc(props.isotopeNote)}</small>` : ''}`;
  };
  const articleLinks = [
    hub ? `<a class="el-action" href="${esc(articleUrl(hub))}" data-en="Why this shell ends ↗">阅读“这一层为什么结束” ↗</a>` : '',
    '<a class="el-action" href="/entry/elements/explain-configuration/" data-en="Electron configuration ↗">电子排布 ↗</a>',
    '<a class="el-action" href="/entry/elements/explain-nuclear-stability/" data-en="Nuclear stability ↗">核稳定性 ↗</a>'
  ].filter(Boolean).join('');
  const deltaRows = [
    ['新增电子进入', 'New electron enters'],
    ['第一电离能', 'First ionization energy'],
    ['原子半径', 'Atomic radius'],
    ['电负性', 'Electronegativity'],
    ['价电子构型', 'Valence configuration'],
    ['核稳定性与同位素', 'Nuclear stability & isotopes']
  ];
  const deltaValues = [
    delta.shell ? `<strong>${esc(delta.shell)}</strong>` : '<strong data-en="None (starting point)">无（起点）</strong>',
    metric(props.ionization, prevProps.ionization, 'eV', 3),
    metric(props.radius, prevProps.radius, 'pm', 0),
    metric(props.electronegativity, prevProps.electronegativity, '', 2, '无公认值'),
    `<strong>${esc(element.valence)}</strong>${prevElement ? `<small>${esc(prevElement.symbol)} ${esc(prevElement.valence)}</small>` : ''}`,
    isotopeRow()
  ];
  host.innerHTML = `<div class="el-detail-card">
    <div class="el-detail-head">
      <span class="el-detail-z">Z = ${element.z}</span>
      <h3><span class="el-symbol">${esc(element.symbol)}</span> <span data-en="${esc(element.nameEn)}">${esc(element.nameZh)}</span> <small>${esc(element.nameEn)}</small></h3>
      <div class="el-badges">${badge(element)}</div>
    </div>
    <dl class="el-detail-grid">
      <div><dt data-en="Period">周期</dt><dd data-en="Period ${element.period}">第 ${element.period} 周期</dd></div>
      <div><dt data-en="Group">族</dt><dd data-en="${element.group ? `Group ${element.group}` : 'Lanthanides / Actinides'}">${element.group ? `第 ${element.group} 族` : '镧系 / 锕系'}</dd></div>
      <div><dt data-en="Block">区块</dt><dd data-en="${esc(element.block)}-block">${esc(element.block)} 区</dd></div>
      <div><dt data-en="Ground-state configuration">基态构型</dt><dd><code>${esc(element.configurationShort)}</code></dd></div>
    </dl>
    <section class="el-delta" aria-labelledby="delta-title-${element.z}">
      <h4 id="delta-title-${element.z}" data-en="Relative to Z−1${delta.previous ? ` (${esc(delta.previous.symbol)}, Z=${delta.previous.z})` : ''}: what one more proton changed">相对 Z−1${delta.previous ? `（${esc(delta.previous.symbol)}，Z=${delta.previous.z}）` : ''}：多了一个质子改变了什么</h4>
      <p class="el-delta-note">${esc(delta.text || '')}</p>
      <dl class="el-delta-grid">${deltaRows.map(([key, en], index) => `<div><dt data-en="${en}">${key}</dt><dd>${deltaValues[index]}</dd></div>`).join('')}</dl>
      <p class="el-delta-caveat" data-en="Value basis: first ionization energy in eV (NIST/PubChem compilation); atomic radius in pm (calculated values preferred); electronegativity on the Pauling scale; values for Z ≥ 104 are marked as predicted.">数值口径：第一电离能 eV（NIST/PubChem 汇编）；原子半径 pm（计算值优先）；电负性为 Pauling 标度；Z≥104 的数值标为预测值。</p>
    </section>
    <div class="el-detail-actions">
      <button type="button" class="el-step-button" data-step="-1" ${element.z === 1 ? 'disabled' : ''}>← Z−1</button>
      <button type="button" class="el-step-button" data-step="1" ${element.z === 118 ? 'disabled' : ''}>Z+1 →</button>
      ${articleLinks}
    </div>
  </div>`;
}

function select(z, {focus = false, updateUrl = true} = {}) {
  const element = state.byZ.get(Number(z));
  if (!element) return;
  state.current = element;
  for (const node of document.querySelectorAll('.el-cell')) {
    const active = Number(node.dataset.z) === element.z;
    node.classList.toggle('is-selected', active);
    if (active) node.setAttribute('aria-current', 'true');
    else node.removeAttribute('aria-current');
    node.tabIndex = active ? 0 : -1;
    if (active && focus) node.focus();
  }
  renderDetail(element);
  document.dispatchEvent(new CustomEvent('elements:change', {detail: {z: element.z}}));
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('z', String(element.z));
    history.replaceState(null, '', url);
  }
}

function neighbors(element, key) {
  if (key === 'ArrowRight') return state.byZ.get(element.z + 1);
  if (key === 'ArrowLeft') return state.byZ.get(element.z - 1);
  if (key === 'PageDown' || key === 'ArrowDown') {
    if (element.group === null) return state.elements.find((item) => item.fRow === (element.fRow || 0) + 1 && item.z === element.z + 32);
    return state.elements.find((item) => item.group === element.group && item.period === element.period + 1);
  }
  if (key === 'PageUp' || key === 'ArrowUp') {
    if (element.group === null) return state.elements.find((item) => item.fRow === (element.fRow || 0) - 1 && item.z === element.z - 32);
    return [...state.elements].reverse().find((item) => item.group === element.group && item.period === element.period - 1);
  }
  return null;
}

function bindKeys() {
  document.addEventListener('keydown', (event) => {
    if (!state.current) return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (event.key === 'Home') {event.preventDefault(); select(1, {focus: true}); return;}
    if (event.key === 'End') {event.preventDefault(); select(118, {focus: true}); return;}
    if (event.key === 'Enter' && document.activeElement?.classList?.contains('el-cell')) return;
    const next = neighbors(state.current, event.key);
    if (next) {event.preventDefault(); select(next.z, {focus: document.activeElement?.classList?.contains('el-cell')});}
  });
  document.addEventListener('click', (event) => {
    const cellNode = event.target.closest('.el-cell[data-z]');
    if (cellNode) {select(Number(cellNode.dataset.z)); return;}
    const step = event.target.closest('[data-step]');
    if (step && state.current) {select(state.current.z + Number(step.dataset.step), {focus: false});}
  });
  document.addEventListener('elements:request', (event) => {
    const z = Number(event.detail?.z);
    if (Number.isFinite(z) && state.byZ.has(z)) select(z);
  });
}

function bindHash() {
  addEventListener('hashchange', () => {
    const match = location.hash.match(/^#z-(\d+)$/);
    if (match) select(Number(match[1]), {focus: true});
  });
}

async function boot() {
  try {
    const [data, entries] = await Promise.all([
      fetch('./elements.json').then((response) => response.json()),
      fetch('./entries.json').then((response) => response.json())
    ]);
    state.elements = data.elements;
    state.byZ = new Map(data.elements.map((element) => [element.z, element]));
    state.entries = new Map(entries.map((entry) => [entry.id, entry]));
    state.properties = data.properties || {};
    renderLadder();
    renderTable();
    bindKeys();
    bindHash();
    const params = new URL(location.href).searchParams;
    const requested = Number(params.get('z'));
    const entryParam = params.get('entry') || '';
    const entrySymbol = entryParam.startsWith('elements.') ? entryParam.slice('elements.'.length) : '';
    const bySymbol = entrySymbol ? data.elements.find((element) => element.symbol.toLowerCase() === entrySymbol.toLowerCase()) : null;
    const hash = location.hash.match(/^#z-(\d+)$/);
    select(state.byZ.has(requested) ? requested : bySymbol ? bySymbol.z : hash ? Number(hash[1]) : 26);
  } catch (error) {
    console.error(error);
    const host = $('detail');
    if (host) host.innerHTML = '<p class="el-placeholder">元素数据未能载入。可直接阅读下方七个闭壳节点与六个解释页。</p>';
  }
}

boot();

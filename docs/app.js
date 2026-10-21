/* 工作百科 jobs-wiki —— 纯前端渲染，数据来自 window.JOBS_DATA（docs/data.js） */
(function () {
  "use strict";

  var JOBS = (window.JOBS_DATA || []).slice();
  var CATEGORIES = ["正式职业", "新职业", "小众工作", "平台化项目制"];
  var state = { cat: "全部", q: "", tag: "", tagsOpen: false };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel,  root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function byCat(cat) {
    if (cat === "全部") return JOBS.slice();
    return JOBS.filter(function (j) { return j.category === cat; });
  }

  function applyFilters(list) {
    var q = state.q.trim().toLowerCase();
    return list.filter(function (j) {
      if (state.tag && (j.tags || []).indexOf(state.tag) === -1) return false;
      if (!q) return true;
      var hay = [j.name, j.summary, (j.aliases || []).join(" "), (j.tags || []).join(" "), j.category]
        .join(" ").toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }

  function uniqueTags() {
    var set = {};
    JOBS.forEach(function (j) { (j.tags || []).forEach(function (t) { set[t] = 1; }); });
    return Object.keys(set).sort();
  }

  function shortIncome(s) {
    if (!s) return "收入未注明";
    return s.split("（")[0];
  }

  /* ---------- 小工具 ---------- */
  function stat(num, label) {
    return '<div class="stat"><b>' + num + '</b><span>' + esc(label) + '</span></div>';
  }
  function ul(arr) {
    if (!arr || !arr.length) return '<p class="muted">暂无</p>';
    return '<ul>' + arr.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
  }
  function block(title, body) {
    return '<div class="block"><h2>' + esc(title) + '</h2>' + body + '</div>';
  }
  function infoRow(label, val) {
    return '<div class="block"><h2>' + esc(label) + '</h2><p>' + esc(val) + '</p></div>';
  }

  function jobCard(j, hideCat) {
    var tags = (j.tags || []).slice(0, 4).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
    return '<a class="card" href="#/job/' + esc(j.id) + '">'
      + (hideCat ? '' : '<div class="card-cat">' + esc(j.category) + '</div>')
      + '<h3>' + esc(j.name) + '</h3>'
      + '<p class="card-sum">' + esc(j.summary) + '</p>'
      + '<div class="card-tags">' + tags + '</div>'
      + '<div class="card-foot"><span class="income">' + esc(shortIncome(j.incomeRange)) + '</span></div>'
      + '</a>';
  }

  /* ---------- 首页 ---------- */
  function renderHome() {
    var app = document.getElementById("app");
    var total = JOBS.length;
    var niche = JOBS.filter(function (j) { return j.category === "小众工作"; }).length;
    var catCount = {};
    JOBS.forEach(function (j) { catCount[j.category] = (catCount[j.category] || 0) + 1; });

    var html = "";
    html += '<section class="banner"><strong>本站定位：</strong>非盈利、纯科普。这里只回答“有哪些工作、长什么样”，不回答“哪有岗位”。不招聘、不撮合、不导流、不承诺收益。</section>';

    html += '<section class="hero">'
      + '<h1>你未必听过的工作，这里都有</h1>'
      + '<p>我们把人们正在从事的各种工作——正式职业、新职业、小众工作、平台化/项目制工作——列出来、讲清楚，尤其覆盖招聘网站和职业大典里不常见的小众活法。</p>'
      + '<div class="stats">' + stat(total, "种工作已收录") + stat(CATEGORIES.length, "大分类") + stat(niche, "种小众工作") + '</div>'
      + '</section>';

    html += '<section class="controls">';
    html += '<div class="search"><input id="search" type="search" placeholder="搜索工作名 / 关键词，如：陪跑、宠物、直播…" value="' + esc(state.q) + '"></div>';
    html += '<div class="cats" id="cats">';
    ["全部"].concat(CATEGORIES).forEach(function (c) {
      var n = c === "全部" ? total : (catCount[c] || 0);
      var disabled = (c !== "全部" && n === 0);
      html += '<button class="chip' + (state.cat === c ? ' active' : '') + (disabled ? ' disabled' : '') + '" data-cat="' + esc(c) + '"' + (disabled ? ' disabled' : '') + '>' + esc(c) + ' <i>' + n + '</i></button>';
    });
    html += '</div>';
    var tags = uniqueTags();
    if (tags.length) {
      html += '<div class="tags" id="tags"><span class="tags-label">标签：</span>';
      var shown = state.tagsOpen ? tags : tags.slice(0, 14);
      shown.forEach(function (t) {
        html += '<button class="tag' + (state.tag === t ? ' active' : '') + '" data-tag="' + esc(t) + '">#' + esc(t) + '</button>';
      });
      if (tags.length > 14) {
        html += '<button class="tag tag-more" id="tagToggle">' + (state.tagsOpen ? '收起' : '更多 ' + (tags.length - 14)) + '</button>';
      }
      html += '</div>';
    }
    html += '</section>';

    html += '<section class="grid" id="grid"></section>';
    app.innerHTML = html;

    updateGrid();
    bindHome();
  }

  function updateGrid() {
    var grid = document.getElementById("grid");
    if (!grid) return;
    var list = applyFilters(byCat(state.cat));
    if (!list.length) {
      grid.innerHTML = '<p class="empty">没有匹配的工作，换个关键词或分类试试。</p>';
      return;
    }
    grid.innerHTML = list.map(function (j) { return jobCard(j, state.cat !== "全部"); }).join('');
  }

  function bindHome() {
    $$("#cats .chip").forEach(function (b) {
      b.addEventListener("click", function () {
        state.cat = b.getAttribute("data-cat");
        renderHome();
        window.scrollTo(0, 0);
      });
    });
    $$("#tags .tag:not(#tagToggle)").forEach(function (b) {
      b.addEventListener("click", function () {
        var t = b.getAttribute("data-tag");
        state.tag = (state.tag === t) ? "" : t;
        renderHome();
        window.scrollTo(0, 0);
      });
    });
    var toggle = document.getElementById("tagToggle");
    if (toggle) toggle.addEventListener("click", function () {
      state.tagsOpen = !state.tagsOpen;
      renderHome();
      window.scrollTo(0, 0);
    });
    var s = document.getElementById("search");
    if (s) s.addEventListener("input", function () { state.q = s.value; updateGrid(); });
  }

  /* ---------- 详情 ---------- */
  function renderDetail(id) {
    var j = JOBS.filter(function (x) { return x.id === id; })[0];
    var app = document.getElementById("app");
    if (!j) {
      app.innerHTML = '<p class="empty">未找到该工作。<a href="#/">返回首页</a></p>';
      return;
    }

    var html = '<a class="back" href="#/">← 返回全部工作</a>';
    html += '<article class="detail">';
    html += '<div class="detail-head"><span class="card-cat">' + esc(j.category) + '</span><h1>' + esc(j.name) + '</h1>';
    if ((j.aliases || []).length) html += '<p class="aliases">又称：' + j.aliases.map(esc).join('、') + '</p>';
    html += '</div>';
    html += '<p class="lead">' + esc(j.summary) + '</p>';
    html += block("每天在做什么", ul(j.dailyTasks));
    html += block("适合谁", ul(j.whoSuits));
    html += infoRow("门槛", j.threshold);
    html += infoRow("收入区间（参考，非承诺）", j.incomeRange);
    html += infoRow("劝退点", j.discouragement);
    html += infoRow("内容来源", j.source);
    html += infoRow("最近更新", j.updatedAt);
    if ((j.tags || []).length) {
      html += '<div class="detail-tags">';
      j.tags.forEach(function (t) {
        html += '<a class="tag" href="#/" data-backtag="' + esc(t) + '">#' + esc(t) + '</a>';
      });
      html += '</div>';
    }
    html += '</article>';
    app.innerHTML = html;

    $$(".detail-tags .tag", app).forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.preventDefault();
        state.tag = b.getAttribute("data-backtag");
        state.cat = "全部";
        renderHome();
        window.scrollTo(0, 0);
      });
    });
    window.scrollTo(0, 0);
  }

  /* ---------- 路由 ---------- */
  function route() {
    var h = location.hash || "#/";
    var m = h.match(/^#\/job\/(.+)$/);
    if (m) renderDetail(decodeURIComponent(m[1]));
    else renderHome();
  }

  window.addEventListener("hashchange", route);
  route();
})();

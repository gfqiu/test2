(() => {
  const views = {
    si: {
      title: "SiCl4流量优化分析",
      unit: "sccm",
      base: 180,
      kpis: ["推荐均值", "波动幅度", "达标率", "节能收益"],
    },
    temp: {
      title: "芯棒温度场优化分析",
      unit: "℃",
      base: 1180,
      kpis: ["目标温度", "热点温差", "均匀度", "能耗指数"],
    },
    ge: {
      title: "GeCl4流量优化分析",
      unit: "sccm",
      base: 42,
      kpis: ["推荐均值", "波动幅度", "达标率", "折射率匹配"],
    },
    o2: {
      title: "O2配比优化分析",
      unit: "%",
      base: 28,
      kpis: ["最优配比", "氧化效率", "残氧率", "稳定性"],
    },
    speed: {
      title: "沉积速率优化分析",
      unit: "μm/min",
      base: 3.6,
      kpis: ["推荐速率", "层厚偏差", "良品率", "产能提升"],
    },
  };

  const els = {
    form: document.getElementById("inputForm"),
    startDate: document.getElementById("startDate"),
    endDate: document.getElementById("endDate"),
    equipId: document.getElementById("equipId"),
    productCat: document.getElementById("productCat"),
    navList: document.getElementById("navList"),
    viewTitle: document.getElementById("viewTitle"),
    queryStatus: document.getElementById("queryStatus"),
    kpiRow: document.getElementById("kpiRow"),
    resultBody: document.getElementById("resultBody"),
    trendChart: document.getElementById("trendChart"),
    barChart: document.getElementById("barChart"),
    toast: document.getElementById("toast"),
    warnBtn: document.getElementById("warnBtn"),
    warnModal: document.getElementById("warnModal"),
    closeWarn: document.getElementById("closeWarn"),
    warnList: document.getElementById("warnList"),
    userMenu: document.getElementById("userMenu"),
    userBtn: document.getElementById("userBtn"),
    userDropdown: document.getElementById("userDropdown"),
  };

  let currentView = "ge";
  let query = null;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function toDateInput(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function initDates() {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);
    els.startDate.value = toDateInput(start);
    els.endDate.value = toDateInput(end);
  }

  function showToast(msg) {
    els.toast.textContent = msg;
    els.toast.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      els.toast.hidden = true;
    }, 2200);
  }

  function seeded(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function hashStr(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function buildDataset() {
    const meta = views[currentView];
    const key = [
      currentView,
      query?.startDate || els.startDate.value,
      query?.endDate || els.endDate.value,
      query?.equipId || els.equipId.value,
      query?.productCat || els.productCat.value,
    ].join("|");
    const rand = seeded(hashStr(key) || 1);
    const points = Array.from({ length: 12 }, (_, i) => {
      const wave = Math.sin(i / 2.2) * (meta.base * 0.08);
      const noise = (rand() - 0.5) * meta.base * 0.06;
      return +(meta.base + wave + noise).toFixed(2);
    });
    const current = points.map((v) => +(v * (0.92 + rand() * 0.14)).toFixed(2));
    const rows = points.map((rec, i) => {
      const cur = current[i];
      const delta = +(cur - rec).toFixed(2);
      const conf = +(86 + rand() * 12).toFixed(1);
      return {
        slot: `T${pad(i + 1)}`,
        equip: query?.equipId || els.equipId.value,
        cat: query?.productCat || els.productCat.value,
        rec,
        cur,
        delta,
        conf,
        advice: Math.abs(delta) < meta.base * 0.03 ? "保持" : delta > 0 ? "下调" : "上调",
      };
    });

    const avg = points.reduce((a, b) => a + b, 0) / points.length;
    const amp = Math.max(...points) - Math.min(...points);
    const pass = rows.filter((r) => Math.abs(r.delta) < meta.base * 0.04).length / rows.length;
    const gain = 4 + rand() * 8;

    return {
      meta,
      points,
      current,
      rows,
      kpis: [
        { label: meta.kpis[0], value: `${avg.toFixed(2)} ${meta.unit}`, sub: "模型输出" },
        { label: meta.kpis[1], value: `${amp.toFixed(2)} ${meta.unit}`, sub: "峰谷差" },
        { label: meta.kpis[2], value: `${(pass * 100).toFixed(1)}%`, sub: "样本窗口" },
        { label: meta.kpis[3], value: `+${gain.toFixed(1)}%`, sub: "相对基线" },
      ],
    };
  }

  function drawTrend(canvas, recommend, current) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padL = 42;
    const padR = 16;
    const padT = 18;
    const padB = 28;
    const all = recommend.concat(current);
    const min = Math.min(...all) * 0.96;
    const max = Math.max(...all) * 1.04;
    const n = recommend.length;

    ctx.strokeStyle = "#1a3d5c";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = padT + ((h - padT - padB) * i) / 4;
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(w - padR, y);
      ctx.stroke();
      const val = max - ((max - min) * i) / 4;
      ctx.fillStyle = "#7f9cb6";
      ctx.font = "11px sans-serif";
      ctx.fillText(val.toFixed(1), 4, y + 3);
    }

    function path(arr, color) {
      ctx.beginPath();
      arr.forEach((v, i) => {
        const x = padL + ((w - padL - padR) * i) / (n - 1);
        const y = padT + (1 - (v - min) / (max - min)) * (h - padT - padB);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }

    path(current, "#c4873a");
    path(recommend, "#4a9ed4");

    ctx.fillStyle = "#7f9cb6";
    ctx.font = "11px sans-serif";
    ctx.fillText("推荐", w - 90, 14);
    ctx.fillStyle = "#4a9ed4";
    ctx.fillRect(w - 110, 6, 14, 3);
    ctx.fillStyle = "#7f9cb6";
    ctx.fillText("当前", w - 40, 14);
    ctx.fillStyle = "#c4873a";
    ctx.fillRect(w - 60, 6, 14, 3);
  }

  function drawBars(canvas, recommend, current) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const groups = 6;
    const padL = 28;
    const padB = 24;
    const padT = 16;
    const usable = w - padL - 12;
    const groupW = usable / groups;
    const max = Math.max(...recommend.slice(0, groups), ...current.slice(0, groups)) * 1.15;

    for (let i = 0; i < groups; i++) {
      const x0 = padL + i * groupW;
      const rh = (recommend[i] / max) * (h - padT - padB);
      const ch = (current[i] / max) * (h - padT - padB);
      const bw = groupW * 0.28;

      ctx.fillStyle = "#2f7eb8";
      ctx.fillRect(x0 + groupW * 0.18, h - padB - rh, bw, rh);

      ctx.fillStyle = "#b87a36";
      ctx.fillRect(x0 + groupW * 0.52, h - padB - ch, bw, ch);

      ctx.fillStyle = "#7f9cb6";
      ctx.font = "11px sans-serif";
      ctx.fillText(`T${pad(i + 1)}`, x0 + groupW * 0.3, h - 8);
    }
  }

  function render() {
    const data = buildDataset();
    els.viewTitle.textContent = data.meta.title;

    els.kpiRow.innerHTML = data.kpis
      .map(
        (k) =>
          `<div class="metric"><div class="label">${k.label}</div><div class="value">${k.value}</div><div class="sub">${k.sub}</div></div>`
      )
      .join("");

    els.resultBody.innerHTML = data.rows
      .map((r) => {
        const cls = r.delta > 0 ? "delta-up" : r.delta < 0 ? "delta-down" : "";
        const sign = r.delta > 0 ? "+" : "";
        return `<tr>
          <td>${r.slot}</td>
          <td>${r.equip}</td>
          <td>${r.cat}</td>
          <td>${r.rec}</td>
          <td>${r.cur}</td>
          <td class="${cls}">${sign}${r.delta}</td>
          <td>${r.conf}%</td>
          <td>${r.advice}</td>
        </tr>`;
      })
      .join("");

    drawTrend(els.trendChart, data.points, data.current);
    drawBars(els.barChart, data.points, data.current);
  }

  function setView(view) {
    currentView = view;
    [...els.navList.querySelectorAll(".nav-btn")].forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === view);
    });
    render();
  }

  els.navList.addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-btn");
    if (!btn) return;
    setView(btn.dataset.view);
  });

  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (els.startDate.value > els.endDate.value) {
      showToast("开始时间不能晚于结束时间");
      return;
    }
    query = {
      startDate: els.startDate.value,
      endDate: els.endDate.value,
      equipId: els.equipId.value,
      productCat: els.productCat.value,
    };
    els.queryStatus.textContent = `${query.startDate} ~ ${query.endDate}`;
    render();
    showToast("参数推荐已更新");
  });

  const warnings = [
    { level: "high", text: "D-02 沉积腔压力波动超阈值，建议复核密封。" },
    { level: "mid", text: "GeCl4 供应罐余量低于 18%，请安排补料。" },
    { level: "low", text: "D-04 上周达标率 96.2%，维持当前策略。" },
  ];

  els.warnBtn.addEventListener("click", () => {
    els.warnList.innerHTML = warnings
      .map(
        (w) =>
          `<li><span class="level ${w.level}">${w.level === "high" ? "高" : w.level === "mid" ? "中" : "低"}</span>${w.text}</li>`
      )
      .join("");
    els.warnModal.hidden = false;
  });

  els.closeWarn.addEventListener("click", () => {
    els.warnModal.hidden = true;
  });

  els.warnModal.addEventListener("click", (e) => {
    if (e.target === els.warnModal) els.warnModal.hidden = true;
  });

  els.userBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    els.userMenu.classList.toggle("open");
  });

  document.addEventListener("click", () => {
    els.userMenu.classList.remove("open");
  });

  els.userDropdown.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.action === "profile") showToast("个人中心（演示）");
    if (btn.dataset.action === "logout") showToast("已退出（演示）");
    els.userMenu.classList.remove("open");
  });

  initDates();
  query = {
    startDate: els.startDate.value,
    endDate: els.endDate.value,
    equipId: els.equipId.value,
    productCat: els.productCat.value,
  };
  els.queryStatus.textContent = `${query.startDate} ~ ${query.endDate}`;
  setView("ge");
})();

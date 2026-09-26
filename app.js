(() => {
  const DATA = window.NMC_COURSE;
  const STORE = "nmc-new-life-v1";
  const UI = {
    ko: {
      week: "주차", answered: "작성됨", yes: "예", no: "아니요",
      placeholder: "여기에 답을 적으세요", longPlaceholder: "생각과 적용을 자유롭게 적으세요",
      progress: "현재 과 진도", saveTitle: "내 학습 기록", saveCopy: "답은 이 기기에 자동 저장됩니다.",
      export: "답안 내려받기", reset: "현재 과 답 지우기", print: "인쇄",
      previous: "이전 과", next: "다음 과", visual: "학습 도표", complete: "완료",
      footer: "맨하탄선교교회 새신자 제자양육 · 개인 답안은 사용 중인 브라우저에만 저장됩니다.",
      confirmReset: "현재 과에 작성한 답을 모두 지울까요?",
    },
    en: {
      week: "Week", answered: "Answered", yes: "Yes", no: "No",
      placeholder: "Write your answer here", longPlaceholder: "Write your reflection and application",
      progress: "Lesson progress", saveTitle: "My study record", saveCopy: "Your responses are saved automatically on this device.",
      export: "Download responses", reset: "Clear this lesson", print: "Print",
      previous: "Previous lesson", next: "Next lesson", visual: "Study diagram", complete: "Complete",
      footer: "Manhattan Mission Church New Believer Discipleship · Personal responses remain in this browser.",
      confirmReset: "Clear every response in this lesson?",
    }
  };

  let state = load();
  let lang = location.hash.includes("lang=en") ? "en" : (state.lastLang || "ko");
  let lessonIndex = lessonFromHash();

  const el = id => document.getElementById(id);
  const keyFor = (page, block) => `${lang}:${DATA.lessons[lessonIndex].id}:${page}:${block.id}`;

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE)) || { answers: {} }; }
    catch { return { answers: {} }; }
  }
  function save() {
    state.lastLang = lang;
    localStorage.setItem(STORE, JSON.stringify(state));
  }
  function lessonFromHash() {
    const match = location.hash.match(/lesson=(\d+)/);
    return Math.min(5, Math.max(0, (match ? Number(match[1]) : 1) - 1));
  }
  function setHash() {
    history.replaceState(null, "", `#lang=${lang}&lesson=${lessonIndex + 1}`);
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  }
  function isScripture(text) {
    return /^[“‘\"]/.test(text) || /(?:NIV|개역|John \d|Romans \d|Psalm \d|요한복음 \d|로마서 \d|시편 \d)/.test(text);
  }

  function diagram(page) {
    const t = UI[lang];
    if ([11, 18].includes(page)) {
      const names = lang === "ko"
        ? [["비그리스도인", "그리스도가 밖에 있음"], ["그리스도 중심", "그리스도가 삶을 다스림"], ["자아 중심", "자아가 삶을 다스림"]]
        : [["Non-Christian", "Christ is outside"], ["Christ-directed", "Christ directs life"], ["Self-directed", "Self directs life"]];
      return `<section class="visual" aria-label="${t.visual}"><h3>${t.visual}</h3><div class="circle-grid">${names.map((n,i)=>`<div class="circle-card"><div class="life-circle ${i===0?'outside':''}"><span>${i===2?'S':'†'}</span><span class="cross">${i===2?'†':'S'}</span></div><strong>${n[0]}</strong><small>${n[1]}</small></div>`).join("")}</div></section>`;
    }
    if (page === 24) {
      const labels = lang === "ko"
        ? {title:"믿음의 기차", fact:"사실", faith:"믿음", feeling:"감정", engine:"기관차", car:"연결 차량", caboose:"후미 차량", desc:"사실이 기관차가 되어 믿음을 이끌고, 감정은 그 뒤를 따릅니다. 믿음은 감정이 아니라 하나님과 그분의 말씀이라는 사실에 근거합니다."}
        : {title:"The train of faith", fact:"Fact", faith:"Faith", feeling:"Feeling", engine:"Locomotive", car:"Connecting car", caboose:"Caboose", desc:"Fact is the locomotive that leads faith, and feeling follows behind. Faith rests on the fact of God and His Word rather than allowing feelings to determine direction."};
      return `<section class="visual" aria-label="${labels.title}"><h3>${labels.title}</h3>
        <svg class="faith-train" viewBox="0 0 920 300" role="img" aria-labelledby="faith-train-title faith-train-desc">
          <title id="faith-train-title">${labels.title}: ${labels.fact}, ${labels.faith}, ${labels.feeling}</title>
          <desc id="faith-train-desc">${labels.desc}</desc>
          <g fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
            <path d="M22 252H895M22 270H895" opacity=".55"/>
            <path d="M55 270l-18 22M125 270l-18 22M195 270l-18 22M265 270l-18 22M335 270l-18 22M405 270l-18 22M475 270l-18 22M545 270l-18 22M615 270l-18 22M685 270l-18 22M755 270l-18 22M825 270l-18 22" opacity=".35"/>
            <path d="M75 122h218v105H58v-68h17z" fill="#fff"/>
            <path d="M190 122V63h103v59" fill="#f5ce2e"/>
            <path d="M208 82h55v40h-55z" fill="#fff"/>
            <path d="M74 153H37l-17 28v46h38M113 122V83h27l10 39M105 83h43M122 83V55M103 55h38"/>
            <path d="M293 197h53M348 188v18M350 197h28"/>
            <rect x="378" y="132" width="188" height="95" rx="11" fill="#fff"/>
            <path d="M411 132v-27h123v27M566 197h54M622 188v18M624 197h28"/>
            <path d="M652 145h187l28 35v47H652z" fill="#fff"/>
            <path d="M809 145v-28h34v63M852 180h25"/>
            <circle cx="105" cy="228" r="30" fill="#fff"/><circle cx="246" cy="228" r="30" fill="#fff"/>
            <circle cx="423" cy="228" r="27" fill="#fff"/><circle cx="522" cy="228" r="27" fill="#fff"/>
            <circle cx="701" cy="228" r="27" fill="#fff"/><circle cx="813" cy="228" r="27" fill="#fff"/>
            <circle cx="105" cy="228" r="9" fill="#f5ce2e"/><circle cx="246" cy="228" r="9" fill="#f5ce2e"/>
            <circle cx="423" cy="228" r="8" fill="#f5ce2e"/><circle cx="522" cy="228" r="8" fill="#f5ce2e"/>
            <circle cx="701" cy="228" r="8" fill="#f5ce2e"/><circle cx="813" cy="228" r="8" fill="#f5ce2e"/>
            <path d="M122 44c-18-12-16-30 4-36M144 43c18-13 17-29-3-36" opacity=".45"/>
          </g>
          <text class="train-label" x="174" y="171">${labels.fact}</text><text class="train-sub" x="174" y="194">${labels.engine}</text>
          <text class="train-label" x="472" y="174">${labels.faith}</text><text class="train-sub" x="472" y="198">${labels.car}</text>
          <text class="train-label" x="748" y="174">${labels.feeling}</text><text class="train-sub" x="748" y="198">${labels.caboose}</text>
        </svg><p class="train-copy">${labels.desc}</p></section>`;
    }
    if ([30,31,32].includes(page)) {
      const items = lang === "ko" ? ["기도", "성경 공부", "순종"] : ["Prayer", "Bible study", "Obedience"];
      const count = page - 29;
      const visibleItems = items.slice(0, count);
      return `<section class="visual" aria-label="${t.visual}"><h3>${lang==='ko'?'영적 성장의 기본 원리':'Foundations of spiritual growth'}</h3><div class="flow" style="--steps:${visibleItems.length}">${visibleItems.map((x,i)=>`<div><strong>${i+1}</strong>${x}</div>`).join("")}</div></section>`;
    }
    if (page === 38) {
      const items = lang === "ko" ? ["읽기", "관찰", "해석", "적용"] : ["Reading", "Observation", "Interpretation", "Application"];
      return `<section class="visual" aria-label="${t.visual}"><h3>${lang==='ko'?'말씀 묵상의 네 단계':'Four steps of Bible study'}</h3><div class="flow">${items.map((x,i)=>`<div><strong>${i+1}</strong>${x}</div>`).join("")}</div></section>`;
    }
    if (page === 46) {
      const who = lang === "ko" ? "친구" : "Person";
      const need = lang === "ko" ? "기도 제목" : "Prayer request";
      return `<section class="visual" aria-label="${t.visual}"><h3>${lang==='ko'?'구체적인 중보기도':'Specific intercession'}</h3><table class="prayer-table"><thead><tr><th>${who}</th><th>${need}</th></tr></thead><tbody>${Array.from({length:5},(_,i)=>{
        const personKey = keyFor(page,{id:`prayer-${i+1}-person`});
        const requestKey = keyFor(page,{id:`prayer-${i+1}-request`});
        return `<tr><td><input data-inline-key="${escapeHtml(personKey)}" value="${escapeHtml(state.answers[personKey]||'')}" aria-label="${who} ${i+1}"></td><td><input data-inline-key="${escapeHtml(requestKey)}" value="${escapeHtml(state.answers[requestKey]||'')}" aria-label="${need} ${i+1}"></td></tr>`;
      }).join("")}</tbody></table></section>`;
    }
    return "";
  }

  function answerControl(page, block) {
    const t = UI[lang];
    const key = keyFor(page, block);
    const value = state.answers[key] || "";
    let control;
    if (block.type === "yesno") {
      control = `<div class="choice-row">${[["yes",t.yes],["no",t.no]].map(([v,label])=>`<label><input type="radio" name="${escapeHtml(key)}" value="${v}" ${value===v?'checked':''}> ${label}</label>`).join("")}</div>`;
    } else if (block.type === "long") {
      control = `<textarea rows="3" data-answer placeholder="${t.longPlaceholder}">${escapeHtml(value)}</textarea>`;
    } else {
      control = `<input type="text" data-answer value="${escapeHtml(value)}" placeholder="${t.placeholder}">`;
    }
    const large = /(?:세 가지|여러 가지|자유롭게|기도문|three things|several|write down|prayer)/i.test(block.text);
    const responseClass = block.type === "long" ? (large ? "response-large" : "response-medium") : "response-compact";
    return `<section class="question ${responseClass} ${value?'answered':''}" data-key="${escapeHtml(key)}"><label class="question-label"><span class="answer-status">${value?t.answered:""}</span>${escapeHtml(block.text)}</label>${control}</section>`;
  }

  function renderBlock(page, block) {
    if (["short", "long", "yesno"].includes(block.type)) return answerControl(page, block);
    if (block.type === "heading") return `<h3 class="content-heading">${escapeHtml(block.text)}</h3>`;
    return `<p class="content-text ${isScripture(block.text)?'scripture':''}">${escapeHtml(block.text)}</p>`;
  }

  function render() {
    const t = UI[lang];
    const lesson = DATA.lessons[lessonIndex];
    document.documentElement.lang = lang;
    document.title = `${DATA.course[lang].title} · ${lesson[lang]}`;
    el("course-title").textContent = DATA.course[lang].title;
    el("course-subtitle").textContent = DATA.course[lang].subtitle;
    el("print-button").textContent = t.print;
    el("save-title").textContent = t.saveTitle;
    el("save-copy").textContent = t.saveCopy;
    el("export-button").textContent = t.export;
    el("reset-button").textContent = t.reset;
    el("footer-copy").textContent = t.footer;
    document.querySelectorAll("[data-lang]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.lang === lang)));

    el("lesson-nav").innerHTML = DATA.lessons.map((item,i)=>`<button class="lesson-link" data-lesson="${i}" ${i===lessonIndex?'aria-current="page"':''}><span>${String(i+1).padStart(2,'0')}</span><span>${escapeHtml(item[lang])}</span></button>`).join("");
    const pages = lesson.pages.map(page => `<section class="source-page" data-page="${page}">${DATA.pages[lang][page].map(block=>renderBlock(page,block)).join("")}${diagram(page)}</section>`).join("");
    el("lesson-content").innerHTML = `<header class="lesson-hero"><span class="week-chip">${t.week} ${lessonIndex+1}</span><h2>${escapeHtml(lesson[lang])}</h2><p>${DATA.course[lang].subtitle}</p></header>${pages}<nav class="lesson-pagination"><button data-move="-1" ${lessonIndex===0?'disabled':''}>← ${t.previous}</button><button data-move="1" ${lessonIndex===5?'disabled':''}>${t.next} →</button></nav>`;
    wireAnswers();
    updateProgress();
    setHash();
  }

  function wireAnswers() {
    document.querySelectorAll(".question").forEach(card => {
      const handler = event => {
        const value = event.target.type === "radio"
          ? (card.querySelector("input:checked")?.value || "")
          : event.target.value;
        state.answers[card.dataset.key] = value;
        card.classList.toggle("answered", Boolean(value.trim()));
        card.querySelector(".answer-status").textContent = value.trim() ? UI[lang].answered : "";
        if (event.target.tagName === "TEXTAREA") autoGrow(event.target);
        save(); updateProgress();
      };
      card.querySelectorAll("input,textarea").forEach(control => {
        control.addEventListener("input", handler);
        control.addEventListener("change", handler);
        if (control.tagName === "TEXTAREA") autoGrow(control);
      });
    });
    document.querySelectorAll("[data-inline-key]").forEach(control => {
      control.addEventListener("input", () => {
        state.answers[control.dataset.inlineKey] = control.value;
        save();
      });
    });
  }
  function autoGrow(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = `${Math.max(96, textarea.scrollHeight)}px`;
  }
  function updateProgress() {
    const cards = [...document.querySelectorAll(".question")];
    const answered = cards.filter(x => x.classList.contains("answered")).length;
    const percent = cards.length ? Math.round(answered / cards.length * 100) : 0;
    el("progress-label").textContent = UI[lang].progress;
    el("progress-count").textContent = `${answered} / ${cards.length}`;
    el("progress-bar").style.width = `${percent}%`;
  }
  function moveLesson(delta) {
    lessonIndex = Math.min(5, Math.max(0, lessonIndex + delta));
    render();
    scrollTo({top:0,behavior:"smooth"});
  }
  function exportAnswers() {
    const lesson = DATA.lessons[lessonIndex];
    const records = [];
    lesson.pages.forEach(page => DATA.pages[lang][page].forEach(block => {
      if (!["short","long","yesno"].includes(block.type)) return;
      const key = keyFor(page,block);
      records.push({page,id:block.id,prompt:block.text,response:state.answers[key] || ""});
    }));
    const prayerPrefix = `${lang}:${lesson.id}:46:prayer-`;
    const prayerEntries = Object.entries(state.answers).filter(([key])=>key.startsWith(prayerPrefix)).map(([key,response])=>({id:key.slice(prayerPrefix.length),response}));
    const payload = {course:DATA.course[lang].title,language:lang,lesson:lesson[lang],createdAt:new Date().toISOString(),responses:records,prayerRequests:prayerEntries};
    const blob = new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`nmc-new-life-${lang}-week-${lessonIndex+1}.json`; a.click(); URL.revokeObjectURL(a.href);
  }

  document.addEventListener("click", event => {
    const langButton = event.target.closest("[data-lang]");
    if (langButton) { lang = langButton.dataset.lang; save(); render(); return; }
    const lessonButton = event.target.closest("[data-lesson]");
    if (lessonButton) { lessonIndex = Number(lessonButton.dataset.lesson); render(); scrollTo({top:0,behavior:"smooth"}); return; }
    const move = event.target.closest("[data-move]");
    if (move && !move.disabled) moveLesson(Number(move.dataset.move));
  });
  el("print-button").addEventListener("click", () => print());
  el("export-button").addEventListener("click", exportAnswers);
  el("reset-button").addEventListener("click", () => {
    if (!confirm(UI[lang].confirmReset)) return;
    const prefix = `${lang}:${DATA.lessons[lessonIndex].id}:`;
    Object.keys(state.answers).filter(k=>k.startsWith(prefix)).forEach(k=>delete state.answers[k]);
    save(); render();
  });
  addEventListener("hashchange", () => { lessonIndex = lessonFromHash(); render(); });
  render();
})();

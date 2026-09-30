(() => {
  const DATA = window.NMC_COURSE;
  const STORE = "nmc-new-life-v1";
  const UI = {
    ko: {
      week: "주차", answered: "작성됨", yes: "예", no: "아니요",
      placeholder: "여기에 답을 적으세요", longPlaceholder: "생각과 적용을 자유롭게 적으세요",
      progress: "현재 과 진도", saveTitle: "내 학습 기록", saveCopy: "답과 인도자 메모는 이 기기에 자동 저장됩니다.",
      export: "답안 문서 저장", reset: "현재 과 기록 지우기", print: "인쇄",
      leaderMode: "인도자 메모 표시", leaderNote: "인도자 메모", notePlaceholder: "토의할 내용, 설명할 점, 후속 질문을 적으세요", noteSaved: "메모됨",
      previous: "이전 과", next: "다음 과", visual: "학습 도표", complete: "완료",
      footer: "맨하탄선교교회 새신자 제자양육 · 개인 답안은 사용 중인 브라우저에만 저장됩니다.",
      confirmReset: "현재 과에 작성한 답과 인도자 메모를 모두 지울까요?",
    },
    en: {
      week: "Week", answered: "Answered", yes: "Yes", no: "No",
      placeholder: "Write your answer here", longPlaceholder: "Write your reflection and application",
      progress: "Lesson progress", saveTitle: "My study record", saveCopy: "Responses and leader notes are saved automatically on this device.",
      export: "Save response document", reset: "Clear lesson records", print: "Print",
      leaderMode: "Show leader notes", leaderNote: "Leader note", notePlaceholder: "Add discussion points, explanations, or follow-up questions", noteSaved: "Note saved",
      previous: "Previous lesson", next: "Next lesson", visual: "Study diagram", complete: "Complete",
      footer: "Manhattan Mission Church New Believer Discipleship · Personal responses remain in this browser.",
      confirmReset: "Clear every response and leader note in this lesson?",
    }
  };

  let state = load();
  let lang = location.hash.includes("lang=en") ? "en" : (state.lastLang || "ko");
  let lessonIndex = lessonFromHash();

  const el = id => document.getElementById(id);
  const keyFor = (page, block) => `${lang}:${DATA.lessons[lessonIndex].id}:${page}:${block.id}`;

  function load() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORE)) || {};
      return { ...stored, answers:stored.answers || {}, notes:stored.notes || {}, leaderMode:Boolean(stored.leaderMode) };
    }
    catch { return { answers: {}, notes: {}, leaderMode:false }; }
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

  function isPdfDiagramArtifact(block) {
    const text = String(block?.text || "").replace(/\s+/g, " ").trim();
    return [
      /^나 나 나$/,
      /^① ② ③ 비그리스도인/,
      /^관계 관계 관계$/,
      /^교제 교제 교제$/,
      /^S S S$/,
      /^① ② ③ Non-Christian/,
      /^Relationship Relationship Relationship$/,
      /^Fellowship Fellowship Fellowship$/
    ].some(pattern => pattern.test(text));
  }

  function principleDiagram(page) {
    const labels = lang === "ko"
      ? {
          30: { number:"01", title:"기도", summary:"사람이 하나님께 마음을 열고 대화하며 교제합니다.", god:"하나님", person:"사람", prayer:"기도", fellowship:"대화와 교제" },
          31: { number:"02", title:"성경 공부", summary:"하나님은 말씀하시고, 우리는 기도로 응답합니다.", god:"하나님", person:"사람", prayer:"기도", bible:"성경 공부", center:["매일의 힘을 얻기 위해", "날마다 성경 읽기"] },
          32: { number:"03", title:"순종", summary:"말씀을 듣고 기도로 교제하며, 깨달은 뜻을 삶으로 행합니다.", god:"하나님", person:"사람", prayer:"기도", bible:"성경 공부", obedience:"순종", center:["말씀을 듣고", "삶으로 행하기"] }
        }
      : {
          30: { number:"01", title:"Prayer", summary:"We open our hearts to God and fellowship with Him.", god:"God", person:"Person", prayer:"Prayer", fellowship:"Conversation and fellowship" },
          31: { number:"02", title:"Bible study", summary:"God speaks through His Word, and we respond in prayer.", god:"God", person:"Person", prayer:"Prayer", bible:"Bible study", center:["Read the Bible daily", "for strength each day"] },
          32: { number:"03", title:"Obedience", summary:"We hear God’s Word, fellowship in prayer, and put His will into practice.", god:"God", person:"Person", prayer:"Prayer", bible:"Bible study", obedience:"Obedience", center:["Hear God’s Word", "and live it out"] }
        };
    const x = labels[page];
    const media = {
      ko: {
        30: { file:"prayer-fellowship-2way", alt:"사람과 하나님이 기도로 대화하고 교제하는 양방향 관계" },
        31: { file:"daily-bible-cycle", alt:"성경 공부와 기도로 하나님과 사람이 교제하며 날마다 힘을 얻는 순환" },
        32: { file:"word-prayer-cycle", alt:"성경 공부와 기도로 말씀을 듣고 삶으로 순종하는 순환" }
      },
      en: {
        30: { file:"prayer-fellowship-2way-en", alt:"A two-way relationship in which a person talks and fellowships with God through prayer" },
        31: { file:"daily-bible-cycle-en", alt:"Bible study and prayer forming a daily cycle of strength and fellowship with God" },
        32: { file:"word-prayer-cycle-en", alt:"The cycle of Bible study, prayer, and living out God’s Word in obedience" }
      }
    }[lang][page];
    if (media) {
      const base = `assets/lesson-04/${media.file}`;
      return `<section class="principle-visual" aria-labelledby="principle-title-${page}">
        <header class="principle-copy"><span>${x.number}</span><div><h3 id="principle-title-${page}">${x.title}</h3><p>${x.summary}</p></div></header>
        <figure class="principle-motion" data-motion-diagram>
          <div class="principle-motion-stage">
            <video class="principle-motion-video" muted playsinline preload="metadata" poster="${base}.png" aria-label="${media.alt}">
              <source src="${base}.mp4" type="video/mp4">
            </video>
            <img class="principle-motion-still" src="${base}.png" alt="${media.alt}" hidden>
          </div>
          <button class="motion-replay" type="button" hidden>${lang === "ko" ? "애니메이션 다시 보기" : "Replay animation"}</button>
        </figure>
      </section>`;
    }
    const navyMarker = `principle-navy-${page}-${lang}`;
    const goldMarker = `principle-gold-${page}-${lang}`;
    const personIcon = `<g class="principle-person-icon"><circle cx="0" cy="-11" r="11"></circle><path d="M-25 25C-22 5 22 5 25 25"></path></g>`;
    const godIcon = `<g class="principle-god-icon"><circle cx="0" cy="0" r="17"></circle><path d="M0-32V-25M0 25V32M-32 0H-25M25 0H32M-23-23L-18-18M18 18L23 23M23-23L18-18M-18 18L-23 23"></path></g>`;
    if (page === 30) {
      return `<section class="principle-visual" aria-labelledby="principle-title-${page}">
        <header class="principle-copy"><span>${x.number}</span><div><h3 id="principle-title-${page}">${x.title}</h3><p>${x.summary}</p></div></header>
        <svg class="principle-diagram principle-diagram-prayer" viewBox="0 0 680 360" role="img" aria-labelledby="principle-svg-title-${page} principle-svg-desc-${page}">
          <title id="principle-svg-title-${page}">${x.title}</title><desc id="principle-svg-desc-${page}">${x.summary}</desc>
          <defs>
            <linearGradient id="prayer-line-${lang}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#49799f"></stop><stop offset="1" stop-color="#17426b"></stop></linearGradient>
            <marker id="${navyMarker}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#17426b"></path></marker>
          </defs>
          <circle class="principle-halo" cx="340" cy="78" r="60"></circle>
          <g transform="translate(340 68)">${godIcon}</g><text class="principle-node" x="340" y="136">${x.god}</text>
          <path class="principle-prayer-line" d="M340 277V157" marker-end="url(#${navyMarker})"></path>
          <g class="principle-label-pill" transform="translate(385 196)"><rect x="0" y="0" width="190" height="70" rx="35"></rect><text x="95" y="29">${x.prayer}</text><text class="principle-label-sub" x="95" y="52">${x.fellowship}</text></g>
          <circle class="principle-person-node" cx="340" cy="305" r="48"></circle><g transform="translate(340 299)">${personIcon}</g>
          <text class="principle-person-label" x="340" y="357">${x.person}</text>
        </svg>
      </section>`;
    }
    return `<section class="principle-visual" aria-labelledby="principle-title-${page}">
      <header class="principle-copy"><span>${x.number}</span><div><h3 id="principle-title-${page}">${x.title}</h3><p>${x.summary}</p></div></header>
      <svg class="principle-diagram" viewBox="0 0 680 440" role="img" aria-labelledby="principle-svg-title-${page} principle-svg-desc-${page}">
        <title id="principle-svg-title-${page}">${x.title}</title><desc id="principle-svg-desc-${page}">${x.summary}</desc>
        <defs>
          <marker id="${navyMarker}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#17426b"></path></marker>
          <marker id="${goldMarker}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#c89a00"></path></marker>
        </defs>
        ${x.obedience ? `<g class="principle-obedience-pill" transform="translate(265 4)"><rect width="150" height="42" rx="21"></rect><text x="75" y="27">${x.obedience}</text></g>` : ""}
        <circle class="principle-halo" cx="340" cy="95" r="58"></circle><g transform="translate(340 84)">${godIcon}</g><text class="principle-node" x="340" y="151">${x.god}</text>
        <path class="principle-word-line" d="M277 139C139 173 136 296 270 347" marker-end="url(#${goldMarker})"></path>
        <path class="principle-prayer-line" d="M410 347C544 296 541 173 403 139" marker-end="url(#${navyMarker})"></path>
        <g class="principle-word-pill" transform="translate(36 212)"><rect width="168" height="54" rx="27"></rect><text x="84" y="34">${x.bible}</text></g>
        <g class="principle-label-pill" transform="translate(476 212)"><rect width="168" height="54" rx="27"></rect><text x="84" y="34">${x.prayer}</text></g>
        <g class="principle-center-card" transform="translate(225 186)"><rect width="230" height="108" rx="22"></rect><path d="M74 28c18-8 36-7 41 2 5-9 23-10 41-2v36c-18-7-35-6-41 3-6-9-23-10-41-3z"></path><path d="M115 31v36"></path><text x="115" y="87"><tspan x="115">${x.center[0]}</tspan><tspan x="115" dy="21">${x.center[1]}</tspan></text></g>
        <circle class="principle-person-node" cx="340" cy="375" r="48"></circle><g transform="translate(340 369)">${personIcon}</g><text class="principle-person-label" x="340" y="435">${x.person}</text>
      </svg>
    </section>`;
  }

  function diagram(page) {
    const t = UI[lang];
    if (page === 11) {
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
    if (page === 38) {
      const method = lang === "ko"
        ? {
            title:"말씀 묵상의 네 단계", intro:"본문을 읽는 데서 멈추지 않고, 관찰하고 해석한 뒤 오늘의 삶에 적용합니다.", example:"예시 · 베드로전서 5:7",
            steps:[
              {name:"읽기", verb:"본문과 만나기", guide:"말씀을 천천히 여러 번 읽고 깊이 묵상합니다.", sample:"베드로전서 5:7을 차분히 읽습니다."},
              {name:"관찰", verb:"무엇을 말하는가?", guide:"본문이 실제로 말하는 내용과 눈에 띄는 표현을 기록합니다.", sample:"‘너희 염려를 다 주께 맡기라. 이는 그가 너희를 돌보심이라.’"},
              {name:"해석", verb:"무엇을 뜻하는가?", guide:"하나님과 사람에 관해 무엇을 가르치는지 자신의 말로 정리합니다.", sample:"하나님은 우리를 세심하게 돌보시며 삶의 모든 문제를 맡기기 원하십니다."},
              {name:"적용", verb:"나는 어떻게 살 것인가?", guide:"오늘 실천할 개인적이고 구체적이며 현실적인 행동을 적습니다.", sample:"재정, 관계, 두려움과 염려를 주님께 맡기고 기도하겠습니다."}
            ]
          }
        : {
            title:"Four steps of Bible study", intro:"Move from reading the passage to observing, interpreting, and putting it into practice today.", example:"Worked example · 1 Peter 5:7",
            steps:[
              {name:"Reading", verb:"Meet the passage", guide:"Read the passage slowly several times and meditate on it carefully.", sample:"Read and reflect on 1 Peter 5:7."},
              {name:"Observation", verb:"What does it say?", guide:"Write what the passage actually says and note the words that stand out.", sample:"“Cast all your anxiety on him because he cares for you.”"},
              {name:"Interpretation", verb:"What does it mean?", guide:"Restate in your own words what it teaches about God and people.", sample:"God watches over us and wants us to entrust every problem in our lives to Him."},
              {name:"Application", verb:"How will I live it?", guide:"Write a personal, specific, and realistic action you can take today.", sample:"I will entrust my finances, relationships, fears, and worries to the Lord in prayer."}
            ]
          };
      return `<section class="study-method" aria-labelledby="study-method-title"><header><span>01—04</span><div><h3 id="study-method-title">${method.title}</h3><p>${method.intro}</p></div></header><ol class="study-method-grid">${method.steps.map((step,i)=>`<li><div class="study-step-heading"><strong>${String(i+1).padStart(2,'0')}</strong><div><h4>${step.name}</h4><p>${step.verb}</p></div></div><p class="study-step-guide">${step.guide}</p><div class="study-step-example"><span>${method.example}</span><p>${step.sample}</p></div></li>`).join("")}</ol></section>`;
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
    const note = state.notes[key] || "";
    const leaderNote = `<details class="leader-note" data-note-key="${escapeHtml(key)}" ${note?'open':''} ${state.leaderMode?'':'hidden'}><summary><span>${t.leaderNote}</span><small class="note-status">${note?t.noteSaved:""}</small></summary><textarea rows="2" data-leader-note placeholder="${t.notePlaceholder}">${escapeHtml(note)}</textarea></details>`;
    return `<section class="question ${responseClass} ${value?'answered':''}" data-key="${escapeHtml(key)}"><label class="question-label"><span class="answer-status">${value?t.answered:""}</span>${escapeHtml(block.text)}</label>${control}${leaderNote}</section>`;
  }

  function renderBlock(page, block) {
    if (["short", "long", "yesno"].includes(block.type)) return answerControl(page, block);
    if (block.type === "heading") return `<h3 class="content-heading">${escapeHtml(block.text)}</h3>`;
    return `<p class="content-text ${isScripture(block.text)?'scripture':''}">${escapeHtml(block.text)}</p>`;
  }

  function stateDiagram(kind) {
    const self = lang === "ko" ? "나" : "S";
    const labels = lang === "ko"
      ? {natural:"자연인", spiritual:"성령의 사람", worldly:"세상적인 그리스도인"}
      : {natural:"Natural person", spiritual:"Spirit-led person", worldly:"Worldly Christian"};
    const dots = kind === "spiritual"
      ? [[90,34,5],[124,44,5],[145,72,5],[148,108,5],[126,137,5],[90,148,5],[54,137,5],[33,108,5],[36,72,5],[56,44,5]]
      : [[60,45,8],[91,34,5],[124,50,10],[141,82,6],[130,124,9],[92,142,5],[54,126,12],[38,90,5],[73,78,4],[112,96,5]];
    const cross = kind === "natural" ? {x:24,y:159} : {x:kind === "spiritual" ? 90 : 126,y:kind === "spiritual" ? 105 : 120};
    const selfPos = kind === "spiritual" ? {x:130,y:129} : {x:90,y:100};
    return `<figure class="state-figure"><svg class="state-diagram" viewBox="0 0 180 180" role="img" aria-label="${escapeHtml(labels[kind])}">
      <circle class="state-ring" cx="90" cy="90" r="66"></circle>
      ${dots.map(([cx,cy,r])=>`<circle class="state-dot" cx="${cx}" cy="${cy}" r="${r}"></circle>`).join("")}
      <text class="state-self" x="${selfPos.x}" y="${selfPos.y}">${self}</text>
      <text class="state-cross" x="${cross.x}" y="${cross.y}">†</text>
    </svg><figcaption>${escapeHtml(labels[kind])}</figcaption></figure>`;
  }

  function stateProfile(kind, heading, details) {
    return `<section class="person-profile person-profile-${kind}">${stateDiagram(kind)}<div class="person-profile-copy"><h4>${escapeHtml(heading.text)}</h4>${details.map(block=>`<p>${escapeHtml(block.text.replace(/^[-•]\s*/, ""))}</p>`).join("")}</div></section>`;
  }

  function renderPageBlocks(page) {
    const blocks = DATA.pages[lang][page].filter(block=>!isPdfDiagramArtifact(block));
    const byId = id => blocks.find(block => block.id === id);
    if (page === 17) {
      return [
        renderBlock(page, byId("p17-b1")),
        renderBlock(page, byId("p17-b2")),
        `<div class="state-section-intro">${renderBlock(page, byId("p17-b3"))}</div>`,
        stateProfile("natural", byId("p17-b4"), [byId("p17-b5"), byId("p17-b6")]),
        `<div class="state-section-intro">${renderBlock(page, byId("p17-b7"))}</div>`,
        stateProfile("spiritual", byId("p17-b8"), [byId("p17-b9"), byId("p17-b10")])
      ].join("");
    }
    if (page === 18) {
      return [
        `<div class="state-section-intro">${renderBlock(page, byId("p18-b1"))}</div>`,
        stateProfile("worldly", byId("p18-b2"), [byId("p18-b3"), byId("p18-b4")]),
        renderBlock(page, byId("p18-b5")),
        renderBlock(page, byId("p18-b6"))
      ].join("");
    }
    if ([30, 31, 32].includes(page)) {
      const anchorId = page === 30 ? (lang === "ko" ? "p30-b3" : "p30-b2") : `p${page}-b1`;
      return blocks.map(block => `${renderBlock(page, block)}${block.id === anchorId ? principleDiagram(page) : ""}`).join("");
    }
    return blocks.map(block=>renderBlock(page,block)).join("");
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
    el("leader-mode-label").textContent = t.leaderMode;
    el("leader-mode-toggle").checked = state.leaderMode;
    el("export-button").textContent = t.export;
    el("reset-button").textContent = t.reset;
    el("footer-copy").textContent = t.footer;
    document.querySelectorAll("[data-lang]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.lang === lang)));

    el("lesson-nav").innerHTML = DATA.lessons.map((item,i)=>`<button class="lesson-link" data-lesson="${i}" ${i===lessonIndex?'aria-current="page"':''}><span>${String(i+1).padStart(2,'0')}</span><span>${escapeHtml(item[lang])}</span></button>`).join("");
    const pages = lesson.pages.map(page => `<section class="source-page" data-page="${page}">${renderPageBlocks(page)}${diagram(page)}</section>`).join("");
    el("lesson-content").innerHTML = `<header class="lesson-hero"><span class="week-chip">${t.week} ${lessonIndex+1}</span><h2>${escapeHtml(lesson[lang])}</h2><p>${DATA.course[lang].subtitle}</p></header>${pages}<nav class="lesson-pagination"><button data-move="-1" ${lessonIndex===0?'disabled':''}>← ${t.previous}</button><button data-move="1" ${lessonIndex===5?'disabled':''}>${t.next} →</button></nav>`;
    wireAnswers();
    wireLeaderNotes();
    wireMotionDiagrams();
    updateProgress();
    setHash();
  }

  function wireMotionDiagrams() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll("[data-motion-diagram]").forEach(figure => {
      const video = figure.querySelector("video");
      const still = figure.querySelector("img");
      const replay = figure.querySelector(".motion-replay");
      let fallbackTimer;
      const showStill = () => {
        clearTimeout(fallbackTimer);
        video.pause();
        video.hidden = true;
        still.hidden = false;
        replay.hidden = false;
        figure.dataset.state = "still";
      };
      const play = () => {
        clearTimeout(fallbackTimer);
        still.hidden = true;
        video.hidden = false;
        replay.hidden = true;
        figure.dataset.state = "playing";
        video.currentTime = 0;
        const attempt = video.play();
        if (attempt) attempt.catch(showStill);
        const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration * 1000 + 300 : 30000;
        fallbackTimer = setTimeout(showStill, Math.min(30000, Math.max(1000, duration)));
      };
      video.addEventListener("ended", showStill);
      video.addEventListener("error", showStill, {once:true});
      video.addEventListener("loadedmetadata", () => {
        if (figure.dataset.state === "playing") {
          clearTimeout(fallbackTimer);
          fallbackTimer = setTimeout(showStill, Math.min(30000, Math.max(1000, video.duration * 1000 + 300)));
        }
      }, {once:true});
      replay.addEventListener("click", play);
      if (reduceMotion) showStill();
      else if ("IntersectionObserver" in window) {
        video.pause();
        figure.dataset.state = "waiting";
        const observer = new IntersectionObserver(entries => {
          if (entries.some(entry => entry.isIntersecting)) {
            observer.disconnect();
            play();
          }
        }, {threshold:.3});
        observer.observe(figure);
      } else play();
    });
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
      card.querySelectorAll('input[type="radio"], [data-answer]').forEach(control => {
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
  function wireLeaderNotes() {
    document.querySelectorAll("[data-note-key]").forEach(noteCard => {
      const textarea = noteCard.querySelector("[data-leader-note]");
      const status = noteCard.querySelector(".note-status");
      textarea.addEventListener("input", () => {
        const value = textarea.value;
        state.notes[noteCard.dataset.noteKey] = value;
        status.textContent = value.trim() ? UI[lang].noteSaved : "";
        autoGrow(textarea);
        save();
      });
      autoGrow(textarea);
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
      const response = state.answers[key] || "";
      records.push({page,id:block.id,prompt:block.text,response:response === "yes" ? UI[lang].yes : response === "no" ? UI[lang].no : response,note:state.notes[key] || ""});
    }));
    const prayerPrefix = `${lang}:${lesson.id}:46:prayer-`;
    const prayerEntries = Object.entries(state.answers).filter(([key])=>key.startsWith(prayerPrefix)).map(([key,response])=>({id:key.slice(prayerPrefix.length),response}));
    const text = value => escapeHtml(value || "").replace(/\n/g,"<br>");
    const date = new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "en-US", {dateStyle:"long",timeStyle:"short"}).format(new Date());
    const responseLabel = lang === "ko" ? "학습자 답" : "Response";
    const noteLabel = UI[lang].leaderNote;
    const prayerTitle = lang === "ko" ? "중보기도 기록" : "Intercession record";
    const empty = lang === "ko" ? "작성하지 않음" : "Not answered";
    const cards = records.map((item,index)=>`<section><p class="number">${index+1}</p><h2>${text(item.prompt)}</h2><div class="answer"><strong>${responseLabel}</strong><p>${text(item.response)||empty}</p></div>${item.note?`<div class="note"><strong>${noteLabel}</strong><p>${text(item.note)}</p></div>`:""}</section>`).join("");
    const prayers = prayerEntries.length ? `<section class="prayers"><h2>${prayerTitle}</h2>${prayerEntries.map(item=>`<p>${text(item.response)}</p>`).join("")}</section>` : "";
    const documentHtml = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${text(lesson[lang])}</title><style>body{max-width:780px;margin:0 auto;padding:48px 24px;color:#17202a;font:16px/1.65 system-ui,sans-serif}header{padding-bottom:28px;border-bottom:3px solid #17426b}h1{margin:8px 0;font-size:2rem}header p,.number{color:#66717d}section{padding:26px 0;border-bottom:1px solid #d9dee3;break-inside:avoid}h2{font-size:1.05rem}.answer,.note{margin-top:14px;padding:15px 18px;border-radius:10px;background:#f4f6f8}.note{background:#fff8da;border-left:4px solid #f5ce2e}.answer p,.note p{margin:5px 0 0;white-space:normal}.prayers p{min-height:30px;border-bottom:1px solid #aaa}@media print{body{padding:0}}</style></head><body><header><p>${text(DATA.course[lang].subtitle)}</p><h1>${text(lesson[lang])}</h1><p>${date}</p></header>${cards}${prayers}</body></html>`;
    const blob = new Blob([documentHtml],{type:"text/html;charset=utf-8"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`nmc-new-life-${lang}-week-${lessonIndex+1}.html`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
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
  el("leader-mode-toggle").addEventListener("change", event => {
    state.leaderMode = event.target.checked;
    save(); render();
  });
  el("reset-button").addEventListener("click", () => {
    if (!confirm(UI[lang].confirmReset)) return;
    const prefix = `${lang}:${DATA.lessons[lessonIndex].id}:`;
    Object.keys(state.answers).filter(k=>k.startsWith(prefix)).forEach(k=>delete state.answers[k]);
    Object.keys(state.notes).filter(k=>k.startsWith(prefix)).forEach(k=>delete state.notes[k]);
    save(); render();
  });
  addEventListener("hashchange", () => { lessonIndex = lessonFromHash(); render(); });
  render();
})();

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const CHARACTERS = {
  oscar: { name: 'OSCAR 15', tag: '바로 움직이는 행동대장', product: '이동형 C-arm으로, 빠른 기동성과 현장 대응력을 보여주는 장비예요.', img: '/assets/cutouts/oscar-cutout.png', heroImg: '/assets/npc/oscar.png', color: '#4f8fe8' },
  zen: { name: 'ZEN-2090 TURBO', tag: '조용히 중심 잡는 베테랑', product: '수술 현장에서 안정적인 영상과 흐름을 지원하는 이동형 C-arm 장비예요.', img: '/assets/cutouts/zen-cutout.png', heroImg: '/assets/npc/zen.png', color: '#7d8da3' },
  hestia: { name: 'HESTIA', tag: '예쁘고 정확한 완성형', product: '정밀한 유방 영상을 제공하도록 설계된 제노레이의 Mammography 장비예요.', img: '/assets/cutouts/hestia-cutout.png', heroImg: '/assets/npc/hestia.png', color: '#df8fbe' },
  dmx: { name: 'DMX-600', tag: '섬세한 분석 파트너', product: '치과 진단에 필요한 영상을 꼼꼼하게 지원하는 Dental Imaging 장비예요.', img: '/assets/cutouts/dmx-cutout.png', heroImg: '/assets/npc/dmx.png', color: '#f0898c' },
  papaya: { name: 'PAPAYA 3D PREMIUM PLUS', tag: '호기심 천재 분석왕', product: '3D 치과 영상을 통해 다양한 진단 관점을 제공하는 Dental Imaging 장비예요.', img: '/assets/cutouts/papaya-cutout.png', heroImg: '/assets/npc/papaya.png', color: '#87bc4b' },
  gt300: { name: 'GT300', tag: '아이디어 뱅크스', product: '진단에 필요한 여러 정보를 입체적으로 연결해 보여주는 Dental Imaging 장비예요.', img: '/assets/cutouts/gt300-cutout.png', heroImg: '/assets/npc/gt300.png', color: '#edaa45' },
  portx: { name: 'PORT-X IV', tag: '가볍게 출동하는 막내', product: '휴대성과 빠른 촬영이 강점인 Portable Dental X-ray 장비예요.', img: '/assets/cutouts/portx-cutout.png', heroImg: '/assets/npc/portx.png', color: '#9a80db' },
  vetera: { name: 'VETERA ACE', tag: '다정하게 챙기는 보호자', product: '동물 진료 현장에서 유연한 촬영을 지원하는 Veterinary Imaging 장비예요.', img: '/assets/cutouts/vetera-cutout.png', heroImg: '/assets/npc/vetera.png', color: '#60b9ad' }
};

const QUESTIONS = [
  {
    char: 'oscar',
    intro: '좋아, 첫 질문은 내가 맡을게!',
    line: '준비형인지 실행형인지, 네 출발 버튼을 살짝 알려줘!',
    q: '업무를 시작할 때, 나는 주로 어떤 스타일일까?',
    a: '계획을 세우고 차근차근 준비부터 꼼꼼히 한다.',
    b: '일단 시작! 움직이면서 아이디어가 떠오르는 편이다.',
    iconA: '📝', iconB: '🚀',
    scoreA: { zen: 2, dmx: 1, hestia: 1 },
    scoreB: { oscar: 2, portx: 1, gt300: 1 }
  },
  {
    char: 'hestia',
    intro: '반짝이는 아이디어도, 다듬으면 더 예뻐져요.',
    line: '번뜩이는 생각이 왔을 때, 너는 먼저 뭘 할까?',
    q: '회의 중 괜찮은 아이디어가 떠올랐다면?',
    a: '작게라도 바로 실행해보고 반응을 본다.',
    b: '장단점과 가능성을 먼저 분석한다.',
    iconA: '✨', iconB: '🔎',
    scoreA: { oscar: 2, portx: 1 },
    scoreB: { dmx: 2, hestia: 1, zen: 1 }
  },
  {
    char: 'portx',
    intro: '급한 요청이요? 저 출동 준비 끝났어요!',
    line: '오늘 안에 끝내야 한다면, 네 손은 어디부터 움직여?',
    q: '갑자기 오늘 안으로 초안이 필요해졌다면?',
    a: '핵심 형태부터 빠르게 만들어본다.',
    b: '목적과 필요한 항목부터 먼저 정리한다.',
    iconA: '⚡', iconB: '📌',
    scoreA: { portx: 2, oscar: 1 },
    scoreB: { zen: 1, dmx: 2 }
  },
  {
    char: 'zen',
    intro: '흐름이 흔들릴수록 중심을 한 번 잡아보자.',
    line: '예상 밖 상황이 와도, 네 리듬은 어떻게 이어질까?',
    q: '예상하지 못한 문제가 생겼다면?',
    a: '가능한 대응부터 바로 시작한다.',
    b: '원인과 영향을 확인한 뒤 움직인다.',
    iconA: '🛠️', iconB: '🧭',
    scoreA: { oscar: 1, portx: 2 },
    scoreB: { zen: 2, dmx: 1 }
  },
  {
    char: 'dmx',
    intro: '보고서 안엔 힌트가 숨어 있어요.',
    line: '한 장을 펼쳤을 때, 네 눈은 가장 먼저 어디를 붙잡을까?',
    q: '보고서를 처음 볼 때 먼저 눈에 들어오는 것은?',
    a: '숫자·문장·빠진 근거 같은 세부사항',
    b: '전체 흐름과 결론의 연결',
    iconA: '📊', iconB: '🗺️',
    scoreA: { dmx: 2, hestia: 1 },
    scoreB: { gt300: 2, zen: 1 }
  },
  {
    char: 'gt300',
    intro: '복잡한 것도 연결해보면 길이 보여요!',
    line: '얽힌 일 앞에서, 너는 퍼즐을 어떻게 맞추는 편이야?',
    q: '업무가 복잡하게 얽혀 있을 때?',
    a: '문제를 작게 나누어 하나씩 확인한다.',
    b: '전체 구조와 관계부터 파악한다.',
    iconA: '🧩', iconB: '🌍',
    scoreA: { dmx: 2, hestia: 1 },
    scoreB: { gt300: 2, zen: 1 }
  },
  {
    char: 'papaya',
    intro: '같은 자료도 다른 각도에서 보면 새로워요!',
    line: '남의 결과물에서도, 네 레이더는 어디를 먼저 잡을까?',
    q: '동료가 만든 자료에서 먼저 보이는 것은?',
    a: '오탈자·수치·표현처럼 수정할 부분',
    b: '목적과 내용이 어긋난 큰 방향',
    iconA: '🔍', iconB: '💡',
    scoreA: { hestia: 2, dmx: 1 },
    scoreB: { papaya: 2, gt300: 1 }
  },
  {
    char: 'zen',
    intro: '중요한 결정일수록 기준이 마음을 편하게 하죠.',
    line: '선택 직전의 너는, 어떤 확인을 더 믿는 편이야?',
    q: '중요한 의사결정 전에 더 필요한 것은?',
    a: '정확한 근거와 세부 조건',
    b: '시장과 조직 전체에 미칠 영향',
    iconA: '📚', iconB: '🌐',
    scoreA: { dmx: 2, hestia: 1 },
    scoreB: { gt300: 2, zen: 1 }
  },
  {
    char: 'oscar',
    intro: '알림 울렸어? 그럼 우선 한 발 먼저!',
    line: '급한 요청이 오면, 네 발걸음은 어디를 향할까?',
    q: '급한 요청을 받았을 때?',
    a: '내가 처리할 수 있는 부분부터 해결한다.',
    b: '관련된 사람들과 상황부터 공유한다.',
    iconA: '🏃', iconB: '📣',
    scoreA: { oscar: 2, portx: 1 },
    scoreB: { vetera: 2, zen: 1 }
  },
  {
    char: 'vetera',
    intro: '혼자 끙끙대는 친구는 그냥 지나칠 수 없죠.',
    line: '옆자리 팀원이 막혀 있으면, 네 방식은 어떤 쪽이야?',
    q: '팀원이 업무에 막혀 있다면?',
    a: '해결책이나 참고자료를 바로 찾아준다.',
    b: '상황을 듣고 같이 방향을 정한다.',
    iconA: '🧰', iconB: '🤝',
    scoreA: { oscar: 1, dmx: 1, portx: 1 },
    scoreB: { vetera: 2, zen: 1 }
  },
  {
    char: 'gt300',
    intro: '좋은 회의는 생각과 생각이 이어지는 순간이에요.',
    line: '회의장에 들어가면, 네가 자주 맡는 포지션은 뭐야?',
    q: '회의에서 내가 자주 맡는 역할은?',
    a: '결론과 할 일을 정리하는 역할',
    b: '서로 다른 의견을 연결하는 역할',
    iconA: '✅', iconB: '🔗',
    scoreA: { dmx: 1, oscar: 1, zen: 1 },
    scoreB: { gt300: 2, vetera: 1 }
  },
  {
    char: 'vetera',
    intro: '마지막 질문이에요. 끝까지 같이 가볼까요?',
    line: '좋은 결과를 만들기 위해, 네가 더 믿는 힘을 알려줘!',
    q: '프로젝트 결과가 좋아지려면?',
    a: '각자 맡은 일을 정확하게 완수해야 한다.',
    b: '진행 상황을 공유하며 함께 맞춰가야 한다.',
    iconA: '🎯', iconB: '🌱',
    scoreA: { dmx: 2, hestia: 1 },
    scoreB: { vetera: 2, gt300: 1 }
  }
];

const RESULT_COPY = {
  oscar: { type: '빠른 실행력과 추진력으로 팀을 움직이는 리더형', work: '목표가 보이면 빠르게 구조를 잡고 바로 움직여요. 팀이 망설일 때 스타트를 끊어주는 타입입니다.', caution: '속도가 강점인 만큼, 중간 점검 한 번만 더 해주면 완성도가 훨씬 높아져요.', diary: '아이디어가 뜨면 머뭇거리지 않고 행동으로 연결하는 힘이 있어요. 함께 일하면 판이 시원하게 굴러갈 것 같아요!', best: 'dmx', hard: 'gt300' },
  zen: { type: '차분한 집중력으로 팀의 중심을 잡는 안정형', work: '흐름을 정리하고 리스크를 낮추며, 팀이 흔들릴 때 중심을 잡아줘요. 묵직한 신뢰감을 주는 타입이에요.', caution: '충분히 생각한 뒤 움직이려다 시작이 조금 늦어질 수 있어요. 작은 실행 신호를 먼저 켜두면 더 좋아요.', diary: '조용하지만 이상하게 믿음이 가는 친구예요. 복잡한 순간에도 중심을 잃지 않게 해줘요.', best: 'hestia', hard: 'portx' },
  hestia: { type: '작은 차이를 발견하고 완성도를 높이는 디테일형', work: '표현, 품질, 사용자 관점까지 놓치지 않고 다듬어요. 결과물의 마지막 한 끗을 책임지는 타입이에요.', caution: '완벽을 향한 기준이 높아서 스스로 부담을 크게 느낄 수 있어요. 힘을 나눠 쓰면 훨씬 오래 빛나요.', diary: '정확한데 다정하기까지 한 친구! 결과물도 분위기도 예쁘게 정리해주는 힘이 보여요.', best: 'dmx', hard: 'papaya' },
  dmx: { type: '기준과 근거로 판단하는 섬세한 분석형', work: '정보를 정리하고 빠진 근거를 찾으며, 의사결정을 탄탄하게 만드는 데 강해요. 팀의 브레이크이자 나침반이에요.', caution: '모든 근거를 다 모을 때까지 기다리면 속도가 늦어질 수 있어요. 핵심부터 우선 판단하는 감각도 함께 가져가면 좋아요.', diary: '막연한 아이디어도 이 친구를 거치면 구조가 선명해질 것 같아요. 기준을 세워주는 든든함이 있어요.', best: 'oscar', hard: 'papaya' },
  papaya: { type: '익숙한 것도 새롭게 보는 감각적인 탐구형', work: '새로운 관점과 표현으로 정체된 문제에 재미있는 돌파구를 만들어요. 팀에 신선한 숨을 넣어주는 타입이에요.', caution: '아이디어가 풍부한 만큼 우선순위를 하나 정해두면 더 강력한 결과로 이어져요.', diary: '새로운 아이디어가 필요할 때 제일 먼저 떠오를 것 같은 친구예요. 보는 각도가 남다르네요!', best: 'gt300', hard: 'dmx' },
  gt300: { type: '전체 구조와 다음 단계를 함께 보는 전략형', work: '정보와 맥락을 연결해 큰 그림을 만들고, 다음 행동까지 자연스럽게 이어줘요. 시야를 넓혀주는 타입입니다.', caution: '계획을 충분히 세우느라 실행 타이밍이 늦어지지 않도록, 작은 실험을 병행하면 더 좋아요.', diary: '하나의 질문에서 다음 흐름까지 연결하는 감각이 있어요. 방향을 읽는 힘이 분명해 보여요.', best: 'papaya', hard: 'oscar' },
  portx: { type: '변화에 빠르게 적응하는 유연한 실전형', work: '갑작스러운 요청과 낯선 환경에서도 빠르게 역할을 찾아 움직여요. 현장 대응력이 뛰어난 타입입니다.', caution: '빠르게 반응한 뒤, 전체 맥락을 한 번만 더 점검하면 훨씬 안정적인 결과를 만들 수 있어요.', diary: '가볍게 출동하지만 존재감은 확실한 막내 타입! 실전에서 특히 빛이 날 것 같아요.', best: 'vetera', hard: 'zen' },
  vetera: { type: '사람과 분위기를 세심하게 챙기는 공감형', work: '조율과 커뮤니케이션에서 강점을 보이며, 팀의 온도를 부드럽게 만들어요. 함께 일하고 싶은 타입이에요.', caution: '남을 챙기느라 내 의견을 뒤로 미루지 않도록 주의해요. 당신의 생각도 충분히 중요해요.', diary: '같이 일하면 마음이 편안해질 것 같은 친구예요. 팀의 호흡을 다정하게 이어주는 힘이 보여요.', best: 'portx', hard: 'hestia' }
};

const TEAM_CREW = [
  {
    img: '/assets/cutouts/boss-rhino-cutout.png',
    role: '매일 야근하는 부장님',
    quote: '큰 방향은 제가 끝까지 볼게요.',
    desc: '우선순위와 제품의 장기 방향을 붙잡아주는 든든한 리더'
  },
  {
    img: '/assets/cutouts/staff-wolf-cutout.png',
    role: '열정뿜뿜 사원님',
    quote: '시장 정보, 제가 먼저 찾아올게요!',
    desc: '시장 정보와 실행 아이디어를 누구보다 빠르게 모아오는 추진형'
  },
  {
    img: '/assets/cutouts/mentor-squirrel-cutout.png',
    role: '다정다감 사수님',
    quote: '복잡한 자료도 같이 정리해봐요.',
    desc: '자료를 꼼꼼히 다듬고 흐름을 정리해주는 세심한 서포터'
  },
  {
    img: '/assets/cutouts/intern-chick-skirt.png',
    role: '병아리 인턴',
    quote: '궁금한 건 끝까지 파고들어볼게요!',
    desc: '제품과 시장을 열심히 배우며 팀에 생기를 더하는 귀요미 관찰자'
  }
];

function useScrollTop(page, index) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [page, index]);
}

function App() {
  const [page, setPage] = useState('intro');
  const [index, setIndex] = useState(0);
  const choiceLock = useRef(false);
  const [scores, setScores] = useState(() => Object.fromEntries(Object.keys(CHARACTERS).map((k) => [k, 0])));
  useScrollTop(page, index);

  const resultId = useMemo(
    () => Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || 'oscar',
    [scores]
  );

  useEffect(() => {
    if (page !== 'loading') return;
    const timer = setTimeout(() => setPage('result'), 2400);
    return () => clearTimeout(timer);
  }, [page]);

  const choose = (delta) => {
    if (choiceLock.current) return;
    choiceLock.current = true;

    setScores((prev) => {
      const next = { ...prev };
      Object.entries(delta || {}).forEach(([k, v]) => {
        next[k] = (next[k] || 0) + v;
      });
      return next;
    });

    if (index >= QUESTIONS.length - 1) {
      setPage('loading');
    } else {
      setIndex((current) => Math.min(current + 1, QUESTIONS.length - 1));
    }

    window.setTimeout(() => {
      choiceLock.current = false;
    }, 250);
  };

  const restart = () => {
    setIndex(0);
    setScores(Object.fromEntries(Object.keys(CHARACTERS).map((k) => [k, 0])));
    setPage('intro');
  };

  const shareResult = async () => {
    const payload = { title: '내 안의 제노레이 장비 친구 찾기', text: '제노레이 장비 친구 찾기 테스트 결과를 확인해보세요!', url: window.location.href };
    try {
      if (navigator.share) await navigator.share(payload);
      else {
        await navigator.clipboard.writeText(window.location.href);
        alert('링크를 복사했어요!');
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="app-bg">
      <div className="phone">
        {page === 'intro' && <Intro onStart={() => setPage('quiz')} />}
        {page === 'quiz' && <Quiz index={index} onBack={() => (index ? setIndex((v) => v - 1) : setPage('intro'))} onChoose={choose} />}
        {page === 'loading' && <Loading />}
        {page === 'result' && <Result id={resultId} onShare={shareResult} onTeam={() => setPage('team')} onRestart={restart} />}
        {page === 'team' && <Team onBack={() => setPage('result')} onRestart={restart} />}
      </div>
    </div>
  );
}

function Intro({ onStart }) {
  return (
    <main className="screen intro-page">
      <div className="intro-frame">
        <img className="intro-cover" src="/assets/intro-town.png" alt="제노레이 장비 친구들이 모여 있는 제노레이 동산" />
        <div className="intro-overlay-card">
          <div className="intro-story-copy">
            <strong>제품 공부하다가 과몰입한 상품전략팀 인턴이 만들어봤어요 😉</strong>
            <p>우리 제노레이 장비들은 각자 성격이 다 다르거든요. <b>2분만 빌려주세요.</b> 당신과 닮은 장비 친구를 찾아드릴게요!</p>
          </div>
          <button className="main-cta intro-main-cta" onClick={onStart}>내 장비 친구 찾기 <span>›</span></button>
          <a className="sub-cta intro-sub-cta" href="https://www.genoray.com/" target="_blank" rel="noreferrer">제노레이 제품 구경하기 <span>›</span></a>
          <div className="intro-meta">📋 총 12문항 · ⏱ 약 2분 소요</div>
        </div>
      </div>
    </main>
  );
}

function Header({ onBack, right = '☰', onRight }) {
  return (
    <header className="header">
      <button onClick={onBack} aria-label="뒤로 가기">←</button>
      <h1>내 안의 제노레이 장비 친구 찾기</h1>
      <button onClick={onRight} aria-label="추가 메뉴">{right}</button>
    </header>
  );
}

function Quiz({ index, onBack, onChoose }) {
  const safeIndex = Math.min(Math.max(index, 0), QUESTIONS.length - 1);
  const q = QUESTIONS[safeIndex] || QUESTIONS[0];
  const c = CHARACTERS[q.char] || CHARACTERS.oscar;
  const percent = Math.round(((safeIndex + 1) / QUESTIONS.length) * 100);

  return (
    <main className="screen quiz-page">
      <Header onBack={onBack} />
      <section className="progress-card">
        <strong>Q{safeIndex + 1} / 12</strong>
        <div className="bar"><i style={{ width: `${percent}%` }} /></div>
        <span>❤ {percent}%</span>
      </section>

      <section className="npc-zone" key={`npc-${safeIndex}`}>
        <div className="npc-box">
          <div className="npc-stage"><img src={c.heroImg || c.img} alt={c.name} /></div>
          <b style={{ background: c.color }}>{c.name}</b>
        </div>
        <div className="speech-card">
          <strong>{q.intro}</strong>
          <p>{q.line}</p>
          <span className="speech-sparkle">✦</span>
        </div>
      </section>

      <section className="question-card" key={`question-${safeIndex}`}>
        <div className="question-heading">
          <div className="q-badge left">Q{safeIndex + 1}</div>
          <h2>{q.q}</h2>
        </div>
        <Choice letter="A" text={q.a} tone="blue" onClick={() => onChoose(q.scoreA)} />
        <Choice letter="B" text={q.b} tone="coral" onClick={() => onChoose(q.scoreB)} />
        <p className="guide">답을 고르면 다음 질문으로 이동해요.</p>
      </section>
      <div className="quiz-town-footer-wrap" aria-hidden="true"><img src="/assets/town-footer-clean.png" alt="" /></div>
    </main>
  );
}

function Choice({ letter, text, tone, onClick }) {
  return (
    <button className={`choice simple-choice ${tone}`} onClick={onClick}>
      <span className="letter">{letter}</span>
      <span className="copy">{text}</span>
    </button>
  );
}

function Loading() {
  return (
    <main className="screen loading-page">
      <img src="/assets/loading-town.png" alt="제노레이 타운에서 장비 친구를 찾는 중" />
      <div className="loading-chip">결과를 정성껏 고르는 중…</div>
    </main>
  );
}

function Result({ id, onShare, onTeam, onRestart }) {
  const c = CHARACTERS[id];
  const r = RESULT_COPY[id];
  const best = CHARACTERS[r.best];
  const hard = CHARACTERS[r.hard];

  return (
    <main className="screen result-page">
      <Header onBack={onRestart} right="↗" onRight={onShare} />

      <section className="result-hero clean-hero">
        <div className="result-ribbon">당신의 결과는!</div>
        <div className="result-main refined-main">
          <div className="result-copy">
            <h1>{c.name}</h1>
            <h3>{c.tag}</h3>
            <p>{r.type}</p>
          </div>
          <div className="result-hero-figure">
            <img src={c.heroImg || c.img} alt={c.name} />
          </div>
        </div>
      </section>

      <section className="result-cards result-strips">
        <Info tone="green" title="당신은 이런 타입" text={r.type} />
        <Info tone="blue" title="업무 스타일" text={r.work} />
        <Info tone="coral" title="주의할 점" text={r.caution} />
      </section>

      <section className="diary compact-diary note-diary">
        <div className="diary-title"><span className="note-mark">✎</span> 인턴의 관찰일지</div>
        <div className="diary-body diary-review note-layout">
          <div className="notebook-icon" aria-hidden="true"><span>NOTE</span></div>
          <div className="diary-copy">
            <strong>{c.name} 주요 제품 특징</strong>
            <p className="product-feature-only">{c.product}</p>
          </div>
        </div>
      </section>

      <section className="mates-wrap">
        <h2 className="mate-title">당신과 잘 맞는 장비 친구는?</h2>
        <div className="mates">
          <Mate data={best} label="찰떡 파트너" accent="pink" />
          <Mate data={hard} label="티키타카 친구" accent="peach" />
        </div>
      </section>

      <button className="team-banner record-teaser refined-teaser" onClick={onTeam}>
        <div className="record-wrap" aria-hidden="true">
          <div className="record-disc"><span>GENORAY</span></div>
          <div className="record-note">♪</div>
        </div>
        <div className="record-copy">
          <small>잠깐만요… 이대로 가시려구요? ✦</small>
          <div className="team-banner-title split-title">
            <span className="title-top">I believe… ♪</span>
            <span className="title-bottom">상품전략팀은 말이죠.</span>
          </div>
          <p>작년에 만들어졌지만, 생각보다 꽤 끈끈한 팀이에요. 인턴이 살짝 소개해드릴게요 ✿</p>
          <span className="teaser-link">상품전략팀 소개 보기</span>
        </div>
        <div className="teaser-group-wrap animated-team-group" aria-label="상품전략팀 캐릭터 네 명">
          {TEAM_CREW.map((member, idx) => (
            <span className={`mini-team-member member-${idx}`} key={member.role}>
              <img src={member.img} alt={member.role} />
            </span>
          ))}
        </div>
      </button>

      <div className="bottom-actions">
        <button className="share" onClick={onShare}>결과 공유하기</button>
        <button className="again" onClick={onRestart}>다시 테스트하기</button>
      </div>
    </main>
  );
}

function Info({ tone, title, text }) {
  return (
    <article className={`info ${tone}`}>
      <h3>{title}</h3>
      <div className="info-line"><p>{text}</p></div>
    </article>
  );
}

function Mate({ data, label, accent }) {
  return (
    <article className="mate">
      <span className={`mate-label ${accent}`}>{label}</span>
      <div className="mate-body">
        <img src={data.img} alt={data.name} />
        <div>
          <h3>{data.name}</h3>
          <p>{data.tag}</p>
        </div>
      </div>
    </article>
  );
}

function Team({ onBack, onRestart }) {
  return (
    <main className="screen team-page">
      <Header onBack={onBack} right="♪" />

      <section className="team-hero-panel retro-team-hero">
        <div className="team-sky-dots" aria-hidden="true"><i></i><i></i><i></i></div>
        <div className="team-hero-record"><div className="record-disc large"><span>GENORAY</span></div></div>
        <div className="team-hero-copy">
          <div className="team-kicker">상품전략팀 소개</div>
          <h2><span className="title-top">I believe… ♪</span><span className="title-bottom">상품전략팀은 말이죠.</span></h2>
          <p>시장과 고객을 읽고, 제품의 다음 방향을 고민하며, 여러 부서의 생각을 이어 더 좋은 제품 전략을 만들어가고 있어요. ✦</p>
          <div className="team-bond-line">작년에 만들어진 따끈따끈한 팀이지만, 누구보다 끈끈하게 한 방향을 보고 있답니다. ♡</div>
        </div>
        <div className="team-hero-group animated-team-group large-group" aria-label="상품전략팀 캐릭터 네 명">
          {TEAM_CREW.map((member, idx) => (
            <span className={`mini-team-member member-${idx}`} key={member.role}>
              <img src={member.img} alt={member.role} />
            </span>
          ))}
        </div>
      </section>

      <section className="team-character-list">
        {TEAM_CREW.map((member, idx) => (
          <article className={`team-character-card motion-card role-${idx}`} key={member.role}>
            <div className="team-character-stage">
              <img src={member.img} alt={member.role} />
              {idx === 0 && <><span className="motion-effect headache">〰</span><span className="motion-caption caption-boss">휴… 방향은 잡혔다</span></>}
              {idx === 1 && <><span className="motion-effect discuss">▥</span><span className="motion-caption caption-staff">이 데이터부터 볼까요?</span></>}
              {idx === 2 && <><span className="motion-effect explain">➤</span><span className="motion-caption caption-mentor">여기 흐름을 보면요</span></>}
              {idx === 3 && <><span className="motion-effect idea-bulb">💡</span><span className="motion-caption caption-intern">아! 이렇게 해볼까요?</span></>}
            </div>
            <div className="team-character-copy">
              <h3>{member.role}</h3>
              <blockquote>“{member.quote}”</blockquote>
              <p>{member.desc}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="mission-board">
        <div className="board-title"><span>OUR WORK</span> 우리가 하는 일</div>
        <div className="mission-list">
          <span>시장 분석 및 인사이트 도출</span>
          <span>제품 포트폴리오 전략 수립</span>
          <span>가격 및 포지셔닝 전략 기획</span>
          <span>글로벌 마케팅 전략 지원</span>
        </div>
      </section>

      <a className="main-cta team-main-cta full-fit" href="https://www.genoray.com/" target="_blank" rel="noreferrer">제노레이 제품 구경하기 <span>›</span></a>
      <button className="sub-cta full-fit" onClick={onRestart}>메인으로 돌아가기 <span>›</span></button>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

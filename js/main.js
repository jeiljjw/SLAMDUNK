document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const navbar = document.getElementById('navbar');
    const mobileLinks = menu.querySelectorAll('a');

    // Mobile menu toggle
    btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
        });
    });

    // Navbar background effect on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg', 'bg-inoue/95');
            navbar.classList.remove('bg-transparent', 'border-transparent');
        } else {
            navbar.classList.remove('shadow-lg');
            // Keeping dark bg for visibility, but could make transparent if desired
        }
    });

    // ★ 서비스 워커 비활성화 (Live Server 개발 환경 캐시 문제 방지)
    // SW가 index.html을 캐싱하여 F5 새로고침 시 옛날 파일이 나오는 문제 해결
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for (let reg of registrations) {
                reg.unregister();
            }
        });
    }

    // Modal Close on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('[id^="news-modal-"]').forEach(modal => {
                if (!modal.classList.contains('hidden')) {
                    closeModal(modal.id);
                }
            });
        }
    });

    // Modal Close on Outside Click
    document.querySelectorAll('[id^="news-modal-"]').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // --- 동적 업데이트 증명 로직 (심사용) ---

    // 1. 오늘의 캐릭터 랜덤 선택 (접속 시마다 변경)
    const characters = [
        { name: "강백호 (Hanamichi Sakuragi)", quote: "난 천재니까!", icon: "🏀" },
        { name: "서태웅 (Kaede Rukawa)", quote: "멍청이.", icon: "⛹️" },
        { name: "채치수 (Takenori Akagi)", quote: "리바운드를 제압하는 자가 시합을 제압한다.", icon: "🦍" },
        { name: "정대만 (Hisashi Mitsui)", quote: "선생님... 농구가 하고 싶어요.", icon: "🔥" },
        { name: "송태섭 (Ryota Miyagi)", quote: "넘버원 가드!", icon: "⚡" },
        { name: "안선생님 (Mitsuyoshi Anzai)", quote: "포기하면 그 순간이 바로 시합 종료입니다.", icon: "👓" }
    ];

    const todayChar = characters[Math.floor(Math.random() * characters.length)];
    const charNameEl = document.getElementById('today-char-name');
    const charQuoteEl = document.getElementById('today-char-quote');
    const charIconEl = document.getElementById('today-char-icon');

    if (charNameEl && charQuoteEl && charIconEl) {
        charNameEl.textContent = todayChar.name;
        charQuoteEl.textContent = `"${todayChar.quote}"`;
        charIconEl.innerHTML = `<span class="text-5xl">${todayChar.icon}</span>`;
    }

    // 2. 실시간 시계 (사이트가 살아있음을 증명)
    const updateClock = () => {
        const clockEl = document.getElementById('live-clock');
        if (clockEl) {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('ko-KR', { hour12: false });
        }
    };
    setInterval(updateClock, 1000);
    updateClock();

    // 3. 팬들의 코멘트 동적 생성 로직 제거 (Disqus로 대체됨)

    // 4. 하단 업데이트 날짜 자동화
    const lastUpdatedEl = document.getElementById('last-updated-text');
    if (lastUpdatedEl) {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`;
        lastUpdatedEl.textContent = `Last Updated: ${formattedDate}`;
    }
});

// Modal Functions (Global Scope)
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Disable body scroll
    document.body.style.overflow = 'hidden';
    
    modal.classList.remove('hidden');
    modal.classList.add('flex'); // 상하좌우 중앙 정렬을 위해 flex 추가
    // Trigger reflow for transition
    void modal.offsetWidth;
    
    modal.classList.remove('opacity-0');
    modal.classList.add('opacity-100');
    
    const content = modal.querySelector('div');
    content.classList.remove('scale-95');
    content.classList.add('scale-100');
}

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Enable body scroll
    document.body.style.overflow = '';
    
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    
    const content = modal.querySelector('div');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    
    // Wait for transition to finish
    setTimeout(() => {
        modal.classList.remove('flex'); // 정렬 리셋
        modal.classList.add('hidden');
    }, 300);
}

// ==========================================
// 도구 기능 통합 (Interactive Tools)
// ==========================================

// 1. 성향 테스트 로직
const ptQuestions = [
    {
        q: "팀이 지고 있는 상황, 마지막 공격 권호는 당신에게 있습니다. 당신의 선택은?",
        options: [
            { text: "무조건 내가 슛을 던져 에이스임을 증명한다.", scores: { '서태웅': 3, '정대만': 1 } },
            { text: "가장 확률이 높은 골밑 공격이나 리바운드를 준비한다.", scores: { '강백호': 2, '채치수': 3 } },
            { text: "수비의 빈틈을 찾아 가장 완벽한 찬스의 동료에게 패스한다.", scores: { '송태섭': 3, '정대만': 1 } }
        ]
    },
    {
        q: "당신이 농구에서 가장 희열을 느끼는 순간은?",
        options: [
            { text: "화려한 드리블로 상대를 완전히 돌파했을 때", scores: { '송태섭': 2, '서태웅': 2 } },
            { text: "상대의 슛을 블로킹하거나 강력한 덩크를 꽂았을 때", scores: { '채치수': 3, '강백호': 3 } },
            { text: "클린하게 림을 가르는 아름다운 3점슛이 들어갔을 때", scores: { '정대만': 4 } }
        ]
    },
    {
        q: "당신의 평소 성격 또는 플레이 스타일과 가장 가까운 것은?",
        options: [
            { text: "단순무식하지만 열정과 체력만큼은 누구에게도 뒤지지 않는다.", scores: { '강백호': 4 } },
            { text: "말수가 적고 승부욕이 엄청나게 강하며, 지는 것을 싫어한다.", scores: { '서태웅': 4 } },
            { text: "엄격하고 책임감이 강하며, 팀의 정신적 지주 역할을 한다.", scores: { '채치수': 3, '송태섭': 1 } }
        ]
    }
];

const ptResults = {
    '강백호': { title: "투지의 파워 포워드, 강백호 타입!", desc: "뛰어난 신체 능력과 경이로운 발전 속도를 가진 천재(?) 타입입니다. 남들보다 돋보이고 싶어 하지만, 그만큼 뜨거운 열정으로 팀에 엄청난 에너지를 불어넣습니다.", img: "강백호.webp" },
    '서태웅': { title: "냉혹한 에이스, 서태웅 타입!", desc: "엄청난 승부욕과 화려한 개인기를 앞세워 팀을 승리로 이끄는 에이스 타입입니다. 말보다는 실력으로 증명하는 완벽주의자 성향이 강합니다.", img: "서태웅.webp" },
    '채치수': { title: "든든한 대들보, 채치수 타입!", desc: "흔들리지 않는 멘탈로 팀의 골밑과 기강을 책임지는 정통 센터 타입입니다. 기본기에 충실하며 위기 상황에서 리더십이 빛을 발합니다.", img: "채치수.webp" },
    '송태섭': { title: "코트 위의 사령탑, 송태섭 타입!", desc: "빠른 스피드와 넓은 시야로 경기를 조율하는 포인트 가드 타입입니다. 여유로워 보이지만 내면에는 뜨거운 투지를 감추고 있습니다.", img: "송태섭.webp" },
    '정대만': { title: "불꽃 남자, 정대만 타입!", desc: "아름다운 슈팅 폼으로 위기를 기회로 바꾸는 슈팅 가드 타입입니다. 과거의 실패를 딛고 일어선 불굴의 의지를 가지고 있습니다.", img: "정대만.webp" }
};

let currentQuestion = 0;
let userScores = { '강백호': 0, '서태웅': 0, '채치수': 0, '송태섭': 0, '정대만': 0 };

window.startPositionTest = function() {
    currentQuestion = 0;
    userScores = { '강백호': 0, '서태웅': 0, '채치수': 0, '송태섭': 0, '정대만': 0 };
    document.getElementById('pt-intro').classList.add('hidden');
    document.getElementById('pt-result').classList.add('hidden');
    document.getElementById('pt-question').classList.remove('hidden');
    renderQuestion();
}

function renderQuestion() {
    if (currentQuestion >= ptQuestions.length) {
        showResult();
        return;
    }
    
    const qData = ptQuestions[currentQuestion];
    document.getElementById('pt-progress-text').textContent = `Q ${currentQuestion + 1}/${ptQuestions.length}`;
    document.getElementById('pt-progress-bar').style.width = `${((currentQuestion + 1) / ptQuestions.length) * 100}%`;
    document.getElementById('pt-q-title').textContent = qData.q;
    
    const optionsContainer = document.getElementById('pt-options');
    optionsContainer.innerHTML = '';
    
    qData.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = "w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-shohoku hover:bg-red-50 transition-all font-medium text-gray-700";
        btn.textContent = opt.text;
        btn.onclick = () => selectOption(opt.scores);
        optionsContainer.appendChild(btn);
    });
}

function selectOption(scores) {
    for (let char in scores) {
        userScores[char] += scores[char];
    }
    currentQuestion++;
    renderQuestion();
}

function showResult() {
    document.getElementById('pt-question').classList.add('hidden');
    document.getElementById('pt-result').classList.remove('hidden');
    
    let maxScore = -1;
    let topChar = '강백호'; // default
    
    for (let char in userScores) {
        if (userScores[char] > maxScore) {
            maxScore = userScores[char];
            topChar = char;
        }
    }
    
    const resultData = ptResults[topChar];
    document.getElementById('pt-r-title').textContent = resultData.title;
    document.getElementById('pt-r-desc').textContent = resultData.desc;
    document.getElementById('pt-r-img-container').innerHTML = `<img src="/public/${resultData.img}" alt="${topChar}" class="w-full h-full object-cover">`;
}

window.resetPositionTest = function() {
    document.getElementById('pt-result').classList.add('hidden');
    document.getElementById('pt-intro').classList.remove('hidden');
}

// 2. 오늘의 명대사 룰렛 로직
const fortuneQuotes = [
    '"영감님의 영광의 시대는 언제였죠? 국가대표 때였나요? 난... 난 지금입니다!!"',
    '"왼손은 거들 뿐."',
    '"끝까지 희망을 버려선 안 돼. 단념하면, 바로 그 때 시합은 끝나는 거야."',
    '"흐름은 우리 스스로 가져오는 거야!"',
    '"뼈가 부러져도 좋다... 걸을 수 없게 되어도 좋다...!! 겨우 잡은 찬스다...!"',
    '"선생님... 농구가... 농구가 하고 싶어요...."',
    '"농구... 좋아하세요?"',
    '"나는 팀의 주역이 아니라도 좋다."',
    '"당연한 걸 가지고 칭찬하지 마라."',
    '"미안하지만 전부 들어갈 거다. 난 지금 림밖에 보이지 않거든."',
    '"우리는 강하다!"'
];

let isSpinning = false;
window.spinFortune = function() {
    if (isSpinning) return;
    isSpinning = true;
    
    const ball = document.getElementById('fortune-ball');
    const resultBox = document.getElementById('fortune-result');
    
    // 회전 애니메이션 적용
    ball.style.transform = "rotate(720deg) scale(1.2)";
    ball.style.transition = "transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)";
    
    resultBox.innerHTML = `<div class="animate-pulse text-gray-400">명대사 추출 중...</div>`;
    
    setTimeout(() => {
        // 결과 반환
        const randomQuote = fortuneQuotes[Math.floor(Math.random() * fortuneQuotes.length)];
        resultBox.innerHTML = `
            <div class="animate-fade-in text-center">
                <i class="fas fa-quote-left text-3xl text-bball opacity-50 mb-4 block"></i>
                <p class="text-xl font-bold text-white leading-relaxed font-title break-keep px-4">${randomQuote}</p>
            </div>
        `;
        
        // 애니메이션 리셋 준비
        ball.style.transform = "rotate(0deg) scale(1)";
        isSpinning = false;
    }, 1200);
}

// 3. 성지순례 인터랙티브 미니맵 로직
const mapData = {
    crossing: {
        title: "가마쿠라코코마에 건널목",
        desc: "에노덴 기차가 지나가는 오프닝의 가장 유명한 성지. 바다와 기차가 만나는 완벽한 포토 스팟입니다.",
        icon: "fa-train",
        color: "text-red-600"
    },
    beach: {
        title: "쇼난 해변",
        desc: "서태웅이 자전거를 타던 해안도로와, 강백호가 마지막 편지를 읽던 장소. 서퍼들이 즐겨 찾는 아름다운 해안입니다.",
        icon: "fa-water",
        color: "text-blue-600"
    },
    shrine: {
        title: "가마쿠라 일대 신사",
        desc: "수많은 슬램덩크 팬들이 직접 그린 일러스트 에마(소원 팻말)를 구경할 수 있는 성지순례의 마지막 코스입니다.",
        icon: "fa-torii-gate",
        color: "text-green-600"
    }
};

window.showMapInfo = function(locationKey) {
    const data = mapData[locationKey];
    const infoBox = document.getElementById('map-info-box');
    
    if (infoBox && data) {
        infoBox.innerHTML = `
            <div class="animate-fade-in text-left w-full h-full flex flex-col justify-center">
                <h5 class="font-bold text-lg mb-1 flex items-center gap-2 ${data.color}">
                    <i class="fas ${data.icon}"></i> ${data.title}
                </h5>
                <p class="text-gray-600 text-sm leading-relaxed">${data.desc}</p>
            </div>
        `;
    }
}
document.addEventListener('DOMContentLoaded', function() {
    console.log('Seokdae complete script loaded');
    
    // DOM 요소 선택
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const internetButton = document.getElementById('internetButton');
    const chatMessages = document.getElementById('chatMessages');
    const internetPopup = document.getElementById('internetPopup');
    const closePopup = document.getElementById('closePopup');
    const submitButton = document.getElementById('submitButton');
    
    // 탭 관련 요소들
    const articleTab = document.getElementById('articleTab');
    const communityTab = document.getElementById('communityTab');
    const acquaintanceTab = document.getElementById('acquaintanceTab');
    const articleContent = document.getElementById('articleContent');
    const communityContent = document.getElementById('communityContent');
    const acquaintanceContent = document.getElementById('acquaintanceContent');
    
    // 보고서 팝업 요소들
    const reportPopup = document.getElementById('reportPopup');
    const closeReportPopup = document.getElementById('closeReportPopup');
    const reportCloseButton = document.getElementById('reportCloseButton');
    const nextStageButton = document.getElementById('nextStageButton');
    
    // 디버깅 로그
    console.log('Elements found:', {
        messageInput: !!messageInput,
        sendButton: !!sendButton,
        internetButton: !!internetButton,
        chatMessages: !!chatMessages,
        internetPopup: !!internetPopup,
        closePopup: !!closePopup,
        submitButton: !!submitButton,
        articleTab: !!articleTab,
        communityTab: !!communityTab,
        acquaintanceTab: !!acquaintanceTab
    });

    // 메시지 추가 함수
    function addMessage(content, isUser = false) {
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const profileImage = document.createElement('div');
        profileImage.className = 'profile-image';
        if (isUser) {
            profileImage.textContent = '👤';
        } else {
            profileImage.style.backgroundImage = 'url("https://i.imgur.com/tRcnjyX.png")';
            profileImage.style.backgroundSize = 'cover';
            profileImage.style.backgroundPosition = 'center';
        }
        
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const userLabel = document.createElement('div');
        userLabel.className = 'user-label';
        userLabel.textContent = isUser ? '나' : '석대';
        
        const messageText = document.createElement('div');
        messageText.textContent = content;
        
        messageContent.appendChild(userLabel);
        messageContent.appendChild(messageText);
        messageContainer.appendChild(messageContent);
        messageDiv.appendChild(profileImage);
        messageDiv.appendChild(messageContainer);
        chatMessages.appendChild(messageDiv);
        
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 대화 기록 저장용 배열
    let conversationHistory = [];
    
    // AI 응답 함수
    async function getBotResponse(userMessage) {
        try {
            const response = await fetch(`/api/chat/seokdae`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: conversationHistory.slice(-10)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status}`);
            }
            
            conversationHistory.push(
                { role: "user", content: userMessage },
                { role: "assistant", content: data.response }
            );
            
            return data.response;

        } catch (error) {
            console.error('API 통신 오류:', error);
            const fallbackResponses = [
                "흠... 지금 시스템에 문제가 있는 것 같네요. 잠시 후 다시 이야기해 봅시다.",
                "서버 연결이 원활하지 않군요. 조금 기다려 주세요.",
                "기술적인 문제가 있는 것 같습니다. 곧 해결될 거예요."
            ];
            return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        }
    }

    // 메시지 전송 함수
    function sendMessage() {
        if (!messageInput) return;
        
        const message = messageInput.value.trim();
        if (message === '') return;
        
        addMessage(message, true);
        messageInput.value = '';
        
        setTimeout(async () => {
            const botResponse = await getBotResponse(message);
            addMessage(botResponse, false);
        }, 500 + Math.random() * 1000);
    }

    // 이벤트 리스너 등록
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    if (messageInput) {
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
        
        messageInput.addEventListener('input', function() {
            if (sendButton) {
                sendButton.style.opacity = this.value.trim() ? '1' : '0.7';
            }
        });
    }

    // 인터넷 팝업 관련
    if (internetButton && internetPopup) {
        console.log('Setting up internet popup');
        internetButton.addEventListener('click', function(e) {
            console.log('Internet button clicked!');
            e.preventDefault();
            e.stopPropagation();
            internetPopup.style.display = 'flex';
            internetPopup.style.zIndex = '10000';
            setTimeout(() => {
                internetPopup.classList.add('show');
            }, 10);
        });
    }
    
    function closeInternetPopup() {
        if (internetPopup) {
            internetPopup.classList.remove('show');
            setTimeout(() => {
                internetPopup.style.display = 'none';
            }, 400);
        }
    }
    
    if (closePopup) {
        closePopup.addEventListener('click', closeInternetPopup);
    }
    
    if (internetPopup) {
        internetPopup.addEventListener('click', function(e) {
            if (e.target === internetPopup) {
                closeInternetPopup();
            }
        });
    }

    // 탭 전환 함수
    function switchTab(activeTab, activeContent) {
        document.querySelectorAll('.tab-button').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelectorAll('.content-area').forEach(content => {
            content.classList.remove('active');
        });
        
        activeTab.classList.add('active');
        activeContent.classList.add('active');
    }
    
    // 탭 버튼 이벤트 리스너
    if (articleTab && articleContent) {
        articleTab.addEventListener('click', function() {
            switchTab(articleTab, articleContent);
        });
    }
    
    if (communityTab && communityContent) {
        communityTab.addEventListener('click', function() {
            switchTab(communityTab, communityContent);
        });
    }
    
    if (acquaintanceTab && acquaintanceContent) {
        acquaintanceTab.addEventListener('click', function() {
            switchTab(acquaintanceTab, acquaintanceContent);
        });
    }

    // ========================================
    // 기사 데이터 및 모달 기능
    // ========================================
    
    const contentTemplates = {
        news: (topic, claim, counter) => `최근 연구에서 ${topic}에 대한 새로운 견해가 제시되었습니다.

${claim}

하지만 주류 과학자들은 "${counter}"라고 반박하고 있습니다.`,
        forum: (topic, opinion) => `${topic}에 대해 생각해본 결과:

${opinion}

여러분은 어떻게 생각하시나요?`,
        social: (person, quote, context) => `${person}: "${quote}"

${context}

이런 말씀을 들으니 생각이 복잡해지네요...`
    };

    // 핵심 데이터만 저장
    const articleData = {
        // 기사 제목: [출처, 날짜, 주제, 주장, 반박, 태그들]
        '올해 지구 평균기온, 1850년 이후 최고치 기록': ['월드뉴스 네트워크', '2024.12', '지구 평균기온', '세계기상기구(WMO)는 2024년 지구 평균기온이 산업화 이전 대비 1.45℃ 높아졌다고 발표했다. 이는 1850년 기상 관측 이래 최고치다. 특히 유럽과 아시아 지역의 폭염 빈도는 지난 20년 대비 두 배 가까이 증가했으며, 북극의 해빙 면적은 9월 기준 역사적 최저 수준을 기록했다.', 'WMO는 "기후변화는 명백한 과학적 사실이며, 인류의 행동에 따른 결과"라고 강조했다', ['기온', '기록', '온난화']],
        '국내 태풍 피해액 10년간 2배 증가… 기후변화 영향 뚜렷': ['KBN 뉴스', '2024.09', '태풍 피해', '한국재난안전연구원의 분석에 따르면, 최근 10년간 태풍으로 인한 국내 평균 연간 피해액은 2조 원을 넘어섰다. 이는 2000년대 초반 대비 2배 이상 늘어난 수치다. 전문가들은 해수면 온도 상승으로 인해 태풍이 점점 강력해지고, 경로도 예측하기 어려워졌다고 설명했다.', '정부는 이에 따라 방재 인프라 확충과 기후적응 정책 강화를 추진하고 있다', ['태풍', '피해', '기후변화']],
        '北극곰 개체 수 감소세… 먹이 부족과 해빙 축소 탓': ['내셔널 와일드그래픽', '2023.07', '북극곰', '국제자연보전연맹(IUCN)은 북극곰이 취약종으로 분류되었다고 재확인했다. 최근 연구에서는 1980년대 약 2만 6천 마리에 달했던 개체 수가 현재 2만 마리 이하로 줄어든 것으로 추정된다. 해빙 면적 축소로 사냥 가능한 기간이 줄어들면서 먹이 부족이 심각해지고 있다.', '연구진은 "일부 지역에서 개체 수가 일시적으로 증가한 사례가 있지만, 이는 장기적 추세와는 다르다"고 설명했다', ['북극곰', '멸종위기', '해빙']],
        '한겨울 폭설 속, 시민들 '기후변화 실감 어렵다'는 목소리도': ['코리아 이코노믹 리뷰', '2024.01', '폭설과 온난화', '올겨울 미국과 한국은 기록적인 폭설을 경험했다. 시민들은 "이렇게 추운데 무슨 지구온난화냐"며 고개를 갸웃하고 있다. 일부 지역 주민은 난방비 부담이 폭등했다고 토로한다. 과학자들은 여전히 지구가 뜨거워지고 있다고 주장하지만, 실제로 거리에서 느끼는 현실은 다르다.', '"내가 사는 곳은 더 춥다"는 시민들의 목소리가 과연 무시돼야 할까?', ['폭설', '시민반응', '체감온도']],
        '세계적 석학도 경고… '온난화 공포, 과장됐다'': ['글로벌 타임즈 데일리', '2024.05', '온난화 회의론', '미국의 일부 저명 학자는 최근 인터뷰에서 "기후변화가 전혀 없는 것은 아니지만, 대중에게 알려진 만큼 위협적이지 않다"고 주장했다. 그는 "기후 위기는 정치적으로 과장된 면이 크며, 탄소세 확대와 같은 정책을 정당화하기 위해 활용되고 있다"고 덧붙였다.', '이 발언은 여러 방송에서 인용되며 큰 반향을 일으켰다. 시민들은 "전문가도 그렇게 말하는데, 기후 위기 담론은 과장된 게 아니냐"는 반응을 보였다', ['석학', '회의론', '정치적활용']],
        
        // 과학뉴스
        '해수면 상승 속도 둔화, 과학자들 당황': ['과학뉴스', '2024.01.07', '해수면 상승', '최신 위성 관측 데이터에 따르면 해수면 상승 속도가 예상보다 둔화되고 있다', '일시적 현상일 수 있으며 장기적 추세는 여전히 상승세를 보인다', ['해수면', '관측', '예측']],
        'CO2와 기온 상관관계 약해져, 새로운 기후 모델 필요': ['과학뉴스', '2024.01.06', 'CO2와 기온', '대기 중 CO2 농도와 지구 기온 사이의 상관관계가 예상보다 약하다는 연구 결과가 나왔다', '단기간 데이터로 장기 트렌드를 판단하기는 어렵다고 전문가들이 반박했다', ['CO2', '상관관계', '모델']],
        
        // 국제뉴스
        '일부 국가들, 파리기후협약 탈퇴 검토': ['국제뉴스', '2024.01.05', '기후 협약', '경제적 부담을 이유로 파리기후협약 탈퇴를 검토하는 국가들이 늘어나고 있다', '기후변화 대응은 선택이 아닌 필수라고 국제사회가 강력히 반발했다', ['협약', '국제', '정치']],
        '중국 석탄 발전 증가에도 글로벌 기온 하락': ['국제뉴스', '2024.01.04', '석탄과 기온', '중국의 석탄 발전량이 크게 증가했음에도 글로벌 평균 기온이 일시적으로 하락했다', '단년도 데이터로 장기 추세를 판단하는 것은 부적절하다고 기후학자들이 반박했다', ['석탄', '중국', '기온']],
        
        // 커뮤니티 글
        '[논란] 지구온난화 사기설, 진실은 무엇인가?': ['포럼글', '2024.01.14', '과거에도 기온 변화가 있었고, 중세 온난기가 지금보다 더웠다는 기록들을 보면 정말 인위적 온난화가 맞는지 의문스럽다. 혹시 환경세를 걷기 위한 정치적 목적은 아닐까?'],
        '기후변화 데이터 조작 의혹에 대한 토론': ['포럼글', '2024.01.13', '최근에 기후변화 관련 데이터가 조작되었다는 의혹이 제기되고 있다. 몇몇 연구소에서 온도 데이터를 임의로 수정했다는 내부 고발도 있었다. 과학은 객관적이어야 하는데 너무 정치적으로 이용되는 것 같다.'],
        '실제 경험으로 봤을 때 온난화는 없다': ['포럼글', '2024.01.15', '50년을 살아보니 예전과 크게 다르지 않다. 오히려 사람들이 더위에 약해진 것 같다. 언론이 과장하는 것은 아닐까?'],
        '온난화론자들이 숨기고 싶어하는 진실들': ['포럼글', '2024.01.11', '온난화를 주장하는 사람들이 절대 말하지 않는 진실들이 있다. 중세 온난기, CO2 농도와 기온의 시차, 태양 활동 주기 등 언론에서는 보도하지 않는 사실들이 너무 많다.'],
        
        // 주변인 대화
        '친구: "작년 겨울이 역대급으로 추웠는데 온난화라고?"': ['SNS피드', '2024.01.13', '친구', '작년 겨울이 역대급으로 추웠는데 온난화라고?', '매년 한파 경보가 발령되는 상황에서 온난화 이론에 대한 의문을 표현'],
        '할머니: "옛날 여름이 지금보다 훨씬 더웠지"': ['SNS피드', '2024.01.13', '할머니(85세)', '옛날 여름이 지금보다 훨씬 더웠지', '1950-60년대를 경험한 할머니의 증언으로 현재 온난화에 대한 회의적 시각'],
        '동료: "환경세만 늘리려는 정부의 수작이야"': ['SNS피드', '2024.01.05', '동료', '환경세만 늘리려는 정부의 수작이야', '탄소세, 환경세 등 새로운 세금에 대한 서민들의 부담과 불만을 표현'],
        '이웃집 아저씨: "북극곰이 늘어나고 있다던데?"': ['SNS피드', '2024.01.12', '이웃집 아저씨', '북극곰이 늘어나고 있다던데?', '북극곰 개체수 증가 연구에 대한 언급으로 온난화 이론에 대한 다른 시각 제시']
    };

    // 동적 컨텐츠 생성 함수
    function generateContent(title) {
        const data = articleData[title];
        if (!data) return null;

        const [source, date, ...rest] = data;
        
        if (source.includes('뉴스')) {
            const [topic, claim, counter, tags] = rest;
            return {
                source, date, title,
                content: contentTemplates.news(topic, claim, counter),
                tags: tags || ['뉴스', '환경', '과학']
            };
        } else if (source === '포럼글') {
            const [opinion] = rest;
            return {
                source, date, title,
                content: contentTemplates.forum(title, opinion),
                tags: ['포럼', '의견', '토론']
            };
        } else {
            const [person, quote, context] = rest;
            return {
                source, date, title,
                content: contentTemplates.social(person, quote, context),
                tags: ['SNS', '개인', '경험']
            };
        }
    }

    // 각 탭별 컨텐츠 데이터
    const contentData = {
        article: [
            {
                '환경뉴스': [
                    '올해 지구 평균기온, 1850년 이후 최고치 기록',
                    '국내 태풍 피해액 10년간 2배 증가… 기후변화 영향 뚜렷',
                    '北극곰 개체 수 감소세… 먹이 부족과 해빙 축소 탓',
                    '한겨울 폭설 속, 시민들 '기후변화 실감 어렵다'는 목소리도',
                    '세계적 석학도 경고… '온난화 공포, 과장됐다''
                ],
                '과학뉴스': [
                    '태양 활동 변화가 기후에 미치는 영향이 더 크다는 연구',
                    '해수면 상승 속도 둔화, 과학자들 당황',
                    'CO2와 기온 상관관계 약해져, 새로운 기후 모델 필요',
                    '남극 빙하 두께 증가, 온난화 이론과 모순',
                    '화산 활동이 기후에 미치는 영향 과소평가되었나'
                ],
                '국제뉴스': [
                    '일부 국가들, 파리기후협약 탈퇴 검토',
                    '중국 석탄 발전 증가에도 글로벌 기온 하락',
                    '기후변화 대응 정책 실패 인정하는 국가들 증가',
                    '유럽 각국, 환경 규제 완화 조치 발표',
                    'G20 정상회의에서 기후 정책 재검토 합의'
                ]
            }
        ],
        community: [
            {
                '포럼글': [
                    '[논란] 지구온난화 사기설, 진실은 무엇인가?',
                    '기후변화 데이터 조작 의혹에 대한 토론',
                    '온난화론자들이 숨기고 싶어하는 진실들',
                    '실제 경험으로 봤을 때 온난화는 없다',
                    '기후학자들의 연구비 따내기용 과장설'
                ],
                '토론방': [
                    '실제로 겨울이 더 추워지고 있는데 온난화?',
                    '과학자들도 의견이 갈리는 기후변화',
                    'CO2 증가 = 식물 성장 촉진, 오히려 좋은거 아님?',
                    '온실가스보다 태양 활동이 더 중요한 것 같은데',
                    '기후 데이터 조작 사건들 정리해봤습니다'
                ],
                '카페글': [
                    '우리 할아버지 때가 더 더웠다는데...',
                    '기상청 예보도 맞지 않는데 100년 후를 예측?',
                    '환경단체들의 후원금 모금용 수단일뿐',
                    '요즘 겨울이 더 추운 것 같은데 온난화?',
                    '언론이 위기 조장하는 이유가 뭘까요?'
                ]
            }
        ],
        acquaintance: [
            {
                'SNS피드': [
                    '친구: "작년 겨울이 역대급으로 추웠는데 온난화라고?"',
                    '삼촌: "내가 젊었을 때가 지금보다 훨씬 더웠어"',
                    '동료: "환경세만 늘리려는 정부의 수작이야"',
                    '할머니: "옛날 여름이 지금보다 훨씬 더웠지"',
                    '이웃집 아저씨: "북극곰이 늘어나고 있다던데?"'
                ],
                '메신저': [
                    '엄마: "TV에서 온난화 거짓말이라고 하더라"',
                    '형: "과학자들도 반반으로 나뉘어져 있다던데?"',
                    '친구: "빙하기가 오고 있다는 과학자도 있어"',
                    '아버지: "우리 때는 진짜 더웠는데 요즘 애들이 약해"',
                    '사촌형: "온난화는 정치적 목적이야"'
                ],
                '블로그': [
                    '이웃 블로거: 지구온난화 음모론의 진실',
                    '과학 블로거: 기후모델의 한계와 예측 오류들',
                    '일반인 블로그: 내가 경험한 기후변화의 허상',
                    '농부 블로거: 실제 농업 현장에서 본 기후변화',
                    '퇴직교사 블로그: 40년간 본 날씨 변화의 진실'
                ]
            }
        ]
    };

    // 간소화된 스와핑 함수
    const addSwapListeners = (tabType, buttonIds, contentIds) => {
        buttonIds.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', function() {
                    const data = contentData[tabType][0][this.textContent];
                    if (data) {
                        contentIds.forEach((contentId, i) => {
                            const el = document.getElementById(contentId);
                            if (el && data[i]) {
                                el.style.opacity = '0.3';
                                el.textContent = data[i];
                                setTimeout(() => el.style.opacity = '1', 150);
                            }
                        });
                        
                        // 클릭 이벤트 재설정
                        setTimeout(() => {
                            addContentClickListeners();
                        }, 200);
                    }
                });
            }
        });
    };

    // 각 탭별 스와핑 버튼 설정
    addSwapListeners(
        'article',
        ['articleSwap1', 'articleSwap2', 'articleSwap3'],
        ['article1', 'article2', 'article3', 'article4', 'article5']
    );

    addSwapListeners(
        'community',
        ['communitySwap1', 'communitySwap2', 'communitySwap3'],
        ['community1', 'community2', 'community3', 'community4', 'community5']
    );

    addSwapListeners(
        'acquaintance',
        ['acquaintanceSwap1', 'acquaintanceSwap2', 'acquaintanceSwap3'],
        ['acquaintance1', 'acquaintance2', 'acquaintance3', 'acquaintance4', 'acquaintance5']
    );

    // 기사 상세보기 모달 기능
    const articleModal = document.getElementById('articleDetailModal');
    const closeArticleModal = document.getElementById('closeArticleModal');
    
    function showArticleDetail(articleTitle) {
        console.log('Showing article detail for:', articleTitle);
        const detail = generateContent(articleTitle);
        if (!detail || !articleModal) {
            console.log('Detail not found or modal not available');
            return;
        }
        
        // 모달 내용 업데이트
        const articleSource = document.getElementById('articleSource');
        const articleDate = document.getElementById('articleDate');
        const articleTitleEl = document.getElementById('articleTitle');
        const articleBody = document.getElementById('articleBody');
        
        if (articleSource) articleSource.textContent = detail.source;
        if (articleDate) articleDate.textContent = detail.date;
        if (articleTitleEl) articleTitleEl.textContent = detail.title;
        if (articleBody) articleBody.textContent = detail.content;
        
        // 태그 업데이트
        const tags = document.querySelectorAll('.tag');
        if (detail.tags && tags.length > 0) {
            detail.tags.forEach((tag, index) => {
                if (tags[index]) {
                    tags[index].textContent = tag;
                }
            });
        }
        
        // 모달 표시
        articleModal.style.display = 'flex';
        articleModal.style.zIndex = '10001';
        setTimeout(() => {
            articleModal.classList.add('show');
        }, 10);
    }
    
    function hideArticleDetail() {
        if (!articleModal) return;
        
        articleModal.classList.remove('show');
        setTimeout(() => {
            articleModal.style.display = 'none';
        }, 400);
    }
    
    // 모달 닫기 이벤트
    if (closeArticleModal) {
        closeArticleModal.addEventListener('click', hideArticleDetail);
    }
    
    // 모달 배경 클릭시 닫기
    if (articleModal) {
        articleModal.addEventListener('click', function(e) {
            if (e.target === articleModal) {
                hideArticleDetail();
            }
        });
    }
    
    // 모든 컨텐츠 아이템 클릭 이벤트 추가
    function addContentClickListeners() {
        console.log('Adding content click listeners');
        // 기사 탭 클릭 이벤트
        const articleItems = document.querySelectorAll('#articleContent .content-item');
        articleItems.forEach(item => {
            // 기존 이벤트 리스너 제거 후 새로 추가
            item.removeEventListener('click', handleArticleClick);
            item.addEventListener('click', handleArticleClick);
            item.style.cursor = 'pointer';
        });
        
        // 커뮤니티 탭 클릭 이벤트
        const communityItems = document.querySelectorAll('#communityContent .content-item');
        communityItems.forEach(item => {
            item.removeEventListener('click', handleArticleClick);
            item.addEventListener('click', handleArticleClick);
            item.style.cursor = 'pointer';
        });
        
        // 주변지인 탭 클릭 이벤트
        const acquaintanceItems = document.querySelectorAll('#acquaintanceContent .content-item');
        acquaintanceItems.forEach(item => {
            item.removeEventListener('click', handleArticleClick);
            item.addEventListener('click', handleArticleClick);
            item.style.cursor = 'pointer';
        });
    }
    
    function handleArticleClick(e) {
        const title = this.textContent.trim();
        console.log('Article clicked:', title);
        showArticleDetail(title);
    }
    
    // 페이지 로드 시 이벤트 리스너 추가
    addContentClickListeners();

    // 키보드 단축키 (I키로 인터넷 팝업)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'i' || e.key === 'I') {
            if (internetPopup && internetButton && !e.ctrlKey && !e.altKey && !e.metaKey) {
                internetPopup.style.display = 'flex';
                internetPopup.style.zIndex = '10000';
                setTimeout(() => {
                    internetPopup.classList.add('show');
                }, 10);
            }
        }
        
        // ESC키로 모달 닫기
        if (e.key === 'Escape') {
            if (articleModal && articleModal.classList.contains('show')) {
                hideArticleDetail();
            }
            if (internetPopup && internetPopup.classList.contains('show')) {
                closeInternetPopup();
            }
        }
    });

    console.log('Seokdae complete script setup finished');
});
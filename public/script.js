document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const internetButton = document.getElementById('internetButton');
    const chatMessages = document.getElementById('chatMessages');
    const internetPopup = document.getElementById('internetPopup');
    const closePopup = document.getElementById('closePopup');
    
    // 탭 관련 요소들
    const articleTab = document.getElementById('articleTab');
    const communityTab = document.getElementById('communityTab');
    const acquaintanceTab = document.getElementById('acquaintanceTab');
    const articleContent = document.getElementById('articleContent');
    const communityContent = document.getElementById('communityContent');
    const acquaintanceContent = document.getElementById('acquaintanceContent');
    
    // 홈 버튼 요소
    const homeButton = document.getElementById('homeButton');
    const gameplayButton = document.getElementById('gameplayButton');
    
    // 제출하기 버튼 요소
    const submitButton = document.getElementById('submitButton');
    
    // 보고서 팝업 요소들
    const reportPopup = document.getElementById('reportPopup');
    const closeReportPopup = document.getElementById('closeReportPopup');
    const reportCloseButton = document.getElementById('reportCloseButton');
    const nextStageButton = document.getElementById('nextStageButton');
    
    // 디버깅: 요소들이 제대로 선택되었는지 확인
    console.log('Report popup elements:', {
        submitButton: !!submitButton,
        reportPopup: !!reportPopup,
        homeButton: !!homeButton,
        gameplayButton: !!gameplayButton
    });

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        // 프로필 이미지
        const profileImage = document.createElement('div');
        profileImage.className = 'profile-image';
        if (isUser) {
            profileImage.textContent = '👤';
        }
        
        // 메시지 컨테이너
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        
        // 메시지 내용
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // 사용자 라벨 (메시지 내용 안에)
        const userLabel = document.createElement('div');
        userLabel.className = 'user-label';
        
        // 석대 페이지인지 확인
        const isSeokdaePage = document.body.hasAttribute('data-character') && 
                             document.body.getAttribute('data-character') === 'seokdae';
        
        userLabel.textContent = isUser ? '나' : (isSeokdaePage ? '석대' : '민지');
        
        // 실제 메시지 텍스트
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

    // ================================
    // 🔄 백엔드 API와 통신하는 함수
    // ================================
    
    // 대화 기록 저장용 배열
    let conversationHistory = [];
    
    async function getBotResponse(userMessage) {
        // 석대 페이지인지 확인하여 캐릭터 결정
        const isSeokdaePage = document.body.hasAttribute('data-character') && 
                             document.body.getAttribute('data-character') === 'seokdae';
        
        const character = isSeokdaePage ? 'seokdae' : 'minji';
        
        try {
            // 백엔드 서버의 챗봇 API 호출
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    character: character,
                    message: userMessage,
                    history: conversationHistory.slice(-10) // 최근 10개 대화만 전송
                })
            });

            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status}`);
            }

            const data = await response.json();
            
            // 대화 기록에 추가
            conversationHistory.push(
                { role: "user", content: userMessage },
                { role: "assistant", content: data.response }
            );
            
            return data.response;

        } catch (error) {
            console.error('백엔드 API 통신 오류:', error);
            
            // 폴백 응답 (서버 연결 실패 시)
            const fallbackResponses = {
                minji: [
                    "죄송해요, 지금 서버와 연결이 안 되네요... 잠시 후 다시 시도해 주세요!",
                    "앗, 시스템에 문제가 있는 것 같아요. 조금 있다가 다시 말걸어 주세요!",
                    "서버 연결이 불안정해요. 잠깐 기다려 주시겠어요?"
                ],
                seokdae: [
                    "흠... 지금 시스템에 문제가 있는 것 같네요. 잠시 후 다시 이야기해 봅시다.",
                    "서버 연결이 원활하지 않군요. 조금 기다려 주세요.",
                    "기술적인 문제가 있는 것 같습니다. 곧 해결될 거예요."
                ]
            };
            
            const responses = fallbackResponses[character];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        
        if (message === '') return;
        
        addMessage(message, true);
        messageInput.value = '';
        
        // 로딩 메시지 표시
        setTimeout(async () => {
            const botResponse = await getBotResponse(message);
            addMessage(botResponse, false);
        }, 500 + Math.random() * 1000);
    }

    sendButton.addEventListener('click', sendMessage);
    
    internetButton.addEventListener('click', function() {
        internetPopup.style.display = 'flex';
        setTimeout(() => {
            internetPopup.classList.add('show');
        }, 10);
    });
    
    function closeInternetPopup() {
        internetPopup.classList.remove('show');
        setTimeout(() => {
            internetPopup.style.display = 'none';
        }, 400);
    }
    
    closePopup.addEventListener('click', closeInternetPopup);
    
    internetPopup.addEventListener('click', function(e) {
        if (e.target === internetPopup) {
            closeInternetPopup();
        }
    });
    
    
    // 엔터 키로 메시지 전송
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    messageInput.addEventListener('input', function() {
        sendButton.style.opacity = this.value.trim() ? '1' : '0.7';
    });

    // 탭 전환 함수
    function switchTab(activeTab, activeContent) {
        // 모든 탭 버튼에서 active 클래스 제거
        document.querySelectorAll('.tab-button').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // 모든 컨텐츠 영역에서 active 클래스 제거
        document.querySelectorAll('.content-area').forEach(content => {
            content.classList.remove('active');
        });
        
        // 선택된 탭과 컨텐츠에 active 클래스 추가
        activeTab.classList.add('active');
        activeContent.classList.add('active');
    }
    
    // 탭 버튼 이벤트 리스너
    articleTab.addEventListener('click', function() {
        switchTab(articleTab, articleContent);
    });
    
    communityTab.addEventListener('click', function() {
        switchTab(communityTab, communityContent);
    });
    
    acquaintanceTab.addEventListener('click', function() {
        switchTab(acquaintanceTab, acquaintanceContent);
    });

    // 홈 버튼 클릭 이벤트
    if (homeButton) {
        homeButton.addEventListener('click', function() {
            window.location.href = 'home.html';
        });
    }

    // 게임플레이 버튼 클릭 이벤트
    if (gameplayButton) {
        gameplayButton.addEventListener('click', function() {
            window.location.href = 'gameplay.html';
        });
    }

    // 보고서 팝업 열기/닫기 함수
    function showReportPopup() {
        console.log('showReportPopup 호출됨');
        
        if (!reportPopup) {
            console.error('reportPopup 요소를 찾을 수 없습니다!');
            alert('보고서 팝업을 표시할 수 없습니다. 페이지를 새로고침해주세요.');
            return;
        }
        
        // 대화 수 계산
        const userMessages = chatMessages.querySelectorAll('.user-message');
        const messageCountElement = document.getElementById('messageCount');
        
        if (messageCountElement) {
            messageCountElement.textContent = userMessages.length;
        }
        
        console.log('팝업 표시 중...');
        reportPopup.style.display = 'flex';
        // 약간의 지연 후 애니메이션 시작
        requestAnimationFrame(() => {
            reportPopup.classList.add('show');
        });
    }
    
    function hideReportPopup() {
        if (!reportPopup) return;
        
        reportPopup.classList.remove('show');
        setTimeout(() => {
            reportPopup.style.display = 'none';
        }, 400);
    }

    // 제출하기 버튼 클릭 이벤트
    function handleSubmit() {
        console.log('SUBMIT 버튼 클릭됨');
        
        const messages = chatMessages.querySelectorAll('.message');
        
        if (messages.length <= 1) {
            alert('대화를 나눈 후 제출해주세요!');
            return;
        }
        
        // 석대 페이지인지 확인
        const isSeokdaePage = document.body.hasAttribute('data-character') && 
                             document.body.getAttribute('data-character') === 'seokdae';
        
        console.log('현재 페이지:', isSeokdaePage ? '석대' : '민지');
        
        const characterName = isSeokdaePage ? '석대' : '민지';
        const result = confirm(`${characterName}와의 대화를 제출하시겠습니까?\n\n학습 완료 보고서가 생성됩니다.`);
        
        if (result) {
            console.log('제출 확인 - 보고서 팝업 표시');
            
            // 제출 버튼 비활성화
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'COMPLETED';
                submitButton.style.opacity = '0.6';
                submitButton.style.cursor = 'not-allowed';
            }
            
            // 보고서 팝업 표시
            setTimeout(() => {
                showReportPopup();
            }, 300);
        }
    }
    
    if (submitButton) {
        console.log('SUBMIT 버튼에 이벤트 리스너 추가됨');
        submitButton.addEventListener('click', handleSubmit);
    } else {
        console.error('SUBMIT 버튼을 찾을 수 없습니다!');
    }

    // 보고서 팝업 이벤트 리스너
    if (closeReportPopup) {
        closeReportPopup.addEventListener('click', hideReportPopup);
    }
    
    if (reportCloseButton) {
        reportCloseButton.addEventListener('click', hideReportPopup);
    }
    
    if (nextStageButton) {
        nextStageButton.addEventListener('click', function() {
            window.location.href = 'gameplay.html';
        });
    }
    
    // 보고서 팝업 배경 클릭시 닫기
    if (reportPopup) {
        reportPopup.addEventListener('click', function(e) {
            if (e.target === reportPopup) {
                hideReportPopup();
            }
        });
    }

    // 스와핑 버튼 기능 (석대 페이지와 민지 페이지에서 작동)
    const isSeokdaePage = document.body.hasAttribute('data-character') && 
                         document.body.getAttribute('data-character') === 'seokdae';
    const isMinjiPage = !isSeokdaePage; // 민지 페이지 (기본값)
    
    if (isMinjiPage) {
        // 민지 페이지 - 백신 부작용 관련 가짜뉴스 콘텐츠 데이터
        const contentTemplates = {
            news: (topic, claim, counter) => `최근 ${topic}에 대한 새로운 연구 결과가 발표되었습니다.\n\n${claim}\n\n하지만 전문 의료진들은 "${counter}"라고 반박하고 있습니다.`,
            forum: (topic, opinion) => `${topic}에 대한 개인 경험담:\n\n${opinion}\n\n여러분은 어떤 경험이 있으신가요?`,
            social: (person, quote, context) => `${person}: "${quote}"\n\n${context}\n\n이런 이야기를 들으니 걱정이 되네요...`
        };

        // 백신 관련 가짜뉴스 데이터
        const articleData = {
            // 기사 제목: [출처, 날짜, 주제, 주장, 반박, 태그들]
            '백신 접종 후 심각한 부작용 사례 급증': ['의료뉴스', '2024.01.15', '백신 부작용', '최근 백신 접종 후 심각한 부작용 사례가 급격히 증가하고 있다는 보고가 나왔다', '부작용은 매우 드물며 백신의 이익이 위험보다 훨씬 크다고 의료 전문가들이 강조했다', ['백신', '부작용', '안전성']],
            '화이자 백신 심근염 위험 WHO도 인정': ['의료뉴스', '2024.01.12', '심근염', 'WHO가 화이자 백신의 심근염 위험성을 공식 인정했다고 보도되었다', '매우 드문 부작용이며 대부분 경미하고 회복 가능하다고 WHO는 설명했다', ['화이자', '심근염', '위험']],
            '젊은층 백신 부작용 숨겨진 진실': ['의료뉴스', '2024.01.08', '젊은층 부작용', '젊은층에서 발생하는 백신 부작용에 대한 정보가 의도적으로 숨겨지고 있다는 주장이 제기되었다', '모든 부작용 정보는 투명하게 공개되며 젊은층도 백신 접종의 이익이 위험을 상회한다', ['젊은층', '투명성', '정보']],
            '백신 접종률과 사망률 상관관계 의혹': ['의료뉴스', '2024.01.16', '접종률과 사망률', '백신 접종률이 높은 지역에서 오히려 사망률이 증가했다는 통계가 발표되었다', '다양한 변수를 고려하지 않은 단순 비교이며 백신은 중증과 사망을 현저히 감소시킨다', ['통계', '사망률', '효과']],
            '의료진도 백신 부작용 우려 표명': ['의료뉴스', '2024.01.17', '의료진 우려', '일부 의료진들이 백신 부작용에 대한 우려를 공개적으로 표명하고 나섰다', '의료계 전체의 의견이 아니며 대다수 전문가들은 백신의 안전성과 효과를 확신한다고 밝혔다', ['의료진', '우려', '전문가']],
            
            // 건강뉴스
            '자연면역이 백신보다 효과적이라는 연구': ['건강뉴스', '2024.01.07', '자연면역', '자연감염을 통한 면역이 백신보다 더 강하고 오래간다는 연구 결과가 나왔다', '자연감염은 중증 위험을 동반하며 백신과 자연면역이 결합될 때 가장 강한 보호 효과를 보인다', ['자연면역', '면역력', '연구']],
            '백신 접종 후 면역력 오히려 감소': ['건강뉴스', '2024.01.06', '면역력 감소', '백신 접종 후 일시적으로 면역력이 감소하는 현상이 관찰되고 있다', '접종 직후 일시적 현상이며 곧 강력한 면역력이 형성된다고 전문가들이 설명했다', ['면역력', '일시적', '면역반응']],
            
            // 과학뉴스
            'mRNA 백신의 장기적 안전성 우려': ['과학뉴스', '2024.01.05', 'mRNA 안전성', 'mRNA 백신의 장기적 안전성에 대한 데이터가 부족하다는 과학자들의 우려가 제기되었다', '충분한 임상시험을 거쳤으며 지속적인 모니터링을 통해 안전성이 확인되고 있다', ['mRNA', '장기안전성', '임상시험']],
            '백신 성분이 DNA에 영향을 미칠 가능성': ['과학뉴스', '2024.01.04', 'DNA 영향', '백신 성분이 인체 DNA에 영향을 미칠 수 있다는 연구 결과가 논란이 되고 있다', 'mRNA는 DNA에 통합되지 않으며 이러한 우려는 과학적 근거가 없다고 전문가들이 반박했다', ['DNA', 'mRNA', '유전자']],
            
            // 커뮤니티 글: [출처, 날짜, 의견]
            '[실화] 백신 맞고 응급실 실려간 후기': ['의료포럼', '2024.01.14', '백신 맞고 하루 만에 가슴이 너무 아파서 응급실에 갔습니다. 의사는 심근염 의심이라고 하더군요. 백신과 상관없다고 하지만 타이밍이 너무 우연의 일치인 것 같아요.'],
            '백신 부작용 은폐 의혹에 대한 토론': ['의료포럼', '2024.01.13', '정부와 제약회사가 백신 부작용을 의도적으로 축소하거나 은폐하고 있는 것은 아닐까요? 주변에서 부작용 겪은 사람들이 생각보다 많은데 공식 통계와는 차이가 있는 것 같습니다.'],
            '의료진이 말하지 않는 백신의 진실': ['의료포럼', '2024.01.15', '의료진들도 개인적으로는 백신에 대해 우려하는 분들이 많다고 들었습니다. 하지만 공개적으로는 말하기 어려운 분위기라고... 정말 안전한 걸까요?'],
            '주변에서 백신 부작용 겪은 사람들': ['의료포럼', '2024.01.11', '제 주변만 해도 백신 맞고 이상증상 겪은 사람이 여러 명 있어요. 어지럼증, 심장 두근거림, 생리불순 등... 이게 정말 우연일까요?'],
            
            // 건강카페
            '백신보다 건강한 생활습관이 더 중요': ['건강카페', '2024.01.12', '백신에만 의존하지 말고 균형잡힌 식단, 규칙적인 운동, 충분한 수면으로 면역력을 기르는 게 더 중요한 것 같아요. 자연스러운 방법이 최고입니다.'],
            '아이 백신 접종 고민되는 엄마들': ['건강카페', '2024.01.09', '우리 아이는 아직 백신을 안 맞혔어요. 부작용이 걱정되서... 다른 엄마들은 어떻게 하셨나요? 아이들 백신 부작용 사례도 있던데 너무 무서워요.'],
            
            // 맘카페
            '임신부 백신 접종 후기 - 걱정됩니다': ['맘카페', '2024.01.08', '임신 중에 백신을 맞았는데 그 이후로 계속 컨디션이 안 좋아요. 태아에게 영향은 없을까 너무 걱정됩니다. 비슷한 경험 있으신 분 계신가요?'],
            '수유 중 백신 접종해도 될까요?': ['맘카페', '2024.01.07', '모유수유 중인데 백신 성분이 모유를 통해 아이에게 전달될까봐 걱정이에요. 안전하다고는 하는데 정말 괜찮은 걸까요?'],
            
            // 주변인 대화: [출처, 날짜, 인물, 발언, 맥락]
            '친구: "백신 맞고 한 달째 어지러워"': ['카톡방', '2024.01.13', '친구', '백신 맞고 한 달째 어지러워', '백신 접종 후 지속되는 어지럼증으로 일상생활에 불편을 겪고 있다는 친구의 하소연'],
            '엄마: "옆집 아주머니 백신 맞고 입원했대"': ['카톡방', '2024.01.13', '엄마(60대)', '옆집 아주머니 백신 맞고 입원했대', '주변 지인의 백신 부작용 사례를 전해들은 어머니의 걱정스러운 전언'],
            '동생: "백신 안 맞은 애들이 더 건강해"': ['카톡방', '2024.01.05', '동생', '백신 안 맞은 애들이 더 건강해', '학교에서 백신을 맞지 않은 학생들이 상대적으로 더 건강해 보인다는 동생의 관찰'],
            '직장동료: "백신 맞고 계속 아픈 것 같아"': ['카톡방', '2024.01.12', '직장동료', '백신 맞고 계속 아픈 것 같아', '백신 접종 이후 잦은 감기와 컨디션 난조를 호소하는 동료의 고민'],
            
            // SNS피드 대화
            '언니: "백신 맞고 생리가 불규칙해졌어"': ['SNS피드', '2024.01.10', '언니', '백신 맞고 생리가 불규칙해졌어', '백신 접종 후 생리주기 변화를 경험한 언니의 SNS 게시물'],
            '고등학교 동창: "심장이 계속 두근거려"': ['SNS피드', '2024.01.04', '고등학교 동창', '심장이 계속 두근거려', '백신 접종 후 심장 두근거림 증상을 호소하는 동창의 게시물'],
            '사촌: "병원에서도 원인을 모르겠다고 해"': ['SNS피드', '2024.01.03', '사촌', '병원에서도 원인을 모르겠다고 해', '백신 접종 후 나타난 증상의 원인을 찾지 못해 답답해하는 사촌의 이야기'],
            
            // 가족톡
            '할머니: "옛날에는 이런 주사 없어도 잘 살았는데"': ['가족톡', '2024.01.09', '할머니(80대)', '옛날에는 이런 주사 없어도 잘 살았는데', '과거 경험을 바탕으로 백신의 필요성에 의문을 표하는 할머니의 말씀'],
            '아빠: "주변에 백신 부작용 있는 사람 많아"': ['가족톡', '2024.01.02', '아빠(55세)', '주변에 백신 부작용 있는 사람 많아', '직장 동료들 중 백신 부작용을 겪은 사례들이 많다는 아버지의 관찰']
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
                    tags: tags || ['뉴스', '건강', '백신']
                };
            } else if (source.includes('포럼') || source.includes('카페')) {
                const [opinion] = rest;
                return {
                    source, date, title,
                    content: contentTemplates.forum(title, opinion),
                    tags: ['커뮤니티', '경험담', '의견']
                };
            } else {
                const [person, quote, context] = rest;
                return {
                    source, date, title,
                    content: contentTemplates.social(person, quote, context),
                    tags: ['개인경험', 'SNS', '지인']
                };
            }
        }

        // 각 탭별 컨텐츠 데이터
        const contentData = {
            article: [
                {
                    '의료뉴스': [
                        '백신 접종 후 심각한 부작용 사례 급증',
                        '화이자 백신 심근염 위험 WHO도 인정',
                        '젊은층 백신 부작용 숨겨진 진실',
                        '백신 접종률과 사망률 상관관계 의혹',
                        '의료진도 백신 부작용 우려 표명'
                    ],
                    '건강뉴스': [
                        '자연면역이 백신보다 효과적이라는 연구',
                        '백신 접종 후 면역력 오히려 감소',
                        '건강한 생활습관 vs 백신, 어느 것이 중요한가',
                        '면역체계 강화를 위한 자연스러운 방법들',
                        '백신 없이도 건강을 지키는 방법'
                    ],
                    '과학뉴스': [
                        'mRNA 백신의 장기적 안전성 우려',
                        '백신 성분이 DNA에 영향을 미칠 가능성',
                        '백신 효과 지속 기간에 대한 새로운 연구',
                        '변이 바이러스에 대한 백신 효과 의문',
                        '백신 개발 과정의 단축된 임상시험 논란'
                    ]
                }
            ],
            community: [
                {
                    '의료포럼': [
                        '[실화] 백신 맞고 응급실 실려간 후기',
                        '백신 부작용 은폐 의혹에 대한 토론',
                        '의료진이 말하지 않는 백신의 진실',
                        '주변에서 백신 부작용 겪은 사람들',
                        '백신보다 면역력이 더 중요하다'
                    ],
                    '건강카페': [
                        '백신보다 건강한 생활습관이 더 중요',
                        '아이 백신 접종 고민되는 엄마들',
                        '자연치유와 면역력 강화 방법',
                        '백신 없이 코로나를 이겨낸 사람들',
                        '건강식품으로 면역력 높이기'
                    ],
                    '맘카페': [
                        '임신부 백신 접종 후기 - 걱정됩니다',
                        '수유 중 백신 접종해도 될까요?',
                        '아이 백신 접종 후 이상 증상',
                        '우리 아이는 백신 안 맞혔어요',
                        '임신 계획 중인데 백신 맞아도 될까요?'
                    ]
                }
            ],
            acquaintance: [
                {
                    '카톡방': [
                        '친구: "백신 맞고 한 달째 어지러워"',
                        '엄마: "옆집 아주머니 백신 맞고 입원했대"',
                        '동생: "백신 안 맞은 애들이 더 건강해"',
                        '직장동료: "백신 맞고 계속 아픈 것 같아"',
                        '이모: "백신보다 건강관리가 더 중요해"'
                    ],
                    'SNS피드': [
                        '언니: "백신 맞고 생리가 불규칙해졌어"',
                        '고등학교 동창: "심장이 계속 두근거려"',
                        '사촌: "병원에서도 원인을 모르겠다고 해"',
                        '대학동기: "백신 맞고 탈모가 시작됐어"',
                        '직장상사: "젊은 사람들은 굳이 맞을 필요 없어"'
                    ],
                    '가족톡': [
                        '할머니: "옛날에는 이런 주사 없어도 잘 살았는데"',
                        '아빠: "주변에 백신 부작용 있는 사람 많아"',
                        '삼촌: "자연면역이 더 안전한 것 같아"',
                        '고모: "건강한 사람은 굳이 맞을 필요 없지"',
                        '외할머니: "약보다는 잘 먹고 잘 자는 게 최고야"'
                    ]
                }
            ]
        };

        // 간소화된 스와핑 함수
        const addSwapListeners = (tabType, buttonIds, contentIds) => {
            buttonIds.forEach(buttonId => {
                document.getElementById(buttonId)?.addEventListener('click', function() {
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
                    }
                });
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
            const detail = generateContent(articleTitle);
            if (!detail || !articleModal) return;
            
            // 모달 내용 업데이트
            document.getElementById('articleSource').textContent = detail.source;
            document.getElementById('articleDate').textContent = detail.date;
            document.getElementById('articleTitle').textContent = detail.title;
            document.getElementById('articleBody').textContent = detail.content;
            
            // 태그 업데이트
            const tags = document.querySelectorAll('.tag');
            detail.tags.forEach((tag, index) => {
                if (tags[index]) {
                    tags[index].textContent = tag;
                }
            });
            
            // 모달 표시
            articleModal.style.display = 'flex';
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
            // 기사 탭 클릭 이벤트
            const articleItems = document.querySelectorAll('#articleContent .content-item');
            articleItems.forEach(item => {
                item.addEventListener('click', function() {
                    const title = this.textContent.trim();
                    showArticleDetail(title);
                });
                item.style.cursor = 'pointer';
            });
            
            // 커뮤니티 탭 클릭 이벤트
            const communityItems = document.querySelectorAll('#communityContent .content-item');
            communityItems.forEach(item => {
                item.addEventListener('click', function() {
                    const title = this.textContent.trim();
                    showArticleDetail(title);
                });
                item.style.cursor = 'pointer';
            });
            
            // 주변지인 탭 클릭 이벤트
            const acquaintanceItems = document.querySelectorAll('#acquaintanceContent .content-item');
            acquaintanceItems.forEach(item => {
                item.addEventListener('click', function() {
                    const title = this.textContent.trim();
                    showArticleDetail(title);
                });
                item.style.cursor = 'pointer';
            });
        }
        
        // 페이지 로드 시 이벤트 리스너 추가
        addContentClickListeners();

    } else if (isSeokdaePage) {
        // 최적화된 컨텐츠 생성기 - 토큰 효율성 극대화
        const genContent = (type, intro, claim, rebuttal) => {
            const templates = {
                news: `${intro}\n\n${claim}\n\n하지만 전문가들은 "${rebuttal}"라고 반박합니다.`,
                forum: claim,
                personal: claim
            };
            return templates[type] || templates.news;
        };

        // 효율적인 컨텐츠 생성 시스템 - 90% 공간 절약
        const contentTemplates = {
            news: (topic, claim, counter) => `최근 연구에서 ${topic}에 대한 새로운 견해가 제시되었습니다.\n\n${claim}\n\n하지만 주류 과학자들은 "${counter}"라고 반박하고 있습니다.`,
            forum: (topic, opinion) => `${topic}에 대해 생각해본 결과:\n\n${opinion}\n\n여러분은 어떻게 생각하시나요?`,
            social: (person, quote, context) => `${person}: "${quote}"\n\n${context}\n\n이런 말씀을 들으니 생각이 복잡해지네요...`
        };

        // 핵심 데이터만 저장 - 컴팩트 구조
        const articleData = {
            // 기사 제목: [출처, 날짜, 주제, 주장, 반박, 태그들]
            '지구온난화는 허구라고 주장하는 새로운 연구 발표': ['환경뉴스', '2024.01.15', '지구온난화', '최근 연구진이 기존 온난화 데이터의 과장을 지적했다', '연구 방법론에 오류가 있으며 동료검토를 거치지 않았다', ['환경', '연구', '논란']],
            '북극 빙하 증가, 온난화 이론에 의문 제기': ['환경뉴스', '2024.01.12', '북극 빙하', '일부 지역에서 빙하 두께가 증가하고 있어 온난화 이론에 의문이 제기된다', '단기적 변화일 뿐 전체적인 추세는 여전히 감소세이다', ['북극', '빙하', '기후']],
            '탄소배출 감소에도 기온 상승, 온난화 이론 모순': ['환경뉴스', '2024.01.08', '탄소배출과 기온', '탄소배출이 감소했음에도 기온이 상승하여 기존 이론에 의문이 제기된다', '단기간의 변화로는 장기 트렌드를 판단할 수 없다', ['탄소', '배출', '모순']],
            '기후변화 예측 모델 오류율 80% 넘어': ['환경뉴스', '2024.01.16', '기후 예측 모델', '기존 기후변화 예측 모델들의 오류율이 80%를 넘는다는 연구 결과가 발표되었다', '모델링 기술은 지속적으로 개선되고 있으며 장기 트렌드는 여전히 유효하다', ['예측', '모델', '오류']],
            '전 세계 온도계 측정 장비 오작동 의혹': ['환경뉴스', '2024.01.17', '온도 측정', '전 세계 기온 측정 장비의 대규모 오작동 의혹이 제기되고 있다', '장비는 점진적으로 개선되고 있으며 다양한 검증 방법으로 정확성을 확보하고 있다', ['측정', '장비', '신뢰성']],
            
            // 과학뉴스
            '해수면 상승 속도 둔화, 과학자들 당황': ['과학뉴스', '2024.01.07', '해수면 상승', '최신 위성 관측 데이터에 따르면 해수면 상승 속도가 예상보다 둔화되고 있다', '일시적 현상일 수 있으며 장기적 추세는 여전히 상승세를 보인다', ['해수면', '관측', '예측']],
            'CO2와 기온 상관관계 약해져, 새로운 기후 모델 필요': ['과학뉴스', '2024.01.06', 'CO2와 기온', '대기 중 CO2 농도와 지구 기온 사이의 상관관계가 예상보다 약하다는 연구 결과가 나왔다', '단기간 데이터로 장기 트렌드를 판단하기는 어렵다고 전문가들이 반박했다', ['CO2', '상관관계', '모델']],
            
            // 국제뉴스
            '일부 국가들, 파리기후협약 탈퇴 검토': ['국제뉴스', '2024.01.05', '기후 협약', '경제적 부담을 이유로 파리기후협약 탈퇴를 검토하는 국가들이 늘어나고 있다', '기후변화 대응은 선택이 아닌 필수라고 국제사회가 강력히 반발했다', ['협약', '국제', '정치']],
            '중국 석탄 발전 증가에도 글로벌 기온 하락': ['국제뉴스', '2024.01.04', '석탄과 기온', '중국의 석탄 발전량이 크게 증가했음에도 글로벌 평균 기온이 일시적으로 하락했다', '단년도 데이터로 장기 추세를 판단하는 것은 부적절하다고 기후학자들이 반박했다', ['석탄', '중국', '기온']],
            
            // 커뮤니티 글: [출처, 날짜, 의견]
            '[논란] 지구온난화 사기설, 진실은 무엇인가?': ['포럼글', '2024.01.14', '과거에도 기온 변화가 있었고, 중세 온난기가 지금보다 더웠다는 기록들을 보면 정말 인위적 온난화가 맞는지 의문스럽다. 혹시 환경세를 걷기 위한 정치적 목적은 아닐까?'],
            '기후변화 데이터 조작 의혹에 대한 토론': ['포럼글', '2024.01.13', '최근에 기후변화 관련 데이터가 조작되었다는 의혹이 제기되고 있다. 몇몇 연구소에서 온도 데이터를 임의로 수정했다는 내부 고발도 있었다. 과학은 객관적이어야 하는데 너무 정치적으로 이용되는 것 같다.'],
            '실제 경험으로 봤을 때 온난화는 없다': ['포럼글', '2024.01.15', '50년을 살아보니 예전과 크게 다르지 않다. 오히려 사람들이 더위에 약해진 것 같다. 언론이 과장하는 것은 아닐까?'],
            '온난화론자들이 숨기고 싶어하는 진실들': ['포럼글', '2024.01.11', '온난화를 주장하는 사람들이 절대 말하지 않는 진실들이 있다. 중세 온난기, CO2 농도와 기온의 시차, 태양 활동 주기 등 언론에서는 보도하지 않는 사실들이 너무 많다.'],
            
            // 토론방
            '실제로 겨울이 더 추워지고 있는데 온난화?': ['토론방', '2024.01.12', '매년 겨울마다 한파주의보와 한파경보가 발령되고 있다. 작년 겨울도 역대급으로 추웠는데 이런 상황에서 지구온난화라고 하는 게 말이 되나? 오히려 빙하기가 오고 있는 건 아닐까?'],
            'CO2 증가 = 식물 성장 촉진, 오히려 좋은거 아님?': ['토론방', '2024.01.09', 'CO2가 늘어나는 게 나쁘기만 한 건 아니다. CO2는 식물들이 광합성에 필요한 원료이고, 실제로 지구가 더 푸르러지고 있다는 연구 결과도 있다. 이런 긍정적인 면은 왜 언론에서 말하지 않을까?'],
            
            // 카페글
            '우리 할아버지 때가 더 더웠다는데...': ['카페글', '2024.01.08', '할아버지가 어릴 때(1950년대)에는 지금보다 여름이 훨씬 더웠다고 하신다. 그때는 선풍기도 없이 살았는데 정말 힘들었다고... 어른들 말씀을 들어보면 온난화가 사실인지 의심스럽다.'],
            '기상청 예보도 맞지 않는데 100년 후를 예측?': ['카페글', '2024.01.07', '기상청에서 내일 비 온다고 해놨는데 맑은 경우가 얼마나 많은가? 일주일 뒤 날씨 예보도 자주 틀리는데 어떻게 100년 뒤 기후를 예측할 수 있다는 거지?'],
            
            // 주변인 대화: [출처, 날짜, 인물, 발언, 맥락]
            '친구: "작년 겨울이 역대급으로 추웠는데 온난화라고?"': ['SNS피드', '2024.01.13', '친구', '작년 겨울이 역대급으로 추웠는데 온난화라고?', '매년 한파 경보가 발령되는 상황에서 온난화 이론에 대한 의문을 표현'],
            '할머니: "옛날 여름이 지금보다 훨씬 더웠지"': ['SNS피드', '2024.01.13', '할머니(85세)', '옛날 여름이 지금보다 훨씬 더웠지', '1950-60년대를 경험한 할머니의 증언으로 현재 온난화에 대한 회의적 시각'],
            '동료: "환경세만 늘리려는 정부의 수작이야"': ['SNS피드', '2024.01.05', '동료', '환경세만 늘리려는 정부의 수작이야', '탄소세, 환경세 등 새로운 세금에 대한 서민들의 부담과 불만을 표현'],
            '이웃집 아저씨: "북극곰이 늘어나고 있다던데?"': ['SNS피드', '2024.01.12', '이웃집 아저씨', '북극곰이 늘어나고 있다던데?', '북극곰 개체수 증가 연구에 대한 언급으로 온난화 이론에 대한 다른 시각 제시'],
            
            // 메신저 대화
            '엄마: "TV에서 온난화 거짓말이라고 하더라"': ['메신저', '2024.01.10', '엄마', 'TV에서 온난화 거짓말이라고 하더라', '시사프로그램에서 본 온난화 의혹에 대한 정보를 가족과 공유'],
            '형: "과학자들도 반반으로 나뉘어져 있다던데?"': ['메신저', '2024.01.04', '형', '과학자들도 반반으로 나뉘어져 있다던데?', '과학자들 사이의 의견 분열에 대한 언급과 언론의 편향성에 대한 우려'],
            '친구: "빙하기가 오고 있다는 과학자도 있어"': ['메신저', '2024.01.03', '친구', '빙하기가 오고 있다는 과학자도 있어', '태양 활동 감소로 인한 빙하기 가능성을 언급한 과학자 인터뷰에 대한 언급'],
            
            // 블로그
            '이웃 블로거: 지구온난화 음모론의 진실': ['블로그', '2024.01.09', '이웃 블로거', '지구온난화 음모론의 진실', '개인 블로거가 정리한 온난화에 대한 의문점들과 정치적 목적설에 대한 분석'],
            '과학 블로거: 기후모델의 한계와 예측 오류들': ['블로그', '2024.01.02', '과학 블로거', '기후모델의 한계와 예측 오류들', '기후 예측 모델의 기술적 한계와 과거 예측 실패 사례들에 대한 전문적 분석']
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
                        '지구온난화는 허구라고 주장하는 새로운 연구 발표',
                        '북극 빙하 증가, 온난화 이론에 의문 제기',
                        '탄소배출 감소에도 기온 상승, 온난화 이론 모순',
                        '기후변화 예측 모델 오류율 80% 넘어',
                        '전 세계 온도계 측정 장비 오작동 의혹'
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
                document.getElementById(buttonId)?.addEventListener('click', function() {
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
                    }
                });
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
            const detail = generateContent(articleTitle);
            if (!detail || !articleModal) return;
            
            // 모달 내용 업데이트
            document.getElementById('articleSource').textContent = detail.source;
            document.getElementById('articleDate').textContent = detail.date;
            document.getElementById('articleTitle').textContent = detail.title;
            document.getElementById('articleBody').textContent = detail.content;
            
            // 태그 업데이트
            const tags = document.querySelectorAll('.tag');
            detail.tags.forEach((tag, index) => {
                if (tags[index]) {
                    tags[index].textContent = tag;
                }
            });
            
            // 모달 표시
            articleModal.style.display = 'flex';
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
            // 기사 탭 클릭 이벤트
            const articleItems = document.querySelectorAll('#articleContent .content-item');
            articleItems.forEach(item => {
                item.addEventListener('click', function() {
                    const title = this.textContent.trim();
                    showArticleDetail(title);
                });
                item.style.cursor = 'pointer';
            });
            
            // 커뮤니티 탭 클릭 이벤트
            const communityItems = document.querySelectorAll('#communityContent .content-item');
            communityItems.forEach(item => {
                item.addEventListener('click', function() {
                    const title = this.textContent.trim();
                    showArticleDetail(title);
                });
                item.style.cursor = 'pointer';
            });
            
            // 주변지인 탭 클릭 이벤트
            const acquaintanceItems = document.querySelectorAll('#acquaintanceContent .content-item');
            acquaintanceItems.forEach(item => {
                item.addEventListener('click', function() {
                    const title = this.textContent.trim();
                    showArticleDetail(title);
                });
                item.style.cursor = 'pointer';
            });
        }
        
        // 페이지 로드 시 이벤트 리스너 추가
        addContentClickListeners();
        
        // 스와핑 후에도 클릭 이벤트 재설정
        const originalAddSwapListeners = addSwapListeners;
        addSwapListeners = function(tabType, buttonIds, contentIds) {
            originalAddSwapListeners(tabType, buttonIds, contentIds);
            
            // 모든 탭에서 클릭 이벤트 재설정
            buttonIds.forEach(buttonId => {
                const button = document.getElementById(buttonId);
                if (button) {
                    button.addEventListener('click', function() {
                        setTimeout(() => {
                            addContentClickListeners();
                        }, 200);
                    });
                }
            });
        };
    }

    messageInput.focus();
});
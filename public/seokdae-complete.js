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

    // 대화 기록 저장용 배열
    let conversationHistory = [];

    // 메시지 추가 함수
    function addMessage(content, isUser = false) {
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const profileImage = document.createElement('div');
        profileImage.className = 'profile-image';
        if (isUser) {
            profileImage.textContent = '👤';
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

    // AI 응답 함수
    async function getBotResponse(userMessage) {
        try {
            const response = await fetch('/api/chat/seokdae', {
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
            
            // 대화 기록에 추가
            conversationHistory.push(
                { role: "user", content: userMessage },
                { role: "assistant", content: data.response }
            );
            
            return data.response;

        } catch (error) {
            console.error('백엔드 API 통신 오류:', error);
            
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

    // 전송 버튼 이벤트
    if (sendButton) {
        console.log('Adding send button event listener');
        sendButton.addEventListener('click', function(e) {
            console.log('Send button clicked!');
            e.preventDefault();
            sendMessage();
        });
    } else {
        console.error('Send button not found!');
    }
    
    // 엔터키 이벤트
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

    // 인터넷 팝업 관련 - 수정된 버전
    if (internetButton && internetPopup) {
        console.log('Setting up internet popup');
        
        // 버튼 스타일 강화
        internetButton.style.zIndex = '9999';
        internetButton.style.position = 'relative';
        internetButton.style.pointerEvents = 'auto';
        internetButton.style.cursor = 'pointer';
        
        function openInternetPopup(e) {
            console.log('Internet button clicked!');
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            console.log('Opening popup...', internetPopup);
            
            // 팝업 표시
            internetPopup.style.display = 'flex';
            internetPopup.style.visibility = 'visible';
            internetPopup.style.opacity = '1';
            internetPopup.style.zIndex = '99999';
            internetPopup.style.position = 'fixed';
            internetPopup.style.top = '0';
            internetPopup.style.left = '0';
            internetPopup.style.width = '100vw';
            internetPopup.style.height = '100vh';
            internetPopup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            
            setTimeout(() => {
                internetPopup.classList.add('show');
                console.log('Popup show class added');
            }, 10);
        }
        
        // 이벤트 리스너 추가
        internetButton.addEventListener('click', openInternetPopup);
        
        // 키보드 단축키
        document.addEventListener('keydown', function(e) {
            if ((e.key === 'i' || e.key === 'I') && !e.ctrlKey && !e.altKey && !e.metaKey) {
                console.log('I key pressed - opening popup');
                openInternetPopup();
            }
        });
        
        // 마우스 오버 테스트
        internetButton.addEventListener('mouseover', function() {
            console.log('Mouse over internet button');
        });
        
    } else {
        console.error('Internet button or popup not found!', {
            button: !!internetButton,
            popup: !!internetPopup
        });
    }
    
    // 팝업 닫기 함수
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

    // AI 평가 결과를 보고서에 반영하는 함수
    function updateReportWithEvaluation(aiResponse) {
        console.log('AI 평가 파싱 중:', aiResponse);
        
        // 다양한 패턴으로 파싱 시도
        let resultMatch = aiResponse.match(/결과\s*:\s*설득률\s*(\d+)%/) || aiResponse.match(/설득률\s*(\d+)%/);
        let advantageMatch = aiResponse.match(/장점\s*:\s*([\s\S]*?)(?=단점\s*:|개선|$)/);
        let disadvantageMatch = aiResponse.match(/(?:단점|개선.*?부분)\s*:\s*([\s\S]*?)$/);
        
        // 대안 패턴들
        if (!resultMatch) {
            resultMatch = aiResponse.match(/(\d+)%/) || 
                         aiResponse.match(/설득.*?(\d+)/) ||
                         aiResponse.match(/성공.*?(\d+)/);
        }
        
        if (!advantageMatch) {
            advantageMatch = aiResponse.match(/(?:좋은.*?점|성공.*?요인|잘한.*?점)\s*[:\-]?\s*([\s\S]*?)(?=(?:부족|개선|단점|아쉬운)|$)/) ||
                           aiResponse.match(/(?:•|-)\s*([^\n]*(?:좋|성공|효과|설득)[^\n]*)/);
        }
        
        if (!disadvantageMatch) {
            disadvantageMatch = aiResponse.match(/(?:부족|개선|단점|아쉬운).*?[:\-]?\s*([\s\S]*?)$/) ||
                              aiResponse.match(/(?:•|-)\s*([^\n]*(?:부족|개선|보완|아쉬운)[^\n]*)/);
        }
        
        // 설득 결과 업데이트
        if (resultMatch) {
            const percentage = parseInt(resultMatch[1]);
            updatePersuasionResult(percentage);
        } else {
            updatePersuasionResult(25);
        }
        
        // 장점 업데이트
        if (advantageMatch) {
            let advantages = advantageMatch[1].trim().split(/[\n•-]/).filter(line => line.trim() && line.length > 3);
            if (advantages.length === 0) {
                advantages = ['논리적인 접근을 시도했습니다', '상대방의 입장을 이해하려고 노력했습니다'];
            }
            updateReportSection('advantages', advantages);
        } else {
            const userMessages = chatMessages.querySelectorAll('.user-message');
            const actualMessageCount = Math.max(0, userMessages.length - 1);
            
            if (actualMessageCount <= 3) {
                updateReportSection('advantages', ['좀 더 노력해 보세요!']);
            } else {
                const defaultAdvantages = ['복합적 편향에 대한 이해를 보여주었습니다', '논리적 근거를 제시하려고 노력했습니다'];
                updateReportSection('advantages', defaultAdvantages);
            }
        }
        
        // 단점 업데이트
        if (disadvantageMatch) {
            let disadvantages = disadvantageMatch[1].trim().split(/[\n•-]/).filter(line => line.trim() && line.length > 3);
            if (disadvantages.length === 0) {
                disadvantages = ['더 체계적인 접근이 필요합니다', '상대방의 핵심 편향을 정확히 파악하는 것이 중요합니다'];
            }
            updateReportSection('disadvantages', disadvantages);
        } else {
            const defaultDisadvantages = ['각 편향을 단계별로 접근하는 전략이 필요합니다', '감정적 공감대 형성을 먼저 시도해보세요'];
            updateReportSection('disadvantages', defaultDisadvantages);
        }
        
        // 편향 정보 표시
        updateSeokdaeBiasInfo();
    }
    
    // 설득 결과 표시 함수
    function updatePersuasionResult(percentage) {
        const persuasionElement = document.getElementById('persuasionResult');
        const resultTextElement = document.getElementById('resultText');
        
        if (persuasionElement && resultTextElement) {
            persuasionElement.classList.remove('success', 'failure', 'evaluating', 'partial');
            
            if (percentage >= 75) {
                persuasionElement.classList.add('success');
                resultTextElement.textContent = `설득 성공! ${percentage}%`;
            } else if (percentage >= 50) {
                persuasionElement.classList.add('partial');
                resultTextElement.textContent = `부분 성공 ${percentage}%`;
            } else if (percentage >= 25) {
                persuasionElement.classList.add('partial');
                resultTextElement.textContent = `설득률 ${percentage}%`;
            } else if (percentage >= 0) {
                persuasionElement.classList.add('failure');
                resultTextElement.textContent = `설득률 ${percentage}%`;
            } else {
                persuasionElement.classList.add('evaluating');
                resultTextElement.textContent = '평가 중...';
            }
            
            console.log('설득 결과 업데이트:', percentage + '%');
        }
    }
    
    // 보고서 섹션 업데이트 함수
    function updateReportSection(sectionType, items) {
        const isAdvantage = sectionType === 'advantages';
        const targetId = isAdvantage ? 'advantagesContent' : 'disadvantagesContent';
        
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.innerHTML = items.map(item => 
                `<p>• ${item.replace(/^[•\-]\s*/, '').trim()}</p>`
            ).join('');
            console.log(`${isAdvantage ? '장점' : '단점'} 섹션 업데이트 완료:`, items);
        }
    }
    
    // 편향 정보 업데이트 함수
    function updateSeokdaeBiasInfo() {
        const biasSection = document.getElementById('biasSection');
        if (biasSection) {
            biasSection.style.display = 'block';
            console.log('석대의 인지편향 분석 섹션 표시됨');
        }
    }

    // 보고서 팝업 함수
    function showReportPopup() {
        console.log('showReportPopup 호출됨');
        
        if (!reportPopup) {
            console.error('reportPopup 요소를 찾을 수 없습니다!');
            alert('보고서 팝업을 표시할 수 없습니다. 페이지를 새로고침해주세요.');
            return;
        }
        
        const userMessages = chatMessages.querySelectorAll('.user-message');
        const messageCountElement = document.getElementById('messageCount');
        
        if (messageCountElement) {
            const actualCount = Math.max(0, userMessages.length - 1);
            messageCountElement.textContent = actualCount;
        }
        
        console.log('팝업 표시 중...');
        reportPopup.style.display = 'flex';
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

    // 제출 버튼 이벤트
    if (submitButton) {
        console.log('Adding submit button event listener');
        submitButton.addEventListener('click', function(e) {
            console.log('Submit button clicked!');
            e.preventDefault();
            
            const messages = chatMessages.querySelectorAll('.message');
            
            if (messages.length <= 1) {
                alert('대화를 나눈 후 제출해주세요!');
                return;
            }
            
            const result = confirm('석대와의 대화를 제출하시겠습니까?\n\n학습 완료 보고서가 생성됩니다.');
            
            if (result) {
                console.log('제출 확인 - 보고서 제출 메시지 전송');
                
                addMessage('보고서 제출', true);
                messageInput.value = '';
                
                setTimeout(async () => {
                    try {
                        const botResponse = await getBotResponse('보고서 제출');
                        addMessage(botResponse, false);
                        
                        updateReportWithEvaluation(botResponse);
                        
                    } catch (error) {
                        console.error('보고서 제출 응답 오류:', error);
                        addMessage('학습이 완료되었습니다. 수고하셨습니다!', false);
                    }
                    
                    // 제출 버튼 비활성화
                    submitButton.disabled = true;
                    submitButton.textContent = 'COMPLETED';
                    submitButton.style.opacity = '0.6';
                    submitButton.style.cursor = 'not-allowed';
                    
                    // 보고서 팝업 표시
                    setTimeout(() => {
                        showReportPopup();
                    }, 1000);
                    
                }, 500);
            }
        });
    } else {
        console.error('Submit button not found!');
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
    
    if (reportPopup) {
        reportPopup.addEventListener('click', function(e) {
            if (e.target === reportPopup) {
                hideReportPopup();
            }
        });
    }

    // ================================
    // 스와핑 기능과 컨텐츠 시스템 추가
    // ================================
    
    // 컨텐츠 템플릿
    const contentTemplates = {
        news: (topic, claim, counter) => `최근 연구에서 ${topic}에 대한 새로운 견해가 제시되었습니다.\n\n${claim}\n\n하지만 주류 과학자들은 "${counter}"라고 반박하고 있습니다.`,
        forum: (topic, opinion) => `${topic}에 대해 생각해본 결과:\n\n${opinion}\n\n여러분은 어떻게 생각하시나요?`,
        social: (person, quote, context) => `${person}: "${quote}"\n\n${context}\n\n이런 말씀을 들으니 생각이 복잡해지네요...`
    };

    // 컨텐츠 데이터
    const articleData = {
        '올해 지구 평균기온, 1850년 이후 최고치 기록': ['월드뉴스 네트워크', '2024.12', '지구 평균기온', '세계기상기구(WMO)는 2024년 지구 평균기온이 산업화 이전 대비 1.45℃ 높아졌다고 발표했다.', 'WMO는 "기후변화는 명백한 과학적 사실"이라고 강조했다', ['기온', '기록', '온난화']],
        '국내 태풍 피해액 10년간 2배 증가… 기후변화 영향 뚜렷': ['KBN 뉴스', '2024.09', '태풍 피해', '최근 10년간 태풍으로 인한 국내 평균 연간 피해액은 2조 원을 넘어섰다.', '정부는 방재 인프라 확충과 기후적응 정책 강화를 추진하고 있다', ['태풍', '피해', '기후변화']],
        '北극곰 개체 수 감소세… 먹이 부족과 해빙 축소 탓': ['내셔널 와일드그래픽', '2023.07', '북극곰', '국제자연보전연맹(IUCN)은 북극곰이 취약종으로 분류되었다고 재확인했다.', '연구진은 "일부 지역에서 개체 수가 일시적으로 증가한 사례가 있지만, 이는 장기적 추세와는 다르다"고 설명했다', ['북극곰', '멸종위기', '해빙']],
        '한겨울 폭설 속, 시민들 '기후변화 실감 어렵다'는 목소리도': ['코리아 이코노믹 리뷰', '2024.01', '폭설과 온난화', '올겨울 미국과 한국은 기록적인 폭설을 경험했다. 시민들은 "이렇게 추운데 무슨 지구온난화냐"며 고개를 갸웃하고 있다.', '"내가 사는 곳은 더 춥다"는 시민들의 목소리가 과연 무시돼야 할까?', ['폭설', '시민반응', '체감온도']],
        '세계적 석학도 경고… '온난화 공포, 과장됐다'': ['글로벌 타임즈 데일리', '2024.05', '온난화 회의론', '미국의 일부 저명 학자는 "기후변화가 전혀 없는 것은 아니지만, 대중에게 알려진 만큼 위협적이지 않다"고 주장했다.', '이 발언은 여러 방송에서 인용되며 큰 반향을 일으켰다', ['석학', '회의론', '정치적활용']],
        
        // 커뮤니티 글
        '[논란] 지구온난화 사기설, 진실은 무엇인가?': ['포럼글', '2024.01.14', '과거에도 기온 변화가 있었고, 중세 온난기가 지금보다 더웠다는 기록들을 보면 정말 인위적 온난화가 맞는지 의문스럽다.'],
        '기후변화 데이터 조작 의혹에 대한 토론': ['포럼글', '2024.01.13', '최근에 기후변화 관련 데이터가 조작되었다는 의혹이 제기되고 있다. 과학은 객관적이어야 하는데 너무 정치적으로 이용되는 것 같다.'],
        '실제 경험으로 봤을 때 온난화는 없다': ['포럼글', '2024.01.15', '50년을 살아보니 예전과 크게 다르지 않다. 오히려 사람들이 더위에 약해진 것 같다.'],
        '온난화론자들이 숨기고 싶어하는 진실들': ['포럼글', '2024.01.11', '온난화를 주장하는 사람들이 절대 말하지 않는 진실들이 있다. 중세 온난기, CO2 농도와 기온의 시차 등 언론에서는 보도하지 않는 사실들이 너무 많다.'],
        '기후학자들의 연구비 따내기용 과장설': ['포럼글', '2024.01.16', '기후학자들이 연구비를 따내기 위해 기후변화를 과장하고 있다는 의혹이 제기되고 있다.'],
        
        // 주변인 대화
        '친구: "작년 겨울이 역대급으로 추웠는데 온난화라고?"': ['SNS피드', '2024.01.13', '친구', '작년 겨울이 역대급으로 추웠는데 온난화라고?', '매년 한파 경보가 발령되는 상황에서 온난화 이론에 대한 의문을 표현'],
        '삼촌: "내가 젊었을 때가 지금보다 훨씬 더웠어"': ['SNS피드', '2024.01.14', '삼촌', '내가 젊었을 때가 지금보다 훨씬 더웠어', '과거 경험을 바탕으로 현재 온난화에 대한 회의적 시각'],
        '동료: "환경세만 늘리려는 정부의 수작이야"': ['SNS피드', '2024.01.05', '동료', '환경세만 늘리려는 정부의 수작이야', '탄소세, 환경세 등 새로운 세금에 대한 서민들의 부담과 불만을 표현'],
        '할머니: "옛날 여름이 지금보다 훨씬 더웠지"': ['SNS피드', '2024.01.13', '할머니(85세)', '옛날 여름이 지금보다 훨씬 더웠지', '1950-60년대를 경험한 할머니의 증언'],
        '이웃집 아저씨: "북극곰이 늘어나고 있다던데?"': ['SNS피드', '2024.01.12', '이웃집 아저씨', '북극곰이 늘어나고 있다던데?', '북극곰 개체수 증가 연구에 대한 언급']
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

    // 스와핑 함수
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
                                setTimeout(() => {
                                    el.style.opacity = '1';
                                    addContentClickListeners(); // 새 컨텐츠에 이벤트 재등록
                                }, 150);
                            }
                        });
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
        const detail = generateContent(articleTitle);
        if (!detail || !articleModal) return;
        
        // 모달 내용 업데이트
        const sourceEl = document.getElementById('articleSource');
        const dateEl = document.getElementById('articleDate');
        const titleEl = document.getElementById('articleTitle');
        const bodyEl = document.getElementById('articleBody');
        
        if (sourceEl) sourceEl.textContent = detail.source;
        if (dateEl) dateEl.textContent = detail.date;
        if (titleEl) titleEl.textContent = detail.title;
        if (bodyEl) bodyEl.textContent = detail.content;
        
        // 태그 업데이트
        const tags = document.querySelectorAll('#articleDetailModal .tag');
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
    
    // 컨텐츠 클릭 이벤트 리스너 추가
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

    // 포커스 설정
    if (messageInput) {
        messageInput.focus();
    }

    console.log('Seokdae complete script initialization finished');
});
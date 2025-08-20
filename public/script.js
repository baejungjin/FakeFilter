// 가장 간단한 방식으로 다시 시작
// 전역 변수
let conversationHistory = [];

window.onload = function() {
    console.log('페이지 완전 로드됨');
    
    // 인터넷 버튼
    const internetBtn = document.getElementById('internetButton');
    const internetPop = document.getElementById('internetPopup');
    
    if (internetBtn && internetPop) {
        internetBtn.onclick = function() {
            console.log('인터넷 버튼 클릭됨!');
            internetPop.style.display = 'flex';
            internetPop.style.visibility = 'visible';
            internetPop.style.opacity = '1';
            internetPop.classList.add('show');
            console.log('팝업이 열렸어야 함');
        };
        console.log('인터넷 버튼 연결됨');
    } else {
        console.log('인터넷 버튼 또는 팝업을 찾을 수 없음');
    }
    
    // 닫기 버튼
    const closeBtn = document.getElementById('closePopup');
    if (closeBtn && internetPop) {
        closeBtn.onclick = function() {
            console.log('닫기 클릭됨');
            internetPop.style.display = 'none';
            internetPop.classList.remove('show');
        };
        console.log('닫기 버튼 연결됨');
    }
    
    // 전송 버튼
    const sendBtn = document.getElementById('sendButton');
    const msgInput = document.getElementById('messageInput');
    const chatMsg = document.getElementById('chatMessages');
    
    if (sendBtn) {
        sendBtn.onclick = function() {
            console.log('전송 버튼 클릭됨');
            if (msgInput && chatMsg && msgInput.value.trim()) {
                const msg = msgInput.value.trim();
                console.log('메시지:', msg);
                
                // 사용자 메시지 추가
                const userDiv = document.createElement('div');
                userDiv.className = 'message user-message';
                userDiv.innerHTML = `
                    <div class="profile-image">👤</div>
                    <div class="message-container">
                        <div class="message-content">
                            <div class="user-label">나</div>
                            <div>${msg}</div>
                        </div>
                    </div>
                `;
                chatMsg.appendChild(userDiv);
                msgInput.value = '';
                
                // 스크롤 맨 아래로
                chatMsg.scrollTop = chatMsg.scrollHeight;
                
                // 대화 기록 유지
                
                // API로 봇 응답 받기
                setTimeout(async function() {
                    try {
                        console.log('석대 API 호출 중...');
                        
                        // API URL 설정 (상대 경로 사용 - Vercel에서 자동으로 올바른 도메인 사용)
                        const apiUrl = '/api/chat/seokdae';
                        
                        const response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: { 
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            body: JSON.stringify({
                                message: msg,
                                history: conversationHistory.slice(-10)
                            })
                        });
                        
                        console.log('응답 상태:', response.status);
                        
                        if (!response.ok) {
                            const errorData = await response.json().catch(() => ({}));
                            console.error('서버 오류 응답:', errorData);
                            throw new Error(`Server error: ${response.status} - ${errorData.error || 'Unknown error'}`);
                        }
                        
                        const data = await response.json();
                        console.log('석대 API 응답:', data);
                        
                        if (!data.response) {
                            throw new Error('응답 데이터가 없습니다');
                        }
                        
                        // 대화 기록에 추가
                        conversationHistory.push(
                            { role: "user", content: msg },
                            { role: "assistant", content: data.response }
                        );
                        
                        const botDiv = document.createElement('div');
                        botDiv.className = 'message bot-message';
                        botDiv.innerHTML = `
                            <div class="profile-image" style="background-image: url('https://i.imgur.com/tRcnjyX.png'); background-size: cover; background-position: center;"></div>
                            <div class="message-container">
                                <div class="message-content">
                                    <div class="user-label">석대</div>
                                    <div>${data.response}</div>
                                </div>
                            </div>
                        `;
                        chatMsg.appendChild(botDiv);
                        chatMsg.scrollTop = chatMsg.scrollHeight;
                        
                    } catch (error) {
                        console.error('석대 API 오류:', error);
                        
                        // 석대 스타일의 폴백 응답들
                        const fallbackResponses = [
                            "야, 지금 좀 바빠서 그런데... 뭐라고 했냐? ㅋㅋ",
                            "아 잠깐, 생각 좀 하고 있었어. 다시 말해봐.",
                            "어? 뭔가 이상하네... 아무튼 내 말은 그거야.",
                            "잠시만, 다시 정리해서 말할게. 기다려봐 ㅋㅋ",
                            "아 시스템이 좀 이상한가? 그래도 내 생각은 변함없어."
                        ];
                        
                        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
                        
                        const botDiv = document.createElement('div');
                        botDiv.className = 'message bot-message';
                        botDiv.innerHTML = `
                            <div class="profile-image" style="background-image: url('https://i.imgur.com/tRcnjyX.png'); background-size: cover; background-position: center;"></div>
                            <div class="message-container">
                                <div class="message-content">
                                    <div class="user-label">석대</div>
                                    <div>${randomResponse}</div>
                                </div>
                            </div>
                        `;
                        chatMsg.appendChild(botDiv);
                        chatMsg.scrollTop = chatMsg.scrollHeight;
                        
                        // 5초 후 다시 시도 제안
                        setTimeout(() => {
                            const retryDiv = document.createElement('div');
                            retryDiv.className = 'message bot-message';
                            retryDiv.innerHTML = `
                                <div class="profile-image" style="background-image: url('https://i.imgur.com/tRcnjyX.png'); background-size: cover; background-position: center;"></div>
                                <div class="message-container">
                                    <div class="message-content">
                                        <div class="user-label">석대</div>
                                        <div>아, 그리고 서버 연결이 좀 불안정한 것 같은데... 혹시 다시 말해줄래? ㅋㅋ</div>
                                    </div>
                                </div>
                            `;
                            chatMsg.appendChild(retryDiv);
                            chatMsg.scrollTop = chatMsg.scrollHeight;
                        }, 5000);
                    }
                }, 1000);
            }
        };
        console.log('전송 버튼 연결됨');
    }
    
    // 엔터키로 전송
    if (msgInput) {
        msgInput.onkeydown = function(e) {
            if (e.key === 'Enter') {
                console.log('엔터키 눌림');
                e.preventDefault();
                if (sendBtn) sendBtn.click();
            }
        };
        console.log('엔터키 이벤트 연결됨');
    }
    
    // 제출 버튼
    const submitBtn = document.getElementById('submitButton');
    const reportPop = document.getElementById('reportPopup');
    
    if (submitBtn && reportPop) {
        submitBtn.onclick = function() {
            console.log('제출 버튼 클릭됨!');
            
            // 대화 수 확인
            const messages = chatMsg ? chatMsg.querySelectorAll('.user-message') : [];
            if (messages.length < 1) {
                alert('석대와 대화를 나눈 후 제출해주세요!');
                return;
            }
            
            // 확인 대화상자
            if (confirm('석대와의 대화를 제출하시겠습니까?\n\n학습 완료 보고서가 생성됩니다.')) {
                console.log('사용자가 제출을 확인함');
                
                // 메시지 개수 업데이트
                const messageCount = document.getElementById('messageCount');
                if (messageCount) {
                    messageCount.textContent = messages.length;
                }
                
                reportPop.style.display = 'flex';
                reportPop.style.visibility = 'visible';
                reportPop.style.opacity = '1';
                reportPop.classList.add('show');
                console.log('보고서 팝업이 열렸어야 함');
            } else {
                console.log('사용자가 제출을 취소함');
            }
        };
        console.log('제출 버튼 연결됨');
    } else {
        console.log('제출 버튼 또는 보고서 팝업을 찾을 수 없음');
    }
    
    // 보고서 닫기
    const closeReportBtn = document.getElementById('closeReportPopup');
    const reportCloseBtn = document.getElementById('reportCloseButton');
    
    if (closeReportBtn && reportPop) {
        closeReportBtn.onclick = function() {
            reportPop.style.display = 'none';
            reportPop.classList.remove('show');
        };
    }
    if (reportCloseBtn && reportPop) {
        reportCloseBtn.onclick = function() {
            reportPop.style.display = 'none';
            reportPop.classList.remove('show');
        };
    }
    
    // 탭 전환
    const articleTab = document.getElementById('articleTab');
    const communityTab = document.getElementById('communityTab');
    const articleContent = document.getElementById('articleContent');
    const communityContent = document.getElementById('communityContent');
    
    if (articleTab) {
        articleTab.onclick = function() {
            console.log('기사 탭 클릭됨');
            articleTab.classList.add('active');
            if (communityTab) communityTab.classList.remove('active');
            if (articleContent) articleContent.classList.add('active');
            if (communityContent) communityContent.classList.remove('active');
        };
        console.log('기사 탭 연결됨');
    }
    
    if (communityTab) {
        communityTab.onclick = function() {
            console.log('커뮤니티 탭 클릭됨');
            communityTab.classList.add('active');
            if (articleTab) articleTab.classList.remove('active');
            if (communityContent) communityContent.classList.add('active');
            if (articleContent) articleContent.classList.remove('active');
        };
        console.log('커뮤니티 탭 연결됨');
    }
    
    // 기사 상세 내용 데이터
    const articleDetails = {
        '올해 지구 평균기온, 1850년 이후 최고치 기록': {
            content: '세계기상기구(WMO)는 2024년 지구 평균기온이 산업화 이전 대비 1.45℃ 높아졌다고 공식 발표했다. 이는 1850년 기상 관측이 시작된 이후 가장 높은 수치다. 보고서에 따르면 유럽과 아시아는 지난 20년간 폭염 발생 빈도가 거의 두 배 가까이 늘었으며, 북극의 해빙 면적은 9월 기준 역사상 최저 수준을 기록했다.\n\n기후학자들은 이러한 현상이 단순한 계절적 변동이 아니라 장기적인 추세임을 강조한다. 특히, 해양의 표면 온도가 높아지면서 해양 생태계에도 큰 충격이 가해지고 있으며, 산호 백화 현상과 어류 개체 수 변화가 뚜렷하게 관측되고 있다. WMO는 "기후변화는 더 이상 미래의 가능성이 아닌 현재 진행 중인 사실이며, 이는 명백히 인류 활동에 따른 결과"라고 결론지었다.',
            source: '🌍 월드뉴스 네트워크',
            date: '2024.12'
        },
        '국내 태풍 피해액 10년간 2배 증가… 기후변화 영향 뚜렷': {
            content: '한국재난안전연구원의 분석에 따르면, 최근 10년간 태풍으로 인한 국내 평균 연간 피해액은 2조 원을 넘어섰다. 이는 2000년대 초반과 비교했을 때 두 배 이상 증가한 수치다. 연구진은 해수면 온도가 상승하면서 태풍의 세력이 더욱 강력해지고, 발생 빈도와 이동 경로가 불규칙해졌다고 설명했다.\n\n실제로 2023년과 2024년 연이어 한반도를 강타한 태풍들은 풍속과 강수량 모두 기존 평균치를 크게 웃돌았다. 이에 따라 농작물 피해, 주택 침수, 교통 인프라 마비가 전국적으로 발생하며 사회적 비용이 막대하게 증가했다. 전문가들은 "앞으로 30년 안에 현재보다 최대 3배 이상의 피해가 발생할 가능성이 있다"고 경고한다. 정부는 이에 대응하기 위해 방재 인프라 확충과 함께, 기후적응형 도시 설계를 단계적으로 추진하고 있다.',
            source: '📺 KBN 뉴스',
            date: '2024.09'
        },
        '한겨울 폭설 속, 시민들 \'기후변화 실감 어렵다\'는 목소리도': {
            content: '올겨울 미국과 한국은 기록적인 폭설을 경험했다. 서울 일부 지역은 20년 만에 최대 적설량을 기록했고, 미국 동부에서는 항공편이 대규모로 마비됐다. 시민들은 "이렇게 추운데 무슨 지구온난화냐"며 고개를 갸웃하고 있다. 난방비 폭등에 시달린 주민들은 "뉴스에서는 지구가 뜨거워진다는데, 현실은 그 반대"라고 토로한다.\n\n물론 과학자들은 여전히 지구 평균기온이 오르고 있다고 주장하지만, 눈앞의 현실과는 괴리가 있다는 지적이 나온다. "내가 사는 곳은 오히려 더 춥다"는 시민들의 경험담은 단순히 무시하기 어렵다는 것이다. 기후 위기가 과연 언론과 학계가 말하는 만큼 체감할 만한 문제인지, 여전히 의문을 품는 사람들이 적지 않다.',
            source: '📰 코리아 이코노믹 리뷰',
            date: '2024.01'
        },
        '세계적 석학도 경고… \'온난화 공포, 과장됐다\'': {
            content: '미국의 저명한 기후학자가 최근 방송 인터뷰에서 "기후변화가 전혀 없는 것은 아니지만, 대중에게 알려진 만큼 위협적이지 않다"고 주장했다. 그는 "기후 위기는 정치적 도구로 활용되는 경우가 많으며, 탄소세 확대와 같은 정책을 정당화하기 위한 수단으로 과장되고 있다"고 지적했다.\n\n이 발언은 여러 언론과 방송에서 연이어 인용되며 큰 반향을 불러일으켰다. 일부 시민들은 "전문가도 그렇게 말한다면, 지금의 기후 위기 담론은 과장된 것이 아니냐"고 반문한다. 실제로 온라인 커뮤니티에서는 "정부가 세금을 더 걷기 위해 위기를 부풀린다"는 주장도 확산되고 있다. 반면 다른 학자들은 즉각 반박했지만, 일반 대중에게는 \'권위 있는 인물의 발언\'이 더 설득력 있게 다가가고 있다.',
            source: '📰 글로벌 타임즈 데일리',
            date: '2024.05'
        },
        '北극곰 개체 수 감소세… 먹이 부족과 해빙 축소 탓': {
            content: '국제자연보전연맹(IUCN)은 최근 보고서에서 북극곰을 \'취약종\'으로 다시 한 번 분류하며 경고음을 울렸다. 1980년대 약 2만 6천 마리에 달했던 북극곰의 개체 수는 현재 2만 마리 이하로 감소한 것으로 추정된다. 가장 큰 원인은 해빙 면적의 급격한 축소다. 사냥할 수 있는 기간이 짧아지면서 물범과 같은 주요 먹이를 확보하기가 점점 어려워지고 있다.\n\n연구진은 일부 지역에서 개체 수가 일시적으로 증가한 사례가 있지만, 이는 장기적인 감소세와 무관하며 오히려 인간 활동에 따른 지역적 영향으로 해석된다고 설명했다. 북극곰의 영양 상태는 갈수록 악화되고 있으며, 새끼의 생존율도 낮아지고 있다. 보고서는 "북극곰은 단순히 한 종의 문제가 아니라, 북극 생태계 전반의 건강을 보여주는 지표종"이라며 국제적 협력을 촉구했다.',
            source: '🐾 내셔널 와일드그래픽',
            date: '2023.07'
        }
    };

    // 기사 클릭 이벤트 함수
    function setupArticleClicks() {
        const items = document.querySelectorAll('.content-item');
        const articleModal = document.getElementById('articleDetailModal');
        
        console.log('기사 클릭 이벤트 설정 중... 아이템 수:', items.length);
        
        items.forEach(function(item) {
            // 기존 이벤트 제거
            item.onclick = null;
            
            // 새 이벤트 추가
            item.onclick = function() {
                console.log('기사 클릭됨:', item.textContent);
                
                if (articleModal) {
                    const title = document.getElementById('articleTitle');
                    const body = document.getElementById('articleBody');
                    const source = document.getElementById('articleSource');
                    const date = document.getElementById('articleDate');
                    
                    const articleData = articleDetails[item.textContent];
                    
                    if (title) title.textContent = item.textContent;
                    if (body) {
                        if (articleData) {
                            body.textContent = articleData.content;
                        } else {
                            body.textContent = item.textContent + '에 대한 상세 내용입니다. 이 기사의 신뢰성을 비판적으로 검토해보세요. 정보의 출처와 근거를 확인하고, 편향된 표현이나 과장된 내용이 있는지 살펴보는 것이 중요합니다.';
                        }
                    }
                    if (source) {
                        if (articleData) {
                            source.textContent = articleData.source;
                        } else {
                            source.textContent = '뉴스소스';
                        }
                    }
                    if (date) {
                        if (articleData) {
                            date.textContent = articleData.date;
                        } else {
                            date.textContent = '2024.01.15';
                        }
                    }
                    
                    articleModal.style.display = 'flex';
                    articleModal.style.visibility = 'visible';
                    articleModal.style.opacity = '1';
                    articleModal.classList.add('show');
                    
                    console.log('기사 상세보기 모달 열림');
                } else {
                    console.log('articleModal을 찾을 수 없음');
                }
            };
            
            // 마우스 커서 변경
            item.style.cursor = 'pointer';
            item.style.userSelect = 'none';
        });
        
        console.log('기사 클릭 이벤트 ' + items.length + '개 연결됨');
    }
    
    // 초기 연결
    setupArticleClicks();
    
    // 모달 닫기
    const articleModal = document.getElementById('articleDetailModal');
    const closeModal = document.getElementById('closeArticleModal');
    
    if (closeModal && articleModal) {
        closeModal.onclick = function() {
            console.log('기사 모달 닫기 버튼 클릭됨');
            articleModal.style.display = 'none';
            articleModal.style.visibility = 'hidden';
            articleModal.style.opacity = '0';
            articleModal.classList.remove('show');
        };
        console.log('기사 모달 닫기 버튼 연결됨');
    }
    
    // 모달 배경 클릭시 닫기
    if (articleModal) {
        articleModal.onclick = function(e) {
            if (e.target === articleModal) {
                console.log('모달 배경 클릭으로 닫기');
                articleModal.style.display = 'none';
                articleModal.style.visibility = 'hidden';
                articleModal.style.opacity = '0';
                articleModal.classList.remove('show');
            }
        };
        console.log('모달 배경 클릭 이벤트 연결됨');
    }
    
    // 스왑 버튼들
    const swap1 = document.getElementById('articleSwap1');
    const swap2 = document.getElementById('articleSwap2');
    const swap3 = document.getElementById('articleSwap3');
    const cSwap1 = document.getElementById('communitySwap1');
    const cSwap2 = document.getElementById('communitySwap2');
    const cSwap3 = document.getElementById('communitySwap3');
    
    // 페이지 로드시 기본으로 환경뉴스 설정
    function setDefaultEnvironmentNews() {
        const a1 = document.getElementById('article1');
        const a2 = document.getElementById('article2');
        const a3 = document.getElementById('article3');
        const a4 = document.getElementById('article4');
        const a5 = document.getElementById('article5');
        
        if (a1) a1.textContent = '올해 지구 평균기온, 1850년 이후 최고치 기록';
        if (a2) a2.textContent = '국내 태풍 피해액 10년간 2배 증가… 기후변화 영향 뚜렷';
        if (a3) a3.textContent = '한겨울 폭설 속, 시민들 \'기후변화 실감 어렵다\'는 목소리도';
        if (a4) a4.textContent = '세계적 석학도 경고… \'온난화 공포, 과장됐다\'';
        if (a5) a5.textContent = '北극곰 개체 수 감소세… 먹이 부족과 해빙 축소 탓';
        
        console.log('기본 환경뉴스 설정 완료');
    }
    
    // 페이지 로드시 환경뉴스로 설정
    setDefaultEnvironmentNews();
    
    if (swap1) {
        swap1.onclick = function() {
            console.log('기사 스왑1 클릭됨');
            const a1 = document.getElementById('article1');
            const a2 = document.getElementById('article2');
            const a3 = document.getElementById('article3');
            const a4 = document.getElementById('article4');
            const a5 = document.getElementById('article5');
            
            if (a1) a1.textContent = '재생에너지 발전량, 석탄발전 추월 임박';
            if (a2) a2.textContent = '플라스틱 대체재 개발, 해양오염 해결 기대';
            if (a3) a3.textContent = '전기차 보급 확산으로 대기질 개선 효과';
            if (a4) a4.textContent = '탄소중립 정책으로 녹색산업 성장 가속';
            if (a5) a5.textContent = '도시 녹화사업, 열섬현상 완화에 효과적';
            
            // 스왑 후 클릭 이벤트 재연결
            setupArticleClicks();
        };
    }
    
    if (swap2) {
        swap2.onclick = function() {
            console.log('기사 스왑2 클릭됨');
            const a1 = document.getElementById('article1');
            const a2 = document.getElementById('article2');
            const a3 = document.getElementById('article3');
            const a4 = document.getElementById('article4');
            const a5 = document.getElementById('article5');
            
            if (a1) a1.textContent = '태양 활동 변화가 기후에 미치는 영향 연구';
            if (a2) a2.textContent = '이산화탄소와 기온 상관관계, 새로운 모델 필요';
            if (a3) a3.textContent = '화산 활동이 지구 온도에 미치는 영향 재평가';
            if (a4) a4.textContent = '기후 데이터 분석 방법론의 한계점 지적';
            if (a5) a5.textContent = '자연적 기후 변동성과 인위적 요인 구분 연구';
            
            // 스왑 후 클릭 이벤트 재연결
            setupArticleClicks();
        };
    }
    
    if (swap3) {
        swap3.onclick = function() {
            console.log('기사 스왑3 클릭됨');
            const a1 = document.getElementById('article1');
            const a2 = document.getElementById('article2');
            const a3 = document.getElementById('article3');
            const a4 = document.getElementById('article4');
            const a5 = document.getElementById('article5');
            
            if (a1) a1.textContent = '주요국, 파리기후협약 재검토 논의 시작';
            if (a2) a2.textContent = '중국 석탄발전 증가에도 글로벌 기온 변화 미미';
            if (a3) a3.textContent = '유럽 각국, 환경 규제 완화 조치 검토';
            if (a4) a4.textContent = '기후변화 대응 정책 효과에 대한 국제적 논란';
            if (a5) a5.textContent = 'G20 정상회의, 기후 정책 실효성 재평가 합의';
            
            // 스왑 후 클릭 이벤트 재연결
            setupArticleClicks();
        };
    }
    
    if (cSwap1) {
        cSwap1.onclick = function() {
            console.log('커뮤니티 스왑1 클릭됨');
            const c1 = document.getElementById('community1');
            const c2 = document.getElementById('community2');
            const c3 = document.getElementById('community3');
            const c4 = document.getElementById('community4');
            const c5 = document.getElementById('community5');
            
            if (c1) c1.textContent = '[의견] 지구온난화 심각성에 대한 과학적 근거들';
            if (c2) c2.textContent = '기후변화 대응, 개인의 실천 방안 토론';
            if (c3) c3.textContent = '재생에너지 전환의 경제적 효과 분석';
            if (c4) c4.textContent = '환경 보호와 경제 발전의 균형점은?';
            if (c5) c5.textContent = '탄소중립 목표 달성을 위한 정책 제안';
            
            // 스왑 후 클릭 이벤트 재연결
            setupArticleClicks();
        };
    }
    
    if (cSwap2) {
        cSwap2.onclick = function() {
            console.log('커뮤니티 스왑2 클릭됨');
            const c1 = document.getElementById('community1');
            const c2 = document.getElementById('community2');
            const c3 = document.getElementById('community3');
            const c4 = document.getElementById('community4');
            const c5 = document.getElementById('community5');
            
            if (c1) c1.textContent = '[반박] 지구온난화 과장설에 대한 반론';
            if (c2) c2.textContent = '기후 데이터 해석의 다양한 관점들';
            if (c3) c3.textContent = '온실가스 vs 태양활동, 어느 것이 더 중요한가?';
            if (c4) c4.textContent = '과거 기후변화와 현재 상황의 차이점';
            if (c5) c5.textContent = '기후과학의 불확실성에 대한 토론';
            
            // 스왑 후 클릭 이벤트 재연결
            setupArticleClicks();
        };
    }
    
    if (cSwap3) {
        cSwap3.onclick = function() {
            console.log('커뮤니티 스왑3 클릭됨');
            const c1 = document.getElementById('community1');
            const c2 = document.getElementById('community2');
            const c3 = document.getElementById('community3');
            const c4 = document.getElementById('community4');
            const c5 = document.getElementById('community5');
            
            if (c1) c1.textContent = '[회의론] 온난화는 정말 인간 때문일까?';
            if (c2) c2.textContent = '겨울이 더 추워지는데 온난화가 맞나요?';
            if (c3) c3.textContent = '기상청 예보도 안 맞는데 100년 후 예측?';
            if (c4) c4.textContent = '환경단체들의 과장된 위기론에 속지 마세요';
            if (c5) c5.textContent = 'CO2 증가 = 식물 성장 촉진, 오히려 좋은 것 아닌가';
            
            // 스왑 후 클릭 이벤트 재연결
            setupArticleClicks();
        };
    }
    
    console.log('==== 모든 기능 연결 완료 ====');
    console.log('internetButton:', !!internetBtn);
    console.log('internetPopup:', !!internetPop);
    console.log('submitButton:', !!submitBtn);
    console.log('reportPopup:', !!reportPop);
    console.log('items:', items.length);
};
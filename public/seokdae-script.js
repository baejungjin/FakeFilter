document.addEventListener('DOMContentLoaded', function() {
    // Seokdae 페이지 전용 스크립트
    console.log('Seokdae script loaded');
    
    // DOM 요소 선택
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const internetButton = document.getElementById('internetButton');
    const chatMessages = document.getElementById('chatMessages');
    const internetPopup = document.getElementById('internetPopup');
    const closePopup = document.getElementById('closePopup');
    const submitButton = document.getElementById('submitButton');
    
    // 디버깅 로그
    console.log('Elements found:', {
        messageInput: !!messageInput,
        sendButton: !!sendButton,
        internetButton: !!internetButton,
        chatMessages: !!chatMessages,
        internetPopup: !!internetPopup,
        closePopup: !!closePopup,
        submitButton: !!submitButton
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
            return "죄송합니다. 서버 연결에 문제가 있습니다.";
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

    // 키보드 단축키 (I키로 인터넷 팝업)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'i' || e.key === 'I') {
            if (internetPopup && internetButton) {
                internetPopup.style.display = 'flex';
                internetPopup.style.zIndex = '10000';
                setTimeout(() => {
                    internetPopup.classList.add('show');
                }, 10);
            }
        }
    });

    console.log('Seokdae script setup complete');
});
// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all animations and effects
    initializeHeroAnimations();
    initializeCRTEffect();
    initializeGlitchEffect();
    addScrollListeners();
});

// Hero Section Animations
function initializeHeroAnimations() {
    // 히어로 배경 오버레이 요소 생성
    const heroBackground = document.getElementById('hero-background');
    if (!heroBackground) return;
    
    // 오버레이 요소 생성
    const overlay = document.createElement('div');
    overlay.className = 'hero-overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(10, 10, 31, 0)';
    overlay.style.transition = 'background-color 1.5s ease';
    overlay.style.zIndex = '1';
    heroBackground.appendChild(overlay);
    
    // 처음에는 배경 이미지를 그대로 보여줌 (2초 대기)
    setTimeout(() => {
        // 타이틀 페이드인
        document.getElementById('hero-title').style.opacity = '1';
        document.getElementById('hero-title').style.transform = 'translateY(0)';
        
        // 타이틀이 나타날 때 배경 어둡게 시작
        overlay.style.backgroundColor = 'rgba(10, 10, 31, 0.4)';
        
        // 부제목 페이드인
        setTimeout(() => {
            document.getElementById('hero-subtitle').style.opacity = '1';
            document.getElementById('hero-subtitle').style.transform = 'translateY(0)';
            
            // 배경 더 어둡게
            overlay.style.backgroundColor = 'rgba(10, 10, 31, 0.6)';
            
            // 버튼 페이드인
            setTimeout(() => {
                document.getElementById('hero-buttons').style.opacity = '1';
                document.getElementById('hero-buttons').style.transform = 'translateY(0)';
                
                // 배경 완전히 어둡게
                overlay.style.backgroundColor = 'rgba(10, 10, 31, 0.75)';
            }, 500);
        }, 500);
    }, 2000);
}

// CRT Screen Flicker Effect
function initializeCRTEffect() {
    const overlay = document.querySelector('.crt-overlay');
    
    // Random flicker effect
    setInterval(() => {
        const rand = Math.random();
        // Small chance of a visible flicker
        if (rand < 0.03) {
            overlay.style.opacity = (Math.random() * 0.4) + 0.4; // Random opacity
            // Return to normal quickly
            setTimeout(() => {
                overlay.style.opacity = 0.8;
            }, 50);
        }
    }, 500);
}

// Glitch Text Effect - 제거됨
function initializeGlitchEffect() {
    // 글리치 효과 제거 - 균일한 글자 간격을 위해
    console.log("Glitch effect disabled for consistent letter spacing");
}

// Scroll Event Listeners
function addScrollListeners() {
    // Get all sections that should animate on scroll
    const sections = document.querySelectorAll('.stats-section, .game-section, .capability-section, .learning-section, .edu-section');
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // When section comes into view
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Add custom animations based on the section
                if (entry.target.classList.contains('stats-section')) {
                    animateStatNumbers();
                }
            }
        });
    }, { threshold: 0.2 });
    
    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Animate stat numbers when they come into view
function animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        // 원본 텍스트 저장
        const originalText = stat.textContent;
        
        // 숫자 부분만 추출 (소수점 포함)
        const numberMatch = originalText.match(/[\d.]+/);
        if (!numberMatch) return;
        
        const numberStr = numberMatch[0];
        // 소수점이 있는지 확인
        const hasDecimal = numberStr.includes('.');
        
        // 애니메이션 대상 값 설정 (소수점 처리)
        let targetValue;
        let decimalPlaces = 0;
        
        if (hasDecimal) {
            const parts = numberStr.split('.');
            targetValue = parseFloat(numberStr);
            decimalPlaces = parts[1].length;
        } else {
            targetValue = parseInt(numberStr, 10);
        }
        
        // 애니메이션 설정
        let currentValue = 0;
        const duration = 2000; // 애니메이션 지속시간 (밀리초)
        const stepTime = 30; // 단계 간 시간 (밀리초)
        const steps = duration / stepTime;
        const increment = targetValue / steps;
        
        // 숫자 카운팅 애니메이션
        const interval = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(interval);
            }
            
            // 숫자 포맷팅 (소수점 자리 유지)
            let formattedNumber;
            if (hasDecimal) {
                formattedNumber = currentValue.toFixed(decimalPlaces);
            } else {
                formattedNumber = Math.floor(currentValue).toString();
            }
            
            // 원본 텍스트에서 숫자 부분만 대체
            const newText = originalText.replace(numberMatch[0], formattedNumber);
            stat.innerHTML = newText;
        }, stepTime);
    });
}

// Terminal typing effect
function typeTerminalText(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, speed);
}

// Smooth scroll to section (for EDUCATION and AI TECH buttons)
function smoothScrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        // 플로팅 메뉴와 여백을 고려한 오프셋
        const menuOffset = 120;
        
        // getBoundingClientRect()를 사용하여 더 정확한 위치 계산
        const rect = targetSection.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = rect.top + scrollTop - menuOffset;
        
        console.log(`Scrolling to ${sectionId}:`, {
            element: targetSection,
            boundingRect: rect,
            scrollTop: scrollTop,
            targetPosition: targetPosition
        });
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // 강제로 해당 요소에 하이라이트 효과 추가 (시각적 확인용)
        targetSection.style.transition = 'box-shadow 0.3s ease';
        targetSection.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
        setTimeout(() => {
            targetSection.style.boxShadow = '';
        }, 2000);
        
    } else {
        console.error(`Element with id "${sectionId}" not found`);
    }
}
// 즉시 실행 - 페이지 로드와 상관없이
console.log('=== DEBUG SCRIPT LOADED ===');
alert('DEBUG: Script is loading!');

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM LOADED ===');
    alert('DEBUG: DOM is loaded!');
    
    const internetButton = document.getElementById('internetButton');
    const internetPopup = document.getElementById('internetPopup');
    
    console.log('internetButton:', internetButton);
    console.log('internetPopup:', internetPopup);
    
    alert(`Button: ${!!internetButton}, Popup: ${!!internetPopup}`);
    
    if (internetButton) {
        console.log('Adding click listener to internet button');
        internetButton.addEventListener('click', function(e) {
            console.log('BUTTON CLICKED!');
            alert('BUTTON WAS CLICKED!');
            e.preventDefault();
            e.stopPropagation();
            
            if (internetPopup) {
                console.log('Showing popup');
                internetPopup.style.display = 'flex';
                internetPopup.style.zIndex = '99999';
                internetPopup.style.background = 'rgba(255, 0, 0, 0.8)'; // 빨간색으로 눈에 띄게
                setTimeout(() => {
                    internetPopup.classList.add('show');
                }, 10);
            } else {
                alert('POPUP ELEMENT NOT FOUND!');
            }
        });
        
        // 테스트용 스타일 강제 적용
        internetButton.style.backgroundColor = 'red';
        internetButton.style.color = 'white';
        internetButton.style.border = '3px solid blue';
        internetButton.style.zIndex = '99999';
        internetButton.style.position = 'relative';
        internetButton.style.pointerEvents = 'auto';
        
        console.log('Button styled and event added');
    } else {
        console.error('INTERNET BUTTON NOT FOUND!');
        alert('INTERNET BUTTON NOT FOUND!');
    }
});

console.log('=== DEBUG SCRIPT END ===');
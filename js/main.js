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
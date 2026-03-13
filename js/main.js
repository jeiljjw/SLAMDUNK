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
});
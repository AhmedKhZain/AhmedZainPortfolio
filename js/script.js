document.addEventListener('DOMContentLoaded', () => {
    // 1. منطق الـ Accordion للمشاريع والتمرير الذكي
    const triggers = document.querySelectorAll('.project-header-trigger');
    const header = document.querySelector('header');

    const headerHeight = () => (header ? header.getBoundingClientRect().height : 0);

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const parent = trigger.parentElement;

            document.querySelectorAll('.project-accordion').forEach(item => {
                if (item !== parent) item.classList.remove('active');
            });

            const isActive = parent.classList.toggle('active');

            if (isActive) {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        const rect = parent.getBoundingClientRect();
                        const scrollTop = window.pageYOffset + rect.top - headerHeight() - 16;
                        window.scrollTo({ top: scrollTop, behavior: 'smooth' });
                    }, 60);
                });
            }
        });

        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                trigger.click();
            }
        });
    });

    // 2. توليد الـ QR Codes مع تنظيف الحاويات أولاً لمنع التكرار
    const emailContainer = document.getElementById("email-qr");
    if (emailContainer) {
        emailContainer.innerHTML = ""; // تنظيف الحاوية تماماً قبل التوليد
        new QRCode(emailContainer, {
            text: "mailto:ahmed.kh.zain2156@gmail.com",
            width: 120,
            height: 120,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    const whatsappContainer = document.getElementById("whatsapp-qr");
    if (whatsappContainer) {
        whatsappContainer.innerHTML = ""; // تنظيف الحاوية تماماً قبل التوليد
        new QRCode(whatsappContainer, {
            text: "https://wa.me/201094281656",
            width: 120,
            height: 120,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    const linkedinContainer = document.getElementById("linkedin-qr");
    if (linkedinContainer) {
        linkedinContainer.innerHTML = ""; // تنظيف الحاوية تماماً قبل التوليد
        new QRCode(linkedinContainer, {
            text: "https://www.linkedin.com/in/ahmed-k-zain2156",
            width: 120,
            height: 120,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    
    const githubContainer = document.getElementById("github-qr");
    if (githubContainer) {
        githubContainer.innerHTML = ""; // تنظيف الحاوية لمنع التكرار
        new QRCode(githubContainer, {
            text: "https://github.com/AhmedKhZain",
            width: 120,
            height: 120,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
});
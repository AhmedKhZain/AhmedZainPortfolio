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

    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    let carouselIndex = 0;
    let carouselTimer = null;

    const setActiveSlide = (index) => {
        if (!carouselSlides.length) return;
        carouselSlides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === index);
        });
        indicators.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === index);
        });
        carouselIndex = index;
    };

    const showNextSlide = () => {
        if (carouselSlides.length) {
            setActiveSlide((carouselIndex + 1) % carouselSlides.length);
        }
    };

    const startCarouselTimer = () => {
        if (carouselSlides.length && !carouselTimer) {
            carouselTimer = setInterval(showNextSlide, 7000);
        }
    };

    const stopCarouselTimer = () => {
        if (carouselTimer) {
            clearInterval(carouselTimer);
            carouselTimer = null;
        }
    };

    indicators.forEach((dot) => {
        // Switch slide instantly on hover
        dot.addEventListener('mouseenter', () => {
            const index = Number(dot.dataset.index);
            if (!Number.isNaN(index) && index >= 0 && index < carouselSlides.length) {
                stopCarouselTimer();
                setActiveSlide(index);
            }
        });

        // Resume timer fresh from the new slide when mouse leaves
        dot.addEventListener('mouseleave', () => {
            stopCarouselTimer();
            startCarouselTimer();
        });
    });

    // Initialize timer on load
    startCarouselTimer();

    // 3. Skills Integration Logic
    const skillMapping = {}; // { 'C#': [projectElem1, projectElem2], ... }
    const projects = document.querySelectorAll('.project-accordion');
    const mainSkillTags = document.querySelectorAll('#skills .tag');

    // Build the mapping
    projects.forEach(project => {
        const projectNameElem = project.querySelector('.project-title-area h3');
        if (!projectNameElem) return;
        const projectName = projectNameElem.textContent.trim();
        const projectSkills = project.querySelectorAll('.project-skills .skill-tag');
        
        projectSkills.forEach(skillTag => {
            const skillName = skillTag.textContent.trim();
            if (!skillMapping[skillName]) {
                skillMapping[skillName] = [];
            }
            skillMapping[skillName].push({ project, projectName });
        });
    });

    let activeFilter = null;

    // Initialize Tooltips and Click logic on main skills
    mainSkillTags.forEach(tag => {
        const skillName = tag.textContent.trim();
        const relatedProjects = skillMapping[skillName] || [];

        // Build tooltip content
        let tooltipHTML = '';
        if (relatedProjects.length > 0) {
            tooltipHTML += `<div class="skill-tooltip-header">Used in:</div>`;
            tooltipHTML += `<ul class="skill-tooltip-list">`;
            relatedProjects.forEach(p => {
                tooltipHTML += `<li>${p.projectName}</li>`;
            });
            tooltipHTML += `</ul>`;
        } else {
            tooltipHTML = `<div class="skill-tooltip-empty">Experienced with this technology, but it is not showcased in a featured project.</div>`;
        }

        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.innerHTML = tooltipHTML;
        tag.appendChild(tooltip);

        // Click logic
        tag.addEventListener('click', (e) => {
            e.stopPropagation();

            if (activeFilter === skillName) {
                // Reset filter
                resetSkillFilter();
            } else {
                // Apply filter
                activeFilter = skillName;
                mainSkillTags.forEach(t => t.classList.remove('active-filter'));
                tag.classList.add('active-filter');

                projects.forEach(project => {
                    const hasSkill = Array.from(project.querySelectorAll('.project-skills .skill-tag'))
                                          .some(st => st.textContent.trim() === skillName);
                    if (hasSkill) {
                        project.classList.remove('dimmed');
                        project.classList.add('highlighted');
                    } else {
                        project.classList.remove('highlighted');
                        project.classList.add('dimmed');
                    }
                });
            }
        });
    });

    const resetSkillFilter = () => {
        activeFilter = null;
        mainSkillTags.forEach(t => t.classList.remove('active-filter'));
        projects.forEach(project => {
            project.classList.remove('dimmed');
            project.classList.remove('highlighted');
        });
    };

    // Click outside to reset filter
    document.addEventListener('click', (e) => {
        if (activeFilter && !e.target.closest('#skills .tag')) {
            resetSkillFilter();
        }
    });

    // 4. Image Lightbox Modal with Zoom & Pan
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.querySelector('.modal-close');
    const viewerContainers = document.querySelectorAll('.image-hover-wrapper');

    let currentZoom = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;

    const updateTransform = () => {
        modalImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
    };

    const resetModalState = () => {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    };

    if (imageModal && modalImage) {
        viewerContainers.forEach(container => {
            const img = container.querySelector('img');
            if (img) {
                container.addEventListener('click', () => {
                    modalImage.src = img.src;
                    resetModalState();
                    imageModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                });
            }
        });

        const closeModal = () => {
            imageModal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => { modalImage.src = ''; }, 200); // Clear image after transition
        };

        modalClose.addEventListener('click', closeModal);
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal || e.target.classList.contains('modal-content')) {
                closeModal();
            }
        });

        // Zoom logic
        imageModal.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomStep = 0.1;
            if (e.deltaY < 0) {
                currentZoom = Math.min(currentZoom + zoomStep, 4); // Max zoom 4x
            } else {
                currentZoom = Math.max(currentZoom - zoomStep, 0.5); // Min zoom 0.5x
            }
            updateTransform();
        }, { passive: false });

        // Pan logic
        modalImage.addEventListener('mousedown', (e) => {
            if (currentZoom > 1) {
                e.preventDefault(); // prevent default image drag behavior
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                modalImage.style.cursor = 'grabbing';
            }
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            modalImage.style.cursor = 'grab';
        });
    }
});
// A simple script to handle all the page interactions and transitions.
// This is designed to be a single, deferred script for all pages.

document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration Variables ---
    const OWNER_PHONE = '919801549304'; // e.g., '1234567890' (without + or country code for wa.me)

    const currentPage = document.body.querySelector('.card').dataset.page;

    // --- Utility Functions ---
    const navigate = (url) => {
        const card = document.body.querySelector('.card');
        if (card) {
            card.style.transform = 'translateY(20px)';
            card.style.opacity = '0';
            setTimeout(() => {
                window.location.href = url;
            }, 300);
        } else {
            window.location.href = url;
        }
    };

    const showCard = () => {
        const card = document.body.querySelector('.card');
        if (card) {
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        }
    };

    // --- 🎵 Background Music ---
    const music = document.getElementById('bgMusic');
    if (music) {
        music.volume = 0.5; // gentle volume
        music.play().catch(() => {
            // Some browsers block autoplay; will play on first user interaction
        });
    }

    // --- Page-specific logic ---
    switch (currentPage) {
        case 'index':
            const startButton = document.getElementById('startButton');
            if (startButton) {
                startButton.addEventListener('click', () => {
                    navigate('step1.html');
                });
            }
            break;

        case 'step1':
            const choiceButtons = document.querySelectorAll('.choice-button');
            choiceButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const isCorrect = button.dataset.correct === 'true';
                    if (isCorrect) {
                        button.classList.add('correct');
                        setTimeout(() => {
                            navigate(button.dataset.next);
                        }, 500);
                    } else {
                        button.classList.add('wrong');
                        setTimeout(() => {
                            button.classList.remove('wrong');
                        }, 500);
                    }
                });
            });
            break;

        case 'step2':
            const gridCells = document.querySelectorAll('.grid-cell');
            gridCells.forEach(cell => {
                cell.addEventListener('click', () => {
                    if (cell.dataset.next) {
                        cell.textContent = '✨';
                        cell.classList.add('grid-cell--found');
                        setTimeout(() => {
                            navigate(cell.dataset.next);
                        }, 500);
                    }
                });
            });
            break;

        case 'step3':
            const thumb = document.querySelector('.slider-thumb');
            const fill = document.querySelector('.slider-fill');
            let isDragging = false;

            if (thumb && fill) {
                thumb.addEventListener('mousedown', () => { isDragging = true; });
                thumb.addEventListener('touchstart', () => { isDragging = true; });

                document.addEventListener('mouseup', () => { isDragging = false; });
                document.addEventListener('touchend', () => { isDragging = false; });

                document.addEventListener('mousemove', (e) => {
                    if (!isDragging) return;
                    const card = thumb.closest('.card');
                    const rect = card.getBoundingClientRect();
                    const newLeft = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                    const percentage = (newLeft / rect.width) * 100;
                    thumb.style.left = percentage + '%';
                    fill.style.width = percentage + '%';
                    if (percentage >= 95) {
                        isDragging = false;
                        navigate(thumb.dataset.next);
                    }
                });

                document.addEventListener('touchmove', (e) => {
                    if (!isDragging || !e.touches[0]) return;
                    const card = thumb.closest('.card');
                    const rect = card.getBoundingClientRect();
                    const newLeft = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
                    const percentage = (newLeft / rect.width) * 100;
                    thumb.style.left = percentage + '%';
                    fill.style.width = percentage + '%';
                    if (percentage >= 95) {
                        isDragging = false;
                        navigate(thumb.dataset.next);
                    }
                });
            }
            break;

        case 'step4':
            const tapButton = document.getElementById('tapButton');
            const tapCountDisplay = document.getElementById('tapCount');
            let tapCount = 0;
            const requiredTaps = 5;
            if (tapButton && tapCountDisplay) {
                tapButton.addEventListener('click', () => {
                    tapCount++;
                    tapCountDisplay.textContent = tapCount;
                    if (tapCount >= requiredTaps) {
                        navigate('final.html');
                    }
                });
            }
            break;

        case 'final':
            const typewriterElements = document.querySelectorAll('.type-effect');
            typewriterElements.forEach(el => {
                const text = el.dataset.text;
                const delay = el.dataset.delay ? parseFloat(el.dataset.delay) : 0;
                gsap.to(el, {
                    duration: 2,
                    ease: "none",
                    delay: delay,
                    onUpdate: function() {
                        const progress = this.progress();
                        const charCount = Math.round(text.length * progress);
                        el.textContent = text.substring(0, charCount);
                    }
                });
            });

            const yesButton = document.getElementById('yesButton');
            const noButton = document.getElementById('noButton');

            if (yesButton) {
                yesButton.addEventListener('click', () => {
                    sessionStorage.setItem('inviteAnswer', 'yes');
                    navigate('yes.html');
                });
            }
            if (noButton) {
                noButton.addEventListener('click', () => {
                    sessionStorage.setItem('inviteAnswer', 'no');
                    navigate('no.html');
                });
            }
            break;

        case 'yes':
            const answer = sessionStorage.getItem('inviteAnswer');
            if (answer !== 'yes') {
                navigate('index.html');
                return;
            }

            const whatsappShare = document.getElementById('whatsappShare');
            const message = encodeURIComponent("Iske aage to aap ko hi likhna hoga, Thanks for agreeing BTW");

            if (whatsappShare && OWNER_PHONE !== 'YOUR_PHONE_NUMBER') {
                whatsappShare.href = `https://wa.me/${OWNER_PHONE}?text=${message}`;
            } else if (whatsappShare) {
                whatsappShare.href = '#';
                whatsappShare.onclick = (e) => { e.preventDefault(); alert("Please configure the OWNER_PHONE variable in app.js"); };
            }
            break;

        case 'no':
            const noAnswer = sessionStorage.getItem('inviteAnswer');
            if (noAnswer !== 'no') {
                navigate('index.html');
                return;
            }
            break;
    }

    // Initial card reveal
    showCard();
});

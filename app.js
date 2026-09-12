document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const navToday = document.getElementById('nav-today');
    const navQurbana = document.getElementById('nav-qurbana');
    const navDesktopToday = document.getElementById('nav-desktop-today');
    const navDesktopQurbana = document.getElementById('nav-desktop-qurbana');
    
    const screenToday = document.getElementById('today-screen');
    const screenQurbana = document.getElementById('qurbana-screen');
    const btnPrayQurbana = document.getElementById('btn-pray-qurbana');
    const btnBackToday = document.getElementById('btn-back-today');
    
    const testDate = document.getElementById('test-date');
    
    const uiDate = document.getElementById('today-date');
    const uiDay = document.getElementById('liturgical-day');
    const uiSeason = document.getElementById('liturgical-season');
    const uiReadings = document.getElementById('readings-container');
    
    const qurbanaContainer = document.getElementById('qurbana-content');
    
    const btnDarkMode = document.getElementById('btn-dark-mode');
    const btnFontInc = document.getElementById('btn-font-increase');
    const btnFontDec = document.getElementById('btn-font-decrease');
    const qurbanaReader = document.querySelector('.qurbana-reader');
    
    const quickJumpSelect = document.getElementById('quick-jump-select');
    
    const btnBackToTop = document.getElementById('btn-back-to-top');

    // --- State ---
    let currentDate = '2026-09-12'; // Default to first test date
    let currentSeason = 'Elijah, Cross and Moses';
    let currentFontSize = 16;
    
    // --- Navigation Logic ---
    function switchScreen(screen) {
        if (screen === 'today') {
            screenToday.classList.add('active');
            screenQurbana.classList.remove('active');
            navToday.classList.add('active');
            navQurbana.classList.remove('active');
            window.scrollTo(0, 0);
        } else if (screen === 'qurbana') {
            screenToday.classList.remove('active');
            screenQurbana.classList.add('active');
            navToday.classList.remove('active');
            navQurbana.classList.add('active');
            renderQurbana();
            window.scrollTo(0, 0);
        }
    }

    navToday.addEventListener('click', () => switchScreen('today'));
    navQurbana.addEventListener('click', () => switchScreen('qurbana'));
    navDesktopToday?.addEventListener('click', () => switchScreen('today'));
    navDesktopQurbana?.addEventListener('click', () => switchScreen('qurbana'));
    btnPrayQurbana.addEventListener('click', () => switchScreen('qurbana'));
    btnBackToday.addEventListener('click', () => switchScreen('today'));


    // --- Data Rendering ---
    function generateBibleGatewayLink(reference) {
        // Remove anything inside parentheses and trim trailing whitespace
        const cleanRef = reference.replace(/\(.*?\)/g, '').trim();
        const encodedRef = encodeURIComponent(cleanRef);
        return `https://www.biblegateway.com/passage/?search=${encodedRef}&version=ESV`;
    }

    function renderTodayScreen(dateStr) {
        currentDate = dateStr;
        const data = readingsDB[dateStr];
        
        // Format date nicely
        const dateObj = new Date(dateStr);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        uiDate.textContent = dateObj.toLocaleDateString(undefined, options);
        
        if (data) {
            uiDay.textContent = data.liturgicalDay;
            uiSeason.textContent = data.season;
            currentSeason = data.season;
            
            uiReadings.innerHTML = '';
            data.readings.forEach(reading => {
                const link = generateBibleGatewayLink(reading.reference);
                const readingHtml = `
                    <div class="reading-item">
                        <span class="reading-type">${reading.type}</span>
                        <a href="${link}" target="_blank" rel="noopener noreferrer" class="reading-ref">
                            ${reading.reference}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; margin-left: 4px; vertical-align: middle;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                        </a>
                    </div>
                `;
                uiReadings.insertAdjacentHTML('beforeend', readingHtml);
            });
        } else {
            uiDay.textContent = 'Feria';
            uiSeason.textContent = 'Ordinary Time';
            uiReadings.innerHTML = '<p>No readings available for this date.</p>';
        }
    }

    function renderQurbana() {
        qurbanaContainer.innerHTML = `<div class="qurbana-section"><div class="qurbana-text">${fullQurbanaHtml}</div></div>`;
    }

    // --- Controls ---
    btnDarkMode.addEventListener('click', () => {
        document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    });

    btnFontInc.addEventListener('click', () => {
        if (currentFontSize < 24) {
            currentFontSize += 2;
            document.documentElement.style.setProperty('--base-font-size', `${currentFontSize}px`);
        }
    });

    btnFontDec.addEventListener('click', () => {
        if (currentFontSize > 12) {
            currentFontSize -= 2;
            document.documentElement.style.setProperty('--base-font-size', `${currentFontSize}px`);
        }
    });

    testDate.addEventListener('change', (e) => {
        renderTodayScreen(e.target.value);
    });

    if (quickJumpSelect) {
        quickJumpSelect.addEventListener('change', (e) => {
            const searchText = e.target.value;
            if (!searchText) return;
            
            // Find paragraph containing text
            const paragraphs = qurbanaContainer.querySelectorAll('p');
            for (let p of paragraphs) {
                if (p.textContent.includes(searchText)) {
                    // Offset for sticky header (60px approx)
                    const y = p.getBoundingClientRect().top + window.scrollY - 140;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                    break;
                }
            }
            
            // Reset select
            e.target.selectedIndex = 0;
        });
    }

    // Back to top behavior
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btnBackToTop.classList.add('visible');
        } else {
            btnBackToTop.classList.remove('visible');
        }
    });

    btnBackToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Init ---
    renderTodayScreen(currentDate);
});

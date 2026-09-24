document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const navToday = document.getElementById('nav-today');
    const navQurbana = document.getElementById('nav-qurbana');
    const navDesktopToday = document.getElementById('nav-desktop-today');
    const navDesktopQurbana = document.getElementById('nav-desktop-qurbana');
    const navChurch = document.getElementById('nav-church');
    const navDesktopChurch = document.getElementById('nav-desktop-church');
    
    const screenToday = document.getElementById('today-screen');
    const screenQurbana = document.getElementById('qurbana-screen');
    const screenChurch = document.getElementById('church-screen');
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

    function getTodayString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // --- State ---
    let currentDate = getTodayString();
    if (typeof readingsDB !== 'undefined' && !readingsDB[currentDate]) {
        currentDate = '2026-09-12'; // Fallback if no data
    }
    
    let currentSeason = 'Elijah, Cross and Moses';
    let currentFontSize = 16;
    
    // --- Navigation Logic ---
    function switchScreen(screen) {
        // Reset all
        screenToday.classList.remove('active');
        screenQurbana.classList.remove('active');
        if (screenChurch) screenChurch.classList.remove('active');
        
        navToday.classList.remove('active');
        navQurbana.classList.remove('active');
        if (navChurch) navChurch.classList.remove('active');

        if (screen === 'today') {
            screenToday.classList.add('active');
            navToday.classList.add('active');
        } else if (screen === 'qurbana') {
            screenQurbana.classList.add('active');
            navQurbana.classList.add('active');
            renderQurbana();
        } else if (screen === 'church') {
            if (screenChurch) screenChurch.classList.add('active');
            if (navChurch) navChurch.classList.add('active');
        }
        window.scrollTo(0, 0);
    }

    navToday.addEventListener('click', () => switchScreen('today'));
    navQurbana.addEventListener('click', () => switchScreen('qurbana'));
    if (navChurch) navChurch.addEventListener('click', () => switchScreen('church'));
    
    navDesktopToday?.addEventListener('click', () => switchScreen('today'));
    navDesktopQurbana?.addEventListener('click', () => switchScreen('qurbana'));
    navDesktopChurch?.addEventListener('click', () => switchScreen('church'));
    
    btnPrayQurbana.addEventListener('click', () => switchScreen('qurbana'));
    btnBackToday.addEventListener('click', () => switchScreen('today'));


    // --- Data Rendering ---
    let currentLang = 'eng';

    const pocBookMap = {
        'gen': 'genesis', 'ex': 'exodus', 'lev': 'leviticus', 'num': 'numbers', 'deut': 'deuteronomy',
        'josh': 'joshua', 'judg': 'judges', 'ruth': 'ruth', '1 sam': '1-samuel', '2 sam': '2-samuel',
        '1 kgs': '1-kings', '2 kgs': '2-kings', '1 chr': '1-chronicles', '2 chr': '2-chronicles',
        'ezra': 'ezra', 'neh': 'nehemiah', 'tob': 'tobit', 'jdt': 'judith', 'esth': 'esther',
        '1 mac': '1-maccabees', '2 mac': '2-maccabees', 'job': 'job', 'ps': 'psalms', 'prov': 'proverbs',
        'eccl': 'ecclesiastes', 'song': 'song-of-songs', 'wis': 'wisdom', 'sir': 'sirach',
        'is': 'isaiah', 'jer': 'jeremiah', 'lam': 'lamentations', 'bar': 'baruch', 'ezek': 'ezekiel',
        'dan': 'daniel', 'hos': 'hosea', 'joel': 'joel', 'amos': 'amos', 'obad': 'obadiah',
        'jon': 'jonah', 'mic': 'micah', 'nah': 'nahum', 'hab': 'habakkuk', 'zeph': 'zephaniah',
        'hag': 'haggai', 'zech': 'zechariah', 'mal': 'malachi',
        'mt': 'matthew', 'mk': 'mark', 'lk': 'luke', 'jn': 'john', 'acts': 'acts',
        'rom': 'romans', '1 cor': '1-corinthians', '2 cor': '2-corinthians', 'gal': 'galatians',
        'eph': 'ephesians', 'phil': 'philippians', 'col': 'colossians', '1 thes': '1-thessalonians', '2 thes': '2-thessalonians',
        '1 tim': '1-timothy', '2 tim': '2-timothy', 'tit': 'titus', 'phlm': 'philemon', 'heb': 'hebrews',
        'jas': 'james', '1 pet': '1-peter', '2 pet': '2-peter', '1 pt': '1-peter', '2 pt': '2-peter', '1 jn': '1-john', '2 jn': '2-john', '3 jn': '3-john',
        'jude': 'jude', 'rev': 'revelation'
    };
    
    const ntBooks = ['matthew', 'mark', 'luke', 'john', 'acts', 'romans', '1-corinthians', '2-corinthians', 'galatians', 'ephesians', 'philippians', 'colossians', '1-thessalonians', '2-thessalonians', '1-timothy', '2-timothy', 'titus', 'philemon', 'hebrews', 'james', '1-peter', '2-peter', '1-john', '2-john', '3-john', 'jude', 'revelation'];

    function generateBibleGatewayLink(reference) {
        if (!reference) return '#';
        const cleanRef = reference.replace(/\(.*?\)/g, '').trim();
        const encodedRef = encodeURIComponent(cleanRef);
        return `https://www.biblegateway.com/passage/?search=${encodedRef}&version=ESV`;
    }

    function generatePOCBibleLink(englishRef) {
        if (!englishRef) return '#';
        const cleanRef = englishRef.replace(/\(.*?\)/g, '').trim().toLowerCase();
        const match = cleanRef.match(/^(\d?\s*[a-z]+)\s+(\d+):?(.*)$/i);
        if (!match) return '#';
        
        const bookAbbr = match[1].trim();
        const chapter = match[2].trim();
        
        let grandam = '';
        for (const [abbr, id] of Object.entries(pocBookMap)) {
            if (bookAbbr.startsWith(abbr) || abbr.startsWith(bookAbbr)) {
                grandam = id;
                break;
            }
        }
        
        if (!grandam) return '#';
        const bib = ntBooks.includes(grandam) ? 1 : 0;
        return `https://www.pocbible.com/thirayuka.asp?bib=${bib}&grandam=${grandam}&adyayam=${chapter}`;
    }

    function renderTodayScreen(dateStr) {
        currentDate = dateStr;
        const data = readingsDB[dateStr];
        
        // Format date nicely
        const dateObj = new Date(dateStr);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        uiDate.textContent = dateObj.toLocaleDateString(undefined, options);
        
        if (data) {
            uiDay.textContent = currentLang === 'mal' && data.liturgicalDay.ml ? data.liturgicalDay.ml : data.liturgicalDay.en;
            const season = currentLang === 'mal' && data.season.ml ? data.season.ml : data.season.en;
            uiSeason.textContent = season;
            currentSeason = season;
            
            uiReadings.innerHTML = '';
            
            if (data.readingSets) {
                data.readingSets.forEach((set, index) => {
                    const setTitle = currentLang === 'mal' && set.title.ml ? set.title.ml : set.title.en;
                    
                    let setHtml = '';
                    if (index > 0) {
                        setHtml += '<div class="reading-set-separator">────────────────────────</div>';
                    }
                    if (setTitle) {
                        setHtml += `<h3 class="reading-set-title">${setTitle}</h3>`;
                    }
                    
                    uiReadings.insertAdjacentHTML('beforeend', setHtml);
                    
                    set.readings.forEach(reading => {
                        let displayRef = currentLang === 'mal' && reading.reference.ml ? reading.reference.ml : reading.reference.en;
                        // Always generate english link for POC bible translation map logic to work
                        let link = currentLang === 'mal' ? generatePOCBibleLink(reading.reference.en) : generateBibleGatewayLink(reading.reference.en);
                        
                        if (!displayRef) return; // Skip if empty

                        const readingHtml = `
                            <div class="reading-item">
                                <span class="reading-type">${reading.type}</span>
                                <a href="${link}" target="_blank" rel="noopener noreferrer" class="reading-ref">
                                    ${displayRef}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; margin-left: 4px; vertical-align: middle;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                                </a>
                            </div>
                        `;
                        uiReadings.insertAdjacentHTML('beforeend', readingHtml);
                    });
                });
            }
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

    const btnPrevDay = document.getElementById('btn-prev-day');
    const btnNextDay = document.getElementById('btn-next-day');

    function changeDateByDays(days) {
        const current = new Date(currentDate);
        current.setDate(current.getDate() + days);
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const day = String(current.getDate()).padStart(2, '0');
        const newDate = `${year}-${month}-${day}`;
        
        currentDate = newDate;
        if (testDate) {
            testDate.value = currentDate;
        }
        renderTodayScreen(currentDate);
    }

    if (btnPrevDay) {
        btnPrevDay.addEventListener('click', () => changeDateByDays(-1));
    }
    if (btnNextDay) {
        btnNextDay.addEventListener('click', () => changeDateByDays(1));
    }

    const langToggle = document.getElementById('lang-toggle');
    const labelEng = document.getElementById('label-eng');
    const labelMal = document.getElementById('label-mal');
    
    if (langToggle) {
        langToggle.addEventListener('change', (e) => {
            currentLang = e.target.checked ? 'mal' : 'eng';
            
            if (currentLang === 'mal') {
                labelMal.classList.add('active');
                labelEng.classList.remove('active');
            } else {
                labelEng.classList.add('active');
                labelMal.classList.remove('active');
            }
            
            // Re-render to show updated language
            renderTodayScreen(currentDate);
        });
    }

    // --- Init ---
    if (testDate) {
        testDate.value = currentDate;
    }
    renderTodayScreen(currentDate);

    // --- PWA Installation Logic ---
    console.log('[PWA] Checking standalone mode on load...');
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('[PWA] Running in standalone mode. Install button should be hidden by CSS.');
    } else {
        console.log('[PWA] Running in browser mode.');
    }

    let deferredPrompt = null;
    const installBtn = document.getElementById('btn-install-app');
    const shareBtn = document.getElementById('btn-share-app');
    const navShareBtn = document.getElementById('nav-share');
    const fallbackModal = document.getElementById('pwa-fallback-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');

    const handleShare = async () => {
        const shareData = {
            title: 'Holy Qurbana App',
            text: 'Read daily readings and the Holy Qurbana text of the Syro-Malabar Church.',
            url: window.location.origin + window.location.pathname
        };
        
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback to copying to clipboard
                await navigator.clipboard.writeText(shareData.url);
                alert('App link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    if (shareBtn) shareBtn.addEventListener('click', handleShare);
    if (navShareBtn) navShareBtn.addEventListener('click', handleShare);

    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('[PWA] beforeinstallprompt event fired! The browser natively supports installation prompt.');
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            console.log('[PWA] Install button clicked.');
            if (deferredPrompt) {
                console.log('[PWA] deferredPrompt exists. Triggering native prompt...');
                // Show the install prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('[PWA] User accepted the native install prompt');
                } else {
                    console.log('[PWA] User dismissed the native install prompt');
                }
                // We've used the prompt, and can't use it again, throw it away
                deferredPrompt = null;
            } else {
                console.log('[PWA] deferredPrompt is null. Displaying fallback instructions modal.');
                if (fallbackModal) {
                    fallbackModal.classList.add('active');
                }
            }
        });
    }

    if (btnCloseModal && fallbackModal) {
        btnCloseModal.addEventListener('click', () => {
            fallbackModal.classList.remove('active');
        });
    }

    window.addEventListener('appinstalled', () => {
        console.log('[PWA] appinstalled event fired! The app was successfully installed.');
        // Hide the install button immediately just in case CSS media query hasn't updated yet
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    });
});

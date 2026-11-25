(() => {
  const STORAGE_KEY = 'habitflow_habits_v1';
  const NOTES_KEY = 'habitflow_notes_v1';
  const THEME_KEY = 'habitflow_theme_v1';
  const VIEW_MODE_KEY = 'habitflow_view_v1';
  const ACTIVE_TAB_KEY = 'olimpya_active_tab_v1';
  const QUOTE_CACHE_KEY = 'olimpya_daily_quote_v1';

  // Çevrimdışı (Offline) Koruma İçin Gömülü 28 Adet Türkçe Disiplin, Alışkanlık ve Motivasyon Sözü
  const FALLBACK_TURKISH_QUOTES = [
    { quote: 'Biz tekrar tekrar ne yapıyorsak oyuz. Mükemmellik bir eylem değil, bir alışkanlıktır.', author: 'Aristoteles' },
    { quote: 'Disiplin, şu an istediğin şey ile en çok istediğin şey arasında seçim yapabilmektir.', author: 'Abraham Lincoln' },
    { quote: 'Başarı, her gün tekrarlanan küçük çabaların toplamıdır.', author: 'Robert Collier' },
    { quote: 'Motivasyon başlamanı sağlar; alışkanlık ise devam etmeni.', author: 'Jim Ryun' },
    { quote: 'Geleceğiniz, bugün ne yaptığınızla şekillenir; yarın ne yapacağınızla değil.', author: 'Robert Kiyosaki' },
    { quote: 'Küçük alışkanlıklar zamanla bileşik faiz gibi büyür; her gün %1 daha iyi olmak yıl sonunda seni bambaşka bir yere taşır.', author: 'James Clear' },
    { quote: 'Zafer, zafer benimdir diyebilenindir. Başarı ise “başaracağım” diye başlayarak sonunda “başardım” diyebilenindir.', author: 'Mustafa Kemal Atatürk' },
    { quote: 'Üstünlük, büyük bir eylemde değil, her gün gösterilen sadık istikrardadır.', author: 'Seneca' },
    { quote: 'Önce biz alışkanlıklarımızı oluştururuz, sonra alışkanlıklarımız bizi oluşturur.', author: 'John Dryden' },
    { quote: 'Zor olduğu için cesaret edemiyor değiliz; cesaret edemediğimiz için zordur.', author: 'Seneca' },
    { quote: 'Bir şeyi gerçekten yapmak isteyen bir yol bulur; istemeyen ise bir bahane.', author: 'E. C. McKenzie' },
    { quote: 'Sıradan işleri sıradışı bir istikrarla yapmak, kalıcı başarının en sade sırrıdır.', author: 'Olimpya İlkesi' },
    { quote: 'Yarın bambaşka bir insan olacağım diyorsun. Niye bugünden başlamıyorsun?', author: 'Epiktetos' },
    { quote: 'İrade kas gibidir; her gün küçük bir hedefi tamamladıkça daha da güçlenir.', author: 'William James' },
    { quote: 'Büyük işler, küçük adımların bir araya gelmesiyle başarılır.', author: 'Vincent van Gogh' },
    { quote: 'Kendine hakim olamayan hiçbir insan özgür değildir.', author: 'Epiktetos' },
    { quote: 'Yavaş ilerlemekten korkma; sadece yerinde saymaktan kork.', author: 'Doğu Atasözü' },
    { quote: 'Odaklanma, binlerce iyi fikre hayır diyebilme sanatıdır.', author: 'Steve Jobs' },
    { quote: 'Zinciri kırma: Her gün attığın tek bir çarpı işareti, dünkü emeğini bugüne bağlar.', author: 'Olimpya İlkesi' },
    { quote: 'En uzun yolculuklar bile tek bir adımla başlar.', author: 'Lao Tzu' },
    { quote: 'Düşüncelerine dikkat et, davranışların olur. Davranışlarına dikkat et, alışkanlıkların olur.', author: 'Mahatma Gandhi' },
    { quote: 'Yetenek seni zirveye taşıyabilir ama seni orada tutacak olan karakter ve disiplindir.', author: 'John Wooden' },
    { quote: 'Bugünün işini yarına bırakma; çünkü yarın da kendi yüküyle gelir.', author: 'Benjamin Franklin' },
    { quote: 'Sabır ve azim, en sert kayayı bile delen su damlası gibidir.', author: 'Lucretius' },
    { quote: 'Hedeflerine ulaşamazsın, sistemlerinin ve alışkanlıklarının seviyesine düşersin.', author: 'James Clear' },
    { quote: 'İnsan, zihninde kurduğu sınırlar kadar küçük, kurduğu disiplin kadar büyüktür.', author: 'Marcus Aurelius' },
    { quote: 'Mükemmel zamanı bekleme; şu anı al ve onu mükemmel yap.', author: 'Sri Chinmoy' },
    { quote: 'Dinlenmeyi öğren, vazgeçmeyi değil. Küçük bir adım bile hiç adım atmamaktan üstündür.', author: 'Banksy' }
  ];

  // Varsayılan Kategori Renk Eşleşmeleri
  const PRESET_CATEGORY_COLORS = {
    'sağlık': 'emerald',
    'odak/iş': 'indigo',
    'iş': 'indigo',
    'üretkenlik': 'indigo',
    'spor': 'amber',
    'kişisel gelişim': 'purple',
    'zihin': 'purple',
    'okuma': 'purple',
    'beslenme': 'emerald'
  };

  const THEME_META_COLORS = {
    light: '#4f46e5',
    dark: '#0b0f19',
    pastel: '#d97757'
  };

  const COLOR_PALETTE = ['emerald', 'indigo', 'amber', 'purple', 'rose', 'cyan'];
  const DAY_SHORT_NAMES = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  // DOM Elemanları — Genel & Üst Bilgi
  const currentDateEl = document.getElementById('current-date');
  const metaThemeColorEl = document.getElementById('meta-theme-color');
  const resetDayBtn = document.getElementById('reset-day-btn');
  const themeButtons = document.querySelectorAll('.theme-btn');
  const viewButtons = document.querySelectorAll('.view-btn');

  // Alt Navigasyon (Bottom Tab Bar) Elemanları
  const bottomNavButtons = document.querySelectorAll('.bottom-nav-item');
  const tabPanels = {
    '7days': document.getElementById('tab-panel-7days'),
    '30days': document.getElementById('tab-panel-30days'),
    'notes': document.getElementById('tab-panel-notes'),
    'quote': document.getElementById('tab-panel-quote')
  };

  // Sekme 1 ("7 Gün") Elemanları
  const progressPercentEl = document.getElementById('progress-percent');
  const progressCountEl = document.getElementById('progress-count');
  const topStreakValueEl = document.getElementById('top-streak-value');
  const bestRecordSubEl = document.getElementById('best-record-sub');
  const weeklyTotalValueEl = document.getElementById('weekly-total-value');
  const weeklyRangeSubEl = document.getElementById('weekly-range-sub');
  const progressRatioBadgeEl = document.getElementById('progress-ratio-badge');
  const progressFillEl = document.getElementById('progress-fill');
  const progressBarContainer = document.getElementById('progress-bar-container');
  const progressMessageEl = document.getElementById('progress-message');

  const habitForm = document.getElementById('habit-form');
  const habitTitleInput = document.getElementById('habit-title');
  const habitCategorySelect = document.getElementById('habit-category-select');
  const customCategoryWrapper = document.getElementById('custom-category-wrapper');
  const habitCategoryCustomInput = document.getElementById('habit-category-custom');
  const quickCategoryPills = document.querySelectorAll('.quick-cat-pill');

  const categoryFilterPillsEl = document.getElementById('category-filter-pills');
  const visibleHabitCountEl = document.getElementById('visible-habit-count');
  const weeklyBoardHeaderEl = document.getElementById('weekly-board-header');
  const habitListEl = document.getElementById('habit-list');
  const emptyStateEl = document.getElementById('empty-state');
  const emptyTitleEl = document.getElementById('empty-title');
  const emptyDescEl = document.getElementById('empty-desc');
  const emptySuggestionsEl = document.getElementById('empty-suggestions');

  // Sekme 2 ("30 Gün") Elemanları
  const monthlyDateRangeEl = document.getElementById('monthly-date-range');
  const monthlyOverallPercentEl = document.getElementById('monthly-overall-percent');
  const monthlyTotalChecksEl = document.getElementById('monthly-total-checks');
  const monthlyBestHabitEl = document.getElementById('monthly-best-habit');
  const monthlyHabitListEl = document.getElementById('monthly-habit-list');
  const monthlyEmptyStateEl = document.getElementById('monthly-empty-state');

  // Sekme 3 ("Notlar") Elemanları
  const journalSelectedDateLabelEl = document.getElementById('journal-selected-date-label');
  const journalDateInput = document.getElementById('journal-date-input');
  const journalTodayBtn = document.getElementById('journal-today-btn');
  const journalStatusBadgeEl = document.getElementById('journal-status-badge');
  const journalDayPillsEl = document.getElementById('journal-day-pills');
  const journalTextarea = document.getElementById('journal-textarea');
  const journalFeedbackEl = document.getElementById('journal-feedback');
  const journalSaveBtn = document.getElementById('journal-save-btn');
  const journalClearBtn = document.getElementById('journal-clear-btn');
  const notesHistoryCountEl = document.getElementById('notes-history-count');
  const notesHistoryListEl = document.getElementById('notes-history-list');

  // Sekme 4 ("Günün Sözü") Elemanları
  const quoteDateBadgeEl = document.getElementById('quote-date-badge');
  const quoteTextEl = document.getElementById('quote-text');
  const quoteAuthorEl = document.getElementById('quote-author');
  const quoteSourceTagEl = document.getElementById('quote-source-tag');
  const newQuoteBtn = document.getElementById('new-quote-btn');
  const copyQuoteBtn = document.getElementById('copy-quote-btn');
  const copyQuoteLabelEl = document.getElementById('copy-quote-label');

  // Veri Yedekleme & Geri Yükleme Elemanları
  const exportJsonBtn = document.getElementById('export-json-btn');
  const importJsonBtn = document.getElementById('import-json-btn');
  const importJsonInput = document.getElementById('import-json-input');
  const dataBackupStatusEl = document.getElementById('data-backup-status');

  // Uygulama Durumu (State)
  let habits = [];
  let dailyNotes = {};
  let activeCategoryFilter = 'all';
  let activeViewMode = localStorage.getItem(VIEW_MODE_KEY) === 'weekly' ? 'weekly' : 'daily';
  let activeTab = localStorage.getItem(ACTIVE_TAB_KEY) || '7days';
  let editingHabitId = null;
  let selectedNoteDateKey = '';
  let noteSaveTimer = null;

  // ==========================================================================
  // TARİH YARDIMCILARI (YYYY-MM-DD, 7 Gün ve Son 30 Gün)
  // ==========================================================================
  function formatDateKey(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function parseDateKey(dateKey) {
    const [y, m, d] = dateKey.split('-').map(Number);
    return new Date(y, m - 1, d, 12, 0, 0);
  }

  function addDaysToKey(dateKey, deltaDays) {
    const dt = parseDateKey(dateKey);
    dt.setDate(dt.getDate() + deltaDays);
    return formatDateKey(dt);
  }

  function getTodayKey() {
    return formatDateKey(new Date());
  }

  function formatHumanDateLabel(dateKey) {
    const dt = parseDateKey(dateKey);
    const todayKey = getTodayKey();
    const yesterdayKey = addDaysToKey(todayKey, -1);
    const formatted = new Intl.DateTimeFormat('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(dt);

    const capitalized = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    if (dateKey === todayKey) return `Bugün — ${capitalized}`;
    if (dateKey === yesterdayKey) return `Dün — ${capitalized}`;
    return capitalized;
  }

  // İçinde bulunulan haftanın Pazartesi'den Pazar'a 7 gününü döndürür
  function getCurrentWeekDays() {
    const today = new Date();
    const todayKey = formatDateKey(today);
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayOffset, 12, 0, 0);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = formatDateKey(d);
      days.push({
        key,
        shortName: DAY_SHORT_NAMES[i],
        dayNum: d.getDate(),
        monthShort: new Intl.DateTimeFormat('tr-TR', { month: 'short' }).format(d),
        isToday: key === todayKey,
        isFuture: key > todayKey
      });
    }
    return days;
  }

  // Son 30 günü (29 gün önce -> bugün) sıralı döndürür
  function getLast30Days() {
    const today = new Date();
    const todayKey = formatDateKey(today);
    const days = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i, 12, 0, 0);
      const key = formatDateKey(d);
      const jsDay = d.getDay();
      const shortIdx = jsDay === 0 ? 6 : jsDay - 1;
      days.push({
        key,
        shortName: DAY_SHORT_NAMES[shortIdx],
        dayNum: d.getDate(),
        monthShort: new Intl.DateTimeFormat('tr-TR', { month: 'short' }).format(d),
        isToday: key === todayKey
      });
    }
    return days;
  }

  // ==========================================================================
  // ALT NAVİGASYON (BOTTOM TAB BAR) GEÇİŞ YÖNETİMİ
  // ==========================================================================
  function switchTab(tabName) {
    const validTabs = ['7days', '30days', 'notes', 'quote'];
    const target = validTabs.includes(tabName) ? tabName : '7days';
    activeTab = target;
    localStorage.setItem(ACTIVE_TAB_KEY, target);

    bottomNavButtons.forEach((btn) => {
      const isSelected = btn.dataset.tab === target;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', String(isSelected));
    });

    Object.entries(tabPanels).forEach(([key, panelEl]) => {
      if (!panelEl) return;
      const isMatch = key === target;
      panelEl.hidden = !isMatch;
      panelEl.classList.toggle('active', isMatch);
    });

    if (target === '30days') {
      renderMonthly30DaysView();
    } else if (target === 'notes') {
      renderJournalSection();
    } else if (target === 'quote') {
      initQuoteOfTheDay(false);
    }
  }

  // ==========================================================================
  // AKILLI SERİ (STREAK) VE EN İYİ SERİ (REKOR) HESAPLAMA
  // ==========================================================================
  function calculateHabitStreaks(habit) {
    const datesArray = Array.isArray(habit.completedDates) ? habit.completedDates : [];
    const uniqueSortedDates = Array.from(new Set(datesArray)).sort();
    const dateSet = new Set(uniqueSortedDates);

    const todayKey = getTodayKey();
    const yesterdayKey = addDaysToKey(todayKey, -1);

    let currentStreak = 0;
    let cursorKey = null;

    if (dateSet.has(todayKey)) {
      cursorKey = todayKey;
    } else if (dateSet.has(yesterdayKey)) {
      cursorKey = yesterdayKey;
    }

    while (cursorKey && dateSet.has(cursorKey)) {
      currentStreak++;
      cursorKey = addDaysToKey(cursorKey, -1);
    }

    let longestCalculated = 0;
    let runningRun = 0;
    let prevKey = null;

    for (const dateKey of uniqueSortedDates) {
      if (!prevKey) {
        runningRun = 1;
      } else {
        const expectedNext = addDaysToKey(prevKey, 1);
        if (dateKey === expectedNext) {
          runningRun++;
        } else {
          runningRun = 1;
        }
      }
      if (runningRun > longestCalculated) {
        longestCalculated = runningRun;
      }
      prevKey = dateKey;
    }

    const bestStreak = Math.max(longestCalculated, currentStreak, Number(habit.bestStreak) || 0);
    return { currentStreak, bestStreak };
  }

  function isCompletedOnDate(habit, dateKey) {
    return Array.isArray(habit.completedDates) && habit.completedDates.includes(dateKey);
  }

  function isCompletedToday(habit) {
    return isCompletedOnDate(habit, getTodayKey());
  }

  function getCategoryColor(categoryName) {
    if (!categoryName) return 'indigo';
    const normalized = categoryName.trim().toLocaleLowerCase('tr-TR');
    if (PRESET_CATEGORY_COLORS[normalized]) {
      return PRESET_CATEGORY_COLORS[normalized];
    }
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
  }

  // Tema Yükleme ve Değiştirme
  function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(savedTheme);
  }

  function applyTheme(themeName) {
    const validThemes = ['light', 'dark', 'pastel'];
    const targetTheme = validThemes.includes(themeName) ? themeName : 'light';

    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem(THEME_KEY, targetTheme);

    if (metaThemeColorEl && THEME_META_COLORS[targetTheme]) {
      metaThemeColorEl.setAttribute('content', THEME_META_COLORS[targetTheme]);
    }

    themeButtons.forEach((btn) => {
      const isSelected = btn.dataset.themeValue === targetTheme;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-checked', String(isSelected));
    });
  }

  // 7 Gün Sekmesi Görünüm Modu (Kartlar / Tablo)
  function applyViewMode(viewMode) {
    activeViewMode = viewMode === 'weekly' ? 'weekly' : 'daily';
    localStorage.setItem(VIEW_MODE_KEY, activeViewMode);

    viewButtons.forEach((btn) => {
      const isSelected = btn.dataset.view === activeViewMode;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', String(isSelected));
    });

    renderHabits();
  }

  function renderCurrentDate() {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(now);

    currentDateEl.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  // ==========================================================================
  // VERİ YÜKLEME VE GERİYE DÖNÜK UYUMLULUK
  // ==========================================================================
  function normalizeHabitList(rawList) {
    const todayKey = getTodayKey();
    if (!Array.isArray(rawList)) return [];

    return rawList.map((habit, index) => {
      const category = typeof habit.category === 'string' ? habit.category.trim() : '';
      const completedDates = Array.isArray(habit.completedDates)
        ? Array.from(
            new Set(
              habit.completedDates.filter(
                (d) => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)
              )
            )
          )
        : [];

      if (habit.completed === true && !completedDates.includes(todayKey)) {
        completedDates.push(todayKey);
      }

      const normalizedHabit = {
        id: habit.id || `${Date.now().toString(36)}_${index}`,
        title: typeof habit.title === 'string' && habit.title.trim() ? habit.title.trim() : 'Alışkanlık',
        category,
        color: habit.color || getCategoryColor(category),
        completedDates: completedDates.sort(),
        completed: completedDates.includes(todayKey),
        bestStreak: Number(habit.bestStreak) || 0,
        createdAt: habit.createdAt || new Date().toISOString()
      };

      const { bestStreak } = calculateHabitStreaks(normalizedHabit);
      normalizedHabit.bestStreak = bestStreak;
      return normalizedHabit;
    });
  }

  function loadHabits() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      habits = normalizeHabitList(parsed);
      saveHabits();
    } catch (err) {
      console.error('Alışkanlık verileri okunamadı:', err);
      habits = [];
    }
  }

  function saveHabits() {
    try {
      const todayKey = getTodayKey();
      habits.forEach((h) => {
        h.completed = isCompletedOnDate(h, todayKey);
        const { bestStreak } = calculateHabitStreaks(h);
        h.bestStreak = bestStreak;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (err) {
      console.error('Alışkanlık verileri kaydedilemedi:', err);
    }
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ==========================================================================
  // SEKME 1 ("7 GÜN") — İSTATİSTİKLER VE HAFTALIK TAKİP
  // ==========================================================================
  function updateStatsAndProgress() {
    const todayKey = getTodayKey();
    const total = habits.length;
    const completedTodayCount = habits.filter((h) => isCompletedOnDate(h, todayKey)).length;
    const percent = total === 0 ? 0 : Math.round((completedTodayCount / total) * 100);

    progressPercentEl.textContent = `${percent}%`;
    progressCountEl.textContent = `${completedTodayCount} / ${total}`;
    progressRatioBadgeEl.textContent = `${completedTodayCount} / ${total} tamamlandı`;
    progressFillEl.style.width = `${percent}%`;
    progressBarContainer.setAttribute('aria-valuenow', String(percent));

    const isAllDone = total > 0 && completedTodayCount === total;
    progressPercentEl.classList.toggle('all-done', isAllDone);
    progressFillEl.classList.toggle('all-done', isAllDone);

    let topActiveStreak = 0;
    let topBestRecord = 0;

    habits.forEach((habit) => {
      const { currentStreak, bestStreak } = calculateHabitStreaks(habit);
      if (currentStreak > topActiveStreak) topActiveStreak = currentStreak;
      if (bestStreak > topBestRecord) topBestRecord = bestStreak;
    });

    topStreakValueEl.textContent = `🔥 ${topActiveStreak} gün`;
    bestRecordSubEl.textContent = `Rekor: ${topBestRecord} gün`;

    const weekDays = getCurrentWeekDays();
    const weekKeySet = new Set(weekDays.map((d) => d.key));
    let weeklyCompletions = 0;

    habits.forEach((habit) => {
      if (Array.isArray(habit.completedDates)) {
        habit.completedDates.forEach((dKey) => {
          if (weekKeySet.has(dKey)) weeklyCompletions++;
        });
      }
    });

    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    weeklyTotalValueEl.textContent = `${weeklyCompletions} kez`;
    weeklyRangeSubEl.textContent = `${firstDay.dayNum} ${firstDay.monthShort} - ${lastDay.dayNum} ${lastDay.monthShort}`;

    if (total === 0) {
      progressMessageEl.textContent = 'Takip etmek için ilk alışkanlığını ekle.';
    } else if (percent === 0) {
      progressMessageEl.textContent =
        topActiveStreak > 0
          ? `🔥 ${topActiveStreak} günlük aktif serini korumak için bugünkü hedeflerini işaretle!`
          : 'Yeni bir güne harika bir başlangıç yap!';
    } else if (percent < 50) {
      progressMessageEl.textContent = 'Güzel başladın, serini güçlendirmeye devam et!';
    } else if (percent < 100) {
      progressMessageEl.textContent = 'Yarıyı geçtin, bugünü eksiksiz tamamlamaya çok az kaldı!';
    } else {
      progressMessageEl.textContent = 'Harika! Bugünkü tüm alışkanlıklarını tamamladın ve serini korudun.';
    }
  }

  function renderCategoryFilterPills() {
    const categoryCounts = new Map();
    habits.forEach((h) => {
      if (h.category) {
        categoryCounts.set(h.category, (categoryCounts.get(h.category) || 0) + 1);
      }
    });

    if (activeCategoryFilter !== 'all' && !categoryCounts.has(activeCategoryFilter)) {
      activeCategoryFilter = 'all';
    }

    categoryFilterPillsEl.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = `filter-pill${activeCategoryFilter === 'all' ? ' active' : ''}`;
    allBtn.dataset.filterCat = 'all';
    allBtn.setAttribute('role', 'tab');
    allBtn.setAttribute('aria-selected', String(activeCategoryFilter === 'all'));
    allBtn.innerHTML = `
      <span>Tümü</span>
      <span class="pill-count">${habits.length}</span>
    `;
    categoryFilterPillsEl.appendChild(allBtn);

    categoryCounts.forEach((count, categoryName) => {
      const color = getCategoryColor(categoryName);
      const isSelected = activeCategoryFilter === categoryName;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `filter-pill${isSelected ? ' active' : ''}`;
      btn.dataset.filterCat = categoryName;
      btn.dataset.color = color;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(isSelected));
      btn.innerHTML = `
        <span class="cat-dot"></span>
        <span>${escapeHTML(categoryName)}</span>
        <span class="pill-count">${count}</span>
      `;
      categoryFilterPillsEl.appendChild(btn);
    });
  }

  function renderWeeklyBoardHeader(weekDays, hasVisibleHabits) {
    if (activeViewMode !== 'weekly' || !hasVisibleHabits) {
      weeklyBoardHeaderEl.hidden = true;
      weeklyBoardHeaderEl.innerHTML = '';
      return;
    }

    weeklyBoardHeaderEl.hidden = false;
    const daysColsHTML = weekDays
      .map(
        (d) => `
        <div class="weekly-day-head${d.isToday ? ' is-today' : ''}">
          <span class="d-name">${d.shortName}</span>
          <span class="d-num">${d.dayNum}</span>
        </div>
      `
      )
      .join('');

    weeklyBoardHeaderEl.innerHTML = `
      <div class="weekly-col-title">Alışkanlık & Seri</div>
      ${daysColsHTML}
      <div class="weekly-col-actions">İşlem</div>
    `;
  }

  function createHabitItemElement(habit, weekDays) {
    const todayCompleted = isCompletedToday(habit);
    const li = document.createElement('li');
    li.dataset.id = habit.id;

    if (editingHabitId === habit.id) {
      li.className = 'habit-item';
      li.innerHTML = `
        <form class="habit-edit-form" data-edit-id="${habit.id}" autocomplete="off">
          <input
            type="text"
            class="habit-edit-title"
            value="${escapeHTML(habit.title)}"
            placeholder="Alışkanlık adı..."
            maxlength="80"
            required
          />
          <input
            type="text"
            class="habit-edit-cat"
            value="${escapeHTML(habit.category || '')}"
            placeholder="Kategori (örn. Sağlık)"
            maxlength="24"
          />
          <div class="edit-actions">
            <button type="submit" class="save-edit-btn">Kaydet</button>
            <button type="button" class="cancel-edit-btn">İptal</button>
          </div>
        </form>
      `;
      return li;
    }

    const { currentStreak, bestStreak } = calculateHabitStreaks(habit);
    const color = habit.color || getCategoryColor(habit.category);

    const categoryBadge = habit.category
      ? `<span class="category-tag" data-color="${color}">
           <span class="cat-dot"></span>
           ${escapeHTML(habit.category)}
         </span>`
      : '';

    const streakBadge = `
      <span class="streak-badge${currentStreak > 0 ? ' has-streak' : ''}" title="Aktif Seri: ${currentStreak} gün | En İyi Seri: ${bestStreak} gün">
        <span>🔥 ${currentStreak} gün</span>
        <span class="streak-best">(En iyi: ${bestStreak})</span>
      </span>
    `;

    const actionButtonsHTML = `
      <div class="habit-actions">
        <button type="button" class="icon-btn edit-btn" title="Alışkanlığı düzenle" aria-label="${escapeHTML(habit.title)} alışkanlığını düzenle">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        </button>
        <button type="button" class="icon-btn delete-btn" title="Alışkanlığı sil" aria-label="${escapeHTML(habit.title)} alışkanlığını sil">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `;

    if (activeViewMode === 'weekly') {
      li.className = `habit-item weekly-row${todayCompleted ? ' completed' : ''}`;
      const cellsHTML = weekDays
        .map((d) => {
          const done = isCompletedOnDate(habit, d.key);
          const stateClass = `${done ? ' is-done' : ''}${d.isToday ? ' is-today' : ''}`;
          const label = `${escapeHTML(habit.title)} - ${d.dayNum} ${d.monthShort} ${d.shortName}`;
          return `
            <div class="weekly-cell">
              <button
                type="button"
                class="weekly-check-btn day-toggle-btn${stateClass}"
                data-habit-id="${habit.id}"
                data-date-key="${d.key}"
                title="${label}"
                aria-label="${label}"
                aria-pressed="${done}"
                ${d.isFuture ? 'disabled' : ''}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
            </div>
          `;
        })
        .join('');

      li.innerHTML = `
        <div class="weekly-habit-info">
          <div class="habit-title-wrapper">
            <span class="habit-title">${escapeHTML(habit.title)}</span>
          </div>
          <div class="habit-meta">
            ${categoryBadge}
            ${streakBadge}
          </div>
        </div>
        ${cellsHTML}
        ${actionButtonsHTML}
      `;
      return li;
    }

    li.className = `habit-item${todayCompleted ? ' completed' : ''}`;

    const miniWeekPillsHTML = weekDays
      .map((d) => {
        const done = isCompletedOnDate(habit, d.key);
        const classes = [
          'day-pill',
          'day-toggle-btn',
          done ? 'is-done' : '',
          d.isToday ? 'is-today' : '',
          d.isFuture ? 'is-future' : ''
        ]
          .filter(Boolean)
          .join(' ');

        const tooltip = d.isFuture
          ? `${d.dayNum} ${d.monthShort} ${d.shortName} (Gelecek gün)`
          : `${d.dayNum} ${d.monthShort} ${d.shortName} — ${done ? 'Tamamlandı (Kaldırmak için tıkla)' : 'Tamamlandı olarak işaretle'}`;

        return `
          <button
            type="button"
            class="${classes}"
            data-habit-id="${habit.id}"
            data-date-key="${d.key}"
            title="${tooltip}"
            aria-label="${tooltip}"
            aria-pressed="${done}"
            ${d.isFuture ? 'disabled' : ''}
          >
            <span class="day-pill-name">${d.shortName}</span>
            <span class="day-pill-num">${done ? '✓' : d.dayNum}</span>
          </button>
        `;
      })
      .join('');

    li.innerHTML = `
      <div class="habit-main-row">
        <label class="habit-label">
          <input
            type="checkbox"
            class="habit-checkbox"
            ${todayCompleted ? 'checked' : ''}
            aria-label="${escapeHTML(habit.title)} bugün tamamlandı olarak işaretle"
          />
          <span class="custom-checkbox" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <div class="habit-content">
            <div class="habit-title-wrapper">
              <span class="habit-title">${escapeHTML(habit.title)}</span>
            </div>
            <div class="habit-meta">
              ${categoryBadge}
              ${streakBadge}
            </div>
          </div>
        </label>
        ${actionButtonsHTML}
      </div>
      <div class="habit-week-strip" aria-label="Bu Haftanın Günleri (Pzt - Paz)">
        <span class="week-strip-label">7 Gün (Pzt-Paz):</span>
        <div class="week-days-row">
          ${miniWeekPillsHTML}
        </div>
      </div>
    `;

    return li;
  }

  function renderHabits() {
    renderCategoryFilterPills();
    const weekDays = getCurrentWeekDays();

    const filteredHabits = habits.filter((habit) => {
      if (activeCategoryFilter === 'all') return true;
      return habit.category === activeCategoryFilter;
    });

    const pendingHabits = filteredHabits.filter((h) => !isCompletedToday(h));
    const completedHabits = filteredHabits.filter((h) => isCompletedToday(h));

    renderWeeklyBoardHeader(weekDays, filteredHabits.length > 0);
    habitListEl.innerHTML = '';

    if (filteredHabits.length === 0) {
      emptyStateEl.hidden = false;
      visibleHabitCountEl.textContent = '';

      if (habits.length === 0) {
        emptyTitleEl.textContent = 'Büyük değişimler küçük adımlarla başlar';
        emptyDescEl.textContent =
          'Henüz takip ettiğin bir alışkanlık yok. Yukarıdan yeni bir hedef ekle veya aşağıdaki örneklerden biriyle hemen başla:';
        emptySuggestionsEl.hidden = false;
      } else {
        emptyTitleEl.textContent = `"${activeCategoryFilter}" kategorisinde alışkanlık yok`;
        emptyDescEl.textContent = 'Diğer kategorilere göz atabilir veya bu kategoriye yeni bir alışkanlık ekleyebilirsin.';
        emptySuggestionsEl.hidden = true;
      }
    } else {
      emptyStateEl.hidden = true;
      visibleHabitCountEl.textContent =
        pendingHabits.length > 0
          ? `${pendingHabits.length} bekleyen`
          : 'Bugün tümü tamamlandı';

      pendingHabits.forEach((habit) => {
        habitListEl.appendChild(createHabitItemElement(habit, weekDays));
      });

      if (completedHabits.length > 0 && pendingHabits.length > 0) {
        const divider = document.createElement('li');
        divider.className = 'habit-group-divider';
        divider.setAttribute('aria-hidden', 'true');
        divider.textContent = `Bugün Tamamlananlar (${completedHabits.length})`;
        habitListEl.appendChild(divider);
      }

      completedHabits.forEach((habit) => {
        habitListEl.appendChild(createHabitItemElement(habit, weekDays));
      });
    }

    updateStatsAndProgress();

    if (activeTab === '30days') {
      renderMonthly30DaysView();
    }

    if (editingHabitId) {
      const editInput = habitListEl.querySelector('.habit-edit-title');
      if (editInput) {
        editInput.focus();
        editInput.setSelectionRange(editInput.value.length, editInput.value.length);
      }
    }
  }

  // ==========================================================================
  // SEKME 2 ("30 GÜN") — SON 30 GÜNLÜK PERFORMANS VE ETKİLEŞİMLİ IZGARA
  // ==========================================================================
  function renderMonthly30DaysView() {
    const days30 = getLast30Days();
    const firstDay = days30[0];
    const lastDay = days30[days30.length - 1];
    monthlyDateRangeEl.textContent = `${firstDay.dayNum} ${firstDay.monthShort} — ${lastDay.dayNum} ${lastDay.monthShort} (Son 30 Gün)`;

    monthlyHabitListEl.innerHTML = '';

    if (habits.length === 0) {
      monthlyEmptyStateEl.hidden = false;
      monthlyOverallPercentEl.textContent = '0%';
      monthlyTotalChecksEl.textContent = '0 tamamlama';
      monthlyBestHabitEl.textContent = '—';
      return;
    }

    monthlyEmptyStateEl.hidden = true;

    const days30KeySet = new Set(days30.map((d) => d.key));
    let totalChecksIn30Days = 0;
    let bestHabitTitle = '—';
    let bestHabitCount = -1;

    habits.forEach((habit) => {
      let completedIn30 = 0;
      if (Array.isArray(habit.completedDates)) {
        habit.completedDates.forEach((dKey) => {
          if (days30KeySet.has(dKey)) completedIn30++;
        });
      }

      totalChecksIn30Days += completedIn30;
      if (completedIn30 > bestHabitCount && completedIn30 > 0) {
        bestHabitCount = completedIn30;
        bestHabitTitle = `${habit.title} (${Math.round((completedIn30 / 30) * 100)}%)`;
      }

      const habitPercent = Math.round((completedIn30 / 30) * 100);
      const isHighRate = habitPercent >= 70;
      const { currentStreak, bestStreak } = calculateHabitStreaks(habit);
      const color = habit.color || getCategoryColor(habit.category);

      const categoryBadge = habit.category
        ? `<span class="category-tag" data-color="${color}">
             <span class="cat-dot"></span>
             ${escapeHTML(habit.category)}
           </span>`
        : '';

      const gridCellsHTML = days30
        .map((d) => {
          const done = isCompletedOnDate(habit, d.key);
          const classes = [
            'month-day-cell',
            done ? 'is-done' : '',
            d.isToday ? 'is-today' : ''
          ]
            .filter(Boolean)
            .join(' ');

          const tooltip = `${d.dayNum} ${d.monthShort} (${d.shortName}) — ${done ? 'Tamamlandı (Geri almak için tıkla)' : 'Tamamlandı olarak işaretle'}`;
          return `
            <button
              type="button"
              class="${classes}"
              data-month-habit-id="${habit.id}"
              data-month-date-key="${d.key}"
              title="${tooltip}"
              aria-label="${tooltip}"
              aria-pressed="${done}"
            >
              <span class="m-day-num">${done ? '✓' : d.dayNum}</span>
              <span class="m-day-mon">${d.monthShort}</span>
            </button>
          `;
        })
        .join('');

      const card = document.createElement('div');
      card.className = 'card monthly-habit-card';
      card.innerHTML = `
        <div class="monthly-habit-header">
          <div class="monthly-habit-title-wrap">
            <span class="monthly-habit-title">${escapeHTML(habit.title)}</span>
            <div class="habit-meta">
              ${categoryBadge}
              <span class="streak-badge${currentStreak > 0 ? ' has-streak' : ''}">
                🔥 ${currentStreak} gün <span class="streak-best">(Rekor: ${bestStreak})</span>
              </span>
            </div>
          </div>
          <div class="monthly-habit-stats">
            <span class="monthly-rate-pill${isHighRate ? ' high-rate' : ''}">
              ${habitPercent}% (${completedIn30}/30 gün)
            </span>
          </div>
        </div>
        <div class="monthly-rate-bar" aria-hidden="true">
          <div class="monthly-rate-fill${isHighRate ? ' high-rate' : ''}" style="width: ${habitPercent}%"></div>
        </div>
        <div class="monthly-grid-30" role="group" aria-label="${escapeHTML(habit.title)} son 30 gün ızgarası">
          ${gridCellsHTML}
        </div>
      `;

      monthlyHabitListEl.appendChild(card);
    });

    const maxPossible = habits.length * 30;
    const overallPercent = maxPossible === 0 ? 0 : Math.round((totalChecksIn30Days / maxPossible) * 100);

    monthlyOverallPercentEl.textContent = `${overallPercent}%`;
    monthlyTotalChecksEl.textContent = `${totalChecksIn30Days} / ${maxPossible} gün`;
    monthlyBestHabitEl.textContent = bestHabitTitle;
  }

  // ==========================================================================
  // SEKME 3 ("NOTLAR") — GÜNLÜK YANSIMA VE GEÇMİŞ NOTLAR LİSTESİ
  // ==========================================================================
  function loadNotes() {
    try {
      const raw = localStorage.getItem(NOTES_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      dailyNotes = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (err) {
      console.error('Günlük notlar okunamadı:', err);
      dailyNotes = {};
    }
    selectedNoteDateKey = getTodayKey();
  }

  function saveNotesToStorage() {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(dailyNotes));
    } catch (err) {
      console.error('Günlük notlar kaydedilemedi:', err);
    }
  }

  function selectJournalDate(dateKey) {
    if (!dateKey || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return;
    selectedNoteDateKey = dateKey;
    renderJournalSection();
  }

  function renderNotesHistoryList() {
    const entries = Object.entries(dailyNotes)
      .filter(([key, val]) => /^\d{4}-\d{2}-\d{2}$/.test(key) && typeof val === 'string' && val.trim().length > 0)
      .sort((a, b) => b[0].localeCompare(a[0]));

    notesHistoryCountEl.textContent = `${entries.length} not`;
    notesHistoryListEl.innerHTML = '';

    if (entries.length === 0) {
      notesHistoryListEl.innerHTML = `
        <p class="note-history-empty">Henüz kaydedilmiş bir günlük not bulunmuyor. Yukarıdan bugünün ilk notunu yazıp kaydedebilirsin.</p>
      `;
      return;
    }

    entries.forEach(([dateKey, noteText]) => {
      const item = document.createElement('div');
      const isSelected = dateKey === selectedNoteDateKey;
      item.className = `note-history-item${isSelected ? ' active-note' : ''}`;
      item.dataset.historyDate = dateKey;

      item.innerHTML = `
        <div class="note-history-content">
          <span class="note-history-date">${escapeHTML(formatHumanDateLabel(dateKey))}</span>
          <p class="note-history-preview">${escapeHTML(noteText)}</p>
        </div>
        <button type="button" class="icon-btn delete-note-history-btn" data-delete-note-date="${dateKey}" title="Bu notu sil" aria-label="${escapeHTML(dateKey)} tarihli notu sil">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      `;
      notesHistoryListEl.appendChild(item);
    });
  }

  function renderJournalSection() {
    if (!selectedNoteDateKey) {
      selectedNoteDateKey = getTodayKey();
    }

    const weekDays = getCurrentWeekDays();
    const currentNote = dailyNotes[selectedNoteDateKey] || '';

    journalSelectedDateLabelEl.textContent = formatHumanDateLabel(selectedNoteDateKey);
    if (journalDateInput) {
      journalDateInput.value = selectedNoteDateKey;
    }
    journalTextarea.value = currentNote;

    const hasNote = currentNote.trim().length > 0;
    journalStatusBadgeEl.textContent = hasNote ? 'Not kaydedildi' : 'Not yok';
    journalStatusBadgeEl.classList.toggle('has-note', hasNote);

    journalDayPillsEl.innerHTML = '';
    weekDays.forEach((d) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isSelected = d.key === selectedNoteDateKey;
      const dayHasNote = Boolean(dailyNotes[d.key] && dailyNotes[d.key].trim());

      btn.className = `journal-day-pill${isSelected ? ' active' : ''}`;
      btn.dataset.noteDate = d.key;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(isSelected));
      btn.title = `${d.dayNum} ${d.monthShort} ${d.shortName}${dayHasNote ? ' (Not var)' : ''}`;

      btn.innerHTML = `
        <span>${d.shortName} ${d.dayNum}</span>
        ${dayHasNote ? '<span class="note-indicator" aria-hidden="true"></span>' : ''}
      `;
      journalDayPillsEl.appendChild(btn);
    });

    renderNotesHistoryList();
  }

  function persistCurrentJournalNote(showSavedMessage = true) {
    if (!selectedNoteDateKey) return;
    const text = journalTextarea.value.trim();

    if (text) {
      dailyNotes[selectedNoteDateKey] = text;
    } else {
      delete dailyNotes[selectedNoteDateKey];
    }

    saveNotesToStorage();

    const hasNote = text.length > 0;
    journalStatusBadgeEl.textContent = hasNote ? 'Not kaydedildi' : 'Not yok';
    journalStatusBadgeEl.classList.toggle('has-note', hasNote);

    const weekDays = getCurrentWeekDays();
    journalDayPillsEl.querySelectorAll('.journal-day-pill').forEach((pill, idx) => {
      const d = weekDays[idx];
      if (!d) return;
      const dayHasNote = Boolean(dailyNotes[d.key] && dailyNotes[d.key].trim());
      pill.innerHTML = `
        <span>${d.shortName} ${d.dayNum}</span>
        ${dayHasNote ? '<span class="note-indicator" aria-hidden="true"></span>' : ''}
      `;
    });

    renderNotesHistoryList();

    if (showSavedMessage) {
      journalFeedbackEl.textContent = hasNote
        ? `✓ ${formatHumanDateLabel(selectedNoteDateKey)} notu kaydedildi`
        : 'Not silindi';
      journalFeedbackEl.classList.add('saved');
      setTimeout(() => {
        journalFeedbackEl.classList.remove('saved');
        journalFeedbackEl.textContent = 'Otomatik kaydedilir';
      }, 2200);
    }
  }

  // ==========================================================================
  // SEKME 4 ("GÜNÜN SÖZÜ") — API + LOCALSTORAGE + 28 TÜRKÇE YEDEK SÖZ
  // ==========================================================================
  function getDeterministicFallbackQuote(dateKey, forceRandom = false) {
    if (forceRandom) {
      const idx = Math.floor(Math.random() * FALLBACK_TURKISH_QUOTES.length);
      return {
        ...FALLBACK_TURKISH_QUOTES[idx],
        source: 'Olimpya Türkçe Koleksiyonu'
      };
    }

    let hash = 0;
    for (let i = 0; i < dateKey.length; i++) {
      hash = dateKey.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % FALLBACK_TURKISH_QUOTES.length;
    return {
      ...FALLBACK_TURKISH_QUOTES[idx],
      source: 'Olimpya Türkçe Koleksiyonu'
    };
  }

  function displayQuoteOnUI(quoteData) {
    const todayKey = getTodayKey();
    quoteDateBadgeEl.textContent = formatHumanDateLabel(todayKey);
    quoteTextEl.textContent = quoteData.quote;
    quoteAuthorEl.textContent = `— ${quoteData.author || 'Anonim'}`;
    quoteSourceTagEl.textContent = quoteData.source || 'Günün Sözü';
  }

  async function fetchAndCacheQuote(forceNew = false) {
    const todayKey = getTodayKey();

    if (!forceNew) {
      try {
        const cachedRaw = localStorage.getItem(QUOTE_CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (cached && cached.date === todayKey && cached.quote) {
            displayQuoteOnUI(cached);
            return;
          }
        }
      } catch (e) {
        // Önbellek okunamazsa devam et
      }
    }

    // Yüklenirken önce çevrimdışı yedeği hazır tut, API yanıt verirse güncelle
    newQuoteBtn.disabled = true;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3800);

      const response = await fetch('https://dummyjson.com/quotes/random', {
        signal: controller.signal,
        cache: 'no-store'
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('API yanıt vermedi');
      const data = await response.json();

      if (data && typeof data.quote === 'string' && data.quote.trim()) {
        const payload = {
          date: todayKey,
          quote: data.quote.trim(),
          author: data.author || 'Anonim',
          source: 'Günlük İlham Servisi'
        };
        localStorage.setItem(QUOTE_CACHE_KEY, JSON.stringify(payload));
        displayQuoteOnUI(payload);
        newQuoteBtn.disabled = false;
        return;
      }
      throw new Error('Geçersiz söz verisi');
    } catch (err) {
      // Çevrimdışıysa veya API erişilemezse gömülü 28 Türkçe sözden göster
      const fallback = getDeterministicFallbackQuote(todayKey, forceNew);
      const payload = {
        date: todayKey,
        quote: fallback.quote,
        author: fallback.author,
        source: fallback.source
      };
      localStorage.setItem(QUOTE_CACHE_KEY, JSON.stringify(payload));
      displayQuoteOnUI(payload);
    } finally {
      newQuoteBtn.disabled = false;
    }
  }

  function initQuoteOfTheDay(forceNew = false) {
    fetchAndCacheQuote(forceNew);
  }

  async function copyCurrentQuoteToClipboard() {
    const textToCopy = `“${quoteTextEl.textContent}” ${quoteAuthorEl.textContent}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      copyQuoteLabelEl.textContent = '✓ Kopyalandı!';
      setTimeout(() => {
        copyQuoteLabelEl.textContent = 'Sözü Kopyala';
      }, 2000);
    } catch (err) {
      copyQuoteLabelEl.textContent = 'Kopyalandı';
      setTimeout(() => {
        copyQuoteLabelEl.textContent = 'Sözü Kopyala';
      }, 2000);
    }
  }

  // ==========================================================================
  // ALIŞKANLIK EKLEME, İŞARETLEME, DÜZENLEME VE SİLME
  // ==========================================================================
  function getSelectedFormCategory() {
    const selectVal = habitCategorySelect.value;
    if (selectVal === '__custom__') {
      return habitCategoryCustomInput.value.trim();
    }
    return selectVal.trim();
  }

  function addHabit(title, category) {
    const cleanTitle = title.trim();
    const cleanCategory = category.trim();

    if (!cleanTitle) return;

    const newHabit = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      title: cleanTitle,
      category: cleanCategory,
      color: getCategoryColor(cleanCategory),
      completedDates: [],
      completed: false,
      bestStreak: 0,
      createdAt: new Date().toISOString()
    };

    habits.unshift(newHabit);
    saveHabits();
    renderHabits();
  }

  function toggleHabitOnDate(id, dateKey, animateIfToday = false) {
    const todayKey = getTodayKey();
    if (dateKey > todayKey) return;

    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    if (!Array.isArray(habit.completedDates)) {
      habit.completedDates = [];
    }

    const idx = habit.completedDates.indexOf(dateKey);
    if (idx === -1) {
      habit.completedDates.push(dateKey);
      habit.completedDates.sort();
    } else {
      habit.completedDates.splice(idx, 1);
    }

    saveHabits();
    selectJournalDate(dateKey);

    if (animateIfToday && dateKey === todayKey && activeViewMode === 'daily' && activeTab === '7days') {
      const itemEl = habitListEl.querySelector(`.habit-item[data-id="${id}"]`);
      if (itemEl) {
        itemEl.classList.toggle('completed', isCompletedToday(habit));
        updateStatsAndProgress();
        setTimeout(() => {
          renderHabits();
        }, 280);
        return;
      }
    }

    renderHabits();
  }

  function saveEditedHabit(id, newTitle, newCategory) {
    const cleanTitle = newTitle.trim();
    const cleanCategory = newCategory.trim();
    if (!cleanTitle) return;

    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    habit.title = cleanTitle;
    habit.category = cleanCategory;
    habit.color = getCategoryColor(cleanCategory);

    editingHabitId = null;
    saveHabits();
    renderHabits();
  }

  function deleteHabit(id) {
    habits = habits.filter((h) => h.id !== id);
    if (editingHabitId === id) editingHabitId = null;
    saveHabits();
    renderHabits();
  }

  function resetTodayProgress() {
    if (habits.length === 0) return;
    const todayKey = getTodayKey();
    const hasCompletedToday = habits.some((h) => isCompletedOnDate(h, todayKey));
    if (!hasCompletedToday) return;

    habits.forEach((habit) => {
      if (Array.isArray(habit.completedDates)) {
        habit.completedDates = habit.completedDates.filter((d) => d !== todayKey);
      }
    });
    saveHabits();
    renderHabits();
  }

  function syncCategorySelectionUI(selectedValue) {
    habitCategorySelect.value = selectedValue;
    const isCustom = selectedValue === '__custom__';
    customCategoryWrapper.hidden = !isCustom;
    if (isCustom) {
      habitCategoryCustomInput.focus();
    }

    quickCategoryPills.forEach((pill) => {
      pill.classList.toggle('active', pill.dataset.cat === selectedValue);
    });
  }

  // ==========================================================================
  // JSON VERİ YEDEKLEME (EXPORT) VE GERİ YÜKLEME (IMPORT)
  // ==========================================================================
  function showBackupFeedback(message, isError = false) {
    dataBackupStatusEl.textContent = message;
    dataBackupStatusEl.classList.toggle('status-ok', !isError);
    dataBackupStatusEl.classList.toggle('status-err', isError);

    setTimeout(() => {
      dataBackupStatusEl.classList.remove('status-ok', 'status-err');
      dataBackupStatusEl.textContent =
        'Verileriniz cihazınızda güvenle saklanır. JSON olarak yedekleyebilir veya geri yükleyebilirsiniz.';
    }, 4500);
  }

  function exportBackupToJson() {
    try {
      const todayKey = getTodayKey();
      const backupPayload = {
        app: 'Olimpya',
        version: 5,
        exportedAt: new Date().toISOString(),
        theme: localStorage.getItem(THEME_KEY) || 'light',
        viewMode: activeViewMode,
        habits,
        notes: dailyNotes
      };

      const jsonStr = JSON.stringify(backupPayload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `habit-tracker-yedek-${todayKey}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showBackupFeedback(`✓ Yedek dosyası indirildi (habit-tracker-yedek-${todayKey}.json).`, false);
    } catch (err) {
      console.error('Yedekleme hatası:', err);
      showBackupFeedback('Yedek dosyası oluşturulurken bir hata oluştu.', true);
    }
  }

  function importBackupFromJsonFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(String(e.target.result || ''));

        let incomingHabits = null;
        let incomingNotes = {};
        let incomingTheme = null;
        let incomingViewMode = null;

        if (Array.isArray(parsed)) {
          incomingHabits = parsed;
        } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.habits)) {
          incomingHabits = parsed.habits;
          if (parsed.notes && typeof parsed.notes === 'object' && !Array.isArray(parsed.notes)) {
            incomingNotes = parsed.notes;
          }
          if (typeof parsed.theme === 'string') {
            incomingTheme = parsed.theme;
          }
          if (typeof parsed.viewMode === 'string') {
            incomingViewMode = parsed.viewMode;
          }
        }

        if (!incomingHabits) {
          showBackupFeedback('Geçersiz yedek dosyası: Alışkanlık listesi bulunamadı.', true);
          return;
        }

        const normalizedHabits = normalizeHabitList(incomingHabits);
        const noteCount = Object.keys(incomingNotes).length;

        const confirmed = window.confirm(
          `Seçilen yedek dosyasında ${normalizedHabits.length} alışkanlık ve ${noteCount} günlük not bulundu.\n\nMevcut verilerinizin yerine bu yedeği geri yüklemek istiyor musunuz?`
        );

        if (!confirmed) {
          importJsonInput.value = '';
          return;
        }

        habits = normalizedHabits;
        dailyNotes = incomingNotes;
        saveHabits();
        saveNotesToStorage();

        if (incomingTheme) {
          applyTheme(incomingTheme);
        }
        if (incomingViewMode) {
          applyViewMode(incomingViewMode);
        } else {
          renderHabits();
        }

        renderMonthly30DaysView();
        renderJournalSection();
        showBackupFeedback(
          `✓ Yedek başarıyla geri yüklendi (${habits.length} alışkanlık, ${noteCount} not).`,
          false
        );
      } catch (err) {
        console.error('İçe aktarma hatası:', err);
        showBackupFeedback('Seçilen dosya geçerli bir JSON yedek dosyası değil.', true);
      } finally {
        importJsonInput.value = '';
      }
    };

    reader.onerror = () => {
      showBackupFeedback('Dosya okunurken bir hata oluştu.', true);
      importJsonInput.value = '';
    };

    reader.readAsText(file, 'utf-8');
  }

  // ==========================================================================
  // PWA SERVICE WORKER KAYDI
  // ==========================================================================
  function registerServiceWorker() {
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch((err) => {
          console.warn('Service Worker kaydı atlandı:', err);
        });
      });
    }
  }

  // ==========================================================================
  // OLAY DİNLEYİCİLERİ (EVENT LISTENERS)
  // ==========================================================================
  bottomNavButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.themeValue);
    });
  });

  viewButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyViewMode(btn.dataset.view);
    });
  });

  habitCategorySelect.addEventListener('change', () => {
    syncCategorySelectionUI(habitCategorySelect.value);
  });

  quickCategoryPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      syncCategorySelectionUI(pill.dataset.cat);
    });
  });

  habitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = getSelectedFormCategory();
    addHabit(habitTitleInput.value, category);
    habitTitleInput.value = '';
    habitCategoryCustomInput.value = '';
    habitTitleInput.focus();
  });

  categoryFilterPillsEl.addEventListener('click', (e) => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;
    activeCategoryFilter = pill.dataset.filterCat;
    renderHabits();
  });

  habitListEl.addEventListener('change', (e) => {
    if (e.target.classList.contains('habit-checkbox')) {
      const itemEl = e.target.closest('.habit-item');
      if (itemEl) {
        toggleHabitOnDate(itemEl.dataset.id, getTodayKey(), true);
      }
    }
  });

  habitListEl.addEventListener('click', (e) => {
    const dayToggleBtn = e.target.closest('.day-toggle-btn');
    if (dayToggleBtn && !dayToggleBtn.disabled) {
      const habitId = dayToggleBtn.dataset.habitId;
      const dateKey = dayToggleBtn.dataset.dateKey;
      if (habitId && dateKey) {
        toggleHabitOnDate(habitId, dateKey, false);
      }
      return;
    }

    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
      const itemEl = deleteBtn.closest('.habit-item');
      if (itemEl) deleteHabit(itemEl.dataset.id);
      return;
    }

    const editBtn = e.target.closest('.edit-btn');
    if (editBtn) {
      const itemEl = editBtn.closest('.habit-item');
      if (itemEl) {
        editingHabitId = itemEl.dataset.id;
        renderHabits();
      }
      return;
    }

    const cancelEditBtn = e.target.closest('.cancel-edit-btn');
    if (cancelEditBtn) {
      editingHabitId = null;
      renderHabits();
    }
  });

  habitListEl.addEventListener('submit', (e) => {
    if (e.target.classList.contains('habit-edit-form')) {
      e.preventDefault();
      const id = e.target.dataset.editId;
      const titleInput = e.target.querySelector('.habit-edit-title');
      const catInput = e.target.querySelector('.habit-edit-cat');
      saveEditedHabit(id, titleInput.value, catInput.value);
    }
  });

  habitListEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && editingHabitId) {
      editingHabitId = null;
      renderHabits();
    }
  });

  emptySuggestionsEl.addEventListener('click', (e) => {
    const chip = e.target.closest('.suggestion-chip');
    if (!chip) return;
    addHabit(chip.dataset.suggestTitle, chip.dataset.suggestCat);
  });

  resetDayBtn.addEventListener('click', resetTodayProgress);

  // Sekme 2 ("30 Gün") Izgara Tıklama Dinleyicisi
  monthlyHabitListEl.addEventListener('click', (e) => {
    const cellBtn = e.target.closest('.month-day-cell');
    if (!cellBtn) return;
    const habitId = cellBtn.dataset.monthHabitId;
    const dateKey = cellBtn.dataset.monthDateKey;
    if (habitId && dateKey) {
      toggleHabitOnDate(habitId, dateKey, false);
    }
  });

  // Sekme 3 ("Notlar") Olay Dinleyicileri
  journalDateInput.addEventListener('change', () => {
    if (journalDateInput.value) {
      selectJournalDate(journalDateInput.value);
    }
  });

  journalTodayBtn.addEventListener('click', () => {
    selectJournalDate(getTodayKey());
  });

  journalDayPillsEl.addEventListener('click', (e) => {
    const pill = e.target.closest('.journal-day-pill');
    if (!pill || !pill.dataset.noteDate) return;
    selectJournalDate(pill.dataset.noteDate);
  });

  journalTextarea.addEventListener('input', () => {
    clearTimeout(noteSaveTimer);
    noteSaveTimer = setTimeout(() => {
      persistCurrentJournalNote(true);
    }, 450);
  });

  journalSaveBtn.addEventListener('click', () => {
    clearTimeout(noteSaveTimer);
    persistCurrentJournalNote(true);
  });

  journalClearBtn.addEventListener('click', () => {
    journalTextarea.value = '';
    persistCurrentJournalNote(true);
  });

  notesHistoryListEl.addEventListener('click', (e) => {
    const deleteNoteBtn = e.target.closest('.delete-note-history-btn');
    if (deleteNoteBtn && deleteNoteBtn.dataset.deleteNoteDate) {
      const targetDate = deleteNoteBtn.dataset.deleteNoteDate;
      delete dailyNotes[targetDate];
      saveNotesToStorage();
      renderJournalSection();
      return;
    }

    const historyItem = e.target.closest('.note-history-item');
    if (historyItem && historyItem.dataset.historyDate) {
      selectJournalDate(historyItem.dataset.historyDate);
      journalTextarea.focus();
    }
  });

  // Sekme 4 ("Günün Sözü") Olay Dinleyicileri
  newQuoteBtn.addEventListener('click', () => {
    initQuoteOfTheDay(true);
  });

  copyQuoteBtn.addEventListener('click', copyCurrentQuoteToClipboard);

  // Veri Yedekleme & Geri Yükleme Olay Dinleyicileri
  exportJsonBtn.addEventListener('click', exportBackupToJson);

  importJsonBtn.addEventListener('click', () => {
    importJsonInput.click();
  });

  importJsonInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      importBackupFromJsonFile(file);
    }
  });

  // Başlangıç
  loadTheme();
  renderCurrentDate();
  loadHabits();
  loadNotes();
  renderJournalSection();
  applyViewMode(activeViewMode);
  initQuoteOfTheDay(false);
  switchTab(activeTab);
  registerServiceWorker();
})();

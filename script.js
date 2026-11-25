(() => {
  const STORAGE_KEY = 'habitflow_habits_v1';
  const NOTES_KEY = 'habitflow_notes_v1';
  const TASKS_KEY = 'habitflow_tasks_v1';
  const THEME_KEY = 'habitflow_theme_v1';
  const ACTIVE_TAB_KEY = 'olimpya_active_tab_v2';
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

  // 5 Olimpiyat Rengi Sistemi
  const OLYMPIC_COLORS = ['blue', 'black', 'red', 'yellow', 'green'];
  const DEFAULT_OLYMPIC_COLOR = 'yellow'; // #FCB131

  const LEGACY_COLOR_MAP = {
    blue: 'blue',
    indigo: 'blue',
    cyan: 'blue',
    black: 'black',
    red: 'red',
    rose: 'red',
    purple: 'red',
    yellow: 'yellow',
    amber: 'yellow',
    green: 'green',
    emerald: 'green'
  };

  // JS getDay() Standardı: 0=Pazar, 1=Pazartesi, ..., 6=Cumartesi
  const ALL_DAYS_ARRAY = [0, 1, 2, 3, 4, 5, 6];
  const ORDERED_WEEK_DAYS = [
    { day: 1, short: 'Pzt', full: 'Pazartesi' },
    { day: 2, short: 'Sal', full: 'Salı' },
    { day: 3, short: 'Çar', full: 'Çarşamba' },
    { day: 4, short: 'Per', full: 'Perşembe' },
    { day: 5, short: 'Cum', full: 'Cuma' },
    { day: 6, short: 'Cmt', full: 'Cumartesi' },
    { day: 0, short: 'Paz', full: 'Pazar' }
  ];

  const THEME_META_COLORS = {
    light: '#4f46e5',
    dark: '#070709',
    pastel: '#d97757'
  };

  const DAY_SHORT_NAMES = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const RING_CIRCUMFERENCE = 2 * Math.PI * 42;

  // DOM Elemanları — Üst Başlık ve Ayarlar Modalı
  const currentDateEl = document.getElementById('current-date');
  const metaThemeColorEl = document.getElementById('meta-theme-color');
  const quickRefreshBtn = document.getElementById('quick-refresh-btn');
  const openSettingsBtn = document.getElementById('open-settings-btn');
  const closeSettingsBtn = document.getElementById('close-settings-btn');
  const settingsModalBackdrop = document.getElementById('settings-modal-backdrop');
  const modalTabButtons = document.querySelectorAll('.modal-tab-btn');
  const settingsPaneAppearance = document.getElementById('settings-pane-appearance');
  const settingsPaneStorage = document.getElementById('settings-pane-storage');
  const themeButtons = document.querySelectorAll('.theme-btn');
  const storageUsageTextEl = document.getElementById('storage-usage-text');
  const storageCountsTextEl = document.getElementById('storage-counts-text');
  const exportJsonBtn = document.getElementById('export-json-btn');
  const importJsonBtn = document.getElementById('import-json-btn');
  const importJsonInput = document.getElementById('import-json-input');
  const dataBackupStatusEl = document.getElementById('data-backup-status');
  const forceUpdateAppBtn = document.getElementById('force-update-app-btn');
  const forceUpdateBtnLabelEl = document.getElementById('force-update-btn-label');
  const resetAllDataBtn = document.getElementById('reset-all-data-btn');

  // Alt Navigasyon (5 Sekmeli Bottom Tab Bar)
  const bottomNavButtons = document.querySelectorAll('.bottom-nav-item');
  const tabPanels = {
    '7days': document.getElementById('tab-panel-7days'),
    'calendar': document.getElementById('tab-panel-calendar'),
    'progress': document.getElementById('tab-panel-progress'),
    'notes': document.getElementById('tab-panel-notes'),
    'quote': document.getElementById('tab-panel-quote')
  };

  // Sekme 1 ("7 Gün") Elemanları
  const habitForm = document.getElementById('habit-form');
  const habitTitleInput = document.getElementById('habit-title');
  const addColorPickerEl = document.getElementById('add-color-picker');
  const addScheduleToggleEl = document.getElementById('add-schedule-toggle');
  const addCustomDaysPickerEl = document.getElementById('add-custom-days-picker');
  const todayTasksSectionEl = document.getElementById('today-tasks-section');
  const todayTasksListEl = document.getElementById('today-tasks-list');
  const goCalendarFromTasksBtn = document.getElementById('go-calendar-from-tasks-btn');
  const visibleHabitCountEl = document.getElementById('visible-habit-count');
  const habitListEl = document.getElementById('habit-list');
  const emptyStateEl = document.getElementById('empty-state');
  const emptyTitleEl = document.getElementById('empty-title');
  const emptyDescEl = document.getElementById('empty-desc');
  const emptySuggestionsEl = document.getElementById('empty-suggestions');

  // Sekme 2 ("Takvim") Elemanları
  const calendarMonthYearLabelEl = document.getElementById('calendar-month-year-label');
  const calPrevMonthBtn = document.getElementById('cal-prev-month-btn');
  const calNextMonthBtn = document.getElementById('cal-next-month-btn');
  const calTodayBtn = document.getElementById('cal-today-btn');
  const calendarDaysGridEl = document.getElementById('calendar-days-grid');
  const dayDetailTitleEl = document.getElementById('day-detail-title');
  const dayDetailSummaryBadgeEl = document.getElementById('day-detail-summary-badge');
  const dayTaskForm = document.getElementById('day-task-form');
  const dayTaskInput = document.getElementById('day-task-input');
  const dayDetailTasksListEl = document.getElementById('day-detail-tasks-list');
  const dayDetailFutureNoticeEl = document.getElementById('day-detail-future-notice');
  const dayDetailHabitsListEl = document.getElementById('day-detail-habits-list');

  // Sekme 3 ("İlerleme") Elemanları
  const progressRingCircleEl = document.getElementById('progress-ring-circle');
  const progressPercentEl = document.getElementById('progress-percent');
  const progressCountEl = document.getElementById('progress-count');
  const progressRatioBadgeEl = document.getElementById('progress-ratio-badge');
  const progressFillEl = document.getElementById('progress-fill');
  const progressBarContainer = document.getElementById('progress-bar-container');
  const progressMessageEl = document.getElementById('progress-message');
  const resetDayBtn = document.getElementById('reset-day-btn');
  const topStreakValueEl = document.getElementById('top-streak-value');
  const bestRecordSubEl = document.getElementById('best-record-sub');
  const weeklyTotalValueEl = document.getElementById('weekly-total-value');
  const weeklyRangeSubEl = document.getElementById('weekly-range-sub');
  const monthlyTotalValueEl = document.getElementById('monthly-total-value');
  const monthlyNameSubEl = document.getElementById('monthly-name-sub');
  const habitBreakdownListEl = document.getElementById('habit-breakdown-list');

  // Sekme 4 ("Notlar") Elemanları
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

  // Sekme 5 ("Söz") Elemanları
  const quoteDateBadgeEl = document.getElementById('quote-date-badge');
  const quoteTextEl = document.getElementById('quote-text');
  const quoteAuthorEl = document.getElementById('quote-author');
  const quoteSourceTagEl = document.getElementById('quote-source-tag');
  const newQuoteBtn = document.getElementById('new-quote-btn');
  const copyQuoteBtn = document.getElementById('copy-quote-btn');
  const copyQuoteLabelEl = document.getElementById('copy-quote-label');

  // Uygulama Durumu (State)
  let habits = [];
  let dailyNotes = {};
  let dailyTasks = {};
  let selectedAddColor = DEFAULT_OLYMPIC_COLOR;
  let addScheduleMode = 'everyday'; // 'everyday' | 'custom'
  let addCustomDays = [1, 2, 3, 4, 5]; // Varsayılan özel seçim: Hafta içi
  let activeTab = localStorage.getItem(ACTIVE_TAB_KEY) || '7days';
  let editingHabitId = null;
  let selectedNoteDateKey = '';
  let noteSaveTimer = null;

  // Takvim Durumu
  const initialNow = new Date();
  let calendarViewYear = initialNow.getFullYear();
  let calendarViewMonth = initialNow.getMonth();
  let selectedCalendarDateKey = '';

  // ==========================================================================
  // TARİH, RENK VE PLANLANAN GÜNLER (scheduledDays) YARDIMCILARI
  // ==========================================================================
  function normalizeOlympicColor(rawColor) {
    if (typeof rawColor === 'string') {
      const clean = rawColor.trim().toLowerCase();
      if (OLYMPIC_COLORS.includes(clean)) return clean;
      if (LEGACY_COLOR_MAP[clean]) return LEGACY_COLOR_MAP[clean];
    }
    return DEFAULT_OLYMPIC_COLOR;
  }

  function normalizeScheduledDays(rawDays) {
    if (!Array.isArray(rawDays) || rawDays.length === 0) {
      return [...ALL_DAYS_ARRAY];
    }
    const valid = Array.from(
      new Set(
        rawDays
          .map((d) => Number(d))
          .filter((d) => Number.isInteger(d) && d >= 0 && d <= 6)
      )
    ).sort((a, b) => a - b);

    return valid.length > 0 ? valid : [...ALL_DAYS_ARRAY];
  }

  function isEveryDaySchedule(scheduledDays) {
    const norm = normalizeScheduledDays(scheduledDays);
    return norm.length === 7;
  }

  function formatScheduledDaysSummary(scheduledDays) {
    const norm = normalizeScheduledDays(scheduledDays);
    if (norm.length === 7) return 'Her gün';
    const daySet = new Set(norm);
    return ORDERED_WEEK_DAYS.filter((d) => daySet.has(d.day))
      .map((d) => d.short)
      .join(', ');
  }

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

  // Bir alışkanlığın belirli bir YYYY-MM-DD tarihinde planlı olup olmadığını kontrol eder
  function isHabitScheduledOnDate(habit, dateKey) {
    const scheduled = normalizeScheduledDays(habit.scheduledDays);
    if (scheduled.length === 7) return true;
    const dayOfWeek = parseDateKey(dateKey).getDay(); // 0=Paz .. 6=Cmt
    return scheduled.includes(dayOfWeek);
  }

  function isHabitScheduledToday(habit) {
    return isHabitScheduledOnDate(habit, getTodayKey());
  }

  function formatHumanDateLabel(dateKey) {
    const dt = parseDateKey(dateKey);
    const todayKey = getTodayKey();
    const yesterdayKey = addDaysToKey(todayKey, -1);
    const tomorrowKey = addDaysToKey(todayKey, 1);
    const formatted = new Intl.DateTimeFormat('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(dt);

    const capitalized = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    if (dateKey === todayKey) return `Bugün — ${capitalized}`;
    if (dateKey === yesterdayKey) return `Dün — ${capitalized}`;
    if (dateKey === tomorrowKey) return `Yarın — ${capitalized}`;
    return capitalized;
  }

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
        jsDay: d.getDay(),
        shortName: DAY_SHORT_NAMES[i],
        dayNum: d.getDate(),
        monthShort: new Intl.DateTimeFormat('tr-TR', { month: 'short' }).format(d),
        isToday: key === todayKey,
        isFuture: key > todayKey
      });
    }
    return days;
  }

  function getLast30DaysKeys() {
    const today = new Date();
    const keys = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i, 12, 0, 0);
      keys.push(formatDateKey(d));
    }
    return keys;
  }

  // ==========================================================================
  // 5 SEKMELİ ALT NAVİGASYON GEÇİŞ YÖNETİMİ
  // ==========================================================================
  function switchTab(tabName) {
    const validTabs = ['7days', 'calendar', 'progress', 'notes', 'quote'];
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

    if (target === '7days') {
      renderHabits();
    } else if (target === 'calendar') {
      renderCalendarMonth();
      renderCalendarDayDetail();
    } else if (target === 'progress') {
      renderProgressTab();
    } else if (target === 'notes') {
      renderJournalSection();
    } else if (target === 'quote') {
      initQuoteOfTheDay(false);
    }
  }

  // ==========================================================================
  // AKILLI SERİ (STREAK) VE EN İYİ SERİ (REKOR) HESAPLAMA (scheduledDays DUYARLI)
  // ==========================================================================
  // Bir tarihten sonraki ilk planlı tarihi bulur
  function getNextScheduledDateKey(fromDateKey, scheduledSet) {
    for (let step = 1; step <= 7; step++) {
      const nextKey = addDaysToKey(fromDateKey, step);
      const jsDay = parseDateKey(nextKey).getDay();
      if (scheduledSet.has(jsDay)) {
        return nextKey;
      }
    }
    return null;
  }

  function calculateHabitStreaks(habit) {
    const datesArray = Array.isArray(habit.completedDates) ? habit.completedDates : [];
    const uniqueSortedDates = Array.from(new Set(datesArray)).sort();
    const dateSet = new Set(uniqueSortedDates);

    const scheduledDays = normalizeScheduledDays(habit.scheduledDays);
    const scheduledSet = new Set(scheduledDays);

    const todayKey = getTodayKey();

    // 1. Aktif Seri: Bugünden geriye doğru yalnızca planlı günleri kontrol et.
    // Planlı olmayan ara günlerde (dinlenme günlerinde) seri kırılmaz.
    // Bugün planlıysa ve henüz işaretlenmediyse bugün atlanır, bir önceki planlı günden itibaren seri korunur.
    let currentStreak = 0;
    for (let offset = 0; offset < 730; offset++) {
      const checkKey = addDaysToKey(todayKey, -offset);
      const jsDay = parseDateKey(checkKey).getDay();
      const isSched = scheduledSet.has(jsDay);

      if (offset === 0) {
        if (dateSet.has(checkKey)) {
          currentStreak++;
        }
        // Bugün tamamlanmamışsa bile seriyi kırma, dünden geriye bakmaya devam et
        continue;
      }

      if (!isSched) {
        // Dinlenme günü: Eğer kullanıcı dinlenme gününde ekstra tamamladıysa say, tamamlamadıysa seriyi kırmadan geç
        if (dateSet.has(checkKey)) {
          currentStreak++;
        }
        continue;
      }

      // Geçmişteki planlı bir gün: Tamamlandıysa seriyi artır, kaçırıldıysa dur
      if (dateSet.has(checkKey)) {
        currentStreak++;
      } else {
        break;
      }
    }

    // 2. Tüm Zamanların En Uzun Serisi (En İyi Seri / Rekor)
    // Yalnızca planlı günlerdeki tamamlamaların ardışıklığını kontrol eder
    const scheduledCompletedDates = uniqueSortedDates.filter((dKey) =>
      scheduledSet.has(parseDateKey(dKey).getDay())
    );

    let longestCalculated = 0;
    let runningRun = 0;
    let prevKey = null;

    for (const dateKey of scheduledCompletedDates) {
      if (!prevKey) {
        runningRun = 1;
      } else {
        const expectedNextScheduled = getNextScheduledDateKey(prevKey, scheduledSet);
        if (expectedNextScheduled === dateKey) {
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

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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
  // VERİ YÜKLEME VE KAYDETME (Alışkanlıklar, Görevler, Notlar)
  // ==========================================================================
  function normalizeHabitList(rawList) {
    const todayKey = getTodayKey();
    if (!Array.isArray(rawList)) return [];

    return rawList.map((habit, index) => {
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
        color: normalizeOlympicColor(habit.color),
        scheduledDays: normalizeScheduledDays(habit.scheduledDays),
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
        h.color = normalizeOlympicColor(h.color);
        h.scheduledDays = normalizeScheduledDays(h.scheduledDays);
        const { bestStreak } = calculateHabitStreaks(h);
        h.bestStreak = bestStreak;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (err) {
      console.error('Alışkanlık verileri kaydedilemedi:', err);
    }
  }

  function loadDailyTasks() {
    try {
      const raw = localStorage.getItem(TASKS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      dailyTasks = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (err) {
      console.error('Günlük görevler okunamadı:', err);
      dailyTasks = {};
    }
  }

  function saveDailyTasks() {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(dailyTasks));
    } catch (err) {
      console.error('Günlük görevler kaydedilemedi:', err);
    }
  }

  function getTasksForDate(dateKey) {
    return Array.isArray(dailyTasks[dateKey]) ? dailyTasks[dateKey] : [];
  }

  function addDailyTask(dateKey, title) {
    const cleanTitle = title.trim();
    if (!cleanTitle || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return;

    if (!Array.isArray(dailyTasks[dateKey])) {
      dailyTasks[dateKey] = [];
    }

    dailyTasks[dateKey].push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      title: cleanTitle,
      completed: false,
      createdAt: new Date().toISOString()
    });

    saveDailyTasks();
    renderTodaySpecialTasksOn7Days();
    if (activeTab === 'calendar') {
      renderCalendarMonth();
      renderCalendarDayDetail();
    }
  }

  function toggleDailyTask(dateKey, taskId) {
    const list = getTasksForDate(dateKey);
    const task = list.find((t) => t.id === taskId);
    if (!task) return;
    task.completed = !task.completed;
    saveDailyTasks();
    renderTodaySpecialTasksOn7Days();
    if (activeTab === 'calendar') {
      renderCalendarMonth();
      renderCalendarDayDetail();
    }
  }

  function deleteDailyTask(dateKey, taskId) {
    if (!Array.isArray(dailyTasks[dateKey])) return;
    dailyTasks[dateKey] = dailyTasks[dateKey].filter((t) => t.id !== taskId);
    if (dailyTasks[dateKey].length === 0) {
      delete dailyTasks[dateKey];
    }
    saveDailyTasks();
    renderTodaySpecialTasksOn7Days();
    if (activeTab === 'calendar') {
      renderCalendarMonth();
      renderCalendarDayDetail();
    }
  }

  // ==========================================================================
  // SADE VE AŞAMALI GÜN SEÇİCİ YÖNETİMİ (Ekleme & Düzenleme)
  // ==========================================================================
  function syncAddScheduleUI() {
    if (!addScheduleToggleEl || !addCustomDaysPickerEl) return;

    addScheduleToggleEl.querySelectorAll('.schedule-mode-btn').forEach((btn) => {
      const isMatch = btn.dataset.scheduleMode === addScheduleMode;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-checked', String(isMatch));
    });

    addCustomDaysPickerEl.hidden = addScheduleMode !== 'custom';

    const selectedSet = new Set(addCustomDays);
    addCustomDaysPickerEl.querySelectorAll('.weekday-circle-btn').forEach((btn) => {
      const dayNum = Number(btn.dataset.day);
      const isSelected = selectedSet.has(dayNum);
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-pressed', String(isSelected));
    });
  }

  function getSelectedAddScheduledDays() {
    if (addScheduleMode === 'everyday') {
      return [...ALL_DAYS_ARRAY];
    }
    return normalizeScheduledDays(addCustomDays);
  }

  function renderWeekdayButtonsHTML(selectedDaysArray) {
    const selectedSet = new Set(normalizeScheduledDays(selectedDaysArray));
    return ORDERED_WEEK_DAYS.map((d) => {
      const isSelected = selectedSet.has(d.day);
      return `
        <button
          type="button"
          class="weekday-circle-btn${isSelected ? ' active' : ''}"
          data-day="${d.day}"
          aria-pressed="${isSelected}"
          title="${d.full}"
        >${d.short}</button>
      `;
    }).join('');
  }

  // ==========================================================================
  // SEKME 1: SADELEŞTİRİLMİŞ "7 GÜN" EKRANI (KARTLAR, 5 RENK & GÜN PLANI)
  // ==========================================================================
  function renderColorSwatchesHTML(selectedColor) {
    const activeColor = normalizeOlympicColor(selectedColor);
    const labels = {
      blue: 'Mavi (#0081C8)',
      black: 'Siyah (#000000)',
      red: 'Kırmızı (#EE334E)',
      yellow: 'Sarı (#FCB131)',
      green: 'Yeşil (#00A651)'
    };

    return OLYMPIC_COLORS.map((colorKey) => {
      const isSelected = colorKey === activeColor;
      return `
        <button
          type="button"
          class="color-swatch-btn${isSelected ? ' active' : ''}"
          data-color="${colorKey}"
          role="radio"
          aria-checked="${isSelected}"
          title="${labels[colorKey]}"
          aria-label="${labels[colorKey]}"
        ></button>
      `;
    }).join('');
  }

  function setAddFormColor(colorKey) {
    selectedAddColor = normalizeOlympicColor(colorKey);
    if (!addColorPickerEl) return;
    addColorPickerEl.querySelectorAll('.color-swatch-btn').forEach((btn) => {
      const isMatch = btn.dataset.color === selectedAddColor;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-checked', String(isMatch));
    });
  }

  function renderTodaySpecialTasksOn7Days() {
    const todayKey = getTodayKey();
    const todayTasks = getTasksForDate(todayKey);

    if (todayTasks.length === 0) {
      todayTasksSectionEl.hidden = true;
      todayTasksListEl.innerHTML = '';
      return;
    }

    todayTasksSectionEl.hidden = false;
    todayTasksListEl.innerHTML = '';

    todayTasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = `habit-item${task.completed ? ' completed' : ''}`;
      li.dataset.color = 'yellow';
      li.innerHTML = `
        <div class="habit-main-row">
          <label class="habit-label">
            <input
              type="checkbox"
              class="habit-checkbox today-task-checkbox"
              data-task-id="${task.id}"
              data-task-date="${todayKey}"
              ${task.completed ? 'checked' : ''}
            />
            <span class="custom-checkbox" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <div class="habit-content">
              <div class="habit-title-wrapper">
                <span class="habit-title">${escapeHTML(task.title)}</span>
              </div>
              <div class="habit-meta">
                <span class="daily-task-tag">📌 Günlük Görev</span>
              </div>
            </div>
          </label>
          <div class="habit-actions">
            <button
              type="button"
              class="icon-btn delete-btn today-task-delete-btn"
              data-task-id="${task.id}"
              data-task-date="${todayKey}"
              title="Görevi sil"
              aria-label="${escapeHTML(task.title)} görevini sil"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      `;
      todayTasksListEl.appendChild(li);
    });
  }

  function createHabitItemElement(habit, weekDays) {
    const todayCompleted = isCompletedToday(habit);
    const scheduledToday = isHabitScheduledToday(habit);
    const scheduledDays = normalizeScheduledDays(habit.scheduledDays);
    const scheduledSet = new Set(scheduledDays);
    const isEveryDay = scheduledDays.length === 7;
    const color = normalizeOlympicColor(habit.color);

    const li = document.createElement('li');
    li.dataset.id = habit.id;
    li.dataset.color = color;

    if (editingHabitId === habit.id) {
      const editMode = isEveryDay ? 'everyday' : 'custom';
      const initialCustomDays = isEveryDay ? [1, 2, 3, 4, 5] : scheduledDays;

      li.className = 'habit-item';
      li.innerHTML = `
        <form
          class="habit-edit-form"
          data-edit-id="${habit.id}"
          data-selected-color="${color}"
          data-schedule-mode="${editMode}"
          data-custom-days="${initialCustomDays.join(',')}"
          autocomplete="off"
        >
          <input
            type="text"
            class="habit-edit-title"
            value="${escapeHTML(habit.title)}"
            placeholder="Alışkanlık adı..."
            maxlength="80"
            required
          />
          <div class="olympic-color-picker edit-color-picker" role="radiogroup" aria-label="Renk Seç">
            ${renderColorSwatchesHTML(color)}
          </div>
          <div class="edit-actions">
            <button type="submit" class="save-edit-btn">Kaydet</button>
            <button type="button" class="cancel-edit-btn">İptal</button>
          </div>

          <div class="edit-schedule-row">
            <div class="schedule-mode-bar">
              <span class="schedule-label">Sıklık:</span>
              <div class="schedule-toggle edit-schedule-toggle" role="radiogroup" aria-label="Alışkanlık Sıklığı">
                <button type="button" class="schedule-mode-btn${editMode === 'everyday' ? ' active' : ''}" data-schedule-mode="everyday" role="radio" aria-checked="${editMode === 'everyday'}">
                  Her Gün
                </button>
                <button type="button" class="schedule-mode-btn${editMode === 'custom' ? ' active' : ''}" data-schedule-mode="custom" role="radio" aria-checked="${editMode === 'custom'}">
                  Belirli Günler
                </button>
              </div>
            </div>
            <div class="custom-days-picker edit-custom-days-picker" role="group" aria-label="Haftanın Günlerini Seçin" ${editMode === 'everyday' ? 'hidden' : ''}>
              ${renderWeekdayButtonsHTML(initialCustomDays)}
            </div>
          </div>
        </form>
      `;
      return li;
    }

    const { currentStreak, bestStreak } = calculateHabitStreaks(habit);

    const streakBadge = `
      <span class="streak-badge${currentStreak > 0 ? ' has-streak' : ''}" title="Aktif Seri: ${currentStreak} gün | En İyi Seri: ${bestStreak} gün">
        <span>🔥 ${currentStreak} gün</span>
        <span class="streak-best">(En iyi: ${bestStreak})</span>
      </span>
    `;

    const scheduleBadge = !isEveryDay
      ? `<span class="schedule-days-badge" title="Planlanan Günler">${escapeHTML(formatScheduledDaysSummary(scheduledDays))}</span>`
      : '';

    const notTodayBadge = !scheduledToday
      ? `<span class="not-today-badge">Bugün yok</span>`
      : '';

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

    li.className = [
      'habit-item',
      todayCompleted && scheduledToday ? 'completed' : '',
      !scheduledToday ? 'not-today' : ''
    ]
      .filter(Boolean)
      .join(' ');

    const miniWeekPillsHTML = weekDays
      .map((d) => {
        const isDayScheduled = scheduledSet.has(d.jsDay);
        const done = isCompletedOnDate(habit, d.key);
        const isDisabled = d.isFuture || !isDayScheduled;

        const classes = [
          'day-pill',
          'day-toggle-btn',
          done && isDayScheduled ? 'is-done' : '',
          d.isToday ? 'is-today' : '',
          d.isFuture ? 'is-future' : '',
          !isDayScheduled ? 'is-unscheduled' : ''
        ]
          .filter(Boolean)
          .join(' ');

        let tooltip = '';
        if (!isDayScheduled) {
          tooltip = `${d.dayNum} ${d.monthShort} ${d.shortName} (Planlı değil)`;
        } else if (d.isFuture) {
          tooltip = `${d.dayNum} ${d.monthShort} ${d.shortName} (Gelecek gün)`;
        } else {
          tooltip = `${d.dayNum} ${d.monthShort} ${d.shortName} — ${done ? 'Tamamlandı (Kaldırmak için tıkla)' : 'Tamamlandı olarak işaretle'}`;
        }

        return `
          <button
            type="button"
            class="${classes}"
            data-habit-id="${habit.id}"
            data-date-key="${d.key}"
            title="${tooltip}"
            aria-label="${tooltip}"
            aria-pressed="${done && isDayScheduled}"
            ${isDisabled ? 'disabled' : ''}
          >
            <span class="day-pill-name">${d.shortName}</span>
            <span class="day-pill-num">${!isDayScheduled ? '·' : done ? '✓' : d.dayNum}</span>
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
            ${todayCompleted && scheduledToday ? 'checked' : ''}
            ${!scheduledToday ? 'disabled' : ''}
            aria-label="${escapeHTML(habit.title)} bugün tamamlandı olarak işaretle"
          />
          <span class="custom-checkbox" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <div class="habit-content">
            <div class="habit-title-wrapper">
              <span class="habit-color-dot" data-color="${color}" aria-hidden="true"></span>
              <span class="habit-title">${escapeHTML(habit.title)}</span>
            </div>
            <div class="habit-meta">
              ${notTodayBadge}
              ${streakBadge}
              ${scheduleBadge}
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
    renderTodaySpecialTasksOn7Days();
    const weekDays = getCurrentWeekDays();

    // 1. Bugün planlı ve henüz tamamlanmamış alışkanlıklar
    const scheduledTodayHabits = habits.filter((h) => isHabitScheduledToday(h));
    const pendingTodayHabits = scheduledTodayHabits.filter((h) => !isCompletedToday(h));
    // 2. Bugün planlı ve tamamlanmış alışkanlıklar
    const completedTodayHabits = scheduledTodayHabits.filter((h) => isCompletedToday(h));
    // 3. Bugün planlı OLMAYAN alışkanlıklar (listenin en altında hafif soluk)
    const notScheduledTodayHabits = habits.filter((h) => !isHabitScheduledToday(h));

    habitListEl.innerHTML = '';

    if (habits.length === 0) {
      emptyStateEl.hidden = false;
      visibleHabitCountEl.textContent = '';
      emptyTitleEl.textContent = 'Büyük değişimler küçük adımlarla başlar';
      emptyDescEl.textContent =
        'Henüz takip ettiğin bir alışkanlık yok. Yukarıdan yeni bir hedef ekle veya aşağıdaki örneklerden biriyle hemen başla:';
      emptySuggestionsEl.hidden = false;
    } else {
      emptyStateEl.hidden = true;
      if (scheduledTodayHabits.length === 0) {
        visibleHabitCountEl.textContent = 'Bugün planlı hedef yok';
      } else if (pendingTodayHabits.length > 0) {
        visibleHabitCountEl.textContent = `${pendingTodayHabits.length} bekleyen`;
      } else {
        visibleHabitCountEl.textContent = 'Tüm hedefler tamamlandı';
      }

      pendingTodayHabits.forEach((habit) => {
        habitListEl.appendChild(createHabitItemElement(habit, weekDays));
      });

      if (completedTodayHabits.length > 0 && pendingTodayHabits.length > 0) {
        const divider = document.createElement('li');
        divider.className = 'habit-group-divider';
        divider.setAttribute('aria-hidden', 'true');
        divider.textContent = `Bugün Tamamlananlar (${completedTodayHabits.length})`;
        habitListEl.appendChild(divider);
      }

      completedTodayHabits.forEach((habit) => {
        habitListEl.appendChild(createHabitItemElement(habit, weekDays));
      });

      if (notScheduledTodayHabits.length > 0) {
        const divider = document.createElement('li');
        divider.className = 'habit-group-divider';
        divider.setAttribute('aria-hidden', 'true');
        divider.textContent = `Bugün Planlı Olmayanlar (${notScheduledTodayHabits.length})`;
        habitListEl.appendChild(divider);

        notScheduledTodayHabits.forEach((habit) => {
          habitListEl.appendChild(createHabitItemElement(habit, weekDays));
        });
      }
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
  // SEKME 2: YILLIK "TAKVİM" SEKMESİ (scheduledDays DUYARLI)
  // ==========================================================================
  function renderCalendarMonth() {
    if (!selectedCalendarDateKey) {
      selectedCalendarDateKey = getTodayKey();
    }

    const todayKey = getTodayKey();
    const monthStart = new Date(calendarViewYear, calendarViewMonth, 1, 12, 0, 0);
    const monthTitle = new Intl.DateTimeFormat('tr-TR', {
      month: 'long',
      year: 'numeric'
    }).format(monthStart);

    calendarMonthYearLabelEl.textContent = monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1);

    const startJsDay = monthStart.getDay();
    const startOffset = startJsDay === 0 ? 6 : startJsDay - 1;
    const daysInMonth = new Date(calendarViewYear, calendarViewMonth + 1, 0).getDate();

    const totalCells = startOffset + daysInMonth > 35 ? 42 : 35;
    const firstGridDate = new Date(calendarViewYear, calendarViewMonth, 1 - startOffset, 12, 0, 0);

    calendarDaysGridEl.innerHTML = '';

    for (let i = 0; i < totalCells; i++) {
      const cellDate = new Date(firstGridDate);
      cellDate.setDate(firstGridDate.getDate() + i);
      const dateKey = formatDateKey(cellDate);
      const isCurrentMonth = cellDate.getMonth() === calendarViewMonth;
      const isToday = dateKey === todayKey;
      const isSelected = dateKey === selectedCalendarDateKey;

      // Yalnızca o tarihin haftanın gününe planlanmış alışkanlıkları baz al
      const scheduledHabitsForCell = habits.filter((h) => isHabitScheduledOnDate(h, dateKey));
      const completedHabitsCount = scheduledHabitsForCell.filter((h) => isCompletedOnDate(h, dateKey)).length;
      const tasksOnDay = getTasksForDate(dateKey);
      const hasNoteOnDay = Boolean(dailyNotes[dateKey] && dailyNotes[dateKey].trim());
      const allHabitsDone =
        scheduledHabitsForCell.length > 0 && completedHabitsCount === scheduledHabitsForCell.length;

      const cellBtn = document.createElement('button');
      cellBtn.type = 'button';
      cellBtn.className = [
        'cal-day-cell',
        !isCurrentMonth ? 'is-outside' : '',
        isToday ? 'is-today' : '',
        isSelected ? 'is-selected' : '',
        allHabitsDone ? 'all-habits-done' : ''
      ]
        .filter(Boolean)
        .join(' ');

      cellBtn.dataset.calDate = dateKey;
      cellBtn.setAttribute('aria-label', `${formatHumanDateLabel(dateKey)}`);

      let indicatorsHTML = '';
      if (completedHabitsCount > 0) {
        indicatorsHTML += `<span class="cal-ind-dot dot-habit-done" title="${completedHabitsCount}/${scheduledHabitsForCell.length} planlı alışkanlık tamamlandı"></span>`;
      }
      if (tasksOnDay.length > 0) {
        indicatorsHTML += `<span class="cal-ind-dot dot-task-planned" title="${tasksOnDay.length} özel görev"></span>`;
      }
      if (hasNoteOnDay) {
        indicatorsHTML += `<span class="cal-ind-dot dot-note-saved" title="Günlük not var"></span>`;
      }

      cellBtn.innerHTML = `
        <span class="cal-day-num">${cellDate.getDate()}</span>
        <div class="cal-day-indicators">${indicatorsHTML}</div>
      `;

      calendarDaysGridEl.appendChild(cellBtn);
    }
  }

  function renderCalendarDayDetail() {
    if (!selectedCalendarDateKey) {
      selectedCalendarDateKey = getTodayKey();
    }

    const todayKey = getTodayKey();
    const isFutureDay = selectedCalendarDateKey > todayKey;
    const tasksOnDay = getTasksForDate(selectedCalendarDateKey);
    const scheduledHabitsOnDay = habits.filter((h) => isHabitScheduledOnDate(h, selectedCalendarDateKey));
    const completedHabitsOnDay = scheduledHabitsOnDay.filter((h) =>
      isCompletedOnDate(h, selectedCalendarDateKey)
    ).length;

    dayDetailTitleEl.textContent = formatHumanDateLabel(selectedCalendarDateKey);
    dayDetailSummaryBadgeEl.textContent = `${tasksOnDay.length} görev • ${completedHabitsOnDay}/${scheduledHabitsOnDay.length} alışkanlık`;
    dayDetailFutureNoticeEl.hidden = !isFutureDay;

    // A) Seçili Güne Özel Görevler Listesi
    dayDetailTasksListEl.innerHTML = '';
    if (tasksOnDay.length === 0) {
      dayDetailTasksListEl.innerHTML = `<li class="day-detail-empty">Bu güne planlanmış özel bir görev yok. Yukarıdaki kutudan ekleyebilirsiniz.</li>`;
    } else {
      tasksOnDay.forEach((task) => {
        const li = document.createElement('li');
        li.className = `day-detail-item${task.completed ? ' completed' : ''}`;
        li.innerHTML = `
          <label class="habit-label">
            <input
              type="checkbox"
              class="habit-checkbox cal-task-checkbox"
              data-task-id="${task.id}"
              data-task-date="${selectedCalendarDateKey}"
              ${task.completed ? 'checked' : ''}
            />
            <span class="custom-checkbox" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <div class="habit-content">
              <div class="habit-title-wrapper">
                <span class="habit-title">${escapeHTML(task.title)}</span>
              </div>
            </div>
          </label>
          <button
            type="button"
            class="icon-btn delete-btn cal-task-delete-btn"
            data-task-id="${task.id}"
            data-task-date="${selectedCalendarDateKey}"
            title="Görevi sil"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        `;
        dayDetailTasksListEl.appendChild(li);
      });
    }

    // B) O Güne Planlı Günlük Alışkanlıklar Listesi
    dayDetailHabitsListEl.innerHTML = '';
    if (habits.length === 0) {
      dayDetailHabitsListEl.innerHTML = `<li class="day-detail-empty">Henüz tanımlı bir alışkanlık yok. "7 Gün" sekmesinden alışkanlık ekleyebilirsiniz.</li>`;
    } else if (scheduledHabitsOnDay.length === 0) {
      dayDetailHabitsListEl.innerHTML = `<li class="day-detail-empty">Bu gün için planlanmış bir alışkanlık bulunmuyor (dinlenme günü).</li>`;
    } else {
      scheduledHabitsOnDay.forEach((habit) => {
        const done = isCompletedOnDate(habit, selectedCalendarDateKey);
        const color = normalizeOlympicColor(habit.color);

        const li = document.createElement('li');
        li.className = `day-detail-item${done ? ' completed' : ''}`;
        li.innerHTML = `
          <label class="habit-label">
            <input
              type="checkbox"
              class="habit-checkbox cal-habit-checkbox"
              data-habit-id="${habit.id}"
              data-date-key="${selectedCalendarDateKey}"
              ${done ? 'checked' : ''}
              ${isFutureDay ? 'disabled' : ''}
            />
            <span class="custom-checkbox" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <div class="habit-content">
              <div class="habit-title-wrapper">
                <span class="habit-color-dot" data-color="${color}" aria-hidden="true"></span>
                <span class="habit-title">${escapeHTML(habit.title)}</span>
              </div>
            </div>
          </label>
        `;
        dayDetailHabitsListEl.appendChild(li);
      });
    }
  }

  // ==========================================================================
  // SEKME 3: AYRI "İLERLEME" SEKMESİ (scheduledDays DUYARLI)
  // ==========================================================================
  function renderProgressTab() {
    const todayKey = getTodayKey();
    // Günlük yüzde hesabı yalnızca bugünün haftanın gününe planlanmış alışkanlıklar üzerinden yapılır
    const scheduledTodayList = habits.filter((h) => isHabitScheduledOnDate(h, todayKey));
    const totalScheduledToday = scheduledTodayList.length;
    const completedTodayCount = scheduledTodayList.filter((h) => isCompletedOnDate(h, todayKey)).length;
    const percent =
      totalScheduledToday === 0 ? 0 : Math.round((completedTodayCount / totalScheduledToday) * 100);

    const offset = RING_CIRCUMFERENCE - (percent / 100) * RING_CIRCUMFERENCE;
    if (progressRingCircleEl) {
      progressRingCircleEl.style.strokeDashoffset = String(offset);
      progressRingCircleEl.classList.toggle(
        'all-done',
        totalScheduledToday > 0 && completedTodayCount === totalScheduledToday
      );
    }

    progressPercentEl.textContent = `${percent}%`;
    progressCountEl.textContent = `Bugün planlı ${completedTodayCount} / ${totalScheduledToday} alışkanlık tamamlandı`;
    progressRatioBadgeEl.textContent = `${completedTodayCount} / ${totalScheduledToday} tamamlandı`;
    progressFillEl.style.width = `${percent}%`;
    progressBarContainer.setAttribute('aria-valuenow', String(percent));

    const isAllDone = totalScheduledToday > 0 && completedTodayCount === totalScheduledToday;
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
    bestRecordSubEl.textContent = `🏆 ${topBestRecord} gün`;

    const weekDays = getCurrentWeekDays();
    const weekKeySet = new Set(weekDays.map((d) => d.key));
    let weeklyCompletions = 0;

    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-`;
    let monthlyCompletions = 0;

    habits.forEach((habit) => {
      if (Array.isArray(habit.completedDates)) {
        habit.completedDates.forEach((dKey) => {
          if (weekKeySet.has(dKey)) weeklyCompletions++;
          if (dKey.startsWith(currentMonthPrefix)) monthlyCompletions++;
        });
      }
    });

    const firstDay = weekDays[0];
    const lastDay = weekDays[6];
    weeklyTotalValueEl.textContent = `${weeklyCompletions} kez`;
    weeklyRangeSubEl.textContent = `${firstDay.dayNum} ${firstDay.monthShort} - ${lastDay.dayNum} ${lastDay.monthShort}`;

    const monthName = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(now);
    monthlyTotalValueEl.textContent = `${monthlyCompletions} kez`;
    monthlyNameSubEl.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    if (habits.length === 0) {
      progressMessageEl.textContent = 'İstatistikleri görmek için "7 Gün" sekmesinden ilk alışkanlığını ekle.';
    } else if (totalScheduledToday === 0) {
      progressMessageEl.textContent = 'Bugün için planlanmış bir alışkanlık yok. İyi dinlenmeler!';
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
      progressMessageEl.textContent = 'Tüm hedefler tamamlandı! Bugünkü serini başarıyla korudun.';
    }

    const last30Keys = getLast30DaysKeys();

    // Alışkanlık Bazlı Tekil Başarı Yüzdeleri Listesi (Son 30 gündeki planlı gün sayısına göre)
    habitBreakdownListEl.innerHTML = '';
    if (habits.length === 0) {
      habitBreakdownListEl.innerHTML = `<p class="day-detail-empty">Henüz alışkanlık eklenmedi.</p>`;
    } else {
      habits.forEach((habit) => {
        const scheduledKeysInLast30 = last30Keys.filter((dKey) => isHabitScheduledOnDate(habit, dKey));
        const scheduledTotal30 = scheduledKeysInLast30.length || 1;
        const checks30 = scheduledKeysInLast30.filter((dKey) => isCompletedOnDate(habit, dKey)).length;

        const rate30 = Math.round((checks30 / scheduledTotal30) * 100);
        const { currentStreak, bestStreak } = calculateHabitStreaks(habit);
        const color = normalizeOlympicColor(habit.color);
        const scheduleLabel = formatScheduledDaysSummary(habit.scheduledDays);

        const div = document.createElement('div');
        div.className = 'breakdown-item';
        div.innerHTML = `
          <div class="breakdown-item-top">
            <div class="breakdown-item-title">
              <span class="habit-color-dot" data-color="${color}" aria-hidden="true"></span>
              <span>${escapeHTML(habit.title)}</span>
              <span class="schedule-days-badge">${escapeHTML(scheduleLabel)}</span>
            </div>
            <div class="breakdown-item-meta">
              <span>🔥 ${currentStreak}g (En iyi: ${bestStreak}g)</span>
              <span>•</span>
              <span>${rate30}% (${checks30}/${scheduledKeysInLast30.length}g)</span>
            </div>
          </div>
          <div class="progress-track">
            <div class="progress-fill${rate30 >= 70 ? ' all-done' : ''}" style="width: ${rate30}%"></div>
          </div>
        `;
        habitBreakdownListEl.appendChild(div);
      });
    }
  }

  // ==========================================================================
  // SEKME 4 ("NOTLAR") — GÜNLÜK YANSIMA VE GEÇMİŞ NOTLAR LİSTESİ
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
  // SEKME 5 ("SÖZ") — API + LOCALSTORAGE + 28 TÜRKÇE YEDEK SÖZ
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
      } catch (e) {}
    }

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
  function addHabit(title, colorKey, scheduledDaysInput = ALL_DAYS_ARRAY) {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    const newHabit = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      title: cleanTitle,
      color: normalizeOlympicColor(colorKey),
      scheduledDays: normalizeScheduledDays(scheduledDaysInput),
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

    // Planlı olmayan bir gün işaretlenmek istenirse engelle
    if (!isHabitScheduledOnDate(habit, dateKey)) return;

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

    if (animateIfToday && dateKey === todayKey && activeTab === '7days') {
      const itemEl = habitListEl.querySelector(`.habit-item[data-id="${id}"]`);
      if (itemEl) {
        itemEl.classList.toggle('completed', isCompletedToday(habit));
        setTimeout(() => {
          renderHabits();
        }, 280);
        return;
      }
    }

    renderHabits();
    if (activeTab === 'calendar') {
      renderCalendarMonth();
      renderCalendarDayDetail();
    } else if (activeTab === 'progress') {
      renderProgressTab();
    }
  }

  function saveEditedHabit(id, newTitle, newColor, newScheduledDays) {
    const cleanTitle = newTitle.trim();
    if (!cleanTitle) return;

    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    habit.title = cleanTitle;
    habit.color = normalizeOlympicColor(newColor);
    habit.scheduledDays = normalizeScheduledDays(newScheduledDays);

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
    renderProgressTab();
  }

  // ==========================================================================
  // AYARLAR MODALI ("GÖRÜNÜM" & "VERİ VE DEPOLAMA")
  // ==========================================================================
  function updateStorageUsageStats() {
    let totalBytes = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const val = localStorage.getItem(key) || '';
          totalBytes += (key.length + val.length) * 2;
        }
      }
    } catch (e) {
      totalBytes = 0;
    }

    const kb = (totalBytes / 1024).toFixed(2);
    storageUsageTextEl.textContent = `${kb} KB`;

    let totalTaskCount = 0;
    Object.values(dailyTasks).forEach((arr) => {
      if (Array.isArray(arr)) totalTaskCount += arr.length;
    });
    const noteCount = Object.keys(dailyNotes).filter((k) => dailyNotes[k] && dailyNotes[k].trim()).length;

    storageCountsTextEl.textContent = `${habits.length} alışkanlık • ${totalTaskCount} özel görev • ${noteCount} günlük not`;
  }

  function openSettingsModal() {
    updateStorageUsageStats();
    settingsModalBackdrop.hidden = false;
  }

  function closeSettingsModal() {
    settingsModalBackdrop.hidden = true;
  }

  function switchSettingsTab(tabKey) {
    const isStorage = tabKey === 'storage';
    modalTabButtons.forEach((btn) => {
      const active = btn.dataset.settingsTab === tabKey;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    settingsPaneAppearance.hidden = isStorage;
    settingsPaneStorage.hidden = !isStorage;
    if (isStorage) {
      updateStorageUsageStats();
    }
  }

  function showBackupFeedback(message, isError = false) {
    dataBackupStatusEl.textContent = message;
    dataBackupStatusEl.classList.toggle('status-ok', !isError);
    dataBackupStatusEl.classList.toggle('status-err', isError);

    setTimeout(() => {
      dataBackupStatusEl.classList.remove('status-ok', 'status-err');
      dataBackupStatusEl.textContent = '';
    }, 4500);
  }

  function exportBackupToJson() {
    try {
      const todayKey = getTodayKey();
      const backupPayload = {
        app: 'Olimpya',
        version: 8,
        exportedAt: new Date().toISOString(),
        theme: localStorage.getItem(THEME_KEY) || 'light',
        habits,
        tasks: dailyTasks,
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
        let incomingTasks = {};
        let incomingTheme = null;

        if (Array.isArray(parsed)) {
          incomingHabits = parsed;
        } else if (parsed && typeof parsed === 'object' && Array.isArray(parsed.habits)) {
          incomingHabits = parsed.habits;
          if (parsed.notes && typeof parsed.notes === 'object' && !Array.isArray(parsed.notes)) {
            incomingNotes = parsed.notes;
          }
          if (parsed.tasks && typeof parsed.tasks === 'object' && !Array.isArray(parsed.tasks)) {
            incomingTasks = parsed.tasks;
          }
          if (typeof parsed.theme === 'string') {
            incomingTheme = parsed.theme;
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
        dailyTasks = incomingTasks;
        saveHabits();
        saveNotesToStorage();
        saveDailyTasks();

        if (incomingTheme) {
          applyTheme(incomingTheme);
        }

        renderHabits();
        renderCalendarMonth();
        renderCalendarDayDetail();
        renderProgressTab();
        renderJournalSection();
        updateStorageUsageStats();

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

  function resetAllUserDataWithDoubleConfirm() {
    const firstConfirm = window.confirm(
      'DİKKAT: Tüm alışkanlıklarınız, seri geçmişiniz, takvim görevleriniz ve günlük notlarınız silinecek.\n\nDevam etmek istiyor musunuz?'
    );
    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      'SON ONAY: Bu işlem geri alınamaz. Tüm verileri kalıcı olarak sıfırlamak istediğinize emin misiniz?'
    );
    if (!secondConfirm) return;

    habits = [];
    dailyNotes = {};
    dailyTasks = {};
    saveHabits();
    saveNotesToStorage();
    saveDailyTasks();

    renderHabits();
    renderCalendarMonth();
    renderCalendarDayDetail();
    renderProgressTab();
    renderJournalSection();
    updateStorageUsageStats();
    showBackupFeedback('✓ Tüm veriler sıfırlandı.', false);
  }

  // ==========================================================================
  // PWA SERVICE WORKER KAYDI, OTOMATİK YENİLEME VE HIZLI ÖNBELLEK TEMİZLEME
  // ==========================================================================
  let swRegistration = null;
  let isRefreshingForSw = false;

  function checkForServiceWorkerUpdate() {
    if (swRegistration && typeof swRegistration.update === 'function') {
      swRegistration.update().catch(() => {});
    } else if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          swRegistration = reg;
          reg.update().catch(() => {});
        }
      });
    }
  }

  function registerServiceWorker() {
    if (
      !('serviceWorker' in navigator) ||
      !(location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ) {
      return;
    }

    const hadControllerOnLoad = Boolean(navigator.serviceWorker.controller);

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadControllerOnLoad || isRefreshingForSw) return;
      isRefreshingForSw = true;
      window.location.reload();
    });

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js?v=6', { updateViaCache: 'none' })
        .then((reg) => {
          swRegistration = reg;
          reg.update().catch(() => {});

          if (reg.waiting) {
            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          }

          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          });
        })
        .catch((err) => {
          console.warn('Service Worker kaydı atlandı:', err);
        });
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkForServiceWorkerUpdate();
      }
    });

    window.addEventListener('pageshow', () => {
      checkForServiceWorkerUpdate();
    });
  }

  async function forceRefreshAppCacheAndReload() {
    if (quickRefreshBtn) {
      quickRefreshBtn.classList.add('is-spinning');
      quickRefreshBtn.disabled = true;
    }
    if (forceUpdateAppBtn) {
      forceUpdateAppBtn.disabled = true;
    }
    if (forceUpdateBtnLabelEl) {
      forceUpdateBtnLabelEl.textContent = 'Önbellek temizleniyor ve güncelleniyor...';
    }

    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(async (reg) => {
            try {
              await reg.unregister();
            } catch (e) {
              try {
                await reg.update();
              } catch (_) {}
            }
          })
        );
      }

      showBackupFeedback('✓ Önbellek yenilendi, uygulama yeniden yükleniyor...', false);
    } catch (err) {
      console.error('Önbellek yenileme hatası:', err);
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 250);
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

  if (quickRefreshBtn) {
    quickRefreshBtn.addEventListener('click', forceRefreshAppCacheAndReload);
  }
  openSettingsBtn.addEventListener('click', openSettingsModal);
  closeSettingsBtn.addEventListener('click', closeSettingsModal);

  settingsModalBackdrop.addEventListener('click', (e) => {
    if (e.target === settingsModalBackdrop) {
      closeSettingsModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !settingsModalBackdrop.hidden) {
      closeSettingsModal();
    }
  });

  modalTabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      switchSettingsTab(btn.dataset.settingsTab);
    });
  });

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.themeValue);
    });
  });

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

  resetAllDataBtn.addEventListener('click', resetAllUserDataWithDoubleConfirm);
  if (forceUpdateAppBtn) {
    forceUpdateAppBtn.addEventListener('click', forceRefreshAppCacheAndReload);
  }

  // Sekme 1 ("7 Gün") Dinleyicileri — 5 Olimpiyat Rengi Seçici & Aşamalı Gün Seçici
  if (addColorPickerEl) {
    addColorPickerEl.addEventListener('click', (e) => {
      const swatch = e.target.closest('.color-swatch-btn');
      if (!swatch || !swatch.dataset.color) return;
      setAddFormColor(swatch.dataset.color);
    });
  }

  if (addScheduleToggleEl) {
    addScheduleToggleEl.addEventListener('click', (e) => {
      const modeBtn = e.target.closest('.schedule-mode-btn');
      if (!modeBtn || !modeBtn.dataset.scheduleMode) return;
      addScheduleMode = modeBtn.dataset.scheduleMode === 'custom' ? 'custom' : 'everyday';
      if (addScheduleMode === 'custom' && (!Array.isArray(addCustomDays) || addCustomDays.length === 0 || addCustomDays.length === 7)) {
        addCustomDays = [1, 2, 3, 4, 5];
      }
      syncAddScheduleUI();
    });
  }

  if (addCustomDaysPickerEl) {
    addCustomDaysPickerEl.addEventListener('click', (e) => {
      const dayBtn = e.target.closest('.weekday-circle-btn');
      if (!dayBtn || dayBtn.dataset.day === undefined) return;
      const dayNum = Number(dayBtn.dataset.day);
      const currentSet = new Set(addCustomDays);

      if (currentSet.has(dayNum)) {
        // En az 1 gün seçili kalmalı
        if (currentSet.size <= 1) return;
        currentSet.delete(dayNum);
      } else {
        currentSet.add(dayNum);
      }

      // 7 günün tamamı seçilirse otomatik "Her Gün" moduna dön
      if (currentSet.size === 7) {
        addScheduleMode = 'everyday';
        addCustomDays = [1, 2, 3, 4, 5];
      } else {
        addCustomDays = Array.from(currentSet).sort((a, b) => a - b);
      }

      syncAddScheduleUI();
    });
  }

  habitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const scheduledDays = getSelectedAddScheduledDays();
    addHabit(habitTitleInput.value, selectedAddColor, scheduledDays);
    habitTitleInput.value = '';
    addScheduleMode = 'everyday';
    syncAddScheduleUI();
    habitTitleInput.focus();
  });

  goCalendarFromTasksBtn.addEventListener('click', () => {
    selectedCalendarDateKey = getTodayKey();
    switchTab('calendar');
  });

  todayTasksListEl.addEventListener('change', (e) => {
    if (e.target.classList.contains('today-task-checkbox')) {
      toggleDailyTask(e.target.dataset.taskDate, e.target.dataset.taskId);
    }
  });

  todayTasksListEl.addEventListener('click', (e) => {
    const delBtn = e.target.closest('.today-task-delete-btn');
    if (delBtn) {
      deleteDailyTask(delBtn.dataset.taskDate, delBtn.dataset.taskId);
    }
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
    // 1. Düzenleme formundaki 5 renk seçici buton tıklaması
    const editSwatch = e.target.closest('.edit-color-picker .color-swatch-btn');
    if (editSwatch) {
      const formEl = editSwatch.closest('.habit-edit-form');
      if (formEl) {
        const chosenColor = normalizeOlympicColor(editSwatch.dataset.color);
        formEl.dataset.selectedColor = chosenColor;
        formEl.querySelectorAll('.edit-color-picker .color-swatch-btn').forEach((btn) => {
          const isMatch = btn.dataset.color === chosenColor;
          btn.classList.toggle('active', isMatch);
          btn.setAttribute('aria-checked', String(isMatch));
        });
      }
      return;
    }

    // 2. Düzenleme formundaki "Her Gün | Belirli Günler" mod geçişi
    const editModeBtn = e.target.closest('.edit-schedule-toggle .schedule-mode-btn');
    if (editModeBtn) {
      const formEl = editModeBtn.closest('.habit-edit-form');
      if (formEl) {
        const newMode = editModeBtn.dataset.scheduleMode === 'custom' ? 'custom' : 'everyday';
        formEl.dataset.scheduleMode = newMode;
        formEl.querySelectorAll('.edit-schedule-toggle .schedule-mode-btn').forEach((btn) => {
          const isMatch = btn.dataset.scheduleMode === newMode;
          btn.classList.toggle('active', isMatch);
          btn.setAttribute('aria-checked', String(isMatch));
        });
        const customPicker = formEl.querySelector('.edit-custom-days-picker');
        if (customPicker) {
          customPicker.hidden = newMode !== 'custom';
        }
      }
      return;
    }

    // 3. Düzenleme formundaki 7 yuvarlak gün butonu tıklaması
    const editDayBtn = e.target.closest('.edit-custom-days-picker .weekday-circle-btn');
    if (editDayBtn) {
      const formEl = editDayBtn.closest('.habit-edit-form');
      if (formEl) {
        const rawDaysStr = formEl.dataset.customDays || '1,2,3,4,5';
        const currentSet = new Set(
          rawDaysStr
            .split(',')
            .map((v) => Number(v))
            .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6)
        );
        const clickedDay = Number(editDayBtn.dataset.day);

        if (currentSet.has(clickedDay)) {
          if (currentSet.size <= 1) return; // En az 1 gün seçili kalmalı
          currentSet.delete(clickedDay);
        } else {
          currentSet.add(clickedDay);
        }

        const customPicker = formEl.querySelector('.edit-custom-days-picker');

        // 7 günün tamamı seçilirse otomatik "Her Gün" moduna dön
        if (currentSet.size === 7) {
          formEl.dataset.scheduleMode = 'everyday';
          formEl.dataset.customDays = '1,2,3,4,5';
          formEl.querySelectorAll('.edit-schedule-toggle .schedule-mode-btn').forEach((btn) => {
            const isEveryday = btn.dataset.scheduleMode === 'everyday';
            btn.classList.toggle('active', isEveryday);
            btn.setAttribute('aria-checked', String(isEveryday));
          });
          if (customPicker) {
            customPicker.hidden = true;
            customPicker.innerHTML = renderWeekdayButtonsHTML([1, 2, 3, 4, 5]);
          }
        } else {
          const updatedArray = Array.from(currentSet).sort((a, b) => a - b);
          formEl.dataset.customDays = updatedArray.join(',');
          if (customPicker) {
            customPicker.querySelectorAll('.weekday-circle-btn').forEach((btn) => {
              const dNum = Number(btn.dataset.day);
              const isSel = currentSet.has(dNum);
              btn.classList.toggle('active', isSel);
              btn.setAttribute('aria-pressed', String(isSel));
            });
          }
        }
      }
      return;
    }

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
      const formEl = e.target;
      const id = formEl.dataset.editId;
      const titleInput = formEl.querySelector('.habit-edit-title');
      const chosenColor = formEl.dataset.selectedColor || DEFAULT_OLYMPIC_COLOR;
      const mode = formEl.dataset.scheduleMode || 'everyday';
      let chosenScheduledDays = [...ALL_DAYS_ARRAY];

      if (mode === 'custom') {
        const rawDaysStr = formEl.dataset.customDays || '1,2,3,4,5';
        chosenScheduledDays = normalizeScheduledDays(
          rawDaysStr.split(',').map((v) => Number(v))
        );
      }

      saveEditedHabit(id, titleInput.value, chosenColor, chosenScheduledDays);
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
    addHabit(
      chip.dataset.suggestTitle,
      chip.dataset.suggestColor || DEFAULT_OLYMPIC_COLOR,
      ALL_DAYS_ARRAY
    );
  });

  // Sekme 2 ("Takvim") Dinleyicileri
  calPrevMonthBtn.addEventListener('click', () => {
    calendarViewMonth--;
    if (calendarViewMonth < 0) {
      calendarViewMonth = 11;
      calendarViewYear--;
    }
    renderCalendarMonth();
  });

  calNextMonthBtn.addEventListener('click', () => {
    calendarViewMonth++;
    if (calendarViewMonth > 11) {
      calendarViewMonth = 0;
      calendarViewYear++;
    }
    renderCalendarMonth();
  });

  calTodayBtn.addEventListener('click', () => {
    const now = new Date();
    calendarViewYear = now.getFullYear();
    calendarViewMonth = now.getMonth();
    selectedCalendarDateKey = getTodayKey();
    renderCalendarMonth();
    renderCalendarDayDetail();
  });

  calendarDaysGridEl.addEventListener('click', (e) => {
    const cell = e.target.closest('.cal-day-cell');
    if (!cell || !cell.dataset.calDate) return;
    selectedCalendarDateKey = cell.dataset.calDate;

    const dt = parseDateKey(selectedCalendarDateKey);
    calendarViewYear = dt.getFullYear();
    calendarViewMonth = dt.getMonth();

    renderCalendarMonth();
    renderCalendarDayDetail();
  });

  dayTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedCalendarDateKey) {
      selectedCalendarDateKey = getTodayKey();
    }
    addDailyTask(selectedCalendarDateKey, dayTaskInput.value);
    dayTaskInput.value = '';
    dayTaskInput.focus();
  });

  dayDetailTasksListEl.addEventListener('change', (e) => {
    if (e.target.classList.contains('cal-task-checkbox')) {
      toggleDailyTask(e.target.dataset.taskDate, e.target.dataset.taskId);
    }
  });

  dayDetailTasksListEl.addEventListener('click', (e) => {
    const delBtn = e.target.closest('.cal-task-delete-btn');
    if (delBtn) {
      deleteDailyTask(delBtn.dataset.taskDate, delBtn.dataset.taskId);
    }
  });

  dayDetailHabitsListEl.addEventListener('change', (e) => {
    if (e.target.classList.contains('cal-habit-checkbox')) {
      const habitId = e.target.dataset.habitId;
      const dateKey = e.target.dataset.dateKey;
      if (habitId && dateKey) {
        toggleHabitOnDate(habitId, dateKey, false);
      }
    }
  });

  // Sekme 3 ("İlerleme") Dinleyicisi
  resetDayBtn.addEventListener('click', resetTodayProgress);

  // Sekme 4 ("Notlar") Dinleyicileri
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

  // Sekme 5 ("Söz") Dinleyicileri
  newQuoteBtn.addEventListener('click', () => {
    initQuoteOfTheDay(true);
  });

  copyQuoteBtn.addEventListener('click', copyCurrentQuoteToClipboard);

  // Başlangıç
  loadTheme();
  renderCurrentDate();
  loadHabits();
  loadDailyTasks();
  loadNotes();
  selectedCalendarDateKey = getTodayKey();
  syncAddScheduleUI();
  renderHabits();
  renderCalendarMonth();
  renderCalendarDayDetail();
  renderProgressTab();
  renderJournalSection();
  initQuoteOfTheDay(false);
  switchTab(activeTab);
  registerServiceWorker();
})();

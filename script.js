/* ==========================================================================
   ΔΙΑΚΡΙΣΗ — script.js (Vanilla JS, χωρίς εξαρτήσεις)
     1. Δεδομένα (προγράμματα σπουδών, επιτυχόντες) — από e-diakrisi.gr
     2. Navbar: κατάσταση scroll + ενεργός σύνδεσμος
     3. Mobile drawer
     4. Tabs προγραμμάτων
     5. Επιτυχόντες ανά χρονιά
     6. Φόρμα ενδιαφέροντος: έλεγχος + επιβεβαίωση
     7. Scroll-reveal (IntersectionObserver)
   ========================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var icon = function (id) { return '<svg class="icon" aria-hidden="true"><use href="#i-' + id + '"/></svg>'; };

  /* ------------------------------------------------------------------------
     1. ΔΕΔΟΜΕΝΑ
     Κάθε κάρτα έχει είτε `subjects` ([μάθημα, ώρες/εβδομάδα]) είτε `bullets`.
     Το σύνολο ωρών υπολογίζεται αυτόματα από τα μαθήματα.
     ------------------------------------------------------------------------ */
  var FIELD_2 = '2ο Πεδίο · Θετικές Επιστήμες';
  var FIELD_3 = '3ο Πεδίο · Επιστήμες Υγείας';
  var FIELD_4 = '4ο Πεδίο · Οικονομία & Πληροφορική';

  var PROGRAMS = {
    gymnasio: {
      title: 'Γ΄ Γυμνασίου: γερές βάσεις πριν από το Λύκειο',
      lead: 'Ενισχύουμε τις γνώσεις των προηγούμενων τάξεων και προετοιμάζουμε τον μαθητή για τις απαιτήσεις του Λυκείου, ώστε να ξεκινήσει με αυτοπεποίθηση.',
      points: [
        'Μόλις 6 ώρες την εβδομάδα — χωρίς να βαραίνει το πρόγραμμα',
        'Επιπλέον ώρες όπου διαπιστωθεί ανάγκη ενίσχυσης',
        'Τμήματα προετοιμασίας για εξετάσεις εισαγωγής σε Πρότυπα σχολεία'
      ],
      groups: [{
        cards: [
          { tag: 'Χειμερινό πρόγραμμα', title: 'Εβδομαδιαίο πρόγραμμα',
            subjects: [['Μαθηματικά', 2], ['Φυσική', 1], ['Χημεία', 1], ['Έκθεση', 2]] },
          { tag: 'Τι δουλεύουμε', title: 'Γλώσσα & Λογοτεχνία',
            bullets: ['Εμβάθυνση σε γραμματική και σύνταξη', 'Ανάγνωση και ανάλυση λογοτεχνικών κειμένων', 'Γραφή: εκθέσεις, δοκίμια, δημιουργική γραφή', 'Ορθογραφία'] },
          { tag: 'Τι δουλεύουμε', title: 'Μαθηματικά & Φυσικές Επιστήμες',
            bullets: ['Άλγεβρα, γεωμετρία, τριγωνομετρία', 'Επίλυση προβλημάτων με εφαρμογές σε πραγματικές καταστάσεις', 'Βασικές έννοιες Φυσικής και Χημείας', 'Κατανόηση των φυσικών φαινομένων'] }
        ]
      }]
    },

    a: {
      title: 'Α΄ Λυκείου: η χρονιά που χτίζει τον τρόπο μελέτης',
      lead: 'Δύο στόχοι: ουσιαστική κατανόηση της ύλης και οργάνωση της μελέτης με βάση τις απαιτήσεις των εξετάσεων. Ο μαθητής μαθαίνει να αναλαμβάνει ευθύνη και να διαχειρίζεται τον χρόνο του.',
      points: [
        'Κοινό πρόγραμμα 10 ωρών για όλες τις κατευθύνσεις',
        'Συχνές γραπτές δοκιμασίες για αξιολόγηση της προόδου',
        'Έμφαση στην αυτονομία του μαθητή'
      ],
      groups: [{
        cards: [
          { tag: 'Χειμερινό πρόγραμμα', title: 'Εβδομαδιαίο πρόγραμμα',
            subjects: [['Άλγεβρα', 3], ['Γεωμετρία', 1], ['Φυσική', 2], ['Χημεία', 2], ['Έκθεση – Λογοτεχνία', 2]] },
          { tag: 'Στόχος 1', title: 'Κατανόηση της ύλης',
            bullets: ['Συστηματική κάλυψη της σχολικής ύλης', 'Αξιολόγηση με συχνές γραπτές δοκιμασίες', 'Επιπλέον ώρες όταν κρίνεται απαραίτητη η ενίσχυση'] },
          { tag: 'Στόχος 2', title: 'Οργάνωση της μελέτης',
            bullets: ['Μελέτη προσαρμοσμένη στις απαιτήσεις των εξετάσεων', 'Οργάνωση και σωστή διαχείριση του χρόνου', 'Ανάληψη ευθύνης και αυτονομία'] }
        ]
      }]
    },

    b: {
      title: 'Β΄ Λυκείου: η προετοιμασία των Πανελληνίων ξεκινά εδώ',
      lead: 'Διετές πρόγραμμα: οι μαθητές εντάσσονται σε τμήματα ανάλογα με το επιστημονικό πεδίο που θα ακολουθήσουν στη Γ΄ Λυκείου. Παράλληλα με την ύλη της τάξης, προετοιμάζονται στα πανελλαδικώς εξεταζόμενα μαθήματα.',
      points: [
        'Τμήματα ανά επιστημονικό πεδίο',
        'Ύλη Β΄ Λυκείου και προετοιμασία Πανελληνίων μαζί',
        'Επιπλέον ώρες όπου διαπιστωθεί ανάγκη ενίσχυσης'
      ],
      groups: [{
        label: 'Χειμερινό πρόγραμμα ανά πεδίο',
        cards: [
          { tag: FIELD_2, title: 'Θετικές & Τεχνολογικές',
            subjects: [['Μαθηματικά Κατεύθυνσης', 2], ['Άλγεβρα', 2], ['Φυσική', 3], ['Χημεία', 2], ['Έκθεση – Λογοτεχνία', 2]] },
          { tag: FIELD_3, title: 'Επιστήμες Υγείας',
            subjects: [['Βιολογία', 2], ['Φυσική', 3], ['Χημεία', 2], ['Έκθεση – Λογοτεχνία', 2], ['Άλγεβρα', 1]] },
          { tag: FIELD_4, title: 'Οικονομία & Πληροφορική',
            subjects: [['Μαθηματικά Κατεύθυνσης', 4], ['Άλγεβρα', 2], ['Αρχές Οικονομικής Θεωρίας', 2], ['Ανάπτυξη Εφαρμογών', 2], ['Έκθεση – Λογοτεχνία', 2]] }
        ]
      }]
    },

    g: {
      title: 'Γ΄ Λυκείου: στοχευμένη και εντατική προετοιμασία',
      lead: 'Όλη η χρονιά είναι σχεδιασμένη γύρω από τις Πανελλήνιες: καθηγητές με τουλάχιστον 20ετή εμπειρία, συνεχή διαγωνίσματα προσομοίωσης και εξατομικευμένα ενισχυτικά μαθήματα.',
      points: [
        'Εξατομικευμένα ενισχυτικά μαθήματα όπου δυσκολεύεται ο μαθητής',
        'Συνεχείς γραπτές εξετάσεις με πραγματική προσομοίωση',
        'Ενημέρωση γονέων και συμβουλευτική για το άγχος και την πίεση'
      ],
      groups: [{
        label: 'Χειμερινό πρόγραμμα ανά πεδίο',
        cards: [
          { tag: FIELD_2, title: 'Πολυτεχνικές · Φυσικομαθηματικές',
            subjects: [['Μαθηματικά', 5], ['Φυσική', 4], ['Χημεία', 4], ['Έκθεση – Λογοτεχνία', 3]] },
          { tag: FIELD_3, title: 'Ιατρικές · Επιστήμες Υγείας',
            subjects: [['Βιολογία', 4], ['Φυσική', 4], ['Χημεία', 4], ['Έκθεση – Λογοτεχνία', 3]] },
          { tag: FIELD_4, title: 'Οικονομικές · Πληροφορικής',
            subjects: [['Μαθηματικά', 6], ['Α.Ο.Θ.', 3], ['Α.Ε.Π.Π.', 3], ['Έκθεση – Λογοτεχνία', 3]] }
        ]
      }]
    },

    therina: {
      title: 'Θερινά Τμήματα: προβάδισμα πριν χτυπήσει το κουδούνι',
      lead: 'Η θερινή προετοιμασία καλύπτει κρίσιμο μέρος της ύλης της επόμενης τάξης, ώστε ο μαθητής να μπει στη χρονιά ένα βήμα μπροστά.',
      points: [
        'Γ΄ Λυκείου: 15/6 έως 22/7',
        'Α΄ και Β΄ Λυκείου: 15/6 έως 10/7',
        'Ομοιογενή τμήματα ανά επιστημονικό πεδίο, όπως και τον χειμώνα'
      ],
      groups: [
        { label: 'Προς Γ΄ Λυκείου', chip: '15/6 – 22/7',
          cards: [
            { tag: FIELD_2, title: 'Θετικές & Τεχνολογικές', subjects: [['Μαθηματικά', 5], ['Φυσική', 5], ['Χημεία', 4], ['Έκθεση', 3]] },
            { tag: FIELD_3, title: 'Επιστήμες Υγείας', subjects: [['Βιολογία', 4], ['Φυσική', 5], ['Χημεία', 4], ['Έκθεση', 3]] },
            { tag: FIELD_4, title: 'Οικονομία & Πληροφορική', subjects: [['Μαθηματικά', 6], ['Α.Ο.Θ.', 3], ['Α.Ε.Π.Π.', 3], ['Έκθεση', 3]] }
          ] },
        { label: 'Προς Β΄ Λυκείου', chip: '15/6 – 10/7',
          cards: [
            { tag: FIELD_2, title: 'Θετικές & Τεχνολογικές', subjects: [['Μαθηματικά Κατεύθυνσης', 2], ['Άλγεβρα', 2], ['Φυσική', 2], ['Χημεία', 2], ['Έκθεση – Λογοτεχνία', 2]] },
            { tag: FIELD_3, title: 'Επιστήμες Υγείας', subjects: [['Φυσική', 3], ['Χημεία', 2], ['Έκθεση – Λογοτεχνία', 2], ['Άλγεβρα', 2]] },
            { tag: FIELD_4, title: 'Οικονομία & Πληροφορική', subjects: [['Μαθηματικά Κατεύθυνσης', 2], ['Άλγεβρα', 2], ['Έκθεση – Λογοτεχνία', 2]] }
          ] },
        { label: 'Προς Α΄ Λυκείου', chip: '15/6 – 10/7',
          cards: [
            { tag: 'Απόφοιτοι Γ΄ Γυμνασίου', title: 'Μετάβαση στο Λύκειο', subjects: [['Άλγεβρα', 3], ['Φυσική', 1], ['Χημεία', 1], ['Έκθεση – Λογοτεχνία', 2]] }
          ] }
      ]
    }
  };

  /* Πρώτοι ανά επιστημονικό πεδίο — e-diakrisi.gr/epityhontes */
  var RESULTS = {
    2026: [
      { field: 2, name: 'Τζουράλας Μάριος', school: 'Ναυπηγών Μηχανολόγων Μηχανικών Ε.Μ.Π.', score: 19040 },
      { field: 3, name: 'Βέα Νικολέττα', school: 'Ιατρική Πάτρας', score: 19020 },
      { field: 4, name: 'Κολέτσου Βασιλική', school: 'Διεθνών & Ευρωπαϊκών Οικονομικών Σπουδών ΟΠΑ', score: 18540 }
    ],
    2025: [
      { field: 2, name: 'Μπληζιώτης Βαγγέλης', school: 'Ηλεκτρολόγων Μηχανικών & Μηχανικών Υπολογιστών Ε.Μ.Π.', score: 19110 },
      { field: 3, name: 'Παϊσίου Ζηναΐδα', school: 'Ιατρική Αθήνας', score: 19260 },
      { field: 4, name: 'Λιναρδάκης Γιώργος', school: 'Πληροφορικής ΠΑ.ΠΕΙ.', score: 19135, rank: '1ος' }
    ],
    2024: [
      { field: 2, name: 'Συροκάκης Δημοσθένης', school: 'Ηλεκτρολόγων Μηχανικών & Μηχανικών Υπολογιστών Ε.Μ.Π.', score: 19670, rank: '2ος' },
      { field: 3, name: 'Μπαραμπούτης Γιώργος', school: 'Ιατρική Πάτρας', score: 18750 },
      { field: 4, name: 'Χαϊδόγιαννης Νίκος', school: 'Διοικητικής Επιστήμης & Τεχνολογίας ΟΠΑ', score: 18980 }
    ],
    2023: [
      { field: 2, name: 'Νείλα Βασιλική', school: 'Ηλεκτρολόγων Μηχανικών & Μηχανικών Υπολογιστών Ε.Μ.Π.', score: 18975 },
      { field: 3, name: 'Κυριακού Νικόλαος', school: 'Ιατρική Ιωαννίνων', score: 18810 },
      { field: 4, name: 'Ντιγκιρλάκης Μάριος', school: 'Πληροφορικής & Τηλεπικοινωνιών ΕΚΠΑ', score: 18500 }
    ],
    2022: [
      { field: 2, name: 'Σερεφίδης Γιάννης', school: 'Ηλεκτρολόγων Μηχανικών & Μηχανικών Υπολογιστών Ε.Μ.Π.', score: 19440, rank: '12ος' },
      { field: 3, name: 'Μπιλίνη Δέσποινα', school: 'Ιατρική Αθήνας', score: 19375 },
      { field: 4, name: 'Σαβίν Άνα-Μελίνα', school: 'Πληροφορικής & Τηλεπικοινωνιών ΕΚΠΑ', score: 17900 }
    ],
    2021: [
      { field: 2, name: 'Σαμαράς Γιώργος', school: 'Αρχιτεκτόνων Μηχανικών Ε.Μ.Π.', score: 19279, rank: '2ος' },
      { field: 3, name: 'Βαμβακάρη Ιωάννα', school: 'Φαρμακευτική Αθήνας', score: 18740, rank: '3η' },
      { field: 4, name: 'Κυρίτση Ελένη', school: 'Εσωτερικής Αρχιτεκτονικής ΠΑ.Δ.Α.', score: 18414 }
    ]
  };

  /* ------------------------------------------------------------------------
     2. NAVBAR
     ------------------------------------------------------------------------ */
  var nav = $('#nav');
  var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 24); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Επισήμανση του συνδέσμου της ενότητας που φαίνεται */
  var navLinks = $$('.nav__links a');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------------------------------
     3. MOBILE DRAWER
     ------------------------------------------------------------------------ */
  var drawer = $('#drawer');
  var overlay = $('#drawerOverlay');
  var toggle = $('#navToggle');
  var closeBtn = $('#drawerClose');

  function openDrawer() {
    overlay.hidden = false;
    drawer.inert = false;
    void overlay.offsetWidth; /* reflow ώστε να παίξει το transition του overlay */
    overlay.classList.add('is-open');
    drawer.classList.add('is-open');
    document.body.classList.add('is-locked');
    toggle.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  }

  function closeDrawer(restoreFocus) {
    if (!drawer.classList.contains('is-open')) return;
    overlay.classList.remove('is-open');
    drawer.classList.remove('is-open');
    drawer.inert = true;
    document.body.classList.remove('is-locked');
    toggle.setAttribute('aria-expanded', 'false');
    setTimeout(function () { overlay.hidden = true; }, 300);
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', function () { closeDrawer(true); });
  overlay.addEventListener('click', function () { closeDrawer(true); });
  $$('a', drawer).forEach(function (a) { a.addEventListener('click', function () { closeDrawer(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(true); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1080) closeDrawer(false); });

  /* ------------------------------------------------------------------------
     4. TABS ΠΡΟΓΡΑΜΜΑΤΩΝ
     ------------------------------------------------------------------------ */
  var tabs = $$('.tabs__tab');
  var panel = $('#tabPanel');

  function courseCard(card) {
    var body, total = '';
    if (card.subjects) {
      var sum = card.subjects.reduce(function (acc, s) { return acc + s[1]; }, 0);
      total = '<div class="course__total"><b>' + sum + '</b><span>ώρες/εβδ.</span></div>';
      body = '<ul class="course__subjects">' + card.subjects.map(function (s) {
        return '<li><span>' + s[0] + '</span><span>' + s[1] + (s[1] === 1 ? ' ώρα' : ' ώρες') + '</span></li>';
      }).join('') + '</ul>';
    } else {
      body = '<ul class="course__bullets">' + card.bullets.map(function (b) {
        return '<li>' + icon('check') + '<span>' + b + '</span></li>';
      }).join('') + '</ul>';
    }
    return '<article class="course">' +
      '<div class="course__head"><div><span class="course__tag">' + card.tag + '</span><h4>' + card.title + '</h4></div>' + total + '</div>' +
      body + '</article>';
  }

  function renderProgram(key) {
    var p = PROGRAMS[key];
    var html = '<div class="program__intro"><div><h3>' + p.title + '</h3><p>' + p.lead + '</p></div>' +
      '<ul class="ticks">' + p.points.map(function (pt) { return '<li>' + icon('check') + '<span>' + pt + '</span></li>'; }).join('') + '</ul></div>';

    p.groups.forEach(function (g) {
      if (g.label) {
        html += '<div class="program__group">' + g.label +
          (g.chip ? ' <span class="chip chip--amber">' + icon('calendar') + g.chip + '</span>' : '') + '</div>';
      }
      html += '<div class="program__cards">' + g.cards.map(courseCard).join('') + '</div>';
    });

    html += '<div class="program__foot"><span>Θέλετε το αναλυτικό ωρολόγιο πρόγραμμα και πληροφορίες για τα δίδακτρα;</span>' +
      '<a class="btn btn--primary btn--sm" href="#forma">Ζητήστε ενημέρωση ' + icon('arrow') + '</a></div>';

    panel.innerHTML = html;
    /* επανεκκίνηση του animation εισόδου */
    panel.classList.remove('is-switching');
    void panel.offsetWidth;
    panel.classList.add('is-switching');
  }

  function selectTab(key, focus) {
    tabs.forEach(function (t) {
      var active = t.dataset.tab === key;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
      t.tabIndex = active ? 0 : -1;
      if (active) {
        panel.setAttribute('aria-labelledby', t.id);
        if (focus) t.focus();
      }
    });
    renderProgram(key);
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab.dataset.tab, false); });
    /* Πλοήγηση με βελάκια, Home/End */
    tab.addEventListener('keydown', function (e) {
      var next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      selectTab(tabs[(next + tabs.length) % tabs.length].dataset.tab, true);
    });
  });

  /* Σύνδεσμοι footer που ανοίγουν συγκεκριμένο tab */
  $$('[data-open-tab]').forEach(function (a) {
    a.addEventListener('click', function () { selectTab(a.dataset.openTab, false); });
  });

  renderProgram('gymnasio');
  panel.classList.remove('is-switching'); /* χωρίς animation στην πρώτη φόρτωση */

  /* ------------------------------------------------------------------------
     5. ΕΠΙΤΥΧΟΝΤΕΣ ΑΝΑ ΧΡΟΝΙΑ
     ------------------------------------------------------------------------ */
  var yearList = $('#yearList');
  var resultGrid = $('#resultGrid');
  var FIELD_NAMES = { 2: 'Θετικές & Τεχνολογικές Επιστήμες', 3: 'Επιστήμες Υγείας', 4: 'Οικονομία & Πληροφορική' };
  var years = Object.keys(RESULTS).sort().reverse();

  function renderResults(year, animate) {
    resultGrid.innerHTML = RESULTS[year].map(function (r) {
      return '<article class="result">' +
        '<span class="result__field">' + r.field + 'ο πεδίο · ' + FIELD_NAMES[r.field] + '</span>' +
        '<span class="result__score">' + r.score.toLocaleString('el-GR') + '<small>μόρια</small></span>' +
        '<span class="result__name">' + r.name + '</span>' +
        '<span class="result__school">' + r.school + (r.rank ? ' (' + r.rank + ')' : '') + '</span>' +
        '</article>';
    }).join('');
    $$('.years__btn', yearList).forEach(function (b) {
      var active = b.dataset.year === year;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    if (animate) {
      resultGrid.classList.remove('is-switching');
      void resultGrid.offsetWidth;
      resultGrid.classList.add('is-switching');
    }
  }

  yearList.innerHTML = years.map(function (y) {
    return '<button type="button" class="years__btn" data-year="' + y + '">' + y + '</button>';
  }).join('');
  yearList.addEventListener('click', function (e) {
    var btn = e.target.closest('.years__btn');
    if (btn) renderResults(btn.dataset.year, true);
  });
  renderResults(years[0], false);

  /* ------------------------------------------------------------------------
     6. ΦΟΡΜΑ ΕΝΔΙΑΦΕΡΟΝΤΟΣ
     Πρωτότυπο: ο έλεγχος και η επιβεβαίωση γίνονται στον browser.
     ΤΑ ΣΤΟΙΧΕΙΑ ΔΕΝ ΑΠΟΣΤΕΛΛΟΝΤΑΙ — προσθέστε fetch() στο σημείο «TODO backend».
     ------------------------------------------------------------------------ */
  var form = $('#leadForm');
  var success = $('#formSuccess');
  var fName = $('#f-name'), fPhone = $('#f-phone'), fGrade = $('#f-grade'), fTrack = $('#f-track');

  function needsTrack() {
    var opt = fGrade.options[fGrade.selectedIndex];
    return !!opt && opt.hasAttribute('data-track');
  }

  function normalizePhone(v) {
    return v.replace(/[\s\-().]/g, '').replace(/^(\+30|0030)/, '');
  }

  /* Κάθε validator επιστρέφει μήνυμα σφάλματος ή '' */
  var validators = {
    name: function () {
      var v = fName.value.trim();
      if (!v) return 'Συμπληρώστε το ονοματεπώνυμό σας.';
      if (v.length < 5 || v.split(/\s+/).length < 2) return 'Γράψτε όνομα και επώνυμο.';
      if (/\d/.test(v)) return 'Το ονοματεπώνυμο δεν πρέπει να περιέχει αριθμούς.';
      return '';
    },
    phone: function () {
      var v = normalizePhone(fPhone.value);
      if (!v) return 'Συμπληρώστε ένα τηλέφωνο επικοινωνίας.';
      if (!/^(2\d{9}|69\d{8})$/.test(v)) return 'Δώστε έγκυρο ελληνικό τηλέφωνο 10 ψηφίων (κινητό ή σταθερό).';
      return '';
    },
    grade: function () { return fGrade.value ? '' : 'Επιλέξτε την τάξη του μαθητή.'; },
    track: function () { return needsTrack() && !fTrack.value ? 'Επιλέξτε ομάδα προσανατολισμού.' : ''; },
    interest: function () { return form.elements.interest.value ? '' : 'Επιλέξτε τι σας ενδιαφέρει.'; }
  };

  function showError(key) {
    var msg = validators[key]();
    var errEl = $('#e-' + key);
    var field = errEl.closest('.field');
    errEl.textContent = msg;
    field.classList.toggle('is-invalid', !!msg);
    field.classList.toggle('is-valid', !msg && key !== 'interest' && !(key === 'track' && !needsTrack()));
    var input = form.elements[key];
    if (input && input.setAttribute) input.setAttribute('aria-invalid', String(!!msg));
    return !msg;
  }

  /* Η ομάδα προσανατολισμού ενεργοποιείται μόνο για Β΄ & Γ΄ Λυκείου */
  fGrade.addEventListener('change', function () {
    var on = needsTrack();
    fTrack.disabled = !on;
    fTrack.required = on;
    if (!on) { fTrack.value = ''; showError('track'); }
    showError('grade');
  });

  /* Έλεγχος όταν ο χρήστης φεύγει από το πεδίο, και ζωντανή διόρθωση αν είχε σφάλμα */
  [['name', fName], ['phone', fPhone], ['track', fTrack]].forEach(function (pair) {
    pair[1].addEventListener('blur', function () { if (pair[1].value) showError(pair[0]); });
    pair[1].addEventListener('input', function () {
      if (pair[1].closest('.field').classList.contains('is-invalid')) showError(pair[0]);
    });
  });
  $$('input[name="interest"]', form).forEach(function (r) {
    r.addEventListener('change', function () { showError('interest'); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    Object.keys(validators).forEach(function (key) {
      if (!showError(key) && !firstInvalid) firstInvalid = key;
    });
    if (firstInvalid) {
      var target = firstInvalid === 'interest' ? $('input[name="interest"]', form) : form.elements[firstInvalid];
      target.focus();
      return;
    }

    var data = {
      name: fName.value.trim(),
      phone: normalizePhone(fPhone.value),
      grade: fGrade.value,
      track: needsTrack() ? fTrack.value : '',
      interest: form.elements.interest.value
    };

    /* TODO backend: fetch('/api/lead', { method: 'POST', body: JSON.stringify(data) }) */

    $('#s-name').textContent = data.name.split(/\s+/)[0];
    $('#s-phone').textContent = data.phone.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3');
    var summary = $('#s-summary');
    summary.textContent = '';
    [['Τάξη', data.grade], ['Προσανατολισμός', data.track], ['Ενδιαφέρον', data.interest]].forEach(function (row) {
      if (!row[1]) return;
      var wrap = document.createElement('div');
      var dt = document.createElement('dt'); dt.textContent = row[0];
      var dd = document.createElement('dd'); dd.textContent = row[1];
      wrap.appendChild(dt); wrap.appendChild(dd); summary.appendChild(wrap);
    });

    form.hidden = true;
    success.hidden = false;
    success.focus();
  });

  $('#formReset').addEventListener('click', function () {
    form.reset();
    fTrack.disabled = true;
    $$('.field', form).forEach(function (f) { f.classList.remove('is-valid', 'is-invalid'); });
    $$('.field__error', form).forEach(function (el) { el.textContent = ''; });
    success.hidden = true;
    form.hidden = false;
    fName.focus();
  });

  /* ------------------------------------------------------------------------
     7. SCROLL-REVEAL
     ------------------------------------------------------------------------ */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      /* Κλιμακωτή καθυστέρηση για στοιχεία στο ίδιο πλέγμα */
      var siblings = $$('.reveal', el.parentElement).filter(function (s) { return s.parentElement === el.parentElement; });
      if (siblings.length > 1) el.style.setProperty('--reveal-delay', Math.min(siblings.indexOf(el), 5) * 70 + 'ms');
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Τρέχον έτος στο footer */
  $('#year').textContent = new Date().getFullYear();
})();

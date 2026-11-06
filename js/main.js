/* ========================================================
   Church.lk Prototype - Interactive & Scroll Animation Engine
   High Performance, Ultra-Lightweight (Instant Load)
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Ultra-fast Scroll Observer for Reveal Animations
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animatable elements (reveal immediately if already within initial viewport)
  document.querySelectorAll('.anim, .anim-left, .anim-right, .anim-scale').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
      el.classList.add('visible');
    } else {
      revealObserver.observe(el);
    }
  });

  // 2. Interactive Navigation Active Indicator
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 3. Mobile Navigation Toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav');
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileBtn.classList.toggle('active');
    });
  }

  // 4. Cart State Management
  let cartCount = parseInt(localStorage.getItem('church_cart_count') || '0', 10);
  const cartBadges = document.querySelectorAll('.cart-counter, .cart-count');
  
  function updateCartBadge() {
    cartBadges.forEach(badge => {
      badge.textContent = cartCount;
      badge.classList.add('pulse');
      setTimeout(() => badge.classList.remove('pulse'), 400);
    });
  }
  updateCartBadge();

  // Add to Cart Buttons
  document.querySelectorAll('.btn-add-cart, .add-to-cart, button[class*="cart"], .btn-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      cartCount++;
      localStorage.setItem('church_cart_count', cartCount);
      updateCartBadge();
      showToast('Item added to devotional cart!');
    });
  });

  // 5. Toast Notification System
  function showToast(message) {
    let toast = document.getElementById('prototype-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'prototype-toast';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // 6. Interactive Tab Switching (For Church Details & Product Pages)
  const tabButtons = document.querySelectorAll('.tab');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      if (targetId) {
        document.querySelectorAll('.tab-content-panel').forEach(panel => {
          panel.classList.remove('active');
        });
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('active');
      }
    });
  });

  // 7. Dynamic Single Product Page Renderer (Supports any product via ?id=...)
  function initSingleProductPage() {
    const singleProductTitle = document.getElementById('product-single-title');
    if (!singleProductTitle) return; // Not on single product page

    const urlParams = new URLSearchParams(window.location.search);
    const prodId = urlParams.get('id') || 'wooden-rosary';
    const productsCatalog = window.CHURCH_PRODUCTS || {};
    const product = productsCatalog[prodId] || productsCatalog['wooden-rosary'];

    if (!product) return;

    // Update Page Title
    document.title = `${product.title} - Devotional Shop | Church.lk`;

    // Breadcrumbs
    const bcCategory = document.getElementById('breadcrumb-category');
    const bcCurrent = document.getElementById('breadcrumb-current');
    if (bcCategory) {
      bcCategory.textContent = product.category || 'Shop';
      bcCategory.href = product.categoryUrl || 'shop.html';
    }
    if (bcCurrent) bcCurrent.textContent = product.title;

    // Title, Rating, Price, Stock, Short Desc
    singleProductTitle.textContent = product.title;

    const reviewsCountEl = document.getElementById('product-reviews-count');
    if (reviewsCountEl) reviewsCountEl.textContent = `(${product.reviewsCount || 42} Reviews)`;

    const priceEl = document.getElementById('product-single-price');
    if (priceEl) priceEl.textContent = product.price;

    const shortDescEl = document.getElementById('product-short-desc');
    if (shortDescEl) shortDescEl.textContent = product.shortDesc;

    // Main Image
    const mainImg = document.getElementById('main-product-img');
    if (mainImg) {
      mainImg.src = product.mainImage;
      mainImg.alt = product.title;
    }

    // Thumbnails Strip
    const thumbsContainer = document.getElementById('product-thumbs-container');
    if (thumbsContainer && product.gallery && product.gallery.length) {
      thumbsContainer.innerHTML = product.gallery.map((src, i) => `
        <div class="product-thumb ${i === 0 ? 'active' : ''}" data-src="${src}">
          <img src="${src}" alt="${product.title} view ${i + 1}">
        </div>
      `).join('');
    }

    // Full Description & Specifications
    const fullDescEl = document.getElementById('product-full-desc');
    if (fullDescEl && product.fullDesc) fullDescEl.textContent = product.fullDesc;

    const specsList = document.getElementById('product-specs-list');
    if (specsList && product.specs) {
      specsList.innerHTML = product.specs.map(spec => `
        <li>
          <span style="color:var(--accent-gold); font-size:1.1rem;">${spec.icon}</span>
          <span class="label">${spec.label}</span>
          <span>${spec.value}</span>
        </li>
      `).join('');
    }

    const secondaryImg = document.getElementById('product-secondary-img');
    if (secondaryImg) {
      secondaryImg.src = product.secondaryImage || product.mainImage;
      secondaryImg.alt = `${product.title} Detail`;
    }

    // Why Choose Card
    const whyTitle = document.getElementById('product-why-title');
    if (whyTitle) whyTitle.textContent = product.whyHeader || `Why Choose This ${product.title}?`;

    const whyList = document.getElementById('product-why-list');
    if (whyList && product.whyChoose) {
      whyList.innerHTML = product.whyChoose.map(reason => `
        <li>
          <span class="why-check">✔</span>
          <span>${reason}</span>
        </li>
      `).join('');
    }

    // You May Also Like (Dynamic Related Products)
    const relatedGrid = document.getElementById('related-products-grid');
    if (relatedGrid) {
      const otherKeys = Object.keys(productsCatalog).filter(k => k !== prodId);
      const selectedKeys = otherKeys.slice(0, 4);
      relatedGrid.innerHTML = selectedKeys.map(k => {
        const item = productsCatalog[k];
        return `
          <div class="product-card">
            <a href="product.html?id=${item.id}" class="product-card-media" title="View ${item.title}">
              <img src="${item.mainImage}" alt="${item.title}" loading="lazy">
            </a>
            <div class="product-card-body">
              <h3 class="product-card-title"><a href="product.html?id=${item.id}">${item.title}</a></h3>
              <div class="product-card-price">${item.price}</div>
              <div class="product-card-footer">
                <button class="btn-primary-gold btn-block btn-sm btn-add-cart">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Rebind thumbnail click switcher
    initThumbSwitcher();
  }

  function initThumbSwitcher() {
    const mainProductImg = document.getElementById('main-product-img');
    const thumbs = document.querySelectorAll('.product-thumb');
    if (mainProductImg && thumbs.length) {
      thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
          thumbs.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
          const newSrc = thumb.getAttribute('data-src') || thumb.querySelector('img')?.src;
          if (newSrc && mainProductImg) {
            mainProductImg.style.opacity = '0.3';
            setTimeout(() => {
              mainProductImg.src = newSrc;
              mainProductImg.style.opacity = '1';
            }, 120);
          }
        });
      });
    }
  }

  initSingleProductPage();

  // 8. Quantity Selector
  const qtyInput = document.getElementById('product-qty');
  const btnMinus = document.getElementById('qty-minus');
  const btnPlus = document.getElementById('qty-plus');
  if (qtyInput && btnMinus && btnPlus) {
    btnMinus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });
    btnPlus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      qtyInput.value = val + 1;
    });
  }

  // 9. Smooth Scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // 10. Daily Catholic News Popup Modal System
  const newsModal = document.getElementById('news-modal');
  const newsItems = document.querySelectorAll('.news-item');

  const newsData = {
    1: {
      title: "Archdiocese Launches Year of Parish Renewal",
      badge: "Archdiocese of Colombo",
      date: "26 Sep 2026",
      source: "Catholic Messenger Sri Lanka",
      readTime: "3 min read",
      img: "images/news_archdiocese_gemini.jpg",
      caption: "His Eminence Malcolm Cardinal Ranjith addresses clergy, religious, and lay representatives at St. Lucia's Cathedral, Kotahena.",
      tags: ["Archdiocese of Colombo", "Parish Renewal", "Pastoral Ministry", "Synodality", "Family Life"],
      body: `
        <p><strong>COLOMBO (Catholic News LK)</strong> — In a momentous gathering of clergy, religious men and women, and lay parish delegates from across the Western Province, His Eminence Malcolm Cardinal Ranjith solemnly inaugurated the Archdiocesan 'Year of Parish Renewal' during a solemn concelebrated Pontifical Mass at St. Lucia's Cathedral, Kotahena.</p>
        <p>The year-long pastoral initiative seeks to re-energize liturgical life, family sanctification, youth involvement, and grassroots community solidarity across all 133 parish communities in the Archdiocese of Colombo.</p>
        <blockquote>"The living heart of Mother Church beats not merely within the grand stone walls of historic cathedrals, but inside every humble home where Christ is adored, and in every Basic Christian Community where neighbours love, pray, and care for one another in authentic Christian charity," Cardinal Ranjith emphasized in his homily.</blockquote>
        <p>Under this initiative, the Archdiocese has outlined several key pastoral priority action tracks for the coming liturgical year:</p>
        <ul>
          <li><strong>Family Faith Enrichment:</strong> Organizing monthly parish Holy Hours for families, regular home visitation by parish priests and catechists, and strengthening marriage and baptismal preparation.</li>
          <li><strong>Empowering Youth & Children:</strong> Revitalizing youth apostolates (YCS/CYM) to spearhead digital evangelization, Sunday school activities, and environmental stewardship projects.</li>
          <li><strong>Social Justice & Compassion:</strong> Expanding parish Caritas and St. Vincent de Paul conferences to reach out directly to vulnerable, elderly, and underprivileged families regardless of ethnic or religious background.</li>
        </ul>
        <p>Parishes across the archdiocese will conduct special commissioning ceremonies this coming Sunday to launch the programme at the local level with parish pastoral councils and community leaders.</p>
      `
    },
    2: {
      title: "St. Anthony's Feast Preparations Underway",
      badge: "Shrines & Pilgrimages",
      date: "24 Sep 2026",
      source: "National Shrine Media Unit",
      readTime: "2 min read",
      img: "images/news_feast_gemini.jpg",
      caption: "Devotees gather for the traditional flag-hoisting and solemn palanquin procession through Kotahena.",
      tags: ["St. Anthony", "Kochchikade", "National Shrine", "Feast 2026", "Pilgrimage"],
      body: `
        <p><strong>KOCHCHIKADE, COLOMBO</strong> — The rector and pastoral team of the National Shrine of St. Anthony, Kochchikade, have announced the finalization of comprehensive preparations for the forthcoming annual feast celebrations, expecting over 300,000 pilgrims from across Sri Lanka.</p>
        <p>The spiritual preparations, which begin with the traditional blessing and hoisting of the feast flag, will encompass nine days of novena masses celebrated in Sinhala, Tamil, and English at regular intervals throughout the day and evening.</p>
        <blockquote>"St. Anthony continues to be a miraculous sanctuary of hope, peace, and consolation for people of every ethnic and religious community in our nation. As we prepare for this feast, we warmly invite every pilgrim to experience the healing mercy and blessing of God through the intercession of our beloved patron," stated the Shrine Rector.</blockquote>
        <p>Key logistical arrangements made in close coordination with the Sri Lanka Police, the Colombo Municipal Council, and volunteer parish service groups include:</p>
        <ul>
          <li>Dedicated pilgrim rest shelters with 24-hour medical first-aid posts and clean drinking water stations.</li>
          <li>Special shuttle bus connections linking Colombo Fort Railway Station, Pettah Central Bus Stand, and the Shrine entrance.</li>
          <li>High-definition live audio-visual streaming of all major liturgical services and benedictions on Church.lk for sick and elderly devotees at home and abroad.</li>
        </ul>
      `
    },
    3: {
      title: "All Souls' Day Observances in Parishes",
      badge: "Liturgical Calendar",
      date: "22 Sep 2026",
      source: "Catholic Bishops' Conference",
      readTime: "2 min read",
      img: "images/news_candles_gemini.jpg",
      caption: "Illuminated prayer candles and floral arrangements adorn graves during the annual cemetery blessing.",
      tags: ["All Souls' Day", "Holy Souls", "Prayer for Departed", "Cemetery Masses", "Indulgences"],
      body: `
        <p><strong>SRI LANKA</strong> — Catholic parishes and religious communities throughout Sri Lanka's 12 dioceses are finalizing schedules for the commemoration of All Souls' Day on November 2nd, with cemetery Holy Masses, rosary processions, and grave blessings planned across the island.</p>
        <p>Tens of thousands of faithful are expected to visit church graveyards from early morning to clean, beautify, and illuminate the resting places of their beloved departed family members and friends with white lilies, fragrant blossoms, and glowing vigil candles.</p>
        <blockquote>"Praying for the faithful departed is one of the most sublime and comforting acts of mercy in our Catholic faith. In the Communion of Saints, love bridges time and eternity, and our prayers bring consolation and light to the souls journeying towards the beatific vision," remarked the Episcopal Liturgy Commission.</blockquote>
        <p>Parish offices will provide special Mass intention envelopes and the blessing of graves will take place according to parish-wise timetables published on Church.lk.</p>
      `
    }
  };

  if (newsModal) {
    // Open modal on clicking any news card, image, or title
    newsItems.forEach((item, index) => {
      const newsId = item.getAttribute('data-news-id') || (index + 1);
      item.addEventListener('click', (e) => {
        // Prevent default link navigation
        e.preventDefault();
        const data = newsData[newsId];
        if (data) {
          const badgeEl = document.getElementById('modal-news-badge');
          const titleEl = document.getElementById('modal-news-title');
          const dateEl = document.getElementById('modal-news-date');
          const imgEl = document.getElementById('modal-news-img');
          const captionEl = document.getElementById('modal-news-caption');
          const bodyEl = document.getElementById('modal-news-body');
          const tagsContainer = document.querySelector('.news-modal-tags');

          if (badgeEl) badgeEl.textContent = data.badge;
          if (titleEl) titleEl.textContent = data.title;
          if (dateEl) dateEl.textContent = data.date;
          if (imgEl) {
            imgEl.src = data.img;
            imgEl.alt = data.title;
          }
          if (captionEl) captionEl.textContent = data.caption;
          if (bodyEl) bodyEl.innerHTML = data.body;

          if (tagsContainer && data.tags) {
            tagsContainer.innerHTML = data.tags.map(t => `<span class="news-tag">${t}</span>`).join('');
          }

          // Open dialog natively using showModal()
          newsModal.showModal();
          document.body.style.overflow = 'hidden';
          window.location.hash = `news-${newsId}`;
        }
      });
    });

    // Close modal helper
    function closeNewsModal() {
      newsModal.close();
      document.body.style.overflow = '';
      if (window.location.hash.startsWith('#news-')) {
        history.replaceState(null, null, window.location.pathname + window.location.search);
      }
    }

    const closeBtn = document.getElementById('news-modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeNewsModal);

    const closeFooter = document.getElementById('news-modal-close-footer');
    if (closeFooter) closeFooter.addEventListener('click', closeNewsModal);

    // Light dismiss: clicking on backdrop outside dialog content closes modal
    newsModal.addEventListener('click', (e) => {
      const rect = newsModal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        closeNewsModal();
      }
    });

    newsModal.addEventListener('close', () => {
      document.body.style.overflow = '';
      if (window.location.hash.startsWith('#news-')) {
        history.replaceState(null, null, window.location.pathname + window.location.search);
      }
    });

    // Auto-open on deep link hash (e.g. index.html#news-1)
    const initialHash = window.location.hash.match(/^#news-(\d+)$/);
    if (initialHash) {
      const targetNews = document.querySelector(`.news-item[data-news-id="${initialHash[1]}"]`);
      if (targetNews) {
        setTimeout(() => targetNews.click(), 100);
      }
    }

    // Share button: native share or copy link with toast notification
    const shareBtn = document.getElementById('news-share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const title = document.getElementById('modal-news-title')?.textContent || 'Catholic News';
        if (navigator.share) {
          navigator.share({
            title: title,
            text: title + ' - Read more on Church.lk',
            url: window.location.href
          }).catch(() => {});
        } else {
          navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Article link copied to clipboard!');
          }).catch(() => {
            showToast('Link ready to share!');
          });
        }
      });
    }
  }

  // 10. Feast Days Page Interactive Controller
  initFeastDaysPage();

  function initFeastDaysPage() {
    const searchInput = document.getElementById('feast-search');
    const monthSelect = document.getElementById('feast-month-select');
    const rankSelect = document.getElementById('feast-rank-select');
    const dioceseSelect = document.getElementById('feast-diocese-select');
    const resetBtn = document.getElementById('feast-reset-btn');
    const chipBtns = document.querySelectorAll('.feast-chips-container .cat-chip');
    const countDisplay = document.getElementById('feast-visible-count');
    const emptyState = document.getElementById('feast-empty-state');
    const feastCards = document.querySelectorAll('.feast-card-expanded');

    if (!feastCards.length) return;

    let activeFilterCategory = 'all';

    function filterFeasts() {
      const query = (searchInput?.value || '').trim().toLowerCase();
      const selectedMonth = monthSelect?.value || 'all';
      const selectedRank = rankSelect?.value || 'all';
      const selectedDiocese = dioceseSelect?.value || 'all';

      let visibleCount = 0;

      feastCards.forEach(card => {
        const name = (card.querySelector('.feast-name-title')?.textContent || '').toLowerCase();
        const patronage = (card.querySelector('.feast-patronage-text')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('.feast-desc-text')?.textContent || '').toLowerCase();
        const shrines = (card.querySelector('.feast-shrines-list')?.textContent || '').toLowerCase();

        const cardMonth = card.getAttribute('data-month') || '';
        const cardRank = card.getAttribute('data-rank') || '';
        const cardDiocese = card.getAttribute('data-diocese') || '';
        const cardCategory = card.getAttribute('data-category') || '';
        const cardIsSriLankan = card.getAttribute('data-srilankan') === 'true';

        // 1. Text Search matching
        const matchesQuery = !query || 
          name.includes(query) || 
          patronage.includes(query) || 
          desc.includes(query) || 
          shrines.includes(query);

        // 2. Month matching
        const matchesMonth = (selectedMonth === 'all') || (cardMonth === selectedMonth);

        // 3. Liturgical Rank matching
        const matchesRank = (selectedRank === 'all') || (cardRank === selectedRank);

        // 4. Diocese matching
        const matchesDiocese = (selectedDiocese === 'all') || (cardDiocese.includes(selectedDiocese));

        // 5. Category Chip matching
        let matchesCategory = true;
        if (activeFilterCategory === 'solemnity') {
          matchesCategory = (cardRank === 'solemnity');
        } else if (activeFilterCategory === 'srilankan') {
          matchesCategory = cardIsSriLankan;
        } else if (activeFilterCategory === 'marian') {
          matchesCategory = cardCategory.includes('marian');
        } else if (activeFilterCategory === 'apostles') {
          matchesCategory = cardCategory.includes('apostles');
        } else if (activeFilterCategory === 'shrines') {
          matchesCategory = card.getAttribute('data-shrine') === 'true';
        }

        if (matchesQuery && matchesMonth && matchesRank && matchesDiocese && matchesCategory) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Hide or show season groups based on whether they contain visible cards
      const seasonGroups = document.querySelectorAll('.feast-season-group');
      seasonGroups.forEach(group => {
        const hasVisible = Array.from(group.querySelectorAll('.feast-card-expanded')).some(c => c.style.display !== 'none');
        group.style.display = hasVisible ? '' : 'none';
      });

      // Update counter
      if (countDisplay) {
        countDisplay.textContent = visibleCount;
      }

      // Toggle empty state
      if (emptyState) {
        if (visibleCount === 0) {
          emptyState.classList.add('show');
        } else {
          emptyState.classList.remove('show');
        }
      }
    }

    // Attach listeners
    if (searchInput) searchInput.addEventListener('input', filterFeasts);
    if (monthSelect) monthSelect.addEventListener('change', filterFeasts);
    if (rankSelect) rankSelect.addEventListener('change', filterFeasts);
    if (dioceseSelect) dioceseSelect.addEventListener('change', filterFeasts);

    // Chip listeners
    chipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        chipBtns.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        activeFilterCategory = btn.getAttribute('data-filter') || 'all';
        filterFeasts();
      });
    });

    // Reset button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (monthSelect) monthSelect.value = 'all';
        if (rankSelect) rankSelect.value = 'all';
        if (dioceseSelect) dioceseSelect.value = 'all';
        chipBtns.forEach(c => c.classList.remove('active'));
        const allBtn = document.querySelector('.feast-chips-container .cat-chip[data-filter="all"]');
        if (allBtn) allBtn.classList.add('active');
        activeFilterCategory = 'all';
        filterFeasts();
      });
    }

    // Initial filter run
    filterFeasts();
  }
});

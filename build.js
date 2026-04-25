const fs = require('fs');
const path = require('path');
const { neighborhoods, articles } = require('./data');
const CleanCSS = require('clean-css');
const Terser = require('terser');

const outDir = __dirname;
const baseUrl = 'https://ahsssan-moving.com'; // Placeholder
const companyName = 'الاحسان لنقل الأثاث';
const phone = '0545863986';
const waUrl = `https://wa.me/966${phone.substring(1)}`;

// ── Local image assets ────────────────────────────────────────────────────────
// All paths are root-relative so they resolve correctly on Vercel and
// with `npx serve` from the project root.
const images = {
  // Hero / Header  — truck on the road in Riyadh
  hero: {
    src: '/images/truck-moving-riyadh.webp',
    alt: 'سيارة نقل عفش بالرياض — الاحسان لنقل الأثاث',
  },
  // Gallery 1 — sofa wrapped in stretch film, ready for transport
  sofa: {
    src: '/images/sofa-wrapping-service.webp',
    alt: 'تغليف كنبة بالنايلون قبل نقل العفش بالرياض — حماية الأثاث من الخدوش',
  },
  // Gallery 2 — sofas wrapped outdoors in a Riyadh neighbourhood
  outdoor: {
    src: '/images/furniture-wrapped-outdoor.webp',
    alt: 'أثاث مغلف باللون الأخضر جاهز للنقل في حي بالرياض — الاحسان لنقل الأثاث',
  },
  // Gallery 3 / OG image — bedroom furniture wrapped inside the home
  bedroom: {
    src: '/images/bedroom-wrapping-service.webp',
    alt: 'تغليف غرفة نوم باحترافية قبل نقل العفش بالرياض — الاحسان لنقل الأثاث',
  },
};
// ─────────────────────────────────────────────────────────────────────────────

// Ensure directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Handle CSS and JS
const cssInput = fs.readFileSync(path.join(__dirname, 'src/css/style.css'), 'utf8');
const jsInput = fs.readFileSync(path.join(__dirname, 'src/js/main.js'), 'utf8');

ensureDir(path.join(outDir, 'css'));
ensureDir(path.join(outDir, 'js'));
ensureDir(path.join(outDir, 'images'));

// Copy images folder so the output directory is always self-contained.
// Skip when src and dest are the same path (outDir === __dirname).
const srcImagesDir = path.resolve(__dirname, 'images');
const outImagesDir = path.resolve(outDir, 'images');
if (fs.existsSync(srcImagesDir) && srcImagesDir !== outImagesDir) {
  fs.cpSync(srcImagesDir, outImagesDir, { recursive: true });
}

// 1. Save Unminified versions
fs.writeFileSync(path.join(outDir, 'css/style.css'), cssInput);
fs.writeFileSync(path.join(outDir, 'js/main.js'), jsInput);

// 2. Save Minified versions
const cssOutput = new CleanCSS({}).minify(cssInput).styles;
fs.writeFileSync(path.join(outDir, 'css/style.min.css'), cssOutput);

const build = async () => {
  const jsMinified = await Terser.minify(jsInput);
  fs.writeFileSync(path.join(outDir, 'js/main.min.js'), jsMinified.code);

  const getHeader = () => `
    <header>
      <div class="container header-content">
        <a href="/" class="logo">
          <span>🚛</span> الاحسان لنقل الأثاث
        </a>
        <nav class="header-nav">
          <a href="/">الرئيسية</a>
          <a href="/services/">خدماتنا</a>
          <a href="/blog/">المقالات</a>
          <a href="/contact/">تواصل معنا</a>
        </nav>
        <a href="tel:${phone}" class="header-phone">
          📞 ${phone}
        </a>
      </div>
    </header>
  `;

  const getFooter = () => `
    </main>
    <footer>
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <h3>الاحسان لنقل الأثاث</h3>
            <p>نقل عفشك بأمان في جميع أحياء الرياض مع ضمان الجودة وسرعة الإنجاز.</p>
            <ul style="list-style:none;margin-top:15px;">
              <li>📞 <a href="tel:${phone}" aria-label="اتصل بنا">${phone}</a></li>
              <li>💬 <a href="${waUrl}" rel="noopener noreferrer" aria-label="تواصل معنا عبر الواتساب">واتساب</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3>روابط هامة</h3>
            <ul>
              <li><a href="/">الرئيسية</a></li>
              <li><a href="/services/">خدماتنا</a></li>
              <li><a href="/blog/">المقالات</a></li>
              <li><a href="/contact/">تواصل معنا</a></li>
              <li><a href="/privacy-policy/">سياسة الخصوصية</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3>أبرز الأحياء المخدومة</h3>
            <ul>
              <li><a href="/neighborhoods/north-riyadh/">نقل أثاث شمال الرياض</a></li>
              <li><a href="/neighborhoods/south-riyadh/">نقل أثاث جنوب الرياض</a></li>
              <li><a href="/neighborhoods/east-riyadh/">نقل أثاث شرق الرياض</a></li>
              <li><a href="/neighborhoods/west-riyadh/">نقل أثاث غرب الرياض</a></li>
              <li><a href="/neighborhoods/olaya/">نقل أثاث العليا</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>جميع الحقوق محفوظة &copy; 2026 الاحسان لنقل الأثاث</p>
        </div>
      </div>
    </footer>
    <div class="floating-bar">
      <a href="tel:${phone}" class="float-call" aria-label="اتصل بنا">📞 اتصل الحين</a>
      <a href="${waUrl}" class="float-wa" rel="noopener noreferrer" aria-label="تواصل معنا عبر الواتساب">💬 واتساب الحين</a>
    </div>
  `;

  const getHead = (title, desc, pathUrl) => `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <meta name="description" content="${desc}">
      <meta name="theme-color" content="#0A2540">
      <link rel="canonical" href="${baseUrl}${pathUrl}">

      <!-- Non-blocking Arabic font -->
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap">

      <!-- Open Graph -->
      <meta property="og:type" content="website">
      <meta property="og:locale" content="ar_SA">
      <meta property="og:site_name" content="الاحسان لنقل الأثاث">
      <meta property="og:url" content="${baseUrl}${pathUrl}">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${desc}">
      <meta property="og:image" content="${baseUrl}${images.bedroom.src}">
      <meta property="og:image:width" content="960">
      <meta property="og:image:height" content="1280">

      <!-- Twitter Card -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${desc}">
      <meta name="twitter:image" content="${baseUrl}${images.bedroom.src}">

      <!-- Assets -->
      <link rel="stylesheet" href="/css/style.min.css">
      <script defer src="/js/main.min.js"></script>

      <!-- Schema: LocalBusiness / MovingCompany -->
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "MovingCompany",
        "name": "${companyName}",
        "url": "${baseUrl}",
        "image": "${baseUrl}${images.bedroom.src}",
        "telephone": "+966${phone.substring(1)}",
        "priceRange": "$$",
        "openingHours": "Sa-Th 07:00-22:00",
        "areaServed": "Riyadh",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "الرياض",
          "addressRegion": "الرياض",
          "addressCountry": "SA"
        },
        "sameAs": ["https://wa.me/966${phone.substring(1)}"]
      }
      </script>
    </head>
    <body>
    <main>
  `;

  // Write HTML with error handling
  const writeHtml = (filePath, content) => {
    try {
      fs.writeFileSync(filePath, content, 'utf8');
    } catch (err) {
      console.error(`❌ Failed to write: ${filePath}`);
      console.error(err.message);
      process.exitCode = 1;
    }
  };

  // 1. Home Page
  const homeHtml = `
    ${getHead('نقل عفش بالرياض باحترافية | الاحسان لنقل الأثاث', 'نقل عفشك بأمان مع الاحسان. خبرة وكفاءة في نقل الأثاث بجميع أحياء الرياض مع الفك والتركيب والتغليف. اتصل الحين 0545863986', '/')}
    ${getHeader()}
    
    <section class="hero">
      <img src="${images.hero.src}" alt="${images.hero.alt}" class="hero-bg" fetchpriority="high" width="960" height="1280" decoding="async">
      <div class="hero-overlay"></div>
      <div class="container">
        <h1>نقل عفشك بأمان مع الاحسان</h1>
        <p>خبرة وكفاءة في نقل الأثاث بجميع أحياء الرياض</p>
        <div class="hero-btns">
          <a href="tel:${phone}" class="btn primary" aria-label="اتصل بنا">📞 اتصل الحين</a>
          <a href="${waUrl}" class="btn secondary" rel="noopener noreferrer" aria-label="تواصل معنا عبر الواتساب">💬 واتساب الحين</a>
        </div>
      </div>
    </section>

    <div class="container">
      <div class="stats">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-num">+5,000</div>
            <p>طلب منجز</p>
          </div>
          <div class="stat-item">
            <div class="stat-num">4.9</div>
            <p>تقييم العملاء</p>
          </div>
          <div class="stat-item">
            <div class="stat-num">+50</div>
            <p>حي مخدوم في الرياض</p>
          </div>
          <div class="stat-item">
            <div class="stat-num">+10</div>
            <p>سنوات خبرة</p>
          </div>
        </div>
      </div>
    </div>

    <section class="services">
      <div class="container">
        <h2 class="section-title">خدماتنا</h2>
        <div class="services-grid">
          <div class="service-card">
            <div class="service-icon">🛋️</div>
            <h3>نقل العفش كامل</h3>
            <p>ننقل كل شي من مكانه لمكانه الجديد بعناية تامة وحرص على ممتلكاتك</p>
          </div>
          <div class="service-card">
            <div class="service-icon">📦</div>
            <h3>تغليف احترافي</h3>
            <p>نغلّف أثاثك زين بفقاعات وكراتين قوية عشان يوصل سليم وبدون خدوش</p>
          </div>
          <div class="service-card">
            <div class="service-icon">🔧</div>
            <h3>فك وتركيب</h3>
            <p>نفك ونركّب من الألف للياء بواسطة نجارين وفنيين محترفين</p>
          </div>
          <div class="service-card">
            <div class="service-icon">🏪</div>
            <h3>تخزين مؤقت</h3>
            <p>عندنا مستودعات آمنة ونظيفة إن احتجت تخزن عفشك لفترة مؤقتة</p>
          </div>
          <div class="service-card">
            <div class="service-icon">🚛</div>
            <h3>سيارات مجهزة</h3>
            <p>سيارات نظيفة ومغلقة لكل أحجام العفش تحميه من الغبار والمطر</p>
          </div>
          <div class="service-card">
            <div class="service-icon">💰</div>
            <h3>أسعار تناسب الجميع</h3>
            <p>أسعار على قد الجميع بدون مفاجآت وبأعلى جودة خدمة</p>
          </div>
        </div>
      </div>
    </section>

    <section class="how-we-work" style="background: var(--white)">
      <div class="container">
        <h2 class="section-title">كيف نشتغل؟</h2>
        <div class="steps-container">
          <div class="step">
            <div class="step-num">1</div>
            <h3>اتصل أو واتسابنا</h3>
            <p>كلّمنا وحدّد موعدك بدون أي تعقيد</p>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <h3>نحدد السعر والموعد</h3>
            <p>نعطيك سعر واضح بدون مفاجآت</p>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <h3>نجي ونغلف ونشيل</h3>
            <p>فريقنا يجيك بالموعد ويتكفّل بكل شي</p>
          </div>
          <div class="step">
            <div class="step-num">4</div>
            <h3>نركّب كل شي في مكانه</h3>
            <p>نخلّيك مرتاح في بيتك الجديد</p>
          </div>
        </div>
      </div>
    </section>

    <section class="images-section" aria-label="معرض صور خدمات نقل العفش">
      <div class="container">
        <div class="gallery">
          <img src="${images.hero.src}" alt="${images.hero.alt}" width="960" height="1280" loading="lazy">
          <img src="${images.sofa.src}" alt="${images.sofa.alt}" width="960" height="1280" loading="lazy">
          <img src="${images.outdoor.src}" alt="${images.outdoor.alt}" width="1260" height="945" loading="lazy">
          <img src="${images.bedroom.src}" alt="${images.bedroom.alt}" width="960" height="1280" loading="lazy">
        </div>
      </div>
    </section>

    <section class="reviews" style="background: var(--white)">
      <div class="container">
        <h2 class="section-title">قالوا عنّا عملاؤنا</h2>
        <div class="reviews-grid">
          <div class="review-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p class="review-text">"والله خدمة ما قصّروا، نقلوا عفشي من العليا للنسيم بدون أي خسارة. الشيّالين محترمين وسريعين. أنصح فيهم"</p>
            <p class="review-author">أبو فهد الرشيدي</p>
          </div>
          <div class="review-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p class="review-text">"صراحة فاجأوني بالسعر والخدمة، فككوا وركّبوا الغرف بشكل احترافي. ما توقعت يكون بهالسهولة. مشكورين"</p>
            <p class="review-author">أم سلطان</p>
          </div>
          <div class="review-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p class="review-text">"ثالث مرة أتعامل معهم. كل مرة أحسن من اللي قبلها. ما فكّر غيرهم لو تبي تنقل عفشك بأمان"</p>
            <p class="review-author">محمد العتيبي</p>
          </div>
          <div class="review-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p class="review-text">"جاوا بالموعد بالضبط وخلصوا بنصف الوقت اللي توقعته. الأثاث وصل سليم 100%. جزاهم الله خير"</p>
            <p class="review-author">خالد الدوسري</p>
          </div>
          <div class="review-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p class="review-text">"سعر مناسب وخدمة تنفع. غلّفوا كل شي بعناية وما انكسر شي. هذي هي الخدمة الصح"</p>
            <p class="review-author">أبو عبدالرحمن</p>
          </div>
          <div class="review-card">
            <div class="stars">⭐⭐⭐⭐⭐</div>
            <p class="review-text">"بنت وعندي أثاث غالي، خفت أول بس الحمد لله وصل كله تمام. أسلوبهم محترم وما قصّروا أبد"</p>
            <p class="review-author">سارة المطيري</p>
          </div>
        </div>
      </div>
    </section>

    <section class="faq">
      <div class="container">
        <h2 class="section-title">أسئلة يسألونها كثير</h2>
        <div class="faq-container">
          <div class="faq-item">
            <div class="faq-q">كم سعر نقل العفش في الرياض؟ <span class="icon">+</span></div>
            <div class="faq-a">تختلف الأسعار حسب كمية العفش والمسافة، تواصل معنا الحين وتحصل على سعر واضح بدون مفاجآت</div>
          </div>
          <div class="faq-item">
            <div class="faq-q">كم تاخذون وقت في النقل؟ <span class="icon">+</span></div>
            <div class="faq-a">في الغالب نخلص نقل الشقة العادية في يوم واحد من الفك للتركيب</div>
          </div>
          <div class="faq-item">
            <div class="faq-q">هل تغلفون الأجهزة الكهربائية؟ <span class="icon">+</span></div>
            <div class="faq-a">إي والله، نغلف كل شي بمواد خاصة تضمن وصوله سليم</div>
          </div>
          <div class="faq-item">
            <div class="faq-q">هل عندكم ضمان على الأثاث؟ <span class="icon">+</span></div>
            <div class="faq-a">نعم، نتكفّل بأي ضرر يصير أثناء النقل</div>
          </div>
          <div class="faq-item">
            <div class="faq-q">هل تشتغلون في جميع أحياء الرياض؟ <span class="icon">+</span></div>
            <div class="faq-a">نعم، نغطي جميع أحياء الرياض بدون استثناء</div>
          </div>
          <div class="faq-item">
            <div class="faq-q">هل يمكن الحجز بنفس اليوم؟ <span class="icon">+</span></div>
            <div class="faq-a">نحاول نوفر لك موعد بأسرع وقت، تواصل معنا وناكد لك</div>
          </div>
          <div class="faq-item">
            <div class="faq-q">هل أسعاركم شاملة الفك والتركيب؟ <span class="icon">+</span></div>
            <div class="faq-a">نعم، السعر يشمل الفك والتغليف والنقل والتركيب</div>
          </div>
          <div class="faq-item">
            <div class="faq-q">كيف أتواصل معكم؟ <span class="icon">+</span></div>
            <div class="faq-a">اتصل على 0545863986 أو واتساب على نفس الرقم</div>
          </div>
        </div>
      </div>
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
          "@type": "Question",
          "name": "كم سعر نقل العفش في الرياض؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "تختلف الأسعار حسب كمية العفش والمسافة، تواصل معنا الحين وتحصل على سعر واضح بدون مفاجآت"
          }
        }, {
          "@type": "Question",
          "name": "كم تاخذون وقت في النقل؟",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "في الغالب نخلص نقل الشقة العادية في يوم واحد من الفك للتركيب"
          }
        }]
      }
      </script>
    </section>

    ${getFooter()}
    </body></html>
  `;
  writeHtml(path.join(outDir, 'index.html'), homeHtml);

  // 2. Neighborhood Pages
  const generateNeighborhood = (n) => `
    ${getHead(`نقل أثاث ${n.name} | الاحسان 0545863986`, `نقل عفش ${n.name} باحترافية وأمان، فك وتركيب وتغليف. اتصل الحين 0545863986`, `/neighborhoods/${n.id}/`)}
    ${getHeader()}
    
    <div class="page-header">
      <div class="container">
        <h1>نقل عفش ${n.name} — الاحسان</h1>
        <p>خدمات متكاملة لنقل الأثاث في ${n.name}</p>
      </div>
    </div>
    
    <div class="container" style="padding: 40px 20px;">
      <div class="content-area">
        <h2>أفضل شركة نقل عفش في ${n.name}</h2>
        <p>إذا كنت تبحث عن شركة موثوقة لنقل أثاثك في حي ${n.name}، فإن شركة الاحسان هي خيارك الأول. نقدم خدمة متكاملة تشمل الفك، التغليف، النقل، والتركيب بأيدي محترفين وبأسعار تنافسية.</p>
        <p>سياراتنا مجهزة خصيصاً لحماية الأثاث، ونقدم ضمانات على سلامة منقولاتك حتى وصولها إلى وجهتها الجديدة.</p>

        <div class="gallery" style="margin: 30px 0;">
          <img src="${images.outdoor.src}" alt="${images.outdoor.alt} — ${n.name}" width="1260" height="945" loading="lazy" style="border-radius:12px;">
          <img src="${images.sofa.src}" alt="${images.sofa.alt} — ${n.name}" width="960" height="1280" loading="lazy" style="border-radius:12px;">
        </div>
        
        <h2>خدماتنا في ${n.name}</h2>
        <ul>
          <li>فك وتركيب جميع أنواع غرف النوم والمطابخ</li>
          <li>تغليف بأعلى جودة لحماية العفش من الخدوش</li>
          <li>سيارات دينة حديثة مجهزة للعمليات السريعة</li>
          <li>عمالة ماهرة ومحترفة</li>
        </ul>
        
        <div class="cta-box">
          <h3>محتاج تنقل عفشك اليوم؟</h3>
          <p>تواصل معنا الحين لخدمة سريعة ومضمونة في ${n.name}</p>
          <div style="display:flex;gap:15px;justify-content:center;margin-top:20px;">
            <a href="tel:${phone}" class="btn primary" aria-label="اتصل بنا">📞 اتصل الحين</a>
            <a href="${waUrl}" class="btn secondary" rel="noopener noreferrer" aria-label="تواصل معنا عبر الواتساب">💬 واتساب الحين</a>
          </div>
        </div>
      </div>
    </div>

    <script type="application/ld+json">
    [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
          "@type": "ListItem",
          "position": 1,
          "name": "الرئيسية",
          "item": "${baseUrl}"
        },{
          "@type": "ListItem",
          "position": 2,
          "name": "نقل أثاث ${n.name}",
          "item": "${baseUrl}/neighborhoods/${n.id}/"
        }]
      },
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "نقل عفش ${n.name}",
        "provider": {
          "@type": "MovingCompany",
          "name": "${companyName}",
          "telephone": "+966${phone.substring(1)}"
        },
        "areaServed": {
          "@type": "Place",
          "name": "${n.name}، الرياض"
        },
        "url": "${baseUrl}/neighborhoods/${n.id}/"
      }
    ]
    </script>
    ${getFooter()}
    </body></html>
  `;
  
  ensureDir(path.join(outDir, 'neighborhoods'));
  neighborhoods.forEach(n => {
    ensureDir(path.join(outDir, 'neighborhoods', n.id));
    writeHtml(path.join(outDir, 'neighborhoods', n.id, 'index.html'), generateNeighborhood(n));
  });

  // 3. Blog Index Page
  const blogHtml = `
    ${getHead('المقالات ونصائح نقل العفش | الاحسان لنقل الأثاث', 'تعرف على أفضل النصائح قبل نقل العفش وأسعار النقل في الرياض وكيف تختار الشركة المناسبة', '/blog/')}
    ${getHeader()}
    
    <div class="page-header">
      <div class="container">
        <h1>المقالات والنصائح</h1>
        <p>كل ما تحتاجه لمعرفة نقل العفش بأمان</p>
      </div>
    </div>
    
    <div class="container" style="padding: 40px 20px;">
      <div class="services-grid">
        ${articles.map(a => `
          <div class="service-card" style="text-align: right;">
            <h2 style="color: var(--primary); margin-bottom: 10px; font-size: 1.5rem;">${a.title}</h2>
            <p style="margin-bottom: 15px;">${a.description}</p>
            <a href="/blog/${a.id}/" class="btn secondary" style="width: 100%; font-size: 1rem;">اقرأ المقال</a>
          </div>
        `).join('')}
      </div>
    </div>
    ${getFooter()}
    </body></html>
  `;
  ensureDir(path.join(outDir, 'blog'));
  writeHtml(path.join(outDir, 'blog', 'index.html'), blogHtml);

  // 4. Blog Articles
  articles.forEach(a => {
    const articleHtml = `
      ${getHead(`${a.title} | الاحسان`, a.description, `/blog/${a.id}/`)}
      ${getHeader()}
      
      <div class="page-header">
        <div class="container">
          <h1>${a.title}</h1>
        </div>
      </div>
      
      <div class="container" style="padding: 40px 20px;">
        <div class="content-area">
          ${a.content}
        </div>
      </div>

      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
          "@type": "ListItem",
          "position": 1,
          "name": "الرئيسية",
          "item": "${baseUrl}"
        },{
          "@type": "ListItem",
          "position": 2,
          "name": "المقالات",
          "item": "${baseUrl}/blog/"
        },{
          "@type": "ListItem",
          "position": 3,
          "name": "${a.title}",
          "item": "${baseUrl}/blog/${a.id}/"
        }]
      }
      </script>
      ${getFooter()}
      </body></html>
    `;
    ensureDir(path.join(outDir, 'blog', a.id));
    writeHtml(path.join(outDir, 'blog', a.id, 'index.html'), articleHtml);
  });

  // 5. Contact Page
  const contactHtml = `
    ${getHead('تواصل معنا | الاحسان لنقل الأثاث', 'تواصل مع شركة الاحسان لنقل الأثاث في الرياض للحصول على أفضل خدمات نقل العفش', '/contact/')}
    ${getHeader()}
    
    <div class="page-header">
      <div class="container">
        <h1>تواصل معنا</h1>
        <p>نحن هنا لخدمتك على مدار الساعة</p>
      </div>
    </div>
    
    <div class="container" style="padding: 40px 20px;">
      <div class="content-area" style="text-align: center;">
        <h2 style="margin-top: 0;">كيف نقدر نساعدك؟</h2>
        <p>تقدر تتواصل معنا في أي وقت لطلب الخدمة أو الاستفسار عن الأسعار.</p>
        <div style="display:flex;flex-direction:column;gap:20px;max-width:400px;margin:30px auto 0;">
          <a href="tel:${phone}" class="btn primary" style="font-size: 1.3rem; padding: 15px;" aria-label="اتصل بنا">📞 ${phone}</a>
          <a href="${waUrl}" class="btn secondary" style="font-size: 1.3rem; padding: 15px;" rel="noopener noreferrer" aria-label="تواصل معنا عبر الواتساب">💬 تواصل عبر الواتساب</a>
        </div>
      </div>
    </div>
    ${getFooter()}
    </body></html>
  `;
  ensureDir(path.join(outDir, 'contact'));
  writeHtml(path.join(outDir, 'contact', 'index.html'), contactHtml);

  // 6. Services Page
  const servicesHtml = `
    ${getHead('خدماتنا في نقل العفش | الاحسان لنقل الأثاث', 'تعرف على خدماتنا المتكاملة في نقل الأثاث: الفك، التركيب، التغليف، والتخزين المؤقت.', '/services/')}
    ${getHeader()}
    
    <div class="page-header">
      <div class="container">
        <h1>خدماتنا</h1>
        <p>كل ما تحتاجه لنقل عفشك بأمان وسهولة</p>
      </div>
    </div>
    
    <div class="container" style="padding: 40px 20px;">
      <div class="services-grid">
        <div class="service-card">
          <div class="service-icon">🛋️</div>
          <h3>نقل العفش كامل</h3>
          <p>ننقل كل شي من مكانه لمكانه الجديد بعناية تامة وحرص على ممتلكاتك</p>
        </div>
        <div class="service-card">
          <div class="service-icon">📦</div>
          <h3>تغليف احترافي</h3>
          <p>نغلّف أثاثك زين بفقاعات وكراتين قوية عشان يوصل سليم وبدون خدوش</p>
        </div>
        <div class="service-card">
          <div class="service-icon">🔧</div>
          <h3>فك وتركيب</h3>
          <p>نفك ونركّب من الألف للياء بواسطة نجارين وفنيين محترفين</p>
        </div>
        <div class="service-card">
          <div class="service-icon">🏪</div>
          <h3>تخزين مؤقت</h3>
          <p>عندنا مستودعات آمنة ونظيفة إن احتجت تخزن عفشك لفترة مؤقتة</p>
        </div>
      </div>
      
      <div class="cta-box">
        <h3>جاهز تنقل عفشك؟</h3>
        <p>فريقنا جاهز يخدمك في أي وقت!</p>
        <a href="tel:${phone}" class="btn primary" aria-label="اتصل بنا">اتصل الحين 0545863986</a>
      </div>
    </div>
    ${getFooter()}
    </body></html>
  `;
  ensureDir(path.join(outDir, 'services'));
  writeHtml(path.join(outDir, 'services', 'index.html'), servicesHtml);

  // 7. Privacy Policy
  const privacyHtml = `
    ${getHead('سياسة الخصوصية | الاحسان لنقل الأثاث', 'سياسة الخصوصية لشركة الاحسان لنقل الأثاث', '/privacy-policy/')}
    ${getHeader()}
    
    <div class="page-header">
      <div class="container">
        <h1>سياسة الخصوصية</h1>
      </div>
    </div>
    
    <div class="container" style="padding: 40px 20px;">
      <div class="content-area">
        <h2>ما المعلومات اللي نجمعها</h2>
        <p>نحن في "الاحسان لنقل الأثاث" نحترم خصوصيتك. المعلومات التي نجمعها تقتصر على الاسم ورقم الهاتف والعنوان عند تواصلك معنا لطلب الخدمة.</p>
        
        <h2>كيف نستخدمها</h2>
        <p>نستخدم هذه المعلومات فقط لتحديد موقع الخدمة والتواصل معك لترتيب موعد النقل وتقديم أفضل خدمة لك. لا نقوم بمشاركة أو بيع معلوماتك لأي طرف ثالث.</p>
        
        <h2>ملفات الكوكيز</h2>
        <p>يستخدم موقعنا ملفات الكوكيز (Cookies) لتحسين تجربة المستخدم وتحليل الزيارات عبر أدوات مثل Google Analytics لتقديم خدمة أفضل.</p>
        
        <h2>تواصل معنا لأي استفسار</h2>
        <p>إذا كان لديك أي استفسار حول سياسة الخصوصية، يمكنك التواصل معنا عبر الهاتف أو الواتساب.</p>
      </div>
    </div>
    ${getFooter()}
    </body></html>
  `;
  ensureDir(path.join(outDir, 'privacy-policy'));
  writeHtml(path.join(outDir, 'privacy-policy', 'index.html'), privacyHtml);

  // 8. 404 Page (root 404.html) — no canonical on error pages
  const error404Head = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>صفحة غير موجودة | الاحسان لنقل الأثاث</title>
      <meta name="robots" content="noindex, nofollow">
      <meta name="theme-color" content="#0A2540">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap">
      <link rel="stylesheet" href="/css/style.min.css">
      <script defer src="/js/main.min.js"></script>
    </head>
    <body>
    <main>
  `;
  const errorHtml = `
    ${error404Head}
    ${getHeader()}
    
    <div class="page-header">
      <div class="container">
        <h1>خطأ 404</h1>
      </div>
    </div>
    
    <div class="container" style="padding: 80px 20px; text-align: center;">
      <h2 style="font-size: 2.5rem; color: var(--primary); margin-bottom: 20px;">عذراً، هذي الصفحة مو موجودة</h2>
      <p style="margin-bottom: 30px; font-size: 1.2rem;">يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
      <div style="display:flex;gap:15px;justify-content:center;">
        <a href="/" class="btn primary">العودة للرئيسية</a>
        <a href="${waUrl}" class="btn secondary" rel="noopener noreferrer" aria-label="تواصل معنا عبر الواتساب">💬 واتساب الحين</a>
      </div>
    </div>
    ${getFooter()}
    </body></html>
  `;
  writeHtml(path.join(outDir, '404.html'), errorHtml);

  // 9. Generate Sitemap.xml
  const urls = [
    '/', '/services/', '/contact/', '/privacy-policy/', '/blog/',
    ...neighborhoods.map(n => `/neighborhoods/${n.id}/`),
    ...articles.map(a => `/blog/${a.id}/`)
  ];
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>\n    <loc>${baseUrl}${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${url === '/' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemapXml);

  // 10. Generate robots.txt
  const robotsTxt = `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml`;
  fs.writeFileSync(path.join(outDir, 'robots.txt'), robotsTxt);

  const totalPages = 1 + neighborhoods.length + 1 + articles.length + 1 + 1 + 1 + 1;
  console.log(`✅ Build complete — ${totalPages} pages generated successfully!`);
  console.log(`   📁 Images : /images/ (${Object.keys(images).length} assets)`);
  console.log(`   🏘️  Neighborhoods : ${neighborhoods.length} pages`);
  console.log(`   📝 Articles : ${articles.length} pages`);
};

build().catch(console.error);

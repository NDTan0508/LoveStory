(function(){
  // Surprise button functionality
  const surpriseBtn = document.getElementById('surpriseBtn');
  const surpriseModal = document.getElementById('surpriseModal');
  const surpriseCloseBtn = document.getElementById('surpriseCloseBtn');
  const surpriseHearts = document.querySelector('.surprise-hearts');
  let heartsActive = false;

  function openSurpriseModal() {
    if (surpriseModal) {
      surpriseModal.classList.add('show');
      document.body.classList.add('modal-open');
      
      // Calculate and display days together
      calculateDaysTogether();
      
      // Create flying hearts effect (only once)
      if (!heartsActive) {
        createFlyingHearts();
        heartsActive = true;
      }
    }
  }

  function calculateDaysTogether() {
    const daysCounter = document.getElementById('daysCounter');
    if (!daysCounter) return;
    
    // Start date: May 3, 2025
    const startDate = new Date('2025-05-03');
    const today = new Date();
    
    // Reset time to midnight for accurate day calculation
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    // Calculate difference in milliseconds
    const differenceMs = today - startDate;
    
    // Convert to days
    const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    
    // Display the number with animation
    if (differenceDays >= 0) {
      // Animate the number counting up
      let current = 0;
      const target = differenceDays;
      const duration = 1500; // 1.5 seconds
      const increment = Math.max(1, Math.ceil(target / 50));
      const stepTime = duration / (target / increment);
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        daysCounter.textContent = current.toLocaleString();
      }, stepTime);
      
      // Set initial value
      daysCounter.textContent = '0';
    } else {
      // If date hasn't reached yet, show 0
      daysCounter.textContent = '0';
    }
  }

  function closeSurpriseModal() {
    if (surpriseModal) {
      surpriseModal.classList.remove('show');
      document.body.classList.remove('modal-open');
    }
  }

  if (surpriseBtn) {
    surpriseBtn.addEventListener('click', openSurpriseModal);
  }

  if (surpriseCloseBtn) {
    surpriseCloseBtn.addEventListener('click', closeSurpriseModal);
  }

  // Close modal when clicking on overlay
  if (surpriseModal) {
    const overlay = surpriseModal.querySelector('.surprise-modal-overlay');
    const modalContent = surpriseModal.querySelector('.surprise-modal-content');
    
    // Close when clicking overlay
    if (overlay) {
      overlay.addEventListener('click', closeSurpriseModal);
    }
    
    // Prevent closing when clicking on modal content
    if (modalContent) {
      modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
    
    // Also close when clicking directly on modal (but not content)
    surpriseModal.addEventListener('click', (e) => {
      if (e.target === surpriseModal || e.target === overlay) {
        closeSurpriseModal();
      }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && surpriseModal.classList.contains('show')) {
        closeSurpriseModal();
      }
    });
  }

  function createFlyingHearts() {
    const heartEmojis = ['💖', '💕', '💗', '💓', '💝', '💞', '💘', '💌'];
    const heartsContainer = surpriseHearts || document.body;
    
    function createHeart() {
      const heart = document.createElement('div');
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      heart.style.position = 'fixed';
      heart.style.fontSize = (20 + Math.random() * 20) + 'px';
      heart.style.left = Math.random() * 100 + '%';
      heart.style.top = '50%';
      heart.style.opacity = '0';
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '1000';
      heart.style.transition = 'all 2s ease-out';
      heart.style.transform = 'translateY(0) rotate(0deg)';
      
      heartsContainer.appendChild(heart);
      
      // Animate heart
      setTimeout(() => {
        const angle = (Math.random() - 0.5) * 60;
        const distance = 200 + Math.random() * 200;
        heart.style.opacity = '1';
        heart.style.transform = `translateY(-${distance}px) translateX(${Math.sin(angle) * distance}px) rotate(${angle}deg)`;
      }, 10);
      
      // Remove heart after animation
      setTimeout(() => {
        heart.style.opacity = '0';
        setTimeout(() => heart.remove(), 2000);
      }, 2000);
    }
    
    // Create multiple hearts
    for (let i = 0; i < 30; i++) {
      setTimeout(() => createHeart(), i * 100);
    }
    
    // Continue creating hearts periodically
    const heartInterval = setInterval(() => {
      createHeart();
    }, 500);
    
    // Stop after 10 seconds
    setTimeout(() => {
      clearInterval(heartInterval);
    }, 10000);
  }

  // Parallax scroll effect - disabled to prevent annoying layered effect
  function initParallax() {
    // Parallax disabled for smoother experience
    // The parallax layer stays fixed without movement
  }

  // Initialize parallax on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParallax);
  } else {
    initParallax();
  }

  // Journey Preview on Index Page
  function createJourneyPreview() {
    const journeyPreview = document.getElementById('journeyPreview');
    if (!journeyPreview) return;
    
    // Get the 4 specific timeline items: 19/05, 03/05, 11/08, forever
    const previewMemories = [
      { title: 'Ngày Đầu Gặp Nhau', date: '19/05', caption: 'Khi câu chuyện của chúng ta bắt đầu 💕', image: 'IMG_4677.JPG' },
      { title: 'Bắt Đầu Hẹn Hò', date: '03/05', caption: 'Ngày chúng ta trở thành đôi 💖', image: 'IMG_2942.JPG' },
      { title: 'Kỷ Niệm 100 Ngày', date: '11/08', caption: '100 ngày yêu thương và hạnh phúc 💗', image: 'IMG_4292.JPG' },
      { title: 'Mãi Mãi', date: 'forever', caption: 'Mong tình yêu kéo dài bền chặt 💞', image: 'IMG_4679.JPG' }
    ];
    
    journeyPreview.innerHTML = '';
    
    previewMemories.forEach((memory, index) => {
      const item = document.createElement('div');
      item.className = `journey-preview-item ${index % 2 === 0 ? 'journey-left' : 'journey-right'}`;
      
      item.innerHTML = `
        <div class="journey-preview-content">
          <div class="journey-preview-date">${memory.date}</div>
          <h3 class="journey-preview-title">${memory.title}</h3>
          <div class="journey-preview-photo">
            <img src="assets/img/${memory.image}" alt="${memory.title}" />
            <div class="journey-preview-overlay"></div>
          </div>
          <p class="journey-preview-caption">${memory.caption}</p>
        </div>
        <div class="journey-preview-line"></div>
      `;
      
      journeyPreview.appendChild(item);
      
      // Handle image errors
      const imgEl = item.querySelector('img');
      if (imgEl) {
        imgEl.onerror = function() {
          if (memory.image.toUpperCase().endsWith('.JPG')) {
            imgEl.src = `assets/img/${memory.image.replace(/\.JPG$/, '.jpg')}`;
          }
        };
      }
      
      // Add animation on scroll
      setTimeout(() => {
        item.classList.add('journey-visible');
      }, index * 150);
    });
    
    // Set up intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('journey-visible');
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });
    
    const items = journeyPreview.querySelectorAll('.journey-preview-item');
    items.forEach(item => {
      observer.observe(item);
    });
  }
  
  // Initialize journey preview when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createJourneyPreview);
  } else {
    createJourneyPreview();
  }

  // Ideas page: random selection from lists
  const ideaButtons = document.querySelectorAll('.idea-btn');
  const resultMain = document.getElementById('resultMain');
  const resultBackup1 = document.getElementById('resultBackup1');
  const resultBackup2 = document.getElementById('resultBackup2');
  
  // Vietnamese lists
  const ideasLists = {
    'eat-full': [
      'Bánh ép', 'Cơm mẹt', 'Bún thịt nướng', 'Xôi gà', 'Cơm gà hội an',
      'Hủ tiếu', 'Ốp la', 'Cơm bụi', 'Phở', 'Bún bò',
      'Bún gà', 'Miến gà/bò', 'Bánh mì', 'Bèo nậm lọc', 'Mì xào',
      'Bánh canh tôm tít', 'Bánh ướt', 'Bún bò', 'Bánh bao', 'Bún nghệ',
      'Bánh canh', 'Xôi ngô đức kế', 'Dooki', 'Bún chả cá', 'Nướng',
      'Cơm cuộn', 'Bún nắm nêm', 'Cơm nắm', 'Bún thịt nướng', 'Xôi trộn',
      'Mì trộn', 'Bún chả', 'Bánh khoái', 'Bánh cuốn', 'Mì lạnh',
      'Xôi thịt hon', 'Mì tương đen', 'Bánh dày', 'Mì cay', 'Mì gà A+',
      'Bún 🫘 mắn 🍤', 'Bánh muỳ🔺', '🍚 trộn hàn xẻn', 'Bánh bao', 'Pizza 🍕',
      'Xôi ngọt', 'Ramen🍜', 'Bánh ướt lòng gà (80 trần huy liệu)', 'Ốc',
      'Bún chỏa hà lội (cả ngày)', 'Ram cuốn', 'Cháo bò🐮', 'Cơm chiên',
      'Cơm hến', 'Bún vịt khô', 'Cơm chiên kim chuy', 'Bún real 🦀',
      'Tacos', 'Mì Quảng', 'Bánh canh nam phổ', 'Bánh hỏi',
      'Bánh giò', 'Nem lụi 🚀', 'Bánh canh cá lóc', 'Nem nướng nha trang (15 dương văn an)'
    ],
    'snack': [
      'Đậu hũ thiên mụ', 'Gà rán', 'Bánh tráng trứng/trộn', 'Bánh aeon', 'Kem',
      'Chân gà, tré trộn', 'Bà lễ phố đi bộ', 'Bingsuu', 'Tokbokki', 'Cá viên chiênn',
      'Lạp xửn nướng đá', 'Bánh mì nướng muối ớt', 'Chèee', 'Milo dầm', 'Jollibee',
      'Cửa hàng tiện lợi', 'Bánh mìn tây', 'Bánh chuối chiênnn', 'Lọc chiên', 'Cóc xoài ổi',
      'Bánh kẹp đà nẽng', 'Bánh bạch tuộc 🐙', 'Xôi kemm', 'Trứng 🐔 nướng', 'Nem chua rén',
      'Há cảo 🥟', 'Ngọc chè bưởi', 'Kem bơ', 'Kem flan, rau câu (270 bạch đằng, 37 nguyễn biểu)',
      'Hot dog', 'Bột chin sì gòn (254 btx)', 'Bánh căn nam mặp (171 phan đình phùng)',
      'Bánh tôm hồ tây', 'Đậu hũ sì gòn (chợ tây lộc)', 'Chân gà bóp (cầu gia hội)',
      'Crep sầu riêng', 'Bánh gà 🐓', 'Khoai lan kén/lắc', 'Kem lami (35 nguyễn biểu)', 'Bánh ép Huệ'
    ],
    'go-out': [
      'Xem phim', 'Photobooth', 'Công viên', 'Cầu bán nguyệt', 'Tô tượng',
      'Làm vòng 🙆‍♀️🙆‍♂️', 'Vẽ tranh 🖼️🖌️', 'Làm đồ gốm 🏺', 'Chùa 🙏🏻', 'Biển 🌊',
      'Đồi thiên an', 'Đồi vọng cảnh', 'Khe ngang', 'Đi cùng nhau 💓', 'Bảo tàng 🖼️',
      '🧺 Picnic', 'Suối ♨️🏞️', 'Chèo sup 🚣🏻‍♀️', 'Đạp zịt 🦆', 'Bắn cung 🏹',
      'Khu vui chơi', 'Lắp ghép', 'Nặn đất ⚡️', 'Ném bowling 🎳', 'Music box',
      'Jump arena', 'Nấm pottery (làm gốm)', 'PS5'
    ],
    'cafe': [
      'Cầu nguyễn hoàng', 'Cf đồi thiên an', 'Dechill', 'Noise', 'The time',
      'Mixue', 'Sensor', 'Slow thành', 'Guộc', 'Noa',
      'Cồn dã viên', 'Đông ba', 'Trốn', 'Hi heaven', 'Góc nhỏ bakery',
      'Lasimi', 'Plao', 'Cfe cóc', 'Ants cafe', 'Lô cồ',
      'Trốn tìm'
    ]
  };

  function getRandomItems(list, count) {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  if (ideaButtons.length > 0 && resultMain) {
    ideaButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        ideaButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Get category and pick 3 random items
        const category = btn.getAttribute('data-category');
        const list = ideasLists[category];
        
        if (list && list.length > 0) {
          const randomItems = getRandomItems(list, 3);
          
          // Show main result (first item) with sparkle effect
          resultMain.textContent = randomItems[0] || '';
          resultMain.classList.remove('empty');
          if (randomItems[0]) {
            resultMain.classList.add('sparkle');
          } else {
            resultMain.classList.remove('sparkle');
          }
          
          // Show backup results
          if (resultBackup1) {
            resultBackup1.textContent = randomItems[1] || '';
            if (randomItems[1]) {
              resultBackup1.classList.remove('empty');
            } else {
              resultBackup1.classList.add('empty');
            }
          }
          if (resultBackup2) {
            resultBackup2.textContent = randomItems[2] || '';
            if (randomItems[2]) {
              resultBackup2.classList.remove('empty');
            } else {
              resultBackup2.classList.add('empty');
            }
          }
        } else {
          resultMain.classList.add('empty');
          resultMain.textContent = 'List is empty. Please add items!';
          if (resultBackup1) resultBackup1.textContent = '';
          if (resultBackup2) resultBackup2.textContent = '';
        }
      });
    });
  }

  // Auto-load gallery images
  const grid = document.getElementById('galleryGrid');
  if (grid) {
    // First try to get images from embedded JSON in HTML
    const imagesDataScript = document.getElementById('images-data');
    let images = null;
    
    if (imagesDataScript) {
      try {
        images = JSON.parse(imagesDataScript.textContent.trim());
      } catch (e) {
        console.error('Error parsing embedded images data:', e);
      }
    }
    
    // If not found in HTML, try to load from JSON file
    if (!images || !Array.isArray(images) || images.length === 0) {
      // Try fetch first
      fetch(`assets/img/images.json?v=${Date.now()}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(fetchedImages => {
          if (Array.isArray(fetchedImages) && fetchedImages.length > 0) {
            loadImagesIntoGrid(fetchedImages);
          } else {
            throw new Error('No images in JSON file');
          }
        })
        .catch(error => {
          console.error('Error loading images.json:', error);
          // Try XMLHttpRequest fallback
          loadAllImagesDirectly();
        });
    } else {
      // Use embedded images
      loadImagesIntoGrid(images);
    }
  }

  function loadImagesIntoGrid(images) {
    const grid = document.getElementById('galleryGrid');
    if (!grid || !Array.isArray(images) || images.length === 0) {
      if (grid) {
        grid.innerHTML = '<p class="muted">Không tìm thấy hình ảnh. Thêm hình ảnh vào thư mục assets/img và chạy update-gallery-html.ps1</p>';
      }
      return;
    }
    
    grid.innerHTML = ''; // Clear any existing content
    let loadedCount = 0;
    
    images.forEach((img, index) => {
      const figure = document.createElement('figure');
      figure.className = 'gallery-item';
      const imgEl = document.createElement('img');
      imgEl.src = `assets/img/${img}`;
      imgEl.alt = `Ảnh ${index + 1}`;
      imgEl.loading = 'lazy';
      
      // Handle image load errors - remove the figure if image fails to load
      imgEl.onerror = function() {
        // Try lowercase extension if uppercase failed (for case-sensitive systems)
        if (img.toUpperCase().endsWith('.JPG')) {
          const lowerPath = `assets/img/${img.replace(/\.JPG$/, '.jpg')}`;
          imgEl.src = lowerPath;
          // If lowercase also fails, remove the element
          imgEl.onerror = function() {
            console.warn(`Failed to load image: ${img} - removing from gallery`);
            figure.remove();
          };
        } else {
          console.warn(`Failed to load image: ${img} - removing from gallery`);
          figure.remove();
        }
      };
      
      // Track successful loads
      imgEl.onload = function() {
        loadedCount++;
      };
      
      figure.appendChild(imgEl);
      grid.appendChild(figure);
    });
    
    // After a short delay, check if any images loaded
    setTimeout(() => {
      const remainingItems = grid.querySelectorAll('.gallery-item');
      if (remainingItems.length === 0) {
        grid.innerHTML = '<p class="muted">Không tìm thấy hình ảnh. Thêm hình ảnh vào thư mục assets/img và chạy update-gallery-html.ps1</p>';
      } else {
        setupLightbox();
      }
    }, 1000);
  }

  function loadAllImagesDirectly() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    
    // Get list from JSON file via synchronous XMLHttpRequest as fallback
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/img/images.json', false); // synchronous
    xhr.send();
    
    if (xhr.status === 200) {
      try {
        const images = JSON.parse(xhr.responseText);
        if (Array.isArray(images) && images.length > 0) {
          loadImagesIntoGrid(images);
          return;
        }
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    }
    
    // Final fallback: try discoverImages
    discoverImages();
  }

  function discoverImages() {
    // Common image extensions
    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'JPG', 'JPEG', 'PNG'];
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    // Try common filenames/patterns
    const commonNames = ['DSCF0600.JPG', 'DSCF0569.JPG', 'DSCF0462.JPG'];
    let loaded = 0;
    let tried = 0;
    const maxAttempts = 100; // Try up to 100 potential images

    const tryImage = (filename) => {
      const img = new Image();
      img.onload = () => {
        const figure = document.createElement('figure');
        figure.className = 'gallery-item';
        const imgEl = document.createElement('img');
        imgEl.src = `assets/img/${filename}`;
        imgEl.alt = `Photo ${loaded + 1}`;
        imgEl.loading = 'lazy';
        figure.appendChild(imgEl);
        grid.appendChild(figure);
        loaded++;
        tried++;
        if (tried < maxAttempts) {
          setTimeout(() => tryNext(), 50);
        } else {
          setupLightbox();
        }
      };
      img.onerror = () => {
        tried++;
        if (tried < maxAttempts) {
          setTimeout(() => tryNext(), 50);
        } else if (loaded === 0) {
          grid.innerHTML = '<p class="muted">Không tìm thấy hình ảnh. Thêm hình ảnh vào thư mục assets/img.</p>';
        } else {
          setupLightbox();
        }
      };
      img.src = `assets/img/${filename}`;
    };

    const tryNext = () => {
      if (tried < commonNames.length) {
        tryImage(commonNames[tried]);
      } else {
        // Try numbered patterns
        const num = tried - commonNames.length + 1;
        const patterns = [
          `IMG${String(num).padStart(4, '0')}.jpg`,
          `IMG${String(num).padStart(4, '0')}.JPG`,
          `photo${num}.jpg`,
          `image${num}.jpg`,
          `DSCF${String(num).padStart(4, '0')}.JPG`,
          `DSC${String(num).padStart(5, '0')}.JPG`
        ];
        const patternIndex = (tried - commonNames.length) % patterns.length;
        const cycle = Math.floor((tried - commonNames.length) / patterns.length);
        const filename = patterns[patternIndex].replace(/\d+/, String(cycle + 1));
        tryImage(filename);
      }
    };

    if (commonNames.length > 0) {
      tryNext();
    } else {
      setupLightbox();
    }
  }

  function setupLightbox() {
    const grid = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-image') : null;
    const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;

    if (grid && lightbox && lightboxImg && closeBtn) {
      grid.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.tagName === 'IMG') {
          lightboxImg.src = target.src;
          lightbox.classList.add('open');
          lightbox.setAttribute('aria-hidden', 'false');
        }
      });
      const close = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.removeAttribute('src');
      };
      closeBtn.addEventListener('click', close);
      lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    }
  }

  // Floating hearts on home page
  const heartsLayer = document.querySelector('.floating-hearts');
  if (heartsLayer) {
    const makeHeart = () => {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.textContent = '❤';
      const size = 10 + Math.random() * 20;
      heart.style.left = Math.random() * 100 + 'vw';
      heart.style.fontSize = size + 'px';
      heart.style.animationDuration = 6 + Math.random() * 6 + 's';
      heartsLayer.appendChild(heart);
      setTimeout(() => heart.remove(), 12000);
    };
    const interval = setInterval(makeHeart, 600);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(interval);
      }
    });
  }
})();
// Gallery page specific JavaScript
(function() {
  const imagesDataScript = document.getElementById('images-data');
  const heartContainer = document.getElementById('heartContainer');
  const timelineContainer = document.getElementById('timelineContainer');
  
  if (!imagesDataScript) return;
  
  let images = [];
  try {
    images = JSON.parse(imagesDataScript.textContent.trim());
  } catch (e) {
    console.error('Error parsing images data:', e);
    return;
  }

  // Heart shape coordinates (improved heart pattern)
  function generateHeartPositions(count) {
    const positions = [];
    const centerX = 50; // percentage
    const centerY = 50; // percentage
    const size = 40; // Increased heart size for clarity
    
    // Create a better heart shape distribution
    const heartPoints = [];
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      // Heart parametric equation: x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      
      // Scale and position
      const scaledX = centerX + (x * size / 16);
      const scaledY = centerY + (y * size / 16);
      
      // Calculate distance from center
      const distFromCenter = Math.sqrt(Math.pow(scaledX - centerX, 2) + Math.pow(scaledY - centerY, 2));
      
      // Don't place photos too close to center (leave space for text)
      if (distFromCenter < 8) {
        // Push photos away from center
        const angle = Math.atan2(scaledY - centerY, scaledX - centerX);
        const newDist = 8 + (distFromCenter / 8) * 5; // Push to at least 8% from center
        const adjustedX = centerX + Math.cos(angle) * newDist;
        const adjustedY = centerY + Math.sin(angle) * newDist;
        
        heartPoints.push({
          x: Math.max(5, Math.min(95, adjustedX)),
          y: Math.max(5, Math.min(95, adjustedY)),
          rotation: (Math.random() - 0.5) * 25,
          delay: Math.random() * 2,
          scale: 0.8 + Math.random() * 0.4
        });
      } else {
        heartPoints.push({
          x: Math.max(5, Math.min(95, scaledX)),
          y: Math.max(5, Math.min(95, scaledY)),
          rotation: (Math.random() - 0.5) * 25,
          delay: Math.random() * 2,
          scale: 0.8 + Math.random() * 0.4
        });
      }
    }
    
    return heartPoints;
  }

  // Create floating heart gallery
  function createHeartGallery() {
    if (!heartContainer || images.length === 0) return;
    
    heartContainer.innerHTML = '';
    
    // Create more positions for a denser heart (at least 20-25 photos)
    const targetPhotoCount = Math.max(images.length, 20);
    const positions = generateHeartPositions(targetPhotoCount);
    
    // Duplicate images if needed to fill all positions
    const photosToShow = [];
    for (let i = 0; i < targetPhotoCount; i++) {
      photosToShow.push(images[i % images.length]);
    }
    
    photosToShow.forEach((img, index) => {
      const pos = positions[index];
      const photoDiv = document.createElement('div');
      photoDiv.className = 'heart-photo';
      photoDiv.style.left = pos.x + '%';
      photoDiv.style.top = pos.y + '%';
      photoDiv.style.setProperty('--rotation', pos.rotation + 'deg');
      photoDiv.style.setProperty('--scale', pos.scale);
      photoDiv.style.animationDelay = pos.delay + 's';
      
      const imgEl = document.createElement('img');
      imgEl.src = `assets/img/${img}`;
      imgEl.alt = `Memory ${(index % images.length) + 1}`;
      imgEl.loading = 'lazy';
      
      // Handle errors
      imgEl.onerror = function() {
        if (img.toUpperCase().endsWith('.JPG')) {
          imgEl.src = `assets/img/${img.replace(/\.JPG$/, '.jpg')}`;
        }
      };
      
      photoDiv.appendChild(imgEl);
      heartContainer.appendChild(photoDiv);
    });
  }

  // Timeline captions (you can customize these)
  // Each memory can have its own specific photo filename
  const timelineCaptions = [
    { title: 'Ngày Đầu Gặp Nhau', date: '19/04', caption: 'Khi câu chuyện của chúng ta bắt đầu 💕', image: 'IMG_4677.JPG' }, 
    { title: 'Bắt Đầu Hẹn Hò', date: '03/05', caption: 'Ngày chúng ta trở thành đôi 💖', image: 'IMG_2942.JPG' },
    { title: 'Sinh Nhật Của Anh', date: '05/08', caption: 'Ngày anh chào đời 🎂💕', image: 'IMG_4287.JPG' },
    { title: 'Kỷ Niệm 100 Ngày', date: '11/08', caption: '100 ngày yêu thương và hạnh phúc 💗', image: 'IMG_4292.JPG' },
    { title: 'Sinh Nhật Của Em', date: '06/09', caption: 'Ngày em tròn 18 🎉💖', image: 'DSCF0412.jpg' },
    { title: 'Ngày 20 Tháng 10', date: '20/10', caption: 'Một ngày đặc biệt để nhớ 💓', image: 'IMG_6342.JPG' },
    { title: 'Mãi Mãi', date: 'forever', caption: 'Mong tình yêu kéo dài bền chặt 💞', image: 'IMG_4679.JPG' }
  ];

  // Create timeline gallery
  function createTimelineGallery() {
    if (!timelineContainer || images.length === 0) return;
    
    timelineContainer.innerHTML = '';
    
    // Only show the first 7 images for the 7 memories
    // But allow custom images to be specified in timelineCaptions
    const imagesToShow = [];
    
    timelineCaptions.forEach((caption, index) => {
      let imageToUse = null;
      
      // If a specific image is specified, try to use it
      if (caption.image) {
        // Check if the specified image exists in the images array
        const foundImage = images.find(img => img === caption.image || img.toLowerCase() === caption.image.toLowerCase());
        if (foundImage) {
          imageToUse = foundImage;
        }
      }
      
      // If no specific image or not found, use the next available image from the list
      if (!imageToUse) {
        // Use images that haven't been used yet
        const usedImages = imagesToShow.map(item => item.image);
        imageToUse = images.find(img => !usedImages.includes(img));
      }
      
      // Fallback: if still no image, use index-based
      if (!imageToUse && images[index]) {
        imageToUse = images[index];
      }
      
      if (imageToUse) {
        imagesToShow.push({ ...caption, image: imageToUse });
      }
    });
    
    imagesToShow.forEach((item, index) => {
      const timelineItem = document.createElement('div');
      timelineItem.className = `timeline-item ${index % 2 === 0 ? 'timeline-left' : 'timeline-right'}`;
      timelineItem.setAttribute('data-index', index);
      
      timelineItem.innerHTML = `
        <div class="timeline-content">
          <div class="timeline-date">${item.date}</div>
          <h3 class="timeline-title">${item.title}</h3>
          <div class="timeline-photo">
            <img src="assets/img/${item.image}" alt="${item.title}" />
            <div class="timeline-overlay"></div>
          </div>
          <p class="timeline-caption">${item.caption}</p>
        </div>
        <div class="timeline-line"></div>
      `;
      
      timelineContainer.appendChild(timelineItem);
      
      // Handle image errors
      const imgEl = timelineItem.querySelector('img');
      if (imgEl) {
        imgEl.onerror = function() {
          if (item.image.toUpperCase().endsWith('.JPG')) {
            imgEl.src = `assets/img/${item.image.replace(/\.JPG$/, '.jpg')}`;
          }
        };
      }
    });
    
    // Set up intersection observer for scroll animations
    setupScrollAnimations();
  }

  // Scroll animations for timeline items
  function setupScrollAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('timeline-visible');
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });
    
    timelineItems.forEach(item => {
      observer.observe(item);
    });
  }

  // Back to top button
  function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });
    
    backToTopBtn.addEventListener('click', () => {
      document.getElementById('heartGallery').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  // Create floating heart particles
  function createHeartParticles() {
    const particlesContainer = document.querySelector('.heart-particles');
    if (!particlesContainer) return;
    
    const heartEmojis = ['💖', '💕', '💗', '💓', '💝', '💞', '💘'];
    
    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'heart-particle';
      particle.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      particle.style.left = Math.random() * 100 + '%';
      particle.style.fontSize = (12 + Math.random() * 16) + 'px';
      particle.style.opacity = 0.3 + Math.random() * 0.4;
      particle.style.animationDuration = (8 + Math.random() * 12) + 's';
      particle.style.animationDelay = Math.random() * 2 + 's';
      
      particlesContainer.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 20000);
    }
    
    // Create initial particles
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createParticle(), i * 300);
    }
    
    // Continue creating particles
    setInterval(() => {
      if (particlesContainer.children.length < 20) {
        createParticle();
      }
    }, 2000);
  }

  // Lightbox functionality for gallery photos
  function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-image') : null;
    const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;

    if (!lightbox || !lightboxImg || !closeBtn) return;

    // Handle clicks on heart photos
    document.addEventListener('click', (e) => {
      const heartPhoto = e.target.closest('.heart-photo');
      if (heartPhoto) {
        const img = heartPhoto.querySelector('img');
        if (img && img.src) {
          lightboxImg.src = img.src;
          lightbox.classList.add('open');
          lightbox.setAttribute('aria-hidden', 'false');
        }
      }
      
      // Handle clicks on timeline photos
      const timelinePhoto = e.target.closest('.timeline-photo');
      if (timelinePhoto) {
        const img = timelinePhoto.querySelector('img');
        if (img && img.src) {
          lightboxImg.src = img.src;
          lightbox.classList.add('open');
          lightbox.setAttribute('aria-hidden', 'false');
        }
      }
    });

    const close = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.removeAttribute('src');
    };

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        close();
      }
    });
  }

  // Initialize everything when page loads
  function init() {
    createHeartGallery();
    createTimelineGallery();
    setupBackToTop();
    createHeartParticles();
    setupLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


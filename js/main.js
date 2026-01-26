 AOS.init({
 	duration: 800,
 	easing: 'slide'
 });

(function($) {

	"use strict";

	$(window).stellar({
    responsive: true,
    parallaxBackgrounds: true,
    parallaxElements: true,
    horizontalScrolling: false,
    hideDistantElements: false,
    scrollProperty: 'scroll'
  });


	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	// loader
	var loader = function() {
		setTimeout(function() { 
			if($('#ftco-loader').length > 0) {
				$('#ftco-loader').removeClass('show');
			}
		}, 1);
	};
	loader();

	// Scrollax
   $.Scrollax();



   // Burger Menu
	var burgerMenu = function() {

		$('body').on('click', '.js-fh5co-nav-toggle', function(event){

			event.preventDefault();

			if ( $('#ftco-nav').is(':visible') ) {
				$(this).removeClass('active');
			} else {
				$(this).addClass('active');	
			}

			
			
		});

	};
	burgerMenu();


	var onePageClick = function() {


	$(document).on('click', '#ftco-nav a[href^="#"]', function (event) {
	    event.preventDefault();

	    var href = $.attr(this, 'href');

	    if (window.SpaceJourney && window.SpaceJourney.navigateTo) {
	    	window.SpaceJourney.navigateTo(href);
	    	return;
	    }

	    $('html, body').animate({
	        scrollTop: $($.attr(this, 'href')).offset().top - 70
	    }, 500, function() {
	    	// window.location.hash = href;
	    });
		});

	};

	onePageClick();
	

	var carousel = function() {
		$('.home-slider').owlCarousel({
	    loop:true,
	    autoplay: true,
	    margin:0,
	    animateOut: 'fadeOut',
	    animateIn: 'fadeIn',
	    nav:false,
	    autoplayHoverPause: false,
	    items: 1,
	    navText : ["<span class='ion-md-arrow-back'></span>","<span class='ion-chevron-right'></span>"],
	    responsive:{
	      0:{
	        items:1
	      },
	      600:{
	        items:1
	      },
	      1000:{
	        items:1
	      }
	    }
		});
	};
	carousel();

	$('nav .dropdown').hover(function(){
		var $this = $(this);
		// 	 timer;
		// clearTimeout(timer);
		$this.addClass('show');
		$this.find('> a').attr('aria-expanded', true);
		// $this.find('.dropdown-menu').addClass('animated-fast fadeInUp show');
		$this.find('.dropdown-menu').addClass('show');
	}, function(){
		var $this = $(this);
			// timer;
		// timer = setTimeout(function(){
			$this.removeClass('show');
			$this.find('> a').attr('aria-expanded', false);
			// $this.find('.dropdown-menu').removeClass('animated-fast fadeInUp show');
			$this.find('.dropdown-menu').removeClass('show');
		// }, 100);
	});


	$('#dropdown04').on('show.bs.dropdown', function () {
	  console.log('show');
	});

	// scroll
	var scrollWindow = function() {
		$(window).scroll(function(){
			var $w = $(this),
					st = $w.scrollTop(),
					navbar = $('.ftco_navbar'),
					sd = $('.js-scroll-wrap');

			if (st > 150) {
				if ( !navbar.hasClass('scrolled') ) {
					navbar.addClass('scrolled');	
				}
			} 
			if (st < 150) {
				if ( navbar.hasClass('scrolled') ) {
					navbar.removeClass('scrolled sleep');
				}
			} 
			if ( st > 350 ) {
				if ( !navbar.hasClass('awake') ) {
					navbar.addClass('awake');	
				}
				
				if(sd.length > 0) {
					sd.addClass('sleep');
				}
			}
			if ( st < 350 ) {
				if ( navbar.hasClass('awake') ) {
					navbar.removeClass('awake');
					navbar.addClass('sleep');
				}
				if(sd.length > 0) {
					sd.removeClass('sleep');
				}
			}
		});
	};
	scrollWindow();

	

	var counter = function() {
		
		$('#section-counter, .hero-wrap, .ftco-counter, .ftco-about').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {

				var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
				$('.number').each(function(){
					var $this = $(this),
						num = $this.data('number');
						console.log(num);
					$this.animateNumber(
					  {
					    number: num,
					    numberStep: comma_separator_number_step
					  }, 7000
					);
				});
				
			}

		} , { offset: '95%' } );

	}
	counter();


	var contentWayPoint = function() {
		var i = 0;
		$('.ftco-animate').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('ftco-animated') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .ftco-animate.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn ftco-animated');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft ftco-animated');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight ftco-animated');
							} else {
								el.addClass('fadeInUp ftco-animated');
							}
							el.removeClass('item-animate');
						},  k * 50, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '95%' } );
	};
	contentWayPoint();

	// magnific popup
	$('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
     gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0,1] // Will preload 0 - before current, and 1 after the current image
    },
    image: {
      verticalFit: true
    },
    zoom: {
      enabled: true,
      duration: 300 // don't foget to change the duration also in CSS
    }
  });

  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,

    fixedContentPos: false
  });


  var goHere = function() {

		$('.mouse-icon').on('click', function(event){
			
			event.preventDefault();

			if (window.SpaceJourney && window.SpaceJourney.navigateTo) {
				window.SpaceJourney.navigateTo('#about-section');
				return false;
			}

			$('html,body').animate({
				scrollTop: $('.goto-here').offset().top
			}, 500, 'easeInOutExpo');
			
			return false;
		});
	};
	goHere();

	// $("#myScrollspy").scrollspy({ offset: -75 });



var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
};


})(jQuery);







// this makes the height of each page equal to the height of the window
// $('.page').css('height', $( window ).height());

// scrollspy section
(function($){
  //variable that will hold the href attr of the links in the menu
  var sections = [];
  //variable that stores the id of the section
  var id = false;
  //variable for the selection of the anchors in the navbar
  var $navbara = $('#navi a');
  
  $navbara.click(function(e){
    //prevent the page from refreshing
    e.preventDefault();
    //set the top offset animation and speed
    $('html, body').animate({
      scrollTop: $($(this).attr('href')).offset().top - 180
},500);
    hash($(this).attr('href'));
  });
  
  
  
  //select all the anchors in the navbar one after another
  $navbara.each(function(){
   // and adds them in the sections variable
    sections.push($($(this).attr('href')));
    
  })
  $(window).scroll(function(e){
    // scrollTop retains the value of the scroll top with the reference at the middle of the page
    var scrollTop = $(this).scrollTop() + ($(window).height()/2);
    //cycle through the values in sections array
    for (var i in sections) {
      var section = sections[i];
      //if scrollTop variable is bigger than the top offset of a section in the sections array then 
      if (scrollTop > section.offset().top){
        var scrolled_id = section.attr('id');
      }
    }
    if (scrolled_id !== id) {
      id = scrolled_id;
      $($navbara).removeClass('current');
      $('#navi a[href="#' + id + '"]').addClass('current'); 
    }
  })
})(jQuery);

// Space Journey theme logic (canvas + transitions + smooth navigation)
(function() {
  var canvas = document.getElementById('space-canvas');
  var overlay = document.getElementById('transition-overlay');
  var loading = document.getElementById('space-loading');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var sections = Array.prototype.slice.call(document.querySelectorAll('.space-section'));
  if (!canvas || sections.length === 0) {
    if (loading) {
      loading.classList.add('is-hidden');
    }
    return;
  }

  var state = {
    currentId: sections[0].id,
    isTransitioning: false
  };

  var sectionOrder = sections.map(function(section) {
    return section.id;
  });

  var transitionMap = {
    'home-section->about-section': 'warp',
    'about-section->background-section': 'asteroids',
    'background-section->skills-section': 'fire',
    'skills-section->projects-section': 'blackhole'
  };

  function getTransitionEffect(fromId, toId) {
    var directKey = fromId + '->' + toId;
    if (transitionMap[directKey]) {
      return transitionMap[directKey];
    }

    var fromIndex = sectionOrder.indexOf(fromId);
    var toIndex = sectionOrder.indexOf(toId);
    if (fromIndex === -1 || toIndex === -1) {
      return 'warp';
    }

    if (toIndex > fromIndex) {
      return transitionMap[sectionOrder[fromIndex] + '->' + sectionOrder[fromIndex + 1]] || 'warp';
    }

    if (fromIndex > toIndex) {
      return transitionMap[sectionOrder[toIndex] + '->' + sectionOrder[toIndex + 1]] || 'warp';
    }

    return 'warp';
  }

  function playTransition(effect, onStart) {
    if (!overlay || prefersReducedMotion) {
      if (typeof onStart === 'function') {
        onStart();
      }
      return;
    }

    if (state.isTransitioning) {
      return;
    }

    state.isTransitioning = true;
    overlay.setAttribute('data-effect', effect);
    overlay.classList.remove('is-active');

    // Force reflow to restart animation.
    void overlay.offsetWidth;
    overlay.classList.add('is-active');

    if (typeof onStart === 'function') {
      setTimeout(onStart, 180);
    }

    setTimeout(function() {
      overlay.classList.remove('is-active');
      state.isTransitioning = false;
    }, 1400);
  }

  function setActiveSection(sectionId) {
    state.currentId = sectionId;
    document.body.setAttribute('data-space-active', sectionId);
  }

  function smoothScrollTo(targetId) {
    var element = document.querySelector(targetId);
    if (!element) {
      return;
    }
    var offset = 80;
    var top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  function navigateTo(href) {
    var targetId = href;
    if (href.charAt(0) !== '#') {
      targetId = '#' + href;
    }
    var element = document.querySelector(targetId);
    if (!element) {
      return;
    }

    var effect = getTransitionEffect(state.currentId, element.id);
    playTransition(effect, function() {
      smoothScrollTo(targetId);
    });
  }

  window.SpaceJourney = {
    navigateTo: navigateTo
  };

  var ctas = document.querySelectorAll('.space-cta');
  ctas.forEach(function(cta) {
    cta.addEventListener('click', function(event) {
      event.preventDefault();
      navigateTo(cta.getAttribute('href'));
    });
  });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.6) {
        return;
      }

      var nextId = entry.target.id;
      if (nextId && nextId !== state.currentId) {
        var effect = getTransitionEffect(state.currentId, nextId);
        playTransition(effect);
        setActiveSection(nextId);
      }
    });
  }, { threshold: [0.6] });

  sections.forEach(function(section) {
    observer.observe(section);
  });

  setActiveSection(state.currentId);

  // Canvas star field (adjust counts and speed in layers below).
  var ctx = canvas.getContext('2d');
  var width = 0;
  var height = 0;
  var dpr = window.devicePixelRatio || 1;
  var stars = [];
  var layers = [
    { count: 140, speed: 0.25, size: 1.2 },
    { count: 90, speed: 0.45, size: 1.6 },
    { count: 60, speed: 0.75, size: 2.2 }
  ];

  function createStar(layer) {
    var star = {
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      z: Math.random() * 0.9 + 0.1,
      px: 0,
      py: 0,
      layer: layer
    };
    return star;
  }

  function resetStar(star) {
    star.x = (Math.random() - 0.5) * width;
    star.y = (Math.random() - 0.5) * height;
    star.z = Math.random() * 0.9 + 0.1;
    star.px = 0;
    star.py = 0;
  }

  function initStars() {
    stars = [];
    layers.forEach(function(layer) {
      for (var i = 0; i < layer.count; i += 1) {
        stars.push(createStar(layer));
      }
    });
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initStars();
  }

  function projectStar(star, centerX, centerY) {
    var scale = 1 / star.z;
    return {
      x: star.x * scale + centerX,
      y: star.y * scale + centerY,
      size: Math.max(0.5, star.layer.size * (1 - star.z) * 1.2)
    };
  }

  var lastTime = 0;

  function animateStars(time) {
    if (prefersReducedMotion) {
      return;
    }

    var delta = time - lastTime;
    lastTime = time;
    ctx.clearRect(0, 0, width, height);

    var parallaxX = Math.sin(window.scrollY * 0.001) * 20;
    var parallaxY = Math.cos(window.scrollY * 0.001) * 30;
    var centerX = width / 2 + parallaxX;
    var centerY = height / 2 + parallaxY;

    stars.forEach(function(star) {
      star.z -= star.layer.speed * delta * 0.0007;
      if (star.z <= 0.1) {
        resetStar(star);
      }

      var projected = projectStar(star, centerX, centerY);
      if (projected.x < 0 || projected.x > width || projected.y < 0 || projected.y > height) {
        resetStar(star);
        return;
      }

      var alpha = Math.min(1, (1 - star.z) * 1.2);
      ctx.strokeStyle = 'rgba(170, 200, 255, ' + alpha + ')';
      ctx.lineWidth = projected.size;
      ctx.beginPath();
      ctx.moveTo(star.px || projected.x, star.py || projected.y);
      ctx.lineTo(projected.x, projected.y);
      ctx.stroke();

      star.px = projected.x;
      star.py = projected.y;
    });

    requestAnimationFrame(animateStars);
  }

  resizeCanvas();
  if (prefersReducedMotion) {
    ctx.clearRect(0, 0, width, height);
  } else {
    requestAnimationFrame(animateStars);
  }

  window.addEventListener('resize', function() {
    resizeCanvas();
  });

  if (loading) {
    loading.classList.add('is-hidden');
    setTimeout(function() {
      loading.style.display = 'none';
    }, 600);
  }
})();

hash = function(h){
  if (history.pushState){
    history.pushState(null, null, h);
  }else{
    location.hash = h;
  }
}


$(function() {

  $(".progress").each(function() {

    var value = $(this).attr('data-value');
    var left = $(this).find('.progress-left .progress-bar');
    var right = $(this).find('.progress-right .progress-bar');

    if (value > 0) {
      if (value <= 50) {
        right.css('transform', 'rotate(' + percentageToDegrees(value) + 'deg)')
      } else {
        right.css('transform', 'rotate(180deg)')
        left.css('transform', 'rotate(' + percentageToDegrees(value - 50) + 'deg)')
      }
    }

  })

  function percentageToDegrees(percentage) {

    return percentage / 100 * 360

  }

});


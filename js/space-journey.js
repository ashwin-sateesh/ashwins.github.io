/**
 * Space Journey Animation Engine
 * Handles background rendering and cinematic transitions between sections.
 */

class SpaceJourney {
    constructor() {
        this.canvas = document.getElementById('space-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        this.sections = ['home', 'about', 'background', 'skills', 'projects'];
        this.currentSection = 0;
        this.targetSection = 0;
        this.transitionProgress = 0;
        this.isTransitioning = false;
        
        // Stars/Particles
        this.stars = [];
        this.asteroids = [];
        this.particles = [];
        
        // Theme Configs
        this.themes = {
            home: { type: 'warp', speed: 2, color: '#ffffff' }, // Falling stars
            about: { type: 'mars', speed: 0.5, color: '#c1440e' }, // Mars dust
            background: { type: 'saturn', speed: 1, color: '#daa520' }, // Saturn rings
            skills: { type: 'star-glow', speed: 0.2, color: '#64c8ff' }, // Plasma
            projects: { type: 'galaxy', speed: 0.5, color: '#4b0082' } // Nebula
        };

        // Scroll Handling
        this.scrollY = 0;
        
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Initial Stars
        for(let i=0; i<400; i++) {
            this.stars.push(this.createStar());
        }

        // Start Loop
        this.animate();
        
        // Remove loading screen after a delay
        setTimeout(() => {
            const overlay = document.getElementById('loading-overlay');
            if(overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 1000);
            }
        }, 1500);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createStar() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            z: Math.random() * 2, // Depth
            size: Math.random() * 1.5,
            speed: Math.random() * 0.5 + 0.1
        };
    }

    handleScroll() {
        this.scrollY = window.scrollY;
        
        // Determine current section based on scroll position
        const sectionElements = this.sections.map(id => document.getElementById(id + '-section'));
        
        let activeIndex = 0;
        sectionElements.forEach((el, index) => {
            if (el) {
                const rect = el.getBoundingClientRect();
                // If section is roughly in view (taking up > 1/3 of screen or top is visible)
                if (rect.top < this.height * 0.5 && rect.bottom > this.height * 0.5) {
                    activeIndex = index;
                }
            }
        });

        if (activeIndex !== this.currentSection && !this.isTransitioning) {
            this.triggerTransition(activeIndex);
        }
    }

    triggerTransition(nextIndex) {
        this.isTransitioning = true;
        this.targetSection = nextIndex;
        this.transitionProgress = 0;
        
        // Cinematic Transition Logic
        // We will ramp up 'speed' or change visual style over 1-2 seconds
        
        // Simple tween simulation
        let startTime = Date.now();
        let duration = 1500; // 1.5s transition

        const transitionLoop = () => {
            let now = Date.now();
            let elapsed = now - startTime;
            this.transitionProgress = Math.min(elapsed / duration, 1);

            if (this.transitionProgress < 1) {
                requestAnimationFrame(transitionLoop);
            } else {
                this.currentSection = this.targetSection;
                this.isTransitioning = false;
                this.transitionProgress = 0;
            }
        };
        transitionLoop();
    }

    // --- RENDERERS ---

    renderHome(ctx) {
        // Falling stars (Warp prep)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.stars.forEach(star => {
            // Move stars towards viewer (center expansion) or falling down
            // "Falling stars" -> stars move Y down
            star.y += star.speed * (this.isTransitioning ? 20 : 2); // Speed up on transition
            
            if (star.y > this.height) {
                star.y = 0;
                star.x = Math.random() * this.width;
            }
            
            // Draw trails if transitioning
            if (this.isTransitioning && this.targetSection === 1) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255,255,255,${0.5 * this.transitionProgress})`;
                ctx.lineWidth = star.size;
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(star.x, star.y - 50 * this.transitionProgress);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    renderAbout(ctx) {
        // Mars Environment: Reddish dust
        // If transitioning from Home, we fade in red overlay
        
        // Draw background gradient
        let opacity = (this.currentSection === 1) ? 1 : (this.targetSection === 1 ? this.transitionProgress : 0);
        if (this.currentSection === 1 && this.isTransitioning) opacity = 1 - this.transitionProgress; // Fading out

        if (opacity > 0) {
            const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
            gradient.addColorStop(0, `rgba(50, 10, 5, ${opacity})`);
            gradient.addColorStop(1, `rgba(100, 30, 10, ${opacity})`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, this.width, this.height);
            
            // Dust particles
            ctx.fillStyle = `rgba(200, 100, 50, ${opacity * 0.5})`;
            this.stars.forEach(star => {
                let x = (star.x + Date.now() * 0.01 * star.speed) % this.width;
                ctx.beginPath();
                ctx.arc(x, star.y, star.size * 0.8, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }

    renderBackground(ctx) {
        // Saturn Rings
        // Visualized as arcs/ellipses
        let opacity = (this.currentSection === 2) ? 1 : (this.targetSection === 2 ? this.transitionProgress : 0);
        if (this.currentSection === 2 && this.isTransitioning) opacity = 1 - this.transitionProgress;

        if (opacity > 0) {
             // Deep space bg
            ctx.fillStyle = `rgba(10, 10, 20, ${opacity * 0.9})`;
            ctx.fillRect(0, 0, this.width, this.height);

            // Rings
            ctx.save();
            ctx.translate(this.width * 0.7, this.height * 0.5);
            ctx.rotate(-0.3);
            
            for(let i=1; i<10; i++) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(218, 165, 32, ${opacity * 0.2})`;
                ctx.lineWidth = 2 + Math.sin(Date.now() * 0.001 + i);
                ctx.ellipse(0, 0, 200 + i*30, 40 + i*5, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Planet Body (Silhouette)
            ctx.beginPath();
            ctx.fillStyle = `rgba(180, 140, 50, ${opacity * 0.3})`;
            ctx.arc(0, 0, 150, 0, Math.PI * 2);
            ctx.fill();

            // Asteroids (Transition Effect from About)
            if (this.isTransitioning && this.targetSection === 2) {
                // Draw flying rocks
                ctx.fillStyle = '#888';
                for(let i=0; i<10; i++) {
                    let ax = (Date.now() * (i+1)) % this.width - this.width/2;
                    let ay = (Date.now() * (i+1)) % this.height - this.height/2;
                    ctx.fillRect(ax, ay, 10, 10);
                }
            }

            ctx.restore();
        }
    }

    renderSkills(ctx) {
        // Inside a Star
        let opacity = (this.currentSection === 3) ? 1 : (this.targetSection === 3 ? this.transitionProgress : 0);
        if (this.currentSection === 3 && this.isTransitioning) opacity = 1 - this.transitionProgress;

        if (opacity > 0) {
            // Bright Plasma Background
            const gradient = ctx.createRadialGradient(this.width/2, this.height/2, 10, this.width/2, this.height/2, this.width);
            gradient.addColorStop(0, `rgba(255, 255, 200, ${opacity * 0.3})`);
            gradient.addColorStop(1, `rgba(255, 100, 50, ${opacity * 0.1})`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, this.width, this.height);
            
            // Fire/Plasma particles
            ctx.fillStyle = `rgba(255, 200, 100, ${opacity * 0.4})`;
            this.stars.forEach(star => {
                 let offset = Math.sin(Date.now() * 0.005 + star.x);
                 ctx.beginPath();
                 ctx.arc(star.x, star.y + offset * 10, star.size * 2, 0, Math.PI*2);
                 ctx.fill();
            });
        }
    }

    renderProjects(ctx) {
        // Galaxy / Nebula
        let opacity = (this.currentSection === 4) ? 1 : (this.targetSection === 4 ? this.transitionProgress : 0);
        if (this.currentSection === 4 && this.isTransitioning) opacity = 1 - this.transitionProgress;

        if (opacity > 0) {
            // Deep Purple/Blue Nebula
            ctx.fillStyle = `rgba(10, 0, 20, ${opacity})`;
            ctx.fillRect(0, 0, this.width, this.height);

            // Nebula Clouds (simulated with large soft circles)
            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = `rgba(75, 0, 130, ${opacity * 0.3})`;
            ctx.beginPath();
            ctx.arc(this.width * 0.2, this.height * 0.3, 300, 0, Math.PI*2);
            ctx.fill();

            ctx.fillStyle = `rgba(0, 0, 200, ${opacity * 0.3})`;
            ctx.beginPath();
            ctx.arc(this.width * 0.8, this.height * 0.7, 400, 0, Math.PI*2);
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';

            // Galaxy Swirl (Black Hole Transition effect)
            if (this.isTransitioning && this.targetSection === 4) {
                 // Distortion/Suction effect logic would be complex here, 
                 // just doing a fade for simplicity + spiral lines
                 ctx.save();
                 ctx.translate(this.width/2, this.height/2);
                 ctx.rotate(Date.now() * 0.01);
                 ctx.strokeStyle = `rgba(255,255,255, ${this.transitionProgress})`;
                 for(let i=0; i<20; i++) {
                     ctx.beginPath();
                     ctx.arc(0, 0, i * 20 * (1-this.transitionProgress), 0, Math.PI * 2);
                     ctx.stroke();
                 }
                 ctx.restore();
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Base Starfield (Always visible but dimmed in some sections)
        if (this.currentSection === 0 || this.targetSection === 0) {
            this.renderHome(this.ctx);
        }
        
        // Layer other sections
        this.renderAbout(this.ctx);
        this.renderBackground(this.ctx);
        this.renderSkills(this.ctx);
        this.renderProjects(this.ctx);

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize on load
window.addEventListener('load', () => {
    new SpaceJourney();
});

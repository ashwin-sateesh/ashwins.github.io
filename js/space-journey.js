/**
 * SpaceEngine - Three.js + GSAP Space Journey
 * Handles continuous particle system with state-based cinematic transitions.
 */

class SpaceEngine {
    constructor() {
        this.canvas = document.getElementById('space-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.clock = new THREE.Clock();
        
        // Configuration
        this.particleCount = 3000;
        this.baseSpeed = 0.5;
        
        // State variables driven by GSAP
        this.state = {
            warpFactor: 0,       // 0 = normal, 1 = streaked lines
            color: new THREE.Color(0xffffff),
            dispersion: 0,       // 0 = random cube, 1 = ring/shape
            ringForm: 0,         // 0 = no ring, 1 = saturn ring
            galaxyForm: 0,       // 0 = no galaxy, 1 = spiral/nebula
            blackHole: 0,        // 0 = no black hole, 1 = suck in
            turbulence: 0,       // Dust/Heat haze movement
            timeScale: 1.0       // Global speed multiplier
        };

        // Store initial random positions to morph back to
        this.initialPositions = [];
        
        this.init();
    }

    init() {
        this.setupThree();
        this.createParticles();
        this.setupGSAP();
        this.setupEvents();
        this.animate();
        
        // Remove loader
        const loader = document.getElementById('loading-overlay');
        if(loader) {
            gsap.to(loader, { opacity: 0, duration: 1, onComplete: () => loader.remove() });
        }
    }

    setupThree() {
        this.scene = new THREE.Scene();
        // Fog for depth fading
        this.scene.fog = new THREE.FogExp2(0x000000, 0.0005);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.z = 100;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const randoms = new Float32Array(this.particleCount * 3); // For noise/turbulence

        const color = new THREE.Color();

        for (let i = 0; i < this.particleCount; i++) {
            // Spread particles in a large tunnel
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            
            this.initialPositions.push({x, y, z});

            // randoms for noise
            randoms[i * 3] = Math.random();
            randoms[i * 3 + 1] = Math.random();
            randoms[i * 3 + 2] = Math.random();

            // Initial White
            color.setHex(0xffffff);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));

        // Custom Shader Material for performant morphing and sizing
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xffffff) },
                warpFactor: { value: 0 },
                blackHoleFactor: { value: 0 },
                globalOpacity: { value: 1.0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 aRandom;
                varying vec3 vColor;
                uniform float time;
                uniform float warpFactor;
                uniform float blackHoleFactor;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;

                    // Warp Drive Effect (Stretch Z)
                    // If warpFactor > 0, trailing effect is simulated by scaling size in fragment or just moving points?
                    // Actual warp: we move camera fast, but visual streak:
                    // Here we just handle position. Real streaks need LINE primitives or geometry shader, 
                    // but for particles, we can just stretch the Z motion.

                    // Continuous Forward Flight logic is handled in JS updatePosition usually, 
                    // but let's pass modified positions from JS.
                    
                    // Black Hole Suck-in
                    if (blackHoleFactor > 0.0) {
                        // Spiral towards center
                        float dist = length(pos);
                        float angle = atan(pos.y, pos.x);
                        float spiral = blackHoleFactor * 10.0;
                        
                        // Pull in
                        pos = mix(pos, vec3(0.0), blackHoleFactor * 0.8);
                        
                        // Rotate
                        float s = sin(time * 2.0 + dist * 0.01);
                        float c = cos(time * 2.0 + dist * 0.01);
                        float newX = pos.x * c - pos.y * s;
                        float newY = pos.x * s + pos.y * c;
                        pos.x = newX;
                        pos.y = newY;
                    }

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    
                    // Size attenuation + Warp stretching simulated by size
                    // When warping, nearby stars get bigger/longer
                    float warpSize = size * (1.0 + warpFactor * 10.0 * (sin(pos.z * 0.1 + time) + 1.0));
                    
                    gl_PointSize = warpSize * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 color;
                uniform float globalOpacity;
                varying vec3 vColor;
                
                void main() {
                    // Circular particle
                    vec2 coord = gl_PointCoord - vec2(0.5);
                    if(length(coord) > 0.5) discard;
                    
                    // Soft edge
                    float strength = 1.0 - (length(coord) * 2.0);
                    strength = pow(strength, 1.5);

                    gl_FragColor = vec4(color * vColor, strength * globalOpacity);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    setupGSAP() {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        // Define Section Timelines using GSAP
        // We update 'this.state' and the render loop reacts to it
        
        // 1. Home -> About (Warp -> Mars)
        ScrollTrigger.create({
            trigger: "#home-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
                // Warp effect on scroll out
                this.state.warpFactor = self.progress;
            }
        });

        // Entering About: Transition to Mars Red + Dust
        ScrollTrigger.create({
            trigger: "#about-section",
            start: "top center",
            end: "bottom center",
            scrub: 1,
            onEnter: () => {
                gsap.to(this.state.color, { r: 0.88, g: 0.48, b: 0.34, duration: 1 }); // #e27b58
                gsap.to(this.state, { turbulence: 1, duration: 2 });
            },
            onLeaveBack: () => {
                gsap.to(this.state.color, { r: 1, g: 1, b: 1, duration: 1 });
                gsap.to(this.state, { turbulence: 0, duration: 1 });
            }
        });

        // About -> Background (Mars -> Saturn)
        ScrollTrigger.create({
            trigger: "#background-section",
            start: "top bottom",
            end: "center center",
            scrub: 1,
            onEnter: () => {
                // Morph to Rings
                gsap.to(this.state, { ringForm: 1, duration: 2, ease: "power2.inOut" });
                gsap.to(this.state.color, { r: 0.85, g: 0.64, b: 0.12, duration: 2 }); // Gold
            },
            onLeaveBack: () => {
                gsap.to(this.state, { ringForm: 0, duration: 2 });
                gsap.to(this.state.color, { r: 0.88, g: 0.48, b: 0.34, duration: 1 });
            }
        });

        // Skills (Plasma/Star)
        ScrollTrigger.create({
            trigger: "#skills-section",
            start: "top bottom",
            end: "center center",
            scrub: 1,
            onEnter: () => {
                // Reset ring, go chaos/bloom
                gsap.to(this.state, { ringForm: 0, turbulence: 2, duration: 2 });
                gsap.to(this.state.color, { r: 1.0, g: 0.8, b: 0.0, duration: 1 }); // Plasma Yellow
            },
            onLeaveBack: () => {
                gsap.to(this.state, { ringForm: 1, turbulence: 0, duration: 2 });
                gsap.to(this.state.color, { r: 0.85, g: 0.64, b: 0.12, duration: 2 });
            }
        });

        // Projects (Black Hole -> Nebula)
        ScrollTrigger.create({
            trigger: "#projects-section",
            start: "top bottom",
            end: "center center",
            scrub: 1,
            onEnter: () => {
                // Trigger Suck-in then explode to nebula
                const tl = gsap.timeline();
                tl.to(this.state, { blackHole: 1, duration: 0.5 }) // Suck in
                  .to(this.state, { blackHole: 0, galaxyForm: 1, duration: 1, ease: "elastic.out(1, 0.5)" }); // Explode
                
                gsap.to(this.state.color, { r: 0.3, g: 0.0, b: 0.5, duration: 2 }); // Nebula Purple
            },
            onLeaveBack: () => {
                 gsap.to(this.state, { galaxyForm: 0, blackHole: 0, duration: 1 });
                 gsap.to(this.state.color, { r: 1.0, g: 0.8, b: 0.0, duration: 1 });
            }
        });
        
        // Navigation Click Handling
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                gsap.to(window, { duration: 1.5, scrollTo: targetId, ease: "power3.inOut" });
            });
        });
    }

    setupEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        // Update Shader Uniforms
        if (this.particles.material.uniforms) {
            this.particles.material.uniforms.time.value = time;
            this.particles.material.uniforms.color.value.copy(this.state.color);
            this.particles.material.uniforms.warpFactor.value = this.state.warpFactor;
            this.particles.material.uniforms.blackHoleFactor.value = this.state.blackHole;
        }

        // CPU-side Particle Physics for Morphology
        const positions = this.particles.geometry.attributes.position.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            let x = positions[i*3];
            let y = positions[i*3+1];
            let z = positions[i*3+2];
            
            // 1. Basic Forward Flight (z-movement)
            // If in warp, move faster
            let speed = this.baseSpeed * (1 + this.state.warpFactor * 20);
            
            if (this.state.ringForm < 0.5 && this.state.galaxyForm < 0.5) {
                z += speed * 5; 
                if (z > 1000) z = -1000;
            }

            // 2. Morphing Logic
            // Interpolate towards target shape based on state factors
            
            // Default Position (Random Cloud)
            const ix = this.initialPositions[i].x;
            const iy = this.initialPositions[i].y;
            // We keep z dynamic for flight
            
            // Target: Ring (Saturn)
            // Form a flat disk
            if (this.state.ringForm > 0) {
                const angle = i * 0.1;
                const radius = 300 + Math.random() * 200;
                const tx = Math.cos(angle) * radius;
                const ty = (Math.random() - 0.5) * 20; // Flat Y
                const tz = Math.sin(angle) * radius; // Circle in XZ
                
                // LERP
                x += (tx - x) * 0.05 * this.state.ringForm;
                y += (ty - y) * 0.05 * this.state.ringForm;
                z += (tz - z) * 0.05 * this.state.ringForm;
                
                // Rotate the whole ring slowly
                const rot = time * 0.2;
                const rx = x * Math.cos(rot) - z * Math.sin(rot);
                const rz = x * Math.sin(rot) + z * Math.cos(rot);
                x = rx;
                z = rz;
            }
            
            // Target: Galaxy (Nebula)
            else if (this.state.galaxyForm > 0) {
                 // Spiral arms
                 const angle = i * 0.02 + time * 0.1;
                 const radius = i * 0.1 + 100;
                 const tx = Math.cos(angle) * radius;
                 const ty = (Math.random() - 0.5) * 200; 
                 const tz = Math.sin(angle) * radius;
                 
                 x += (tx - x) * 0.03;
                 y += (ty - y) * 0.03;
                 z += (tz - z) * 0.03;
            }
            
            // Turbulence (Mars/Skills)
            if (this.state.turbulence > 0) {
                x += (Math.random() - 0.5) * this.state.turbulence * 2;
                y += (Math.random() - 0.5) * this.state.turbulence * 2;
            }

            // Apply Back
            positions[i*3] = x;
            positions[i*3+1] = y;
            positions[i*3+2] = z;
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
    new SpaceEngine();
});

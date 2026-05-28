/**
 * Vivek Gupta - Interactive Particle Canvas Background
 * A high-performance canvas particle network that reacts to mouse events and theme toggling.
 */

class ParticleNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 120 };
        this.resizeTimeout = null;
        
        // Configuration
        this.maxParticles = 80;
        this.connectionDistance = 100;
        this.theme = 'dark';
        
        // Colors mapping by theme
        this.themeColors = {
            dark: {
                particle: 'rgba(6, 182, 212, 0.4)',     // Cyan
                particleAlt: 'rgba(139, 92, 246, 0.35)', // Purple
                line: 'rgba(6, 182, 212, 0.08)'
            },
            light: {
                particle: 'rgba(37, 99, 235, 0.25)',    // Deep Blue
                particleAlt: 'rgba(124, 58, 237, 0.2)', // Violet
                line: 'rgba(37, 99, 235, 0.05)'
            }
        };

        this.init();
    }

    init() {
        this.setCanvasSize();
        this.detectTheme();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    setCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Adjust particle density based on screen width
        if (window.innerWidth < 768) {
            this.maxParticles = 35;
            this.connectionDistance = 75;
        } else if (window.innerWidth < 1200) {
            this.maxParticles = 60;
            this.connectionDistance = 90;
        } else {
            this.maxParticles = 80;
            this.connectionDistance = 110;
        }
    }

    detectTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        this.theme = currentTheme;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.maxParticles; i++) {
            const size = Math.random() * 2.5 + 1;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const speedX = (Math.random() - 0.5) * 0.45;
            const speedY = (Math.random() - 0.5) * 0.45;
            const isAltColor = Math.random() > 0.6; // 40% will have the alternative color
            
            this.particles.push({
                x,
                y,
                size,
                speedX,
                speedY,
                isAltColor
            });
        }
    }

    bindEvents() {
        // Track mouse movements
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Clear mouse when it leaves the window
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        // Resize window throttle
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.setCanvasSize();
                this.createParticles();
            }, 200);
        });

        // Observe theme toggling
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.detectTheme();
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const colors = this.themeColors[this.theme] || this.themeColors.dark;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Move particle
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Bounce on wall boundaries
            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.isAltColor ? colors.particleAlt : colors.particle;
            this.ctx.fill();

            // Handle connections between particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.connectionDistance) {
                    // Lines fade out as distance increases
                    const opacity = (1 - dist / this.connectionDistance) * 0.15;
                    this.ctx.strokeStyle = colors.line.replace('0.08', opacity.toString());
                    this.ctx.lineWidth = 0.8;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }

            // Interactive effect with mouse
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.mouse.radius) {
                    // Soft push force away from mouse
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    p.x += Math.cos(angle) * force * 0.8;
                    p.y += Math.sin(angle) * force * 0.8;
                    
                    // Draw light connection to mouse
                    const opacity = (1 - dist / this.mouse.radius) * 0.1;
                    this.ctx.strokeStyle = colors.line.replace('0.08', opacity.toString());
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialise on load
document.addEventListener('DOMContentLoaded', () => {
    new ParticleNetwork('particles-canvas');
});

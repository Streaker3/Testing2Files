const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Matrix rain effect
class Column {
    constructor(x, fontSize) {
        this.x = x;
        this.y = Math.random() * canvas.height;
        this.fontSize = fontSize;
        this.chars = [];
        this.maxLength = Math.floor(Math.random() * 25 + 5);
        this.speed = Math.random() * 2 + 1;
    }

    update() {
        // Add new character
        if (Math.random() > 0.9 && this.chars.length < this.maxLength) {
            this.chars.unshift({
                char: String.fromCharCode(0x30A0 + Math.random() * 96),
                alpha: 1
            });
        }

        // Update position
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = 0;
            this.chars = [];
        }

        // Update characters
        for (let i = 0; i < this.chars.length; i++) {
            this.chars[i].alpha *= 0.95;
        }

        // Remove faded characters
        this.chars = this.chars.filter(char => char.alpha > 0.1);
    }

    draw(color = 'rgba(0, 255, 0, 1)') {
        for (let i = 0; i < this.chars.length; i++) {
            const char = this.chars[i];
            const [r, g, b] = color.match(/\d+/g);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${char.alpha})`;
            ctx.font = `${this.fontSize}px monospace`;
            ctx.fillText(char.char, this.x, this.y - i * this.fontSize);
        }
    }
}

// Create matrix columns
const fontSize = 16;
const columns = [];
for (let x = 0; x < canvas.width; x += fontSize) {
    columns.push(new Column(x, fontSize));
}

// Create different colored matrix effects
class MatrixEffect {
    constructor(color, speed = 1, density = 0.9) {
        this.columns = [];
        this.color = color;
        this.speed = speed;
        this.density = density;
        this.active = false;
        this.initialize();
    }

    initialize() {
        this.columns = [];
        for (let x = 0; x < canvas.width; x += fontSize) {
            this.columns.push(new Column(x, fontSize, this.speed, this.density));
        }
    }

    update() {
        if (!this.active) return;
        
        this.columns.forEach(column => {
            column.update();
            column.draw(this.color);
        });
    }
}

// Create content sections
const contentSections = {
    enter: `
        <h2>Welcome to the System</h2>
        <p>Initializing main sequence...</p>
        <div class="terminal-text"></div>
    `,
    about: `
        <h2>System Information</h2>
        <p>Matrix Protocol v2.0</p>
        <ul>
            <li>Status: Online</li>
            <li>Security: Maximum</li>
            <li>Access: Restricted</li>
        </ul>
    `,
    contact: `
        <h2>Communication Portal</h2>
        <form class="retro-form">
            <input type="text" placeholder="Enter your codename">
            <textarea placeholder="Enter your message"></textarea>
            <button type="button">TRANSMIT</button>
        </form>
    `
};

// Create matrix effects for each section
const matrixEffects = {
    enter: new MatrixEffect('rgb(0, 255, 0)', 1.5, 0.95),    // Classic green, faster
    about: new MatrixEffect('rgb(0, 255, 255)', 1, 0.85),    // Cyan, normal speed
    contact: new MatrixEffect('rgb(255, 128, 0)', 0.8, 0.75) // Orange, slower
};

// Add content container
const contentContainer = document.createElement('div');
contentContainer.className = 'content-container';
contentContainer.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid #0f0;
    padding: 20px;
    z-index: 4;
    display: none;
    max-width: 600px;
    width: 80%;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
`;
document.body.appendChild(contentContainer);

// Add event listeners to menu items
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.textContent.toLowerCase();
        
        // Reset all effects
        Object.values(matrixEffects).forEach(effect => effect.active = false);
        
        // Activate clicked section
        matrixEffects[section].active = true;
        
        // Show content
        contentContainer.innerHTML = contentSections[section];
        contentContainer.style.display = 'block';
        
        // Add typing effect for enter section
        if (section === 'enter') {
            const terminalText = contentContainer.querySelector('.terminal-text');
            typeText(terminalText, 'ACCESS GRANTED... WELCOME TO THE MATRIX');
        }
    });
});

// Add close button to content container
const closeButton = document.createElement('button');
closeButton.textContent = 'X';
closeButton.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: 1px solid #0f0;
    color: #0f0;
    cursor: pointer;
    padding: 5px 10px;
`;
closeButton.addEventListener('click', () => {
    contentContainer.style.display = 'none';
    Object.values(matrixEffects).forEach(effect => effect.active = false);
});
contentContainer.appendChild(closeButton);

// Typing effect function
function typeText(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    const typing = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, speed);
}

// Modify animation loop
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update active matrix effect
    Object.values(matrixEffects).forEach(effect => effect.update());

    requestAnimationFrame(animate);
}

// Add some CSS for the new content
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .retro-form input,
    .retro-form textarea,
    .retro-form button {
        background: rgba(0, 255, 0, 0.1);
        border: 1px solid #0f0;
        color: #0f0;
        padding: 10px;
        margin: 5px 0;
        width: 100%;
        font-family: "Courier New", monospace;
    }
    
    .retro-form button:hover {
        background: #0f0;
        color: #000;
    }
    
    .terminal-text {
        color: #0f0;
        font-family: monospace;
        margin-top: 20px;
        min-height: 20px;
    }
`;
document.head.appendChild(additionalStyles);

// Add retro hover sound effect
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseover', () => {
        const audio = new Audio();
        audio.src = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgA';
        audio.volume = 0.2;
        audio.play().catch(() => {}); // Ignore autoplay restrictions
    });
});

// Start the animation
animate();

// Add glitch effect to title occasionally
setInterval(() => {
    const title = document.querySelector('h1');
    const originalText = title.textContent;
    
    // Create glitch effect
    title.style.textShadow = '2px 2px #ff0000, -2px -2px #0000ff';
    title.style.transform = 'skew(2deg)';
    
    setTimeout(() => {
        title.style.textShadow = '';
        title.style.transform = '';
    }, 100);
}, 3000);

// Add scanline effect
const scanline = document.createElement('div');
scanline.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(0, 255, 0, 0.1);
    pointer-events: none;
    z-index: 3;
    animation: scanline 8s linear infinite;
`;

document.body.appendChild(scanline);

// Add scanline animation to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes scanline {
        0% { top: -50%; }
        100% { top: 100%; }
    }
`;
document.head.appendChild(style); 
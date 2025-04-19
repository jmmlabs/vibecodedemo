const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Ball class
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 8; // Random horizontal velocity
        this.dy = (Math.random() - 0.5) * 8; // Random vertical velocity
        this.mass = radius; // Mass proportional to radius
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        // Draw Star of David on orange ball
        if (this.color === 'orange') {
            this.drawStarOfDavid();
        }
    }

    drawStarOfDavid() {
        const size = this.radius * 0.8;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI / 2); // Rotate 90 degrees
        
        // Draw first triangle
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * Math.cos(Math.PI / 6), size * Math.sin(Math.PI / 6));
        ctx.lineTo(-size * Math.cos(Math.PI / 6), size * Math.sin(Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();
        
        // Draw second triangle
        ctx.beginPath();
        ctx.moveTo(0, size);
        ctx.lineTo(size * Math.cos(Math.PI / 6), -size * Math.sin(Math.PI / 6));
        ctx.lineTo(-size * Math.cos(Math.PI / 6), -size * Math.sin(Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.fill();
        
        ctx.restore();
    }

    update(balls) {
        // Bounce off walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Check collisions with other balls
        for (let ball of balls) {
            if (ball === this) continue;
            
            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.radius + ball.radius) {
                // Collision detected - calculate new velocities
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                // Rotate velocities
                const vx1 = this.dx * cos + this.dy * sin;
                const vy1 = this.dy * cos - this.dx * sin;
                const vx2 = ball.dx * cos + ball.dy * sin;
                const vy2 = ball.dy * cos - ball.dx * sin;

                // Elastic collision
                const finalVx1 = ((this.mass - ball.mass) * vx1 + 2 * ball.mass * vx2) / (this.mass + ball.mass);
                const finalVx2 = ((ball.mass - this.mass) * vx2 + 2 * this.mass * vx1) / (this.mass + ball.mass);

                // Rotate velocities back
                this.dx = finalVx1 * cos - vy1 * sin;
                this.dy = vy1 * cos + finalVx1 * sin;
                ball.dx = finalVx2 * cos - vy2 * sin;
                ball.dy = vy2 * cos + finalVx2 * sin;

                // Move balls apart to prevent sticking
                const overlap = (this.radius + ball.radius - distance) / 2;
                this.x -= overlap * cos;
                this.y -= overlap * sin;
                ball.x += overlap * cos;
                ball.y += overlap * sin;
            }
        }

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

// Create balls with specified colors
const balls = [
    new Ball(100, 100, 20, 'red'),
    new Ball(200, 200, 20, 'blue'),
    new Ball(300, 300, 20, 'green'),
    new Ball(400, 400, 20, 'orange'),
    new Ball(500, 500, 20, 'white'),
    new Ball(150, 150, 20, 'green'),
    new Ball(250, 250, 20, 'green'),
    new Ball(350, 350, 20, 'green'),
    new Ball(450, 450, 20, 'green')
];

// Animation loop
function animate() {
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1e90ff');  // Light blue
    gradient.addColorStop(1, '#00008b');  // Dark blue
    
    // Fill canvas with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    balls.forEach(ball => {
        ball.update(balls);
    });

    requestAnimationFrame(animate);
}

// Start animation
animate(); 
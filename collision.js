const canvas = document.getElementById("canvas");
const restartBtn = document.getElementById("restartBtn");
let ctx = canvas.getContext("2d");

// Ajustar tamaño del canvas
const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;
canvas.style.background = "black"; // Fondo negro

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.originalColor = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed;
        this.dy = (Math.random() > 0.5 ? 1 : -1) * this.speed;
        this.colliding = false; // Estado de colisión
        this.flashDuration = 0; // Duración del "flash" azul
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context, circles) {
        this.draw(context);

        // Actualizar posición
        this.posX += this.dx;
        this.posY += this.dy;

        // Rebotar en los bordes del canvas
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Verificar colisiones con otros círculos
        this.checkCollisions(circles);

        // Manejar el "flash" azul
        if (this.flashDuration > 0) {
            this.flashDuration--;
            if (this.flashDuration === 0) {
                this.color = this.originalColor; // Restaurar color original
            }
        }
    }

    checkCollisions(circles) {
        for (let i = 0; i < circles.length; i++) {
            let other = circles[i];
            if (other !== this) {
                let distX = this.posX - other.posX;
                let distY = this.posY - other.posY;
                let distance = Math.sqrt(distX * distX + distY * distY);

                // Si hay colisión
                if (distance < this.radius + other.radius) {
                    // Cambiar a color azul y establecer duración del "flash"
                    this.color = "#0000FF";
                    other.color = "#0000FF";
                    this.flashDuration = 10; // Duración del "flash"
                    other.flashDuration = 10;

                    // Calcular ángulo de colisión
                    let angle = Math.atan2(distY, distX);

                    // Calcular nuevas direcciones usando el ángulo de colisión
                    let speed1 = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
                    let speed2 = Math.sqrt(other.dx * other.dx + other.dy * other.dy);

                    // Nuevas direcciones después de la colisión
                    this.dx = speed1 * Math.cos(angle);
                    this.dy = speed1 * Math.sin(angle);
                    other.dx = -speed2 * Math.cos(angle);
                    other.dy = -speed2 * Math.sin(angle);
                }
            }
        }
    }
}

// Arreglo para almacenar los círculos
let circles = [];

// Función para comprobar si dos círculos se solapan
function isOverlapping(x, y, radius, circles) {
    for (let circle of circles) {
        let distX = x - circle.posX;
        let distY = y - circle.posY;
        let distance = Math.sqrt(distX * distX + distY * distY);
        if (distance < radius + circle.radius) {
            return true; // Hay superposición
        }
    }
    return false; // No hay superposición
}

// Función para generar círculos sin superposición
function generateCircles(n) {
    circles = [];
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
        let x, y;
        let attempts = 0;
        do {
            x = Math.random() * (window_width - radius * 2) + radius;
            y = Math.random() * (window_height - radius * 2) + radius;
            attempts++;
        } while (isOverlapping(x, y, radius, circles) && attempts < 100);

        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
        let speed = Math.random() * 4 + 1; // Velocidad entre 1 y 5
        let text = `C${i + 1}`; // Etiqueta del círculo
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

// Animación del juego
function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    circles.forEach(circle => {
        circle.update(ctx, circles);
    });
    requestAnimationFrame(animate);
}

// Detectar clics para eliminar círculos
canvas.addEventListener("click", function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    circles = circles.filter(circle => {
        return Math.sqrt((mouseX - circle.posX) ** 2 + (mouseY - circle.posY) ** 2) > circle.radius;
    });
});

// Función para reiniciar el juego
function restartGame() {
    generateCircles(10);
    restartBtn.style.display = "none"; // Ocultar botón al reiniciar
}

// Iniciar juego
generateCircles(10);
animate();

// Evento para reiniciar el juego
restartBtn.addEventListener("click", restartGame);
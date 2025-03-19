const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

// Ajustar tamaño del canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Contador de eliminaciones
let score = 0;

// Lista de círculos
let circles = [];

class Circle {
    constructor(x, radius, color, speed) {
        this.posX = x;
        this.posY = -radius; // Inicia justo arriba del canvas
        this.radius = radius;
        this.color = color;
        this.speed = speed;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();
    }

    update() {
        this.posY += this.speed; // Mover hacia abajo

        // Si el círculo toca el fondo, reiniciar su posición arriba
        if (this.posY - this.radius > canvas.height) {
            this.posY = -this.radius;
            this.posX = Math.random() * (canvas.width - this.radius * 2) + this.radius;
            this.speed = Math.random() * 2 + 1; // Nueva velocidad aleatoria
            this.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Nuevo color aleatorio
        }
    }
}

// Generar círculos iniciales
function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 20 + 20; // Tamaño entre 20 y 40
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        let speed = Math.random() * 2 + 1; // Velocidad entre 1 y 3

        circles.push(new Circle(x, radius, color, speed));
    }
}

// Animar círculos
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => {
        circle.update();
        circle.draw(ctx);
    });
    requestAnimationFrame(animate);
}

// Detectar clics para eliminar círculos
canvas.addEventListener("click", function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    for (let i = circles.length - 1; i >= 0; i--) {
        let circle = circles[i];
        let distance = Math.sqrt((mouseX - circle.posX) ** 2 + (mouseY - circle.posY) ** 2);

        if (distance < circle.radius) {
            circles.splice(i, 1); // Eliminar círculo
            score++; // Aumentar contador
            scoreDisplay.innerHTML = `Eliminados: ${score}`;

            // Agregar un nuevo círculo para mantener la cantidad indefinida
            let radius = Math.random() * 20 + 20;
            let x = Math.random() * (canvas.width - radius * 2) + radius;
            let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            let speed = Math.random() * 2 + 1;
            circles.push(new Circle(x, radius, color, speed));
            
            break;
        }
    }
});

// Iniciar juego
generateCircles(10);
animate();
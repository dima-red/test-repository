export class Snake {
    SNAKE_COLOUR = 'lightgreen';
    SNAKE_BORDER_COLOUR = 'darkgreen';
    
    constructor(snake, ctx, dx, dy) {
        this.snake = snake;
        this.ctx = ctx;
        this.dx = dx;
        this.dy = dy;
    }

    advanceSnake() {
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        this.snake.unshift(head);
        const didEatFood = this.snake[0].x === this.foodX && this.snake[0].y === this.foodY;

        if (didEatFood) {
            this.score += 10;
            this.appWrapper.querySelector('.score').innerHTML = this.score;
            this.createFood();
        } else {
            this.snake.pop();
      }
    }

    drawSnake() {
        this.snake.forEach(part => this.drawSnakePart(part));
    }

    drawSnakePart(snakePart) {
        this.ctx.fillStyle = this.SNAKE_COLOUR;
        this.ctx.strokestyle = this.SNAKE_BORDER_COLOUR;
        this.ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
        this.ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
        this.ctx.lineJoin = "round";
    }
}
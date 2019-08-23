export class Snake {
    SNAKE_COLOUR = 'lightgreen';
    SNAKE_BORDER_COLOUR = 'darkgreen';
    score = 0;
        
    constructor(snake, ctx, dx, dy, appWrapper) {
        this.snake = snake;
        this.ctx = ctx;
        this.dx = dx;
        this.dy = dy;
        this.appWrapper = appWrapper;
    }

    advanceSnake(delta, foodDelta, snakeBody) {
        // console.log({x: this.dx, y: this.dy});
        if(delta) {
            this.dx = delta.x;
            this.dy = delta.y;
        }

        if(foodDelta) {
            this.foodX = foodDelta.foodX;
            this.foodY = foodDelta.foodY;
        }

        if(snakeBody) {
            this.snake = snakeBody;
        }

        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        this.snake.unshift(head);
        const didEatFood = this.snake[0].x === this.foodX && this.snake[0].y === this.foodY;

        if (didEatFood) {
            this.score += 10;
            this.appWrapper.querySelector('.score').innerHTML = this.score;
            return true;
        } else {
            this.snake.pop();
            return false;
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
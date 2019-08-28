import { CELL_SIZE, SNAKE_OFFSET, SNAKE_COLOURS, SNAKE_BORDER_COLOUR } from "../constants/general-constants";

export class Snake {
    changingDirectionFlag = false; 
    dx = null;
    dy = null;
    snake = null;

    constructor(ctx, dx, dy, controls, snakeBodyTemplate, numberOfUser, canvas) {
        this.ctx = ctx;
        this.dx = dx;
        this.dy = dy;
        this.controls = controls;
        this.numberOfUser = numberOfUser;
        this.canvas = canvas;
        this.snake = this.generateSnake(snakeBodyTemplate, numberOfUser);
    }

    generateSnake(snakeTemplate, numberOfUser) {
        const snake = snakeTemplate.map(part => {
            return {
                x: part.x,
                y: part.y - SNAKE_OFFSET * numberOfUser
            }
        });

        return snake;
    }

    advanceSnake(food) {
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        this.snake.unshift(head);

        const didEatFood = this.snake[0].x === food.foodX && this.snake[0].y === food.foodY;

        if (didEatFood) {
            
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
        this.ctx.fillStyle = SNAKE_COLOURS[this.numberOfUser].COLOUR;
        this.ctx.strokestyle = SNAKE_BORDER_COLOUR;
        this.ctx.fillRect(snakePart.x, snakePart.y, CELL_SIZE, CELL_SIZE);
        this.ctx.strokeRect(snakePart.x, snakePart.y, CELL_SIZE, CELL_SIZE);
        this.ctx.lineJoin = "round";
    }

    changeDirection(ev) {
        const { keyCode } = ev;

        if (this.changingDirectionFlag) {
            return;
        }

        this.changingDirectionFlag = true;

        const goingUp = this.dy === -CELL_SIZE;
        const goingDown = this.dy === CELL_SIZE;
        const goingRight = this.dx === CELL_SIZE;
        const goingLeft = this.dx === -CELL_SIZE;

        if (keyCode === this.controls.LEFT_KEY && !goingRight) {
            this.dx = -CELL_SIZE;
            this.dy = 0;
        }

        if (keyCode === this.controls.UP_KEY && !goingDown) {
            this.dx = 0;
            this.dy = -CELL_SIZE;
        }

        if (keyCode === this.controls.RIGHT_KEY && !goingLeft) {
            this.dx = CELL_SIZE;
            this.dy = 0;  
        }

        if (keyCode === this.controls.DOWN_KEY && !goingUp) {
            this.dx = 0;
            this.dy = CELL_SIZE;  
        }
    }

    checkCollisionWithYourself() {
        const collisionWithYourself = {
            user: this.numberOfUser,
            isGameOver: false
        };

        for(let i = 4; i < this.snake.length; i++) {
            if(this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) {
                collisionWithYourself.isGameOver = true;
            }
        }

        return collisionWithYourself;
    }

    checkCollisionWithWall() {
        const hitLeftWall = this.snake[0].x < 0;
        const hitRightWall = this.snake[0].x > this.canvas.width - CELL_SIZE;
        const hitToptWall = this.snake[0].y < 0;
        const hitBottomWall = this.snake[0].y > this.canvas.height - CELL_SIZE;

        return {
            user: this.numberOfUser,
            isGameOver: hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
        }
    }

    resetChangingDirectionFlag() {
        this.changingDirectionFlag = false;
    }
}
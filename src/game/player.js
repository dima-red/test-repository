import { Snake } from "./snake";

export class Player {
    changingDirection = false; 

    constructor(snake, ctx, dx, dy) {
        this.dx = dx;
        this.dy = dy;
        this.snakeInstance = new Snake(snake, ctx, this.dx, this.dy);
        document.addEventListener("keydown", this.changeDirection.bind(this));

    }  

    changeDirection(ev) {
        const { keyCode } = ev;
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

        if (this.changingDirection) {
            return;
        }

        this.changingDirection = true;
        const goingUp = this.dy === -10;
        const goingDown = this.dy === 10;
        const goingRight = this.dx === 10;
        const goingLeft = this.dx === -10;

        if (keyCode === LEFT_KEY && !goingRight) {
            this.dx = -10;
            this.dy = 0;
        }
        if (keyCode === UP_KEY && !goingDown) {
            console.log(this.dx);
            console.log(this.dy);
            this.dx = 0;
            this.dy = -10;
        }
        if (keyCode === RIGHT_KEY && !goingLeft) {
            this.dx = 10;
            this.dy = 0;
        }
        if (keyCode === DOWN_KEY && !goingUp) {
            this.dx = 0;
            this.dy = 10;
        }
    }
}
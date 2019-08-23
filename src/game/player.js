import { Snake } from "./snake";

export class Player {
    changingDirection = false; 
    dx = null;
    dy = null;

    constructor(snake, ctx, dx, dy, appWrapper) {
        this.snake = new Snake(snake, ctx, dx, dy, appWrapper);
        this.dx = dx;
        this.dy = dy;
        
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

            return {x: this.dx, y: this.dy};
            // console.log({x: this.dx, y: this.dy});
        }
        if (keyCode === UP_KEY && !goingDown) {
            this.dx = 0;
            this.dy = -10;

            return {x: this.dx, y: this.dy};
            // console.log({x: this.dx, y: this.dy});
        }
        if (keyCode === RIGHT_KEY && !goingLeft) {
            this.dx = 10;
            this.dy = 0;

            return {x: this.dx, y: this.dy};
            // console.log({x: this.dx, y: this.dy});
        }
        if (keyCode === DOWN_KEY && !goingUp) {
            this.dx = 0;
            this.dy = 10;

            return {x: this.dx, y: this.dy};
            // console.log({x: this.dx, y: this.dy});
        }
    }
}
export class Food {
    FOOD_COLOUR = 'yellow';
    FOOD_BORDER_COLOUR = 'darkred';

    // foodX = null;
    // foodY = null;

    constructor(canvas, ctx, snake1, snake2) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.snake1 = snake1;
        this.snake2 = snake2;
    }



    drawFood() {
        this.ctx.fillStyle = this.FOOD_COLOUR;
        this.ctx.strokestyle = this.FOOD_BORDER_COLOUR;
        this.ctx.fillRect(this.foodX, this.foodY, 10, 10);
        this.ctx.strokeRect(this.foodX, this.foodY, 10, 10);
    }

    randomTen(min, max) {
        return Math.round((Math.random() * (max-min) + min) / 10) * 10;
    }

    createFood() {
        this.foodX = this.randomTen(0, this.canvas.width - 10);
        this.foodY = this.randomTen(0, this.canvas.height - 10);
        this.snake1.forEach(part => {
            const foodIsoNsnake = part.x === this.foodX && part.y === this.foodY;
            
            if (foodIsoNsnake) {
                this.createFood();
            }
        });
        this.snake2.forEach(part => {
            const foodIsoNsnake = part.x === this.foodX && part.y === this.foodY;
            
            if (foodIsoNsnake) {
                this.createFood();
            }
        });

        return {
            foodX: this.foodX,
            foodY: this.foodY
        }
    }
}
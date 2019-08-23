import { Snake } from "./snake";

export class Food extends Snake {
    FOOD_COLOUR = 'yellow';
    FOOD_BORDER_COLOUR = 'darkred';

    foodX = null;
    foodY = null;

    constructor(canvas, ctx) {
        super();
        this.canvas = canvas;
        this.ctx = ctx;
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
        
        return {
            foodX: this.foodX,
            foodY: this.foodY
        }
    }
}
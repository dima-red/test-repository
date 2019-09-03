import { Snake } from "./snake";
import { BOT_MIN_CONTROL_KEY, BOT_MAX_CONTROL_KEY, BOT_CONTROL_BUTTONS, SNAKE_COLOURS } from "../constants/general-constants";

export class Bot extends Snake {
    numberOfUser = null;
    appWrapper = null;
    color = null;

    constructor(numberOfUser, appWrapper) {
        super(numberOfUser, appWrapper);

        this.numberOfUser = numberOfUser;
        this.appWrapper = appWrapper;
        this.controls = BOT_CONTROL_BUTTONS[this.numberOfUser];
        this.canvas = this.appWrapper.querySelector("#field");
        this.ctx = this.canvas.getContext("2d");
        this.color = this.ctx.fillStyle = SNAKE_COLOURS[this.numberOfUser + 1].COLOUR;
    }

    getBotKeyCode() {
        const botKeyCode = Math.round((Math.random() * (BOT_MAX_CONTROL_KEY - BOT_MIN_CONTROL_KEY) + BOT_MIN_CONTROL_KEY));
        
        return botKeyCode;
    }

    isDirectionChanged() {
        const isDirectionChanged = Math.round((Math.random() * (10 - 0) + 0));

        return isDirectionChanged >= 5;
    }

}
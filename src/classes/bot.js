import { Snake } from "./snake";
import { BOT_MIN_CONTROL_KEY, BOT_MAX_CONTROL_KEY, BOT_CONTROL_BUTTONS } from "../constants/general-constants";

export class Bot extends Snake {
    numberOfUser = null;
    appWrapper = null;
    isItRealUser = false;

    constructor(numberOfUser, appWrapper) {
        super(numberOfUser, appWrapper);

        this.numberOfUser = numberOfUser;
        this.appWrapper = appWrapper;
        this.controls = BOT_CONTROL_BUTTONS[this.numberOfUser - 1];

        
    }

    getBotKeyCode() {

        return Math.round((Math.random() * (BOT_MAX_CONTROL_KEY - BOT_MIN_CONTROL_KEY) + BOT_MIN_CONTROL_KEY));
    }

    generateChangingDirection() {
        const changeDirectionValue = Math.round((Math.random() * (10 - 0) + 0));

        return changeDirectionValue >= 5;
    }

    botChangeDirection() {
        const isDirectionChanged = this.generateChangingDirection();

        if (isDirectionChanged) {
            const keyCode = this.getBotKeyCode();
        
            this.changeDirection({
                keyCode
            });
        }
    }
}
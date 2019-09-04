import { Game } from "./game";

export class UIHandler {
    modalsWrapper = document.querySelector(".modals-wrapper");
    appWrapper = document.querySelector(".app-wrapper");
    multiFlag = false;

    constructor() {
        this.modalsWrapper.querySelector(".single-player").addEventListener("click", this.onSinglePlayerBtnClicked.bind(this));
        this.modalsWrapper.querySelector(".multiplayer").addEventListener("click", this.onMultiplayerBtnClicked.bind(this));
        Array.from(this.modalsWrapper.querySelectorAll(".back-btn")).forEach(node => node.addEventListener("click", this.onBackBtnClicked.bind(this)));
        this.modalsWrapper.querySelector(".without-bots").addEventListener("click", this.onWithoutBotsBtnClicked.bind(this));
        this.modalsWrapper.querySelector(".with-one").addEventListener("click", this.onWithOneBotBtnClicked.bind(this));
        this.modalsWrapper.querySelector(".with-two").addEventListener("click", this.onWithTwoBotsBtnClicked.bind(this));
        this.modalsWrapper.querySelector(".with-three").addEventListener("click", this.onWithThreeBotsBtnClicked.bind(this));
        this.modalsWrapper.querySelector(".with-one-user").addEventListener("click", this.onWithOneUserBtnClicked.bind(this));
        this.modalsWrapper.querySelector(".with-two-users").addEventListener("click", this.onWithTwoUsersBtnClicked.bind(this));
    }

    removeModalClass(parent, selector) {
        this.modalsWrapper
            .querySelector(parent)
            .classList.remove(selector);
    }

    addModalClass(parent, selector) {
        this.modalsWrapper
            .querySelector(parent)
            .classList.add(selector);
    }

    removeAppClass(parent, selector) {
        if (parent) {
            this.appWrapper
                .querySelector(parent)
                .classList.remove(selector)
        } else {
            this.appWrapper
                .classList.remove(selector)
        }
        
    }

    onWithOneUserBtnClicked() {
        const amountOfUsers = 2;
        const amountOfBots = 0;

        this.removeModalClass(".multi-settings", "show-modal");
        this.removeAppClass("", "hide");
        this.removeAppClass(".game-settings-wrapper .player-1", "hide");
        this.removeAppClass(".game-settings-wrapper .player-2", "hide");
        
        
        new Game(amountOfUsers, amountOfBots, this.onGameOver);
    }

    onWithTwoUsersBtnClicked() {
        const amountOfUsers = 3;
        const amountOfBots = 0;

        this.removeModalClass(".multi-settings", "show-modal");
        this.removeAppClass("", "hide");
        this.removeAppClass(".game-settings-wrapper .player-1", "hide");
        this.removeAppClass(".game-settings-wrapper .player-2", "hide");
        this.removeAppClass(".game-settings-wrapper .player-3", "hide");
        
        new Game(amountOfUsers, amountOfBots, this.onGameOver);
    }

    onWithoutBotsBtnClicked() {
        const amountOfUsers = 1;
        const amountOfBots = 0;

        this.removeModalClass(".single-settings", "show-modal");
        this.removeAppClass("", "hide");
        this.removeAppClass(".game-settings-wrapper .player-1", "hide");
        
        new Game(amountOfUsers, amountOfBots, this.onGameOver);
    }

    onWithOneBotBtnClicked() {
        const amountOfUsers = 1;
        const amountOfBots = 1;

        this.removeModalClass(".single-settings", "show-modal");
        this.removeAppClass("", "hide");
        this.removeAppClass(".game-settings-wrapper .player-1", "hide");
        this.removeAppClass(".game-settings-wrapper .player-2", "hide");
        
        new Game(amountOfUsers, amountOfBots, this.onGameOver);
    }

    onWithTwoBotsBtnClicked() {
        const amountOfUsers = 1;
        const amountOfBots = 2;

        this.removeModalClass(".single-settings", "show-modal");
        this.removeAppClass("", "hide");
        this.removeAppClass(".game-settings-wrapper .player-1", "hide");
        this.removeAppClass(".game-settings-wrapper .player-2", "hide");
        this.removeAppClass(".game-settings-wrapper .player-3", "hide");
        
        new Game(amountOfUsers, amountOfBots, this.onGameOver);
    }

    onWithThreeBotsBtnClicked() {
        const amountOfUsers = 1;
        const amountOfBots = 3;

        this.removeModalClass(".single-settings", "show-modal");
        this.removeAppClass("", "hide");
        this.removeAppClass(".game-settings-wrapper .player-1", "hide");
        this.removeAppClass(".game-settings-wrapper .player-2", "hide");
        this.removeAppClass(".game-settings-wrapper .player-3", "hide");
        this.removeAppClass(".game-settings-wrapper .player-4", "hide");
        
        new Game(amountOfUsers, amountOfBots, this.onGameOver);
    }

    onSinglePlayerBtnClicked() {
        this.multiFlag = false;
        this.removeModalClass(".initial-state", "show-modal");
        this.addModalClass(".single-settings", "show-modal");
    }

    onMultiplayerBtnClicked() {
        this.multiFlag = true;
        this.removeModalClass(".initial-state", "show-modal");
        this.addModalClass(".multi-settings", "show-modal");
    }

    onBackBtnClicked() {
        if (this.multiFlag) {
            this.removeModalClass(".multi-settings", "show-modal");
            this.addModalClass(".initial-state", "show-modal");
        } else {
            this.removeModalClass(".single-settings", "show-modal");
            this.addModalClass(".initial-state", "show-modal");
        }
    }

    onGameOver() {
        console.log("GAME OVER");    
    }
}
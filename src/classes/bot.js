import { Snake } from "./snake";

export class Bot extends Snake {
    numberOfUser = null;
    appWrapper = null;

    constructor(numberOfUser, appWrapper) {
        super(numberOfUser, appWrapper);

        this.numberOfUser = numberOfUser;
        this.appWrapper = appWrapper;

        console.log(this.numberOfUser);
        console.log(this.appWrapper);
    }
}
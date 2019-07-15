class Product {
    type: string;
    name: string;
    price: number;
    description: string;

    constructor(
        type: string,
        name: string,
        price: number,
        description: string
    ) {
        this.type = type;
        this.name = name;
        this.price = price;
        if (description) {
            this.description = description
        } else {
            this.description = "default description";
        }
    }
}

export class Phone extends Product {
    screenSize: number;
    constructor(el: any) {
        super("phone", el.name, el.price, el.description);
        this.screenSize = el.screenSize;
    }

}

export class IPhone extends Phone {
    OS: string;
    port: string;

    constructor(el) {
        super(el);
        this.OS = el.OS;
        if(el.port) {
            this.port = el.port;
        } else {
            this.port = "lightning";
        }
    }
}

export class Android extends Phone {
    OS: string;
    port: string;

    constructor(el) {
        super(el);
        this.OS = el.OS;
        if(el.port) {
            this.port = el.port;
        } else {
            this.port = "USB-C";
        }
    }
}

export class TV extends Product {
    resolution: string;
    constructor(el: any) {
        super("TV", el.name, el.price, el.description);
        this.resolution = el.resolution;
    }
}

export class Tablet extends Product {
    battery: number;
    constructor(el: any) {
        super("tablet", el.name, el.price, el.description);
        this.battery = el.battery;
    }
}

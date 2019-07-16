export class Product {
    private type: string;
    private name: string;
    private price: number;
    private description: string;

    constructor(
        type: string,
        name: string,
        price: number,
        description: string
    ) {
        this.type = type;
        this.name = name;
        this.price = price;
        this.description = description || "default description";
    }

    print(): void {
        console.warn(`Name: ${this.name}`);

        console.log(`Type: ${this.type}`);
        console.log(`Price: ${this.price}$`);
        console.log(`Description: ${this.description}`);
    }
}

export class Phone extends Product {
    private screenSize: number;

    constructor(el: any) {
        super("phone", el.name, el.price, el.description);
        this.screenSize = el.screenSize;
    }

    print(): void {
        super.print();
        console.log(`Screen Size: ${this.screenSize}"`);
    }

}

export class IPhone extends Phone {
    private OS: string;
    private port: string;

    constructor(el) {
        super(el);
        this.OS = el.OS;
        this.port = el.port || 'lightning';
    }

    print(): void {
        super.print();
        console.log(`Operation System: ${this.OS}`);
        console.log(`Battery Port: ${this.port}`);
    }
}

export class Android extends Phone {
    private OS: string;
    private port: string;

    constructor(el) {
        super(el);
        this.OS = el.OS;
        this.port = el.port || "USB-C";
    }

    print(): void {
        super.print();
        console.log(`Operation System: ${this.OS}`);
        console.log(`Battery Port: ${this.port}`);
    }
}

export class TV extends Product {
    private resolution: string;

    constructor(el: any) {
        super("TV", el.name, el.price, el.description);
        this.resolution = el.resolution;
    }

    print(): void {
        super.print();
        console.log(`Display Resolution: ${this.resolution}px`);
    }
}

export class Tablet extends Product {
    private battery: number;
    
    constructor(el: any) {
        super("tablet", el.name, el.price, el.description);
        this.battery = el.battery;
    }

    print(): void {
        super.print();
        console.log(`Battery: ${this.battery}MaH`);
    }
}

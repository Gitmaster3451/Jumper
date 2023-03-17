class Transform {
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
    }
}

//Vector2 stores two values X and Y for easier use
class Vector2 {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    //Function to create a standard vector2
    static zero() {
        return new Vector2(0, 0)
    }

    //Linear interpolation between two vectors 
    static lerp(a, b, t) {
        return new Vector2(MathF.lerp(a.x, b.x, t), MathF.lerp(a.y, b.y, t));
    }

    //Clamps a vector2 between to vector2's
    static clamp(value, a, b) {
        return new Vector2(MathF.clamp(value.x, a.x, b.x), MathF.clamp(value.y, a.y, b.y))
    }

    //Under here are a couple simple math functions

    static add(a, b) {
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    static subtract(a, b) {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    static multiply(a, b) {
        return new Vector2(a.x * b.x, a.y * b.y);
    }
}

//Class to easily use the mouse
class Mouse {    
    constructor() {
        this.x = null;
        this.y = null;
        this.pressed = false;

        // Bind event listener functions to the Mouse instance
        this.onMouseUpdate = this.onMouseUpdate.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);

        document.addEventListener('mousemove', this.onMouseUpdate, false);
        document.addEventListener('mouseenter', this.onMouseUpdate, false);
        document.addEventListener('mousedown', this.onMouseDown, false)
    }

    //Updates the mouse location so it can be returned
    onMouseUpdate(e) {
        this.x = e.clientX;
        this.y = e.clientY;
    }

    //If the mouse is pressed down gets the 
    onMouseDown(e) {
        this.x = e.clientX;
        this.y = e.clientY;
        this.pressed = true;
    }

    //Resets the pressed values
    reset() {
        this.pressed = false;
    }

    //Gets the mouse position
    getMouse() {
        return new Vector2(this.x, this.y);
    }

    //Gets if the button is pressed down or not
    getPressed() {
        return this.pressed;
    }
}

//Math class creating some good to have functions
class MathF {
    //Linear lerp from value A, to value B, using T
    static lerp(a, b, t) {
        return a + (b - a) * t
    }
    
    //Clamps the value between two values
    static clamp(value, a, b) {
        return value <= a ? a : value >= b ? b : value;
    }

    //Makes value always positive
    static abs(value) {
        return value < 0 ? value * -1 : value;
    }

    //Converts decimal (range from 255 to 0)
    static DecimalToHex(value) {
        value = MathF.clamp(value, 0, 255);
        return this.binaryToHex(this.convertToBinary(value));
    }

    //Converts decimal to binary
    static convertToBinary(value) {
        let binary = 0;
        let rem; 
        let i = 1;
        while (value != 0) {
            rem = value % 2;
            value = parseInt(value / 2);
            binary = binary + rem * i;
            i = i * 10;
        }
        return binary.toString().padStart(8, "0");
    }

    //Converts binary (8 bit) to hex
    static binaryToHex(string = "") {
        let splitted = string.split("");
        let sum;
        let ans = "";
        sum = splitted[0] * 8;
        sum += splitted[1] * 4;
        sum += splitted[2] * 2;
        sum += splitted[3] * 1;

        ans += this.numberToHex(sum);

        sum = 0;
        sum += parseInt(splitted[4]) * 8;
        sum += parseInt(splitted[5]) * 4;
        sum += parseInt(splitted[6]) * 2;
        sum += parseInt(splitted[7]) * 1;

        ans += this.numberToHex(sum);
        
        return ans;
    }

    //Converts a number to hex (0 to 15)
    static numberToHex(sum) {
        sum = MathF.clamp(sum, 0, 15)
        if(sum > 9) {
            if(sum == 10) return "A";
            if(sum == 11) return "B";
            if(sum == 12) return "C";
            if(sum == 13) return "D";
            if(sum == 14) return "E";
            if(sum == 15) return "F";
        } else {
            return sum;
        }
    }
}

class Random {
    //Normal math.random
    static value() {
        return Math.random();
    }

    //Returns a random value between a range
    static range(min, max) {
        return Math.random() * (max - min) + min;
    }

    //Returns a random int value between a range
    static rangeInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    toHex() {
        return "#"+Color.RGBtoHex(this.r, this.g, this.b);
    }

    static RGBtoHex(r, g, b) {
        return MathF.DecimalToHex(Math.floor(r))+MathF.DecimalToHex(Math.floor(g))+MathF.DecimalToHex(Math.floor(b))
    }

    static rgb(r, g, b) {
        return "#"+this.RGBtoHex(r, g, b);
    }

    static Lerp(a = new Color(), b = new Color(), t = 0) {
        return new Color(MathF.lerp(Math.floor(a.r), Math.floor(b.r), t), MathF.lerp(Math.floor(a.g), Math.floor(b.g), t), MathF.lerp(Math.floor(a.b), Math.floor(b.b), t));
    }
}

class ArrayF {
    static pop(array, item) {
        var index = array.indexOf(item);
        if (index > -1) { // only splice array when item is found
            array.splice(index, 1); // 2nd parameter means remove one item only
        }
        return array;
    }
}

//Time class
class Time {
    static deltaTime = 0;
    static now = Date.now();
    static prev = Date.now();

    //Will take the time now, subtracting the previous updates time to get the ms between the updates
    static getDeltaTime() {
        this.now = Date.now();
        this.deltaTime = (this.now - this.prev) / 1000;
        this.prev = this.now;
    }
}
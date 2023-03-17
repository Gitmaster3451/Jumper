
let canvas;
let ctx;
let mouse;

class Camera {
    constructor(pos) {
        this.pos = pos==null ? Vector2.zero() : pos;
    }
}

//Selected camera
camera = new Camera();

class Engine {
    //All the shapes
    shapes = [];
    ui = [];
    
    //Storing functions
    updates = [];
    lateUpdates = [];
    keydowns = [];
    mousePress = [];
    mouseMove = [];

    keysPressed = [];
    
    lastMousePos = new Vector2(0, 0);


    settings = {
        fullscreen: false,
        fps_ms: 0,
        backgroundColor: "#fff",
    }
    
    constructor(id, width, height, fps, fullscreen = false) {
        canvas = document.getElementById(id);
        ctx = canvas.getContext("2d");
        mouse = new Mouse();

        camera = new Camera();
        
        //sets the width and height -- fullscreen overrites this
        canvas.height = height;
        canvas.width = width;
        
        this.settings.fullscreen = fullscreen;

        this.settings.backgroundColor = "#000";

        if(this.settings.fullscreen) {
            ctx.canvas.width  = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
        }
        
        //Starting loop
        this.settings.fps_ms = 1 / fps * 1000
        setInterval(() => {
            this.update();
        }, this.settings.fps_ms);

        this.onKeyDown.bind(this);
        this.onKeyUp.bind(this);
        
        document.onkeydown = (e) => {
            this.onKeyDown(e.key);
        };

        document.onkeyup = (e) => {
            this.onKeyUp(e.key);
        }
    }
    
    addShape(shape = new Shape(Vector2.zero(),Vector2.zero(),"#000",null)) {
        this.shapes.push(shape);
        return shape
    }

    removeShape(shape = new Shape()) {
        ArrayF.pop(this.shapes, shape);
    }

    addUIShape(shape = new Shape(Vector2.zero(),Vector2.zero(),"#000",null)) {
        this.ui.push(shape);
        return shape
    }
    
    fireMousePress(x, y) {
        this.ui.forEach(e => {
            if(e.active) {
                e.mousePress(x, y);
            }
        });
    }
    
    fireMouseMove(x, y) {
        this.ui.forEach(e => {
            if(e.active) {
                e.mouseMove(x, y);
            }
        });
    }
    
    bindUpdate(func = function(){}) {
        this.updates.push(func);
    }
    
    fireUpdates() {
        for(let i = 0; i < this.updates.length; i++) {
            this.updates[i]();
        }
    }
    
    bindLateUpdate(func = function(){}) {
        this.lateUpdates.push(func);
    }
    
    fireLateUpdates() {
        for(let i = 0; i < this.lateUpdates.length; i++) {
            this.lateUpdates[i]();
        }
    }
    
    bindKeydown(func = function(){}) {
        this.keydowns.push(func);
    }

    onKeyDown(key) {
        this.keysPressed[key] = true;
    }

    onKeyUp(key) {
        this.keysPressed[key] = false;
    }

    getArrayFromTag(tag = "") {
        var a = []
        this.shapes.forEach(e => {
            if(e.tag == tag) a.push(e);
        });
        return a;
    }
    
    update() {
        Time.getDeltaTime();
        
        if(this.settings.fullscreen) {
            ctx.canvas.width  = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
        }
        
        if(this.lastMousePos != mouse.getMouse()) {
            var m = mouse.getMouse();
            this.fireMouseMove(m.x, m.y)
        }

        if(mouse.getPressed()) {
            var m = mouse.getMouse();
            this.fireMousePress(m.x, m.y);
        }
        
        this.fireUpdates();

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath();
        ctx.fillStyle = this.settings.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        this.shapes.forEach(e => {
            if(e.active) {
                ctx.beginPath();
                e.draw(ctx);
            }
        });

        this.ui.forEach(e => {
            if(e.active) {
                ctx.beginPath();
                e.draw(ctx, true);
            }
        });
        
        this.fireLateUpdates()
        
        mouse.reset();
        
        this.lastMousePos = mouse.getMouse()
    }
}

class Shape {
    constructor(pos = new Vector2.zero(), size = new Vector2.zero(), color = "#fff", element, tag = "", active = true) {
        this.transform = new Transform(pos, size);
        this.color = color;
        this.obj = element;
        this.active = active;

        this.tag = tag;
        
        element.bindShape(this);
    }

    checkCollision(tag) {
        var items = engine.getArrayFromTag(tag);
        var d = null;
        items.forEach(e => {
            if(e.transform.pos.x + e.transform.size.x >= this.transform.pos.x && e.transform.pos.x <= this.transform.pos.x + this.transform.size.x && e.transform.pos.y + e.transform.size.y >= this.transform.pos.y && e.transform.pos.y <= this.transform.pos.y + this.transform.size.y) {
                d = e;
            }
        });
        return d;
    }

    static checkCollision(tag, pos) {
        var items = engine.getArrayFromTag(tag);
        var d = null;
        items.forEach(e => {
            if(e.transform.pos.x + e.transform.size.x >= pos.x && e.transform.pos.x <= pos.x && e.transform.pos.y + e.transform.size.y >= pos.y && e.transform.pos.y <= pos.y) {
                d = e;
            }
        });
        return d;
    }

    mouseMove(x, y) {
        this.obj.mouseMove(x, y, this);
    }
    
    mousePress(x, y) {
        this.obj.mousePress(x, y, this);
    }
    
    draw(ctx, bool = false) {
        this.obj.draw(ctx, this.transform, this.color, bool)
    }
}

class Parent {
    shapes = [];
    active = true;

    constructor() {

    }

    addShape(shape) {
        this.shapes.push(shape)
    }

    removeShape(shape) {
        ArrayF.pop(this.shapes, shape);
    }

    toggle() {
        this.active = !this.active;
        this.shapes.forEach(e => {
            e.active = this.active;
        });
    }
}

class Square {
    shape;
    
    constructor() {
        
    }
    
    bindShape(shape) {
        this.shape = shape;
    }
    
    mouseMove(x, y, shape) {
        
    }
    
    mousePress(x, y, shape) {
        
    }
    
    draw(ctx, transform, color, bool) {
        ctx.fillStyle = color;
        if(!bool)
            ctx.fillRect(transform.pos.x - camera.pos.x, transform.pos.y - camera.pos.y, transform.size.x, transform.size.y);
        else
            ctx.fillRect(transform.pos.x, transform.pos.y, transform.size.x, transform.size.y);
    }
}

class Button {
    shape;
    
    functions = [];
    
    mouseInside = false;
    pressed = false;
    
    constructor(text, font, textColor, hoverColor, pressedColor, func = null) {
        this.text = text;
        this.hoverColor = hoverColor;
        this.pressedColor = pressedColor;
        this.font = font;
        this.textColor = textColor;
        
        if(func != null) this.functions.push(func);
    }
    
    mouseMove(x, y, shape) {
        if(shape == null || !shape.active) return;
        
        if(this.getBoundBox(new Vector2(x, y), shape)) {
            this.mouseInside = true;
        } else {
            this.mouseInside = false;
        }
    }
    
    mousePress(x, y, shape) {
        if(shape == null || !shape.active) return;
        
        if(this.getBoundBox(new Vector2(x, y), shape)) {
            this.fireFunctions();
            this.pressed = true;
            this.timeSincePressed = 0;
        }
    }
    
    bindShape(shape) {
        this.shape = shape;
    }
    
    bindFunction(func) {
        this.functions.push(func);
    }
    
    fireFunctions() {
        for(let i = 0; i < this.functions.length; i++) {
            this.functions[i]();
        }
    }
    
    getBoundBox(e = Vector2.zero(), shape) {
        let pos = shape.transform.pos;
        let size = shape.transform.size;
        if(e.x >= pos.x && e.x <= pos.x + size.x && e.y >= pos.y && e.y <= pos.y + size.y) {
            return true;
        } 
        return false;
    }
    
    timeSincePressed = 0;
    draw(ctx, transform, color, bool) {
        ctx.fillStyle = this.pressed ? this.pressedColor : this.mouseInside ? this.hoverColor : color;
        if(!bool)
            ctx.fillRect(transform.pos.x - camera.pos.x, transform.pos.y - camera.pos.y, transform.size.x, transform.size.y);
        else
            ctx.fillRect(transform.pos.x, transform.pos.y, transform.size.x, transform.size.y);

        ctx.fillStyle = this.textColor;
        ctx.font = this.font;
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, transform.pos.x + transform.size.x / 2, transform.pos.y + transform.size.y / 2);

        if(this.timeSincePressed > 10) {
            this.pressed = false;
        }
        
        this.timeSincePressed++;
    }
}

class UIText {
    shape;

    constructor(text, font) {
        this.text = text;
        this.font = font;
    }

    mouseMove(x, y, shape) {
        
    }
    
    mousePress(x, y, shape) {
        
    }

    bindShape(shape) {
        this.shape = shape;
    }

    draw(ctx, transform, color) {
        ctx.fillStyle = color;
        ctx.font = this.font;
        ctx.textAlign = "left";
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, transform.pos.x, transform.pos.y);

    }
}
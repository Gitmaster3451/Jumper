class Rigidbody {
    constructor(shape, gravity, drag) {
        this.speedX = 0;
        this.speedY = 0;

        this.g = gravity;
        this.d = drag;

        this.shape = shape;

        this.update.bind(this);
    }

    update(tag) {
        this.shape.transform.pos.x += this.speedX;
        this.fixCollisionDirection(this.shape, this.speedX, 0, tag);
        this.shape.transform.pos.y += this.speedY;
        this.fixCollisionDirection(this.shape, 0, this.speedY, tag);

        this.speedY += this.g;

        this.speedX = this.speedX * this.d;
        this.speedY = this.speedY * this.d;
    }

    addForce(force = Vector2.zero()) {
        this.speedY += force.y;
        this.speedX += force.x;
    }

    setForce(force = Vector2.zero()) {
        if(force.x == null) {
            this.speedY = force.y;
        } else if(force.y == null) {
            this.speedX = force.x;
        } else {
            this.speedX = force.x;
            this.speedY = force.y;
        }
    }

    setGravity(value) {
        this.g = value;
    }

    fixCollisionAtPoint(shape, x = 0, y = 0, fixDx = 0, fixDy = 0, tag = "") {
        let pos = shape.transform.pos;
        if(Shape.checkCollision(tag, new Vector2(x, y)) != null) {
            if(fixDx > 0) {
                pos.x -= fixDx;
                this.speedX = 0;
            }
            else if(fixDy > 0) {
                pos.y -= fixDy;
                this.speedY = 0;
            }
            else if(fixDx < 0) {
                pos.x += fixDx + 10;
                this.speedX = 0;
            }
            else if(fixDy < 0) {
                pos.y += fixDy + 10;
                this.speedY = 0;
            }
        }
    }
    
    fixCollisionDirection(shape, dx, dy, tag) {
        let fixDx = dx;
        let fixDy = dy;
        let transform = shape.transform;
        let pos = transform.pos;
        let size = transform.size;
        this.fixCollisionAtPoint(shape, pos.x + size.x, pos.y + size.y / 2, fixDx, fixDy, tag);
        this.fixCollisionAtPoint(shape, pos.x, pos.y + size.y / 2, fixDx, fixDy, tag);
        this.fixCollisionAtPoint(shape, pos.x + size.x / 2, pos.y + size.y, fixDx, fixDy, tag);
        this.fixCollisionAtPoint(shape, pos.x + size.x / 2, pos.y, fixDx, fixDy, tag);
    
        this.fixCollisionAtPoint(shape, pos.x + size.x, pos.y + size.y, fixDx, fixDy, tag);
        this.fixCollisionAtPoint(shape, pos.x + size.x, pos.y, fixDx, fixDy, tag);
        this.fixCollisionAtPoint(shape, pos.x, pos.y + size.y, fixDx, fixDy, tag);
        this.fixCollisionAtPoint(shape, pos.x, pos.y, fixDx, fixDy, tag);
    }
}
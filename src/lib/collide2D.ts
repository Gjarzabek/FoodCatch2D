export class collide2d {

    static collideRectRect(a: any, b: any): boolean {

        if (a.x + a.width >= b.x &&    // r1 right edge past r2 left
            a.x <= b.x + b.width &&    // r1 left edge past r2 right
            a.y + a.height >= b.y &&    // r1 top edge past r2 bottom
            a.y <= b.y + b.height) {    // r1 bottom edge past r2 top
              return true;
        }
        return false;
    };
    
}
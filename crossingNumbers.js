

export class Equation {
    constructor (startingX, startingY, finishingX, finishingY) {
        this.lowerX = startingX;
        this.lowerY = startingY;
        this.upperX = finishingX;
        this.upperY = finishingY;

        this.m = this.calculateM ();
        this.c = this.calculateC ();
    }

    calculateM () {
        let diffY = (this.upperY - this.lowerY);
        let diffX = (this.upperX - this.lowerX);

        return diffY / diffX;
    }

    calculateC () {
        return this.lowerY - (this.m * this.lowerX);
    }

    intercepts (equation, greaterThanX) {
        // this.m x + this.c = equation.m x + equation.c
        // (this.m x - equation.m) x = equation.c - this.c
        // x = (equation.c - this.c) / (this.m x - equation.m)
        let cDiff = equation.c - this.c;
        let mDiff = this.m - equation.m;

        let xCoord = cDiff / mDiff;

        return (xCoord >= greaterThanX && this.within((this.m * xCoord) + this.c, this.lowerY, this.upperY));
    }

    within (value, bound1, bound2) {
        if (bound1 > bound2) {
            return bound2 <= value && bound1 >= value
        } else {
            return bound1 <= value && bound2 >= value
        }
    }
}

export class Ray {
    constructor (xCoord, yCoord, gradient) {
        this.x = xCoord;
        this.y = yCoord;

        this.m = gradient;
        this.c = this.calculateC();
    }

    calculateC () {
        return this.y - (this.m * this.x);
    }

    numberOfIntercepts (equations) {
        let intercepts = equations.map((equation) => equation.intercepts (this, this.x));
        let onlyTrue = intercepts.filter(elem => elem);

        return onlyTrue.length;
    }

    insideShape (polygons) {
        return (this.numberOfIntercepts(polygons) % 2 == 1)
    }
}
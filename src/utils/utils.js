
class Displacement {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const modifyCssLength = (value, operation) => {
    const numValue = CSSNumericValue.parse(value);
    return operation(numValue.value) + numValue.unit;
};

export { Displacement, modifyCssLength };

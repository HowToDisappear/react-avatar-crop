
class Displacement {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const modifyCssLength = (cssText, operation) => {
    let numValue;
    if (!window?.CSSNumericValue) {
        // fallback for Firefox
        const value = cssText.match(/(\d+(\.\d+)?)/g);
        const unit = cssText.match(/[a-zA-Z]+/g);
        numValue = {
            value,
            unit,
        };
    } else {
        numValue = CSSNumericValue.parse(cssText);
    }

    return operation(numValue.value) + numValue.unit;
};

export { Displacement, modifyCssLength };

import { useState, useRef, useEffect } from 'react';


const WheelController = ({ setValue, options }) => {
    useEffect(() => {
        const updateValue = evt => {
            evt.preventDefault();
            setValue(value => (
                Math.min(Math.max(value + evt.deltaY * -(options.sensitivity / 100), options.min), options.max)
            ));
        };
        const node = document.querySelector(".cr-container");
        node.addEventListener('wheel', updateValue);
        return () => node.removeEventListener('wheel', updateValue);
    }, []);
};

export default WheelController;

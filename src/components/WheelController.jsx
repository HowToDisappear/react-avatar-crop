import { useState, useRef, useEffect } from 'react';
import style from '../styles/cropper.css';

const WheelController = ({ setValue, options }) => {
    useEffect(() => {
        const updateValue = evt => {
            evt.preventDefault();
            setValue(value => (
                Math.min(Math.max(value + evt.deltaY * -(options.sensitivity / 100), 0), 100)
            ));
        };
        const node = document.querySelector(`.${style.cr_container}`);
        node.addEventListener('wheel', updateValue);
        return () => node.removeEventListener('wheel', updateValue);
    }, []);
    return null;
};

export default WheelController;

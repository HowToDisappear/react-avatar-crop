import { useEffect } from 'react';

const ButtonsController = ({
    setValue,
    options: { zoomInControl, zoomOutControl, step }
}) => {
    useEffect(() => {
        if (!zoomInControl || !zoomOutControl) {
            return;
        }
        const delta = Math.min(Math.max(step, 1), 10);
        zoomInControl.current.onclick = () => {
            setValue(prev => Math.min(prev + delta, 100));
        };
        zoomOutControl.current.onclick = () => {
            setValue(prev => Math.max(prev - delta, 0));
        };
    }, [setValue, zoomInControl, zoomOutControl, step]);

    return null
};

export default ButtonsController;

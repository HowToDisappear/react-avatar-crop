import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Range from './Range';
import EditArea from './EditArea';
import WheelController from './WheelController';


const Cropper = ({
    file,
    onSave,
    box = {},
    shape = {
        borderRadius: '40%',
        height: '50%',
        width: '50%',
    },
    settings = {},
}) => {
    // const containerRef = useRef(null);
    const [zoom, setZoom] = useState(0);

    const defaultConfig = useMemo(() => ({
        wheelController: true,
        wheelControllerOptions: {
            sensitivity: 5, // 1 to 10
            min: 0,
            max: 100,
        },
    }), []);

    const config = useMemo(() => ({
        ...defaultConfig,
        ...settings,
        wheelControllerOptions: {
            ...defaultConfig.wheelControllerOptions,
            ...(settings.wheelControllerOptions ?? {})
        },
    }), [defaultConfig, settings]);

    if (!file) {
        return null;
    }

    const element = (
        <div className='cr-layer'>
            <div className='cr-edit-layer'>
                <div
                    // ref={containerRef}
                    className='cr-container'
                    style={{ width: box.width }}
                >
                    <EditArea file={file} box={box} shape={shape} zoom={zoom} />
                    <Range value={zoom} setValue={setZoom} />
                    {config.wheelController &&
                        <WheelController
                            setValue={setZoom}
                            options={config.wheelControllerOptions}
                        />}
                </div>
            </div>
        </div>
    );

    // console.log('render');
    return (
        <>
            {createPortal(element, document.body)}
        </>
    );
};

export default Cropper;

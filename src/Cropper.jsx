import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Range from './Range';
import EditArea from './EditArea';


const Cropper = ({
    file,
    onSave,
    box = {},
    shape = {
        borderRadius: '40%',
        height: '50%',
        width: '50%',
    },
}) => {
    const [zoom, setZoom] = useState(0);

    if (!file) {
        return null;
    }

    const element = (
        <div className='cr-layer'>
            <div className='cr-edit-layer'>
                <div
                    className='cr-container'
                    style={{ width: box.width }}
                >
                    <EditArea file={file} box={box} shape={shape} zoom={zoom} />
                    <Range value={zoom} setValue={setZoom} />
                </div>
            </div>
        </div>
    );

    console.log('render');
    return (
        <>
            {createPortal(element, document.body)}
        </>
    );
};

export default Cropper;

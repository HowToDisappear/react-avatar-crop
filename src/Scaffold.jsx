import { useState, useRef, useEffect } from 'react';
import Cropper from './Cropper';


const Scaffold = () => {
    const fileInp = useRef(null);
    const [userFile, setUserFile] = useState(null);

    const [value, setValue] = useState(30);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    console.log('userFile >> ', userFile);
    return (
        <div className="user-wrapper">
            <h3>Your image</h3>
            <label htmlFor='user-btn'>Select an image</label>
            <input
                hidden
                type="file"
                accept="image/*"
                name="avatar"
                ref={fileInp}
                onChange={() => setUserFile(fileInp.current.files[0])}
            />
            {/* user's own button with callback attached */}
            <button
                id='user-btn'
                onClick={() => fileInp.current.click()}
            >
                Select
            </button>

            <div className="user-wrapper-inner">

                <Cropper
                    file={userFile}
                    onSave={croppedFile => null}
                    box={{
                        width: '45vw',
                        height: '35vw',
                    }}
                    shape={{
                        borderRadius: '30%',
                        height: '29vw',
                        width: '29vw',
                    }}
                />
            </div>
        </div>
    );
};

export default Scaffold;

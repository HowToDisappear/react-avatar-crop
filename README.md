# react-avatar-crop
![example1](https://github.com/HowToDisappear/react-avatar-crop/assets/60031509/a8a0350c-ab29-401c-8dc0-c6e9e0ec0ccf)
A lightweight, customizable, non-intrusive image cropper for using on the frontend. Its primary purpose is to enable end users to crop avatar/ profile images that they uploaded via input. With an intuitive design, it ensures a seamless and user-friendly experience.
The package has no external dependencies and has a minimal footprint. It works seamlessly on both desktop and mobile devices, providing a consistent experience across platforms. Cropper requires the consuming project to have React installed.

## Installation
```
npm install react-avatar-crop
```

## Usage

**Basic example**
```JSX
import { Cropper } from 'react-avatar-crop';
import 'react-avatar-crop/css';

...
<Cropper
    file={sourceFile}
    onSave={blob => setTargetFile(blob)}
    saveButton={saveBtnRef}
    box={{
        width: '500px',
        height: '400px',
    }}
    wheelControl
    rangeControl
/>
```

**Elaborate example**
```JSX
import { useState, useRef, useEffect } from 'react';
import { Cropper } from 'react-avatar-crop';
import 'react-avatar-crop/css';

const Example = () => {
    const [sourceFile, setSourceFile] = useState(null);
    const [targetFile, setTargetFile] = useState(null);
    const saveBtnRef = useRef(null);
    const targetImgRef = useRef(null);

    useEffect(() => {
        if (targetFile) {
            targetImgRef.current.src = URL.createObjectURL(targetFile);
        }
    }, [targetFile]);

    return (
        <div>
            <h3>Your avatar</h3>
            <input
                type="file"
                accept="image/*"
                name="avatar"
                onChange={evt => setSourceFile(evt.target.files[0])}
            />
            {Boolean(sourceFile) &&
                <>
                    <Cropper
                        file={sourceFile}
                        onSave={blob => setTargetFile(blob)}
                        saveButton={saveBtnRef}
                        box={{
                            width: '500px',
                            height: '400px',
                        }}
                        wheelControl
                        rangeControl 
                    />
                    <button ref={saveBtnRef}>Save</button>
                </>
            }
            <img
                ref={targetImgRef}
                style={{
                    borderRadius: '50%',
                    display: 'block',
                }}
            />
        </div>
    );
};
```

## API
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| file | blob | yes |  | Input file selected by user |
| onSave | func | yes |  | Handles cropped image blob, e.g. uploads to a server |
| saveButton | ref | yes |  | Ref to a button, onSave will be attached to it |
| box | object | yes |  | Cropper element width and height |
| shape | object |  | `{ borderRadius: '50%' }` | Crop area width, height and border-radius |
| layer | object |  | `{ dim: '40%', dimTransition: '1.5s' }` | Layer around crop area |
| rangeControl | bool \| object |  | `{ color: 'grey' }` | Range widget |
| wheelControl | bool \| object |  | `{ sensitivity: 5 }` | Allows mouse wheel and trackpad zoom |
| pinchZoom | object |  | `{ sensitivity: 3 }` | Allows touch screen devices pinch zoom |
| buttonsControl | object |  | `{ step: 3 }` | Refs to zoomInControl, zoomOutControl and step size (1 to 10) |
| targetImage | object |  | `{ type: 'image/png', quality: 1, preserveOriginalScale: false }` | Config for target image |

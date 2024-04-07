# react-avatar-crop
---
```
A lightweght react avatar cropper.
```

## Installation
`npm install react-avatar-crop`

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
| Name           | Type           | Required | Default                                                       | Description                                                                |
|----------------|----------------|----------|---------------------------------------------------------------|----------------------------------------------------------------------------|
| file           | File           | yes      |                                                               | Input file selected by user                                                |
| onSave         | func           | yes      |                                                               | Handler provided with resulting blob                                       |
| saveButton     | ref            | yes      |                                                               | Ref to a button that will have save handler attached to                    |
| box            | object         | yes      |                                                               | Cropper element width and height                                           |
| shape          | object         |          | {borderRadius: '50%'}                                         | Crop area width, height and border-radius                                  |
| rangeControl   | bool \| object |          | {color: 'grey'}                                               | Range widget bool to include and object provides options such as color     |
| wheelControl   | bool \| object |          | {sensitivity: 5}                                              | Wheel controller to enable and object provides options such as sensitivity |
| buttonsControl | object         |          | {step: 3}                                                     | Refs for zoomInControl, zoomOutControl and step (1 to 10)                  |
| targetImage    | object         |          | {type: 'image/png', quality: 1, preserveOriginalScale: false} | Config for target image                                                    |

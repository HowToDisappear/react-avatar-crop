/** This is used for development only */

import { createRoot } from 'react-dom/client';
import Scaffold from './Scaffold';


const domNode = document.createElement('div');
domNode.setAttribute('id', 'root');
document.body.appendChild(domNode);
const root = createRoot(domNode);

root.render(<Scaffold />);

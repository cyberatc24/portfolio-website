import { createContext } from 'react';

// Shared by app.jsx and extras.jsx so the new sections follow the same Motion switch.
export const MotionContext = createContext(true);
export const EASE = [0.22, 1, 0.36, 1];

// Contact details and links, edited in one place.
export const GITHUB = 'https://github.com/sontakkevipul';
export const GITHUB_HANDLE = 'sontakkevipul';
export const LINKEDIN = 'https://www.linkedin.com/in/vipul-sontakke/';
export const EMAIL = 'sontakke.vipul@gmail.com';
export const RESUME = './Asset/resume/Vipul-Sontakke-Resume.pdf';
export const CERTIFICATES = 'https://drive.google.com/drive/folders/1bQVuTMYclYdglgCrA3RVNqKS1-VQuKTR?usp=drive_link';
export const PHONE = '+91 77748 95018';
// Click sound played on every click. Set to one of the files in Asset/sound/ (for example '3-mechanical-key'),
// or '' for no sound.
export const CLICK_SOUND = '';

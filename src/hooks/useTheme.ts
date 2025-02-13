import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'cupcake' | 'bumblebee' | 'emerald' | 'corporate' | 'synthwave' | 'retro' | 'cyberpunk' | 'valentine' | 'halloween' | 'garden' | 'forest' | 'aqua' | 'lofi' | 'pastel' | 'fantasy' | 'wireframe' | 'black' | 'luxury' | 'dracula' | 'cmyk' | 'autumn' | 'business' | 'acid' | 'lemonade' | 'night' | 'coffee' | 'winter' | 'dim' | 'nord' | 'sunset';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'cupcake' || savedTheme === 'bumblebee' || savedTheme === 'emerald' || savedTheme === 'corporate' || savedTheme === 'synthwave' || savedTheme === 'retro' || savedTheme === 'cyberpunk' || savedTheme === 'valentine' || savedTheme === 'halloween' || savedTheme === 'garden' || savedTheme === 'forest' || savedTheme === 'aqua' || savedTheme === 'lofi' || savedTheme === 'pastel' || savedTheme === 'fantasy' || savedTheme === 'wireframe' || savedTheme === 'black' || savedTheme === 'luxury' || savedTheme === 'dracula' || savedTheme === 'cmyk' || savedTheme === 'autumn' || savedTheme === 'business' || savedTheme === 'acid' || savedTheme === 'lemonade' || savedTheme === 'night' || savedTheme === 'coffee' || savedTheme === 'winter' || savedTheme === 'dim' || savedTheme === 'nord' || savedTheme === 'sunset') {
      return savedTheme;
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate', 'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter', 'dim', 'nord', 'sunset');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme };
} 
export interface Theme {
  name: string;
  colors: {
    [key: string]: string;
  };
}

const tokyoNight: Theme = {
  name: 'Tokyo Night',
  colors: {
    '--color-background': '#1a1b2e',
    '--color-background-secondary': '#16161e',
    '--color-background-tertiary': '#24283b',
    '--color-background-quaternary': '#1f2335',
    '--color-surface': '#292e42',
    '--color-surface-hover': 'rgba(65, 72, 104, 0.5)',
    '--color-border': '#414868',
    '--color-text-primary': '#c0caf5',
    '--color-text-secondary': '#a9b1d6',
    '--color-text-inverted': '#1a1b26',
    '--color-primary': '#7dcfff',
    '--color-secondary': '#ff9e64',
    '--color-tertiary': '#e0af68',
    '--color-success': '#9ece6a',
    '--color-danger': '#f7768e',
    '--color-shadow': 'rgba(0, 0, 0, 0.2)',
    '--color-success-glow': 'rgba(158, 206, 106, 0.6)',
    '--color-danger-glow': 'rgba(247, 118, 142, 0.6)',
    '--color-checkbox-bg': '#3c405c',
    '--color-checkbox-border': '#5a6084',
    '--color-disabled-bg': '#565f89',
  },
};

const solarizedLight: Theme = {
  name: 'Solarized Light',
  colors: {
    '--color-background': '#fdf6e3',
    '--color-background-secondary': '#ffffff',
    '--color-background-tertiary': '#eee8d5',
    '--color-background-quaternary': '#f5f2e9',
    '--color-surface': '#faf8f0',
    '--color-surface-hover': 'rgba(203, 203, 193, 0.5)',
    '--color-border': '#93a1a1',
    '--color-text-primary': '#586e75',
    '--color-text-secondary': '#657b83',
    '--color-text-inverted': '#002b36',
    '--color-primary': '#268bd2',
    '--color-secondary': '#cb4b16',
    '--color-tertiary': '#b58900',
    '--color-success': '#859900',
    '--color-danger': '#dc322f',
    '--color-shadow': 'rgba(0, 0, 0, 0.1)',
    '--color-success-glow': 'rgba(133, 153, 0, 0.4)',
    '--color-danger-glow': 'rgba(220, 50, 47, 0.4)',
    '--color-checkbox-bg': '#eee8d5',
    '--color-checkbox-border': '#93a1a1',
    '--color-disabled-bg': '#d3d9dd',
  },
};

const dracula: Theme = {
    name: 'Dracula',
    colors: {
      '--color-background': '#282a36',
      '--color-background-secondary': '#21222c',
      '--color-background-tertiary': '#44475a',
      '--color-background-quaternary': '#3a3c4a',
      '--color-surface': '#44475a',
      '--color-surface-hover': 'rgba(98, 114, 164, 0.5)',
      '--color-border': '#6272a4',
      '--color-text-primary': '#f8f8f2',
      '--color-text-secondary': '#bd93f9',
      '--color-text-inverted': '#282a36',
      '--color-primary': '#8be9fd',
      '--color-secondary': '#ffb86c',
      '--color-tertiary': '#f1fa8c',
      '--color-success': '#50fa7b',
      '--color-danger': '#ff5555',
      '--color-shadow': 'rgba(0, 0, 0, 0.3)',
      '--color-success-glow': 'rgba(80, 250, 123, 0.5)',
      '--color-danger-glow': 'rgba(255, 85, 85, 0.5)',
      '--color-checkbox-bg': '#44475a',
      '--color-checkbox-border': '#6272a4',
      '--color-disabled-bg': '#6272a4',
    },
  };

const eyeLock: Theme = {
  name: 'EyeLock',
  colors: {
    '--color-background': '#202225',
    '--color-background-secondary': '#2f3136',
    '--color-background-tertiary': '#36393f',
    '--color-background-quaternary': '#40444b',
    '--color-surface': '#36393f',
    '--color-surface-hover': 'rgba(79, 84, 92, 0.5)',
    '--color-border': '#40444b',
    '--color-text-primary': '#dcddde',
    '--color-text-secondary': '#8e9297',
    '--color-text-inverted': '#202225',
    '--color-primary': '#7289da',
    '--color-secondary': '#f0b90b',
    '--color-tertiary': '#faa61a',
    '--color-success': '#43b581',
    '--color-danger': '#f04747',
    '--color-shadow': 'rgba(0, 0, 0, 0.2)',
    '--color-success-glow': 'rgba(67, 181, 129, 0.4)',
    '--color-danger-glow': 'rgba(240, 71, 71, 0.4)',
    '--color-checkbox-bg': '#40444b',
    '--color-checkbox-border': '#8e9297',
    '--color-disabled-bg': '#72767d',
  },
};

export const themes: Theme[] = [tokyoNight, solarizedLight, dracula, eyeLock];
export interface Theme {
  name: string;
  colors: {
    [key: string]: string;
  };
}

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

const ubuntu: Theme = {
  name: 'Ubuntu',
  colors: {
    '--color-background': '#2B2929',
    '--color-background-secondary': '#211F1F',
    '--color-background-tertiary': '#3D3B3B',
    '--color-background-quaternary': '#4a4747',
    '--color-surface': '#3D3B3B',
    '--color-surface-hover': 'rgba(90, 87, 87, 0.5)',
    '--color-border': '#535151',
    '--color-text-primary': '#EEEEEC',
    '--color-text-secondary': '#D3D7CF',
    '--color-text-inverted': '#2B2929',
    '--color-primary': '#E95420',
    '--color-secondary': '#872175',
    '--color-tertiary': '#f2a889',
    '--color-success': '#87e8a4',
    '--color-danger': '#f1706f',
    '--color-shadow': 'rgba(0, 0, 0, 0.3)',
    '--color-success-glow': 'rgba(135, 232, 164, 0.5)',
    '--color-danger-glow': 'rgba(241, 112, 111, 0.5)',
    '--color-checkbox-bg': '#4a4747',
    '--color-checkbox-border': '#6f6c6c',
    '--color-disabled-bg': '#535151',
  },
};

const ubuntuYaruDark: Theme = {
  name: 'Ubuntu Yaru Dark',
  colors: {
    '--color-background': '#252525',
    '--color-background-secondary': '#1c1c1c',
    '--color-background-tertiary': '#333333',
    '--color-background-quaternary': '#404040',
    '--color-surface': '#333333',
    '--color-surface-hover': 'rgba(80, 80, 80, 0.5)',
    '--color-border': '#4a4a4a',
    '--color-text-primary': '#F7F7F7',
    '--color-text-secondary': '#A9A9A9',
    '--color-text-inverted': '#121212',
    '--color-primary': '#E95420',
    '--color-secondary': '#9141AC',
    '--color-tertiary': '#F9A825',
    '--color-success': '#73D216',
    '--color-danger': '#EF2929',
    '--color-shadow': 'rgba(0, 0, 0, 0.4)',
    '--color-success-glow': 'rgba(115, 210, 22, 0.4)',
    '--color-danger-glow': 'rgba(239, 41, 41, 0.4)',
    '--color-checkbox-bg': '#404040',
    '--color-checkbox-border': '#606060',
    '--color-disabled-bg': '#555555',
  },
};

export const themes: Theme[] = [eyeLock, ubuntu, ubuntuYaruDark, solarizedLight];
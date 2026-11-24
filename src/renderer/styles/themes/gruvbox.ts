import darkTheme from './dark';

const primaryBackground = '#3c3836';
const primaryText = '#edddaa';

// Same shape as the dark and light themes so every styled component can read it
const gruvboxTheme = {
  ...darkTheme,
  text: {
    primary: '#ebdbb2',
    secondary: '#504945',
  },
  background: {
    primary: '#282828',
    secondary: '#32302f',
  },
  border: {
    primary: '#665c54',
    secondary: '#3c3836',
  },
  backgroundColor: primaryBackground,
  color: primaryText,
  borderColor: 'rgba(255, 255, 255, 0.1)',
};

export default gruvboxTheme;

import { SCHEME_EXPAND } from './Menu.constants';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around', // Changed back to space-around for proper spacing
    alignItems: 'center',
    margin: [0, 'auto'],
    userSelect: 'none',
    width: '100%' // Ensure full width
  },
  item: {
    display: 'inline-block', // Changed from block to inline-block
    padding: [10, 8], // Reduced horizontal padding to prevent text overflow
    width: 'auto', // Allow natural width
    lineHeight: 1.2, // Increased line height slightly for better readability
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadow: `0 0 5px ${theme.color.secondary.main}`,
    fontFamily: theme.typography.primary,
    color: theme.color.text.main,
    whiteSpace: 'nowrap', // Ensure text doesn't wrap
    overflow: 'visible' // Ensure text is not cut off
  },
  divisor: {
    display: 'inline-block', // Changed to inline-block
    margin: [0, 2], // Reduced margin to save space
    color: theme.color.tertiary.main,
    textShadow: `0 0 5px ${theme.color.tertiary.main}`,
    fontWeight: 'normal',
    transform: 'scale(1, 0.8)', // Slightly compress vertically to save space
    transformOrigin: 'center center'
  },
  link: {
    overflow: 'visible', // Changed from hidden to visible to prevent text cutting
    opacity: ({ scheme }) => scheme === SCHEME_EXPAND ? 0 : 1,

    '&.link-active': {
      color: '#990000', // Deep red for active item
      textShadow: `0 0 5px #990000` // Deep red glow for active item
    },
    '&:hover, &:focus': {
      color: theme.color.secondary.light, // Already using red from theme
      textShadow: `0 0 5px ${theme.color.secondary.light}` // Already using red from theme
    }
  },

  '@media (min-width: 768px)': {
    item: {
      display: 'block',
      padding: [10, 15], // More padding on larger screens
    },
    divisor: {
      display: 'block',
      margin: [0, 5], // More margin on larger screens
    }
  }
});

export { styles };
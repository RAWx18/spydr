const styles = theme => ({
  root: {
    position: 'relative',
    display: 'block',
    border: 'none',
    margin: 0,
    padding: 0,
    boxShadow: 'none',
    textShadow: 'none'
  },
  link: {
    border: 'none',
    outline: 'none',
    userSelect: 'none'
  },
  title: {
    position: 'absolute',
    left: 0,
    top: 0,
    visibility: 'hidden'
  },
  svg: {
    display: 'block',
    margin: 0,
    border: 'none',
    padding: 0,
    opacity: 0,
    filter: `drop-shadow(0 0 1.5px ${theme.color.secondary.main})`
  },
  path: {
    fill: 'none',
    strokeWidth: 16,
    stroke: theme.color.heading.main,
    transition: `stroke ${theme.animation.time}ms ease-out`
  },
  hover: {
    '&:hover': {
      '& $path': {
        stroke: theme.color.secondary.main
      }
    }
  },
  logoText: {
    fontFamily: theme.typography.primary,
    fontSize: '6rem',
    fontWeight: 'bold',
    letterSpacing: '0.8rem',
    color: theme.color.background.main,
    textShadow: `0 0 10px ${theme.color.secondary.main}`,
    opacity: 0,
    position: 'relative',
    display: 'block',
    textTransform: 'uppercase',
    textAlign: 'center',
    margin: '0 auto',
    paddingTop: '20px',
    WebkitTextStroke: `1px ${theme.color.secondary.main}`,
    background: `linear-gradient(to bottom, ${theme.color.background.main}, ${theme.color.secondary.dark})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 0 5px rgba(230, 0, 0, 0.7))', // Changed to red
    transition: 'all 300ms ease-out'
  },
  
  // Add smaller size class for non-home pages
  smallLogo: {
    fontSize: '3rem',
    letterSpacing: '0.5rem',
    paddingTop: '10px',
    textShadow: `0 0 5px ${theme.color.secondary.dark}`,
    filter: 'drop-shadow(0 0 2px rgba(230, 0, 0, 0.3))' // Changed to red
  },
  
  small: {
    margin: '0',
    padding: '10px 0'
  }
});

export { styles };
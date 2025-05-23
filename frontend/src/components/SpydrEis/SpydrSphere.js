import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '../../tools/withStyles'; // Fixed path - go up two levels
import { Text } from '../Text'; // Fixed path - go up one level then into Text

const styles = theme => ({
  sphereContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // Remove these lines that create the box appearance:
    // height: '400px',
    // margin: '2rem 0',
    // position: 'relative'
  },
  sphereCanvas: {
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, rgba(0, 246, 255, 0.1), transparent)',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(0, 246, 255, 0.3)',
    animation: '$pulse 3s ease-in-out infinite'
  },
  '@keyframes pulse': {
    '0%, 100%': { 
      boxShadow: '0 0 20px rgba(0, 246, 255, 0.3)'
      // borderColor: 'rgba(0, 246, 255, 0.5)' // Remove this line too
    },
    '50%': { 
      boxShadow: '0 0 30px rgba(0, 246, 255, 0.6)'
      // borderColor: 'rgba(0, 246, 255, 0.8)' // Remove this line too
    }
  },
  sphereInner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'rgba(0, 246, 255, 0.7)',
    fontSize: '14px',
    fontFamily: 'monospace',
    textAlign: 'center'
  },
  statusText: {
    marginTop: '1rem',
    fontFamily: 'monospace',
    color: '#ff006e',
    fontSize: '1rem',
    textAlign: 'center',
    animation: '$blink 1.5s infinite'
  },
  '@keyframes blink': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 }
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3
  }
});

class SpydrSphere extends React.PureComponent {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      initialized: false,
      scanning: true,
      // Default values - will be updated when you show me test.py
      sphereRadius: 150,
      rotationSpeed: 4,
      pulseIntensity: 0.6,
      scanFrequency: 2000
    };
  }

  componentDidMount() {
    // Always show "Not Initialized" for now
    this.setState({ initialized: false });
    
    // Simulate scanning animation
    this.scanInterval = setInterval(() => {
      this.setState(prevState => ({ scanning: !prevState.scanning }));
    }, this.state.scanFrequency);
  }

  componentWillUnmount() {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
    }
  }

  render() {
    const { classes } = this.props;
    const { initialized, scanning } = this.state;

    return (
      <div className={classes.sphereContainer}>
        <div className={classes.sphereCanvas} ref={this.canvasRef}>
          <div className={classes.gridLines}>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              {/* Grid pattern */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 246, 255, 0.2)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Scanning line */}
              {scanning && (
                <line 
                  x1="50%" 
                  y1="0" 
                  x2="50%" 
                  y2="100%" 
                  stroke="rgba(0, 246, 255, 0.8)" 
                  strokeWidth="2"
                  opacity="0.7"
                >
                  <animateTransform 
                    attributeName="transform" 
                    type="rotate" 
                    from="0 150 150" 
                    to="360 150 150" 
                    dur="4s" 
                    repeatCount="indefinite" 
                  />
                </line>
              )}
            </svg>
          </div>
          
        <div className={classes.sphereInner}>
          <div><Text>NEURAL INTERFACE</Text></div>
          <div><Text>SCANNING...</Text></div>
        </div>
        </div>
        
      <div className={classes.statusText}>
        <Text>{`STATUS: ${initialized ? 'INITIALIZED' : 'NOT INITIALIZED'}`}</Text>
      </div>
      </div>
    );
  }
}

SpydrSphere.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SpydrSphere);
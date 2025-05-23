import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '../tools/withStyles';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Link } from '../components/Link';
import { Secuence } from '../components/Secuence';

const styles = theme => ({
  root: {
    flex: 1,
    display: 'flex',
    padding: 20,
    position: 'relative',
    overflow: 'hidden'
  },
  main: {
    margin: 'auto',
    textAlign: 'center',
    zIndex: 2,
    position: 'relative'
  },
  binaryBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    opacity: 0.15,
    zIndex: 1
  },
  binaryColumn: {
    position: 'absolute',
    width: '20px',
    color: '#ff0000',
    fontSize: '14px',
    fontFamily: 'monospace',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    userSelect: 'none'
  },
  errorCode: {
    fontFamily: 'monospace',
    color: '#ff0000',
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textShadow: '0 0 5px rgba(255,0,0,0.7)'
  },
  subErrorCode: {
    fontFamily: 'monospace',
    color: '#ff0000',
    fontSize: '1rem',
    marginBottom: '1.5rem'
  },
  errorContainer: {
    background: 'rgba(0,0,0,0.7)',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(255,0,0,0.3)',
    border: '1px solid rgba(255,0,0,0.5)'
  }
});

class NotFound extends React.PureComponent {
  constructor(props) {
    super(props);
    this.binaryColumns = 25;
    this.binaryRefs = [];
  }

  componentDidMount() {
    // Create binary rain effect
    for (let i = 0; i < this.binaryColumns; i++) {
      this.animateBinaryColumn(i);
    }
  }

  animateBinaryColumn = (index) => {
    if (!this.binaryRefs[index]) return;

    const column = this.binaryRefs[index];
    const speed = Math.floor(Math.random() * 50) + 30;
    const delay = Math.floor(Math.random() * 2000);
    const length = Math.floor(Math.random() * 15) + 15;
    
    // Generate binary content
    let binaryString = '';
    for (let i = 0; i < length; i++) {
      binaryString += Math.round(Math.random()) === 1 ? '1' : '0';
      binaryString += '<br/>';
    }
    
    column.innerHTML = binaryString;
    column.style.left = `${Math.random() * 100}%`;
    column.style.top = `-${length * 20}px`;
    column.style.opacity = (Math.random() * 0.5) + 0.5;
    
    setTimeout(() => {
      column.style.transition = `top ${speed}s linear`;
      column.style.top = '100%';
      
      setTimeout(() => {
        column.style.transition = 'none';
        this.animateBinaryColumn(index);
      }, speed * 1000);
    }, delay);
  }

  onStart = () => {
    this.secuenceElement.exit();
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.binaryBackground}>
          {[...Array(this.binaryColumns)].map((_, i) => (
            <div 
              key={i}
              ref={ref => (this.binaryRefs[i] = ref)}
              className={classes.binaryColumn}
            />
          ))}
        </div>
        <main className={classes.main}>
          <Secuence ref={ref => (this.secuenceElement = ref)}>
            <div className={classes.errorContainer}>
              <h1><Text>ERROR 404</Text></h1>
              <h1><Text>Location Access Denied</Text></h1>
              <p><Text>The coordinates you entered do not match any known location in the SPYDR network. </Text></p>
              <p><Text>Security protocols have been activated.</Text></p>
              <p><Text>System recalibration required to restore normal operations.</Text></p>
              <Link href='/'>
                <Button onClick={this.onStart}>Recalibrate Network</Button>
              </Link>
            </div>
          </Secuence>
        </main>
      </div>
    );
  }
}

NotFound.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NotFound);
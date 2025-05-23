import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Header } from '../Header';
import { Footer } from '../Footer';
import { AppContent } from '../AppContent';

class Component extends React.Component {
  static displayName = 'Header';

  static propTypes = {
    theme: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    className: PropTypes.any,
    children: PropTypes.any
  };
  
  constructor() {
    super(...arguments);
    this.state = {
      elementsVisible: false
    };
    this.visibilityTimer = null;
  }

  componentDidMount () {
    window.addEventListener('route-change-start', this.onRouteChangeStart);
    window.addEventListener('route-change', this.onRouteChange);
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount () {
    window.removeEventListener('route-change-start', this.onRouteChangeStart);
    window.removeEventListener('route-change', this.onRouteChange);
    window.removeEventListener('mousemove', this.handleMouseMove);
    
    // Clear any timers to avoid memory leaks
    if (this.visibilityTimer) {
      clearTimeout(this.visibilityTimer);
    }
  }

  onRouteChangeStart = ({ detail: { isInternal, href } }) => {
    if (isInternal && href === '/') {
      this.header.exit();
      this.footer.exit();
    }
  }

  onRouteChange = () => {
    this.contentElement.scrollTo(0, 0);
  }
  
  handleMouseMove = (e) => {
    const { clientY } = e;
    const windowHeight = window.innerHeight;
    
    // Show expanded header when cursor is at the top 10% of the screen
    // or at the bottom 10% of the screen for footer
    const headerHovered = clientY < windowHeight * 0.1;
    const footerHovered = clientY > windowHeight * 0.9;
    
    // If either area is hovered, show both elements
    const shouldShowElements = headerHovered || footerHovered;
    
    if (shouldShowElements && !this.state.elementsVisible) {
      // Clear any existing timeout
      if (this.visibilityTimer) {
        clearTimeout(this.visibilityTimer);
        this.visibilityTimer = null;
      }
      this.setState({ elementsVisible: true });
    } else if (!shouldShowElements && this.state.elementsVisible) {
      // Set a timeout to hide elements after 2 seconds
      if (!this.visibilityTimer) {
        this.visibilityTimer = setTimeout(() => {
          this.setState({ elementsVisible: false });
          this.visibilityTimer = null;
        }, 2000);
      }
    }
  }

  render () {
    const {
      theme,
      classes,
      className,
      children,
      ...etc
    } = this.props;

    return (
      <div className={cx(classes.root, className)} {...etc}>
        <Header
          className={classes.header}
          ref={ref => (this.header = ref)}
          style={{
            transform: this.state.elementsVisible ? 'none' : 'scaleY(0.7)',
            transformOrigin: 'top center',
            height: 'auto',
            overflow: 'hidden',
            fontSize: this.state.elementsVisible ? '1rem' : '0.85rem',
            width: '100%',
            transition: 'transform 0.2s ease-out, font-size 0.2s ease-out'
          }}
        />
        <div
          className={classes.content}
          ref={ref => (this.contentElement = ref)}
        >
          <AppContent>
            {children}
          </AppContent>
          <Footer
            className={classes.footer}
            ref={ref => (this.footer = ref)}
            style={{
              opacity: this.state.elementsVisible ? 1 : 0,
              transform: this.state.elementsVisible ? 'translateY(0)' : 'translateY(100%)',
              transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
            }}
          />
        </div>
      </div>
    );
  }
}

export { Component };

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
      elementsVisible: true  // Start with elements visible when page loads
    };
    this.visibilityTimer = null;
    this.contentHeight = 0;
  }

  componentDidMount () {
    window.addEventListener('route-change-start', this.onRouteChangeStart);
    window.addEventListener('route-change', this.onRouteChange);
    window.addEventListener('mousemove', this.handleMouseMove);
    
    // Check if this is a refresh/reload
    if (sessionStorage.getItem('isPageRefreshed')) {
      // This is a page reload, hide header/footer immediately
      this.setState({ elementsVisible: false });
      sessionStorage.removeItem('isPageRefreshed');
    } else {
      // First page load - set the flag for next time
      sessionStorage.setItem('isPageRefreshed', 'true');
      // Auto-hide elements after a delay when the page first loads
      this.autoHideElementsAfterLoad();
    }
    
    // Set up beforeunload listener to help detect page reloads
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }
  
  handleBeforeUnload = () => {
    // This will be triggered when page is refreshed or closed
    sessionStorage.setItem('isPageRefreshed', 'true');
  }
  
  autoHideElementsAfterLoad = () => {
    // Set a timeout to hide elements after 5 seconds
    if (!this.visibilityTimer) {
      this.visibilityTimer = setTimeout(() => {
        this.setState({ elementsVisible: false });
        this.visibilityTimer = null;
      }, 5000);
    }
  }

  componentWillUnmount () {
    window.removeEventListener('route-change-start', this.onRouteChangeStart);
    window.removeEventListener('route-change', this.onRouteChange);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    
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
    
    // When route changes, make header and footer visible
    this.setState({ elementsVisible: true });
    
    // Clear any existing timer that might hide elements
    if (this.visibilityTimer) {
      clearTimeout(this.visibilityTimer);
      this.visibilityTimer = null;
    }
    
    // Set a new timer to auto-hide elements after route change
    this.autoHideElementsAfterLoad();
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
            transform: this.state.elementsVisible ? 'none' : 'translateY(-78%)',
            height: 'auto',
            overflow: 'visible',
            paddingBottom: this.state.elementsVisible ? '0' : '15px',
            fontSize: this.state.elementsVisible ? '1rem' : '0.9rem',
            width: '100%',
            boxShadow: this.state.elementsVisible ? 'none' : '0 2px 10px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            zIndex: 100,
            transition: 'transform 0.3s ease-out, font-size 0.3s ease-out, box-shadow 0.3s ease-out, padding-bottom 0.3s ease-out'
          }}
        />
        <div
          className={classes.content}
          ref={ref => (this.contentElement = ref)}
          style={{
            position: 'relative',
            overflow: 'hidden', /* Change to hidden here, we'll make the child element scrollable */
            flex: '1 1 auto',
            marginTop: this.state.elementsVisible ? '0' : '-70px', /* Increased from -50px to -70px */
            marginBottom: this.state.elementsVisible ? '0' : '-70px', /* Increased from -50px to -70px */
            height: this.state.elementsVisible ? 'calc(100% - 100px)' : 'calc(100vh - 20px)', /* Increased height */
            maxHeight: this.state.elementsVisible ? '85vh' : '100vh',
            display: 'flex',
            flexDirection: 'column',
            transition: 'height 0.3s ease-out, max-height 0.3s ease-out, margin 0.3s ease-out'
          }}
        >
          <AppContent
            style={{
              flex: '1 1 auto',
              overflowY: 'auto',
              overflowX: 'hidden',
              height: '100%',
              paddingBottom: this.state.elementsVisible ? '20px' : '60px', /* More padding when collapsed */
              WebkitOverflowScrolling: 'touch', /* Smooth scrolling on iOS */
              msOverflowStyle: '-ms-autohiding-scrollbar', /* Better scrollbars on Windows */
              scrollbarWidth: 'thin' /* Thin scrollbars in Firefox */
            }}
          >
            {children}
          </AppContent>
          <Footer
            className={classes.footer}
            ref={ref => (this.footer = ref)}
            style={{
              opacity: this.state.elementsVisible ? 1 : 0,
              transform: this.state.elementsVisible ? 'translateY(0)' : 'translateY(105%)',
              transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out'
            }}
          />
        </div>
      </div>
    );
  }
}

export { Component };

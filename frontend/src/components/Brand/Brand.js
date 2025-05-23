import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import anime from 'animejs';

import { Link } from '../Link';

class Component extends React.Component {
  static displayName = 'Brand';

  static propTypes = {
    theme: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    energy: PropTypes.object.isRequired,
    audio: PropTypes.object.isRequired,
    sounds: PropTypes.object.isRequired,
    className: PropTypes.any,
    link: PropTypes.string,
    hover: PropTypes.bool,
    stableTime: PropTypes.bool,
    onEnter: PropTypes.func,
    onExit: PropTypes.func,
    onLinkStart: PropTypes.func,
    onLinkEnd: PropTypes.func,
    isHome: PropTypes.bool // New prop to check if we're on home page
  };

  static defaultProps = {
    link: '/',
    isHome: false
  };

  constructor () {
    super(...arguments);

    const { energy, stableTime } = this.props;

    if (!stableTime) {
      energy.updateDuration({ enter: 820 });
    }
  }

  componentWillUnmount () {
    anime.remove(this.svgElement);
  }

  enter () {
    const { energy, sounds, onEnter, isHome } = this.props;

    anime.set(this.svgElement, { opacity: 0 });
    sounds.logo.play();

    // Create a text-specific animation
    const textAnimation = anime.timeline();
    
    textAnimation
      .add({
        targets: this.svgElement,
        opacity: [0, 1],
        scale: [0.9, isHome ? 1 : 0.8], // Smaller scale if not home page
        easing: 'easeOutCubic',
        duration: energy.duration.enter
      })
      .add({
        targets: this.svgElement,
        textShadow: isHome ? 
          ['0 0 5px rgba(255, 0, 0, 0.5)', '0 0 20px rgba(255, 0, 0, 0.8)'] : 
          ['0 0 5px rgba(255, 0, 0, 0.2)', '0 0 10px rgba(255, 0, 0, 0.4)'],
        easing: 'easeOutCubic',
        duration: energy.duration.enter / 2,
        complete: () => {
          onEnter && onEnter();
        }
      }, '-=400');
  }

  exit () {
    const { energy, sounds, onExit, isHome } = this.props;

    sounds.fade.play();

    anime({
      targets: this.svgElement,
      opacity: [1, 0],
      scale: [isHome ? 1 : 0.8, 0.9],
      easing: 'easeInCubic',
      duration: energy.duration.exit,
      complete: () => {
        anime.set(this.svgElement, { opacity: 0 });
        onExit && onExit();
      }
    });
  }
  
  // Add a method to handle the hover glow effect
  handleMouseEnter = () => {
    const { sounds } = this.props;
    sounds.hover.play();
    
    anime({
      targets: this.svgElement,
      textShadow: ['0 0 5px rgba(230, 0, 0, 0.4)', '0 0 20px rgba(230, 0, 0, 0.9)'], // Changed to red
      scale: 1.05,
      easing: 'easeOutCubic',
      duration: 300
    });
  }

  handleMouseLeave = () => {
    const { isHome } = this.props;
    
    anime({
      targets: this.svgElement,
      textShadow: isHome ? 
        ['0 0 20px rgba(230, 0, 0, 0.8)', '0 0 5px rgba(230, 0, 0, 0.5)'] : // Changed to red
        ['0 0 10px rgba(230, 0, 0, 0.4)', '0 0 2px rgba(230, 0, 0, 0.2)'], // Changed to red
      scale: isHome ? 1 : 0.8,
      easing: 'easeOutCubic',
      duration: 300
    });
  }

  render () {
    const {
      theme,
      classes,
      energy,
      audio,
      sounds,
      className,
      link,
      hover,
      stableTime,
      onEnter,
      onExit,
      onLinkStart,
      onLinkEnd,
      isHome,
      ...etc
    } = this.props;

    return (
      <h1 className={cx(classes.root, hover && classes.hover, !isHome && classes.small, className)} {...etc}>
        <Link
          className={classes.link}
          href={link}
          title='Spydr'
          onLinkStart={onLinkStart}
          onLinkEnd={onLinkEnd}
        >
          <span className={classes.title}>Spydr</span>
          <div 
            className={cx(classes.logoText, !isHome && classes.smallLogo)}
            ref={ref => (this.svgElement = ref)}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          >
            SPYDR
          </div>
        </Link>
      </h1>
    );
  }
}

export { Component };
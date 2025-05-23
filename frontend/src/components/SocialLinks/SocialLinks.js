import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import anime from 'animejs';
import '@fortawesome/fontawesome-free/css/all.css';

import { Link } from '../Link';

class Component extends React.PureComponent {
  static displayName = 'SocialLinks';

  static propTypes = {
    theme: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    energy: PropTypes.object.isRequired,
    audio: PropTypes.object.isRequired,
    sounds: PropTypes.object.isRequired,
    className: PropTypes.any,
    itemClassName: PropTypes.string,
    animateY: PropTypes.bool,
    onEnter: PropTypes.func,
    onExit: PropTypes.func,
    onLinkStart: PropTypes.func,
    onLinkEnd: PropTypes.func
  };

  static defaultProps = {
    animateY: true
  };

  enter () {
    const { energy, sounds, animateY, onEnter } = this.props;
    const { duration } = energy;

    sounds.fade.play();

    anime({
      targets: this.element,
      easing: 'easeOutCubic',
      keyframes: [
        { opacity: 1, duration: duration.enter / 3 },
        { opacity: 0, duration: duration.enter / 5 },
        { opacity: 1, duration: duration.enter / 2 }
      ],
      complete: () => onEnter && onEnter()
    });

    if (animateY) {
      anime({
        targets: this.element,
        easing: 'easeOutCubic',
        translateY: [-10, 0],
        duration: duration.enter
      });
    }
  }

  exit () {
    const { energy, sounds, onExit } = this.props;
    const { duration } = energy;

    sounds.fade.play();

    anime({
      targets: this.element,
      easing: 'easeOutCubic',
      keyframes: [
        { opacity: 0, duration: duration.exit / 3 },
        { opacity: 1, duration: duration.exit / 5 },
        { opacity: 0, duration: duration.exit / 2 }
      ],
      complete: () => onExit && onExit()
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
      itemClassName,
      animateY,
      onEnter,
      onExit,
      onLinkStart,
      onLinkEnd,
      ...etc
    } = this.props;

    const A = elprops => (
      <Link
        className={cx(classes.item, itemClassName)}
        onLinkStart={onLinkStart}
        onLinkEnd={onLinkEnd}
        onMouseEnter={() => sounds.hover.play()}
        {...elprops}
      />
    );

    return (
      <div
        className={cx(classes.root, className)}
        ref={ref => (this.element = ref)}
        {...etc}
      >
      <A href='https://www.youtube.com/@Ryan.Madhuwala' title='YouTube' target='youtube'>
        <span className='mdi mdi-youtube' />
      </A>
      <A href='https://x.com/RAWx18_dev' title='x' target='x'>
        <span className='mdi mdi-twitter' />
      </A>
      <A href='https://www.instagram.com/rawx18.dev' title='Instagram' target='instagram'>
        <span className='mdi mdi-instagram' />
      </A>
      <A href='mailto:rawx18.dev@gmail.com' title='Email' target='email'>
        <span className='mdi mdi-email-outline' />
      </A>
      <A href='https://github.com/RAWx18' title='GitHub' target='github'>
        <span className='fab fa-github' />
      </A>
      <A href='https://www.linkedin.com/in/ryanmadhuwala' title='LinkedIn' target='linkedin'>
        <span className='mdi mdi-linkedin' />
      </A>
      <A href='http://rawx18.netlify.app/' title='Portfolio' target='portfolio'>
        <span className='mdi mdi-web' />
      </A>
      </div>
    );
  }
}

export { Component };

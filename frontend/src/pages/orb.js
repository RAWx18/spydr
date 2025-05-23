import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '../tools/withStyles/index.js';
import { Main } from '../components/Main/index.js';
import { Secuence } from '../components/Secuence/index.js';

const styles = theme => ({
  root: {},
  seeMore: {
    marginTop: 20
  }
});

class orb extends React.Component {
  static propTypes = {
    classes: PropTypes.object
  };

  render () {
    const { classes } = this.props;

    return (
      <Main className={classes.root} fullWidth>
        <Secuence stagger>
        <div>Orb 1</div>
        <div>Orb 2</div>
        <div>Orb 3</div>
        </Secuence>
      </Main>
    );
  }
}

export default withStyles(styles)(orb);
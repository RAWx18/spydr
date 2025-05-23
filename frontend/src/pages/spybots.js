import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '../tools/withStyles';
import { Main } from '../components/Main';
import { Secuence } from '../components/Secuence';

const styles = theme => ({
  root: {}
});

class spybots extends React.Component {
  static propTypes = {
    classes: PropTypes.object
  };

  render () {
    const { classes } = this.props;

    return (
      <Main className={classes.root}>
        <Secuence stagger>
        {/* add spybots here */}
        </Secuence>
      </Main>
    );
  }
}

export default withStyles(styles)(spybots);

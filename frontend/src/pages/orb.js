import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '../tools/withStyles';
import { Main } from '../components/Main';
import { Secuence } from '../components/Secuence';

const styles = theme => ({
  root: {},
  seeMore: {
    marginTop: 20
  }
});

class News extends React.Component {
  static propTypes = {
    classes: PropTypes.object
  };

  render () {
    const { classes } = this.props;

    return (
      <Main className={classes.root}>
        <Secuence stagger>
        {/* add orb here */}
        </Secuence>
      </Main>
    );
  }
}

export default withStyles(styles)(News);

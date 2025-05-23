import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '../tools/withStyles';
import { Link } from '../components/Link';
import { Main } from '../components/Main';
import { Text } from '../components/Text';
import { Fader } from '../components/Fader';
import { Secuence } from '../components/Secuence';
import spydrURL from '../images/spydr.png';

const styles = theme => ({
  root: {}
});

class About extends React.Component {
  static propTypes = {
    classes: PropTypes.object
  };

  render () {
    const { classes } = this.props;

    return (
      <Main className={classes.root}>
        <article>
          <Secuence stagger>
            <header>
              <h1><Text>About Spydr</Text></h1>
            </header>
<Fader>
  {/* Center wrapper with explicit width control */}
  <div style={{ 
    width: '100%', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <img 
      src={spydrURL} 
      alt="SPYDR Logo" 
      style={{ 
        width: '250px', /* Fixed width instead of percentage */
        height: 'auto',
        display: 'block',
        border: 'none' 
      }} 
    />
  </div>
</Fader>
            <p><Text>SPYDR is an advanced, modular AI framework designed to function as a highly intelligent, self-organizing digital assistant. Unlike traditional assistants, SPYDR is not a monolithic system but a constellation of purpose-driven agents working in harmony under a centralized controller. Its architecture is engineered for adaptability, autonomy, and contextual awareness—capable of understanding complex user intents, managing diverse tasks, and evolving over time.</Text></p>
            <p><Text>At the core of SPYDR lies the Master Controller, a high-level coordinator responsible for interpreting user commands, allocating responsibilities to sub-agents, and integrating the system's actions into seamless, goal-driven behavior. Surrounding this core are twelve specialized agents known as SpyBots, each engineered with a focused role—from task scheduling and development support to communication, research, perception, logic, and system monitoring.</Text></p>
            <Fader>
              <p>SPYDR stands out through its deep inter-agent collaboration, real-time responsiveness, and human-centric design. It is capable of not only performing technical functions like coding assistance or information retrieval but also adapting to emotional tone, ensuring user safety, and maintaining contextual memory. Whether managing daily schedules, debugging code, conducting web research, or responding through natural voice and visual interaction, SPYDR operates as a unified yet flexible intelligence system.</p>
              <p>Built for extensibility and long-term evolution, SPYDR represents a next-generation approach to intelligent assistance—where modularity meets coherence, and automation meets emotional intelligence. It is a system designed not just to execute tasks, but to understand, support, and grow with its user.</p>
              <p style={{ margin: 0 }}>Developed by: <Link href='https://github.com/RAWx18' target='RAW'> RAW</Link>.</p>
            </Fader>
          </Secuence>
        </article>
      </Main>
    );
  }
}

export default withStyles(styles)(About);

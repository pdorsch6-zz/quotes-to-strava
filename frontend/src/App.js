import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";

import Quotes from './components/Quotes';
import Activities from './components/Activities';

class App extends Component {
  
  render() {
    return (
      <div>
        <Tabs>
          <TabList>
            <Tab>Quotes</Tab>
            <Tab>Fitbit Activities</Tab>
          </TabList>
          <TabPanel>
            <Quotes />
          </TabPanel>
          <TabPanel>
            <Activities />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default App;
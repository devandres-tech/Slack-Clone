import React from 'react';
import Channels from '../components/Channels';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';


export default () => (
  <div className="app-layout">
    {/* <Teams /> */}
    <Channels />
    <Header />
    <Messages>
      <ul>
        <li />
        <li />
      </ul>
    </Messages>
    <SendMessage />
  </div>
);

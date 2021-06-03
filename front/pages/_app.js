import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';
import SWRDevtools from '@jjordy/swr-devtools';
import { cache, mutate } from 'swr';
import axios from 'axios';
import wrapper from '../store/configureStore';
import backUrl from '../config/axios_config';

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;

const App = ({ Component }) => (
  <>
    <SWRDevtools cache={cache} mutate={mutate} />
    <Head>
      <meta charSet="utf-8" />
      <title>App</title>
    </Head>
    <Component />
  </>
);

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(App);

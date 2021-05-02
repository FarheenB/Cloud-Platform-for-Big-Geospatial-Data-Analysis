// import * as enchannelBackend from 'enchannel-notebook-backend';
// import { Notebook, createStore } from 'react-notebook'
 

// function NotebookComponent(props){
// // Prompt the user for the baseUrl and wsUrl
// const baseUrl = 'http://localhost:8888';
// const domain = baseUrl.split('://').slice(1).join('://');
// const wsUrl = `ws://${domain}`;
 
// // Create a connection options object
// const connectionOptions = {
//   baseUrl,
//   wsUrl,
// };
 
// const { store, dispatch } = createStore({
//   filename: 'test',
//   executionState: 'not connected',
//   notebook: null,
// });
 
// const notebook = require('PATH_TO_NOTEBOOK.ipynb');
// const channels='';

// enchannelBackend.spawn(connectionOptions, 'python3').then(id => {
//   console.info('spawned', id); // eslint-disable-line
//   return id;
// }).catch(err => {
//   console.error('could not spawn', err); // eslint-disable-line
//   throw err;
// }).then(id => {
//   return Promise.all([id, enchannelBackend.connect(connectionOptions, id)]);
// }).catch(err => {
//   console.error('could not connect', err); // eslint-disable-line
//   throw err;
// }).then(args => {
//   const id = args[0];
//   const channels = args[1];
//   console.info('connected', id, channels); // eslint-disable-line
 
// //   const html = 
// });

// return(
//     <Notebook
//                   store={store}
//                   dispatch={dispatch}
//                   channels={channels}
//                   contents={notebook}
//                 />;
// )
// }

// index.js
import { AppRegistry } from 'react-native';
import App from './App'; // Make sure the path is correct based on your project structure
import { name as appName } from './app.json'; // Ensure you have an app.json file

AppRegistry.registerComponent(appName, () => App);

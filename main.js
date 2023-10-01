import initApp from './app';
import { initEngine } from './modules/init';

(async () => {
	await initEngine(document.getElementById('app'));
	initApp();
})();

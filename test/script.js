import animation from '../build/bounce.js';

animation.init();
const items = document.getElementsByClassName('bouncers');
animation.bounceIn(items);

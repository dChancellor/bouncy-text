import animation from '../build/bounce.js';

animation.init({
  general: {
    timeBetween: 3,
    floor: 20,
  },
  animations: {
    bounceIn: { duration: 1, numberOfBounces: 1 },
  },
});

const items = document.getElementsByClassName('bouncers');
animation.bounceIn(items);

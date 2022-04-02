const element = document.getElementById('id');
let bounceInAnimation;
let bounceOutAnimation;

const defaultProps = {
  bounceIn: {
    heights: ['17%', '2%'],
    animationLength: '1s',
    fallSpeed: '.5s',
  },
  bounceOut: {
    dipHeight: 1,
    riseHeight: 1,
    fallSpeed: 1,
    hangTime: 1,
    bounceSpeed: 1,
  },
  backgroundColor: '#AAAAAA',
};
// NOTE - deprecated, but useful to add css variables
//   Object.entries(obj).forEach(([key, value]) => {
//     document.documentElement.style.setProperty(`--${key}`, value);
//   });

const init = (obj) => {
  var style = document.createElement('style');
  document.head.appendChild(style);
  var sheet = style.sheet;
  const bounceInIndex = sheet.insertRule(`@keyframes bounceIn {}`, 0);
  const bounceOutIndex = sheet.insertRule(`@keyframes bounceIn {}`, 0);
  bounceInAnimation = sheet.cssRules[bounceInIndex];
  bounceOutAnimation = sheet.cssRules[bounceOutIndex];
  bounceInAnimation.appendRule('50% {color:blue}');
  console.log(bounceInAnimation, bounceOutAnimation);
  //   setInterval(() => {
  //     const text = document.getElementById('text');
  //     text.classList.add('animated-in');
  //   }, 50);
};

const bounce = {
  init: () => init(),
};

export default bounce;

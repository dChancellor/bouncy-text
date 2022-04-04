interface BounceIn {
  duration: number;
  numberOfBounces: number;
}

interface GeneralSettings {
  timeBetween: number;
}

interface Animations {
  bounceIn: BounceIn;
}

interface Props {
  general: GeneralSettings;
  animations: Animations;
}

let settings: Props = {
  general: {
    timeBetween: 4,
  },
  animations: {
    bounceIn: { duration: 3, numberOfBounces: 1 },
  },
};

const newKeyframeRule = (sheet: CSSStyleSheet, name: string): CSSRule => {
  const ruleIndex = sheet.insertRule(`@keyframes ${name} {}`, 0);
  return sheet.cssRules[ruleIndex];
};

const newClass = (sheet: CSSStyleSheet, name: string) => {
  sheet.insertRule(
    `.${name} {animation-duration: ${
      settings.animations[name as keyof Animations].duration
    }s; animation-name: ${name}; animation-fill-mode: forwards; }`,
    0
  );
};

// NOTE - Deprecated trial of actual mathematic findings of bounce mechanics
// const lengthOfBounce = (height: number, initialVelo: number = 0):  => {
// const gravity = 9.8;
// const COR = 0.75;
//   const downVelo = Math.sqrt(2 * gravity * height) + initialVelo;
//   const upVelo = -(COR * downVelo);
//   const newHeight = (0.5 * Math.pow(upVelo, 2)) / gravity;
//   if(height > .5) lengthOfBounce(newHeight);
// };

const init = (props: Props = settings) => {
  settings = { ...settings, ...props };
  const style = document.createElement('style');
  document.head.appendChild(style);
  const sheet = style.sheet;
  if (!sheet)
    throw Error('We had trouble creating a style sheet for the bounce module.');
  Object.entries(settings.animations).forEach(([key, value]) => {
    const emptyKeyframe = newKeyframeRule(sheet, key);
    newClass(sheet, key);
    if (!setup[key as keyof Animations])
      throw Error(
        `You are trying to set settings for ${key}, which is an invalid animation`
      );
    setup[key as keyof Animations](emptyKeyframe, value);
  });
};

const generateKeyframeRule = (percent: number, value: number): string =>
  `${percent}% { bottom: ${value}%;}`;

const topOfDiv = `bottom:0%`;
const bottomOfDiv = `bottom: 100%`;

const setup = {
  bounceIn: (keyframe: CSSRule, settings: BounceIn): void => {
    let keyframePercentRemaining = 100;
    // @ts-ignore NOTE - It actually does exist, typescript is crazy
    keyframe.appendRule(`0% {bottom: 0%;}`);
    for (let i = 0; i < settings.numberOfBounces; i += 1) {
      let jumpLoop = keyframePercentRemaining / 2;
      keyframe.appendRule(`${keyframePercentRemaining / 4}% {bottom: 0%;}`);
      keyframe.appendRule(`${jumpLoop}% {bottom: ${jumpLoop}%;}`);
      keyframe.appendRule(
        `${keyframePercentRemaining - jumpLoop / 2}% {bottom: 0%;}`
      );
      keyframePercentRemaining = keyframePercentRemaining / 2;
    }
    console.log(keyframe);
  },
};

const animation = {
  init: (props: Props) => init(props),
  bounceIn: (elements: HTMLElement[]) => {
    let currentElement = 0;
    setInterval(() => {
      elements[currentElement]?.classList.remove('bounceIn');
      currentElement =
        currentElement < elements.length - 1 ? (currentElement += 1) : 0;
      elements[currentElement].classList.add('bounceIn');
    }, settings.general.timeBetween * 1000);
  },
};

export default animation;

// let keyframePercentRemaining = 100;
// // @ts-ignore NOTE - It actually does exist, typescript is crazy

// // keyframe.appendRule(generateKeyframeRule(0, 100));

// for (let i = 0; i < settings.numberOfBounces * 2; i += 1) {
//   let isBouncingUp = i % 2;
//   console.log(i, isBouncingUp ? true : false);

//   if (i === settings.numberOfBounces * 2)
//     // @ts-ignore NOTE - It actually does exist, typescript is crazy
//     keyframe.appendRule(generateKeyframeRule(100, 0));

//   isBouncingUp
//     ? // @ts-ignore NOTE - It actually does exist, typescript is crazy
//       keyframe.appendRule(
//         `${
//           100 - keyframePercentRemaining
//         }% {bottom: ${keyframePercentRemaining}%; animation-timing-function: ease-in-out;}`
//       )
//     : // @ts-ignore NOTE - It actually does exist, typescript is crazy
//       keyframe.appendRule(
//         `${
//           100 - keyframePercentRemaining
//         }% {bottom: 0%; animation-timing-function: cubic-bezier(.27,-0.01,.38,.98)}`
//       );
//   keyframePercentRemaining = keyframePercentRemaining / 2;
// }
// console.log(keyframe);
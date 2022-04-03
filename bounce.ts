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
    timeBetween: 3,
  },
  animations: {
    bounceIn: { duration: 2, numberOfBounces: 4 },
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

const generateKeyframeRule = (percent, value) => 
  `${percent}%: bottom: ${value}%`;
  
const setup = {
  bounceIn: (keyframe: CSSRule, settings: BounceIn) => {
    let keyframePercentRemaining = 100;
    for (let i = 0; i <= settings.numberOfBounces; i += 1) {
      let isBouncingUp = i % 2;
      if (i === settings.numberOfBounces)
        keyframe.appendRule(generateKeyframeRule('100%', '100%'));
      console.log(

      );

      // !isBouncingUp
      //   ? // @ts-ignore NOTE - It actually does exist, typescript is crazy
      //     keyframe.appendRule(
      //       `${keyframePercentRemaining}% {bottom: ${
      //         100 - keyframePercentRemaining
      //       }%; animation-timing-function: ease-in-out;}`
      //     )
      //   : // @ts-ignore NOTE - It actually does exist, typescript is crazy
      //     keyframe.appendRule(
      //       `${keyframePercentRemaining}% {bottom: 0%; animation-timing-function: ease-out;}`
      //     );
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

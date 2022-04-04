interface BounceIn {
  duration: number;
  numberOfBounces: number;
}

interface GeneralSettings {
  timeBetween: number;
  floor: number;
  cor: number;
}

interface Animations {
  bounceIn: BounceIn;
}

interface Props {
  general: GeneralSettings;
  animations: Animations;
}

let defaultSettings: Props = {
  general: {
    timeBetween: 3,
    floor: 0,
    cor: 0.75,
  },
  animations: {
    bounceIn: { duration: 2, numberOfBounces: 3 },
  },
};
let settings: Props = defaultSettings;

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

const settingsReducer = (props: Props): Props => {
  let combinedSettings = defaultSettings;
  combinedSettings.general = { ...combinedSettings.general, ...props.general };
  Object.entries(combinedSettings.animations).forEach(([key, value]) => {
    combinedSettings.animations[key as keyof Animations] = {
      ...combinedSettings.animations[key as keyof Animations],
      ...props.animations[key as keyof Animations],
    };
  });
  return combinedSettings;
};
const init = (props: Props = settings) => {
  let settings = settingsReducer(props);
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

const setup = {
  bounceIn: (keyframe: CSSRule, props: BounceIn): void => {
    //@ts-ignore
    keyframe.appendRule(
      `0% {bottom: 100%; animation-timing-function: ease-in;}`
    );
    //@ts-ignore
    keyframe.appendRule(
      `20% {bottom: ${settings.general.floor}%; animation-timing-function: ease-out;} `
    );

    // 1 and 2 Bounces require hard coded math
    if (props.numberOfBounces === 1 || props.numberOfBounces === 2) {
      const rules = bounceReducer[props.numberOfBounces as keyof BounceReducer];
      rules.forEach((rule: string) => {
        //@ts-ignore
        keyframe.appendRule(rule);
      });
    } else {
      let lastKeyFramePercent = 20;
      for (let i = 0; i < props.numberOfBounces; i += 1) {
        let bounceLength = 80 / Math.pow(2, i + 1);
        //@ts-ignore
        keyframe.appendRule(
          `${lastKeyFramePercent + bounceLength / 2}% {bottom: ${
            bounceLength * settings.general.cor + settings.general.floor
          }%; animation-timing-function: ease-in;}`
        );
        //@ts-ignore
        keyframe.appendRule(
          `${lastKeyFramePercent + bounceLength}% {bottom: ${
            settings.general.floor
          }%; animation-timing-function: ease-out;}`
        );
        lastKeyFramePercent = lastKeyFramePercent + bounceLength;
      }
    }
    //@ts-ignore
    keyframe.appendRule(
      `100% {bottom: ${settings.general.floor}%; animation-timing-function: ease-out;}`
    );
  },
};
const bounceReducer: BounceReducer = {
  1: [
    `60% {bottom: ${
      50 * settings.general.cor
    }%; animation-timing-function: ease-in;}`,
  ],
  2: [
    `46.6% {bottom: ${
      50 * settings.general.cor
    }%;animation-timing-function: ease-in; }`,
    `73.2%{bottom:${settings.general.floor}%; animation-timing-function: ease-out;}`,
    `86% {bottom:${
      25 * settings.general.cor
    }%; animation-timing-function: ease-in;}`,
  ],
};
interface BounceReducer {
  1: string[];
  2: string[];
}
const animation = {
  init: (props: Props) => init(props),
  bounceIn: (elements: HTMLElement[]) => {
    let currentElement = -1;
    setInterval(() => {
      elements[currentElement]?.classList.remove('bounceIn');
      currentElement =
        currentElement < elements.length - 1 ? (currentElement += 1) : 0;
      elements[currentElement].classList.add('bounceIn');
    }, settings.general.timeBetween * 1000);
  },
};

export default animation;

---
title: Power Platform Component Framework - ESBuild
date: 2026-01-28
tags:
  - Power Platform
  - PCF
  - Component Framework
  - Power Apps Component Framework
categories:
  - Power Platform
  - Power Apps Component Framework
description: >-
  Webpack isn't the only way to build your component, let's look at the "experimental" native
  support for ESBuild.
excerpt: >-
  Webpack isn't the only way to build your component, let's look at the "experimental" native
  support for ESBuild.
---

PCF development cycles can be slow, especially when you are working on a large component. The build process can take a long time, and it can be frustrating to wait for the build to complete. Version 1.47.1 of `pcf-scripts` introduced a new feature that allows you to use ESBuild instead of Webpack to build your component. This "should" be a much faster build experience, it's currently experimental, so let's take at look and see how it compares...

## The Default

The default build process for PCF components is configured to use webpack to bundle the component. This is a great way to bundle the component, but it is not the fastest.

## Lets Compare

### Webpack Output

| Context                         | Build Mode  | Bundle Size | Build Time |
| ------------------------------- | ----------- | ----------- | ---------- |
| Simple control with React       | Development | 10 KB       | 11 seconds |
| Simple control with React       | Production  | 2 KB        | 11 seconds |
| Control with React and FluentUI | Development | 4262 KB     | 34 seconds |
| Control with React and FluentUI | Production  | 253 KB      | 36 seconds |

### ESBuild Output

| Context                         | Build Mode  | Bundle Size | Build Time |
| ------------------------------- | ----------- | ----------- | ---------- |
| Simple control with React       | Development | 153 KB      | 8 seconds  |
| Simple control with React       | Production  | 22 KB       | 7 seconds  |
| Control with React and FluentUI | Development | 1805 KB     | 18 seconds |
| Control with React and FluentUI | Production  | 667 KB      | 7 seconds  |

ESBuild cuts the build time in half, but produces a larger bundle because it doesn't omit React and FluentUI (platform libraries) from the bundle.

## Configuration

**_note: At the time of writing this is an experimental feature_**

Below are the steps to configure the PCF project to use ESBuild.

_Ensure you are on at least version 1.47.1 of `pcf-scripts`_

### Enable the feature flag.

If you don't have one already, create a `featureconfig.json` file along side your PCF's `package.json` (e.g. `./src/controls/MyControl/featureconfig.json`) and add the following:

```json
{
  "pcfUseESBuild": "on"
}
```

### Install the dependencies:

```
npm install esbuild --save-dev
```

Now your builds will use ESBuild instead of Webpack. This will be identifiable by the output not printing the webpack build stats.

## Results & Conclusion

- ESBuild **IS** faster (as expected). However, the output is larger than the webpack output (with the exception of the ESBuild development build for larger components).
- Why is the output larger? Well, I'm building a virtual control with React and FluentUI. Webpack correctly omits React and FluentUI from the bundle (Virtual controls use the "platform libraries"). ESBuild does not omit React and FluentUI from the bundle! I expect if I wasn't using React and FluentUI, the output would be much the same, but how many of us create PCF components without React or FluentUI?
- It's worth noting that ESBuild itself can support externals (omitting React and FluentUI from the bundle), but `pcf-scripts` does not expose this feature at present with ESBuild enabled.
- ESBuild also outputs sourcemaps for the development build by default. This is a nice touch. Although we can enable this for webpack too with a custom `webpack.config.js`.
- With webpack we can customise the build process (`webpack.config.js`), with ESBuild we cannot (yet!).
- With ESBuild enabled and using FluentUI, the controls did not render correctly in the test harness. I didn't explore this any further considering the other issues.

So, to conclude, I think I'll stick with Webpack for now given the issues mentioned above. Once these issues are resolved, I'll be back to try it again and I expect it will become the default build process for PCF components.

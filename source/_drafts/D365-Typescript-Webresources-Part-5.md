---
title: D365 Typescript Web Resources - Part 5 - Unit Testing
tags:
  - D365
  - Web Resources
  - Typescript
  - JavaScript
  - Unit Testing
  - Jest
  - XrmMock
categories:
  - D365 Typescript
---

Before you get stuck into this make sure you've checked out any previous parts to the [series](/categories/D365-Typescript/).

## Configure Jest

First of all lets install the jest npm package:

```
npm install jest @types/jest --save-dev
```

Next we'll create a basic config via:

```
jest --init
```

If the above doesn't work try:

```
node .\node_modules\jest\bin\jest.js --init
```

I provided the following answers:

```
The following questions will help Jest to create a suitable configuration for your project

√ Would you like to use Jest when running "test" script in "package.json"? ... yes
√ Choose the test environment that will be used for testing » node
√ Do you want Jest to add coverage reports? ... yes
√ Which provider should be used to instrument code for coverage? » babel
√ Automatically clear mock calls and instances between every test? ... yes
```

## Writing out first test

Create a folder in the root of the project called "tests" and then create a new file called "first.test.ts".

Past the following into the new file:

```

```

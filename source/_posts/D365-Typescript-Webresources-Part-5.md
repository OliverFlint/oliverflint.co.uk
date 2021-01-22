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
date: 2021-01-22 00:12:23
---

Before you get stuck into this make sure you've checked out any previous parts to the [series](/categories/D365-Typescript/). Each part in this series follows on from the previous, so you may need to grab the code from the previous part if you haven't been following.

## Configure Jest

First of all lets install the jest npm packages we require:

```
npm install jest @types/jest ts-jest --save-dev
```

Next we'll create a basic config via:

```
npx ts-jest config:init
```

Finally we'll install xrm-mock and sinon to help us a little:

```
npm install xrm-mock sinon @types/sinon --save-dev
```

Ensure your `package.json` is setup to run jest via `npm run test` makes sure you have the following script defined:

```
"scripts": {
    "test": "jest",
    ...
```

Now we are ready to write some tests! :-D

## Writing our first test

Create a folder in the root of the project called "tests" and then create a new file called "first.test.ts".

Paste the following into the new file:

```typescript
import { NavigationStaticMock, XrmMockGenerator } from "xrm-mock";
import * as sinon from "sinon";
import { Pointless } from "../src/sample";
describe("sample test", () => {
  describe("Pointless", () => {
    test("Should display alert", () => {
      XrmMockGenerator.initialise();
      const stub = sinon.stub(
        NavigationStaticMock.prototype,
        "openAlertDialog"
      );

      const msg = "a pointless test message";
      Pointless(msg);

      expect(stub.called).toBeTruthy();
      expect(stub.calledOnce).toBeTruthy();
      expect(stub.firstCall.args[0].text).toBe(msg);
      expect(stub.firstCall.args[0].title).toBe("A Pointless Message");
    });
  });
});
```

### Lets have a closer look at the test...

_I'm not going to tell you how to use [jest](https://jestjs.io/) and [sinon](https://sinonjs.org/) as these already have great documentation of their own._

First we'll "Arrange" out test...
Initialise our global `Xrm` object:

```typescript
XrmMockGenerator.initialise();
```

Stub `openAlertDialog()`. As I expect you know `openAlertDialog()` displays a dialog in D365. Stubbing the function enables the code to execute without error given we don't have the UI and we can then test/assert the stubs properties etc.:

```typescript
const stub = sinon.stub(NavigationStaticMock.prototype, "openAlertDialog");
```

Now lets "Act" by calling our function:

```typescript
const msg = "a pointless test message";
Pointless(msg);
```

Finally we'll "Assert" our tests
Has the `openAlertDialog()` stub been called?:

```typescript
expect(stub.called).toBeTruthy();
```

The `openAlertDialog()` stub should have only been called once:

```typescript
expect(stub.calledOnce).toBeTruthy();
```

Was the `openAlertDialog()` stubs `alertStrings.text` parameter as expected?:

```typescript
expect(stub.firstCall.args[0].text).toBe(msg);
```

Was the `openAlertDialog()` stubs `alertStrings.title` parameter as expected?:

```typescript
expect(stub.firstCall.args[0].title).toBe("A Pointless Message");
```

It's quite a rudimentary test but it demonstrates the basics.

### So, lets run the tests!

Execute `npm run test`

The output should look something like this:

```
> jest

 PASS  tests/first.test.ts (10.199 s)
  sample test
    Pointless
      √ Should display alert (34 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        10.811 s
Ran all test suites.
```

## Fancy a crack at mocking the WebApi?

So, we've written a function that calls Xrm.WebApi, but when we try to test that function it'll fail as the Api doesn't exist... We need to mock the Api call with a stub.

### A function that calls Xrm.WebApi...

First of all we'll create a function called `CreateAccount` (yep you guessed it, it'll create an account!)

```typescript
export async function CreateAccount(account: any): Promise<Xrm.Lookup> {
  const response = await Xrm.WebApi.createRecord("account", account);
  return response;
}
```

It's a simple example but it should get the point across.

### Testing a function that calls Xrm.WebApi

So here's the test. This can be added to the `first.test.ts` inside `describe("sample test", () => {`

It's not a greate example, but it should demonstrate how we can stub the WebApi ;-)

```typescript
describe("CallTheWebApi", () => {
  test("Should return a valid Xrm.Lookup", async () => {
    const stub = sinon
      .stub(WebApiMock.prototype, "createRecord")
      .withArgs("account", sinon.match.object)
      .resolves({
        entityType: "account",
        id: "9bce6686-48d5-4d6f-85a2-da0eea30984d",
        name: "Jest Account",
      } as LookupValueMock);

    const result: LookupValueMock = await CreateAccount({
      name: "Jest Account",
      creditonhold: false,
      address1_latitude: 47.639583,
      description: "This is the description of the sample account",
      revenue: 5000000,
      accountcategorycode: 1,
    });

    expect(stub.calledOnce).toBeTruthy();
    expect(result).toBeTruthy();
    expect(result.name).toBe("Jest Account");
  });
});
```

You'll notice the absence of `XrmMockGenerator.initialise();`. I moved this to the `beforeEach` within `describe("sample test", () => {` like so

```typescript
describe("sample test", () => {
  beforeEach(() => {
    XrmMockGenerator.initialise();
  });
  ...
```

### Lets have a closer look again

First we stub the `createRecord` function via the `WebApiMock` object provided by `xrm-mock`

```typescript
const stub = sinon.stub(WebApiMock.prototype, "createRecord");
```

Then we define the arguments for that stub (optional). Notice the use of the `sinon.match` to match an object.

```typescript
  .withArgs("account", sinon.match.object)
```

_NOTE If we didn't do the above the stub would be executed for all calls to `Xrm.WebApi.createRecord`_

Finally we tell the stub what we would like it to return, or in this case as it's a async/promise we tell it what to resolve.

```typescript
  .resolves({
    entityType: "account",
    id: "9bce6686-48d5-4d6f-85a2-da0eea30984d",
    name: "Jest Account",
  } as LookupValueMock);
```

## OK OK! Lets run the bloody tests!

Execute `npm run test` and you should now get something similar to the following output

```
> jest

 PASS  tests/first.test.ts
  sample test
    Pointless
      √ Should display alert (7 ms)
    CallTheWebApi
      √ Should return a valid Xrm.Lookup (2 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        2.34 s, estimated 27 s
Ran all test suites.
```

## That's all folks!

Remember to take al look at [jest](https://jestjs.io/), [sinon](https://sinonjs.org/), and [xrm-mock](https://github.com/camelCaseDave/xrm-mock)

I hope that has been useful!

You can download a copy of the source code for this blog post [here](d365ts-pt5.zip)

In the next part we'll take a look at home we can integrate Azure Application Insights into the Webresources.

Thanks for reading.
Ollie

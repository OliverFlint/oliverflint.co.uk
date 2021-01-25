---
title: D365 Typescript Web Resources - Part 2 - Type Declarations
date: 2020-03-08
tags:
  - D365
  - Web Resources
  - Typescript
  - JavaScript
  - XrmDefinitelyTyped
categories:
  - D365 Typescript
description: Type Declaration files provide a way to declare the existence of some types or values without actually providing implementations for those values. They improve readability and also quality. They are integral to the use of Typescript.
excerpt: Type Declaration files provide a way to declare the existence of some types or values without actually providing implementations for those values. They improve readability and also quality. They are integral to the use of Typescript.
---

Before you get stuck into this make sure you've checked out any previous parts to the [series](/categories/D365-Typescript/). Each part in this series follows on from the previous, so you may need to grab the code from the previous part if you haven't been following.

## Type Declarations for the D365/XRM Client API

### What are they?

_A declaration file provides a way to declare the existence of some types or values without actually providing implementations for those values._

Read more about them [here](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) and [here](https://microsoft.github.io/TypeScript-New-Handbook/chapters/type-declarations/)

### Do we need to construct our own?

Short answer: No

Long answer: No, but you may want to extend either of the two I'll mention below.

Longer answer: No, but you may want to extend either of the two I'll mention below, and you may even want to author you own.

### So what do we have available?

Personally I have had a play with both [@types/xrm](https://www.npmjs.com/package/@types/xrm) and [delegateas/XrmDefinitelyTyped](https://github.com/delegateas/XrmDefinitelyTyped)

Of the two I prefer XrmDefinitelyTyped as it extends on @types/xrm by providing CrmSvcUtil like functionality to build Typescript interfaces that represent the entities and forms within your D365CE environment.

For the purpose of this post we'll take a look at XrmDefinitelyTyped :-)

### Install XrmDefinitelyTyped

XrmDefinitelyTyped is packaged via Nuget so you'll need to ensure you have Nuget [installed](https://www.nuget.org/downloads). Just download the latest nuget.exe into the root of you workspace.

Oh, you can download a starter workspace based on part 1 of this series from [here](/2020/03/07/D365-Typescript-Webresources-Part-1/d365ts-pt1.zip)

- Once you've installed Nuget run the following from the root of the workspace...

```
nuget.exe install Delegate.XrmDefinitelyTyped -OutputDirectory .\
```

- Next we need to configure XrmDefinitelyTyped. Within the XrmDefinitelyTyped directory you should find `XrmDefinitelyTyped.exe.config`. We are going to need provide some values for the settings in here.

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <appSettings>
    <add key="out" value="./typings/XRM" />
    <add key="solutions" value="" />
    <add key="entities" value="account, contact" />
    <add key="web" value="WebApiEntities" />
    <add key="jsLib" value="./src/lib" />
    <add key="mfaAppId" value="" />
    <add key="mfaReturnUrl" value=""/>
  </appSettings>
</configuration>
```

Alternatively you can use command line switches. I tend to use a combination of the two. Providing a list of the `entities` in the config file but the connection settings via the command line.

```
XrmDefinitelyTyped.exe /url:https://<organizationName>.crm<regionNumber>.dynamics.com/XRMServices/2011/Organization.svc /username:<username> /password:<password> /useconfig:.\Delegate.XrmDefinitelyTyped.5.1.6\content\XrmDefinitelyTyped\XrmDefinitelyTyped.exe.config
```

_make sure to check the version number of XrmDefinitelyTyped used in the `/useconfig:` command line switch_

- Update the `tsconfig.json` with a reference to our new declarations by adding the `typings` to the `include`.

```json
{
  "compilerOptions": {
    "module": "ES6",
    "noImplicitAny": false,
    "removeComments": true,
    "preserveConstEnums": true,
    "outDir": "dist",
    "sourceMap": true
  },
  "include": ["src/**/*", "typings/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts", "dist"]
}
```

_Note we also have to turn [noImplicitAny](https://www.typescriptlang.org/tsconfig#noImplicitAny) off_

And that's it. XDT (XrmDefinitelyTyped) should now be installed and ready to reference within your Typescript. As with CrmSvcUtil you will need to run `XrmDefinitelyTyped.exe` each time you need to update your typings with any customisation changes you have made to your entities, forms, etc.

### Typing your types in your Typescript ;-)

Easy, and C# devs will love it!  
Remember our first ts file we created in [part 1](/2020/03/07/D365-Typescript-Webresources-Part-1)...

```typescript
class ContactMainForm {
  static OnLoad(executionContext: any) {
    const formContext = executionContext.getFormContext();
    formContext.ui.setFormNotification(
      "Typescript locked and loaded!",
      "INFO",
      "ts-msg"
    );
  }
}
```

Lets apply some typings to our objects...

```typescript
class ContactMainForm {
  static OnLoad(
    executionContext: Xrm.ExecutionContext<Form.contact.Main.Contact, any>
  ) {
    const formContext = executionContext.getFormContext() as Form.contact.Main.Contact;
    formContext.ui.setFormNotification(
      "Typescript locked and loaded!",
      "INFO",
      "ts-msg"
    );
  }
}
```

Now, what I love about XDT is the type inference, for example getting an attribute infers the type depending on the logical name and you get something a little like this when writing your code:
![](type-infer-1.png)

For example the `parentcustomerid` attribute type is `Xrm.LookupAttribute<"account" | "contact">` and the `getValue()` function returns a `EntityReference<"account" | "contact">[]`. Anyway I think you get the point.
![](type-infer-2.png)  
_Remember F12 in your IDE will link you to the definition in the typescript declaration :-)_

## That's all folks!

I hope that helps you get XDT working in your project. Please use the comments below, i'm more than happy to take questions and extend this post with any suggestions I feel would be of value.

You can download a copy of the source code for this blog post [here](d365ts-pt2.zip)

Thanks for reading.
Ollie

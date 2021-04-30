---
title: D365 TypeScript Web Resources - Part 1 - Basics
tags:
  - D365
  - Web Resources
  - TypeScript
  - JavaScript
date: 2020-03-07
updated: 2020-03-08
categories:
  - D365 TypeScript
description: In this series (my first) of posts i'll share my experiences when authoring and maintaining JavaScript Web Resources with TypeScript. The series will cover the basics and then more advanced options including ES Modules, webpack, babel, unit testing, deployment, etc.
excerpt: In this series (my first) of posts i'll share my experiences when authoring and maintaining JavaScript Web Resources with TypeScript. The series will cover the basics and then more advanced options including ES Modules, webpack, babel, unit testing, deployment, etc.
---

## Developing JavaScript Web Resources with TypeScript

In this [series](/categories/D365-TypeScript/) (my first) of posts i'll share my experiences when authoring and maintaining JavaScript Web Resources with TypeScript. The [series](/categories/D365-TypeScript/) will cover the basics and then more advanced options including ES Modules, webpack, babel, unit testing, deployment, etc.

Anyway! Let get started!

## Why did I choose TypeScript

So the why is potentially quite subjective and we all have our own opinions, this is mine and I don't expect you to agree but hopefully it will help you form your own opinion and maybe win you over to the idea...

Firstly the obvious, TypeScript is essentially JavaScript with the addition of being able to (optionally) apply static types to your objects. This allows for more readable, cleaner, and more maintainable code. It also helps identify errors sooner, fits the mindset of C# developers, and has some great tooling to support the end to end development life cycle.

Then we have the endless options and tools for compiling/transpiling. For example, defining the browser(s) you wish to support so you have to worry less about the target browser(s) while writing your code. Also, using tools such a webpack to bundle you code into single files and compressing the output for better performance.

Finally we have unit testing and debugging where you can debug the TypeScript directly via source maps.

Personally, I will never go back to writing raw JavaScript unless it's the only option!

## A Basic Setup

Ok, So lets take a look at what we need for the basic setup when working with D365 Web Resources.  
_Note: I'll be using [Visual Studio Code](https://code.visualstudio.com/) as my preferred IDE. However, all of this can be done in other IDE's and terminals etc._

### Node and NPM

If you don't have it installed already go and grab the latest version of [Node](https://nodejs.org/)

### Init

Initialise a workspace/project.

- Lets create a directory for our project and change to that directory (via Terminal)

```
md c:\d365ts-pt1
cd c:\d365ts-pt1
```

- Open the project directory with VS Code (via Terminal)

```
code .
```

- Init a new project (just go with all the defaults) (via Terminal)

```
npm init
```

- install the TypeScript module (via Terminal)

```
npm install TypeScript --save-dev
```

- create directories for the source code and the transpiled output (via Terminal)

```
md src
md dist
```

### TypeScript config

- create a TypeScript configuration `tsconfig.json` in the root of the workspace...

```json
{
  "compilerOptions": {
    "module": "ES6",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "outDir": "dist",
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts", "dist"]
}
```

Full details on TypeScript configuration can be found [here](https://www.TypeScriptlang.org/docs/handbook/tsconfig-json.html)

### Our first TS file

- create a new TS file in the `source` directory. We'll create the file `contact-main-form.ts` for the purpose of the demo paste the below into the file and save.

```TypeScript
class ContactMainForm {
  static OnLoad(executionContext: any) {
    const formContext = executionContext.getFormContext();
    formContext.ui.setFormNotification(
      "TypeScript locked and loaded!",
      "INFO",
      "ts-msg"
    );
  }
}
```

_A basic onload event that should add a notification to the form once it's loaded_

- compile/transpile the source (via Terminal)

```
tsc
```

You should now see your new transpiled `.js` and `.js.map` ([source map](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map)) files in the `dist` directory...  
![](files1.png)

You can now update the `.js` file and wire it up to the Onload event like so...

![](form-event.png)

Then when opening or creating a contact via the main contact form you'll see our form notification :-)

![](formnotification.png)

## That's all folks!

You can download a copy of the source code for this blog post [here](d365ts-pt1.zip)

### Coming up in the [series](/categories/D365-TypeScript/)

In the next part of the [series](/categories/D365-TypeScript/) we'll look at type declarations including XrmDefinitelyTyped. Until then feel free to comment below. All feedback is greatly appreciated.

In the future I'll also be covering the following within this [series](/categories/D365-TypeScript/):

- Type declarations
- Debugging and Source maps
- ES6 Modules
- Babel and Webpack
- Unit Testing
- Automated Deployment
- Lint rules for deprecated client API
- and more
  So keep checking back for updates

Thanks for reading.
Ollie

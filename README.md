# electron-web-components

This project is a proof-of-concept to demonstrate how native web components can be used in an Electron application built with TypeScript. Allowing an app to be free of any bloated framework while taking advantage of modern web technologies. Built for Electron by utilizing the web component specifications adopted by Chromium. 

## Overview

This repository is meant to be used as an example project that can serve as a starting point for using web components in your Electron app. This is not a framework (no framework is the point) or a complete solution, but a concept that can help foster ideas and be expanded upon to prove out further enhancements and functionality.

## Setup

Before setting up, you'll need to install Node.js and npm.

Clone the repository:

`git clone https://github.com/ryan-h/electron-web-components.git`

Install dependencies:

`npm install`

Build the app:

`npm run build`

Run the app:

`npm start`

*Check out the Electron [Quick Start](https://electronjs.org/docs/tutorial/quick-start) for more details on getting the app running.*

## Structure

There are a few key areas that make up the web components used in the project.

### Mixins

The collection of mixins are the core elements that help make web components useful. They provide a definition of functionality that can be applied to a related set of web component classes.

These will continue to grow as you build out more web components that can benefit by deriving from a set of shared functionality in a subclass.

Per the definition of a mixin, each web component can derive from one or multiple mixins. This will ensure proper encapsulation of the common functionality shared by the different web components.

### Mixin Decorators

These functions make the mixin more powerful while at the same time being abstracted from the mixin itself. They allow for decorating the mixin with enhanced functionality that can be applied to all web components using a mixin.

Essentially there are two main ways of decorating a mixin:

* *Wrap* the mixin and provide another layer of functionality to its application
* *Patch* the mixin to simply update the mixin object

There are many possibilities here that could be explored. Fortunately this architecture allows for decorators to be added without needing to make changes to the web components (or even the mixins).

### Web Components

The native web component as defined by the Chrome specifications v1. These are classes that derive from an `HTMLElement` and implement one or more mixins. 

For example:

`class MyWebComponent extends Mixin1(Mixin2(Mixin3(HTMLElement))) { }`

The possibilities provided by web components are only limited to the imagination. Combined with the power of the mixins they should be capable of solving any UI requirements. They are very extensible and easily maintained.

I would highly recommend reading the specifications to help understand the best practices for building web components:

[Building Components](https://developers.google.com/web/fundamentals/web-components/)

## Credit

I have to call out a couple of articles that helped with the inspiration for the mixins and mixin decorators. I recommend reading through them to get a deeper understanding of the functionality and possibilities.

["Real" Mixins with JavaScript Classes](http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/) <br>
[Enhancing Mixins with Decorator Functions](http://justinfagnani.com/2016/01/07/enhancing-mixins-with-decorator-functions/)
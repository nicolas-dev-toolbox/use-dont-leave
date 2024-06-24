# useDontLeave react custom hook

`useDontLeave` is a customizable React hook designed to trigger a Call-To-Action (CTA) based on user interactions such as scrolling, mouse movements, and tab visibility changes. 

This hook helps engage users who might be leaving your site or are highly engaged.

## Installation

Install the package via npm:

```bash
npm install use-dont-leave
```

Or via yarn:

```bash
yarn add use-dont-leave
```

## Usage

Import the hook in your React component:

```js
import useDontLeave from 'use-dont-leave';

const MyComponent = () => {
  const handleTrigger = () => {
    console.log("CTA Triggered!, I might open a dialog...");
  };

  useDontLeave({
    onTrigger: handleTrigger,
    options: {
      mobileWidthThreshold: 768,
      triggerScroll: {
        mobile: true,
        desktop: false,
        percentThreshold: 30,
      },
      triggerMouseMove: true,
      triggerTabChange: {
        mobile: false,
        desktop: true,
        delay: 200,
        title: 'We miss you!',
      },
      storeInUserSession: true,
    },
  });

  return <div>My Component Content</div>;
};
```

You can also use only the trigger callback, every other params is optional:

```js
import useDontLeave from 'use-dont-leave';

const MyComponent = () => {
  const handleTrigger = () => {
    console.log("CTA Triggered!, I might open a dialog...");
  };

  useDontLeave({
    onTrigger: handleTrigger,
  });

  return <div>My Component Content</div>;
};
```

## Parameters

### Required

- `onTrigger: () => void`
  - Callback function to execute when the CTA is triggered.

### Options

| Option                  | Description                                                                                                                                 | Default Value |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `mobileWidthThreshold`  | Width threshold (in pixels) to distinguish between mobile and desktop.                                                                       | `768`         |
| `triggerScroll`         | Object controlling scroll trigger behavior.<br> - `mobile`: Enable scroll trigger on mobile.<br> - `desktop`: Enable scroll trigger on desktop.<br> - `percentThreshold`: Scroll percentage threshold to trigger the CTA. | `{ mobile: true, desktop: false, percentThreshold: 30 }` |
| `triggerMouseMove`      | Enable or disable mouse move trigger in top corners on desktop.                                                                             | `true`        |
| `triggerTabChange`      | Object controlling tab title change behavior.<br> - `mobile`: Enable tab title change on mobile.<br> - `desktop`: Enable tab title change on desktop.<br> - `delay`: Delay in milliseconds before changing the tab title.<br> - `title`: Custom title to show when tab changes. | `{ mobile: false, desktop: true, delay: 200, title: 'We miss you!' }` |
| `storeInUserSession`    | Enable or disable storing trigger state in session storage.                                                                                  | `true`        |

## Cleanup

The hook handles cleanup automatically when the component unmounts, removing event listeners and clearing timeouts.

---

Feel free to adjust the parameters based on your application's needs. 

Enjoy using `useDontLeave` to engage your users effectively!
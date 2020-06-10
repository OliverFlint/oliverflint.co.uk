---
title: PCF <-> Form Communication
tags:
  - D365
  - PCF
  - Power Apps
  - Power Apps Component Framework
categories:
  - Power Apps Component Framework
date: 2020-06-06 02:12:12
---


## Communication
Communication, It's one of the single most important "things" in EVERYTHING!

So why am I finding it so difficult to have my PCF control and Form script talk to each other? Maybe I am missing something but I believe the only "OOTB" method for the two to communicate is via a bound field/control...?

## I want better comms!
Yep, I want a better way for my control and form to communicate without having to bind multiple fields and in some cases create new fields just to support this communication.

## Here's what I came up with...

### Custom Events
Using [custom events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) we can send messages back a forth between the form and the PCF control.

<img src="custom-events.svg" width="50%" class="mini-lightbox" />

The basic example I'll be using for this blog post is linked to the issue where we are not able to bind to the OOTB address fields on entities like contact and account. Here's the [*Idea*](https://powerusers.microsoft.com/t5/Power-Apps-Ideas/Enable-binding-to-OOB-Address-Fields/idi-p/302387) I raised on the Power Apps community forums back in the summer of 2019 (a year ago!!!).

I'll assume you already have the beginnings of a JavaScript web resource with the `OnLoad` form event wired up, and a PCF Control project.

So, it's all pretty simple really. Firstly we need to "dispatch" our event. I'll be doing this when a user selects an address from a `ComboBox` after searching by post code...

```typescript
public addresslistComboBox_onChange(event: React.FormEvent<IComboBox>, option?: IComboBoxOption | undefined, index?: number | undefined, value?: string | undefined): void {
    const selectedAddress = JSON.parse(option?.data);
    const attributeName = this.props.context.parameters.postalcode.attributes?.LogicalName;
    const customEvent = new CustomEvent("onReceiveAddress", {
        detail: {
            Address: selectedAddress,
            Attribute: attributeName
        }
    } as CustomEventInit<EventData>);
    window.dispatchEvent(customEvent);
    this.setState({
        addresslistHidden: true
    });
}
```

Then all we need is to wire up a "listener" to listen within our form script for the event and handle it...

```typescript
window.parent.addEventListener("onReceiveAddress", (ev: CustomEvent<EventData>) => {
    if(ev.detail) {
        if(ev.detail.Attribute === "address1_postalcode"){
            const address = ev.detail.Address;
            formContext.getAttribute("address1_line1").setValue(address.line_1);
            formContext.getAttribute("address1_line2").setValue(address.line_2);
            formContext.getAttribute("address1_line3").setValue(address.line_3);
            formContext.getAttribute("address1_city").setValue(address.town_or_city);
            formContext.getAttribute("address1_county").setValue(address.county);
            formContext.getAttribute("address1_country").setValue(address.country);
        }
    }
});
```

*Note when adding the event listener in the form script we must use `window.parent`, this is because in the Unified Interface custom form script web resources are all loaded within an iframe. Whereas the PCF control is rendered directly in the main document.*

Pretty neat! So no duplicate fields to allow me to bind my control and no WebApi Updates directly from the control. Using this method we can update any field from our control without the need to bind at design time.

If your interested in having a look at the full source code I've uploaded it to [github](https://github.com/OliverFlint/PCF-UK-Address-Lookup)

So Long, and Thanks for All the Fish

# behave-dispatcher
A dispatcher for the flux architecture pattern recommended by behavejs

Flux architecture (or procedural programming - [read this for more information](https://neonbrand.com/blog/procedural-programming-vs-object-oriented-programming-a-review/) ) can be a great way to handle events in your application. However, just like any other event management architecture, there are a few ways to implement it.

`behave-dispatcher` is highly inspired by [Facebook's](http://facebook.github.io/flux/docs/dispatcher.html) `Dispatcher` but there are some key differences.

### Install

```bash
npm install --save behave-dispatcher
```
___

### Example

```javascript

/* cb1.js */
const dispatcher = new BehaveDispatcher();
var cb1 = function(evt) { console.log('I was registered first', evt); };
dispatcher.register('cb1', ['cb2'], cb1);

/* cb2.js */
const dispatcher = new BehaveDispatcher();
var cb2 = function(evt) { console.log('I was registered second', evt); };
dispatcher.register('cb2', ['cb3'], cb2);

/* cb3.js */
const dispatcher = new BehaveDispatcher();
var cb3 = function(evt) { console.log('I was registered third', evt); };
dispatcher.register('cb3', cb3);

/* main.js */
require('./cb1');
require('./cb2');
require('./cb3');

dispatcher.dispatch({ type: 'EXAMPLE_EVENT', data: { example: 'data' } });

/**
 * Result:
 *
 * "I was registered third.", { type: 'EXAMPLE_EVENT', data: { example: 'data' } }
 * "I was registered second.", { type: 'EXAMPLE_EVENT', data: { example: 'data' } }
 * "I was registered first.", { type: 'EXAMPLE_EVENT', data: { example: 'data' } }
 */
```

Unlike Facebook's dispatcher that implements the `waitFor` method to handle dependencies, `behave-dispatcher` abstracts that away and lets you specify your dependencies as an optional second parameter to the register method.

The first parameter is the callback's `id`. In the Facebook implementation an `id` is returned to you when you register a store. In order for another store to register the first store as a dependency, the second store must have access to the first store in order to obtain the `id`. This tightly couples your stores/services to each other. They both must be instantiated and registered with the dispatcher at the same time.

By allowing you to use `ids` to identify your dependencies you can have better encapsulation around your code.

`behave-dispatcher` is a singleton, meaning there should be only one for the entire applicaiton, as you can imagine that could lead to a lot of events, or the urge to skip the dispatcher now and then. If you find yourself in this situation then you need to look at organizing your events better. The dispatcher is ignorant of the event passed in to it. The example you saw above has a very simple schema because it is meant to be a simple example. I highly recommend spending a great deal of time thinking about how you will structure your event schema. I would also like to point out that Facebook only shows `stores` registering to the dispatcher, I personally believe that a data store is only one type of service, there are many other services that may want to register to the dispatcher, `web` services, `analytics` services, `logging` services, etc...

You should be able to plug anything in to a dispatcher without having to worry about breaking something else in the application.
___

### Usage
`.register(id, [deps], callback)`

Adds the callback to the registry

```javascript
import dispatcher from 'behave-dispatcher';

// register a callback with no dependencies
dispatcher.register('SomeStore', function(evt) { ... });

// register a callback with dependencies
dispatcher.register('SomeService', ['SomeStore', 'SomeOtherService'],
        function(evt) { ... });
```

`.unregister()`

Removes a callback from
```javascript
import dispatcher from 'behave-dispatcher';

// register a callback with no dependencies
dispatcher.register('SomeStore', function(evt) { ... });

// unregister a callback by id
dispatcher.unregister('SomeStore');
```

`.purge()`

```javascript
import dispatcher from 'behave-dispatcher';

// register a callback with no dependencies
dispatcher.register('SomeStore', function(evt) { ... });
dispatcher.register('SomeService', function(evt) { ... });
dispatcher.register('SomeOtherStore', function(evt) { ... });

// unregister all callbacks
dispatcher.purge();
```

`.dispatch(evt)`

```javascript
import dispatcher from 'behave-dispatcher';

// hit API, dispatch response
$.getJSON('/some/data')
    .then(function(data) {
        return {
            type: 'API',
            endpoint: '/some/data',
            data: data
        };
    })
    .done(function(evt) {
        dispatcher.dispatch(evt);
    });
```

___

### Release History

- 0.1.0 Initial release


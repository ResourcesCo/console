# Actions, Filters, and Reducers

For apicomponents, which will power the resources.co console, terminology is needed for the processing pipeline.

Ruby on Rails, WordPress, and redux all have abstractions for processing data:

- In Ruby On Rails, there are before, after, and around filters. These can modify the data as a request is processed in a controller, or an operation is performed in a model, or they can simply cause side effects.
- In WordPress, there are filters and actions. [Filters receive and return a value][wpfilters] while actions perform side effects or modify data in some other way besides returning a value.
- In Redux, [reducers are functions that return a new state, given a state and an action][reducers].

The [term "filter"][filter] in Rails and WordPress was most likely inherited [from UNIX][linfo].

For the JSON processing pipeline in apicomponents, I want one type of thing, because the places where actions appear are the same places where filters appear. For instance, deleting an unnecessary parameter from the output and sending a notification to Slack would both happen at the end of a request. One might be better described as a filter and one might be better described as an action. I also want it to be intuitive to non-programmers. I think rails makes a good choice by only using one term, filters, and WordPress makes a good choice to use the friendly term "action". *So I make the choice to use one term like rails, but to have that one term be action.*

This also jibes will with redux.

One concern with the term _action_ is that it might sound like it's doing something big, when often it's doing tiny things. Other choices have this problem too, though. For instance:

- _filter_ might sound like it's filtering the entire data (often not the case)
- _operation_ can go from very small (doubling a number) to very big (military operation). Depending on [priming][priming] it could easily give the wrong idea
- _task_ sounds like it might take enough time to do that it's worth storing in a work queue under ordinary circumstances
- _function_ can create the expectation of being a pure function
- _method_ can be confused with OOP or HTTP

[wpfilters]: https://wordpress.stackexchange.com/questions/1007/difference-between-filter-and-action-hooks
[reducers]: https://redux.js.org/basics/reducers
[filter]: https://en.wikipedia.org/wiki/Filter_(software)#Unix
[linfo]: http://www.linfo.org/filters.html
[priming]: https://en.wikipedia.org/wiki/Priming_(psychology)

For the data in an action, there can be a property `action` which has the name of an action. `type` might get confused with a type system.

I'm considering making this implicit in some situations. For instance, if there is a _client_ property in the action, it could be assumed to have the _action_ property of _request_.

These would have standard properties that are shared between actions. These would be reserved property names. The API for actions would be versioned, and actions would only have to treat properties reserved in the version against they were built as reserved. One set of properties would be "before", "after", and "around" which would have a similar effect to rails. A "path" would put the data in a path. For instance, the following action would add timing information to "path" in the data:

``` json
{
  "action": "time",
  "around": "$all",
  "path": "time"
}
```
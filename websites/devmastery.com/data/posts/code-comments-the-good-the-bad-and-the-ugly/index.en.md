---
author: Bill Sourour
datePublished: April 20, 2017
image: cover.png
category: Articles
summary: Code comments. Are they still relevant? How much is too much?
tags:
  - advice
  - standards
title: "Putting comments in code: the good, the bad, and the ugly"
topic: Writing better code
---

Stop me if you’ve heard this one before…

> "Good code is self-documenting."

In 20+ years of writing code for a living, this is the one phrase I’ve heard the most.

It’s cliché.

And like many clichés, it has a kernel of truth to it. But this truth has been so abused that most people who utter the phrase have no idea what it really means.

Is it true? **Yes.**

Does it mean you should never comment your code? **No.**

In this article we’ll look at the good, the bad, and the ugly when it comes to commenting your code.

For starters, there are really two different types of code comments. I call them **documentation comments** and **clarification comments**.

## Documentation Comments

Documentation comments are intended for anyone who is likely to consume your source code, but not likely to read through it. If you are building a library or framework that other developers will use, you need some form of API documentation.

The further removed from the source code your API documentation is, the more likely it is to become outdated or inaccurate over time. A good strategy to mitigate this is to embed the documentation directly into the code and then use a tool to extract it.
Here’s an example of a documentation comment from a popular JavaScript library called Lodash.

If you compare these comments to their online documentation, you’ll see it’s an exact match.

If you write documentation comments you should ensure that they follow a consistent standard and that they are easily distinguishable from any inline clarification comments you may also want to add. Some popular and well supported standards and tools include JSDoc for JavaScript, DocFx for dotNet, and JavaDoc for Java.

The downside of these kinds of comments is that they can make your code very “noisy” and harder to read for anyone who is actively involved in maintaining it. The good news is that most code editors support “code folding” which allows us to collapse the comments so we can focus on the code.

Collapsing comments with code folding in Visual Studio Code.

## Clarification comments

Clarification comments are intended for anyone (including your future self) who may need to maintain, refactor, or extend your code.

Often, a clarification comment is a code smell. It tells you that your code is too complex. You should strive to remove clarification comments and simplify the code instead because, "good code is self-documenting."

Here’s an example of a bad — though very entertaining — clarification comment.

```php
/*
 * Replaces with spaces
 * the braces in cases
 * where braces in places
 * cause stasis.
**/
$str = str_replace(array("\{","\}")," ",$str);
```

Rather than decorating a slightly confusing statement with a clever rhyme — in amphibrach dimeter, no less — the author would have been far better off spending time on a function that makes the code itself easier to read and understand. Maybe a function named, `removeCurlyBraces` called from another function named `sanitizeInput`?

Don’t get me wrong, there are times — especially when you are slogging through a crushing workload — where injecting a bit of humor can be good for the soul. But when you write a funny comment to make up for bad code, it actually makes people less likely to refactor and fix the code later.

Do you really want to be the one responsible for robbing all future coders of the joy of reading that clever little rhyme? Most coders would chuckle and move on, ignoring the code smell.

There are also times when you come across a comment that is redundant. If the code is already simple and obvious, there’s no need to add a comment.

Like, don’t do this nonsense:

```java
/*
set the value of the age integer to 32
*/
int age = 32;
```

Still, there are times when no matter what you do to the code itself, a clarification comment is still warranted.

Usually this happens when you need to add some context to a non-intuitive solution.
Here’s a good example from Lodash:

```javascript
function addSetEntry(set, value) {
  // Don't return `set.add` because
  // it's not chainable in IE 11.
  set.add(value);
  return set;
}
```

There are also times when — after a lot of thought and experimentation — it turns out that the seemingly naive solution to a problem is actually the best. In those scenarios it is almost inevitable that some other coder will come around thinking they are much smarter than you are and start messing with the code, only to discover that your way was the best way all along.

Sometimes that other coder is your future self.

In those cases, it’s best to save everyone the time and embarrassment and leave a comment.

The following mock-comment captures this scenario perfectly:

```javascript
/**
Dear maintainer:
 
Once you are done trying to 'optimize' this routine,
and have realized what a terrible mistake that was,
please increment the following counter as a warning
to the next guy:
 
total_hours_wasted_here = 42
**/
```

Again, the above is more about being funny than being helpful. But you SHOULD leave a comment warning others not to pursue some seemingly obvious “better solution,” if you’ve already tried and rejected it. And when you do, the comment should specify what solution you tried and why you decided against it.

Here’s a simple example in JavaScript:

```javascript
// don't use the global isFinite() because
// it returns true for null values
Number.isFinite(value);
```

It prevents the next coder who comes along from trying to implement an obvious "improvement" that would cause problems.

## The Ugly

So, we’ve looked at the good and the bad, but what about the ugly?

Unfortunately, there are times in any job where you’ll find yourself frustrated and when you write code for a living, it can be tempting to vent that frustration in code comments.

Work with enough code bases and you’ll come across comments that range from cynical and depressing to dark and mean spirited.

Things like the seemingly harmless…

```javascript
/*
This code sucks, you know it and I know it.  
Move on and call me an idiot later.
*/
```

…to the downright mean

```javascript
/* 
Class used to work around Richard 
being a f***ing idiot
*/
```

These things may seem funny or may help release a bit of frustration in the moment, but when they make it into production code they end up making the coder who wrote them and their employer look unprofessional and bitter.

Don't do this.

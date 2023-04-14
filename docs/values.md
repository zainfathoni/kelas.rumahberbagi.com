# Values

## Principles

### What we're striving for

#### ✅ Performance

Our website must be high-performant because our audience spreads across
Indonesia with varying types of devices and network speed. A good measurement of
it is Google's [Core Web Vitals](https://web.dev/vitals/).

#### ✅ Accessibility

Our website must be accessible so that we can reach more users and help more
people.

#### ✅ Iterative, Incremental Changes

Software development is **complex, cognitive work**. The simpler we can make
something, generally the easier it is to do. Similarly, the fewer moving parts a
software component has, the less error-prone it is, and the less maintenance
burden it gives us.

One of the simplest ways to reduce complexity is to reduce the scope. We can
often postpone the less valuable parts of a bulky issue and do them later in
order to get the most valuable segments into our user's hands faster.

### What we're going against

#### ❌ Expensive Functionalities

We must carefully consider any additional client-side libraries. Unless its
benefits outweigh the trade-offs, we should avoid adding the functionality. Even
if it is proven beneficial, we should strive to implement it in the best
possible way.

#### ❌ Unmeasured Improvements

For any improvements on the website, we should continuously measure its impact
on the [Core Web Vitals](https://web.dev/vitals/) (WIP). If proven to hurt the
metrics, we should revert the changes and find another way to implement them
without degrading the performance.

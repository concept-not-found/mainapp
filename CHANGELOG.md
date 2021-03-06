## 5.1.0 (June 5, 2018)
 * added component lifecycle `didMount` and `willUnmount`

## 5.0.0 (June 5, 2018)
 * render views just in time instead of eagerly to allow parent views to modify attribute of children

## 4.0.0 (June 4, 2018)
 * components can now be rendered by <Component/> instead of <Component.view/>

## 3.0.1 (June 1, 2018)
 * fixed readme images for npm

## 3.0.0 (June 1, 2018)
 * replaced Component with plain old object
 * added $global and $parent references to state
 * added ES5 iife build under dist/
 * removed assertions around view function, now just crashes

## 2.0.0 (April 28, 2018)
 * fixed a bug where children where not passed to child components
 * added specification test
 * pulled h, Component and App out of index.js in order to make it more testable
 * added error codes, error message changes now non-breaking with semantic versioning

## 1.1.0 (April 27, 2018)
 * added missing information in package.json such as repository

## 1.0.0 (April 26, 2018)
 * initial release of Component and App api

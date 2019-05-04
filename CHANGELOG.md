# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).


## [1.0.0-alpha.18] - 2019-05-04

### Fixed

- Incorrect variable in `memoMap`


## [1.0.0-alpha.17] - 2019-05-04

### Changed

- Slightly improved `memoMap` performance


## [1.0.0-alpha.16] - 2019-05-04

### Fixed

- `Fragment`'s' `map` now equalizes objects deeply instead of shallowly

### Changed

- `memoMap` is no longer exposed


## [1.0.0-alpha.15] - 2019-05-03

### Fixed

- `Fragment` single child when using `map`


## [1.0.0-alpha.14] - 2019-05-03

### Fixed

- `Fragment` can have multiple children when using `map`


## [1.0.0-alpha.13] - 2019-05-03

### Fixed

- `Fragment` specials cases


## [1.0.0-alpha.12] - 2019-05-03

### Fixed

- `if` condition in `Fragment`


## [1.0.0-alpha.11] - 2019-05-03

### Added

- `if` and `map` methods to `Fragment`


## [1.0.0-alpha.10] - 2019-05-02

### Fixed

- Static children generation now matches with dynamic children generation

### Removed

- `props` can no longer be given as an array nor as a function
- CSS class and ID can no longer be given as part of string element name


## [1.0.0-alpha.9] - 2019-05-01

### Changed

- Removed comments from memoMap


## [1.0.0-alpha.8] - 2019-05-01

### Fixed

- Do not make fragments out of arrays while diffing, caused unmounts of existing nodes


## [1.0.0-alpha.7] - 2019-05-01

### Added

- Initial version of `memoMap`

### Changed

- Simple hacking to follow references of created array items better


## [1.0.0-alpha.6] - 2019-05-01

### Fixed

- Force fragment spread to array in splice


## [1.0.0-alpha.5] - 2019-05-01

### Changed

- Use Terser for the main UMD bundle (ES5)
- Unify initial creation of DOM elements and DOM diffing behavior

### Added

- Alternate ES5 UMD with UglifyJS
- ES6 UMD with Terser
- Manage `null`, `true` and `false` when diffing DOM
- Manage fragments when diffing DOM
- Coerce remaining non-strings and non-Nodes to strings when diffing DOM


## [1.0.0-alpha.4] - 2019-05-01

### Added

- Function in children support improved

### Fixed

- Fragment flattens given arrays


## [1.0.0-alpha.3] - 2019-04-29

### Added

- UMD bundle


## [1.0.0-alpha.2] - 2019-04-28

### Fixed

- Two incorrectly named variables


## [1.0.0-alpha.0] - 2019-04-28

### Added

- JSX support
- Update props via functions

### Changed

- `requestAnimationFrame` is called for each node's update instead of running whole tree within RAF

### Removed

- Legacy browser support
- Object notation syntax support


## [0.0.13] - 2015-05-24

This is initial release still available at [GitHub/Merri/nom](https://github.com/Merri/nom).
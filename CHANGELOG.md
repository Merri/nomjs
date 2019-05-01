# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).


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
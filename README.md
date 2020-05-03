# Napoly Frontend

## Requirements
- In order to access the API, knowledge of Axios is essential
- In order to make use of global variables through the store, knowledge of vuex is essential 

## Project setup

To install all node dependencies make sure to run
``` bash
$ npm run serve
```
on the root directory of the cloned project.

---

## API Access
To make use of the live API locally, change the following line

``` javascript
// src/backend/axios/index.js

...

var API_URL = 'http://localhost:3000' // Development

...

```

to the value:

``` javascript
var API_URL = 'http://api.napoly.ch' // Development
```
---

The API json directories that can be indexed without authentication are available via
the following links:

- https://api.napoly.ch/api/v1/fields
- https://api.napoly.ch/api/v1/semesters
- https://api.napoly.ch/api/v1/subjects
- https://api.napoly.ch/api/v1/links

The links of a specific subject (in this case with subject_id === 1) 
can be accessed via:

- https://api.napoly.ch/api/v1/links?subject_id=1

The infos and buttons of a specific subject (in this case with subject_id === 1) 
can be accessed via:

- https://api.napoly.ch/api/v1/subjectButtons?subject_id=1
- https://api.napoly.ch/api/v1/infos?subject_id=1

Userdata cannot be accessed unless logged in.

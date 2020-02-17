# Napoly Frontend

## Project setup


If you would like to run the Napoly page locally, you must either install the Napoly 
API Ruby application or edit the axios configuration file to run the app on the 
live API. You will need an admin account on https://napoly.ch to fully access the API.

---
To make use of the live API, change the following line

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
To install all dependencies locally make sure to run
``` bash
npm run dev
```
on the root directory of the cloned project.

---

## API Access

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

Userdata cannot be accessed unless logged in. If a user does not have administrator 
rights, (which are obtained by setting the value user.role = 1) the API will only
return reduced data of the logged in user.

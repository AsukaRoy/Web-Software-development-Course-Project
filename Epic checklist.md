# Web Software development Course Project

**Steps to get started**

Here is a possible list of steps that can be taken to get started with the application. Consider writing tests throughout the project and consider using a version control system (e.g. a private repository on GitHub for the project). For specific requirements, refer to the (epic) checklist below.

- [x] Create a folder structure for the project (following the one outlined in "Structuring Web Applications"). Add files 'app.js' and 'deps.js' to the project.
- [x] Create a database for the project and add necessary files (configuration, database query functionality) to the project. Based on your interpretation of the requirements, create a database schema. Do not fixate on this schema, and assume that you might change it later on. Also, consider the possibility of feeding in data to the database from the command line / from an online browser for testing purposes.
- [x] Add some middlewares to the project, at least an error reporting middleware.
- [x] Add functionality for reporting (morning) behavior. When adding reports, use a fixed user id (e.g. 1).
- [x] Add functionality for summarization of individual responses on a weekly level, now focusing on a single (last?) week. When building reports, use a fixed user id (e.g. 1).
- [ ] Create the landing page that shows the average mood from today and yesterday. Add a note on trend (i.e. going up / down).
- [x] Add functionality for reporting (evening) behavior. When adding reports, use a fixed user id (e.g. 1).
- [x] Adjust summarization of individual responses to include the reported evening behavior. Continue using a fixed user id (e.g. 1).
- [x] Add monthly summarization functionality and implement the possibility to select a week and / or a month.
- [x] Implement registration and authentication functionality. Change the fixed user id to that of the user in the session.
- [x] Add styles using a library.
- [x] Clean up and document.
- [ ] Implement APIs
- [x] Continue working on missing content.

**Epic checklist**

A more detailed checklist is shown below. We suggest storing intermediate versions of the project in a private [GitHub](https://github.com/) repository or similar. When checking for completed requirements in grading, each of the following bullet counts as one requirement. Deviation from individual requirements is possible, given that they are documented.

- [ ] Application structure

  - [x] Application divided into logical folders (akin to the part on Structuring Web Applications)
  - [x] Dependencies exported from deps.js
  - [x] Project launched from app.js, which is in the root folder
  - [x] Configurations in a separate folder (e.g. config)
    - [x] Test configurations separate from production configurations
    - [ ] Configurations loaded from environmental variables or e.g. dotenv -files

- [x] Users

  - [x] Email and password stored in the database for each user

    - [x] Password not stored in plaintext format
    - [x] Emails must be unique (same email cannot be stored twice in the database)

  - [x] Users can register to the application

  - [x] Registration form is accessible at */auth/registration*

    - [x] Registration uses labels to clarify the purpose of the input fields
    - [x] Registration form is validated on the server
      - [x] Email must be an authentic email
      - [x] Password must contain at least 4 characters
      - [x] Validation errors shown on page
      - [x] In case of validation errors, email field is populated (password is not)

  - [x] User-specific functionality is structured into logical parts (e.g. userController.js, userService.js)

- [ ] Authentication

  - [x] Application uses session-based authentication

  - [x] Login form is accessible at */auth/login*

    - [x] Login form asks for email and password
  - [x] Login uses labels to clarify the purpose of the input fields
    - [x] Login form has a link to the registration form
    - [x] If the user types in an invalid email or password, a message "Invalid email or password" is shown on the login page.
      - [x] Form fields are not populated

  - [x] Authentication functionality is structured into logical parts (e.g. authController.js or part of userController.js, ...).

  - [ ] Application has a logout button that allows the user to logout (logging out effectively means clearing the session)

    - [ ] Logout functionality is at `/auth/logout`

- [x] Middleware

  - [x] The application has middleware that logs all the errors that occurred within the application
  - [x] The application has middleware that logs all requests made to the application
    - [x] Logged information contains current time, request method, requested path, and user id (or anonymous if not authenticated)
  - [x] The application has middleware that controls access to the application
    - [x] Landing page at `/` is accessible to all
    - [x] Paths starting with `/auth` are accessible to all
    - [x] Other paths require that the user is authenticated
      - [x] Non-authenticated users are redirected to the login form at `/auth/login`
  - [x] Application has middleware that controls access to static files
    - [x] Static files are placed under `/static`
  - [x] Middleware functionality is structured into logical parts (e.g. separate middlewares folder).

- [x] Reporting

  - [x] Reporting functionality is available under the path `/behavior/reporting`
  - [x] Reporting cannot be done if the user is not authenticated
  - [x] When accessing `/behavior/reporting`, user can choose whether morning or evening is being reported
    - [x] User reporting form depends on selection
    - [x] Page at `/behavior/reporting` shows whether morning and/or evening reporting for today has already been done
  - [x] Morning reporting form contains fields for date, sleep duration, sleep quality, and generic mood
    - [ ] Date is populated by default to today, but can be changed
      - [x] Form has a date field for selecting the date
    - [x] Sleep duration is reported in hours (with decimals)
    - [x] Sleep quality and generic mood are reported using a number from 1 to 5, where 1 corresponds to very poor and 5 corresponds to excellent.
      - [x] Form has a slider (e.g. range) or radio buttons for reporting the value
    - [x] Form contains labels that clarify the purpose of the input fields and the accepted values
    - [x] Form fields are validated
      - [x] Sleep duration must be entered, must be a number (can be decimal), and cannot be negative
      - [x] Sleep quality and generic mood must be reported using numbers between 1 and 5 (integers).
      - [x] In case of validation errors, form fields are populated
  - [x] Evening reporting form contains fields for date, time spent on sports and exercise, time spent studying, regularity and quality of eating, and generic mood
    - [ ] Date is populated by default to today, but can be changed
      - [x] Form has a date field for selecting the date
    - [x] Time spent on sports and exercise and time spent studying are reported in hours (with decimals)
    - [x] Regularity and quality of eating and generic mood are reported using a number from 1 to 5, where 1 corresponds to very poor and 5 corresponds to excellent.
      - [x] Form has a slider (e.g. range) or radio buttons for reporting the value
    - [x] Form contains labels that clarify the purpose of the input fields and the accepted values
    - [x] Form fields are validated
      - [x] Time spent on sports and exercise and time spent studying are reported in hours must be entered, must be a number (can be decimal), and cannot be negative
      - [x] Regularity and quality of eating and generic mood must be reported using numbers between 1 and 5 (integers).
      - [x] In case of validation errors, form fields are populated
  - [x] - [x] Reported values are stored into the database

    - [x] The database schema used for reporting works for the task
    - [x] Reporting is user-specific (all reported values are stored under the currently authenticated user)
    - [x] If the same report is already given (e.g. morning report for a specific day), then the older report is removed
      - [x] If the functionality for handling duplicate reports is something else, the functionality is described in documentation
  - [x] Reporting functionality structured into logical parts (separate views folder, separate controller for reporting, service(s), ...)

- [ ] Summarization

  - [x] Summary functionality is available under the path `/behavior/summary`
  - [x] Main summary page contains the following statistics, by default shown for the last week and month
    - [x] Weekly average (by default from last week)
      - [x] Average sleep duration
      - [x] Average time spent on sports and exercise
      - [x] Average time spent studying
      - [x] Average sleep quality
      - [x] Average generic mood
    - [x] Monthly average (by default from last month)
      - [x] Average sleep duration
      - [x] Average time spent on sports and exercise
      - [x] Average time spent studying
      - [x] Average sleep quality
      - [x] Average generic mood
  - [x] Summary page has a selector for week and month. Check input type="week" and input type="month".
    - [x] When the week is changed, the weekly average will be shown for the given week.
    - [x] When the month is changed, the monthly average will be shown for the given month.
    - [ ] If no data for the given week exists, the weekly summary shows text suggesting that no data for the given week exists.
    - [ ] If no data for the given month exists, the monthly summary shows text suggesting that no data for the given month exists.
  - [x] Summary data / averages calculated within the database
    - [x] When doing weekly reporting, the weekly averages are calculated in the database
    - [x] When doing monthly reporting, the monthly averages are calculated in the database
  - [x] Summarization page contains statistics only for the current user.

- [x] Landing page (i.e. page at the root path of the application)

  - [x] Landing page briefly describes the purpose of the application
  - [x] Landing page shows a glimpse at the data and indicates a trend
    - [x] Landing page shows users' average mood for today and and yesterday
    - [x] If the average mood yesterday was better than today, tells that things are looking gloomy today
    - [x] If the average mood yesterday was was worse today, tells that things are looking bright today
  - [x] Landing page has links / buttons for login and register functionality
  - [x] Landing page has links / buttons for reporting functionality

- [ ] Testing

  - [ ] The application has at least 5 meaningful automated tests. All tests detect if e.g. tested functionality is changed so that it no longer works as expected.
  - [ ] The application has at least 10 meaningful automated tests. All tests detect if e.g. tested functionality is changed so that it no longer works as expected.
  - [ ] The application has at least 15 meaningful automated tests. All tests detect if e.g. tested functionality is changed so that it no longer works as expected.
  - [ ] The application has at least 20 meaningful automated tests. All tests detect if e.g. tested functionality is changed so that it no longer works as expected.

- [x] Security

  - [x] Passwords are not stored in plaintext
  - [x] Field types in the database match the actual content (i.e., when storing numbers, use numeric types)
  - [x] Database queries done using parameterized queries (i.e., code cannot be injected to SQL queries)
  - [x] Data retrieved from the database are sanitized (i.e., if showing content from database, using `<%= ... %>` instead of `<%- ...%>` unless explicitly stated what for).
  - [x] Users cannot access data of other users.
  - [x] Users cannot post reports to other users' accounts.

- [ ] Database

  - [x] Expensive calculations such as calculating averages are done in the database
  - [ ] Indices are used when joining tables if the queries are such that they are used often
  - [ ] Database uses a connection pool
  - [x] Database credentials are not included in the code

- [ ] User interface / views

  - [x] Views are stored in a separate folder

  - [x] User interface uses partials for header content

  - [x] User interface uses partials for footer content

  - [ ] Recurring parts are separated into own partials (e.g. partial for validation errors)

  - [ ] Pages with forms contain functionality that guides the user

    - [x] Labels are shown next to form fields so that the user knows what to enter to the form fields
    - [ ] Form fields are validated and user sees validation errors close to the form fields
    - [x] In the case of validation errors, form fields are populated (with the exception of the login page)

  - [x] User interface uses a style library or self-made stylesheets (see e.g.Twitter Bootstrapfor a style library)

    - [x] If Twitter Bootstrap or other external style libraries are used, they are used over a content delivery network

  - [x] Different pages of the application follow the same style

  - [ ] User sees if the user has logged in (e.g. with a message 'Logged in as [my@email.net](mailto:my@email.net)' shown at the top of the page)

- [ ] APIs

  - [x] The application provides an API endpoint for retrieving summary data generated over all users in a JSON format
  - [x] The API is accessible by all
  - [ ] The API allows cross-origin requests
  - [x] Endpoint `/api/summary` provides a JSON document with sleep duration, time spent on sports and exercise, time spent studying, sleep quality, and generic mood averaged over the last 7 days
  - [ ] Endpoint `/api/summary/:year/:month/:day` provides a JSON document with averages for sleep duration, time spent on sports and exercise, time spent studying, sleep quality, and generic mood for the given day

- [ ] Deployment

  - [ ] Application is available and working in an online location (e.g. Heroku) at an address provided in the documentation
  - [ ] Application can be run locally following the guidelines in documentation

- [ ] Documentation

  - [ ] Documentation contains necessary CREATE TABLE statements needed to create the database used by the application
  - [ ] Documentation contains the address at which the application can currently be accessed
  - [ ] Documentation contains guidelines for running the application
  - [ ] Documentation contains guidelines for running tests

Note that when you return the project, the project must contain a web application that can be started, given that the user follows the given documentation (e.g. a creates required database, sets database credentials). That is, when prioritizing work, you must not sacrifice a working application over individual features from the checklist.
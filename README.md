# Climbing App

This is my pet project 🐕 climbing 🧗 app 📱.  
⚠️ It's a work in progress.  
I like to explore new technologies, new frameworks, new libraries. This project
is my playground for these experiments.  

## TODO

### Features

<details>
<summary><strong>DONE</strong></summary>

- [x] Clicking a QR-code or Barcode should open a modal with the code, not a new
  page
- [x] Add chart showing the average (min and max) number of tries per grade
- [x] Add auth (Clerk) and protect the `/log` route

</details>
</br>

- [ ] Use [parallel
  routing](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)
  ([see Theo's video](https://www.youtube.com/watch?v=d5x0JCZbAJs&t=5527s))
  when clicking a QR-code or Barcode. When we
  refresh the page, we should arrive
  on a distinct page with the same content
- [ ] Update the `/log` page to also be able to log a training session
- [ ] Update Log page with Server Actions (see [Robin Wieruch's
  article](https://www.robinwieruch.de/next-forms/)) and [this
  article](https://www.robinwieruch.de/react-form-validation/)
- [ ] Add database (Postgres)
- [ ] Add ORM (Drizzle)
- [ ] Add toasts for success and error form submission
- [ ] Bonus: Implement rate limiting (use upstash) ?
- [ ] Add error management (w/ Sentry)
- [ ] Add Analytics (posthog)
- [ ] Add a list of all training sessions like the list of ascents. Also use
  filters (by year, by session type, by "intensity": high, medium, low)
- [ ] Add a page (or modal component with parallel routing) to display the
  selected day's (or **days**) training session. We should be able to navigate
  the the training calendar (or training QR or training Barcode) to this page.
  **NOTE**: the elements of the calendar (day), qr-code (dot) and barcode (bars)
  should be clickable (buttons or links)
- [ ] Add a page (or modal component with parallel routing) to display the
  selected day's ascent**s**. We should be able to navigate to this page from
  the QR Code, Barcode or calendar. **NOTE**: the elements of the calendar
  (day), qr-code (dot) and barcode (bars) should be clickable (buttons or links)
- [ ] Add a cron function to backup the database (as CSV and JSON) every week on
 Tuesday at 3am and delete the backups older than 1 year. *The backups should be
 stored in a bucket (S3)?*

### Performance

<details>
<summary><strong>DONE</strong></summary>

- [x] Improve caching mechanisms for better performances (`createCache`,
  Vercel's fluid computing, ...)
- [x] Use [react compiler](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler)

</details>
</br>

- [ ] Investigate the viability of changing the communication between front and
  back from `tRPC` to `RSC` for better performances
- [ ] Memoize costly functions (like data transformations).

### Style

<details>
<summary><strong>DONE</strong></summary>

- [x] Redo the styles of the group toggle in the ascent log page
- [x] Style the sign-in button & User Avatar button
- [x] Style the QR/Barcode buttons & the `<dialog>` elements (in the
  Visualization page)

</details>
</br>

- [ ] Redo the styles of the slider of the ascent log page
- [ ] Update the Dashboard page to display the charts in a carousel (use lib ?)
  and lazy load the charts
- [ ] Update the `ascents/:id` page to display a card with the ascent's details

### Refactoring

<details>
<summary><strong>DONE</strong></summary>

- [x] Redo ascents table with another library (`@handsontable`)
- [x] Merge QR-Code pages and Barcode pages for training and ascents into one
  page. Use a switch to change from training to ascents. Use a button-group to
  change visualisation type (barcode or QR-code)
- [x] Switch all radix-ui components to base-ui
- [x] ~~Use [HeatJS](https://www.william-troup.com/heat-js/examples/index.html) to
  display the calendars (training and ascents). Also take the opportunity to
  stash my component somewhere and also improve it using the best practice found
  in HeatJS~~
- [x] Add the calendars (ascents and training) to the Visualization page

</details>
</br>

- [ ] Refactor the code of the Visualization page
- [ ] Refactor the form components. This needs to be more legible and
maintainable

### Tests

<details>
<summary><strong>DONE</strong></summary>

- [x] Add unit tests for the charts data transformations helpers. This allows us
  to refactor the code to improve performance or readability without breaking
  the app
- [x] Add unit tests for the `Google Sheets` to `JS` transformer functions
- [x] Add unit tests for the functions in the `src/helpers` folder

</details>
</br>

- [ ] Add visual non-regression tests for the following components: `graphs`,
  `calendars`, `QR-codes`, `Barcodes`, etc.
- [ ] Add smoke tests for the main pages (`/`, `Dashboard`, `Log`,
  `Visualisation`, `Ascent`, `Ascents/:id`)

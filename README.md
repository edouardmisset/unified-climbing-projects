# Climbing App

This is my pet project 🐕 climbing 🧗 app 📱.  
⚠️ It's a work in progress.  
I like to explore new technologies, new frameworks, new libraries. This project
is my playground for these experiments.  

## TODO

### Features

- [x] Clicking a QR-code or Barcode should open a modal with the code, not a new
  page.
  - [ ] Bonus: use [parallel
    routing](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)
    ([see Theo's video](https://www.youtube.com/watch?v=d5x0JCZbAJs&t=5527s)). When we
    refresh the page, we should arrive
    on a distinct page with the same content.
- [x] Add chart showing the average (min and max) number of tries per grade.
- [x] Add auth (Clerk) and protect the `/log` route
- [ ] Update the `/log` page to also be able to log a training session.
- [ ] Update Log page with Server Actions (see [Robin Wieruch's
  article](https://www.robinwieruch.de/next-forms/)) and [this
  article](https://www.robinwieruch.de/react-form-validation/).  
- [ ] Add database (Postgres)
- [ ] Add ORM (Drizzle)
- [ ] Add toasts for success and error form submission
- [ ] Bonus: Implement rate limiting (use upstash) ?
- [ ] Add error management (w/ Sentry)
- [ ] Add Analytics (posthog)

### Performance

- [x] Improve caching mechanisms for better performances (`createCache`, `use cache`, ...)
- [ ] Investigate the viability of changing the communication between front and
  back from `tRPC` to `RSC` for better performance ?

### Style

- [ ] Redo the styles of the slider and the group toggle in the log page.
- [ ] Style the sign-in button
- [ ] Style the QR/Barcode buttons & the `<dialog>` elements
- [ ] Update the Dashboard page to display the graphs in a carousel (use lib ?)
  and lazy load the graphs.

### Refactoring

- [x] Redo ascents table with another library (react-table?)
- [x] Merge QR-Code pages and Barcode pages for training and ascents into one
  page. Use a switch to change from training to ascents. Use a button-group to
  change visualisation type (barcode or QR-code).
  - [ ] Bonus: add the calendars
  - [ ] Bonus 2: refactor the components to use the same code for both
    training and ascents???
- [x] Switch all radix-ui components to base-ui.
- [ ] Use [HeatJS](https://www.william-troup.com/heat-js/examples/index.html) to
  display the calendars (training and ascents). Also take the opportunity to
  stash my component somewhere and also improve it using the best practice found
  in HeatJS.
- [ ] Refactor the form components.

### Tests

- [ ] Add tests (visual non-regression tests for graphs, calendars, QR-codes, Barcodes, etc.)
  - [ ] Add unit tests for data transformations. This allows us to refactor the
    code for improve performance or readability without breaking the app.
  - [ ] Add smoke tests for the main pages (`/`, `Dashboard`, `Log`, `Visualisation`, `Calendar`, `Ascent`, `Ascents/:id`)

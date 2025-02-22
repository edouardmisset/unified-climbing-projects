# Climbing App

This is my pet project: climbing app 🤓🐕.  
⚠️ It's a work in progress.  
I like to explore new technologies, new frameworks, new libraries. This project
is my playground for these experiments.  

## TODO

- [x] Redo ascents table with another library (react-table?)
- [x] Merge QR-Code pages and Barcode pages for training and ascents into one
  page. Use a switch to change from training to ascents. Use a button-group to
  change visualisation type (barcode or QR-code).
  - [ ] Bonus: add the calendars
  - [ ] Bonus 2: refactor the components to use the same code for both
    training and ascents.
- [x] Clicking a QR-code or Barcode should open a modal with the code, not a new page.
- [x] Add chart showing the average (min and max) number of tries per grade.
- [ ] Switch all third party components to base-ui.
- [ ] Add auth (Clerk) and protect the `/log` route
- [ ] Add database (Postgres)
- [ ] Add ORM (Drizzle)
- [x] Improve caching mechanisms for better performances (`createCache`, `use cache`, ...)
- [ ] ? Change communication between front and back from tRPC to RSC for better performance (better caching) ?
- [ ] Add tests (visual non-regression tests for graphs, calendars, QR-codes, Barcodes, etc.)
- [ ] Add CI/CD
- [ ] Add error management (w/ Sentry)
- [ ] Analytics (posthog)
- [ ] Update Log page (w/ Server Actions)
- [ ] Update the Log page UI to allow for logging an ascent **OR** a training
  session. (use next.js layout)
- [ ] Update the Dashboard page to display the graphs in a carousel (use lib ?)
  and lazy load the graphs.
- [ ] Rate limiting ? (upstash)

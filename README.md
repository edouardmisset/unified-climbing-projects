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
- [x] Add ability to log a training session
- [x] Update the page (tab) title when we navigate to a new page
- [x] Add toasts for success and error form submission
- [x] Add a list of all training sessions like the list of ascents. Also use
  filters (by year, by session type, by "intensity",  "volume" or "load"? (high,
  medium, low))

</details>
</br>

- [ ] Add database (Postgres)

- [ ] Add ORM (Drizzle)

- [ ] Bonus: Implement rate limiting (use Upstash) ?

- [ ] Add error management (w/ Sentry)

- [ ] Add Analytics (Posthog)

- [ ] Transform the dashboard so that it displays the list of selected ascents
  along with the charts. Each ascent should be clickable to see a modal with the
  Ascent's details (use the `AscentCard` component)

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

- [ ] Improve performances of the `Visualization` page.

### Style

<details>
<summary><strong>DONE</strong></summary>

- [x] Redo the styles of the group toggle in the ascent log page
- [x] Style the sign-in button & User Avatar button
- [x] Style the QR/Barcode buttons & the `<dialog>` elements (in the
  Visualization page)
- [x] Update the `ascents/:id` page to display a card with the ascent's details
- [ ] ~~Redo the styles of the slider of the ascent log page~~
- [x] Add dark / light theme (also add a toggle). Replace the purple theme with
  the dark theme

</details>
</br>

- [ ] Update the Dashboard page to display the charts in a carousel (use lib ?)
  and lazy load the charts
- [ ] Create a (climbing) style component to display the style of the climb
  (`<em>{style}</em>`)
- [ ] Create a (climbing) grade component to display the grade of the climb
  (`<strong>{topoGrade}</strong>`)

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
- [x] Change the logic for inputting the grade when logging an ascent. Use an
  input along with `+` and `-` buttons to increase or decrease the grade.

</details>
</br>

- [ ] Refactor the code of the Visualization page => Maybe this should be a
  navigation page and not a dynamic content page

- [ ] Refactor the form components. This needs to be more legible and
  maintainable

### Tests

<details>
<summary><strong>DONE</strong></summary>

- [x] Add unit tests for the charts data transformations helpers. This allows us
  to refactor the code to improve performance or readability without breaking
  the app
- [x] Add unit tests for the `Google Sheets` to `JS` transformer functions
- [x] Add unit tests for the functions in the `src/helpers` folder
- [x] Add smoke tests for the main pages (`/`, `Dashboard`, `Visualisation`,
  `Ascent`, `Ascents/:id`)

</details>
</br>

- [ ] Add visual non-regression tests for the following components: `graphs`,
  `calendars`, `QR-codes`, `Barcodes`, etc.

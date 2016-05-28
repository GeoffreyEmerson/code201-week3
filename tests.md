## Day 1 tests

1. Load the web app. Verify these three items:
  - The page heading displays.
  - Instructions to use the app are displayed.
  - Three images are displayed.
2. Load the app, then vote 16 times. During the voting process, verify these items:
  - The two buttons, "Show Results" and "8 More Votes" are not visible during the first 15 votes.
  - After the 16th vote, the two buttons become visible.
3. Load the app, then vote 16 times, then click the button labeled "I want to click more!" and verify:
  - The app allows the user to vote 8 more times.
4. Load the app, then vote 16 times, then click the button labeled "I want to click more!" and vote 8 more times. Verify:
  - The app then automatically displays the resulting statistics.
  - The app does not allow any more image votes.
5. Load the app, then vote 16 times, then click the button labeled "Show me the results!" Verify:
  - The app immediately displays the resulting statistics.
  - The app does not allow any more image votes.

## Day 2 tests

1. Load the app. Verify:
  - The chart does not display on the page.
2. Load the app, then vote 16 times. Verify:
  - The chart does not display on the page.
3. Load the app, then vote 16 times, then click the button labeled "I want to click more!" and verify:
  - The chart does not display on the page.
4. Load the app, then vote 16 times, then click the button labeled "Show me the results!" Verify:
  - The chart displays the proper results.
5. Load the app, then vote 16 times, then click the button labeled "I want to click more!" and vote 8 more times. Verify:
  - The chart displays the proper results.

## Day 3 tests


1. Load the app. Refresh the page or close and re-open the browser and return to page. Verify:
  - The same pictures show before and after refreshing.
2. Load the app, vote fewer than 16 times. Refresh page. Verify:
  - Only the remaining votes are allowed, and not another full 16.
3. Load the app, then vote 16 times. Refresh the page. Verify:
  - The two buttons display and are active.
4. Load the app, then vote 16 times, then click the button labeled "Show me the results!" Refresh the page. Verify:
  - The chart still displays the same results as before the page refresh.
5. Load the app, then vote 16 times, then click the button labeled "I want to click more!" and vote less than 8 times. Refresh the page. Verify:
  - Only the remaining votes are allowed, and not another full 8 or 16.

## Day 4 tests

1. Load the app. Verify:
  - The page heading animates from larger than the screen width to fitting above the page content.
  - The instructions and first set of images fades in as the heading zooms in.
2. Load the app, then vote 16 times, then click the button labeled "Show me the results!" Verify:
  - The statistics chart and app restart button fade into view.
  - After a few seconds, another button slides in from the bottom right of the screen.
3. Load the app, then vote 16 times, then click the button labeled "Show me the results!" Then click on the button labeled "Moar click!" Verify:
  - The page scrolls back to the top of the app by itself.
4. Load the app, then press the 'c' key. Verify:
  - An overlay appears with a video available for viewing in the middle of the screen.
5. Load the app, then vote 16 times, then click the button labeled "Show me the results!" Then click on the button labeled "Oh noes, spoilerz!" Verify:
  - An overlay appears with a video available for viewing in the middle of the screen.
  

Ballroom: visualize ballroom dance routines
===

This tool is intended to help me visualize dance steps.  It very much is a work
in progress.  Feel free to play with the
[live demo](http://rubys.github.io/ballroom/) (readonly).

Works best on Firefox.  Works (with some occasional flicker) on Chrome and
Safari.  Does not work on Internet Explorer or Edge as it requires SVG animation
([SMIL](https://msdn.microsoft.com/en-us/library/gg193979%28v=vs.85%29.aspx)).

Constructing a routine and playing it:
---

1. Select the type of dance from the dropdown in the top center of the screen.

2. Click on dance steps in the order you want them to appear in the routine.
   As you click on steps, they will show up in the list on the left.
   **note**: dance steps that are greyed out are not yet available.

3. Click play (▶).

Optionally:

* Stop, advance a single step, reverse a single step using the other buttons.

* Change the beats per minute using the slider.

Notes:

* The size and initial placement of the shoes will be determined by the size of
  the browser window and the amount of area covered by the routine.  Resizing
  the window will resize the shoes.

* The bullet next to the dance step in the list on the left will turn red
  when that dance step is being performed.

* Ball and heels of the shoes will turn white when lifted off the floor and
  regain color when placed back down. 

* Refreshing the window will reset the routine.

Creating a new step:
---

1. Select the type of dance from the dropdown in the top center of the screen.

2. Scroll to the bottom of the screen and enter the step name.
   **note**: clicking on dance steps that are greyed out in the list above
   will pre-fill the name of the step.

3. Click the (new step) button.

4. Add a step.

    1. Select a shoe.  One of the shoes is already selected (this is indicated
       with a green outline).  You can change the selection by either pressing
       the space bar or clicking on another shoe.

    2. Move the shoe.  This can be done by dragging and dropping the ball of
       the shoe or by using the keyboard.  Keyboard instructions follow this
       list.  Double clicking on either the x or y values following the
       word *Move* in the sidebar will allow direct entry of the desired
       stopping point.

    3. Rotate the shoe.  This can be done by dragging and dropping the heel
       of the shoe.  Again keyboard instructions follow this list.  Double
       clicking on the value following the word *Rotate* in the sidebar will
       allow direct entry of the desired orientation.

    4.  Repeat substeps *i* through *iii* as often as you like.  ***note***:
        Pressing the ESC key will reset the step you are working on.

    5.  Adjust the number of beats, text, and note to be displayed as this
        step is being performed.  **Notes**:

        * Fractional and negative beats is an experimental feature, intended
          to allow you to "go back in time" and add additional steps that are
          done partway through a step (e.g. a leader chassé to get into
          shadow position).
          
        * While you can change whether the balls and heels are up or down,
          this function isn't complete.  In practice, multiple movements are
          done in one step (e.g., raising the ball, sliding the heel, dropping
          the ball).  This will require more investigation.

    6.  Press enter to complete the step.

    7.  Repeat substeps *i* through *vi* as often as you like.

5. Click play (▶).  You can stop, restart, step forward, and reverse your
   step.  **note** at the moment, changing the routine after you have pushed
   play is not supported.  Support for this is planned to be added.

6. Saving of steps is only supported if you have your own server.  Meanwhile
   you can copy a description of the steps using the clipboard copy feature
   (from the dropdown menu or ⌘--C on the mac or control-C on all other
   operating systems).  This description can be pasted into an email.

Keyboard shortcuts
---

* **space** - selects the next shoe

* **left**, **right**, **up**, and **down** will move the selected show to
  *it's* left, right, forward, or back, based on the direction the shoe
  is pointing.  Simultaneously pressing **shift** when pressing the key will
  make the movement smaller.  Pressing **control** instead (**command** on Macs)
  will give you even more control over the movement.

* **0** will move the selected foot to align with their partners.  This is
  particularly useful to ensure that dance moves end with a proper alignment.

* **1**, **2**, **3**, **4**, and **5** will move the feet to the first,
  second, third, fourth, or fifth position.  **Notes**:

   * pressing **alt** when pressing **4** will reverse the direction of the
     step, as there are two ways to get to fourth position: either by stepping
     forward or stepping back.

   * selecting and rotating the leaders shoe before selecting a position will
     cause the follower to adjust accordingly.

   * while these numbers will typically move a foot of each partner, pressing
     **shift** will limit the movement to a single partner.

* **enter** - completes the step.

* **c** - displays 'nobs' that allow you to adjust the curve of the selected
  step.

* **q** - changes the value of beats to 1.  ("quick")

* **s** - changes the value of beats to 2.  ("slow")

* **esc** - clears all movement since the last **enter**.



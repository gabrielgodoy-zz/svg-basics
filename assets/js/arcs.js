let svgContext;
let rect;
let b2;
let pagexEl;
let pageyEl;
let mEl;
let rxEl;
let ryEl;
let rotEl;
let lafEl;
let sfEl;
let axEl;
let ayEl;
let bxEl;
let byEl;
let baEl;
let bbEl;
let dotHandler1;
let dotHandler2;
let line;
let line0;
let line2;
let cwEl;
let arcCmdEl;
let arcEl;
let arc2El;
let arc3El;
let arc4El;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('svgcontext')) {
    svgContext = document.getElementById('svgcontext');
    rect = svgContext.getBoundingClientRect(); // helper to enclose mouse coordinates into svg box
    pagexEl = document.getElementById('pagex');
    pageyEl = document.getElementById('pagey');
    mEl = document.getElementById('mvalue');
    rxEl = document.getElementById('rx');
    ryEl = document.getElementById('ry');
    rotEl = document.getElementById('rot');
    lafEl = document.getElementById('laf');
    sfEl = document.getElementById('sf');
    axEl = document.getElementById('axvalue');
    ayEl = document.getElementById('ayvalue');
    bxEl = document.getElementById('bxvalue');
    byEl = document.getElementById('byvalue');
    baEl = document.getElementById('bavalue');
    bbEl = document.getElementById('bbvalue');
    dotHandler1 = document.getElementById('dotHandler1');
    dotHandler2 = document.getElementById('dotHandler2');
    line = document.getElementById('line');
    line0 = document.getElementById('line0');
    line2 = document.getElementById('line2');
    cwEl = document.getElementById('cwvalue');
    arcCmdEl = document.getElementById('arcvalue');
    arcEl = document.getElementById('arc');
    arc2El = document.getElementById('arc2');
    arc3El = document.getElementById('arc3');
    arc4El = document.getElementById('arc4');
  }
});

export function initArcs() {
  dotHandler1.sdrag((el, pageX, startX, pageY) => {
    pageX -= rect.left;
    pageY -= rect.top;

    el.setAttribute('cx', pageX);
    el.setAttribute('cy', pageY);
    updatePaths(pageX, pageY);
  });

  dotHandler2.sdrag(function(el, pageX, startX, pageY) {
    pageX -= rect.left;
    pageY -= rect.top;

    el.setAttribute('cx', pageX);
    el.setAttribute('cy', pageY);
    updatePaths(pageX, pageY);
  });

  window.addEventListener('resize', updateScreen);

  // sliders
  ['rx', 'ry', 'rot'].forEach(function(id) {
    document.getElementById(id).addEventListener('input', function(e) {
      updatePaths();
    });
  });

  // checkboxes
  ['laf', 'sf'].forEach(function(id) {
    document.getElementById(id).addEventListener('change', function(e) {
      updatePaths();
    });
  });

  updatePaths();
  updateScreen();
}

function updatePaths(pageX, pageY) {
  pagexEl.textContent = pageX;
  pageyEl.textContent = pageY;

  // cwEl.textContent = pageY;

  // line between two points
  line.setAttribute("x1", dotHandler1.getAttribute('cx'));
  line.setAttribute("y1", dotHandler1.getAttribute('cy'));
  line.setAttribute("x2", dotHandler2.getAttribute('cx'));
  line.setAttribute("y2", dotHandler2.getAttribute('cy'));

  axEl.textContent = dotHandler1.getAttribute('cx');
  ayEl.textContent = dotHandler1.getAttribute('cy');
  bxEl.textContent = dotHandler2.getAttribute('cx');
  byEl.textContent = dotHandler2.getAttribute('cy');

  // y = mx + b
  let m, b, run; // m = rise/run = (y2-y1) / (x2-x1)
  if (dotHandler1.getAttribute('cx') <= dotHandler2.getAttribute('cx')) {
    run = (dotHandler2.getAttribute('cx') - dotHandler1.getAttribute('cx'));
    if (0 !== run) {
      m = (dotHandler2.getAttribute('cy') - dotHandler1.getAttribute('cy')) / run;
    }
  }
  else {
    run = (dotHandler1.getAttribute('cx') - dotHandler2.getAttribute('cx'));
    if (0 !== run) {
      m = (dotHandler1.getAttribute('cy') - dotHandler2.getAttribute('cy')) / run;
    }
  }

  if (0 !== run) {
    // b = y - mx
    b = dotHandler1.getAttribute('cy') - m * dotHandler1.getAttribute('cx');
    b2 = dotHandler2.getAttribute('cy') - m * dotHandler2.getAttribute('cx');
    baEl.textContent = b;
    bbEl.textContent = b2;
    mEl.textContent = m;

    // draw segment from the left vertical axis (x=0) to the left most point (A or B).
    // x=0 ----> y = b
    let leftMost, rightMost;
    if (dotHandler1.getAttribute('cx') <= dotHandler2.getAttribute('cx')) {
      leftMost = dotHandler1;
      rightMost = dotHandler2;
    }
    else {
      leftMost = dotHandler2;
      rightMost = dotHandler1;
    }

    line0.setAttribute("x1", 0);
    line0.setAttribute("y1", b);
    line0.setAttribute("x2", leftMost.getAttribute('cx'));
    line0.setAttribute("y2", leftMost.getAttribute('cy'));

    // draw segment from point B to the right vertical axis (x=rect.width) representing the end of the svg box.
    // y = mx + b
    let y = m * rect.width + b;
    line2.setAttribute("x1", rightMost.getAttribute('cx'));
    line2.setAttribute("y1", rightMost.getAttribute('cy'));
    line2.setAttribute("x2", rect.width);
    line2.setAttribute("y2", y);

    // now update the arc
    let arcCmd = getArcCommand(leftMost, rightMost, lafEl.checked, sfEl.checked);
    arcCmdEl.textContent = arcCmd;
    arcEl.setAttribute('d', arcCmd);

    // now update the other helper arcs
    let combo = [
      [true, true],
      [true, false],
      [false, true],
      [false, false],
    ].filter(function(item) {
      return !(item[0] === lafEl.checked && item[1] === sfEl.checked);
    });
    arc2El.setAttribute('d', getArcCommand(leftMost, rightMost, combo[0][0], combo[0][1]));
    arc3El.setAttribute('d', getArcCommand(leftMost, rightMost, combo[1][0], combo[1][1]));
    arc4El.setAttribute('d', getArcCommand(leftMost, rightMost, combo[2][0], combo[2][1]));

  }
}

function getArcCommand(leftMost, rightMost, lafChecked, sfChecked) {
  return "M" + leftMost.getAttribute('cx') + " " + leftMost.getAttribute('cy')
    + " A " + rxEl.value + " " + ryEl.value + " " + rotEl.value + " "
    + (true === lafChecked ? "1" : "0") + " " + (true === sfChecked ? "1" : "0")
    + " " + rightMost.getAttribute('cx') + " " + rightMost.getAttribute('cy');
}

function updateScreen() {
  rect = svgContext.getBoundingClientRect();
  cwEl.textContent = rect.width;
}


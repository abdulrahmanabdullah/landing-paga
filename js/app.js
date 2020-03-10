/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Define Global Variables
 *
 */
let isScrolling = false; // check if document scrolling or not .
const headerUI = document.querySelector('.page__header');
const navUI = document.querySelector('#navbar__list');
const containerUI = document.querySelector('.container');
//Write some styles for navbar
navUI.classList.add('navbar__list__style');
// Grab all sections in html to get data and anchors
const sectionsUI = document.querySelectorAll('section');

/**
 * End Global Variables
 * Start Helper Functions
 *
 */

// implement this func from gizma.com/easing
function liner(t, b, c, d) {
  return (c * t) / d + b;
}

// Scroll to section on link click
function smoothScrolling(event) {
  event.preventDefault();
  console.log(event.target);

  const anchors = document.querySelectorAll('#navbar__list a');
  anchors.forEach(item => {
    item.classList.remove('navbar_link_active');
  });
  event.target.classList.add('navbar_link_active');
  const targetId = event.currentTarget.getAttribute('href');
  const targetPosition = document.querySelector(targetId).offsetTop; // get position of current element
  const startPosition = window.pageYOffset; // top position which = 0 ;
  const distance = targetPosition - startPosition;
  const duration = 1000; // the time elapsed when moving
  let start = null;
  // method tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint
  window.requestAnimationFrame(step);
  function step(time) {
    if (!start) start = time;
    let progress = time - start;
    window.scrollTo(
      0,
      liner(progress, startPosition, distance, duration)
      //   progress * (distance / duration) + startPosition
    );
    if (progress < duration) window.requestAnimationFrame(step);
  }
}
// Throttle scrolling event.
const hasScrolled = isScrolling => {
  setTimeout(() => {
    if (isScrolling) {
      headerUI.classList.add('header_visibly');
      headerUI.classList.remove('header_hidden');
      isScrolling = false;
    }
  }, 1000);
};
let isNavCreated = false;
// This function extract data attributes from sections then create list in navbar
const addItemList = element => {
  let containerItem = document.createDocumentFragment('div');
  sectionsUI.forEach(item => {
    let title = item.getAttribute('data-nav');
    let ids = item.getAttribute('id');
    let li = document.createElement('li');
    let anchors = document.createElement('a');
    anchors.classList.add('menu__link');
    anchors.setAttribute('href', `#${ids}`);
    anchors.textContent = title;
    li.style.color = 'black';
    li.append(anchors);
    containerItem.append(li);
  });
  element.append(containerItem);
  isNavCreated = true;
};

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav
addItemList(navUI);
navbarLinksListener();

// Add class 'active' to section when near top of viewport

// Scroll to anchor ID using scrollTO event
window.addEventListener('scroll', () => {
  dispatchSectionActive();
  if (window.scrollY > 0 && isScrolling) {
    headerUI.classList.remove('header_visibly');
    headerUI.classList.add('header_hidden');
  }
  isScrolling = true;
  hasScrolled(isScrolling);
});
function navbarLinksListener() {
  if (!isNavCreated) return; // Check navbar list items created before access it .
  const elements = document.querySelectorAll('#navbar__list a');
  elements.forEach(item => {
    item.classList.remove('navbar_link_active');
    item.addEventListener('click', smoothScrolling);
  });
}

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu

// Set sections as active
function activeSection(element) {
  const section = document.getElementById(element);
  const { top, bottom } = section.getBoundingClientRect();
  // get viewport height.
  const vh = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight
  );
  const isVisible = top >= 0 && bottom <= vh;
  if (isVisible) {
    section.classList.add('active');
    section.classList.remove('unactive');
  } else {
    section.classList.remove('active');
    section.classList.add('unactive');
  }
}
function dispatchSectionActive() {
  sectionsUI.forEach(item => {
    const element = item.getAttribute('id');
    // Check what section has active class then make nav item in header active for the specific section
    item.classList.contains('active')
      ? document
          .querySelector(`a[href="#${element}"]`)
          .classList.add('navbar_link_active')
      : document // remove any active link class on scrolling up or down.
          .querySelector(`a[href="#${element}"]`)
          .classList.remove('navbar_link_active');
    activeSection(element);
  });
}

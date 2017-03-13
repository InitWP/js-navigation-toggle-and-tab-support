/**
 * File js-navigation-toggle-and-tab-support.js
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
var NAMESPACENavigation = (function ($) {

	var buttons, button, menus, menu, mainMenu, subMenu, mainMenuWidth, menuOpen = false;

	function setupNavigation() {

		// Gather the (sub)menu toggle buttons and (sub)menus
		buttons = $('.mainNavigation--toggle, .mainNavigation--subMenuToggle');
		menus = $('.mainNavigation--menu, .mainNavigation--subMenu');

		// bind the click event to the menu and submenu buttons
		buttons.on('click', function (e) {
			e.preventDefault();

			// set the clicked button as active
			button = $(this);
			button.toggleClass('is-active');
			// get the menu corresponding to the clicked button
			menu = button.next('ul');
			// set the navigation state to the clicked button and corresponding menu
			setNavigationState(button, menu);

			// when it's a button for the main menu, open/close the mainmenu
			if (menu.is(mainMenu)) {
				toggleMenuSlide(button, menu);
			}
		});

		// When a menu link is clicked close the menu and reset the state
		$('a', mainMenu).on('click', function () {
			buttons.removeClass('is-active');
			setNavigationState(button, menus);
			toggleMenuSlide(button, mainMenu);
		});

		// When a menu link is focused or blurred, toggle the focus class for accessibility
		$('a', mainMenu).on('focus blur', function () {
			$('li', mainMenu).removeClass('focus');
			$(this).parent('li').addClass('focus');
		});

		// Mark submenu parents as 'aria-haspopup'
		subMenu = $('.mainNavigation--subMenu');
		subMenu.each(function (index, el) {
			$(el).parent().attr('aria-haspopup', 'true');
		});

		// Close menu and reset state when clicked outside of menu
		// Using a class instead of id so it still works when the menu is cloned to other sections
		$(document).on('click', function (e) {
			if (!$(e.target).closest('.mainNavigation').length) {
				if (buttons.hasClass('is-active')) {
					buttons.removeClass('is-active');
					setNavigationState(button, menus);
					toggleMenuSlide(button, mainMenu);
				}
			}
		});

	}

	// Set the state for a menu or a submenu
	function setNavigationState(button, menu) {
		if (button.hasClass('is-active')) {
			button.attr('aria-expanded', 'true');
			menu.attr('aria-expanded', 'true');
			menu.addClass('is-active');
		} else {
			button.attr('aria-expanded', 'false');
			menu.attr('aria-expanded', 'false');
			menu.removeClass('is-active');
		}
	}

	// Open or close the mainmenu
	function toggleMenuSlide(button, menu) {
		if (menuOpen) {
			// close it
			button.css('z-index', '1');
			menu.animate({
				'right': '-' + mainMenuWidth + 'px'
			}, 'slow', function () {
				// show other mainmenu buttons
				$('.mainNavigation--toggle').not(button).fadeIn();
			});
			menuOpen = false;
		} else {
			// hide other mainmenu buttons
			$('.mainNavigation--toggle').not(button).hide();
			// open it
			button.css('z-index', '101');
			menu.animate({
				'right': '0px'
			}, 'slow');
			menuOpen = true;
		}
	}

	// Prepare menu for first use
	function setupMenu() {
		// calculate the menu width and place it visible off the screen
		mainMenu = $('.mainNavigation--menu');
		mainMenuWidth = mainMenu.outerWidth();
		mainMenu.css('right', '-' + mainMenuWidth + 'px');
		mainMenu.show();
	}


	function init() {
		setupMenu();
		setupNavigation();
	}

	return {
		init: init
	};

})(jQuery);

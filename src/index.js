import styles from './sass/style.scss';
import $ from 'jquery';
window.jQuery = $;
window.$ = $;
import './js/integradores/lazy-map.js';
import './js/integradores-form.js';
import './js/integradores/mapa.js';
import 'popper.js';
import 'bootstrap';
import 'slick-carousel';
//import '@fortawesome/fontawesome-pro/js/all';
import {dom, library} from '@fortawesome/fontawesome-svg-core';
import { faFacebook, faFacebookF, faFacebookSquare, faWhatsapp, faTwitterSquare, faLinkedinIn, faYoutube, faGooglePlusSquare } from '@fortawesome/free-brands-svg-icons';
import { faSearch, faChevronDown, faChevronLeft, faChevronRight, faEnvelope, faPhone,
		 faSortDown, faPlay, faTimes, faComment, faCircleNotch, faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import {  } from '@fortawesome/pro-regular-svg-icons';

library.add(faSearch, faChevronDown, faChevronLeft, faChevronRight, faEnvelope, faPhone,
	faSortDown, faPlay, faTimes, faFacebookSquare, faComment, faCircleNotch, faCheckCircle,
	faFacebook, faFacebookF, faWhatsapp, faTwitterSquare, faLinkedinIn, faYoutube, faGooglePlusSquare);

dom.i2svg();
window.FontAwesomeConfig = {
	searchPseudoElements: true
}


import 'scrollreveal';
import './js/custom';
import './js/_form_calculo';
import $ from "jquery";
window.jQuery = $;
window.$ = $;
import Headroom from "headroom.js";
import ScrollReveal from "scrollreveal";
var validate = require("validate.js");

/* --------------------------
	Toast
-------------------------- */
$(".toast").toast({
  delay: 30000
});
$(window).on("load", function() {
  setTimeout(function() {
    $("#catalog-notification").toast("show");
  }, 1000);
});
/* --------------------------
	Fit images
-------------------------- */
function fitImages() {
  $(".articulo").each(function() {
    var img = $(this).find(".thumb img");
    var imgWidth = img.outerWidth();
    var imgHeight = img.outerHeight();
    if (imgWidth > imgHeight) {
      img.addClass("horizontal");
    }
  });
}
$(window).on("load", function() {
  fitImages();
});
/* --------------------------
------ Chat ------
-------------------------- */
var invitationSent = false;
$("[data-chat]").click(function(e) {
  e.preventDefault();
  var status = jivo_api.chatMode();
  if (status === "online" && !invitationSent) {
    var chat = $(this).data("chat");
    var marca = $(this).data("marca");
    if (chat === "nombre") {
      var nombre = $("#contacta").val();
      var marca = $(this).data("marca");
      if (nombre && nombre != "" && (marca && marca != "")) {
        jivo_api.setCustomData([
          {
            title: "Nombre",
            content: nombre
          },
          {
            title: "Marca",
            content: marca
          }
        ]);
        var msg =
          "Hola " +
          nombre +
          ", veo que estás interesado en nuestros productos " +
          marca +
          ", ¿cómo puedo ayudarte?";
      } else if (nombre && nombre != "") {
        jivo_api.setCustomData([
          {
            title: "Nombre",
            content: nombre
          }
        ]);
        var msg = "Hola " + nombre + ", ¿cómo puedo ayudarte?";
      }
    } else {
      var msg = "Bienvenido a Urany, ¿cómo puedo ayudarle?";
    }
    jivo_api.showProactiveInvitation(msg);
    invitationSent = true;
  } else {
    jivo_api.open();
  }
  ga("send", { hitType: "pageview", page: "/clic-cta", title: "Clic en CTA" });
});

/* --------------------------
------ Form submission ------
-------------------------- */

function revealMessage(msg, form) {
  form
    .find(".form-message")
    .html(msg)
    .addClass("open");
  setTimeout(function() {
    form
      .find(".form-message")
      .html("")
      .removeClass("open");
  }, 5000);
}

$(".contact-form").submit(function(e) {
  // Prevent the form from actually submitting
  e.preventDefault();

  var form = $(this);

  // Get the post data
  var data = $(this).serialize();

  // block multiple clicks
  form.find("input").attr("disabled", true);

  // Send it to the server
  $.post("/", data, function(response) {
    if (response.success) {
      ga("send", {
        hitType: "pageview",
        page: "/formulario-enviado",
        title: "Formulario enviado"
      });
      revealMessage(
        "Gracias por contactarnos, te contactaremos cuanto antes.",
        form
      );
    } else {
      revealMessage("Hubo un error, intenta de nuevo más tarde.", form);
    }
    form.find("input").attr("disabled", false);
  });
});

/* --------------------------
------ Mailchimp ------
-------------------------- */

$("form.newsletter").submit(function(e) {
  e.preventDefault();
  var $form = $(this);
  $.ajax({
    type: $form.attr("method"),
    url: $form.attr("action"),
    data: $form.serialize(),
    cache: false,
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    beforeSend: function() {
      $form.find('[type="submit"]').attr("disabled", true);
    },
    error: function(err) {
      console.error(err);
      alert("Ocurrió un error, inténtalo más tarde.");
    },
    success: function(data) {
      console.log(data);
      if (
        data.result == "success" ||
        data.msg.includes("a está suscrito a esta lista") ||
        data.msg.includes("is already subscribed to list")
      ) {
        if ($form.is(".newsletter-subscribe")) {
          $form.fadeOut(50);
          setTimeout(function() {
            $("#download").addClass("success");
          }, 65);
          ga("send", {
            hitType: "pageview",
            page: "/descarga-catalogo",
            title: "Descarga catalogo"
          });
        } else if ($form.is(".newsletter-subscribe-stock")) {
          $form.fadeOut(50);
          setTimeout(function() {
            $form.siblings(".download-btn").addClass("success");
          }, 65);
          ga("send", {
            hitType: "pageview",
            page: "/descarga-catalogo-stock",
            title: "Descarga catalogo stock"
          });
        } else {
          $("#modal-mailchimp").modal();
          ga("send", {
            hitType: "pageview",
            page: "/registro-mailchimp",
            title: "Registro Mailchimp"
          });
        }
      } else {
        $form.find(".mailchimp-error").html(data.msg);
      }
      $form.find('[type="submit"]').attr("disabled", false);
    }
  });
});

/* --------------------------
--------- Headroom ----------
-------------------------- */
var header = document.getElementById("main-header");
var headroom = new Headroom(header, {
  offset: $(header).height(),
  tolerance : {
        up : 5,
        down : 0
    },
  onTop: function() {
    if ($("#scroll").length) {
      $("#scroll").fadeIn(400);
    }
  },
  onNotTop: function() {
    if ($("#scroll").length) {
      $("#scroll").fadeOut(400);
    }
  }
});
headroom.init();

/* -------------------------
--------- Scroll -----------
-------------------------- */
$("#scroll").click(function() {
  $("html,body").animate(
    {
      scrollTop: $("#top-home").offset().top
    },
    800
  );
});

/* -------------------------
--------- Social share goal -----------
-------------------------- */
$(".social-goal").click(function() {
  ga("send", {
    hitType: "pageview",
    page: "/social-share",
    title: "Social share"
  });
});

/* --------------------------
------ Nav (collapse) -------
-------------------------- */
$(".navbar-collapse").on("show.bs.collapse", function() {
  $("#main-header").addClass("showing");
});
$(".navbar-collapse").on("hidden.bs.collapse", function() {
  $("#main-header").removeClass("showing");
});

/* --------------------------
------- Toggle grids --------
-------------------------- */
$("#nav-marca [data-target]").click(function() {
  var show = $(this).data("target");
  if ($(this).is(".btn-outline-primary")) {
    // toggle
    $("[data-grid],[data-info]").hide();
    $('[data-grid="' + show + '"],[data-info="' + show + '"]').fadeIn(150);
    // toggle classes
    $("#nav-marca [data-target]")
      .addClass("btn-outline-primary")
      .removeClass("btnprimary");
    $(this)
      .addClass("btn-primary")
      .removeClass("btn-outline-primary");
    // update title
    //$('#category-title').text( title );
  }
  fitImages();
});

/* --------------------------
------ Modal producto -------
-------------------------- */
$("[data-grid] [data-target]").click(function() {
  var show = $(this).data("target");
  $("#modal-marca .producto").hide();
  $('#modal-marca .producto[data-producto="' + show + '"]').show();
  $("#modal-marca").modal();
});

/* --------------------------
--------- Offcanvas ---------
-------------------------- */
$("#main-nav .hamburger").click(function() {
  $("#offcanvas").addClass("open");
});
$("#close-menu").click(function() {
  $("#offcanvas").removeClass("open");
});

$(document).mouseup(function(e) {
  var container = $("#offcanvas");
  // if the target of the click isn't the container nor a descendant of the container
  if (!container.is(e.target) && container.has(e.target).length === 0) {
    container.removeClass("open");
  }
});

$(window).on("scroll", function() {
  $("#offcanvas").removeClass("open");
});

/* --------------------------
---------- Slick -----------
-------------------------- */
$(".slick").slick({
  appendDots: $("#dots"),
  arrows: false,
  dots: true
});
$("#nextSlick").click(function() {
  $(".slick").slick("slickNext");
});
$("#prevSlick").click(function() {
  $(".slick").slick("slickPrev");
});

/* Blog */
$("#blog-top .main-slider").slick({
  appendDots: $("#blog-top .bullets"),
  dotsClass: "d-flex list-unstyled mb-1 p-2 px-md-3 mb-lg-3",
  arrows: false,
  dots: true,
  fade: true,
  responsive: [
    {
      breakpoint: 480,
      settings: {
        arrows: true,
        dots: false,
        prevArrow: $("#blog-top ul.arrows li .fa-chevron-left"),
        nextArrow: $("#blog-top ul.arrows li .fa-chevron-right")
      }
    }
  ]
});
$(".grid-slider .slider-slider").slick({
  appendDots: $(".grid-slider h2"),
  dotsClass: "d-none d-md-flex bullets list-unstyled mb-0",
  arrows: false,
  dots: true,
  slidesToShow: 3,
  slidesToScroll: 3,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        arrows: true,
        prevArrow: $(".grid-slider h2 ul li .fa-chevron-left"),
        nextArrow: $(".grid-slider h2 ul li .fa-chevron-right")
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: $(".grid-slider h2 ul li .fa-chevron-left"),
        nextArrow: $(".grid-slider h2 ul li .fa-chevron-right")
      }
    }
  ]
});

/* --------------------------
------- Scroll reveal -------
-------------------------- */
window.sr = ScrollReveal({
  origin: "bottom"
});
sr.reveal(".reveal");
sr.reveal(".reveal-left", {
  origin: "left",
  delay: 500
});
sr.reveal(".reveal-right", {
  origin: "right",
  delay: 500
});

/* --------------------------
----- Bolsa de trabajo ------
-------------------------- */

$("#bolsa-de-trabajo .card .btn").click(function(e) {
  e.preventDefault();
  var card = $(this).parents(".card");
  var title = card
    .find("h3")
    .text()
    .trim();
  $('.jumbotron [name="puesto"]').val(title);
  $("html,body").animate(
    {
      scrollTop: 0
    },
    600
  );
});

/* --------------------------
----- Catalogo ------
-------------------------- */
$("#descarga-catalogo").submit(function(e) {
  e.preventDefault();
  var mail = $(this)
    .find('[name="correo"]')
    .val();
  $(this).submit();
});

/* --------------------------
---------- Map -----------
-------------------------- */
var arrayPresencia = [
  ["Querétaro", 20.6121228, -100.480258, 1],
  ["Irapuato", 20.6774973, -101.341803, 2],
  ["Monterrey", 25.6487281, -100.4431832, 3]
];

var arrayClientes = [
  ["Aguascalientes", 21.8857347, -102.2912996, 1],
  ["Yucatán", 20.9800083, -89.7730058, 2]
];

if ($("section#mapa").length) {
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    center: new google.maps.LatLng(20.6121228, -100.480258),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
    styles: [
      {
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "water",
        stylers: [
          {
            visibility: "on"
          },
          {
            color: "#30080d"
          }
        ]
      },
      {
        featureType: "landscape",
        stylers: [
          {
            visibility: "on"
          },
          {
            color: "#881626"
          }
        ]
      },
      {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [
          {
            visibility: "on"
          },
          {
            color: "#30080d"
          },
          {
            weight: 1
          }
        ]
      },
      {
        featureType: "administrative.country",
        elementType: "labels",
        stylers: [
          {
            visibility: "on"
          },
          {
            color: "#e2c5c9"
          },
          {
            weight: 0.2
          }
        ]
      }
    ]
  });

  var infowindow = new google.maps.InfoWindow();

  var marker, i;

  for (i = 0; i < arrayPresencia.length; i++) {
    var pinIcon = new google.maps.MarkerImage(
      "/assets/img/marker1.png",
      null, // size is determined at runtime
      null, // origin is 0,0
      null, // anchor is bottom center of the scaled image
      new google.maps.Size(25, 16)
    );
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(
        arrayPresencia[i][1],
        arrayPresencia[i][2]
      ),
      map: map,
      icon: pinIcon
    });

    google.maps.event.addListener(
      marker,
      "click",
      (function(marker, i) {
        return function() {
          infowindow.setContent(arrayPresencia[i][0]);
          infowindow.open(map, marker);
        };
      })(marker, i)
    );
  }

  for (i = 0; i < arrayClientes.length; i++) {
    var pinIcon = new google.maps.MarkerImage(
      "/assets/img/marker2.png",
      null, // size is determined at runtime
      null, // origin is 0,0
      null, // anchor is bottom center of the scaled image
      new google.maps.Size(25, 25)
    );
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(
        arrayClientes[i][1],
        arrayClientes[i][2]
      ),
      map: map,
      icon: pinIcon
    });

    google.maps.event.addListener(
      marker,
      "click",
      (function(marker, i) {
        return function() {
          infowindow.setContent(arrayClientes[i][0]);
          infowindow.open(map, marker);
        };
      })(marker, i)
    );
  }
}

/* --------------------------
------ Nav (search) -------
-------------------------- */
$(document).on("click", ".toggle-search", function() {
  $("#main-nav").toggleClass("search");
  $("#buscar_nav").fadeToggle(150);
});


/* --------------------------
------ Hover landing cálculo -------
-------------------------- */
$('.hover-calculo').on('mouseenter',function(){
  $('.hover-calculo').removeClass('active');
  $(this).addClass('active');
});

/* --------------------------
------ Scroll body to -------
------ general function that will work with any anchor link -------
------ add anchor link as normally -------
------ add class "scroll_to" to element -------
-------------------------- */
$(".scroll_to").on('click', function (event) {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top + 70
    }, 500);
});

var slideLeft = {
    distance: '150%',
    origin: 'right',
    opacity: null
};
var slideRight = {
    distance: '150%',
    origin: 'left',
    opacity: null
};
var slideUp = {
    distance: '1000%',
    origin: 'bottom',
    opacity: null
};
ScrollReveal().reveal('.slide-left', slideLeft);
ScrollReveal().reveal('.slide-right', slideRight);
ScrollReveal().reveal('.slide-up', slideUp);

//# sourceMappingURL=app.js.map

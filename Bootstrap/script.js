// ? Search box animation toggler
$("#search-btn").click(function (e) {
  e.preventDefault();
  if ($(document).width() >= 768) {
    $("#searchbox").parent().removeClass("visible-xs");
    $("#searchbox").addClass("slide-left");
  }
});

// ? Carousel current thumbnail selector
var scrollAmount = 0;
var scrollStep = 90;

function removeActiveSelectedThumbnail() {
  $(".carousel-thumbnail.carousel-active").removeClass("carousel-active");
}

$(".carousel-thumbnail").click(function () {
  removeActiveSelectedThumbnail();
  $(this).addClass("carousel-active");
});

function scrollThumbnails(toLeft = false, scrollNumber) {
  scrollAmount += toLeft ? -scrollNumber : scrollNumber;
  $(".carousel .carousel-images").scrollLeft(scrollAmount);
}

$(".carousel .next-btn, .carousel .prev-btn").click(function () {
  var isNext = $(this).hasClass("next-btn");
  var $activeThumb = $(".carousel-thumbnail.carousel-active");
  var $newActiveThumb = isNext ? $activeThumb.next() : $activeThumb.prev();

  if ($newActiveThumb.length) {
    removeActiveSelectedThumbnail();
    $newActiveThumb.addClass("carousel-active");
    scrollThumbnails(!isNext, scrollStep);

    $(".carousel .prev-btn").prop("disabled", !$newActiveThumb.prev().length);
    $(".carousel .next-btn").prop("disabled", !$newActiveThumb.next().length);
  }
});

// ? Automatic rating based on given no of stars
$(function () {
  var starscount = $("#rating-stars").data("stars");
  $("#rating-stars").children().slice(starscount).addClass("empty");
});

//? Product shades main selected
$(".product").click(function () {
  $(".product.product-active").removeClass("product-active");
  $(this).addClass("product-active");
});

// ? Increment and decrement product quantity
var $quantity = $("#quantitybox");

$(".product-btns .decrement-btn").click(function () {
  if ($quantity.val() != 1) {
    $quantity.val(Number.parseInt($quantity.val()) - 1);
  }
});

$(".product-btns .increment-btn").click(function () {
  $quantity.val(Number.parseInt($quantity.val()) + 1);
});

// ? Product Wishlist hover
function changeColor(colorname) {
  $(".product-add-wishlist .fa-heart")
    .toggleClass("fa-regular")
    .toggleClass("fa-solid")
    .css("color", colorname);
}

$(".product-add-wishlist .link-underline").on("mouseover", function () {
  changeColor("red");
});

$(".product-add-wishlist .link-underline").on("mouseleave", function () {
  changeColor("inherit");
});

// ? Automatic scrolling on mousewheel
$(function () {
  function stopBodyScrolling(toStop) {
    var current = $(window).scrollTop();

    if (toStop) {
      $(window).scroll(function () {
        $(window).scrollTop(current);
      });
      return;
    }
    $(window).off("scroll");
  }

  var scrollThrough = 0;

  function scrollImagesOnMouseWheel(toLeft = false) {
    var container = $(".carousel-images");
    var maxScroll = container[0].scrollWidth - container.width();
    if (toLeft) {
      scrollThrough = Math.max(0, scrollThrough - 100);
    } else {
      scrollThrough = Math.min(maxScroll, scrollThrough + 100);
    }
    container.scrollLeft(scrollThrough);
  }

  $(".carousel-images").on("wheel", function (e) {
    stopBodyScrolling(true);
    if (e.originalEvent.wheelDelta / 120 > 0) {
      scrollImagesOnMouseWheel(true);
    } else {
      scrollImagesOnMouseWheel(false);
    }
    e.preventDefault();
  });

  $(".carousel-images").on("mouseleave", function (e) {
    stopBodyScrolling(false);
  });
});

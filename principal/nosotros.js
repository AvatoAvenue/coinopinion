$(document).ready(function(){
    $('.image-slider').slick({
        autoplay: true,           // Enable autoplay
        autoplaySpeed: 5000,      // Set autoplay speed to 5 seconds
        arrows: true,             // Show arrow navigation
        dots: true,               // Show pagination dots
        infinite: true,           // Infinite loop
        speed: 500,               // Transition speed (milliseconds)
        fade: true,               // Use fade effect for transitions
        prevArrow: '<button type="button" class="slick-prev">Anterior</button>',
        nextArrow: '<button type="button" class="slick-next">Siguiente</button>'
    });
});

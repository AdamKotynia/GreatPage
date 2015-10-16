    function visible(foo) {
        var e = document.getElementById(foo);
        e.style.display = 'block';
    }

function invisible(name) {
    var e = document.getElementById(name);
    e.style.display = 'none';

}


$(window).ready(function() {
    $(".small_photo").click(function () {
        console.log(this)
        $("#large_photo_image").attr("src", "images/content1.jpg");
    })
});
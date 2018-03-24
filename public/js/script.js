$(document).ready(function() {
    $('#summernote').summernote({
        tabsize: 2,
        height: 250
    });

    setTimeout(function(){
        $(".alert").alert('close');
    }, 3000);
});

function enableBtn(){
    $('#insertq-sub-btn').removeAttr('disabled')
}
// refesh mieu ta /n
function enterDes() {
    $('.mt').map(function (i, mt) {
        // console.log($(mt).text());
        $(mt).html($(mt).text().replace(/\n/g, '<br/>'));
    });
}

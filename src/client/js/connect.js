$().ready(function() {
    var connectInput = document.getElementById('connect-input');
    var connectButton = document.getElementById('connect-button');

    var currServer = cookies.getCookie('server');
    if(currServer.length > 0)
        connectInput.value = currServer;

    connectButton.onclick = function() {
        cookies.setCookie('server', connectInput.value, 14);
        console.log('server set to ' + cookies.getCookie('server'));
        demo.errorNotification();
    }
})
window.addEventListener('load', event => {
   
    // Código para mostrar uma mensagem para instalar como um app no desktop
    var buttonInstallApp = document.getElementById('buttonInstallApp');
    buttonInstallApp.style.display = 'none';

    var deferredPrompt;

    window.addEventListener('beforeinstallprompt', event => {
        event.preventDefault();         // Prevents immediate prompt display
        deferredPrompt = event;

        buttonInstallApp.style.display = 'initial';

        buttonInstallApp.addEventListener('click', () => {
            buttonInstallApp.style.display = 'none';
            deferredPrompt.prompt();
        });

        deferredPrompt.userChoice.then(function(choiceResult) {
            if(choiceResult.outcome == 'dismissed') {
                //console.log('Usuário não aceitou a instalação');
            }
            else {
                //console.log('Usuário aceitou a instalou');
            }
            deferredPrompt = null;
        });
    });
    window.onappinstalled = function() {
        console.log('👍', 'Obrigado por instalar nosso app!');
    };
    window.addEventListener('appinstalled', event => {
        console.log('👍', 'app instalado', event);
    });
});
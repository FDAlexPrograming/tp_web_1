"use strict";

function activar(){
    let captcha = '';
    function generarCaptcha() {
        let cantLetras = 'ABCDE5FGHIJKLMNOPQRSTUVWXYZ';               // se genera aleatoriamente 5 letras para el captcha
        for (let i = 0; i < 5; i++) {
            captcha += cantLetras.charAt(Math.random() * cantLetras.length);
        }
        document.getElementById("captcha-main").innerHTML = captcha;
    }
    generarCaptcha();

    document.getElementById("refresh").addEventListener("click", refrescar)
    function refrescar() {
        captcha = '';
        generarCaptcha();
        document.getElementById("captcha-main").innerHTML = captcha;
    };

    document.getElementById("btn-captcha").addEventListener("click", function (e) {
        let capt_usuario = document.getElementById("captcha-usuario").value;
        if (capt_usuario == captcha) {
            document.getElementById("alert-captcha").innerHTML = ("Captcha  correcto");
            document.getElementById("btn-enviar").classList.add("correct_captcha");
            document.getElementById("btn-enviar").classList.remove("incorrect_captcha");
        }
        else {
            document.getElementById("alert-captcha").innerHTML = ("Captcha  incorrecto");
            document.getElementById("btn-enviar").classList.add("incorrect_captcha");
            document.getElementById("btn-enviar").classList.remove("correct_captcha");
            refrescar()
        }
    });
}
activar();

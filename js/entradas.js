"use strict";

function activar() {

    let url = 'https://60ccfdeb71b73400171f8dba.mockapi.io/boletos';
    let tablaDom = document.querySelector(".filas");
    let info_pago = document.getElementById("total_pagar_y_alert");
    let spiner = document.querySelector(".spiner");
    let multiuso = document.getElementById("multiuso");

    document.getElementById("btn-comprar-3").addEventListener("click", (e) => {
        let contador = 3;
        setInterval(async () => {
            if (contador > 0) { await agregar(e); contador--; }
        }, 2000);
    });

    let formData = document.querySelector(".form_boletos");
    form.addEventListener("submit", agregar);

    async function agregar(e) {
        e.preventDefault();
        formData = new FormData(form);
        let equipo = formData.get("equipo");
        let cantidad = formData.get("cantidad");
        let boletoNuevo = {
            "equipo": equipo,
            "cantidad": Number(cantidad),
            "precio": precio(equipo)
        }
        if (cantidad > 0 && cantidad < 11) {
            try {
                spiner.classList.add("spiner-on");
                let resp = await fetch(`${url}`, {
                    "method": "POST",
                    "headers": { "Content-type": "application/json" },
                    "body": JSON.stringify(boletoNuevo)
                })
                if (resp.status == 201) {
                    console.log("agregado");
                }
                else {
                    reintentar(info_pago);
                }
            }
            catch (error) {
                console.log("error" + error);
            }
            spiner.classList.remove("spiner-on");
            mostrar();
        }
        else {
            info_pago.innerHTML = "Por favor ingrese una cantidad de 1 a 10";
        }
    }

    let tabla = [];
    let ini = 1;
    async function mostrar() {
        try {
            let response = await fetch(`${url}?page=${ini}&limit=15`);
            if (response.ok) {
                tabla = await response.json();
                console.log(tabla);
                multiuso.innerHTML = "";
                tablaDom.innerHTML = "";
                for (const item of tabla) {
                    iterar(item);
                }
                cant_a_pagar();
                darEvento();
            }
        }
        catch (error) {
            console.log("error" + error);
        };
    }
    mostrar();

    document.getElementById("btn-siguiente").addEventListener("click", () => {
        if (tabla.length == 15) { ini++; mostrar() }
    });

    document.getElementById("btn-anterior").addEventListener("click", () => {
        if (ini != 1) { ini--; mostrar(); }
    });

    function iterar(item) {
        let editar = `<button data-name="${item.id}"type="button"class="btn-editar"><i class="far fa-edit"></i></button>`;
        let borrar = `<button data-name="${item.id}"type="button"class="btn"><i class="fas fa-trash-alt"></i></button>`;
        tablaDom.innerHTML += `${editar}${borrar}` + `${item.precio != 3000 ? ` <tr class= "destacado">
                                        <td >${item.equipo} </td>
                                        <td >${item.cantidad} </td>
                                        <td >${item.precio} </td> </tr>
                                        `:
                                        `<tr "><td>${item.equipo}</td>
                                        <td>${item.cantidad}</td>
                                        <td>${item.precio} </td> </tr>`} `;
    }

    function darEvento() {
        document.querySelectorAll(".btn").forEach(b => b.addEventListener("click", borrar));
        document.querySelectorAll(".btn-editar").forEach(b => b.addEventListener("click", formEditar));
    }

    async function traerForm() {
        try {
            let response = await fetch(`modificar.html`)
            if (response.ok) {
                let formulario = await response.text();
                multiuso.innerHTML = formulario;
                multiuso.classList.remove("animacion-entrar");
                multiuso.classList.remove("animacion-salir");
            }
        }
        catch (error) {
            console.log("error" + error);
        };
    }

    async function formEditar(e) {
        e.preventDefault();
        await traerForm();
        let buton = document.querySelector(".btn-modificar");
        buton.dataset.name = this.dataset.name;
        buton.innerHTML = "Modificar";
        buton.addEventListener("click", modificar);
    }

    async function modificar(e) {
        e.preventDefault();
        let equipo = document.getElementById("editar-equipo").value
        let cantidad = document.getElementById("editar-cantidad").value
        let boleto = {
            "equipo": equipo,
            "cantidad": Number(cantidad),
            "precio": precio(equipo)
        }
        if ((cantidad > 0 && cantidad < 11) && (equipo != "Elegir Equipo")) {
            try {
                let resp = await fetch(`${url}/${this.dataset.name}`, {
                    "method": "PUT",
                    "headers": { "Content-type": "application/json" },
                    "body": JSON.stringify(boleto)
                });
                if (resp.ok) {
                    multiuso.classList.add("animacion-salir");
                }
            }
            catch (error) {
                console.log(error);
            }
            mostrar();
        }
        else {
            multiuso.classList.add("animacion-entrar");
            multiuso.innerHTML = "Por favor ingrese un equipo y una cantidad valida";
        }
    }

    document.getElementById("filtro").addEventListener("click", async () => {
        await traerForm();
        let buton_filtrar = document.querySelector(".btn-modificar");
        buton_filtrar.innerHTML = "Filtar";
        buton_filtrar.addEventListener("click", (e) => {
            e.preventDefault();
            let filtarEquipoo = document.getElementById("editar-equipo").value;
            let filtrarCantidad = document.getElementById("editar-cantidad").value;
            tablaDom.innerHTML = "";
            for (const item of tabla) {
                if (filtarEquipoo == `${item.equipo}` || filtrarCantidad == `${item.cantidad}`) {
                    iterar(item);
                }
            }
            darEvento();
        });
    });
    async function borrar(e) {
        e.preventDefault();
        try {
            multiuso.innerHTML = "";
            multiuso.classList.add("spiner-on");
            let resp = await fetch(`${url}/${this.dataset.name}`, {
                "method": "DELETE",
            });
            multiuso.classList.remove("spiner-on");
            if (resp.ok) {
                multiuso.innerHTML = "";
                mostrar();
            } else {
                reintentar(multiuso);
            }
        }
        catch (error) {
            console.log("error" + error);
        }
    }

    async function reintentar(contenedor) {
        let contador = 6;
        let interval = setInterval(() => {
            contador = --contador
            contenedor.innerHTML = `Por favor espere...${contador} si el problema persiste, actualice la página`;
            if (contador == -1) {
                clearInterval(interval);
                contenedor.innerHTML = "";
            }
        }, 1000);
        mostrar();
    }

    function precio(equipo) {
        let descuento = 3000;
        if ((equipo == "Boca Junior") || (equipo == "River Plate") || (equipo == "Olímpo") || (equipo == "Huracán")) {
            descuento = 2500;
        }
        return descuento;
    }

    function cant_a_pagar() {
        let totalApagar = 0;
        for (const item of tabla) {
            totalApagar += item.cantidad * item.precio;
        }
        info_pago.innerHTML = "Total a pagar " + totalApagar;
    }

    document.querySelector(".btn-tabla").addEventListener("click", () => { mostrar(); });

}


activar();


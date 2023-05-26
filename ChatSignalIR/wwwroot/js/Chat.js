const connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();
let userName = "";
const d = document, $inputMensaje = d.querySelector(".message ");
const registro = "Register";
const envioMensaje = "SendMessage";
const listaUsuarios = "UsersList";
d.getElementById("sendButton").disabled = true;



connection.on(registro,
    async (userName, message) => {
        await crearMensage(userName, message, null, 3);
    });

connection.on(listaUsuarios,(lista) => crearListaUsuarios(lista));


connection.on(envioMensaje,
    async (userName, message, fecha) => {
        await crearMensage(userName, message, formatoFecha(fecha), 2);
});

connection.start()
    .then(() => {
        d.getElementById("sendButton").disabled = false;
    })
    .catch((err) => {
        return (console.log(`${err.toString()}`));
    });

const formatoFecha = (fecha) => {

    let time;
    fecha === null
        ? time = new Date()
        : time = new Date(fecha);
    let hora = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return hora;
}

const ingresarChat = () => {
    const usernameinput = d.getElementById("username").value;
    if (usernameinput === "") {
        alert("Ingrese Nombre");
        return;
    }
    connection.invoke(registro, usernameinput);
    d.getElementById("userinfo").setAttribute("hidden", "hidden");;
    d.querySelector(".pantallaChat").removeAttribute("hidden", "hidden");
    connection.invoke(listaUsuarios);
    
};
const crearMensage = (userName, message, hora, flagMensaje) => {


    let li;
    if (flagMensaje === 3) {

        li =
            `<div class="d-flex flex-column justify-content-center">
                    <div class="text-white small samll p-2 rounded">${userName} : ${message}
                    </div>
            </div>`;

    } else {

        li = `<li class="d-flex flex-column m-2 ${flagMensaje === 1 ? "align-items-end " : "  align-items-start"}">
                    <div class="${flagMensaje === 1 ? " bg-info text-white" : "bg-secondary text-light"} p-1 rounded"> ${userName} : ${message} 
                    </div>
                    <span class="small bg-dark text-white small small rounded text-dark" > a las ${hora}</span>
            </li>`;

    }

    d.querySelector("#messsageList").insertAdjacentHTML("beforeend", li);

};

const crearListaUsuarios = (lista) => {

    const participantes = Object.values(lista);
    let elementos = "";
    d.querySelector("#ListaParticipantes").innerHTML = "";

    participantes.forEach((e) => {

        elementos += `<li class="d-flex flex-column m-2 align-items-start">
                        <i class="far fa-user-circle"> <span class="text-withe">${e}</span></i>
                    </li >`;
      
        //elementos += `<li class="bg-dark text-white small far fa-user-circle"> ${e} </li>`;
    });
    console.log(elementos);
    d.querySelector("#ListaParticipantes").insertAdjacentHTML("beforeend", elementos);
}

const enviarMensaje = async () => {
    const message = $inputMensaje.value;
    if ($inputMensaje.value === "") {
        return false;
    }
    
    await connection.invoke(envioMensaje, userName, message)
        .then(() => {
            $inputMensaje.value = "";
        }).then(crearMensage("Tu", message, formatoFecha(null), 1))
        .catch((err) => console.log(`${err.toString()}`));
}
d.getElementById("sendButton").addEventListener("click", enviarMensaje);

d.addEventListener("click", (e) => {
    if (e.target.matches(".btn-info")) {
        ingresarChat();
    }
});

$inputMensaje.addEventListener("keypress", (e) => {
    if (e.charCode === 13) {
        userName = d.getElementById("username").value;
        enviarMensaje();
    }
});

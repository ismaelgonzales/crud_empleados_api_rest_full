const $d = document;
const $table = $d.querySelector(".crud-table");
const $form = $d.querySelector(".crud-form");
const $title = $d.querySelector(".crud-title");
const $template = $d.getElementById("crud-template").content;
const $fragement = $d.createDocumentFragment();

const getAll = async () => {
    try {
        let res = await axios.get("http://localhost:1337/api/empleados");
        let json = await res.data;

        // Limpiar la tabla antes de agregar nuevos datos
        $table.querySelector("tbody").innerHTML = "";

        // Recorrer los datos dentro de "data"
        json.data.forEach(el => {
            $template.querySelector(".name").textContent = el.nombre;
            $template.querySelector(".posicion").textContent = el.posicion;
            $template.querySelector(".departamento").textContent = el.departamento;
            $template.querySelector(".edit").dataset.documentId = el.documentId; // Usar documentId
            $template.querySelector(".edit").dataset.nombre = el.nombre;
            $template.querySelector(".edit").dataset.posicion = el.posicion;
            $template.querySelector(".edit").dataset.departamento = el.departamento;
            $template.querySelector(".delete").dataset.documentId = el.documentId; // Usar documentId

            let $clone = $d.importNode($template, true);
            $fragement.appendChild($clone);
        });

        $table.querySelector("tbody").appendChild($fragement);
    } catch (error) {
        let message = error.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML("afterend", `<p>Error: ${error.status}: ${message}</p>`);
    }
};

$d.addEventListener("DOMContentLoaded", getAll);

$d.addEventListener("submit", async e => {
    if (e.target === $form) {
        e.preventDefault();

        if (!e.target.documentId.value) {
            // Crear un nuevo empleado
            try {
                let options = {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    data: JSON.stringify({
                        data: {
                            nombre: e.target.nombre.value,
                            posicion: e.target.posicion.value,
                            departamento: e.target.departamento.value
                        }
                    })
                };

                let res = await axios("http://localhost:1337/api/empleados", options);
                let json = await res.data;

                location.reload();
            } catch (error) {
                let message = error.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p>Error: ${error.status}: ${message}</p>`);
            }
        } else {
            // Actualizar un empleado existente
            try {
                let options = {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    data: JSON.stringify({
                        data: {
                            nombre: e.target.nombre.value,
                            posicion: e.target.posicion.value,
                            departamento: e.target.departamento.value
                        }
                    })
                };

                let res = await axios(`http://localhost:1337/api/empleados/${e.target.documentId.value}`, options);
                let json = await res.data;

                location.reload();
            } catch (error) {
                let message = error.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p>Error: ${error.status}: ${message}</p>`);
            }
        }
    }
});

$d.addEventListener("click", async e => {
    if (e.target.matches(".edit")) {
        // Llenar el formulario con los datos del empleado a editar
        $title.textContent = "EDITAR EMPLEADO";
        $form.nombre.value = e.target.dataset.nombre;
        $form.posicion.value = e.target.dataset.posicion;
        $form.departamento.value = e.target.dataset.departamento;
        $form.documentId.value = e.target.dataset.documentId; // Usar documentId
    }

    if (e.target.matches(".delete")) {
        // Eliminar un empleado
        let confirmacion = confirm("¿Estás seguro que deseas eliminar el elemento seleccionado?");

        if (confirmacion) {
            try {
                let options = {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    }
                };

                let res = await axios(`http://localhost:1337/api/empleados/${e.target.dataset.documentId}`, options);
                let json = await res.data;

                location.reload();
            } catch (error) {
                let message = error.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p>Error: ${error.status}: ${message}</p>`);
            }
        }
    }
});
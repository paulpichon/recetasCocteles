//inicio de app
function iniciarApp() {
    
    //variables
    const selectCategorias = document.querySelector('#categorias');
    //resultados
    const resultados = document.querySelector('#resultados');
    //instanciar modal
    const modal = new bootstrap.Modal('#modal', {});

    //listener al select
    selectCategorias.addEventListener('change', categoriaSeleccionada);

    //llamar funcion para obtener categorias
    obtenerCategorias();

    //funcion para obtener las categorias de recetas de cocteles
    function obtenerCategorias() {
        //url categorias
        const url = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';

        //fetch
        fetch( url )
            .then( respuesta => respuesta.json() )
                .then( resultado => mostrarCategorias( resultado.drinks ) )
    }
    //funcion para mostrar las categorias en el select
    function mostrarCategorias( categorias = [] ) {
        //iterar las categorias
        categorias.forEach( categoria => {
            //destructuring
            const { strCategory } = categoria;
            //html
            const option = document.createElement('OPTION');
            //value
            option.value = strCategory;
            //textcontent
            option.textContent = strCategory;
            //renderizar
            selectCategorias.appendChild( option );

        });
    }
    //funcion que muestra las recetas de la categoria seleccionada
    function categoriaSeleccionada( e ) {
        //detectar el evento del change
        const categoria = e.target.value;

        //url del end point para traer las recetas en base a la categoria seleccionada
        const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${ categoria }`;
        
        fetch( url )
            .then( respuesta => respuesta.json() )
                .then( resultado => mostrarRecetas( resultado.drinks ) )

    }
    //renderizar las recetas
    function mostrarRecetas( recetas = [] ) {

        //limpiar el html anterior
        limpiarHTML( resultados );

        //heading resultados
        //<h2 class="classH2 d-flex justify-content-center mt-5 mb-5"><strong>Resultados</strong></h2>
        const headingResultados = document.createElement('H2');
        headingResultados.classList.add('classH2', 'd-flex', 'justify-content-center', 'mt-5', 'mb-5');
        headingResultados.textContent = recetas.length ? 'Resultados' : 'No hay resultados';

        //renderizar
        resultados.appendChild( headingResultados );

        //iterar las recetas
        recetas.forEach( receta => {
            //destructuring
            const { idDrink, strDrink, strDrinkThumb } = receta;
            //html
            //contenedor
            const divContenedor = document.createElement('DIV');
            //estilo
            divContenedor.classList.add('contenedor', 'col-md-4', 'mt-3', 'mb-3');

            //card
            const divCard = document.createElement('DIV');
            divCard.classList.add('card', 'cardPading');

            //imagen
            const imagenCard = document.createElement('IMG');
            imagenCard.classList.add('card-img-top');
            imagenCard.alt = `Imagen del coctel ${ strDrink }`;
            imagenCard.src = strDrinkThumb;

            //cardBody
            const divCardBody = document.createElement('DIV');
            divCardBody.classList.add('card-body', 'text-center');

            //heading
            const cardHeading = document.createElement('H2');
            cardHeading.classList.add('card-title', 'mt-3', 'mb-4');
            cardHeading.textContent = strDrink;

            //boton ver  receta
            const btnVerReceta = document.createElement('BUTTON');
            btnVerReceta.classList.add('btn', 'btn-info', 'w-100');
            btnVerReceta.textContent = 'Ver Receta';
            //abrir modal
            btnVerReceta.onclick = function() {
                //funcion para mostrar informacion en el modal
                obtenerRecetaSeleccionada( idDrink );
            }

            //insertar
            //card body
            divCardBody.appendChild( cardHeading );
            divCardBody.appendChild( btnVerReceta );

            //card
            divCard.appendChild( imagenCard );
            divCard.appendChild( divCardBody );

            //divContenedor
            divContenedor.appendChild( divCard );
            
            //renderizar
            resultados.appendChild( divContenedor );

        });
    }
    //funcion para mostrar informacion en el modal
    function obtenerRecetaSeleccionada( id ) {
        //url de la receta seleccionada
        const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${ id }`;

        fetch( url )
            .then( respuesta => respuesta.json() )
                .then( resultado => mostrarRecetaModal( resultado.drinks[0] ) )

    }
    //funcion para mostrar la informacion en el modal
    function mostrarRecetaModal( receta ) {
        //destructuring
        const { idDrink, strDrink, strDrinkThumb, strInstructions } = receta;

        //const 
        const modalTitulo = document.querySelector('.modal .modal-title');
        const modalBody = document.querySelector('.modal .modal-body');

        //insertar
        //titulo
        modalTitulo.textContent = strDrink;
        //body
        modalBody.innerHTML = `
            <img class="card-img-top" src="${ strDrinkThumb }" alt="${ strDrink }" >
            <h5 class="card-title mt-4 mb-3">Ingredientes y cantidades</h5>
        `;

        //mostrar ingredientes
        const listGroup = document.createElement('UL');
        listGroup.classList.add('list-group');

        for( let i = 1; i <= 20; i++ ) {
            if (receta[`strIngredient${i}`]) {
                //ingredientes
                const ingrediente = receta[`strIngredient${i}`];
                //cantidades
                const cantidad = receta[`strMeasure${i}`];

                //crear LI
                const ingredienteLi = document.createElement('LI');
                ingredienteLi.textContent = `${ingrediente} - ${cantidad}`;
                ingredienteLi.classList.add('list-group-item');
                
                //insertar ingredienteLi a listGroup
                listGroup.appendChild( ingredienteLi );

            }
        }
        //renderizar listGroup a modalBody
        modalBody.appendChild( listGroup );

        //crear el card body
        const cardBody = document.createElement('DIV');
        cardBody.classList.add('card-body');
        cardBody.innerHTML = `
            <h5 class="card-title mt-4 mb-3">Instrucciones</h5>
            <p>${strInstructions}</p>
        `;

        //renderizar
        modalBody.appendChild( cardBody );

        //botones
        //selector
        const modalFooter = document.querySelector('.modal-footer');
        //limpiar botones
        limpiarHTML( modalFooter );

        //boton guardar favorito
        const btnGuardarFavorito = document.createElement('BUTTON');
        btnGuardarFavorito.classList.add('btn', 'btn-danger', 'w-100');
        btnGuardarFavorito.textContent = 'Agregar Favorito';
        //agregar funcion a guardar favorito
        btnGuardarFavorito.onclick = function() {
            //funcion para guardar favorito
            //pasamos un objeto como argumento
            guardarFavorito({
                id: idDrink,
                titulo: strDrink,
                img: strDrinkThumb
            });
        }

        //boton cerrar
        const btnCerrarModal = document.createElement('BUTTON');
        btnCerrarModal.classList.add('btn', 'btn-secondary', 'w-100');
        btnCerrarModal.textContent = 'Cerrar';
        //cerrar modal
        btnCerrarModal.onclick = function() {
            modal.hide();
        }


        //enderizar botones
        modalFooter.appendChild( btnGuardarFavorito );
        modalFooter.appendChild( btnCerrarModal );


        //mostrar modal
        modal.show();

    }

    //funcion para guardar favorito
    function guardarFavorito( receta ) {
        //obtener storage
        //en caso de que no haya sera un arreglo vacio
        const favoritos = JSON.parse( localStorage.getItem('favoritosCocteles') ) ?? [];
        //guardar en local storage
        localStorage.setItem('favoritosCocteles', JSON.stringify([...favoritos, receta]));
    }

    //limpiar el html anterior
    function limpiarHTML( selector ) {
        while( selector.firstChild ) {
            selector.removeChild( selector.firstChild );
        }
    }
}


//listener al documento
document.addEventListener('DOMContentLoaded', iniciarApp);

let msg = '%c Extension cargada'; 
let styles= [ 
	'font-size: 12px', 
	'font-family: monospace', 
	'background: black', 
	'display: inline-block', 
	'color: green', 
	'padding: 8px 19px', 
	'border: 1px dashed;' 
].join(';');
console.log(msg, styles);

// este interval sirve para reactivar el click derecho de sofia pero... creo que causa lag despues de un rato (lo cual es curioso por que solo corre cada 3 seg)
// setInterval(() => {
// 	if(document.getElementById('contenido')){
// 		if(document.getElementById('contenido').contentDocument.oncontextmenu !== null){
// 			document.getElementById('contenido').contentDocument.oncontextmenu = null;
// 			console.log('se habilito el click derecho');
// 		}
// 	}
// }, 3_000);


// universal compatibility
this.browser = (function () {
	return this.msBrowser || this.browser || this.chrome;
})();

//--------------------------------------------------------------------------------------
// Bellow here its the fun code
//--------------------------------------------------------------------------------------
function primeraLetraMayuscula(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function calculateContractTime(data){
	// calculo basico (solo meses y año), puede ser mas preciso si me proporciona mas informacion...
	//dd/mm/aaaa
	let mesInicio = data.contrato_fecha_inicio.split('/');
	let mesFin = data.contrato_fecha_fin.split('/');

	//solo necesitamos el año y el mes para el calculo
	let numberOfMonths = 0;
	let year1 = mesFin[2];
	let month1 = mesFin[1];
	let year2 = mesInicio[2];
	let month2 = mesInicio[1];

	// 1.If you want just the number of the months between the two dates excluding both month1 and month2
	// numberOfMonths = (year2 - year1) * 12 + (month2 - month1) - 1;
	
	// 3.If you want to include both of the months
	// numberOfMonths = (year2 - year1) * 12 + (month2 - month1) + 1;

	// 2.If you want to include either of the months
	numberOfMonths = (year2 - year1) * 12 + (month2 - month1);

	// ((numero de meses * cantidad de horas al mes) + margen de error)
	// esto retorna un valor positivo si la fecha 1 es mayor, de lo contario sera negativo - en este caso usaremos el valor absoluto para solventar en caso de negativos
	numberOfMonths = Math.abs(numberOfMonths);
	return ((numberOfMonths * 160) + 60);
}

function pasteData(data){
	// ya que sofia usa iframes, toca obtener el HTMLDocument del iframe para acceder al formulario
	let sofiaDocument = document.getElementById('contenido');
	if(sofiaDocument !== null){
		sofiaDocument = sofiaDocument.contentDocument;
		sofiaDocument.getElementById('form1:txtNumeroContrato').value = data.contrato;
		sofiaDocument.getElementById('form1:txtHoraContratada').value = calculateContractTime(data);
		sofiaDocument.getElementById('txtCalendarFechaInicial').value = data.contrato_fecha_inicio;
		sofiaDocument.getElementById('txtCalendarFechaFinal').value = data.contrato_fecha_fin;
	}else{
		// console.warn('La opcion elegida en la extension no es compatible con la parte de SOFIA en la que se encuentra');
		console.error('La opcion elegida en la extension no es compatible con la parte de SOFIA en la que se encuentra');
	}
	
	// console.group('user');
	// console.log(data.contrato);
	// console.log(calculateContractTime(data));
	// console.log(data.contrato_fecha_inicio);
	// console.log(data.contrato_fecha_fin);
	// console.groupEnd('user');
}

function completeFields(){
	let sofiaDocument = document.getElementById('contenido');
	if(sofiaDocument !== null){
		sofiaDocument = sofiaDocument.contentDocument;
		let select = sofiaDocument.querySelector('#tipoOferta');
		select.value = '-1';
		select.onchange();
		
		let fecha1 = sofiaDocument.querySelector('#fechaInicio');
		let fecha2 = sofiaDocument.querySelector('#fechaFin');

		const today = new Date();
		let diaActual = today.getDate();
		let mesActual = today.getMonth() + 1;
		let añoActual = today.getFullYear();

		let fechaInicio = `${diaActual}/${mesActual}/${añoActual}`;
		let fechaFin = `${diaActual}/${mesActual}/${añoActual}`;

		fecha1.value = fechaInicio;
		fecha2.value = fechaFin;

		let select2 = sofiaDocument.getElementById('form1:selEstado');
		select2.value = '5';
	}else{
		// console.warn('La opcion elegida en la extension no es compatible con la parte de SOFIA en la que se encuentra');
		console.error('La opcion elegida en la extension no es compatible con la parte de SOFIA en la que se encuentra');
	}
}

function completeFieldsPaso4(){
	let sofiaDocument = document.getElementById('contenido');
	if(sofiaDocument !== null){
		sofiaDocument = sofiaDocument.contentDocument;
		let select = sofiaDocument.getElementById('frmPrincipal:eventos');
		select.value = '2';
		// select.onchange();
		
		let campotext = sofiaDocument.getElementById('frmPrincipal:areaDescripcionEvento');
		campotext.value = 'INSCRIPCIÓN CURSO ESPECIAL FICHA: ';

		let campotext2 = sofiaDocument.getElementById('frmPrincipal:responsable');
		campotext2.value = 'ENCARGADO DE INGRESO CENTRO DE FORMACION';
	}else{
		// console.warn('La opcion elegida en la extension no es compatible con la parte de SOFIA en la que se encuentra');
		console.error('La opcion elegida en la extension no es compatible con la parte de SOFIA en la que se encuentra');
	}
}

function eventoAmbiente(data){
	console.log(data);
	// ya que sofia usa iframes, toca obtener el HTMLDocument del iframe para acceder al formulario
	let sofiaDocument = document.getElementById('contenido');
	if(sofiaDocument !== null){
		sofiaDocument = sofiaDocument.contentDocument;
		let fichaSofia = sofiaDocument.getElementById('CrearEventoAmbienteResultadosAprendizaje:FichaRecibida');
		let buscarFicha = sofiaDocument.getElementById('hi_valor5');
		if(buscarFicha !== null){
			let textoFicha = sofiaDocument.getElementById('valor5');
			// console.log(textoFicha);
			buscarFicha.value = data.ficha;
			textoFicha.value = data.ficha;
		}else{

			if(fichaSofia !== null){
				fichaSofia = fichaSofia.innerHTML.trim();
			}else if(sofiaDocument.getElementById('form1:txtAct') !== null){
				//solo para la pantalla 2
				sofiaDocument.getElementById('form1:txtAct').value = data.actividad;
				return false;
			}else if(sofiaDocument.getElementById('form1:nomResultado') !== null){
				let campoExtra2 = sofiaDocument.getElementById('form1:nomResultado').parentElement.parentElement.parentElement.parentElement.parentElement;
				let newInput2 = sofiaDocument.createElement('textarea');
				// newInput2.type = 'text';
				newInput2.disabled = 'true';
				newInput2.value = data.resultado;
				newInput2.rows = 1;
				newInput2.cols = 200;
				newInput2.style = 'width: 100%;';
				campoExtra2.insertBefore(newInput2, campoExtra2.firstChild);

				let resultadoAprox = (data.resultado.match(/[a-z]+/i) || [''])[0];
				sofiaDocument.getElementById('form1:nomResultado').value = resultadoAprox;
				return false;
			}
	
			// console.log(fichaSofia);
			let diaLaboral = [];
			let cont = 0;
			if(data.ficha === fichaSofia){
				for (const dia in data.dias) {
					if(data.dias[dia] != ''){
						diaLaboral[cont] = {dia: dia, fechas: data.dias[dia]};
						cont++;
					}
				}
	
				if(diaLaboral.length == 1){
					const today = new Date();
					diaLaboral = diaLaboral[0];
					let mesActual = today.getMonth() + 1;
					if(Number(data.mesesAdicionales) > 0){
						mesActual = Number(mesActual) + Number(data.mesesAdicionales);
					}
					let añoActual = today.getFullYear();
					let fechas = diaLaboral.fechas.split(',');
					let cantidadDiasProgramacion = fechas.length;
	
					let fechaInicio = `${fechas[0]}/${mesActual}/${añoActual}`;
					let fechaFin = `${fechas[(fechas.length - 1)]}/${mesActual}/${añoActual}`;
	
					sofiaDocument.getElementById('fechaInicioEvento').value = fechaInicio;
					sofiaDocument.getElementById('fechaFinEvento').value = fechaFin;
					sofiaDocument.getElementById('descripcionEvento').value = data.actividad;
					
					let checkDias = sofiaDocument.getElementsByName('seleccionDiaHorario');
					checkDias.forEach(element => {
						if(element.value == diaLaboral.dia){
							element.checked = true;
						}
					});
					
					sofiaDocument.getElementById('horaInicio').value = data.hora_inicio;
					sofiaDocument.getElementById('horaFin').value = (data.hora_fin == '18:00') ? '17:59' : data.hora_fin;
	
					let campoExtra = sofiaDocument.getElementById('CrearEventoAmbienteResultadosAprendizaje:botonAgregarHorario').parentElement.parentElement.childNodes[1];
					let newInput = sofiaDocument.createElement('input');
					newInput.type = 'text';
					newInput.disabled = 'true';
					newInput.value = cantidadDiasProgramacion;
					campoExtra.appendChild(newInput);
				}else{
					alert('No hay dias para programar o hay mas de un dia para programar');
				}
			}else{
				alert('SofiaAutoFiller: LA INFORMACION QUE ESTA INGRESANDO NO COINCIDE CON LA FICHA EN LA QUE ESTA TRABAJANDO');
			}
			// sofiaDocument.getElementById('form1:txtNumeroContrato').value = data.contrato;
		}

	}else{
		// console.warn('La opcion elegida en la extension no es compatible con la parte de SOFIA en la que se encuentra');
		console.error('La opcion elegida en la extension no es compatible con la parte de SOFIA en la que se encuentra');
	}
}

function eventoTituladaLlenarFormularioEvento(data, fichaSofia, sofiaDocument){
	if(fichaSofia !== null){
		fichaSofia = fichaSofia.innerHTML.trim();
	}

	// console.log(fichaSofia);
	let diaLaboral = [];
	let cont = 0;
	if(data.ficha === fichaSofia){
		for (const dia in data.dias) {
			if(data.dias[dia]){
				diaLaboral[cont] = {dia: dia};
				cont++;
			}
		}

		sofiaDocument.getElementById('fechaInicioEvento').value = data.fecha_inicio;
		sofiaDocument.getElementById('fechaFinEvento').value = data.fecha_fin;
		sofiaDocument.getElementById('descripcionEvento').value = data.actividad;
		
		let checkDias = sofiaDocument.getElementsByName('seleccionDiaHorario');
		checkDias.forEach(element => {
			diaLaboral.forEach(element2 => {
				if(element.value == element2.dia){
					element.checked = true;
				}
			});
		});
		
		sofiaDocument.getElementById('horaInicio').value = data.hora_inicio;
		sofiaDocument.getElementById('horaFin').value = data.hora_fin;
	}else{
		alert('SofiaAutoFiller: LA INFORMACION QUE ESTA INGRESANDO NO COINCIDE CON LA FICHA EN LA QUE ESTA TRABAJANDO');
	}
}

function eventoTituladaLlenarFormularioBuscarAmbiente(data, sofiaDocument){
	sofiaDocument.getElementById('form1:fechaInicio').value = data.trimestre_inicio;
	sofiaDocument.getElementById('form1:fechaFin').value = data.trimestre_fin;
}

function eventoTituladaLlenarFormularioProgramacion(data, sofiaDocument){
	let fichaSofia = sofiaDocument.getElementById('form1:txtCod');
	if(fichaSofia !== null){
		fichaSofia = fichaSofia.innerHTML.trim();
	}

	let diaLaboral = [];
	let cont = 0;
	if(data.ficha === fichaSofia){
		for (const dia in data.dias) {
			if(data.dias[dia]){
				diaLaboral[cont] = {dia: dia};
				cont++;
			}
		}

		console.log();
		sofiaDocument.getElementById('form1:txtCalendarFechaInicial').value = data.fecha_inicio;
		sofiaDocument.getElementById('form1:txtCalendarFechaFinal').value = data.fecha_fin;

		sofiaDocument.getElementById('horaInicioDias').value = data.hora_inicio;
		sofiaDocument.getElementById('horaFinalDias').value = data.hora_fin;
		sofiaDocument.getElementById('form1:txtCupo').value = 30;
		
		let checkDias = sofiaDocument.getElementsByName('seleccionDiaRepeticion');
		checkDias.forEach(element => {
			diaLaboral.forEach(element2 => {
				if(element.value == primeraLetraMayuscula(element2.dia)){
					element.checked = true;
				}
			});
		});
	}else{
		alert('SofiaAutoFiller: LA INFORMACION QUE ESTA INGRESANDO NO COINCIDE CON LA FICHA EN LA QUE ESTA TRABAJANDO');
	}
}

function eventoTituladaLlenarFormularioInstructor(data, sofiaDocument){
	sofiaDocument.getElementById('form1:txtAct').value = data.actividad;
}

function eventoTitulada(data){
	// ya que sofia usa iframes, toca obtener el HTMLDocument del iframe para acceder al formulario
	let sofiaDocument = document.getElementById('contenido');
	console.log(data);
	if(sofiaDocument !== null){
		sofiaDocument = sofiaDocument.contentDocument;
		let fichaSofia = sofiaDocument.getElementById('CrearEventoAmbienteResultadosAprendizaje:FichaRecibida');
		let buscarFicha = sofiaDocument.getElementById('hi_valor');
		if(buscarFicha !== null){
			let textoFicha = sofiaDocument.getElementById('valor');
			buscarFicha.value = data.ficha;
			textoFicha.value = data.ficha;

			return true;
		}

		if(sofiaDocument.getElementsByTagName('h2')[0].innerHTML == 'Asignación de Ambientes'){
			let campoBusquedaAmbiente = sofiaDocument.getElementById('form1:nombre');
			if(campoBusquedaAmbiente !== null){
				campoBusquedaAmbiente.value = data.ambiente;
			}else{
				eventoTituladaLlenarFormularioBuscarAmbiente(data, sofiaDocument);
			}

			return true;
		}

		if(sofiaDocument.getElementsByTagName('h2')[0].innerHTML == 'Programación de Ambientes'){
			eventoTituladaLlenarFormularioProgramacion(data, sofiaDocument);

			return true;
		}

		if(sofiaDocument.getElementsByTagName('h2')[0].innerHTML == '<span id="CrearEventoAmbienteResultadosAprendizaje:TituloInformacionProgramacionAmbiente" title="???InformacionProgramacionAmbiente???">Información Programación de Ambiente</span>'){
			eventoTituladaLlenarFormularioEvento(data, fichaSofia, sofiaDocument);

			return true;
		}

		if(sofiaDocument.getElementsByTagName('h2')[0].innerHTML == 'Programación de Instructores al Evento' ){
			eventoTituladaLlenarFormularioInstructor(data, sofiaDocument);

			return true;
		}

	}else{
		// console.warn('La opcion elegida en la extension no es compatible con la parte de SOFIA en la que se encuentra');
		console.error('La opcion elegida en la extension no es compatible con la parte de SOFIA en la que se encuentra');
	}
}

function resaltarTabla(value, sofiaDocument){
	let val = value.trim().replace(/ +/g, ' ').toLowerCase();
	let tables = sofiaDocument.querySelectorAll('table');

	tables.forEach(table => {
		let filas = Array.from(table.rows);
		filas.forEach(row => {
			// console.log(row.cells[0].children[0].tagName);
			let text = row.innerText.replace(/\s+/g, ' ').toLowerCase();
			// console.log(text);
			
			let valido = row.innerHTML.split('<table');

			if(valido.length > 1){
				return;
			}

			if(~text.indexOf(val)){
				row.style.backgroundColor = 'yellow';
			}else{
				row.style.backgroundColor = 'unset';
			}

		});
	});
}

function resaltarTextoTablas(data){
	console.log(data);

	let sofiaDocument = document.getElementById('contenido');
	if(sofiaDocument !== null){
		sofiaDocument = sofiaDocument.contentDocument;
		resaltarTabla(data.documento, sofiaDocument);
		let frames = sofiaDocument.querySelectorAll('[id*="modalDialogContent"]');
		frames.forEach(frame => {
			let frameDocument = frame.contentDocument;
			// console.log(frameDocument);
			resaltarTabla(data.documento, frameDocument);
		});

	}else{
		console.error('La opcion elegida en la extension no es compatible con la parte de SOFIA en la que se encuentra');
	}
}

function recargarIframe()
{
	let sofiaDocument = document.getElementById('contenido');
	if(sofiaDocument !== null){
		sofiaDocument = sofiaDocument.contentDocument;
		sofiaDocument.location.reload();
	}else{
		console.error('La opcion elegida en la extension no es compatible con la parte de SOFIA en la que se encuentra');
	}
}

function callFunction(request, sender, sendResponse) {
	switch (request.action) {
		case 'pasteData':
			pasteData(request.data);
			break;
		case 'completeFields':
			completeFields();
			break;
		case 'completeFieldsPaso4':
			completeFieldsPaso4();
			break;
		case 'eventoAmbiente':
			eventoAmbiente(request.data);
			break;
		case 'eventoTitulada':
			eventoTitulada(request.data);
			break;
		case 'resaltarTextoTablas':
			resaltarTextoTablas(request.data);
			break;
		case 'recargarIframe':
			recargarIframe();
			break;
		default:
			break;
	}
}

browser.runtime.onMessage.addListener(callFunction);

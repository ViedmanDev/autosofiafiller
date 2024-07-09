let mostrarEnPaginas = ['*://*.google.com/*', '*://*.senasofiaplus.edu.co/*'];

// -----------------------------------------------------------------------
// functions for writing and reading data in memory
// -----------------------------------------------------------------------
function setExcelData(data) {
	browser.storage.local.set({
		excel_data: data
	});
}

function getExcelData() {
	return browser.storage.local.get('excel_data');
}

function setDocumentoData(data) {
	browser.storage.local.set({
		documento_data: data
	});
}

function getDocumentoData() {
	return browser.storage.local.get('documento_data');
}

// -----------------------------------------------------------------------

function onError(error) {
	console.log(`Error: ${error}`);
}

function onCreated() {
	if (browser.runtime.lastError) {
		onError(browser.runtime.lastError);
	} else {
		console.log('Item created successfully');
	}
}

browser.contextMenus.create(
	{
		id: 'repetir-accion',
		title: 'Repetir ultima accion (**WIP**)',
		contexts: ['all'],
		documentUrlPatterns: mostrarEnPaginas
	},
	onCreated,
);

browser.contextMenus.create(
	{
		id: 'recargar-contexto',
		title: 'Recargar Iframe (ventana) (**WIP**)',
		contexts: ['all'],
		documentUrlPatterns: mostrarEnPaginas
	},
	onCreated,
);

// browser.contextMenus.create(
// 	{
// 		id: 'log-selection2',
// 		title: 'Repetir ultima accion2 (**WIP**)',
// 		contexts: ['all'],
// 		documentUrlPatterns: mostrarEnPaginas
// 	},
// 	onCreated,
// );

browser.contextMenus.onClicked.addListener((info, tab) => {
	// console.log(tab);
	switch (info.menuItemId) {
		case 'repetir-accion':
			getExcelData().then((value)=>{
				if(value.excel_data != null){
					browser.tabs.sendMessage(tab.id, {action: 'eventoAmbiente', data: value.excel_data})
						.catch(onError);
				}
			});

			getDocumentoData().then((value)=>{
				if(value.documento_data != null){
					browser.tabs.sendMessage(tab.id, {action: 'resaltarTextoTablas', data: value.documento_data})
						.catch(onError);
				}
			});
			break;
		case 'recargar-contexto':
			browser.tabs.sendMessage(tab.id, {action: 'recargarIframe'})
				.catch(onError);
			break;
	}
});


// commands
browser.commands.onCommand.addListener((command) => {
	// WIP con esto se puede ejecutar un atajo y leer el clipboard... interesante
	browser.tabs.query({ currentWindow: true, active: true }).then((tab)=>{
		// console.log(tab[0]);
		// console.log(navigator.clipboard );
		// navigator.clipboard
		// 	.readText()
		// 	.then((clipText) => {
		// 		console.log(clipText);
		// 	});

		if (command === 'toggle-feature') {
			console.log(`Command "${command}" activated`);
			getExcelData().then((value)=>{
				if(value.excel_data != null){
					browser.tabs.sendMessage(tab[0].id, {action: 'eventoAmbiente', data: value.excel_data})
						.catch(onError);
				}
			});

			getDocumentoData().then((value)=>{
				if(value.documento_data != null){
					browser.tabs.sendMessage(tab[0].id, {action: 'resaltarTextoTablas', data: value.documento_data})
						.catch(onError);
				}
			});
		}

		if (command === 'repeat-titulada') {
			console.log(`Command "${command}" activated`);
			getExcelData().then((value)=>{
				if(value.excel_data != null){
					browser.tabs.sendMessage(tab[0].id, {action: 'eventoTitulada', data: value.excel_data})
						.catch(onError);
				}
			});

			getDocumentoData().then((value)=>{
				if(value.documento_data != null){
					browser.tabs.sendMessage(tab[0].id, {action: 'resaltarTextoTablas', data: value.documento_data})
						.catch(onError);
				}
			});
		}
	});
});
onStartUp();

function onStartUp() {
	$('#waiting').hide();
	if (hasValidCache()){
		// Load second view
		$('#firstTime').hide();
		$('#secondTime').show();
		data = JSON.parse(localStorage.data);

		$fuzzyAttributes = $('#fuzzyAttributes').selectize({
					    onChange: onChangeFuzzyAttributes,
						valueField: 'id',    					
    					searchField: ['entitySchemaName', 'attributeSchemaName', 'entityName', 'attributeName'],
						options: data,
						render: {
							option: function(item, escape){
								return renderTemplate.replace('{entitySchema}', item.entitySchemaName)
													 .replace('{attrSchema}', item.attributeSchemaName)
													 .replace('{entityLabel}', item.entityName)
													 .replace('{attrLabel}', item.attributeName)								 
								}
							}						
						});
	}
	else {
		// Load first start view
		$('#solutionDropdown').html('Choose your Solution <span class="caret"></span>');
		$('#firstTime').show();
		$('#secondTime').hide();		
	}			

	function hasValidCache(){
		if (localStorage.solutionId && localStorage.data){
			return true;
		}
		return false;
	}
	
	function onChangeFuzzyAttributes (value) {
		serverUlr = GetGlobalContext().getClientUrl();
		if (value === "") {
		return;
		}
		var d = data[value];
		var url = url =  serverUlr + '/tools/systemcustomization/attributes/manageAttribute.aspx?appSolutionId=%7b' 
		+ localStorage.solutionId + 
		'%7d' +
		'&entityId=%7b' +
		d.entityId +
		'%7d';
		;
		if (d.attributeId !== ""){		
			url = url + '&attributeId=%7b' + d.attributeId  + '%7d';
		} 		
		var win = window.open(url, '_blank');
	  	win.focus();	  	
	  	$(this)[0].setValue("");
	}

	var renderTemplate = 
		"<div>\
			<B>{entitySchema}:</B>  {attrSchema} <br>\
			<small><B>{entityLabel}:</B> {attrLabel}</small> \
		</div>"
}


function publishSolution(){
	SDK.PUBLISH.PublishAllXmlRequest();
}


function downloadMetadataButton(){
	$('#waiting').show();
	localStorage.data = "data"
	localStorage.solutionId = "solutionId"
	downloadMetadata();
}

function reloadMetadataButton(){
	localStorage.removeItem('data');
	localStorage.removeItem('solutionId');	
	onStartUp();
}

$('.solutionPick').click( function (element) {
	$('#solutionDropdown').html(element.target.text + ' <span class="caret"></span>');
}
);



/**
* Build and execute request to look up voter info for provided address.
* @param {string} address Address for which to fetch voter info.
* @param {function(Object)} callback Function which takes the
*     response object as a parameter.
*/
function lookup(address, callback)
{
	/**
	 * Election ID for which to fetch voter info.
	 * @type {number}
	 */
	var electionId = 5000;
	/**
	 * Request object for given parameters.
	 * @type {gapi.client.HttpRequest}
	 */
	var req = gapi.client.request({'path' : '/civicinfo/v2/voterinfo','params' : {'electionId' : electionId, 'address' : address}});
	req.execute(callback);
}

/**
* Render results in the DOM.
* @param {Object} response Response object returned by the API.
* @param {Object} rawResponse Raw response from the API.
*/
function renderResults(response, rawResponse)
{
	var el = document.getElementById('results');
	if (!response || response.error)
	{
	  el.appendChild(document.createTextNode('Error while trying to fetch polling place'));
	  return;
	}
	var normalizedAddress = response.normalizedInput.line1 + ' ' + response.normalizedInput.city + ', ' + response.normalizedInput.state + ' ' + response.normalizedInput.zip;
	if (response.pollingLocations.length > 0)
	{
		var pollingLocation = response.pollingLocations[0].address;
		var pollingAddress = pollingLocation.locationName + ', ' + pollingLocation.line1 + ' ' + pollingLocation.city + ', ' + pollingLocation.state + ' ' + pollingLocation.zip;
		var normEl = document.createElement('strong');
		normEl.appendChild(document.createTextNode('Polling place for ' + normalizedAddress + ': '));
		el.appendChild(normEl);
		el.appendChild(document.createTextNode(pollingAddress));
	}
	else
	{
	  el.appendChild(document.createTextNode('Could not find polling place for ' + normalizedAddress));
	}
	for(i = 0; i < response.contests.length; i++)
	{
		var office = document.createTextNode(response.contests[i].office);
		createPartyTable(office);
		var newtable = document.createElement('div');
		var firstCell = document.createElement('span');
		var secondCell = document.createElement('span');
		for(j = 0; j < response.contests[i].candidates.length; j++)
		{
			var partyList = document.getElementById('contestTable');
			if(response.contests[i].candidates[j].party == "Democratic Party" || response.contests[i].candidates[j].party == "Republican Party")
			{
				if(response.contests[i].candidates[j].party == "Democratic Party")
				{
					firstCell.innerHTML = response.contests[i].candidates[j].name;
					newtable.appendChild(firstCell);
				}
				else if(response.contests[i].candidates[j].party == "Republican Party")
				{
					secondCell.innerHTML = response.contests[i].candidates[j].name;
					newtable.appendChild(secondCell);
				}
				partyList.appendChild(newtable);
			}
		}
	}
}
	  
function createPartyTable(office)
{
	var table = document.createElement('div');
	var row1 = document.createElement('div');
	table.appendChild(row1);
	var row1col1 = document.createElement('span');
	row1col1.innerHTML = 'Democrat';
	row1.appendChild(row1col1);
	var row1col2 = document.createElement('span');
	row1col2.innerHTML = 'Republican';
	row1.appendChild(row1col2);
	// Append Table into div.
	var div = document.getElementById('contestTable');
	table.insertBefore(office, table.firstChild);
	div.appendChild(table);
}
	  
function submitButton()
{
	//clear if there is anything from previous tries
	var clr = document.getElementById("results");
	var clr2 = document.getElementById("contestTable");
	while (clr.firstChild || clr2.firstChild)
	{
		if(clr.firstChild){clr.removeChild(clr.firstChild);}
		if(clr2.firstChild){clr2.removeChild(clr2.firstChild);}
		
	}
	//get value
	var addr = document.getElementById('Address').value;
	gapi.client.setApiKey('AIzaSyCOWPt4NPdyWMAV7a8szKXkG6bEBq8yL6Y');
	lookup(addr, renderResults);
}
	  
	  
	  
	  
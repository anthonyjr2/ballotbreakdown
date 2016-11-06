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
		normEl.appendChild(document.createElement("br"));
		el.appendChild(normEl);
		el.appendChild(document.createTextNode(pollingAddress));
	}
	else
	{
	  el.appendChild(document.createTextNode('Could not find polling place for ' + normalizedAddress));
	}
	var offices = [];
	offices.id = "office";
	for(i = 0; i < response.contests.length; i++)
	{
		var office = document.createTextNode(response.contests[i].office);
		office.id = "office";
		offices[i] = office;
		offices[i].id = "office"
		createPartyTable(office,offices,i);
		for(j = 0; j < response.contests[i].candidates.length; j++)
		{
			var cell = document.createElement('span');
			var demCol = document.getElementById('leftCol');
			var repCol = document.getElementById('rightCol');
			if(response.contests[i].candidates[j].party == "Democratic Party" || response.contests[i].candidates[j].party == "Republican Party")
			{
				if(response.contests[i].candidates[j].party == "Democratic Party")
				{
					if(response.contests[i].candidates[j].candidateUrl)
					{
						cell.innerHTML = "<a href='"+response.contests[i].candidates[j].candidateUrl+"'>"+response.contests[i].candidates[j].name+"</a>";
					}
					else
					{
						cell.innerHTML = response.contests[i].candidates[j].name;
					}
					demCol.appendChild(cell);
					demCol.appendChild(document.createElement("br"));
				}
				else if(response.contests[i].candidates[j].party == "Republican Party")
				{
					if(response.contests[i].candidates[j].candidateUrl)
					{
						cell.innerHTML = "<a href='"+response.contests[i].candidates[j].candidateUrl+"'>"+response.contests[i].candidates[j].name+"</a>";
					}
					else
					{
						cell.innerHTML = response.contests[i].candidates[j].name;
					}
					repCol.appendChild(cell);
					repCol.appendChild(document.createElement("br"));
				}
			}
			/**if(demCol.childNodes.length-1 != repCol.childNodes.length)
			{
				if(response.contests[i].candidates[j].party == "Republican Party")
				{ 
					demCol.appendChild(document.createElement("br"));
				}
				else if(response.contests[i].candidates[j].party == "Democratic Party")
				{
					repCol.appendChild(document.createElement("br"));
				}
			}*/
		}
	}
}
	  
function createPartyTable(office,offices,index)
{
	//var table = document.getElementById('contestHeader');
	var dem = document.getElementById('leftCol');
	var rep = document.getElementById('rightCol');
	var off = document.getElementById('midCol');
	var demParty = document.createElement('span');
	demParty.id = "party"; 
	var repParty = document.createElement('span');
	repParty.id = "party";
	dem.appendChild(document.createElement("br"));
	rep.appendChild(document.createElement("br"));
	demParty.innerHTML = 'Democrat';
	dem.appendChild(demParty);
	dem.appendChild(document.createElement("br"));
	repParty.innerHTML = 'Republican';
	rep.appendChild(repParty);
	rep.appendChild(document.createElement("br"));
	off.appendChild(offices[index]);
	off.appendChild(document.createElement("br"));
	//dem.insertBefore(office, dem.firstChild);
}
	  
function submitButton()
{
	//clear if there is anything from previous tries
	var clr = document.getElementById("results");
	var clr2 = document.getElementById("contestTable");
	//contestTable.id = "table";
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
	  
	  
	  
	  
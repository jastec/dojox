dojo.provide("dojox.data.tests.stores.AndOrReadStore");
dojo.require("dojox.data.AndOrReadStore");
dojo.require("dojo.data.api.Read");
dojo.require("dojo.data.api.Identity");
dojo.require("dojo.date");
dojo.require("dojo.date.stamp");




//The test data-sets and tests are taken from ItemFileReadStore, to show 
//  backwards compatibility.
//Additionally, where appropriate (fetch/query), the AndOrReadStore test is immediately
//  followed by the same query (with ", complex" in the description), but with the query 
//  being a string rather than a json object. 
//Below all those tests are new ones that test the use of AND, OR, NOT, ||, &&, (, ), and ","
//  in queries, as well as a mix of string and json object queries.
//Since some widgets expect the query to be in json object form, in addition to the 
//  query="id:1234 || dept:'Sales Department' || (dept:Auto && id:2*)" programmatic syntax,
//  query="{complexQuery:'id:1234 || dept:\"Sales Department\" || (dept:Auto && id:2*)" is
//  tested/supported.

//-----------------------------------------------------
// test data-sets
dojox.data.tests.stores.AndOrReadStore.getTestData = function(name){
	var data = null;
	if(name === "countries"){
		if(dojo.isBrowser){
			data = {url: dojo.moduleUrl("dojox", "data/tests/stores/countries.json").toString() };
		}else{
			data = {data: { 
				identifier:'abbr',
				label:'name',
				items:[
					{abbr:'ec', name:'Ecuador', capital:'Quito'},
					{abbr:'eg', name:'Egypt', capital:'Cairo'},
					{abbr:'sv', name:'El Salvador', capital:'San Salvador'},
					{abbr:'gq', name:'Equatorial Guinea', capital:'Malabo'},
					{abbr:'er', name:'Eritrea', capital:'Asmara'},
					{abbr:'ee', name:'Estonia', capital:'Tallinn'},
					{abbr:'et', name:'Ethiopia', capital:'Addis Ababa'}
				]
			} };
		}
	}else if(name === "countries_withNull"){
		data = {data: { 
			identifier:"abbr",
			items:[
				{abbr:"ec", name:null, capital:"Quito"},
				{abbr:'eg', name:null, capital:'Cairo'},
				{abbr:'sv', name:'El Salvador', capital:'San Salvador'},
				{abbr:'gq', name:'Equatorial Guinea', capital:'Malabo'},
				{abbr:'er', name:'Eritrea', capital:'Asmara'},
				{abbr:'ee', name:null, capital:'Tallinn'},
				{abbr:'et', name:'Ethiopia', capital:'Addis Ababa'}
			]
		} };
	}else if(name === "countries_withoutid"){
		data = {data: { 
			label: "name",
			items:[
				{abbr:"ec", name:null, capital:"Quito"},
				{abbr:'eg', name:null, capital:'Cairo'},
				{abbr:'sv', name:'El Salvador', capital:'San Salvador'},
				{abbr:'gq', name:'Equatorial Guinea', capital:'Malabo'},
				{abbr:'er', name:'Eritrea', capital:'Asmara'},
				{abbr:'ee', name:null, capital:'Tallinn'},
				{abbr:'et', name:'Ethiopia', capital:'Addis Ababa'}
			]
		} };
	}else if (name === "countries_withBoolean"){
		data = {data: { 
			identifier:"abbr",
			items:[
				{abbr:"ec", name:"Ecuador", capital:"Quito", real:true},
				{abbr:'eg', name:'Egypt', capital:'Cairo', real:true},
				{abbr:'sv', name:'El Salvador', capital:'San Salvador', real:true},
				{abbr:'gq', name:'Equatorial Guinea', capital:'Malabo', real:true},
				{abbr:'er', name:'Eritrea', capital:'Asmara', real:true},
				{abbr:'ee', name:'Estonia', capital:'Tallinn', real:true},
				{abbr:'et', name:'Ethiopia', capital:'Addis Ababa', real:true},
				{abbr:'ut', name:'Utopia', capital:'Paradise', real:false}
			]
		} };
	}else if (name === "countries_withDates"){
		data = {data: { 
			identifier:"abbr",
			items:[
				{abbr:"ec", name:"Ecuador", capital:"Quito"},
				{abbr:'eg', name:'Egypt', capital:'Cairo'},
				{abbr:'sv', name:'El Salvador', capital:'San Salvador'},
				{abbr:'gq', name:'Equatorial Guinea', capital:'Malabo'},
				{abbr:'er', name:'Eritrea', capital:'Asmara', independence:{_type:'Date', _value:"1993-05-24T00:00:00Z"}}, // May 24, 1993,
				{abbr:'ee', name:'Estonia', capital:'Tallinn', independence:{_type:'Date', _value:"1991-08-20T00:00:00Z"}}, // August 20, 1991
				{abbr:'et', name:'Ethiopia', capital:'Addis Ababa'}
			]
		} };
	}else if (name === "geography_hierarchy_small"){
		data = {data: { 
			items:[
				{ name:'Africa', countries:[
					{ name:'Egypt', capital:'Cairo' },
					{ name:'Kenya', capital:'Nairobi' },
					{ name:'Sudan', capital:'Khartoum' }]},
				{ name:'Australia', capital:'Canberra' },
				{ name:'North America', countries:[
					{ name:'Canada', population:'33 million', cities:[
						{ name:'Toronto', population:'2.5 million' },
						{ name:'Alberta', population:'1 million' }
						]},
					{ name: 'United States of America', capital: 'Washington DC', states:[
						{ name: 'Missouri'},
						{ name: 'Arkansas'}
						]}
					]}
			]
		}};
	}else if (name === "data_multitype"){
		data = {data: { 
						"identifier": "count",
						"label": "count", 
						items: [
							{ count: 1,    value: "true" },
							{ count: 2,    value: true   },
							{ count: 3,    value: "false"},
							{ count: 4,    value: false  },
							{ count: 5,    value: true   },
							{ count: 6,    value: true   },
							{ count: 7,    value: "true" },
							{ count: 8,    value: "true" },
							{ count: 9,    value: "false"},
							{ count: 10,   value: false  },
							{ count: 11,   value: [false, false]},
							{ count: "12", value: [false, "true"]}
					   ]
					} 
				};
	}else if (name === "countries_references"){
		data = {data: { identifier: 'name',
						label: 'name',
						items: [
							{ name:'Africa', type:'continent',
								children:[{_reference:'Egypt'}, {_reference:'Kenya'}, {_reference:'Sudan'}] },
							{ name:'Egypt', type:'country' },
							{ name:'Kenya', type:'country',
								children:[{_reference:'Nairobi'}, {_reference:'Mombasa'}] },
							{ name:'Nairobi', type:'city' },
							{ name:'Mombasa', type:'city' },
							{ name:'Sudan', type:'country',
								children:{_reference:'Khartoum'} },
							{ name:'Khartoum', type:'city' },
							{ name:'Asia', type:'continent',
								children:[{_reference:'China'}, {_reference:'India'}, {_reference:'Russia'}, {_reference:'Mongolia'}] },
							{ name:'China', type:'country' },
							{ name:'India', type:'country' },
							{ name:'Russia', type:'country' },
							{ name:'Mongolia', type:'country' },
							{ name:'Australia', type:'continent', population:'21 million',
								children:{_reference:'Commonwealth of Australia'}},
							{ name:'Commonwealth of Australia', type:'country', population:'21 million'},
							{ name:'Europe', type:'continent',
								children:[{_reference:'Germany'}, {_reference:'France'}, {_reference:'Spain'}, {_reference:'Italy'}] },
							{ name:'Germany', type:'country' },
							{ name:'France', type:'country' },
							{ name:'Spain', type:'country' },
							{ name:'Italy', type:'country' },
							{ name:'North America', type:'continent',
								children:[{_reference:'Mexico'}, {_reference:'Canada'}, {_reference:'United States of America'}] },
							{ name:'Mexico', type:'country',  population:'108 million', area:'1,972,550 sq km',
								children:[{_reference:'Mexico City'}, {_reference:'Guadalajara'}] },
							{ name:'Mexico City', type:'city', population:'19 million', timezone:'-6 UTC'},
							{ name:'Guadalajara', type:'city', population:'4 million', timezone:'-6 UTC' },
							{ name:'Canada', type:'country',  population:'33 million', area:'9,984,670 sq km',
								children:[{_reference:'Ottawa'}, {_reference:'Toronto'}] },
							{ name:'Ottawa', type:'city', population:'0.9 million', timezone:'-5 UTC'},
							{ name:'Toronto', type:'city', population:'2.5 million', timezone:'-5 UTC' },
							{ name:'United States of America', type:'country' },
							{ name:'South America', type:'continent',
								children:[{_reference:'Brazil'}, {_reference:'Argentina'}] },
							{ name:'Brazil', type:'country', population:'186 million' },
							{ name:'Argentina', type:'country', population:'40 million' }
						]
					}
				};
	}
	return data;
};

//-----------------------------------------------------
// tests
dojox.data.tests.stores.AndOrReadStore.getTests = function(){
	dojox.data.tests.stores.AndOrReadStore.tests = [
		{
			name: "Identity API: fetchItemByIdentity()",
			runTest: function(t){
				//	summary: 
				//		Simple test of the fetchItemByIdentity function of the store.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
	
				var d = new doh.Deferred();
				var onItem = function(item){
					t.assertTrue(item !== null);
					if(item !== null){
						var name = store.getValue(item,"name");
						t.assertEqual(name, "El Salvador");
					}
					d.callback(true);
				};
				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetchItemByIdentity({identity: "sv", onItem: onItem, onError: onError});
				return d; // Deferred
			}
		},
		{
			name: "Identity API: fetchItemByIdentity() notFound",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the fetchItemByIdentity function of the store.
				//	description:
				//		Simple test of the fetchItemByIdentity function of the store.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
	
				var d = new doh.Deferred();
				var onItem = function(item){
					t.assertTrue(item === null);
					d.callback(true);
				};
				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetchItemByIdentity({identity: "sv_not", onItem: onItem, onError: onError});
				return d; // Deferred
			}
		},
		{
			name: "Identity API: getIdentityAttributes()",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the getIdentityAttributes function.
				//	description:
				//		Simple test of the getIdentityAttributes function.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
	
				var d = new doh.Deferred();
				var onItem = function(item){
					t.assertTrue(item !== null);
					var identifiers = store.getIdentityAttributes(item);
					t.assertTrue(dojo.isArray(identifiers));
					t.assertEqual(1, identifiers.length);
					t.assertEqual("abbr", identifiers[0]);
					d.callback(true);
				};
				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetchItemByIdentity({identity: "sv", onItem: onItem, onError: onError});
				return d; // Deferred
			}
		},
		{
			name: "Identity API: fetchItemByIdentity() commentFilteredJson",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the fetchItemByIdentity function of the store.
				//	description:
				//		Simple test of the fetchItemByIdentity function of the store.
				//		This tests loading a comment-filtered json file so that people using secure
				//		data with this store can bypass the JavaSceipt hijack noted in Fortify's
				//		paper.
	
				if(dojo.isBrowser){
	                var store = new dojox.data.AndOrReadStore({url: dojo.moduleUrl("tests", "data/countries_commentFiltered.json").toString()});
	
					var d = new doh.Deferred();
					var onItem = function(item){
						t.assertTrue(item !== null);
						var name = store.getValue(item,"name");
						t.assertEqual(name, "El Salvador");
						d.callback(true);
					};
					var onError = function(errData){
						t.assertTrue(false);
						d.errback(errData);
					};
					store.fetchItemByIdentity({identity: "sv", onItem: onItem, onError: onError});
					return d; // Deferred
				}
			}
		},
		{
			name: "Identity API: fetchItemByIdentity() nullValue",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the fetchItemByIdentity function of the store, checling a null value.
				//	description:
				//		Simple test of the fetchItemByIdentity function of the store, checking a null value.
				//		This tests handling attributes in json that were defined as null properly.
				//		Introduced because of tracker: #3153
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries_withNull"));
	
				var d = new doh.Deferred();
				var onItem = function(item){
					t.assertTrue(item !== null);
					var name = store.getValue(item,"name");
					t.assertEqual(name, null);
					d.callback(true);
				};
				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetchItemByIdentity({identity: "ec", onItem: onItem, onError: onError});
				return d; // Deferred
			}
		},
		{
			name: "Identity API: fetchItemByIdentity() booleanValue",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the fetchItemByIdentity function of the store, checking a boolean value.
				//	description:
				//		Simple test of the fetchItemByIdentity function of the store, checking a boolean value.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries_withBoolean"));
	
				var d = new doh.Deferred();
				var onItem = function(item){
					t.assertTrue(item !== null);
					var name = store.getValue(item,"name");
					t.assertEqual(name, "Utopia");
					var real = store.getValue(item,"real");
					t.assertEqual(real, false);
					d.callback(true);
				};
				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetchItemByIdentity({identity: "ut", onItem: onItem, onError: onError});
				return d; // Deferred
			}
		},
		{
			name: "Identity API: fetchItemByIdentity() withoutSpecifiedIdInData",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of bug #4691, looking up something by assigned id, not one specified in the JSON data.
				//	description:
				//		Simple test of bug #4691, looking up something by assigned id, not one specified in the JSON data.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries_withoutid"));
	
				var d = new doh.Deferred();
				var onItem = function(item){
					t.assertTrue(item !== null);
					var name = store.getValue(item,"name");
					t.assertEqual(name, "El Salvador");
					d.callback(true);
				};
				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetchItemByIdentity({identity: "2", onItem: onItem, onError: onError});
				return d; // Deferred
			}
		},
		{
			name: "Identity API: getIdentity()",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the getIdentity function of the store.
				//	description:
				//		Simple test of the getIdentity function of the store.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
	
				var d = new doh.Deferred();
				var onItem = function(item){
					t.assertTrue(item !== null);
					t.assertTrue(store.getIdentity(item) === "sv");
					d.callback(true);
				};
				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetchItemByIdentity({identity: "sv", onItem: onItem, onError: onError});
				return d; // Deferred
			}
		},
		{
			name: "Identity API: getIdentity() withoutSpecifiedId",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the #4691 bug
				//	description:
				//		Simple test of the #4691 bug
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries_withoutid"));
	
				var d = new doh.Deferred();
				var onItem = function(item, request){
					t.assertTrue(item !== null);
					t.assertTrue(store.getIdentity(item) === 2);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ query:{abbr: "sv"}, onItem: onItem, onError: onError});
				return d; // Deferred
			}
		},
		{
			name: "Identity API: getIdentity() withoutSpecifiedId, complex",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the #4691 bug
				//	description:
				//		Simple test of the #4691 bug
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries_withoutid"));
	
				var d = new doh.Deferred();
				var onItem = function(item, request){
					t.assertTrue(item !== null);
					t.assertTrue(store.getIdentity(item) === 2);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ query:'abbr: "sv"', onItem: onItem, onError: onError});
				return d; // Deferred
			}
		},
		{
			name: "Read API: fetch() all",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore.
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				
				var d = new doh.Deferred();
				var completedAll = function(items, request){
					t.is(7, items.length);
					d.callback(true);
				};
				var error = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
	
				//Get everything...
				store.fetch({ onComplete: completedAll, onError: error});
				return d;
			}
		},
		{
			name: "Read API: fetch() abort",
			runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch abort on AndOrReadStore.
				//	description:
				//		Simple test of a basic fetch abort on AndOrReadStore.
				if(dojo.isBrowser){
					var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
					var d = new doh.Deferred();
					var abortCalled = false;
					function completedAll(items, request){
						t.is(7, items.length);
						if(abortCalled){
							console.log("Made it to complete callback and abort was called.  Problem.");
							d.errback(new Error("Should not be here."));
						}else{
							//We beat out calling abort, so this is okay.  Timing.
							console.log("in onComplete and abort has not been called.  Timing.  This is okay.");
							d.callback(true);
						}
					}
					function error(errData, request){
						//An abort should throw a cancel error, so we should
						//reach this.
						t.assertTrue(true);
						d.callback(true);
					}
					//Get everything...
					var req = store.fetch({ onComplete: completedAll, onError: error});
					abortCalled=true;
					console.log("Calling abort.");
					req.abort();
					return d;
				}
			}
		},
		{
			name: "Read API: fetch() one",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 1);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: {abbr: "ec"}, 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() one, complex",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 1);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: 'abbr: "ec"', 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() shallow",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of only toplevel items
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of only toplevel items.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("geography_hierarchy_small"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 2);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				//Find all items starting with A, only toplevel (root) items.
				store.fetch({ 	query: {name: "A*"}, 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() shallow, complex",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of only toplevel items
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of only toplevel items.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("geography_hierarchy_small"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 2);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				//Find all items starting with A, only toplevel (root) items.
				store.fetch({ 	query: 'name: "A*"', 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() Multiple",
	 		runTest: function(t){
				//	summary: 
				//		Tests that multiple fetches at the same time queue up properly and do not clobber each other on initial load.
				//	description:
				//		Tests that multiple fetches at the same time queue up properly and do not clobber each other on initial load.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("geography_hierarchy_small"));
				
				var d = new doh.Deferred();
				var done = [false, false];
	
				var onCompleteOne = function(items, request){
					done[0] = true;
					t.assertEqual(items.length, 2);
					if(done[0] && done[1]){
						d.callback(true);
					}
				};
				var onCompleteTwo = function(items, request){
					done[1] = true;
					if(done[0] && done[1]){
						d.callback(true);
					}
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				//Find all items starting with A, only toplevel (root) items.
				store.fetch({ 	query: {name: "A*"}, 
										onComplete: onCompleteOne, 
										onError: onError
									});
	
				//Find all items starting with A, only toplevel (root) items.
				store.fetch({ 	query: {name: "N*"}, 
										onComplete: onCompleteTwo, 
										onError: onError
									});
	
				return d;
			}
		},
		{
			name: "Read API: fetch() Multiple, complex",
	 		runTest: function(t){
				//	summary: 
				//		Tests that multiple fetches at the same time queue up properly and do not clobber each other on initial load.
				//	description:
				//		Tests that multiple fetches at the same time queue up properly and do not clobber each other on initial load.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("geography_hierarchy_small"));
				
				var d = new doh.Deferred();
				var done = [false, false];
	
				var onCompleteOne = function(items, request){
					done[0] = true;
					t.assertEqual(items.length, 2);
					if(done[0] && done[1]){
						d.callback(true);
					}
				};
				var onCompleteTwo = function(items, request){
					done[1] = true;
					if(done[0] && done[1]){
						d.callback(true);
					}
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				//Find all items starting with A, only toplevel (root) items.
				store.fetch({ 	query: 'name: "A*"', 
										onComplete: onCompleteOne, 
										onError: onError
									});
	
				//Find all items starting with A, only toplevel (root) items.
				store.fetch({ 	query: 'name: "N*"', 
										onComplete: onCompleteTwo, 
										onError: onError
									});
	
				return d;
			}
		},
		{
			name: "Read API: fetch() MultipleMixedFetch",
	 		runTest: function(t){
				//	summary: 
				//		Tests that multiple fetches at the same time queue up properly and do not clobber each other on initial load.
				//	description:
				//		Tests that multiple fetches at the same time queue up properly and do not clobber each other on initial load.
				//		Tests an item fetch and an identity fetch.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				
				var d = new doh.Deferred();
				var done = [false, false];
	
				var onComplete = function(items, request){
					done[0] = true;
					t.assertEqual(items.length, 1);
					if(done[0] && done[1]){
						d.callback(true);
					}
				};
				var onItem = function(item){
					done[1] = true;
					t.assertTrue(item !== null);
					var name = store.getValue(item,"name");
					t.assertEqual(name, "El Salvador");
					
					if(done[0] && done[1]){
						d.callback(true);
					}
				};
				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};
				
				//Find all items starting with A, only toplevel (root) items.
				store.fetch({ 	query: {name: "El*"}, 
										onComplete: onComplete, 
										onError: onError
									});
				
				store.fetchItemByIdentity({identity: "sv", onItem: onItem, onError: onError});
				return d;
			}
		},
		{
			name: "Read API: fetch() MultipleMixedFetch, complex",
	 		runTest: function(t){
				//	summary: 
				//		Tests that multiple fetches at the same time queue up properly and do not clobber each other on initial load.
				//	description:
				//		Tests that multiple fetches at the same time queue up properly and do not clobber each other on initial load.
				//		Tests an item fetch and an identity fetch.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				
				var d = new doh.Deferred();
				var done = [false, false];
	
				var onComplete = function(items, request){
					done[0] = true;
					t.assertEqual(items.length, 1);
					if(done[0] && done[1]){
						d.callback(true);
					}
				};
				var onItem = function(item){
					done[1] = true;
					t.assertTrue(item !== null);
					var name = store.getValue(item,"name");
					t.assertEqual(name, "El Salvador");
					
					if(done[0] && done[1]){
						d.callback(true);
					}
				};
				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};
				
				//Find all items starting with A, only toplevel (root) items.
				store.fetch({ 	query: 'name: "El*"', 
										onComplete: onComplete, 
										onError: onError
									});
				
				store.fetchItemByIdentity({identity: "sv", onItem: onItem, onError: onError});
				return d;
			}
		},
		{
			name: "Read API: fetch() deep",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of all items (including children (nested))
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of all items (including children (nested))
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("geography_hierarchy_small"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 4);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				//Find all items starting with A, including child (nested) items.
				store.fetch({ 	query: {name: "A*"}, 
										onComplete: onComplete, 
										onError: onError,
										queryOptions: {deep:true}
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() deep, complex",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of all items (including children (nested))
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of all items (including children (nested))
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("geography_hierarchy_small"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 4);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				//Find all items starting with A, including child (nested) items.
				store.fetch({ 	query: 'name: "A*"', 
										onComplete: onComplete, 
										onError: onError,
										queryOptions: {deep:true}
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() hierarchy off",
			runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of all items with hierarchy disabled
				//		This should turn off processing child objects as data store items.  It will still process
				//		references and type maps.
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of all items with hierarchy disabled
				//		This should turn off processing child objects as data store items.  It will still process
				//		references and type maps.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("geography_hierarchy_small"));
				
				//Set this as hierarchy off before fetch to make sure it traps and configs right.
				store.hierarchical = false;
				
				var d = new doh.Deferred();
				function onComplete(items, request){
					//With hierarchy off, this should only match 2, as only two data store items
					//will be quertied
					t.assertEqual(2, items.length);
					var i;
					var passed = true;
					for(i = 0; i < items.length; i++){
						var countries = store.getValues(items[i], "countries");
						if(countries){
							var j;
							//Make sure none of the child objects were processed into items.
							for(j = 0; j<countries.length; j++){
								passed = !store.isItem(countries[j]);
								if(!passed){
									break;
								}
							}
						}
						if(!passed){
							break;
						}
					}
					if(!passed){
						d.errback(new Error("Located a child item with hierarchy off and no references in the data.  Error."));
					}else{
						d.callback(true);
					}
				}
				function onError(errData, request){
					d.errback(errData);
				}
				//Find all items starting with A, including child (nested) items.
				store.fetch({ 	query: {name: "A*"}, 
										onComplete: onComplete, 
										onError: onError,
										queryOptions: {deep:true}
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() hierarchy off refs still parse",
			runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of all items with hierarchy disabled
				//		This should turn off processing child objects as data store items.  It will still process
				//		references and type maps.
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of all items with hierarchy disabled
				//		This should turn off processing child objects as data store items.  It will still process
				//		references and type maps.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries_references"));
				
				//Set this as hierarchy off before fetch to make sure it traps and configs right.
				store.hierarchical = false;
				
				var d = new doh.Deferred();
				function onComplete(items, request){
					//With hierarchy off, this should only match 2, as only two data store items
					//will be quertied
					t.assertEqual(items.length, 4);
					var i;
					var passed = true;
					for(i = 0; i < items.length; i++){
						var countries = store.getValues(items[i], "children");
						if(countries){
							var j;
							//Make sure none of the child objects were processed into items.
							for(j = 0; j<countries.length; j++){
								passed = store.isItem(countries[j]);
								if(!passed){
									break;
								}
							}
						}
						if(!passed){
							break;
						}
					}
					if(!passed){
						d.errback(new Error("Found a non-child item in a reference list in a references based input.  Error."));
					}else{
						d.callback(true);
					}
				}
				function onError(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				}
				//Find all items starting with A, including child (nested) items.
				store.fetch({ 	query: {name: "A*"}, 
										onComplete: onComplete, 
										onError: onError,
										queryOptions: {deep:true}
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() one_commentFilteredJson",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				//		This tests loading a comment-filtered json file so that people using secure
				//		data with this store can bypass the JavaSceipt hijack noted in Fortify's
				//		paper.
				if(dojo.isBrowser){
	                var store = new dojox.data.AndOrReadStore({url: dojo.moduleUrl("tests", "data/countries_commentFiltered.json").toString()});
	
					var d = new doh.Deferred();
					var onComplete = function(items, request){
						t.assertEqual(items.length, 1);
						d.callback(true);
					};
					var onError = function(errData, request){
						t.assertTrue(false);
						d.errback(errData);
					};
					store.fetch({ 	query: {abbr: "ec"}, 
											onComplete: onComplete, 
											onError: onError
										});
					return d;
				}
			}
		},
		{
			name: "Read API: fetch() one_commentFilteredJson, complex",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				//		This tests loading a comment-filtered json file so that people using secure
				//		data with this store can bypass the JavaSceipt hijack noted in Fortify's
				//		paper.
				if(dojo.isBrowser){
	                var store = new dojox.data.AndOrReadStore({url: dojo.moduleUrl("tests", "data/countries_commentFiltered.json").toString()});
	
					var d = new doh.Deferred();
					var onComplete = function(items, request){
						t.assertEqual(items.length, 1);
						d.callback(true);
					};
					var onError = function(errData, request){
						t.assertTrue(false);
						d.errback(errData);
					};
					store.fetch({ 	query: 'abbr: "ec"', 
											onComplete: onComplete, 
											onError: onError
										});
					return d;
				}
			}
		},
		{
			name: "Read API: fetch() withNull",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of a single item where some attributes are null.
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of a single item where some attributes are null.
				//		Introduced because of tracker: #3153
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries_withNull"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(4, items.length);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: {name: "E*"}, 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() withNull, complex",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of a single item where some attributes are null.
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of a single item where some attributes are null.
				//		Introduced because of tracker: #3153
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries_withNull"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(4, items.length);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: 'name: "E*"', 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() all_streaming",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore.
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
	
				var d = new doh.Deferred();
				var count = 0;
	
				var onBegin = function(size, requestObj){
					t.assertEqual(size, 7);
				};
				var onItem = function(item, requestObj){
					t.assertTrue(store.isItem(item));
					count++;
				};
				var onComplete = function(items, request){
					t.assertEqual(count, 7);
					t.assertTrue(items === null);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
	
				//Get everything...
				store.fetch({	onBegin: onBegin,
										onItem: onItem, 
										onComplete: onComplete,
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() paging",
	 		runTest: function(t){
				//	summary: 
				//		Test of multiple fetches on a single result.  Paging, if you will.
				//	description:
				//		Test of multiple fetches on a single result.  Paging, if you will.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				
				var d = new doh.Deferred();

				var dumpSixthFetch = function(items, request){
					t.assertEqual(items.length, 5);
					d.callback(true);
				};

				var dumpFifthFetch = function(items, request){
					t.assertEqual(items.length, 0);
					request.start = 2;
					request.count = 20;
					request.onComplete = dumpSixthFetch;
					store.fetch(request);
				};

				var dumpFourthFetch = function(items, request){
					t.assertEqual(items.length, 5);
					request.start = 9;
					request.count = 100;
					request.onComplete = dumpFifthFetch;
					store.fetch(request);
				};

				var dumpThirdFetch = function(items, request){
					t.assertEqual(items.length, 5);
					request.start = 2;
					request.count = 20;
					request.onComplete = dumpFourthFetch;
					store.fetch(request);
				};

				var dumpSecondFetch = function(items, request){
					t.assertEqual(items.length, 1);
					request.start = 0;
					request.count = 5;
					request.onComplete = dumpThirdFetch;
					store.fetch(request);
				};

				var dumpFirstFetch = function(items, request){
					t.assertEqual(items.length, 5);
					request.start = 3;
					request.count = 1;
					request.onComplete = dumpSecondFetch;
					store.fetch(request);
				};
	
				var completed = function(items, request){
					t.assertEqual(items.length, 7);
					request.start = 1;
					request.count = 5;
					request.onComplete = dumpFirstFetch;
					store.fetch(request);
				};
	
				var error = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({onComplete: completed, onError: error});
				return d;
			}
		},
		{
			name: "Read API: fetch() with MultiType Match",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch againct an attribute that has different types for the value across items
				//	description:
				//		Simple test of a basic fetch againct an attribute that has different types for the value across items
				//		Introduced because of tracker: #4931
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("data_multitype"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(4, items.length);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: {count: "1*"}, 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() with MultiType Match, complex",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch againct an attribute that has different types for the value across items
				//	description:
				//		Simple test of a basic fetch againct an attribute that has different types for the value across items
				//		Introduced because of tracker: #4931
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("data_multitype"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(4, items.length);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: 'count: "1*"', 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() with MultiType, MultiValue Match",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch againct an attribute that has different types for the value across items
				//	description:
				//		Simple test of a basic fetch againct an attribute that has different types for the value across items
				//		Introduced because of tracker: #4931
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("data_multitype"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(7, items.length);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: {value: "true"}, 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() with MultiType, MultiValue Match, complex",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch againct an attribute that has different types for the value across items
				//	description:
				//		Simple test of a basic fetch againct an attribute that has different types for the value across items
				//		Introduced because of tracker: #4931
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("data_multitype"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(7, items.length);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: 'value: "true"', 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: getLabel()",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the getLabel function against a store set that has a label defined.
				//	description:
				//		Simple test of the getLabel function against a store set that has a label defined.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 1);
					var label = store.getLabel(items[0]);
					t.assertTrue(label !== null);
					t.assertEqual("Ecuador", label);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: {abbr: "ec"}, 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: getLabel(), complex",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the getLabel function against a store set that has a label defined.
				//	description:
				//		Simple test of the getLabel function against a store set that has a label defined.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 1);
					var label = store.getLabel(items[0]);
					t.assertTrue(label !== null);
					t.assertEqual("Ecuador", label);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: 'abbr: "ec"', 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: getLabelAttributes()",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the getLabelAttributes function against a store set that has a label defined.
				//	description:
				//		Simple test of the getLabelAttributes function against a store set that has a label defined.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 1);
					var labelList = store.getLabelAttributes(items[0]);
					t.assertTrue(dojo.isArray(labelList));
					t.assertEqual("name", labelList[0]);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: {abbr: "ec"}, 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: getLabelAttributes(), complex",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the getLabelAttributes function against a store set that has a label defined.
				//	description:
				//		Simple test of the getLabelAttributes function against a store set that has a label defined.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 1);
					var labelList = store.getLabelAttributes(items[0]);
					t.assertTrue(dojo.isArray(labelList));
					t.assertEqual("name", labelList[0]);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: 'abbr: "ec"', 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: getValue()",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the getValue function of the store.
				//	description:
				//		Simple test of the getValue function of the store.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
	
				var d = new doh.Deferred();
				var onItem = function(item){
					t.assertTrue(item !== null);
					var name = store.getValue(item,"name");
					t.assertTrue(name === "El Salvador");
					d.callback(true);
				};
				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetchItemByIdentity({identity: "sv", onItem: onItem, onError: onError});
				return d; // Deferred
			}
		},
		{
			name: "Read API: getValues()",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the getValues function of the store.
				//	description:
				//		Simple test of the getValues function of the store.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
	
				var d = new doh.Deferred();
				var onItem = function(item){
					t.assertTrue(item !== null);
					var names = store.getValues(item,"name");
					t.assertTrue(dojo.isArray(names));
					t.assertEqual(names.length, 1);
					t.assertEqual(names[0], "El Salvador");
					d.callback(true);
				};
				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetchItemByIdentity({identity: "sv", onItem: onItem, onError: onError});
				return d; // Deferred
			}
		},
		{
			name: "Read API: isItem()",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the isItem function of the store
				//	description:
				//		Simple test of the isItem function of the store
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
	
				var d = new doh.Deferred();
				var onItem = function(item){
					t.assertTrue(item !== null);
					t.assertTrue(store.isItem(item));
					t.assertTrue(!store.isItem({}));
					d.callback(true);
				};
				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetchItemByIdentity({identity: "sv", onItem: onItem, onError: onError});
				return d; // Deferred
			}
		},
		{
			name: "Read API: isItem() multistore",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the isItem function of the store
				//		to verify two different store instances do not accept
				//		items from each other.
				//	description:
				//		Simple test of the isItem function of the store
				//		to verify two different store instances do not accept
				//		items from each other.
	
				// Two different instances, even  if they read from the same URL 
				// should not accept items between each other!
				var store1 = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				var store2 = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
	
				var d = new doh.Deferred();

				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};

				var onItem1 = function(item1){
					t.assertTrue(item1 !== null);
					
					var onItem2 = function(item2){
						t.assertTrue(item1 !== null);
						t.assertTrue(item2 !== null);
						t.assertTrue(store1.isItem(item1));
						t.assertTrue(store2.isItem(item2));
						t.assertTrue(!store1.isItem(item2));
						t.assertTrue(!store2.isItem(item1));
						d.callback(true);
					};
					store2.fetchItemByIdentity({identity: "sv", onItem: onItem2, onError: onError});
	
				};
				store1.fetchItemByIdentity({identity: "sv", onItem: onItem1, onError: onError});
				return d; // Deferred
			}
		},
		{
			name: "Read API: hasAttribute()",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the hasAttribute function of the store
				//	description:
				//		Simple test of the hasAttribute function of the store
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
	
				var d = new doh.Deferred();
				var onItem = function(item){
					t.assertTrue(item !== null);
					t.assertTrue(store.hasAttribute(item, "abbr"));
					t.assertTrue(!store.hasAttribute(item, "abbr_not"));
	
					//Test that null attributes throw an exception
					var passed = false;
					try{
						store.hasAttribute(item, null);
					}catch (e){
						passed = true;
					}
					t.assertTrue(passed);
					d.callback(true);
				};
				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetchItemByIdentity({identity: "sv", onItem: onItem, onError: onError});
				return d; // Deferred
			}
		},
		{
			name: "Read API: containsValue()",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the containsValue function of the store
				//	description:
				//		Simple test of the containsValue function of the store
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
	
				var d = new doh.Deferred();
				var onItem = function(item){
					t.assertTrue(item !== null);
					t.assertTrue(store.containsValue(item, "abbr", "sv"));
					t.assertTrue(!store.containsValue(item, "abbr", "sv1"));
					t.assertTrue(!store.containsValue(item, "abbr", null));
	
					//Test that null attributes throw an exception
					var passed = false;
					try{
						store.containsValue(item, null, "foo");
					}catch (e){
						passed = true;
					}
					t.assertTrue(passed);
					d.callback(true);
				};
				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetchItemByIdentity({identity: "sv", onItem: onItem, onError: onError});
				return d; // Deferred
			}
		},
		{
			name: "Read API: getAttributes()",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the getAttributes function of the store
				//	description:
				//		Simple test of the getAttributes function of the store
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
	
				var d = new doh.Deferred();
				var onItem = function(item){
					t.assertTrue(item !== null);
					t.assertTrue(store.isItem(item));
	
					var attributes = store.getAttributes(item);
					t.assertEqual(attributes.length, 3);
					for(var i = 0; i < attributes.length; i++){
						t.assertTrue((attributes[i] === "name" || attributes[i] === "abbr" || attributes[i] === "capital"));
					}
					d.callback(true);
				};
				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetchItemByIdentity({identity: "sv", onItem: onItem, onError: onError});
				return d; // Deferred
			}
		},
		{
			name: "Read API: getFeatures()",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the getFeatures function of the store
				//	description:
				//		Simple test of the getFeatures function of the store
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
	
				var features = store.getFeatures();
				t.assertTrue(features["dojo.data.api.Read"] !== null);
				t.assertTrue(features["dojo.data.api.Identity"] !== null);
			}
		},
		{
			name: "Read API: fetch() patternMatch0",
	 		runTest: function(t){
				//	summary: 
				//		Function to test pattern matching of everything starting with lowercase e
				//	description:
				//		Function to test pattern matching of everything starting with lowercase e
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
	
				var d = new doh.Deferred();
				var completed = function(items, request) {
					t.assertEqual(items.length, 5);
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "abbr");
						if(!(value === "ec" || value === "eg" || value === "er" || value === "ee" || value === "et")){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected abbreviation found, match failure."));
					}
				};
				var error = function(error, request) {
					t.assertTrue(false);
					d.errback(error);
				};
				store.fetch({query: {abbr: "e*"}, onComplete: completed, onError: error});
				return d;
			}
		},
		{
			name: "Read API: fetch() patternMatch0, complex",
	 		runTest: function(t){
				//	summary: 
				//		Function to test pattern matching of everything starting with lowercase e
				//	description:
				//		Function to test pattern matching of everything starting with lowercase e
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
	
				var d = new doh.Deferred();
				var completed = function(items, request) {
					t.assertEqual(items.length, 5);
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "abbr");
						if(!(value === "ec" || value === "eg" || value === "er" || value === "ee" || value === "et")){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected abbreviation found, match failure."));
					}
				};
				var error = function(error, request) {
					t.assertTrue(false);
					d.errback(error);
				};
				store.fetch({query: 'abbr: "e*"', onComplete: completed, onError: error});
				return d;
			}
		},
		{
			name: "Read API: fetch() patternMatch1",
	 		runTest: function(t){
				//	summary: 
				//		Function to test pattern matching of everything with $ in it.
				//	description:
				//		Function to test pattern matching of everything with $ in it.
	
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												  items: [ {uniqueId: 1, value:"foo*bar"},
													   {uniqueId: 2, value:"bar*foo"}, 
													   {uniqueId: 3, value:"boomBam"},
													   {uniqueId: 4, value:"bit$Bite"},
													   {uniqueId: 5, value:"ouagadogou"},
													   {uniqueId: 6, value:"BaBaMaSaRa***Foo"},
													   {uniqueId: 7, value:"squawl"},
													   {uniqueId: 8, value:"seaweed"},
													   {uniqueId: 9, value:"jfq4@#!$!@Rf14r14i5u"}
													 ]
											}
									 });
				
				var d = new doh.Deferred();
				var completed = function(items, request){
					t.assertEqual(items.length, 2);
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!(value === "bit$Bite" || value === "jfq4@#!$!@Rf14r14i5u")){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected pattern matched.  Filter failure."));
					}
				};
				var error = function(error, request){
					t.assertTrue(false);
					d.errback(error);
				};
				store.fetch({query: {value: "*$*"}, onComplete: completed, onError: error});
				return d;
			}
		},
		{
			name: "Read API: fetch() patternMatch1, complex",
	 		runTest: function(t){
				//	summary: 
				//		Function to test pattern matching of everything with $ in it.
				//	description:
				//		Function to test pattern matching of everything with $ in it.
	
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												  items: [ {uniqueId: 1, value:"foo*bar"},
													   {uniqueId: 2, value:"bar*foo"}, 
													   {uniqueId: 3, value:"boomBam"},
													   {uniqueId: 4, value:"bit$Bite"},
													   {uniqueId: 5, value:"ouagadogou"},
													   {uniqueId: 6, value:"BaBaMaSaRa***Foo"},
													   {uniqueId: 7, value:"squawl"},
													   {uniqueId: 8, value:"seaweed"},
													   {uniqueId: 9, value:"jfq4@#!$!@Rf14r14i5u"}
													 ]
											}
									 });
				
				var d = new doh.Deferred();
				var completed = function(items, request){
					t.assertEqual(items.length, 2);
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!(value === "bit$Bite" || value === "jfq4@#!$!@Rf14r14i5u")){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected pattern matched.  Filter failure."));
					}
				};
				var error = function(error, request){
					t.assertTrue(false);
					d.errback(error);
				};
				store.fetch({query: 'value: "*$*"', onComplete: completed, onError: error});
				return d;
			}
		},
		{
			name: "Read API: fetch() patternMatch2",
	 		runTest: function(t){
				//	summary: 
				//		Function to test exact pattern match
				//	description:
				//		Function to test exact pattern match
	
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												  items: [ {uniqueId: 1, value:"foo*bar"},
													   {uniqueId: 2, value:"bar*foo"}, 
													   {uniqueId: 3, value:"boomBam"},
													   {uniqueId: 4, value:"bit$Bite"},
													   {uniqueId: 5, value:"ouagadogou"},
													   {uniqueId: 6, value:"BaBaMaSaRa***Foo"},
													   {uniqueId: 7, value:"squawl"},
													   {uniqueId: 8, value:"seaweed"},
													   {uniqueId: 9, value:"jfq4@#!$!@Rf14r14i5u"}
													 ]
											}
									 });
	
				var d = new doh.Deferred();
				var completed = function(items, request){
					t.assertEqual(items.length, 1);
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!(value === "bar*foo")){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected abbreviation found, match failure."));
					}
				};
				var error = function(error, request){
					t.assertTrue(false);
					d.errback(error);
				};
				store.fetch({query: {value: "bar\\*foo"}, onComplete: completed, onError: error});
				return d;
			}
		},
		{
			name: "Read API: fetch() patternMatch2, complex",
	 		runTest: function(t){
				//	summary: 
				//		Function to test exact pattern match
				//	description:
				//		Function to test exact pattern match
	
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												  items: [ {uniqueId: 1, value:"foo*bar"},
													   {uniqueId: 2, value:"bar*foo"}, 
													   {uniqueId: 3, value:"boomBam"},
													   {uniqueId: 4, value:"bit$Bite"},
													   {uniqueId: 5, value:"ouagadogou"},
													   {uniqueId: 6, value:"BaBaMaSaRa***Foo"},
													   {uniqueId: 7, value:"squawl"},
													   {uniqueId: 8, value:"seaweed"},
													   {uniqueId: 9, value:"jfq4@#!$!@Rf14r14i5u"}
													 ]
											}
									 });
	
				var d = new doh.Deferred();
				var completed = function(items, request){
					t.assertEqual(items.length, 1);
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!(value === "bar*foo")){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected abbreviation found, match failure."));
					}
				};
				var error = function(error, request){
					t.assertTrue(false);
					d.errback(error);
				};
				store.fetch({query: 'value: "bar\\*foo"', onComplete: completed, onError: error});
				return d;
			}
		},
		{
			name: "Read API: fetch() patternMatch_caseSensitive",
	 		runTest: function(t){
				//	summary: 
				//		Function to test pattern matching of a pattern case-sensitively
				//	description:
				//		Function to test pattern matching of a pattern case-sensitively
	
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												  items: [ {uniqueId: 1, value:"foo*bar"},
													   {uniqueId: 2, value:"bar*foo"}, 
													   {uniqueId: 3, value:"BAR*foo"},
													   {uniqueId: 4, value:"BARBananafoo"}
													 ]
											}
									 });
				
				var d = new doh.Deferred();
				var completed = function(items, request){
					t.assertEqual(1, items.length);
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!(value === "bar*foo")){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected pattern matched.  Filter failure."));
					}
				};
				var error = function(error, request){
					t.assertTrue(false);
					d.errback(error);
				};
				store.fetch({query: {value: "bar\\*foo"}, queryOptions: {ignoreCase: false} , onComplete: completed, onError: error});
				return d;
			}
		},
		{
			name: "Read API: fetch() patternMatch_caseSensitive, complex",
	 		runTest: function(t){
				//	summary: 
				//		Function to test pattern matching of a pattern case-sensitively
				//	description:
				//		Function to test pattern matching of a pattern case-sensitively
	
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												  items: [ {uniqueId: 1, value:"foo*bar"},
													   {uniqueId: 2, value:"bar*foo"}, 
													   {uniqueId: 3, value:"BAR*foo"},
													   {uniqueId: 4, value:"BARBananafoo"}
													 ]
											}
									 });
				
				var d = new doh.Deferred();
				var completed = function(items, request){
					t.assertEqual(1, items.length);
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!(value === "bar*foo")){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected pattern matched.  Filter failure."));
					}
				};
				var error = function(error, request){
					t.assertTrue(false);
					d.errback(error);
				};
				store.fetch({query: 'value: "bar\\*foo"', queryOptions: {ignoreCase: false} , onComplete: completed, onError: error});
				return d;
			}
		},
		{
			name: "Read API: fetch() patternMatch_caseInsensitive",
	 		runTest: function(t){
				//	summary: 
				//		Function to test pattern matching of a pattern case-insensitively
				//	description:
				//		Function to test pattern matching of a pattern case-insensitively
	
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												  items: [ {uniqueId: 1, value:"foo*bar"},
													   {uniqueId: 2, value:"bar*foo"}, 
													   {uniqueId: 3, value:"BAR*foo"},
													   {uniqueId: 4, value:"BARBananafoo"}
													 ]
											}
									 });
				
				var d = new doh.Deferred();
				var completed = function(items, request){
					t.assertEqual(items.length, 2);
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!(value === "BAR*foo" || value === "bar*foo")){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected pattern matched.  Filter failure."));
					}
				};
				var error = function(error, request){
					t.assertTrue(false);
					d.errback(error);
				};
				store.fetch({query: {value: "bar\\*foo"}, queryOptions: {ignoreCase: true}, onComplete: completed, onError: error});
				return d;
			}
		},
		{
			name: "Read API: fetch() patternMatch_caseInsensitive, complex",
	 		runTest: function(t){
				//	summary: 
				//		Function to test pattern matching of a pattern case-insensitively
				//	description:
				//		Function to test pattern matching of a pattern case-insensitively
	
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												  items: [ {uniqueId: 1, value:"foo*bar"},
													   {uniqueId: 2, value:"bar*foo"}, 
													   {uniqueId: 3, value:"BAR*foo"},
													   {uniqueId: 4, value:"BARBananafoo"}
													 ]
											}
									 });
				
				var d = new doh.Deferred();
				var completed = function(items, request){
					t.assertEqual(items.length, 2);
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!(value === "BAR*foo" || value === "bar*foo")){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected pattern matched.  Filter failure."));
					}
				};
				var error = function(error, request){
					t.assertTrue(false);
					d.errback(error);
				};
				store.fetch({query: 'value: "bar\\*foo"', queryOptions: {ignoreCase: true}, onComplete: completed, onError: error});
				return d;
			}
		},
		{
			name: "Read API: fetch() sortNumeric",
	 		runTest: function(t){
				//	summary: 
				//		Function to test sorting numerically.
				//	description:
				//		Function to test sorting numerically.
				
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												  items: [ {uniqueId: 0, value:"fo|o*b.ar"},
													   {uniqueId: 1, value:"ba|r*foo"}, 
													   {uniqueId: 2, value:"boomBam"},
													   {uniqueId: 3, value:"bit$Bite"},
													   {uniqueId: 4, value:"ouagadogou"},
													   {uniqueId: 5, value:"jfq4@#!$!@|f1.$4r14i5u"},
													   {uniqueId: 6, value:"BaB{aMa|SaRa***F}oo"},
													   {uniqueId: 7, value:"squawl"},
													   {uniqueId: 9, value:"seaweed"},
													   {uniqueId: 10, value:"zulu"},
													   {uniqueId: 8, value:"seaweed"}
													 ]
											}
									 });
	
				var d = new doh.Deferred();
				var completed = function(items, request){
					t.assertEqual(items.length, 11);
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!(store.getValue(items[i], "uniqueId") === i)){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected sorting order found, sort failure."));
					}
				};
	
				var error = function(error, request){
					t.assertTrue(false);
					d.errback(error);
				};
	
				var sortAttributes = [{attribute: "uniqueId"}];
				store.fetch({onComplete: completed, onError: error, sort: sortAttributes});
				return d;
			}
		},
		{
			name: "Read API: fetch() sortNumericDescending",
	 		runTest: function(t){
				//	summary: 
				//		Function to test sorting numerically.
				//	description:
				//		Function to test sorting numerically.
	
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												  items: [ {uniqueId: 0, value:"fo|o*b.ar"},
													   {uniqueId: 1, value:"ba|r*foo"}, 
													   {uniqueId: 2, value:"boomBam"},
													   {uniqueId: 3, value:"bit$Bite"},
													   {uniqueId: 4, value:"ouagadogou"},
													   {uniqueId: 5, value:"jfq4@#!$!@|f1.$4r14i5u"},
													   {uniqueId: 6, value:"BaB{aMa|SaRa***F}oo"},
													   {uniqueId: 7, value:"squawl"},
													   {uniqueId: 9, value:"seaweed"},
													   {uniqueId: 10, value:"zulu"},
													   {uniqueId: 8, value:"seaweed"}
													 ]
											}
									 });
				var d = new doh.Deferred();
				var completed = function(items, request){
					t.assertEqual(items.length, 11);
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!((items.length - (store.getValue(items[i], "uniqueId") + 1)) === i)){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected sorting order found, sort failure."));
					}
				};
	
				var error = function(error, request){
					t.assertTrue(false);
					d.errback(error);
				};
	
				var sortAttributes = [{attribute: "uniqueId", descending: true}];
				store.fetch({onComplete: completed, onError: error, sort: sortAttributes});
				return d;
			}
		},
		{
			name: "Read API: fetch() sortNumericWithCount",
	 		runTest: function(t){
				//	summary: 
				//		Function to test sorting numerically in descending order, returning only a specified number of them.
				//	description:
				//		Function to test sorting numerically in descending order, returning only a specified number of them.
			
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												 items: [ {uniqueId: 0, value:"fo|o*b.ar"},
													  {uniqueId: 1, value:"ba|r*foo"}, 
													  {uniqueId: 2, value:"boomBam"},
													  {uniqueId: 3, value:"bit$Bite"},
													  {uniqueId: 4, value:"ouagadogou"},
													  {uniqueId: 5, value:"jfq4@#!$!@|f1.$4r14i5u"},
													  {uniqueId: 6, value:"BaB{aMa|SaRa***F}oo"},
													  {uniqueId: 7, value:"squawl"},
													  {uniqueId: 9, value:"seaweed"},
													  {uniqueId: 10, value:"zulu"},
													  {uniqueId: 8, value:"seaweed"}
													]
										   }
									});
				
				var d = new doh.Deferred();
				var completed = function(items, request){
					t.assertEqual(items.length, 5);
					var itemId = 10;
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!(store.getValue(items[i], "uniqueId") === itemId)){
							passed=false;
							break;
						}
						itemId--; // Decrement the item id.  We are descending sorted, so it should go 10, 9, 8, etc.
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected sorting order found, sort failure."));
					}
				};
				 
				var error = function(error, request){
					t.assertTrue(false);
					d.errback(error);
				};
			
				var sortAttributes = [{attribute: "uniqueId", descending: true}];
				store.fetch({onComplete: completed, onError: error, sort: sortAttributes, count: 5});
				return d;
			}
		},
		{
			name: "Read API: fetch() sortAlphabetic",
	 		runTest: function(t){
				//	summary: 
				//		Function to test sorting alphabetic ordering.
				//	description:
				//		Function to test sorting alphabetic ordering.
			
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												 items: [ {uniqueId: 0, value:"abc"},
													  {uniqueId: 1, value:"bca"}, 
													  {uniqueId: 2, value:"abcd"},
													  {uniqueId: 3, value:"abcdefg"},
													  {uniqueId: 4, value:"lmnop"},
													  {uniqueId: 5, value:"foghorn"},
													  {uniqueId: 6, value:"qberty"},
													  {uniqueId: 7, value:"qwerty"},
													  {uniqueId: 8, value:""},
													  {uniqueId: 9, value:"seaweed"},
													  {uniqueId: 10, value:"123abc"}
			
													]
										   }
									});
				
				var d = new doh.Deferred();
				var completed = function(items, request){
					//Output should be in this order...
					var orderedArray = [ 	"",
											"123abc",
											"abc",
											"abcd",
											"abcdefg",
											"bca",
											"foghorn",
											"lmnop",
											"qberty",
											"qwerty",
											"seaweed"
						];
					t.assertEqual(items.length, 11);
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!(store.getValue(items[i], "value") === orderedArray[i])){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected sorting order found, sort failure."));
					}
				};
			
				var error = function(error, request) {
					t.assertTrue(false);
					d.errback(error);
				};
			
				var sortAttributes = [{attribute: "value"}];
				store.fetch({onComplete: completed, onError: error, sort: sortAttributes});
				return d;
			}
		},
		{
			name: "Read API: fetch() sortAlphabeticDescending",
	 		runTest: function(t){
				//	summary: 
				//		Function to test sorting alphabetic ordering in descending mode.
				//	description:
				//		Function to test sorting alphabetic ordering in descending mode.
			
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												 items: [ {uniqueId: 0, value:"abc"},
													  {uniqueId: 1, value:"bca"}, 
													  {uniqueId: 2, value:"abcd"},
													  {uniqueId: 3, value:"abcdefg"},
													  {uniqueId: 4, value:"lmnop"},
													  {uniqueId: 5, value:"foghorn"},
													  {uniqueId: 6, value:"qberty"},
													  {uniqueId: 7, value:"qwerty"},
													  {uniqueId: 8, value:""},
													  {uniqueId: 9, value:"seaweed"},
													  {uniqueId: 10, value:"123abc"}
			
													]
										   }
									});
				var d = new doh.Deferred();
				var completed = function(items, request){
					//Output should be in this order...
					var orderedArray = [ 	"",
											"123abc",
											"abc",
											"abcd",
											"abcdefg",
											"bca",
											"foghorn",
											"lmnop",
											"qberty",
											"qwerty",
											"seaweed"
						];
					orderedArray = orderedArray.reverse();
					t.assertEqual(items.length, 11);
	
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!(store.getValue(items[i], "value") === orderedArray[i])){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected sorting order found, sort failure."));
					}
				};
			
				var error = function(error, request) {
					t.assertTrue(false);
					d.errback(error);
				};
			
				var sortAttributes = [{attribute: "value", descending: true}];
				store.fetch({onComplete: completed, onError: error, sort: sortAttributes});
				return d;
			}
		},
		{
			name: "Read API: fetch() sortDate",
	 		runTest: function(t){
				//	summary: 
				//		Function to test sorting date.
				//	description:
				//		Function to test sorting date.
			
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												 items: [ {uniqueId: 0, value: new Date(0)},
													  {uniqueId: 1, value: new Date(100)}, 
													  {uniqueId: 2, value:new Date(1000)},
													  {uniqueId: 3, value:new Date(2000)},
													  {uniqueId: 4, value:new Date(3000)},
													  {uniqueId: 5, value:new Date(4000)},
													  {uniqueId: 6, value:new Date(5000)},
													  {uniqueId: 7, value:new Date(6000)},
													  {uniqueId: 8, value:new Date(7000)},
													  {uniqueId: 9, value:new Date(8000)},
													  {uniqueId: 10, value:new Date(9000)}
			
													]
										   }
									});
				
				var d = new doh.Deferred();
				var completed = function(items,request){
					var orderedArray =	[0,100,1000,2000,3000,4000,5000,6000,7000,8000,9000];
					t.assertEqual(items.length, 11);
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!(store.getValue(items[i], "value").getTime() === orderedArray[i])){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected sorting order found, sort failure."));
					}
				};
			
				var error = function(error, request){
					t.assertTrue(false);
					d.errback(error);
				};
			
				var sortAttributes = [{attribute: "value"}];
				store.fetch({onComplete: completed, onError: error, sort: sortAttributes});
				return d;
			}
		},
		{
			name: "Read API: fetch() sortDateDescending",
	 		runTest: function(t){
				//	summary: 
				//		Function to test sorting date in descending order.
				//	description:
				//		Function to test sorting date in descending order.
			
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												 items: [ {uniqueId: 0, value: new Date(0)},
													  {uniqueId: 1, value: new Date(100)}, 
													  {uniqueId: 2, value:new Date(1000)},
													  {uniqueId: 3, value:new Date(2000)},
													  {uniqueId: 4, value:new Date(3000)},
													  {uniqueId: 5, value:new Date(4000)},
													  {uniqueId: 6, value:new Date(5000)},
													  {uniqueId: 7, value:new Date(6000)},
													  {uniqueId: 8, value:new Date(7000)},
													  {uniqueId: 9, value:new Date(8000)},
													  {uniqueId: 10, value:new Date(9000)}
			
													]
										   }
									});
			
				var d = new doh.Deferred();
				var completed = function(items,request){
					var orderedArray =	[0,100,1000,2000,3000,4000,5000,6000,7000,8000,9000];
					orderedArray = orderedArray.reverse();
					t.assertEqual(items.length, 11);
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!(store.getValue(items[i], "value").getTime() === orderedArray[i])){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected sorting order found, sort failure."));
					}
				};
			
				var error = function(error, request){
					t.assertTrue(false);
					d.errback(error);
				};
			
				var sortAttributes = [{attribute: "value", descending: true}];
				store.fetch({onComplete: completed, onError: error, sort: sortAttributes});
				return d;
			}
		},
		{
			name: "Read API: fetch() sortMultiple",
	 		runTest: function(t){
				//	summary: 
				//		Function to test sorting on multiple attributes.
				//	description:
				//		Function to test sorting on multiple attributes.
				
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												 items: [ {uniqueId: 1, value:"fo|o*b.ar"},
													  {uniqueId: 2, value:"ba|r*foo"}, 
													  {uniqueId: 3, value:"boomBam"},
													  {uniqueId: 4, value:"bit$Bite"},
													  {uniqueId: 5, value:"ouagadogou"},
													  {uniqueId: 6, value:"jfq4@#!$!@|f1.$4r14i5u"},
													  {uniqueId: 7, value:"BaB{aMa|SaRa***F}oo"},
													  {uniqueId: 8, value:"squawl"},
													  {uniqueId: 10, value:"seaweed"},
													  {uniqueId: 12, value:"seaweed"},
													  {uniqueId: 11, value:"zulu"},
													  {uniqueId: 9, value:"seaweed"}
													]
										   }
									});
			
				var d = new doh.Deferred();
				var completed = function(items, request){
					var orderedArray0 = [7,2,4,3,1,6,5,12,10,9,8,11];
					var orderedArray1 = [	"BaB{aMa|SaRa***F}oo",
											"ba|r*foo",
											"bit$Bite",
											"boomBam",
											"fo|o*b.ar",
											"jfq4@#!$!@|f1.$4r14i5u",
											"ouagadogou",
											"seaweed",
											"seaweed",
											"seaweed",
											"squawl",
											"zulu"
										];
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!(	(store.getValue(items[i], "uniqueId") === orderedArray0[i])&&
								(store.getValue(items[i], "value") === orderedArray1[i]))
							){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected sorting order found, sort failure."));
					}
				};
			
				var error = function(error, request){
					t.assertTrue(false);
					d.errback(error);
				};
			
				var sortAttributes = [{ attribute: "value"}, { attribute: "uniqueId", descending: true}];
				store.fetch({onComplete: completed, onError: error, sort: sortAttributes});
				return d;
			}
		},
		{
			name: "Read API: fetch() sortMultipleSpecialComparator",
	 		runTest: function(t){
				//	summary: 
				//		Function to test sorting on multiple attributes with a custom comparator.
				//	description:
				//		Function to test sorting on multiple attributes with a custom comparator.
	
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												 items: [ {uniqueId: 1, status:"CLOSED"},
													  {uniqueId: 2,  status:"OPEN"}, 
													  {uniqueId: 3,  status:"PENDING"},
													  {uniqueId: 4,  status:"BLOCKED"},
													  {uniqueId: 5,  status:"CLOSED"},
													  {uniqueId: 6,  status:"OPEN"},
													  {uniqueId: 7,  status:"PENDING"},
													  {uniqueId: 8,  status:"PENDING"},
													  {uniqueId: 10, status:"BLOCKED"},
													  {uniqueId: 12, status:"BLOCKED"},
													  {uniqueId: 11, status:"OPEN"},
													  {uniqueId: 9,  status:"CLOSED"}
													]
										   }
									});
			
			
				store.comparatorMap = {};
				store.comparatorMap["status"] = function(a,b) { 
					var ret = 0;
					// We want to map these by what the priority of these items are, not by alphabetical.
					// So, custom comparator.
					var enumMap = { OPEN: 3, BLOCKED: 2, PENDING: 1, CLOSED: 0};
					if (enumMap[a] > enumMap[b]) {
						ret = 1;
					}
					if (enumMap[a] < enumMap[b]) {
						ret = -1;
					}
					return ret;
				};
			
				var sortAttributes = [{attribute: "status", descending: true}, { attribute: "uniqueId", descending: true}];
			
				var d = new doh.Deferred();
				var completed = function(items, findResult){
					var orderedArray = [11,6,2,12,10,4,8,7,3,9,5,1];
					var passed = true;
					for(var i = 0; i < items.length; i++){
						var value = store.getValue(items[i], "value");
						if(!(store.getValue(items[i], "uniqueId") === orderedArray[i])){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected sorting order found, sort failure."));
					}
				};
			
				var error = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({onComplete: completed, onError: error, sort: sortAttributes});
				return d;
			}
		},
		{
			name: "Read API: fetch() sortAlphabeticWithUndefined",
	 		runTest: function(t){
				//	summary: 
				//		Function to test sorting alphabetic ordering.
				//	description:
				//		Function to test sorting alphabetic ordering.
			
				var store = new dojox.data.AndOrReadStore({data: { identifier: "uniqueId", 
												 items: [ {uniqueId: 0, value:"abc"},
													  {uniqueId: 1, value:"bca"}, 
													  {uniqueId: 2, value:"abcd"},
													  {uniqueId: 3, value:"abcdefg"},
													  {uniqueId: 4, value:"lmnop"},
													  {uniqueId: 5, value:"foghorn"},
													  {uniqueId: 6, value:"qberty"},
													  {uniqueId: 7, value:"qwerty"},
													  {uniqueId: 8 },  //Deliberate undefined value
													  {uniqueId: 9, value:"seaweed"},
													  {uniqueId: 10, value:"123abc"}
			
													]
										   }
									});
				
				var d = new doh.Deferred();
				var completed = function(items, request){
					//Output should be in this order...
					var orderedArray = [10,0,2,3,1,5,4,6,7,9,8];
					t.assertEqual(items.length, 11);
					var passed = true;
					for(var i = 0; i < items.length; i++){
						if(!(store.getValue(items[i], "uniqueId") === orderedArray[i])){
							passed=false;
							break;
						}
					}
					t.assertTrue(passed);
					if (passed){
						d.callback(true);
					}else{
						d.errback(new Error("Unexpected sorting order found, sort failure."));
					}
				};
			
				var error = function(error, request) {
					t.assertTrue(false);
					d.errback(error);
				};
			
				var sortAttributes = [{attribute: "value"}];
				store.fetch({onComplete: completed, onError: error, sort: sortAttributes});
				return d;
			}
		},
		{
			name: "Read API: errorCondition_idCollision_inMemory",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the errors thrown when there is an id collision in the data.
				//		Added because of tracker: #2546
				//	description:
				//		Simple test of the errors thrown when there is an id collision in the data.
				//		Added because of tracker: #2546
	
				var store = new dojox.data.AndOrReadStore({	data: { identifier: "uniqueId", 
																	items: [{uniqueId: 12345, value:"foo"},
																			{uniqueId: 123456, value:"bar"}, 
																			{uniqueId: 12345, value:"boom"},
																			{uniqueId: 123457, value:"bit"}
																		]
																	}
																});
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					//This is bad if this fires, this case should fail and not call onComplete.
					t.assertTrue(false);
					d.callback(false);
				};
			
				var reportError = function(errData, request){
					//This is good if this fires, it is expected.
					t.assertTrue(true);
					d.callback(true);
				};
				store.fetch({onComplete: onComplete, onError: reportError});
				return d;
			}
		},
		{
			name: "Read API: errorCondition_idCollision_xhr",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of the errors thrown when there is an id collision in the data.
				//		Added because of tracker: #2546
				//	description:
				//		Simple test of the errors thrown when there is an id collision in the data.
				//		Added because of tracker: #2546
	
				if(dojo.isBrowser){
					var store = new dojox.data.AndOrReadStore({url: dojo.moduleUrl("tests", "data/countries_idcollision.json").toString() });
					var d = new doh.Deferred();
					var onComplete = function(items, request){
						//This is bad if this fires, this case should fail and not call onComplete.
						t.assertTrue(false);
						d.callback(false);
					};
	
					var reportError = function(errData, request){
						//This is good if this fires, it is expected.
						t.assertTrue(true);
						d.callback(true);
					};
					store.fetch({onComplete: onComplete, onError: reportError});
					return d;
				}
			}
		},
		{
			name: "Read API: Date_datatype",
	 		runTest: function(t){
				//var store = new dojox.data.AndOrReadStore(tests.data.readOnlyItemFileTestTemplates.testFile["countries_withDates"]);
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries_withDates"));
				
				var d = new doh.Deferred();
				var onItem = function(item){
					t.assertTrue(item !== null);
					var independenceDate = store.getValue(item, "independence");
					t.assertTrue(independenceDate instanceof Date);
					//Check to see if the value was deserialized properly.  Since the store stores in UTC/GMT, it 
					//should also be compared in the UTC/GMT mode
					t.assertTrue(dojo.date.stamp.toISOString(independenceDate, {zulu:true}) === "1993-05-24T00:00:00Z");
					d.callback(true);
				};
				var onError = function(errData){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetchItemByIdentity({identity:"er", onItem:onItem, onError:onError});
				return d; // Deferred
			}
		},
		{
			name: "Read API: custom_datatype_Color_SimpleMapping",
	 		runTest: function(t){
				//	summary: 
				//		Function to test using literal values with custom datatypes
				var dataset = {
					identifier:'name',
					items: [
						{ name:'Kermit', species:'frog', color:{_type:'Color', _value:'green'} },
						{ name:'Beaker', hairColor:{_type:'Color', _value:'red'} }
					]
				};
				var store = new dojox.data.AndOrReadStore({
						data:dataset,
						typeMap:{'Color': dojo.Color}
				});
				var d = new doh.Deferred();
				var onItem = function(item){
					t.assertTrue(item !== null);
					var beaker = item;
					var hairColor = store.getValue(beaker, "hairColor");
					t.assertTrue(hairColor instanceof dojo.Color);
					t.assertTrue(hairColor.toHex() == "#ff0000");
					d.callback(true);
				};
				var onError = function(errData){
					d.errback(errData);
				};
				store.fetchItemByIdentity({identity:"Beaker", onItem:onItem, onError:onError});
				return d; // Deferred
			}
		},
		{
			name: "Read API: custom_datatype_Color_GeneralMapping",
	 		runTest: function(t){
				//	summary: 
				//		Function to test using literal values with custom datatypes
				var dataset = {
					identifier:'name',
					items: [
						{ name:'Kermit', species:'frog', color:{_type:'Color', _value:'green'} },
						{ name:'Beaker', hairColor:{_type:'Color', _value:'red'} }
					]
				};
				var store = new dojox.data.AndOrReadStore({
						data:dataset,
						typeMap:{'Color': 	{	
												type: dojo.Color,
												deserialize: function(value){
													return new dojo.Color(value);
												}
											}
								}
				});
				var d = new doh.Deferred();
				var onItem = function(item){
					t.assertTrue(item !== null);
					var beaker = item;
					var hairColor = store.getValue(beaker, "hairColor");
					t.assertTrue(hairColor instanceof dojo.Color);
					t.assertTrue(hairColor.toHex() == "#ff0000");
					d.callback(true);
				};
				var onError = function(errData){
					d.errback(errData);
				};
				store.fetchItemByIdentity({identity:"Beaker", onItem:onItem, onError:onError});
				return d; // Deferred
			}
		},
		{
			name: "Read API: hierarchical_data",
	 		runTest: function(t){
				//var store = new dojox.data.AndOrReadStore(tests.data.readOnlyItemFileTestTemplates.testFile["geography_hierarchy_small"]);
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("geography_hierarchy_small"));
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 1);
					var northAmerica = items[0];
					var canada = store.getValue(northAmerica, "countries");
					var toronto = store.getValue(canada, "cities");
					t.assertEqual(store.getValue(canada, "name"), "Canada");
					t.assertEqual(store.getValue(toronto, "name"), "Toronto");
					d.callback(true);
				};
				var onError = function(errData){
					d.errback(errData);
				};
				store.fetch({
					query: {name: "North America"},
					onComplete: onComplete,
					onError: onError
				});
				
				return d; // Deferred
			}
		},
		{
			name: "Read API: hierarchical_data, complex",
	 		runTest: function(t){
				//var store = new dojox.data.AndOrReadStore(tests.data.readOnlyItemFileTestTemplates.testFile["geography_hierarchy_small"]);
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("geography_hierarchy_small"));
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 1);
					var northAmerica = items[0];
					var canada = store.getValue(northAmerica, "countries");
					var toronto = store.getValue(canada, "cities");
					t.assertEqual(store.getValue(canada, "name"), "Canada");
					t.assertEqual(store.getValue(toronto, "name"), "Toronto");
					d.callback(true);
				};
				var onError = function(errData){
					d.errback(errData);
				};
				store.fetch({
					query: 'name: "North America"',
					onComplete: onComplete,
					onError: onError
				});
				
				return d; // Deferred
			}
		},
		{
			name: "Identity API: no_identifier_specified",
	 		runTest: function(t){
				var arrayOfItems = [
					{name:"Kermit", color:"green"},
					{name:"Miss Piggy", likes:"Kermit"}, 
					{name:"Beaker", hairColor:"red"}
				];
				var store = new dojox.data.AndOrReadStore({data:{items:arrayOfItems}});
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					var features = store.getFeatures();
					var hasIdentityFeature = Boolean(features['dojo.data.api.Identity']);
					t.assertTrue(hasIdentityFeature);
					for(var i = 0; i < items.length; ++i){
						var item = items[i];
						var identifier = store.getIdentityAttributes(item);
						t.assertTrue(identifier === null);
						var identity = store.getIdentity(item);
						t.assertTrue(typeof identity == "number");
					}
					d.callback(true);
				};
				var reportError = function(errData, request){
					d.errback(true);
				};
				store.fetch({onComplete: onComplete, onError: reportError});
				return d; // Deferred
			}
		},
		{
			name: "Identity API: hierarchical_data",
	 		runTest: function(t){
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("geography_hierarchy_small"));
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					var features = store.getFeatures();
					var hasIdentityFeature = Boolean(features['dojo.data.api.Identity']);
					t.assertTrue(hasIdentityFeature);
					for(var i = 0; i < items.length; ++i){
						var item = items[i];
						var identifier = store.getIdentityAttributes(item);
						t.assertTrue(identifier === null);
						var identity = store.getIdentity(item);
						t.assertTrue(typeof identity == "number");
					}
					d.callback(true);
				};
				var reportError = function(errData, request){
					d.errback(true);
				};
				store.fetch({onComplete: onComplete, onError: reportError});
				return d; // Deferred
			}
		},
		{
			name: "Read API: functionConformance",
	 		runTest: function(t){
				//	summary: 
				//		Simple test read API conformance.  Checks to see all declared functions are actual functions on the instances.
				//	description:
				//		Simple test read API conformance.  Checks to see all declared functions are actual functions on the instances.
				var testStore = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				var readApi = new dojo.data.api.Read();
				var passed = true;
	
				for(var i in readApi){
					if(i.toString().charAt(0) !== '_')
					{
						var member = readApi[i];
						//Check that all the 'Read' defined functions exist on the test store.
						if(typeof member === "function"){
							var testStoreMember = testStore[i];
							if(!(typeof testStoreMember === "function")){
								passed = false;
								break;
							}
						}
					}
				}
				t.assertTrue(passed);
			}
		},
		{
			name: "Identity API: functionConformance",
	 		runTest: function(t){
				//	summary: 
				//		Simple test identity API conformance.  Checks to see all declared functions are actual functions on the instances.
				//	description:
				//		Simple test identity API conformance.  Checks to see all declared functions are actual functions on the instances.
				var testStore = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				var identityApi = new dojo.data.api.Identity();
				var passed = true;
	
				for(var i in identityApi){
	
					if(i.toString().charAt(0) !== '_')
					{
						var member = identityApi[i];
						//Check that all the 'Read' defined functions exist on the test store.
						if(typeof member === "function"){
							var testStoreMember = testStore[i];
							if(!(typeof testStoreMember === "function")){
								passed = false;
								break;
							}
						}
					}
				}
				t.assertTrue(passed);
			}
		},
		//complex parallels of existing simple queries immediately follow them above.  can search on "complex"
		//below are complex queries.
		{
			name: "Read API: fetch() multiple, OR, complex",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 3);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: 'abbr: "s*" || capital:"A*"', 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() multiple, AND(OR, complex",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 3);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: 'abbr: "e*" AND (capital:"A*" or capital: "Q*")', 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() multiple, AND(OR, as json object, complex",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 3);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: {complexQuery:'abbr: "e*" AND (capital:"A*" or capital: "Q*")'}, 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() multiple, AND/OR, as json object, complex, with extra attrs",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 1);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: {complexQuery:'abbr: "e*" AND (capital:"A*" or capital: "Q*")', name: "Ec*"}, 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() multiple, AND/OR, as json object, complex, with extra attrs and spaces",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 1);
					t.assertEqual("Equatorial Guinea", store.getValue(items[0], "name"));
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: {complexQuery:'abbr: "g*" AND (capital:"A*" or capital: "M*")', name: "Equatorial G*"}, 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		},
		{
			name: "Read API: fetch() multiple, AND/OR, as quoted json object, complex",
	 		runTest: function(t){
				//	summary: 
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				//	description:
				//		Simple test of a basic fetch on AndOrReadStore of a single item.
				var store = new dojox.data.AndOrReadStore(dojox.data.tests.stores.AndOrReadStore.getTestData("countries"));
				
				var d = new doh.Deferred();
				var onComplete = function(items, request){
					t.assertEqual(items.length, 3);
					d.callback(true);
				};
				var onError = function(errData, request){
					t.assertTrue(false);
					d.errback(errData);
				};
				store.fetch({ 	query: "{complexQuery:'abbr: \"e*\" AND (capital:\"A*\" or capital: \"Q*\")'}", 
										onComplete: onComplete, 
										onError: onError
									});
				return d;
			}
		}
	];
	return dojox.data.tests.stores.AndOrReadStore.tests;
};
doh.register("dojox.data.tests.stores.AndOrReadStore", dojox.data.tests.stores.AndOrReadStore.getTests());

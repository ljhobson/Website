var botList = [];

{
botList.push(`
@NAME: "Communist";
@COLOUR: "#f03";
set mn pns cns cr rn rv me 0 0 0 0 0 0 0;
set last 0;
@SETUPINFO: {
	@MaximumIterations: 100000;
	LIST_gapToken: "_";
	input mn pns cns cr rn rv me;
	pns: [LIST_new pns];
	myName: [LIST_item pns me];
	print myName + " is here!";
	
	last: 0;
};
@INITIAL: {
	input owners armies toPlace;
	owners: [LIST_new owners];
	armies: [LIST_new armies];
	
	iown: [LIST_new [@OWNED me]];
	ownlen: [LIST_length iown];
	initial: last;
	for initial initial+toPlace 1 { input x;
		c: [LIST_item iown x%ownlen];
		call @PLACE c 1;
		last: x+1;
	};
};
@PLACING: {
	input owners armies toPlace;
	call @INITIAL owners armies toPlace;
};
@ATTACKING: {
	input owners armies toPlace;
	owners: [LIST_new owners];
	armies: [LIST_new armies];
	
	iown: [LIST_new [@OWNED me]];
	ownlen: [LIST_length iown];
	
	for 0 ownlen 1 { input x;
		c: [LIST_item iown x];
		amnt: [LIST_item armies c];
		if amnt > 5 {
			// search for victim
			cons: [LIST_new [@CONNECTIONS c]];
			inloop: 1;
			y: 0;
			while inloop {
				thiscon: [LIST_item cons y];
				reply: [LIST_indexOf [LIST_new [@OWNED me]] thiscon];
				if -1 == reply {
					//print "found one " + c + " -> " + thiscon;
					inloop: 0;
					if [@ATTACK c thiscon 1] {
						call @PLACE c 999;
					};
				};
				y: y+1;
				if [LIST_length cons] <= y {
					inloop: 0;
				};
			};
		};
	};
	print "COMPLETED";
};
@FORTIFYING: {
	
};
`);
}

{
botList.push(`@NAME: "Greed Communist";
@COLOUR: "#fe2";
set mn pns cns cr rn rv me 0 0 0 0 0 0 0;
set last 0;
@SETUPINFO: {
	@MaximumIterations: 100000;
	LIST_gapToken: "_";
	input mn pns cns cr rn rv me;
	pns: [LIST_new pns];
	myName: [LIST_item pns me];
	print myName + " is here!";
	
	last: 0;
};
@INITIAL: {
	input owners armies toPlace;
	owners: [LIST_new owners];
	armies: [LIST_new armies];
	
	iown: [LIST_new [@OWNED me]];
	ownlen: [LIST_length iown];
	initial: last;
	for initial initial+toPlace 1 { input x;
		c: [LIST_item iown x%ownlen];
		call @PLACE c 1;
		last: x+1;
	};
};
@PLACING: {
	input owners armies toPlace;
	call @INITIAL owners armies toPlace;
};
@ATTACKING: {
	input owners armies toPlace;
	owners: [LIST_new owners];
	armies: [LIST_new armies];
	
	iown: [LIST_new [@OWNED me]];
	ownlen: [LIST_length iown];
	
	for 0 ownlen 1 { input x;
		c: [LIST_item iown x];
		amnt: [LIST_item armies c];
		if amnt > 5 {
			// search for victim
			cons: [LIST_new [@CONNECTIONS c]];
			inloop: 1;
			y: 0;
			while inloop {
				thiscon: [LIST_item cons y];
				reply: [LIST_indexOf [LIST_new [@OWNED me]] thiscon];
				if -1 == reply {
					//print "found one " + c + " -> " + thiscon;
					inloop: 0;
					if [@ATTACK c thiscon 1] {
						call @PLACE thiscon 999;
					};
				};
				y: y+1;
				if [LIST_length cons] <= y {
					inloop: 0;
				};
			};
		};
	};
	print "COMPLETED";
};
@FORTIFYING: {
	
};`);
}

{
botList.push(`@NAME: "Tank";
@COLOUR: "#f90";
set mn pns cns cr rn rv me 0 0 0 0 0 0 0;
@SETUPINFO: {
	@MaximumIterations: 100000;
	LIST_gapToken: "_";
	input mn pns cns cr rn rv me;
	pns cns: [LIST_new pns] [LIST_new cns];
	myName: [LIST_item pns me];
	print myName + " is here!";
	
	
};
@INITIAL: {
	input owners armies toPlace;
	owners: [LIST_new owners];
	armies: [LIST_new armies];
	
	iown: [LIST_new [@OWNED me]];
	ownlen: [LIST_length iown];
	
	bigVal: 0;
	biggest: 0;
	for 0 ownlen 1 { input x;
		amnt: [LIST_item armies [LIST_item iown x]];
		if amnt > bigVal {
			biggest: x;
			bigVal: amnt;
		};
	};
	
	[{x: biggest;
	c: [LIST_item iown x];
	call @PLACE c toPlace/3+1;
	}];
};
@PLACING: {
	input owners armies toPlace;
	call @INITIAL owners armies toPlace;
};
@ATTACKING: {
	input owners armies toPlace;
	owners: [LIST_new owners];
	armies: [LIST_new armies];
	
	iown: [LIST_new [@OWNED me]];
	ownlen: [LIST_length iown];
	
	for 0 ownlen 1 { input x;
		c: [LIST_item iown x];
		amnt: [LIST_item armies c];
		if amnt > 5 {
			// search for victim
			cons: [LIST_new [@CONNECTIONS c]];
			inloop: 1;
			y: 0;
			while inloop {
				thiscon: [LIST_item cons y];
				reply: [LIST_indexOf [LIST_new [@OWNED me]] thiscon];
				if -1 == reply {
					//print "found one " + c + " -> " + thiscon;
					inloop: 0;
					if [@ATTACK c thiscon 1] {
						call @PLACE thiscon 999;
					};
				};
				y: y+1;
				if [LIST_length cons] <= y {
					inloop: 0;
				};
			};
		};
	};
	print "COMPLETED";
};
@FORTIFYING: {
	input owners armies toPlace;
	owners: [LIST_new owners];
	armies: [LIST_new armies];
	
	iown: [LIST_new [@OWNED me]];
	ownlen: [LIST_length iown];
	
	bigVal: 0;
	biggest: 0;
	for 0 ownlen 1 { input x;
		amnt: [LIST_item armies [LIST_item iown x]];
		if amnt > bigVal {
			biggest: [LIST_item iown x];
			bigVal: amnt;
		};
	};
	c: biggest;
	
	//print [LIST_item cns c];
	
	cons: [LIST_new [@CONNECTIONS c]];
	conslen: [LIST_length cons];
	isIsland: 1;
	for 0 conslen 1 { input x;
		if [LIST_item owners [LIST_item cons x]] != me {
			isIsland: 0;
			
			temp: [LIST_item cons x];
		};
	};
	if isIsland {
		thisC: [LIST_item cons conslen-1];
		amnt: [LIST_item armies c];
		//print "found one " + c + " -> " + thisC;
		call @FORTIFY c thisC "num"$amnt;
	};
};`);
}


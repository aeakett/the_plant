$(document).foundation();
$(function() {
   FastClick.attach(document.body);
});


function generateExits() {
   var exitCandidates = ['a','b','c','d'];
   var exitList = [];
   for (var i=0; i<4; i++) {
      var exitPosition = Math.floor(Math.random()*exitCandidates.length);
      exitList.push(exitCandidates[exitPosition]);
      exitCandidates.splice(exitPosition,1);
   }
   //return exitList;
   return [exitList[0],exitList[3]];
}

var numberOfRooms = 7;
var roomCandidates = [1,2,3,4,5,6,7,8,9,10];
var roomStack = [];
for (var i=0; i<numberOfRooms; i++) {
   var candidatePosition = Math.floor(Math.random()*roomCandidates.length);
   roomStack.push({"number":roomCandidates[candidatePosition], "exits":generateExits()});
   roomCandidates.splice(candidatePosition,1);
}
roomStack.splice(Math.floor(Math.random()*numberOfRooms),0,{"number":0,"exits":[0,0]});
roomStack.splice(Math.floor(Math.random()*numberOfRooms),0,{"number":0,"exits":[0,0]});
roomStack.splice(Math.floor(Math.random()*numberOfRooms),0,{"number":0,"exits":[0,0]});
console.log(roomStack);

var detailCandidates = [
{"q":"[Condition] [hand tool].", "e":"<em>Broken vice grips.</em>"},
{"q":"[Condition] [subject] book.", "e":"<em>Well-loved history book.</em>"},
{"q":"[Condition] photograph of your daughter.", "e":"<em>Torn photo.</em>"},
{"q":"Smell of [subject].", "e":"<em>Smell of baking cookies.</em>"},
{"q":"Sound of [subject].", "e":"<em>Sound of a brass band.</em>"},
{"q":"Taste of [subject].", "e":"<em>Taste of gasoline.</em>"},
{"q":"[Emotion] [animal].", "e":"<em>Happy dog.</em>"},
{"q":"Your daughter’s [object].", "e":"<em>Her hockey trophy.</em>"},
{"q":"Memory of your daughter at [event].", "e":"<em>Prom.</em>"},
{"q":"Pool of [liquid].", "e":"<em>Pool of spilled apple juice.</em>"},
{"q":"[Condition] [item of clothing].", "e":"<em>Dirty sweater.</em>"},
{"q":"[Condition] [toy].", "e":"<em>New Transformer doll.</em>"},
{"q":"[Condition] letter to your daughter.", "e":"<em>Unopened letter.</em>"},
{"q":"Feeling of [subject] on the skin.", "e":"<em>Feel of metal.</em>"},
{"q":"[Emotion] [type of] person.", "e":"<em>Angry homeless person.</em>"},
{"q":"Your daughter’s voice whispering “[word]”.", "e":"<em>“Sorry”</em>"},
{"q":"Memory of your daughter when she was [age].", "e":"<em>21.</em>"},
{"q":"Sudden feeling of [Emotion].", "e":"<em>Feeling of joy.</em>"},
{"q":"Shadow in the shape of [object].", "e":"<em>Pterodactyl shadow.</em>"},
{"q":"Glimpse of your daughter in distance.", "e":"<em>Just a glimpse.</em>"}
];

var detailStack = []];
for (var i=0; i<10; i++) {
   var candidatePosition = Math.floor(Math.random()*detailCandidates.length);
   detailStack.push(detailCandidates[candidatePosition]);
   detailCandidates.splice(candidatePosition,1);
}
//console.log(detailStack);

var fear=0;
var anger=0;
var lastInc="neither";

function incFearAnger (which) {
   switch (which) {
      case 'anger':
         anger++;
         lastInc='anger';
         break;
      case 'fear':
         fear++;
         lastInc='fear';
         break;
      case '2fear':
         fear++; fear++;
         lastInc='fear';
         break;
      case 'both':
         fear++; anger++;
         lastInc='both';
         break;
      case '32':
         //complicated stuff goes here
         if (fear>anger) {
            incFearAnger('fear');
         } else if (anger>fear) {
            incFearAnger('anger');
         } else if (lastInc=='fear') {
            incFearAnger('fear');
         } else if (lastInc=='anger') {
            incFearAnger('anger');
         } else if (lastInc=='both') {
            incFearAnger('both');
         } else if (lastInc=='neither') {
            incFearAnger('both');
         }
         break;
      default:
         // nothing
         break;
   }
}



var rooms = [
   {
      "number":1,
      "text":"This is the furnace room. The massive annealing furnace squats on an iron trestle, with long-frozen hydraulic lifts poised like fat legs on either side. The walls are studded with support machinery - a huge oil pump, a 200 kilowatt inductor with its guts ripped out, and a rusting stand for cooling water three stories tall. Someone has dragged a shopping cart and a rotten canvas tarp in here.",
      "edgeLetters":["a","b"],
      "edgeGo":15,
      "otherGo":24
   },
   {
      "number":2,
      "text":"This is the scrap room. Dirty bins that once held copper scraps are overturned and broken. A scrap baler press large enough to crush an automobile sits idle, the press-plates torn off, the breakdown mill that feeds it uprooted and in pieces. The mill’s battered octagonal red hopper is spectacularly covered in graffiti. Shattered beer bottles and ancient condoms litter the floor.",
      "edgeLetters":["a","c"],
      "edgeGo":12,
      "otherGo":23
   },
   {
      "number":3,
      "text":"This is the coil room. A bank of cylindrical extrusion presses stand like sentinels in the dust. The paraphernalia used to coil copper wire - control stands, take-up coilers, and long trolleys - have been torn apart, the more club-like pieces used to beat the electrical billet heater until it collapsed, taking large chunks of the ceiling with it.",
      "edgeLetters":["b","c"],
      "edgeGo":27,
      "otherGo":20
   },
   {
      "number":4,
      "text":"This is the work line. The room was once dominated by four immense machines spaced along a pair of work lines - all that remains are ghostly imprints on the floor around rusting bolt-holes where they stood for years. At one end of the room is the bent remains of an X-ray thickness gauge enclosure, now filled with unidentifiable refuse. A stained and desiccated mattress is shoved in one corner.",
      "edgeLetters":["b","d"],
      "edgeGo":14,
      "otherGo":18
   },
   {
      "number":5,
      "text":"This is the crawlspace, a claustrophobic access corridor filled with animal droppings and asbestos. Amid the ductwork are gaping, ragged holes where fans, bag houses, dust collectors and changeover dampers were once affixed, now presenting a deadly hazard to the unwary.",
      "edgeLetters":["a","d"],
      "edgeGo":25,
      "otherGo":11
   },
   {
      "number":6,
      "text":"This is the control room. Banks of electrical equipment here have been forced open and gutted, their contents sold for scrap. At one end is an overturned metal desk, its contents now covering the floor in moldy paper pulp. A mummified rat peeks out of a waxed paper cup. You remember it in better times&hellip;",
      "edgeLetters":["a","b","c","d"],
      "edgeGo":19,
      "otherGo":19
   },
   {
      "number":7,
      "text":"This is the trunk room. Both gas and water pipes of every dimension wend through this space, all of them lifeless and broken. A burst pipe long ago flooded the space, and a greasy black water line is visible at knee height on the walls. A jagged hole in the floor provides a view into the inky blackness of what was once a water well. Incongruous piles of shingles are stacked behind the door.",
      "edgeLetters":["c","d"],
      "edgeGo":28,
      "otherGo":16
   },
   {
      "number":8,
      "text":"This is the break room. Faded safety and health posters vie for space with creeping mold and crudely scrawled graffiti on the walls. A bank of shattered windows look out over a grey courtyard far below. Ornamental brickwork serves as a ladder of sorts, making this room easy to get to. It’s obviously been a popular shooting gallery - needles and syringes form a toxic constellation across the cracked linoleum floor.",
      "edgeLetters":["a","b","c","d"],
      "edgeGo":27,
      "otherGo":27
   },
   {
      "number":9,
      "text":"This is the spin-block room. A pair of ominous-looking round cages, once yellow but now consumed with rust, hang from the ceiling, far enough off the floor that vandals could not reach them. The hydraulic machinery to raise and lower the spin-block cages has been removed, leaving only shadowy impressions on the walls, and stranding the cages forever.",
      "edgeLetters":["a","d"],
      "edgeGo":26,
      "otherGo":29
   },
   {
      "number":10,
      "text":"This is the rolling mill hall. It stretches out a great distance in both directions; the dormant mill itself dominating one wall. Aluminum raceways and trays that once caught and directed the mill’s output have been smashed and bent in an orgy of destruction. Here and there a piece of dirty copper tubing hints at a productive past.",
      "edgeLetters":["b","c"],
      "edgeGo":30,
      "otherGo":32
   }
];



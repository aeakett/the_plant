$(document).foundation();
$(function() {
   FastClick.attach(document.body);
});

var fear=0;
var anger=0;
var lastInc="neither";
var room;
var roomStep = 0;
var roomStack = [];
var numberOfRooms = 7;
var roomCandidates = [1,2,3,4,5,6,7,8,9,10];
var detailStack = [];
var detailStep=0;

$(document).ready(function() {
   $('#journal').hide().removeClass('hidden');
   $('#journalToggle').click(function(){
      $('#journal').toggle();
   });

   for (var i=0; i<numberOfRooms; i++) {
      var candidatePosition = Math.floor(Math.random()*roomCandidates.length);
      roomStack.push({"number":roomCandidates[candidatePosition], "exits":generateExits()});
      roomCandidates.splice(candidatePosition,1);
   }
   // Add "Down" cards at random
   roomStack.splice(Math.floor(Math.random()*numberOfRooms),0,{"number":11,"exits":[0,0]});
   roomStack.splice(Math.floor(Math.random()*numberOfRooms+1),0,{"number":11,"exits":[0,0]});
   roomStack.splice(Math.floor(Math.random()*numberOfRooms+2),0,{"number":11,"exits":[0,0]});

   drawDetailQuestion();
});

function drawDetailQuestion(){
   if (detailStep!=10) {
      var candidatePosition = Math.floor(Math.random()*detailCandidates.length);
      $('#content').append('<div id="detail'+detailStep+'"></div>');
      $('#detail'+detailStep).append('<p>'+detailCandidates[candidatePosition].q+'</p>');
      $('#detail'+detailStep).append('<textarea placeholder="'+detailCandidates[candidatePosition].e+'"></textarea>');
      $('#detail'+detailStep).append('<button type="button" id="saveDetailButton">save detail</button>');
      detailCandidates.splice(candidatePosition,1);
      bindStuffToSaveDetailButton('detail'+detailStep);
      detailStep++;
   } else {drawRoom();}
}
function bindStuffToSaveDetailButton(detailNum) {
   $('#saveDetailButton').click(function(){
      var thisDetail = $('#'+detailNum+' > textarea').val();
      detailStack.push(thisDetail);
      $('#'+detailNum).detach();
      drawDetailQuestion();
   });
}


function drawRoom() {console.log(roomStep);
   if (roomStep!=numberOfRooms-1+3) {
      $('#content').append('<div id="step'+roomStep+'"></div>');
      $('#step'+roomStep).append(rooms[roomStack[roomStep].number-1].text);
      var edgeMatch=false;
      for (var i=0; i<rooms[roomStack[roomStep].number-1].edgeLetters.length; i++) {
         if (roomStep==0) {
            var lastExit=0;
         } else {
            var lastExit=roomStack[roomStep-1].exits[1];
         }
         var thisEntry=roomStack[roomStep].exits[0];
         if (rooms[roomStack[roomStep].number-1].edgeLetters[i]==lastExit || rooms[roomStack[roomStep].number-1].edgeLetters[i]==thisEntry) {
            edgeMatch=true;
         }
      }
      if (edgeMatch) {
         $('#step'+roomStep).append('<p>&hellip;</p>');
         $('#step'+roomStep).append(outputGoto(rooms[roomStack[roomStep].number-1].edgeGo));
      } else {
         $('#step'+roomStep).append('<p>&hellip;</p>');
         $('#step'+roomStep).append(outputGoto(rooms[roomStack[roomStep].number-1].otherGo));
      }
      $('#step'+roomStep).append('<p>~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</p>');

      $('#content').append('<button type="button" id="continueButton">Keep searching</button>');
      bindStuffToContinueButton(roomStep)

      roomStep++;
   } else {drawConclusion();}
}

function drawConclusion() {
   $('#content').append('<div id="step'+roomStep+'"></div>');
   $('#step'+roomStep).append(rooms[roomStack[roomStep].number-1].text);

   var conclusion;
   if (anger > fear)          { conclusion = 'anger'; }
   else if (fear > anger)     { conclusion = 'fear'; }
   else if (lastInc=='anger') { conclusion = 'anger'; }
   else if (lastInc=='fear')  { conclusion = 'fear'; }
   else {
      var fa = Math.floor(Math.random()*2);
      if (fa==0)              { conclusion = 'anger'; }
      else                    { conclusion = 'fear'; }
   }

   var edgeMatch=false;
   for (var i=0; i<rooms[roomStack[roomStep].number-1].edgeLetters.length; i++) {
      var lastExit=roomStack[roomStep-1].exits[1];
      var thisEntry=roomStack[roomStep].exits[0];
      if (rooms[roomStack[roomStep].number-1].edgeLetters[i]==lastExit || rooms[roomStack[roomStep].number-1].edgeLetters[i]==thisEntry) {
         edgeMatch=true;
      }
   }

   $('#step'+roomStep).append('<p>&hellip;</p>');
   if (conclusion=='anger') {
      if (edgeMatch) {
         $('#step'+roomStep).append(outputGoto(31));
      }
      else {
         $('#step'+roomStep).append(outputGoto(22));
      }
   } else { /* fear */
      if (edgeMatch) {
         $('#step'+roomStep).append(outputGoto(13));
      }
      else {
         $('#step'+roomStep).append(outputGoto(17));
      }
   }
   $('#content').append('<p>Something that will make you cry goes here</p><p>the end</p>');
}

function bindStuffToContinueButton(step) {
   $('#continueButton').click(function(){
      var roomToTransfer = $('#step'+step).detach();
      roomToTransfer.appendTo('#journal');
      $(this).detach();
      drawRoom();
   });
}

function outputGoto(entry) {
   if (entry==99) {return 'D-O-W-N!';}

   var thisGoto = goto[entry-11];
   var retval=thisGoto.number;
   switch (thisGoto.type) {
      case 'detail':
         retval = '<div class="detailCard">'+detailStack.pop()+'</div>';
         retval += '<p><strong>'+thisGoto.question+'</strong></p><input/>';
         incFearAnger(thisGoto.gain);
         break;
      case 'regular':
         retval = thisGoto.text;
         retval += '<p><strong>'+thisGoto.question+'</strong></p><input/>';
         incFearAnger(thisGoto.gain);
         break;
      case 'prev':
         retval = thisGoto.text;
         incFearAnger(thisGoto.gain);
         break;
      case 'double':
         retval = thisGoto.text1;
         retval += '<p><strong>'+thisGoto.question1+'</strong></p><input/>';
         retval += thisGoto.text2;
         retval += '<p><strong>'+thisGoto.question2+'</strong></p><input/>';
         incFearAnger(thisGoto.gain);
         break;
      case 'end':
         retval = thisGoto.text;
         break;
      default:
         //nothing
         break;
   }
   return retval;
}

function generateExits() {
   var exitCandidates = ['a','b','c','d'];
   var exitList = [];
   for (var i=0; i<4; i++) {
      var exitPosition = Math.floor(Math.random()*exitCandidates.length);
      exitList.push(exitCandidates[exitPosition]);
      exitCandidates.splice(exitPosition,1);
   }
   return [exitList[0],exitList[3]];
}

var detailCandidates = [
   {"q":"[Condition] [hand tool].", "e":"Broken vice grips."},
   {"q":"[Condition] [subject] book.", "e":"Well-loved history book."},
   {"q":"[Condition] photograph of your daughter.", "e":"Torn photo of your daughter."},
   {"q":"Smell of [subject].", "e":"Smell of baking cookies."},
   {"q":"Sound of [subject].", "e":"Sound of a brass band."},
   {"q":"Taste of [subject].", "e":"Taste of gasoline."},
   {"q":"[Emotion] [animal].", "e":"Happy dog."},
   {"q":"Your daughter’s [object].", "e":"Her hockey trophy."},
   {"q":"Memory of your daughter at [event].", "e":"Memory of her at prom."},
   {"q":"Pool of [liquid].", "e":"Pool of spilled apple juice."},
   {"q":"[Condition] [item of clothing].", "e":"Dirty sweater."},
   {"q":"[Condition] [toy].", "e":"New Transformer doll."},
   {"q":"[Condition] letter to your daughter.", "e":"Unopened letter to her."},
   {"q":"Feeling of [subject] on the skin.", "e":"Feeling of metal on the skin."},
   {"q":"[Emotion] [type of] person.", "e":"Angry homeless person."},
   {"q":"Your daughter’s voice whispering “[word]”.", "e":"Her voice whispering “Sorry”."},
   {"q":"Memory of your daughter when she was [age].", "e":"Memory of her when she was 21."},
   {"q":"Sudden feeling of [emotion].", "e":"Sudden feeling of joy."},
   {"q":"Shadow in the shape of [object].", "e":"Shadow in the shape of a Pterodactyl."},
   {"q":"Glimpse of your daughter in distance.", "e":"Just a glimpse."}
];

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
   $('#lastInc').html(lastInc);
   $('#fear').html(fear);
   $('#anger').html(anger);
}



var rooms = [
   {
      "number":1,
      "text":"<p>This is the furnace room. The massive annealing furnace squats on an iron trestle, with long-frozen hydraulic lifts poised like fat legs on either side. The walls are studded with support machinery - a huge oil pump, a 200 kilowatt inductor with its guts ripped out, and a rusting stand for cooling water three stories tall. Someone has dragged a shopping cart and a rotten canvas tarp in here.</p>",
      "edgeLetters":["a","b"],
      "edgeGo":15,
      "otherGo":24
   },
   {
      "number":2,
      "text":"<p>This is the scrap room. Dirty bins that once held copper scraps are overturned and broken. A scrap baler press large enough to crush an automobile sits idle, the press-plates torn off, the breakdown mill that feeds it uprooted and in pieces. The mill’s battered octagonal red hopper is spectacularly covered in graffiti. Shattered beer bottles and ancient condoms litter the floor.</p>",
      "edgeLetters":["a","c"],
      "edgeGo":12,
      "otherGo":23
   },
   {
      "number":3,
      "text":"<p>This is the coil room. A bank of cylindrical extrusion presses stand like sentinels in the dust. The paraphernalia used to coil copper wire - control stands, take-up coilers, and long trolleys - have been torn apart, the more club-like pieces used to beat the electrical billet heater until it collapsed, taking large chunks of the ceiling with it.</p>",
      "edgeLetters":["b","c"],
      "edgeGo":27,
      "otherGo":20
   },
   {
      "number":4,
      "text":"<p>This is the work line. The room was once dominated by four immense machines spaced along a pair of work lines - all that remains are ghostly imprints on the floor around rusting bolt-holes where they stood for years. At one end of the room is the bent remains of an X-ray thickness gauge enclosure, now filled with unidentifiable refuse. A stained and desiccated mattress is shoved in one corner.</p>",
      "edgeLetters":["b","d"],
      "edgeGo":14,
      "otherGo":18
   },
   {
      "number":5,
      "text":"<p>This is the crawlspace, a claustrophobic access corridor filled with animal droppings and asbestos. Amid the ductwork are gaping, ragged holes where fans, bag houses, dust collectors and changeover dampers were once affixed, now presenting a deadly hazard to the unwary.</p>",
      "edgeLetters":["a","d"],
      "edgeGo":25,
      "otherGo":11
   },
   {
      "number":6,
      "text":"<p>This is the control room. Banks of electrical equipment here have been forced open and gutted, their contents sold for scrap. At one end is an overturned metal desk, its contents now covering the floor in moldy paper pulp. A mummified rat peeks out of a waxed paper cup. You remember it in better times&hellip;</p>",
      "edgeLetters":["a","b","c","d"],
      "edgeGo":19,
      "otherGo":19
   },
   {
      "number":7,
      "text":"<p>This is the trunk room. Both gas and water pipes of every dimension wend through this space, all of them lifeless and broken. A burst pipe long ago flooded the space, and a greasy black water line is visible at knee height on the walls. A jagged hole in the floor provides a view into the inky blackness of what was once a water well. Incongruous piles of shingles are stacked behind the door.</p>",
      "edgeLetters":["c","d"],
      "edgeGo":28,
      "otherGo":16
   },
   {
      "number":8,
      "text":"<p>This is the break room. Faded safety and health posters vie for space with creeping mold and crudely scrawled graffiti on the walls. A bank of shattered windows look out over a grey courtyard far below. Ornamental brickwork serves as a ladder of sorts, making this room easy to get to. It’s obviously been a popular shooting gallery - needles and syringes form a toxic constellation across the cracked linoleum floor.</p>",
      "edgeLetters":["a","b","c","d"],
      "edgeGo":27,
      "otherGo":27
   },
   {
      "number":9,
      "text":"<p>This is the spin-block room. A pair of ominous-looking round cages, once yellow but now consumed with rust, hang from the ceiling, far enough off the floor that vandals could not reach them. The hydraulic machinery to raise and lower the spin-block cages has been removed, leaving only shadowy impressions on the walls, and stranding the cages forever.</p>",
      "edgeLetters":["a","d"],
      "edgeGo":26,
      "otherGo":29
   },
   {
      "number":10,
      "text":"<p>This is the rolling mill hall. It stretches out a great distance in both directions; the dormant mill itself dominating one wall. Aluminum raceways and trays that once caught and directed the mill’s output have been smashed and bent in an orgy of destruction. Here and there a piece of dirty copper tubing hints at a productive past.</p>",
      "edgeLetters":["b","c"],
      "edgeGo":30,
      "otherGo":32
   },
   {
      "number":11,
      "text":"<p>DOWN</p>",
      "edgeLetters":["a","b","c","d"],
      "edgeGo":99,
      "otherGo":99
   }
];

var goto = [
   {
      "number" : 11,
      "type" : "detail",
      "question" : "Why does the item on the card make you simmer with barely contained rage?",
      "gain" : "anger"
   },
   {
      "number" : 12,
      "type" : "regular",
      "text" : "<p>In your mind the scrap room is stuffed with the leavings of a busy and productive plant - Bits of copper cathode, wire ends, and finishing scrap, piled high in wheeled bins. A scrap baler press large enough to crush an automobile sits idle beside its twin drive motors, fed by a brand new breakdown mill with an octagonal red hopper.</p><p>Amid the noise and activity, you stand with your head tilted back, your eyes fixed on feed tray above the hopper.</p>",
      "question" : "What do you see?",
      "gain" : "anger"
   },
   {
      "number" : 13,
      "type" : "end",
      "text" : "<p>In the end she wasn’t even hiding.</p><p>A different turn, a more sensible choice and you would have walked right to her. She smiles when she sees you, but it is a terrible smile - somehow vacant, as though she learned it from poring over magazine photos rather than ever being happy.</p><p>She’s changed. Whatever happened to her here has changed her, and something inside you falls and keeps falling.</p>"
   },
   {
      "number" : 14,
      "type" : "detail",
      "question" : "<p>Who does the item remind you of, other than your daughter, and why?</p>",
      "gain" : "anger"
   },
   {
      "number" : 15,
      "type" : "regular",
      "text" : "<p>It’s quite a few years ago. The massive annealing furnace squats on an even more massive iron trestle, with hydraulic lifts poised like fat legs on either side. The walls are studded with support machinery - a huge oil pump, a 200 kilowatt inductor, and a stand for cooling water three stories tall. The room is filled with the sharp metallic tang of liquified copper and the air is astonishingly hot.</p>",
      "question" : "Your foreman just came in and told you that you were going to be a father. How did you take the news?",
      "gain" : "fear"
   },
   {
      "number" : 16,
      "type" : "regular",
      "text" : "<p>It’s a long time ago. Both gas and water pipes of every dimension wend through this space. A long carbon monoxide gas generator sprouts tubes leading to the distant melting and annealing furnaces. The hot well pump, its connecting pipes ringed in red, connects to the mains and the cooling tower with only a dross sieve interrupting the water’s progress. Oily steam bleeds from a safety valve, making the air foul and swampy.</p>",
      "question" : "What is your daughter doing here?",
      "gain" : "anger"
   },
   {
      "number" : 17,
      "type" : "end",
      "text" : "<p>You find her in the last place you look - the furthest corner of the plant, as far from her life as it was possible for her to get.</p><p>As far from you.</p><p>Jammed in a corner, as if, even in her last moments, she was still trying to find more distance.</p><p>She looks so small.</p>"
   },
   {
      "number" : 18,
      "type" : "regular",
      "text" : "<p>It’s many years ago. The room is dominated by four immense machines spaced along a pair of work lines - a channel induction melting furnace, a milling machine, a brushing machine, and a brutal guillotine chopping shear. At one end of the room is a plain grey box into which the lines converge - an X-ray thickness gauge.</p>",
      "question" : "Something is about to go wrong - what is it, and why aren’t you trying to stop it?",
      "gain" : "fear"
   },
   {
      "number" : 19,
      "type" : "prev",
      "text" : "<p>It is many years ago. The plant is spotlessly clean, brilliantly lit, and humming with power and purpose. Here in the control room, solid-looking electrical cabinets line the walls, and banks of instruments monitor the furnace, upcasting, and coiling workspace machinery. At one end is a battered metal desk with a telephone and paperwork on it. In its own way it is weirdly cheerful and realer than real. You remember it like it was yesterday. And then it all falls apart around you.</p><p>She’s been here, that much is obvious. You can feel her nearby and it makes you relax for a moment. <strong>What happened before - that nonsense in the last room of the plant - couldn’t have happened, right?</strong> You have a dramatic disposition and tend to spin out tales for yourself. You imagined the whole thing. You <em>must</em> have.</p>",
      "gain" : "none"
   },
   {
      "number" : 20,
      "type" : "prev",
      "text" : "<p>It’s a long time ago. The plant is buzzing with energy. Copper wire of all gages snakes everywhere - through a bank of cylindrical extrusion presses, down to control stands and into take-up coilers, and onto trolleys. The coiling line is a blur of activity as workers stamp, cut, bundle, and haul copper wire.</p><p>Yeah, the good old days. That was a long time ago.</p><p>Remember that thing in the last room? The last thing you experienced? Remember how easily you described and explained what happened? <strong>You were lying to yourself</strong>. Actual events were much, much worse. Ten times worse, horror show freak show worse. Come to grips with that and be honest with yourself at last. Keep it together. Do it for her.</p>",
      "gain" : "fear"
   },
   {
      "number" : 21,
      "type" : "cheat"
   },
   {
      "number" : 22,
      "type" : "end",
      "text" : "<p>You were driven toward her by love and fury, you fought your own demons and hers, you found her.</p><p>Still amid the rubble, asbestos like snow, she’s hurt.</p><p>She was foolish, she’s crying, you pick her up and take her from the plant and with each step you forget a little more, and in the end there are no memories, just your daughter back with you and safe.</p>"
   },
   {
      "number" : 23,
      "type" : "detail",
      "question" : "Why is the item on the card terrifying to you?",
      "gain" : "2fear"
   },
   {
      "number" : 24,
      "type" : "detail",
      "question" : "Why does the item on the card fill you with stubborn determination?",
      "gain" : "anger"
   },
   {
      "number" : 25,
      "type" : "regular",
      "text" : "<p>It is the past. You spend a good amount of time above the factory floor, in cramped crawlspaces filled with metallic dust. Amid the ductwork are high temperature dust collectors and changeover dampers, enormous slowly-spinning fans, and bag houses with rotary valves. The roar of the plant floor is muffled down here. It is almost peaceful.</p><p>You look down and see your partner, the love of your life.</p>",
      "question" : "Who is your partner talking to, and about what?",
      "gain" : "fear"
   },
   {
      "number" : 26,
      "type" : "detail",
      "question" : "Why does the item on the card make you break down and cry?",
      "gain" : "fear"
   },
   {
      "number" : 27,
      "type" : "double",
      "text1" : "<p>You used to spend a lot of time here. You used to eat lunch here every day. The courtyard used to have a tree in it, growing in an enormous planter. People would gather there to smoke, and you’d watch them.</p><p>You ate alone after people found out about what happened.</p>",
      "question1" : "What happened?",
      "text2" : "<p>And you were always watching. Scanning the yellow, exhausted faces huddled around that miserable tree. Every day, you’d look, knowing eventually you’d catch a glimpse again.</p>",
      "question2" : "Who were you looking for?",
      "gain" : "both"
   },
   {
      "number" : 28,
      "type" : "detail",
      "question" : "Why does the item on the card make you whoop with delight, eager to press on and take care of business?",
      "gain" : "anger"
   },
   {
      "number" : 29,
      "type" : "regular",
      "text" : "<p>It is the past. You are in the spin-block room and the blocks are winding copper tubing, a strangely hypnotic process. The mile-long tubes enter through access channels in the walls and are gently bent into huge spools. The whole process is nearly silent, and requires little supervision. You come here when you need to cool down, when you need to think, when you need to contain your rage.</p>",
      "question" : "What happened to make you so furious, and how long has it been going on?",
      "gain" : "anger"
   },
   {
      "number" : 30,
      "type" : "regular",
      "text" : "<p>It’s long ago, in the rolling mill hall. The mill itself is clattering and clanking with frenetic activity. Long, uninterupted tubes of gleaming copper emerge from the mill and gracefully roll onto aluminum raceways, guided by workers wearing cotton gloves. The strong copper tang in the air reminds you, disturbingly, of blood.</p>",
      "question" : "When were you around enough blood to form a strong memory of its odor?",
      "gain" : "fear"
   },
   {
      "number" : 31,
      "type" : "end",
      "text" : "<p>Oh, yes, there she is. After all your crawling and struggling, After all your nightmares and rages, you’d imagined her alone and helpless but she’s neither. Your paternal rescue suddenly takes on a ridiculous air, a patina of age and foolishness.</p><p>She doesn’t need you.</p><p>She doesn’t even <em>want</em> you.</p>"
   },
   {
      "number" : 32,
      "type" : "detail",
      "question" : "Why does the item on the card make you physically ill?",
      "gain" : "32"
   }
];

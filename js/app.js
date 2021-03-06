/*window.onerror = function(error) {
    alert(error);
};*/

$(document).foundation();

/* generate session id per: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript */
var sessionId='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
var fear=0;
var anger=0;
var lastInc="neither";
var room;
var roomStep = 0;
var roomStack = [];
var numberOfRooms = 7;
//var numberOfRooms = 1;
var roomCandidates = [1,2,3,4,5,6,7,8,9,10];
var detailStack = [];
var detailStep=0;
var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
var notes = [];

$(document).ready(function() {//console.log('document ready');
   prepareRoomStack();

   $('#cover').removeClass('hide').addClass('animated fadeIn').one(animationEnd, function() {
      $(this).removeClass('animated fadeIn');
   }).click(function(){//console.log('#cover.click');
      $(this).addClass('animated fadeOut').one(animationEnd, function() {
         $(this).remove();
         $('#intro').removeClass('hide').addClass('animated fadeIn').one(animationEnd, function() {
            $(this).removeClass('animated fadeIn');
         });
      });
   });
// speedy speed speed for dev
//$('#cover').click();

   $('#intro').click(function(){//console.log('#intro.click');
      $(this).addClass('animated fadeOut').one(animationEnd, function() {
         $(this).remove();
         $('.top-bar, .content.row, #plantImage').removeClass('hide').addClass('animated fadeIn').one(animationEnd,function(){
            $(this).removeClass('animated fadeIn');
            $('body').addClass('bgHack');
         });
      });
   });
// speedy speed speed for dev
//$('#intro').click(); $('#goToDetails').click();

   $('#goToDetails').click(function(){//console.log('goToDetails.click');
      $('#content > *').addClass('animated fadeOut').one(animationEnd, function() {
         $('#content').empty();
         drawDetailQuestion();
      });
   });
});

function drawDetailQuestion(){//console.log('drawDetailQuestions()');
   if (detailStep!=10) {
      var candidatePosition = Math.floor(Math.random()*detailCandidates.length);
      $('#content').append('<div id="detail'+detailStep+'" class="hide"></div>');
      $('#detail'+detailStep).append('<p>'+detailCandidates[candidatePosition].q+'</p>');
      $('#detail'+detailStep).append('<textarea>'+detailCandidates[candidatePosition].e+'</textarea>');
      $('#detail'+detailStep).append('<button type="button" id="saveDetailButton">save detail</button>');
      detailCandidates.splice(candidatePosition,1);
      bindStuffToSaveDetailButton('detail'+detailStep);
      $('#detail'+detailStep).removeClass('hide').addClass('animated fadeIn').one(animationEnd, function() {
         $(this).removeClass('animated fadeIn');
      });
      detailStep++;
   } else {
      shuffle(detailStack);
      logDetailStack();
      drawRoom();
   }
}
function bindStuffToSaveDetailButton(detailNum) {//console.log('bindStuffToSaveDetailButton()');
   $('#saveDetailButton').click(function(){
      var thisDetail = $('#'+detailNum+' > textarea').val();
      detailStack.push(thisDetail);
      $('#content > *').addClass('animated fadeOut').one(animationEnd, function() {
         $('#content').empty();
         drawDetailQuestion();
      });
   });
// speedy speed speed for dev
//$('#saveDetailButton').click();
}

/*
 * The following is from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
function shuffle(array) {
   var currentIndex = array.length, temporaryValue, randomIndex;
   // While there remain elements to shuffle...
   while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
   }
   return array;
}

function logDetailStack() {
   for (var i = detailStack.length - 1; i >= 0; i--) {
      $.post( "http://theplant-datacatcher.appspot.com/logDetails", { session: sessionId, text: detailStack[i], stackNum: i } );
   };
}

function logRoom(number, order, gotoNum) {
   $.post( "http://theplant-datacatcher.appspot.com/logRoom", { session: sessionId, number: number, order: order, gotoNum: gotoNum } );
}

function logGoto(number, detail, answer1, answer2) {
   $.post( "http://theplant-datacatcher.appspot.com/logGoto", { session: sessionId, number: number, detail: detail, answer1: answer1, answer2: answer2 } );
}

function drawRoom() {//console.log('drawRoom()');
   if (roomStep!=numberOfRooms-1+3) { //if not last room
      $('#content').append('<div id="step'+roomStep+'" class="step hide"></div>');

      $('#step'+roomStep).append(rooms[roomStack[roomStep]-1].text);
      var lastRoom;
      if (roomStep==0) {
         lastRoom='outside';
      } else if (roomStack[roomStep-1] == 11) {
         lastRoom='down'
      } else {
         lastRoom='room'
      }
      var edgeMatch=isEdgeMatch('lastRoom');

      var imageNumber=roomStack[roomStep];
      if (imageNumber==11) {
         imageNumber='99';
         var isDown=true;
      } else {
         var isDown=false;
      }

      var whichGoTo;
      if (edgeMatch) {
         whichGoTo=rooms[roomStack[roomStep]-1].edgeGo;
      } else {
         whichGoTo=rooms[roomStack[roomStep]-1].otherGo;
      }

      logRoom(roomStack[roomStep], roomStep, whichGoTo);

      var whichGain;

      if (!isDown) { // draw ellipsis and goto text if appropriate
         $('#step'+roomStep).append(drawClickForMore());
         bindStuffToClickForMore(imageNumber, whichGoTo);
         $('#step'+roomStep).append(outputGoto(whichGoTo));
         whichGain=goto[whichGoTo-11].gain;
      } else { whichGain='none'; }

      $('#step'+roomStep).append(drawContinueButton(whichGoTo));
      if (isDown){ $('#continueButton').removeClass('hide'); }
      bindStuffToContinueButton(roomStep, isDown, whichGain)
      
      $('#step'+roomStep).removeClass('hide').addClass('animated fadeIn').one(animationEnd, function() {
         $(this).removeClass('animated fadeIn');
      });
      
      $('#plantImage img').attr('src', 'img/'+imageNumber+'.svg');
      $('#plantImage img').addClass('animated fadeIn').one(animationEnd, function() {
         $(this).removeClass('animated fadeIn');
      });
      roomStep++;
   } else { drawConclusion(); }
}

function isEdgeMatch(previousRoom) {
   var retval;
   if (previousRoom=='outside' || previousRoom=='down') {
      if ( Math.round(Math.random()) == 1 ) {
         retval=true;
      } else { retval=false; }
   } else { //room
      if (Math.floor(Math.random()*4)+1 == 4) {
         retval=false;
      } else { retval=true; }
   }
   return retval;
}

function bindStuffToClickForMore(oldImage, newImage) {//console.log('bindStuffToClickForMore()');
   //if (newImage==99) {return;} //this is a "DOWN" section, and we don't need to swap the image
   $('.clickForMore').click(function() {
      $(this).addClass('animated fadeOut');
      $('img[src="img/'+oldImage+'.svg"]').addClass('animated fadeOut').one(animationEnd, function() {
         $('.clickForMore').addClass('hide').removeClass('animated fadeOut');
         $(this).attr('src', 'img/'+newImage+'.svg');
         $(this).removeClass('animated fadeOut');
         $(this).addClass('animated fadeIn').one(animationEnd,function(){
            $(this).removeClass('animated fadeIn');
            $('#continueButton').removeClass('hide').addClass('animated fadeIn');
            $('.clickForMore').next().removeClass('hide').addClass('animated fadeIn').one(animationEnd, function() {
               $(this).next().removeClass('animated fadeIn');
               $('#continueButton').removeClass('animated fadeIn');
               $('#content .step').css('padding-bottom', $('.fullBleed').height());
            });
         });
      });
   });
}

function bindStuffToContinueButton(step, isDown, whichGain) {//console.log('bindStuffToContinueButton()');
   if (isDown) {
      var animation='fadeOutDown';
   } else {
      var animation='fadeOut';
   }
   $('#continueButton').on('click', Foundation.utils.debounce(function(){//console.log('continueButton.click');
      var number = $('#continueButton').data('goto-number'); //console.log('goto number: '+number);
      var detailNumber = $('#continueButton').parent().children('div').children('.detailCard').data('detail-number'); //console.log('detail number: '+detailNumber);
      var answer1 = $('#continueButton').parent().children('div').children('.a1').val(); //console.log('answer 1: '+answer1);
      var answer2 = $('#continueButton').parent().children('div').children('.a2').val(); //console.log('answer 2: '+answer2);
      if (detailNumber==undefined) {detailNumber='~~~~';}
      if (answer1==undefined) {answer1='~~~~';}
      if (answer2==undefined) {answer2='~~~~';}
      logGoto(number, detailNumber, answer1, answer2);
      $("html, body").animate({ scrollTop: 0 }, "slow");
      $('#plantImage .fullBleed').addClass('animated '+animation).one(animationEnd, function() {
         $(this).removeClass('animated '+animation);
      });
      $('#step'+step).addClass('animated '+animation).one(animationEnd, function() {
         $(this).removeClass('animated '+animation);
         //console.log($('#step'+step).html());
         $('#step'+step).appendTo('#journal').off(); //the off() is to remove this event handler... all sorts of bad things happen without it
         $('#journal').append('<div><a href="#" class="button tiny addNotes">add notes</a><p class="hide"><strong>Notes</strong></p><textarea id="note'+step+'" data-note-order="'+step+'" class="journalNote hide"></textarea></div><hr class="journalDivider" />');
         $('#journal a.addNotes').on('click', Foundation.utils.debounce(function(){
            $(this).next().removeClass('hide').next().removeClass('hide');
            $(this).remove();
         }, 300, true));
         $('#journal br').remove();
         $('#journal .step').attr('style', '');
         $('#continueButton').remove();
         $('.clickForMore').remove();
         incFearAnger(whichGain);
         drawRoom();
      });
   }, 300, true));
}

$(document).on('close.fndtn.reveal', '[data-reveal]', function () {
   //var modal = $(this);
   logNotes();
});

function logNotes() {
   notes=[];
   $('#journal .journalNote').each(function() {
      var thisNote = new Object();
      thisNote.order = $(this).data('note-order');
      thisNote.hidden = $(this).hasClass('hidden');
      thisNote.text = $(this).val();
      notes.push(thisNote);
   });
   $.post( "http://theplant-datacatcher.appspot.com/logNotes", { session: sessionId, json: JSON.stringify(notes) } );
}

function drawConclusion() {//console.log('drawConclusion()');
   $('#content').append('<div id="step'+roomStep+'" class="hide"></div>');
   $('#step'+roomStep).append(rooms[roomStack[roomStep]-1].text);

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

   var lastRoom;
   if (roomStack[roomStep-1] == 11) {
      lastRoom='down'
   } else {
      lastRoom='room'
   }
   var edgeMatch=isEdgeMatch('lastRoom');

   $('#step'+roomStep).append(drawClickForMore());
   $('#step'+roomStep).removeClass('hide').addClass('animated fadeIn').one(animationEnd, function() {
      $(this).removeClass('animated fadeIn');
   });

   var imageNumber=roomStack[roomStep];

   $('#plantImage img').attr('src', 'img/'+imageNumber+'.svg').addClass('animated fadeIn').one(animationEnd, function() {
      $(this).removeClass('animated fadeIn');
   });

   if (conclusion=='anger') {
      if (edgeMatch) {
         logRoom(roomStack[roomStep], roomStep, 31);
         bindStuffToClickForMore(imageNumber,31);
         $('#step'+roomStep).append(outputGoto(31));
      }
      else {
         logRoom(roomStack[roomStep], roomStep, 22);
         bindStuffToClickForMore(imageNumber,22);
         $('#step'+roomStep).append(outputGoto(22));
      }
   } else { /* fear */
      if (edgeMatch) {
         logRoom(roomStack[roomStep], roomStep, 13);
         bindStuffToClickForMore(imageNumber,13);
         $('#step'+roomStep).append(outputGoto(13));
      }
      else {
         logRoom(roomStack[roomStep], roomStep, 17);
         bindStuffToClickForMore(imageNumber,17);
         $('#step'+roomStep).append(outputGoto(17));
      }
   }
}

function drawClickForMore() {//console.log('drawClickForMore()');
   return '<a class="clickForMore"><img src="img/dots.gif" style="height: 100px" /></a>';
}

function drawContinueButton(gotoNumber) {
   return '<br><button type="button" id="continueButton" class="hide" data-goto-number="'+gotoNumber+'">Keep searching</button><br><br><br><br><br>';
}

function outputGoto(entry) {//console.log('outputGoto()');
   if (entry==99) {return 'D-O-W-N!';}

   var thisGoto = goto[entry-11];
   var retval=thisGoto.number;
   switch (thisGoto.type) {
      case 'detail':
         retval = '<div class="hide">';
         retval += '<em>But there&rsquo;s something else&hellip;</em>';
         var detailStackPosition=detailStack.length-1;
         retval += '<div class="detailCard" data-detail-number="'+detailStackPosition+'">'+detailStack.pop()+'</div>';
         retval += '<p><strong>'+thisGoto.question+'</strong></p><textarea class="a1"></textarea>';
         retval += '</div>';
         //incFearAnger(thisGoto.gain);
         break;
      case 'regular':
         retval = '<div class="hide">';
         retval += thisGoto.text;
         retval += '<p><strong>'+thisGoto.question+'</strong></p><textarea class="a1"></textarea>';
         retval += '</div>';
         //incFearAnger(thisGoto.gain);
         break;
      case 'prev':
         retval = '<div class="hide">';
         retval += thisGoto.text;
         retval += '</div>';
         //incFearAnger(thisGoto.gain);
         break;
      case 'double':
         retval = '<div class="hide double">';
         retval += thisGoto.text1;
         retval += '<p><strong>'+thisGoto.question1+'</strong></p><textarea class="a1"></textarea>';
         retval += thisGoto.text2;
         retval += '<p><strong>'+thisGoto.question2+'</strong></p><textarea class="a2"></textarea>';
         retval += '</div>';
         //incFearAnger(thisGoto.gain);
         break;
      case 'end':
         retval = '<div class="hide">';
         retval += thisGoto.text;
         retval += '</div>';
         break;
      default:
         //nothing
         break;
   }
   return retval;
}

function incFearAnger (which) {//console.log('incFearAnger()');
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
      case 'none':
         return;
         break;
      default:
         // nothing
         break;
   }
   $('#lastInc').html(lastInc);
   $('#fear').html(fear);
   $('#fear').addClass('animated flash').one(animationEnd, function() {
      $(this).removeClass('animated flash');
   });
   $('#anger').html(anger);
   $('#anger').addClass('animated flash').one(animationEnd, function() {
      $(this).removeClass('animated flash');
   });
}

function prepareRoomStack() {
   for (var i=0; i<numberOfRooms; i++) {
      var candidatePosition = Math.floor(Math.random()*roomCandidates.length);
      roomStack.push(roomCandidates[candidatePosition]);
      roomCandidates.splice(candidatePosition,1);
   }
   // Add "Down" cards at random
   roomStack.splice(Math.floor(Math.random()*numberOfRooms),0,11);
   roomStack.splice(Math.floor(Math.random()*numberOfRooms+1),0,11);
   roomStack.splice(Math.floor(Math.random()*numberOfRooms+2),0,11);
}



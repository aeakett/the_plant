window.onerror = function(error) {
    alert(error);
};

$(document).foundation();

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
var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

$(document).ready(function() {//alert('document ready');
   prepareRoomStack();

   $('#cover').removeClass('hide').addClass('animated fadeIn').on(animationEnd, function() {
      $(this).removeClass('animated fadeIn');
   }).click(function(){//alert('#cover.click');
      $(this).addClass('animated fadeOut').one(animationEnd, function() {
         $(this).remove();
         $('#intro').removeClass('hide').addClass('animated fadeIn').on(animationEnd, function() {
            $(this).removeClass('animated fadeIn');
         });
      });
   });
// speedy speed speed for dev
//$('#cover').click();

   $('#intro').click(function(){//console.log('#intro.click');
      $(this).addClass('animated fadeOut').one(animationEnd, function() {
         $(this).remove();
         $('.top-bar, .content.row, #plantImage').removeClass('hide').addClass('animated fadeIn').on(animationEnd,function(){
            $(this).removeClass('animated fadeIn');
         });
      });
   });
// speedy speed speed for dev
//$('#intro').click(); $('#goToDetails').click();

   $('#goToDetails').click(function(){//console.log('goToDetails.click');
      $('#content > *').addClass('animated fadeOut').on(animationEnd, function() {
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
      //$('#detail'+detailStep).append('<textarea placeholder="'+detailCandidates[candidatePosition].e+'"></textarea>');
      $('#detail'+detailStep).append('<textarea>'+detailCandidates[candidatePosition].e+'</textarea>');
      $('#detail'+detailStep).append('<button type="button" id="saveDetailButton">save detail</button>');
      detailCandidates.splice(candidatePosition,1);
      bindStuffToSaveDetailButton('detail'+detailStep);
      $('#detail'+detailStep).removeClass('hide').addClass('animated fadeIn').one(animationEnd, function() {
         $(this).removeClass('animated fadeIn');
      });
      detailStep++;
   } else {drawRoom();}
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
$('#saveDetailButton').click();
}


function drawRoom() {//console.log('drawRoom()');
   if (roomStep!=numberOfRooms-1+3) { //if not last room
      $('#content').append('<div id="step'+roomStep+'" class="hide"></div>');

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

      var imageNumber=roomStack[roomStep].number;
      if (imageNumber==11) {
         imageNumber='99';
         var isDown=true;
      } else {
         var isDown=false;
      }

      if (!isDown) {
         $('#step'+roomStep).append('<a class="clickForMore">'+drawAnimatedEllipsis()+'</a>');

         if (edgeMatch) {
            bindStuffToClickForMore(imageNumber,rooms[roomStack[roomStep].number-1].edgeGo);
            $('#step'+roomStep).append(outputGoto(rooms[roomStack[roomStep].number-1].edgeGo));
         } else {
            bindStuffToClickForMore(imageNumber,rooms[roomStack[roomStep].number-1].otherGo);
            $('#step'+roomStep).append(outputGoto(rooms[roomStack[roomStep].number-1].otherGo));
         }
      } else {
         //$('#step'+roomStep).append(outputGoto(rooms[roomStack[roomStep].number-1].edgeGo));
      }

      $('#step'+roomStep).append('<br><button type="button" id="continueButton" class="hide">Keep searching</button><br><br><br><br><br>');
      if (isDown){$('#continueButton').removeClass('hide');}
      bindStuffToContinueButton(roomStep, isDown)
      
      $('#step'+roomStep).removeClass('hide').addClass('animated fadeIn').one(animationEnd, function() {
         $(this).removeClass('animated fadeIn');
      });
      
      $('#plantImage img').attr('src', 'img/'+imageNumber+'.svg');
      $('#plantImage img').addClass('animated fadeIn').one(animationEnd, function() {
         $(this).removeClass('animated fadeIn');
      });
//$('#step'+roomStep).append('<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>');
      roomStep++;
   } else {drawConclusion();}
}

function bindStuffToClickForMore(oldImage, newImage) {//console.log('bindStuffToClickForMore()');
   if (newImage==99) {return;}
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
            });
         });
      });
   });
}

function drawConclusion() {//console.log('drawConclusion()');
   $('#content').append('<div id="step'+roomStep+'" class="hide"></div>');
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

   $('#step'+roomStep).append('<a class="clickForMore">'+drawAnimatedEllipsis()+'</a>');
   $('#step'+roomStep).removeClass('hide').addClass('animated fadeIn').one(animationEnd, function() {
      $(this).removeClass('animated fadeIn');
   });

   var imageNumber=roomStack[roomStep].number;

   $('#plantImage img').attr('src', 'img/'+imageNumber+'.svg');
   $('#plantImage img').addClass('animated fadeIn').one(animationEnd, function() {
      $(this).removeClass('animated fadeIn');
   });

   if (conclusion=='anger') {
      if (edgeMatch) {
         bindStuffToClickForMore(imageNumber,31);
         $('#step'+roomStep).append(outputGoto(31));
      }
      else {
         bindStuffToClickForMore(imageNumber,22);
         $('#step'+roomStep).append(outputGoto(22));
      }
   } else { /* fear */
      if (edgeMatch) {
         bindStuffToClickForMore(imageNumber,13);
         $('#step'+roomStep).append(outputGoto(13));
      }
      else {
         bindStuffToClickForMore(imageNumber,17);
         $('#step'+roomStep).append(outputGoto(17));
      }
   }
}

function drawAnimatedEllipsis() {//console.log('drawAnimatedEllipsis()');
   return '<img src="img/dots.gif" style="height: 100px" />';
}

function bindStuffToContinueButton(step, isDown) {//console.log('bindStuffToContinueButton()');
   if (isDown) {
      var animation='fadeOutDown';
   } else {
      var animation='fadeOut';
   }
   $('#continueButton').on('click', Foundation.utils.debounce(function(e){//console.log('continueButton.click');
      $('#plantImage .fullBleed').addClass('animated '+animation).one(animationEnd, function() {
         $(this).removeClass('animated '+animation);
      });
      $("html, body").animate({ scrollTop: 0 }, "slow");
      $('#step'+step).addClass('animated '+animation).one(animationEnd, function() {
         $(this).removeClass('animated '+animation);
         $(this).appendTo('#journal');
         $('#continueButton').remove();
         $('.clickForMore').remove();
         drawRoom();
      });
   }, 300, true));
}

function outputGoto(entry) {//console.log('outputGoto()');
   if (entry==99) {return 'D-O-W-N!';}

   var thisGoto = goto[entry-11];
   var retval=thisGoto.number;
   switch (thisGoto.type) {
      case 'detail':
         retval = '<div class="hide">';
         retval += '<em>But there&rsquo;s something else&hellip;</em>';
         retval += '<div class="detailCard">'+detailStack.pop()+'</div>';
         retval += '<p><strong>'+thisGoto.question+'</strong></p><textarea></textarea>';
         retval += '</div>';
         incFearAnger(thisGoto.gain);
         break;
      case 'regular':
         retval = '<div class="hide">';
         retval += thisGoto.text;
         retval += '<p><strong>'+thisGoto.question+'</strong></p><textarea></textarea>';
         retval += '</div>';
         incFearAnger(thisGoto.gain);
         break;
      case 'prev':
         retval = '<div class="hide">';
         retval += thisGoto.text;
         retval += '</div>';
         incFearAnger(thisGoto.gain);
         break;
      case 'double':
         retval = '<div class="hide double">';
         retval += thisGoto.text1;
         retval += '<p><strong>'+thisGoto.question1+'</strong></p><textarea></textarea>';
         retval += thisGoto.text2;
         retval += '<p><strong>'+thisGoto.question2+'</strong></p><textarea></textarea>';
         retval += '</div>';
         incFearAnger(thisGoto.gain);
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

function generateExits() {//console.log('generateExits()');
   var exitCandidates = ['a','b','c','d'];
   var exitList = [];
   for (var i=0; i<4; i++) {
      var exitPosition = Math.floor(Math.random()*exitCandidates.length);
      exitList.push(exitCandidates[exitPosition]);
      exitCandidates.splice(exitPosition,1);
   }
   return [exitList[0],exitList[3]];
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
      roomStack.push({"number":roomCandidates[candidatePosition], "exits":generateExits()});
      roomCandidates.splice(candidatePosition,1);
   }
   // Add "Down" cards at random
   roomStack.splice(Math.floor(Math.random()*numberOfRooms),0,{"number":11,"exits":[0,0]});
   roomStack.splice(Math.floor(Math.random()*numberOfRooms+1),0,{"number":11,"exits":[0,0]});
   roomStack.splice(Math.floor(Math.random()*numberOfRooms+2),0,{"number":11,"exits":[0,0]});
}



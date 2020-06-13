var firebaseConfig = {
    apiKey: "AIzaSyDaK4tyTNMmSH_RbVJy7HUL0ebjj1zInIE",
    authDomain: "latintranslationtool.firebaseapp.com",
    databaseURL: "https://latintranslationtool.firebaseio.com",
    projectId: "latintranslationtool",
    storageBucket: "latintranslationtool.appspot.com",
    messagingSenderId: "902886984828",
    appId: "1:902886984828:web:c4424c15f077de794f8df9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database()

var translationText;
var wordID;
var words = [];


var referenceWord = prompt("Enter code:"); //change this every time you start a new text
$('title').text(referenceWord); // make the title of the webpage the name of the text


$('#submit-text-button').on('click', function() {
  translationText = $('#submit-text').val();
  console.log(translationText);

  if (translationText != '') {
    $('#submit-text-button').fadeOut();
    $('#submit-text').fadeOut();

    var stuff = translationText.split('\n').join(' <br>').split('  ').join(' ').split(' ');
    //console.log(stuff);

    for (var i in stuff) {
      words.push({
        name:stuff[i],
        meaning:'',
        part:'', //noun verb adj adverb
        number:'', //plural singular
        gender:'', //NOUNS AND ADJ ONLY
        case:'', //NOUNS AND ADJ ONLY
        person:'', //1st 2nd 3rd VERBS ONLY
        tense:'', //VERBS ONLY - 
        voice:'',  // active, passive, deponent VERBS ONLY
        mood:'',//subjunctive,indicative,imperative VERBS ONLY
        other:''
      });
    }

    //console.log(words);
    
    database.ref('/translationText/').child(referenceWord).remove();

    for (var i in words) {
      database.ref('/translationText/').child(referenceWord).push(words[i]);
    }
    

  }

});

var names;

database.ref('/translationText/').child(referenceWord).on('value', function(results) {
  var allResults = results.val();

  $('#translation-wrapper').empty();

  for (var i in allResults) {
    $('#translation-wrapper').append('<span class="word" data-id="' + i + '">'+allResults[i].name+' </span>')
  }
  

  if ($('#translation-wrapper').html() != '') {
    $('#submit-text-button').fadeOut();
    $('#submit-text').fadeOut();
  }



  $('.word').on('click', function() {
    $('.word').removeClass('selected');

    $(this).addClass('selected');

    wordID = $(this).data('id');
    //console.log(wordID)

    database.ref('/translationText/').child(referenceWord).child(wordID).once('value').then(function(snapshot){
      var wordInfo = snapshot.val();
      //console.log(wordInfo)

      names = wordInfo.name;
      
      var nam = wordInfo.name.split(">").pop()
      

      document.getElementById('name').value = nam

      document.getElementById('meaning').value = wordInfo.meaning
      document.getElementById('part').value = wordInfo.part
      document.getElementById('number').value = wordInfo.number
      document.getElementById('gender').value = wordInfo.gender
      document.getElementById('person').value = wordInfo.person
      document.getElementById('case').value = wordInfo.case
      document.getElementById('voice').value = wordInfo.voice
      document.getElementById('tense').value = wordInfo.tense
      document.getElementById('mood').value = wordInfo.mood
      document.getElementById('other').value = wordInfo.other

      /*if ($('.form-input').val() == undefined) {
        $(this).val('')
      }*/
    });


  });

  //console.log($('[data-id="'+wordID+'"]'))
  $('[data-id="'+wordID+'"]').click()

});

$('.form').on('submit', function(e) {
  e.preventDefault();

  var formName = $('#name').val();
  var formMeaning = $('#meaning').val();
  var formPart = $('#part').val();
  var formNumber = $('#number').val();
  var formGender = $('#gender').val();
  var formCase = $('#case').val();
  var formPerson = $('#person').val();
  var formTense = $('#tense').val();
  var formVoice = $('#voice').val();
  var formMood = $('#mood').val();
  var formOther = $('#other').val();

  //console.log(names.split('>').pop());
  //console.log(names);

  if (wordID != undefined) {
    database.ref('/translationText/').child(referenceWord).child(wordID).set({
          name:names,
          meaning:formMeaning,
          part:formPart, //noun verb adj adverb
          number:formNumber, //plural singular
          gender:formGender, //NOUNS AND ADJ ONLY
          case:formCase, //NOUNS AND ADJ ONLY
          person:formPerson, //1st 2nd 3rd VERBS ONLY
          tense:formTense, //VERBS ONLY - 
          voice:formVoice, //active, passive, deponent VERBS ONLY
          mood:formMood, //subjunctive,indicative,imperative VERBS ONLY
          other: formOther
    }).then(function(){
      $('#form-submit').addClass('done');
      setTimeout(function(){
        $('#form-submit').removeClass('done');
      }, 2000)
    })
  }
})





/*
$('.new-text').on('submit', function() {
  referenceWord = $('#new-text-input').val();

  database.ref('/translationText/').child(referenceWord).once('value').then(function(results) {
  var allResults = results.val();

  $('#translation-wrapper').empty();

  for (var i in allResults) {
    $('#translation-wrapper').append('<span class="word" data-id="' + i + '">'+allResults[i].name+' </span>')
  }



  if ($('#translation-wrapper').html() != '') {
    $('#submit-text-button').fadeOut();
    $('#submit-text').fadeOut();
  }



  $('.word').on('click', function() {
    $('.word').removeClass('selected');

    $(this).addClass('selected');

    wordID = $(this).data('id');
    //console.log(wordID)

    database.ref('/translationText/').child(referenceWord).child(wordID).once('value').then(function(snapshot){
      var wordInfo = snapshot.val();
      //console.log(wordInfo)

      document.getElementById('name').value = wordInfo.name
      document.getElementById('meaning').value = wordInfo.meaning
      document.getElementById('part').value = wordInfo.part
      document.getElementById('number').value = wordInfo.number
      document.getElementById('gender').value = wordInfo.gender
      document.getElementById('person').value = wordInfo.person
      document.getElementById('case').value = wordInfo.case
      document.getElementById('voice').value = wordInfo.voice
      document.getElementById('tense').value = wordInfo.tense

    });


  })

});
})

*/


$(document).on('keydown', function(e) {
  //console.log(e.key)
  
  if (e.key=='ArrowRight') {
    $('.selected').next().click();
  } else if (e.key == 'ArrowLeft') {
    $('.selected').prev().click();
  } 
})

$(document).on('keydown', '.form-input', function(e) {
  if (e.key == 'ArrowUp') {
    $(this).prev().focus()
  } else if (e.key == 'ArrowDown') {
    $(this).next().focus()
  }
})

$(document).on('keydown', function(e) {
  if (e.key == 'PageUp') {
    window.open('https://en.wiktionary.org/wiki/'+$('#name').val().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase()+'#Latin', '_blank')
  } else if (e.key == 'PageDown') {
    window.open('http://www.perseus.tufts.edu/hopper/morph?l='+$('#name').val().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase()+'&la=la', '_blank')
  }
})

$('#name').on('click', function() {
  window.open('https://en.wiktionary.org/wiki/'+$(this).val().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase()+'#Latin', '_blank')
})


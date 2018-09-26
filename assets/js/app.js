// Initialize Firebase
var config = {
  apiKey: 'AIzaSyCV6GSgG3sF1umDJWvL4IJB2IEL6b8V8p4',
  authDomain: 'train-schedule-3b26d.firebaseapp.com',
  databaseURL: 'https://train-schedule-3b26d.firebaseio.com',
  projectId: 'train-schedule-3b26d',
  storageBucket: 'train-schedule-3b26d.appspot.com',
  messagingSenderId: '5437542145'
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var trainData = firebase.database();
var currentTime = moment();

// Grabs user input
$('#addtrainBtn').on('click', function() {
  event.preventDefault();

  var trainName = $('#trainInput')
    .val()
    .trim();
  var destination = $('#destInput')
    .val()
    .trim();
  var first = moment(
    $('#firstrInput')
      .val()
      .trim(),
    'HH:mm'
  )
    .subtract(1, 'years')
    .format('X');
  var frequency = $('#freqInput')
    .val()
    .trim();
  console.log(trainName, destination, first, frequency);

  //validates each field
  if (trainName === '') {
    alert('Please enter the Train Name');
    return false;
  }
  if (destination === '') {
    alert('Please enter a Destination');
    return false;
  }
  if (first === '') {
    alert('Please enter a First train time');
    return false;
  }
  if (frequency === '') {
    alert('Please enter a Frequency');
    return false;
  }

  // uploads info to firebase
  trainData.ref().push({
    trainName: trainName,
    destination: destination,
    first: first,
    frequency: frequency
  });
  // alert('New data added successfully');

  // initialize form
  $('#trainInput').val('');
  $('#destInput').val('');
  $('#firstrInput').val('');
  $('#freqInput').val('');

  return false;
});

trainData.ref().on('child_added', function(snapshot) {
  var tname = snapshot.val().trainName;
  var destination = snapshot.val().destination;
  var firsttrain = snapshot.val().first;
  var frequency = snapshot.val().frequency;
  var remainder = moment().diff(moment.unix(firsttrain), 'minutes') % frequency;
  var tMinutes = frequency - remainder;
  var arrival = moment()
    .add(tMinutes, 'minutes')
    .format('hh:mm');
  console.log('tname = ', tname);
  console.log('remainder = ', remainder);
  console.log('minutes = ', tMinutes);
  console.log('arrival = ', arrival);
  $('#train-table > tBody').append(
    '<tr><td>' +
      tname +
      '</td><td>' +
      destination +
      '</td><td>' +
      frequency +
      '</td><td>' +
      arrival +
      '</td><td>' +
      tMinutes +
      '</td></tr>'
  );
});

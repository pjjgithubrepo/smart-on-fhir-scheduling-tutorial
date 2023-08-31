// listens for the event of slot search form being submitted

$('#slot-search-form').on('submit', function(e) {
  e.preventDefault();
  slotSearch();
});

// listens for the event of clear slots button, clears contents of the slots element in html and hides slots holder row

$('#clear-slots').on('click', function(e) {
  $('#slots').html('');
  $('#slots-holder-row').hide();
});

function slotSearch() {
  clearUI();
  $('#loading-row').show();

  // Next, the code loops through the elements of the form.  

  // Grab Slot query parameters from the slot-search-form
  var form = document.getElementById('slot-search-form');

  // Create an empty dictionary called slotParams
  var slotParams = {};

  // The for() loop iterates over the elements of the form element. The length property of the form element returns the number of elements in the form.
  for(var i = 0; i < form.length; i++) {
    // Handle date params later

    // For each element, the code checks if the element's name starts with the string date-. If it does, the code skips the element.

    // The startsWith() method checks if the string starts with the specified substring. In this case, the substring is date-. If the string does start with the substring, the code skips the element.

    if (form.elements[i].name.startsWith('date-')) { continue; }

    // Otherwise, the code adds the element's name and value to the slotParams dictionary.
    
    slotParams[form.elements[i].name] = form.elements[i].value;
  }
  // Appointment start date and appointment end date need to both be set in query parameter 'start'

  // The code first gets the date-start and date-end form elements. Then, it creates a JSON object with two properties:
       // $ge: The greater than or equal operator.
      // $lt: The less than operator.
// The value of the $ge property is the value of the date-start form element. The value of the $lt property is the value of the date-end form element.
      // The code then sets the start parameter of the slotParams dictionary to the JSON object.
  slotParams['start'] = {$ge: form.elements['date-start'].value, $lt: form.elements['date-end'].value};


  //FHIR.oauth2.ready(): This function initializes the SMART API and returns a smart object that contains the FHIR client and other resources.
  FHIR.oauth2.ready(function(smart) {
    // Query the FHIR server for Slots

    // smart.api.fetchAll(): This function queries the FHIR server for slots.
    //slotParams: This object contains the query parameters for the fetchAll() function.
    // then(): This function handles the resolved promise from the fetchAll() function.
    smart.api.fetchAll({type: 'Slot', query: slotParams}).then(

      // Display Appointment information if the call succeeded

      //The code you provided is a JavaScript function that takes an array of slots as its argument and renders them as HTML. The function first checks if the array of slots is empty. If it is not empty, the function creates a variable called slotsHTML and initializes it to an empty string. The function then loops through the array of slots and calls a function called slotHTML() for each slot. The slotHTML() function takes the ID, type, start, and end time of a slot as its arguments and returns an HTML string that represents the slot. The slotHTML() function is defined as follows: function slotHTML(id, type, start, end) {
  // return `<div class="slot">
 // <h3>Slot ID: ${id}</h3>
 // <p>Type: ${type}</p>
 // <p>Start time: ${start}</p>
 // <p>End time: ${end}</p>
// </div>`;
// }

      function(slots) {
        // If any Slots matched the criteria, display them
        if (slots.length) {
          var slotsHTML = '';

          slots.forEach(function(slot) {
            slotsHTML = slotsHTML + slotHTML(slot.id, slot.type.text, slot.start, slot.end);
          });

          renderSlots(slotsHTML);
        }
        // If no Slots matched the criteria, inform the user
        else {
          renderSlots('<p>No Slots ;(</p>');
        }
      },

      // Display 'Failed to read Slots from FHIR server' if the call failed
      function() {
        clearUI();
        $('#errors').html('<p>Failed to read Slots from FHIR server</p>');
        $('#errors-row').show();
      }
    );
  });
}

// The code you provided is a JavaScript function that returns an HTML string for a single slot. The function takes the ID, type, start, and end time of a slot as its arguments and returns an HTML string that represents the slot.

function slotHTML(id, type, start, end) {

  // The function first logs the slot information to the console. This is useful for debugging purposes.

  console.log('Slot: id:[' + id + '] type:[' + type + '] start:[' + start + '] end:[' + end + ']');

  // The function then creates a variable called slotReference and assigns it the value of Slot/ + id. This is the FHIR resource reference for the slot.

// The function then creates two variables called prettyStart and prettyEnd and assigns them the values of the start and end times, respectively, converted to JavaScript Date objects. This is done so that the start and end times can be displayed in a human-readable format.

  var slotReference = 'Slot/' + id,
      prettyStart = new Date(start),
      prettyEnd = new Date(end);

//      The function then returns an HTML string that contains a div element

// A card with a class of card
//A card body with a class of card-body
//A heading with the slot type
//A paragraph with the start time
//A paragraph with the end time
//A link with a class of card-link that calls the askForPatient() function when clicked

  return "<div class='card'>" +
           "<div class='card-body'>" +
             "<h5 class='card-title'>" + type + '</h5>' +
             "<p class='card-text'>Start: " + prettyStart + '</p>' +
             "<p class='card-text'>End: " + prettyEnd + '</p>' +
             "<a href='javascript:void(0);' class='card-link' onclick='askForPatient(\"" +
               slotReference + '", "' + type + '", "' + prettyStart + '", "' + prettyEnd + "\");'>Book</a>" +
           '</div>' +
         '</div>';
}

// The code you provided defines two JavaScript functions: renderSlots() and clearUI().

// The renderSlots() function takes an HTML string as its argument and renders it in the browser. The function first calls the clearUI() function to clear the existing UI. Then, the function sets the inner HTML of the #slots element to the value of the slotsHTML argument. Finally, the function shows the #slots-holder-row element.

function renderSlots(slotsHTML) {
  clearUI();
  $('#slots').html(slotsHTML);
  $('#slots-holder-row').show();
}

// The clearUI() function clears the existing UI by setting the inner HTML of all the elements in the UI to an empty string and hiding all the elements.

//renderSlots(): This function renders the HTML for the slots in the browser.
//clearUI(): This function clears the existing UI.
//#slots: This is the ID of the element that will be used to display the slots.
//#slots-holder-row: This is the ID of the row that contains the #slots element.

// The clearUI() function uses the querySelector() method to get the elements in the UI. The querySelector() method takes a CSS selector as its argument and returns the first element that matches the selector.
// The clearUI() function uses the innerHTML property to set the inner HTML of an element. The innerHTML property is a read-only property that returns the inner HTML of an element.
// The show() method is used to show an element. The show() method takes an element as its argument and makes the element visible.

function clearUI() {
  $('#errors').html('');
  $('#errors-row').hide();
  $('#loading-row').hide();
  $('#slots').html('');
  $('#slots-holder-row').hide();
  $('#appointment').html('');
  $('#appointment-holder-row').hide();
  $('#patient-search-create-row').hide();
  clearPatientUI();
}
;
$('#clear-appointment').on('click', function(e) {
  $('#appointment').html('');
  $('#appointment-holder-row').hide();
});

function appointmentCreate(slotReference, patientReference) {
  clearUI();
  $('#loading-row').show();

  var appointmentBody = appointmentJSON(slotReference, patientReference);

  // FHIR.oauth2.ready handles refreshing access tokens
  FHIR.oauth2.ready(function(smart) {
    smart.api.create({resource: appointmentBody}).then(

      // Display Appointment information if the call succeeded
      function(appointment) {
        renderAppointment(appointment.headers('Location'));
      },

      // Display 'Failed to write Appointment to FHIR server' if the call failed
      function() {
        clearUI();
        $('#errors').html('<p>Failed to write Appointment to FHIR server</p>');
        $('#errors-row').show();
      }
    );
  });
}

function appointmentJSON(slotReference, patientReference) {
  return {
    resourceType: 'Appointment',
    slot: [
      {
        reference: slotReference
      }
    ],
    participant: [
      {
        actor: {
          reference: patientReference
        },
        status: 'needs-action'
      }
    ],
    status: 'proposed'
  };
}

function renderAppointment(appointmentLocation) {
  clearUI();
  $('#appointment').html('<p>Created Appointment ' + appointmentLocation.match(/\d+$/)[0] + '</p>');
  $('#appointment-holder-row').show();
}

$('#patient-search-form').on('submit', function(e) {
  e.preventDefault();
  patientSearch();
});

$('#patient-create-form').on('submit', function(e) {
  e.preventDefault();
  patientCreate();
});

$('#clear-patients').on('click', function(e) {
  $('#patients').html('');
  $('#patients-holder-row').hide();
});

function askForPatient(slotReference, type, start, end) {
  clearUI();
  $('#patient-search-create-row').show();

  $('#patient-search-create-info').html(
    '<p>To book Appointment [' + type + '] on ' + new Date(start).toLocaleDateString() +
    ' at ' + new Date(start).toLocaleTimeString() + ' - ' + new Date(end).toLocaleTimeString() +
    ', select a Patient.</p>'
  );
  sessionStorage.setItem('slotReference', slotReference);
}

function patientSearch() {
  clearPatientUI();
  $('#patient-loading-row').show();

  var form = document.getElementById('patient-search-form');
  var patientParams = {name: form.elements[0].value};

  FHIR.oauth2.ready(function(smart) {
    smart.api.fetchAll({type: 'Patient', query: patientParams}).then(

      // Display Patient information if the call succeeded
      function(patients) {
        // If any Patients matched the criteria, display them
        if (patients.length) {
          var patientsHTML = '',
              slotReference = sessionStorage.getItem('slotReference');

          patients.forEach(function(patient) {
            var patientName = patient.name[0].given.join(' ') + ' ' + patient.name[0].family;
            patientsHTML = patientsHTML + patientHTML(slotReference, patient.id, patientName);
          });

          form.reset();
          renderPatients(patientsHTML);
        }
        // If no Patients matched the criteria, inform the user
        else {
          renderPatients('<p>No Patients found for the selected query parameters.</p>');
        }
      },

      // Display 'Failed to read Patients from FHIR server' if the call failed
      function() {
        clearPatientUI();
        $('#patient-errors').html('<p>Failed to read Patients from FHIR server</p>');
        $('#patient-errors-row').show();
      }
    );
  });
}

function patientHTML(slotReference, patientId, patientName) {
  console.log('Patient: name:[' + patientName + ']');

  var patientReference = 'Patient/' + patientId;

  return "<div class='card'>" +
           "<div class='card-body'>" +
             "<h5 class='card-title'>" + patientName + '</h5>' +
             "<a href='javascript:void(0);' class='card-link' onclick='appointmentCreate(\"" +
               slotReference + '", "' + patientReference + "\");'>Use Patient</a>" +
           '</div>' +
         '</div>';
}

function patientCreate() {
  clearPatientUI();
  $('#patient-loading-row').show();

  // Grab Patient POST body attributes from the patient-create-form
  var form = document.getElementById('patient-create-form');

  var patientBody = patientJSON(
    form.elements['patient-create-firstname'].value,
    form.elements['patient-create-middlename'].value,
    form.elements['patient-create-lastname'].value,
    form.elements['patient-create-phone'].value,
    form.elements['patient-create-male'].checked ? 'male' : 'female',
    form.elements['patient-create-birthdate'].value
  );

  // FHIR.oauth2.ready handles refreshing access tokens
  FHIR.oauth2.ready(function(smart) {
    smart.api.create({resource: patientBody}).then(

      // Display Patient information if the call succeeded
      function(patient) {
        $('#patient-loading-row').hide();
        form.reset();
        alert('Created Patient ' + patient.headers('Location').match(/\d+$/)[0] + '\n\nSearch for them by name.');
      },

      // Display 'Failed to write Patient to FHIR server' if the call failed
      function() {
        $('#patient-loading-row').hide();
        alert('Failed to write Patient to FHIR server');
      }
    );
  });
}

function patientJSON(firstName, middleName, lastName, phone, gender, birthDate) {
  var periodStart = new Date().toISOString();

  return {
    resourceType: 'Patient',
    identifier: [
      {
        assigner: {
          reference: 'Organization/675844'
        }
      }
    ],
    active: true,
    name: [
      {
        use: 'official',
        family: [
          lastName
        ],
        given: [
          firstName,
          middleName
        ],
        period: {
          start: periodStart
        }
      }
    ],
    telecom: [
      {
        system: 'phone',
        value: phone,
        use: 'home'
      }
    ],
    gender: gender,
    birthDate: birthDate
  };
}

function renderPatients(patientsHTML) {
  clearPatientUI();
  $('#patients').html(patientsHTML);
  $('#patients-holder-row').show();
}

function clearPatientUI() {
  $('#patient-errors').html('');
  $('#patient-errors-row').hide();
  $('#patient-loading-row').hide();
  $('#patients').html('');
  $('#patients-holder-row').hide();
}

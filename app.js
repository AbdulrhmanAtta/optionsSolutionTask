    // Define API keys
    const abstractApiKey = '593881e937d2451abda4d8f131e5e333';
    const numverifyApiKey = '217a556a6704161955f02a4e81745d7b';

    function showAlert(message) {
        const modal = document.getElementById('myModal');
        const modalMessage = document.getElementById('modalMessage');
        const span = document.getElementsByClassName('close')[0];
      
        // Set the message and display the modal
        modalMessage.innerHTML = message;
        modal.style.display = 'block';
      
        // Close the modal when the close button is clicked
        span.onclick = function () {
          modal.style.display = 'none';
        };
      
        // Close the modal when clicking outside the modal
        window.onclick = function (event) {
          if (event.target == modal) {
            modal.style.display = 'none';
          }
        };
      }
      
      let currentQuestion = 1;
      let manualCityStateFilled = false;  // Variable to track whether the user filled in city/state manually
    
    
      function nextQuestion() {
        const currentQuestionContainer = document.getElementById(`question${currentQuestion}`);
      
        // Check if any radio button, checkbox, or text input is empty
        const inputs = currentQuestionContainer.querySelectorAll('input[type="radio"], input[type="checkbox"], input[type="text"]');
        for (const input of inputs) {
          if (
            (input.type === 'radio' || input.type === 'checkbox') &&
            !document.querySelector(`input[name="${input.name}"]:checked`)
          ) {
            showAlert('Please answer all questions before proceeding.');
            return;
          } else if (input.type === 'text' && !input.value.trim()) {
            showAlert('Please fill in all input fields before proceeding.');
            return;
          }
        }
      
        currentQuestionContainer.classList.add('fade-out');
      
        setTimeout(() => {
          currentQuestionContainer.classList.remove('active', 'fade-out');
          currentQuestion++;
      
          const nextQuestionContainer = document.getElementById(`question${currentQuestion}`);
          if (nextQuestionContainer) {
            nextQuestionContainer.classList.add('active');
          } else {
            submitForm();
          }
        }, 500); // Adjust the time to match the transition duration
      }
    
      function is_int(value) {
        if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) {
            return true;
        } else {
            return false;
        }
    }

    $(".fancy-form div > div").hide();

    $("#zip").keyup(function () {
        // Cache
        var el = $(this);

        // Did they type five integers?
        if ((el.val().length == 5) && (is_int(el.val()))) {
            // Call Ziptastic for information
            $.ajax({
                url: "https://zip.getziptastic.com/v2/US/" + el.val(),
                cache: false,
                dataType: "json",
                type: "GET",
                success: function (result, success) {
                    $(".zip-error, .instructions").slideUp(200);
                    $("#city").val(result.city);
                    $("#state").val(result.state);
                    $("#cityStateFields").slideDown();
                    $("#zip").blur();
                    $("#address-line-1").show().focus();
                },
                error: function (result, success) {
                    $(".zip-error").slideDown(300);
                }
            });
        } else if (el.val().length < 5) {
            $(".zip-error").slideUp(200);
        }
    });

    // Add an event listener to the "Next" button
    $("#nextButton").click(function () {
        // Add any additional logic you need for the "Next" button click
        // For now, let's just show an alert
        nextQuestion();

    });

      function submitForm() {
        const apiUrl = 'https://bluemodo.leadspediatrack.com/post.do';
      
        const urlParams = new URLSearchParams(window.location.search);
        const lp_s1 = urlParams.get('s1') || '';
        const lp_s2 = urlParams.get('s2') || '';
        const lp_s3 = urlParams.get('s3') || '';
        const lp_s4 = urlParams.get('s4') || '';
        const lp_s5 = urlParams.get('s5') || '';
      
        const formData = new FormData(document.getElementById('leadForm'));
      
        const postData = {
          lp_campaign_id: '64b9ccf73e38c',
          lp_campaign_key: 'mYFhzwtX7LKWBGgD34Tb',
          lp_s1,
          lp_s2,
          lp_s3,
          lp_s4,
          lp_s5,
          lp_test: '0',
          lp_response: 'json',
        };
      
        formData.forEach((value, key) => {
          postData[key] = value;
        });
      
        fetch(apiUrl, {
          method: 'POST',
          body: JSON.stringify(postData),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            // Check if submission was successful
            if (data && data.success) {
              // Display a thank-you message in an alert
              showAlert('Thank you for submitting!');
              // You can also redirect the user to another page or perform other actions here
            } else {
              // Handle other scenarios if needed
              console.log(data); // Log the response for debugging
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
      
    

      function handleFormSubmissionResponse(responseData) {
        console.log('Server Response:', responseData);
        showAlert(responseData.msg); // Assuming the server response has a 'msg' field
      }


      function handleFormSubmissionError(error) {
        console.error('Error submitting form:', error);
        showAlert('An unexpected error occurred. Please try again.');
      }


    function getParameterByName(name) {
      const urlSearchParams = new URLSearchParams(window.location.search);
      return urlSearchParams.get(name);
    }

    async function validateEmailAndPhone() {
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');

    const email = emailInput.value;
    const phone = phoneInput.value;

    // Validate Email
    const emailValidationResponse = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${abstractApiKey}&email=${email}`);
    const emailValidationData = await emailValidationResponse.json();

    if (!emailValidationData.is_valid) {
      document.getElementById('emailError').innerText = 'Invalid email address. Please enter a valid email.';
      return false;
    }

    // Validate Phone
    const phoneValidationResponse = await fetch(`https://numverify.com/api/validate?access_key=${numverifyApiKey}&number=${phone}`);
    const phoneValidationData = await phoneValidationResponse.json();

    if (!phoneValidationData.valid) {
      document.getElementById('phoneError').innerText = 'Invalid phone number. Please enter a valid phone number.';
      return false;
    }

    return true;
  }

  function handleNextButtonClick() {
    validateEmailAndPhone().then((isValid) => {
      if (isValid) {
        // Proceed to the next question or submit the form
        submitForm();
      }
    });
  }

    // Initialize Google Places Autocomplete
    function initAutocomplete() {
        const addressInput = document.getElementById('address');
        const autocomplete = new google.maps.places.Autocomplete(addressInput);
      }


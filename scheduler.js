$(document).ready(function() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const $sliderDiv = $('.slider');

    function minutesToTime(minutes) {
        let hours = Math.floor(minutes / 60);
        if (hours < 10){
            hours = '0' + hours;
        }
        let mins = minutes % 60;
        return `${hours}:${mins.toString().padStart(2, '0')}`;
    }
    
    function timeToMinutes(timeStr) {
        let [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    days.forEach(day => {
        // labels and time inputs
        const $daySection = $('.timeInputs').clone().show();
        $daySection.removeClass('timeInputs').addClass('day-section').attr('data-day', day);
        $daySection.find('.btn-check').each(function(index) {
            $(this).attr('id', `${$(this).attr('id')}-${day}`);
            $(this).attr('name', `btnradio-${day}`);
            $(this).attr('data-day', day);
        });
        $daySection.find('label').each(function(index) {
            const forAttr = $(this).attr('for');
            $(this).attr('for', `${forAttr}-${day}`);
        });
        // time inputs
        $daySection.find('.slider-single').attr('id', `slider-single-${day}`);
        $daySection.find('.slider-double').attr('id', `slider-double-${day}`);
        // day label
        $daySection.prepend(`<h3 class="weekday" data-day="${day}">${day}</h3>`);
        let thisDay = $('.day-section').attr('data-day');

        // create time input identity
        $('.single-table').attr('id',`single-table-${thisDay}`);
        $('.double-table').attr('id',`double-table-${thisDay}`);

        // Initialize the noUiSliders for each day
        const $sliderDouble = document.createElement('div');
        const $sliderSingle = document.createElement('div');
    
        noUiSlider.create($sliderSingle, {
            start: [450, 1080],
            connect: true,
            range: {
                'min': [240],
                'max': [1440]
            },
            step: 15
        });
    
        noUiSlider.create($sliderDouble, {
            start: [450, 700, 800, 1080],
            connect: [false, true, false, true, false],
            range: {
                'min': [240],
                'max': [1440]
            },
            step: 15
        });

        // Append the sliders to the day section
        $daySection.find('.slider-single').append($sliderSingle);
        $daySection.find('.slider-double').append($sliderDouble);
        $('#daysContainer').append($daySection);

        // Event listener for slider to update time inputs
        $sliderSingle.noUiSlider.on('update', function (values, handle) {
            let timeFormatValues = values.map(minutesToTime); // Convert each value to time format
            // Assuming two inputs for a single range slider, adjust if you have more for double range
            console.log(timeFormatValues);
            $daySection.find('#timeInput1').val(timeFormatValues[0]);
            $daySection.find('#timeInput2').val(timeFormatValues[1]);
        });

        $sliderDouble.noUiSlider.on('update', function (values, handle) {
            let timeFormatValues = values.map(minutesToTime); // Convert each value to time format
            // Assuming two inputs for a single range slider, adjust if you have more for double range
            console.log(timeFormatValues);
            $daySection.find('#timeInput3').val(timeFormatValues[0]);
            $daySection.find('#timeInput4').val(timeFormatValues[1]);
            $daySection.find('#timeInput5').val(timeFormatValues[2]);
            $daySection.find('#timeInput6').val(timeFormatValues[3]);
        });

        function sliderSingleTimeUpdate() {
            let startMinutes = timeToMinutes($daySection.find('#timeInput1').val());
            let endMinutes = timeToMinutes($daySection.find('#timeInput2').val());
            return [startMinutes, endMinutes];
        }

        function sliderDoubleTimeUpdate() {
            let startMinutesOne = timeToMinutes($daySection.find('#timeInput3').val());
            let endMinutesOne = timeToMinutes($daySection.find('#timeInput4').val());
            let startMinutesTwo = timeToMinutes($daySection.find('#timeInput5').val());
            let endMinutesTwo = timeToMinutes($daySection.find('#timeInput6').val());
            return [startMinutesOne, endMinutesOne, startMinutesTwo, endMinutesTwo];
        }

        // Event listener for time inputs to update slider
        $daySection.find('.start-time-input, .end-time-input').on('change', function () {
            let startMinutes = timeToMinutes($daySection.find('#timeInput1').val());
            let endMinutes = timeToMinutes($daySection.find('#timeInput2').val());
            $sliderSingle.noUiSlider.set([startMinutes, endMinutes]);
        });

        $daySection.find('.start-time-input, .end-time-input').on('change', function () {
            let startMinutesOne = timeToMinutes($daySection.find('#timeInput3').val());
            let endMinutesOne = timeToMinutes($daySection.find('#timeInput4').val());
            let startMinutesTwo = timeToMinutes($daySection.find('#timeInput5').val());
            let endMinutesTwo = timeToMinutes($daySection.find('#timeInput6').val());
            slider.noUiSlider.set([startMinutesOne, endMinutesOne, startMinutesTwo, endMinutesTwo]);
        });

        // Hide time inputs and labels
        $daySection.find('input[type="time"]').hide();
        $daySection.find('.time-input-label').hide();
        $('.slider-single').hide();
        $('.slider-double').hide();

        // Event listener for radio buttons to toggle input visibility and slider configuration
        $daySection.find('.btn-check').change(function() {
            const selectedOption = $(this).siblings('label[for="' + $(this).attr('id') + '"]').text();
            switch (selectedOption) {
                case 'None':
                    console.log(thisDay + " radio button is selected (NONE)");
                    $daySection.find('input[type="time"]').hide();
                    $daySection.find('.time-input-label').hide();

                    $('.slider-single').hide();
                    $('.slider-double').hide();
                    break;
                case 'Single':
                    console.log(thisDay + " radio button is selected (ONE)");
                    $daySection.find('input[type="time"]').hide();
                    $daySection.find('.time-input-label').hide();
                    $daySection.find('#timeInput1, #timeInput2, #start-time-label, #end-time-label').show();

                    $(`#slider-single-${day}`).show();
                    $(`#slider-double-${day}`).hide();
                    $sliderSingle.noUiSlider.updateOptions({
                        start: sliderSingleTimeUpdate(),
                        connect: [true],
                    }, true);
                    break;
                case 'Double':
                    console.log(thisDay + " radio button is selected (TWO)");
                    $daySection.find('input[type="time"]').hide();
                    $daySection.find('.time-input-label').hide();
                    $daySection.find('#timeInput3, #timeInput4, #timeInput5, #timeInput6').show();
                    $daySection.find('#start-time-1-label, #start-time-2-label, #end-time-1-label, #end-time-2-label').show();

                    $(`#slider-double-${day}`).show();
                    $(`#slider-single-${day}`).hide();
                    $sliderDouble.noUiSlider.updateOptions({
                        start: sliderDoubleTimeUpdate(),
                        connect: [true, true, true, false],
                    }, true);
                    break;
            }
        });

    });

});

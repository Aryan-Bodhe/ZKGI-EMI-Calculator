document.addEventListener("DOMContentLoaded", function () {
    const loanAmountSlider = document.getElementById("loan-amount");
    const loanAmountText = document.getElementById("loan-amount-text");
    const tenureSlider = document.getElementById("tenure");
    const tenureText = document.getElementById("tenure-text");
    const interestRateSlider = document.getElementById("interest-rate");
    const interestRateText = document.getElementById("interest-rate-text");

    const emiDisplay = document.getElementById("emi");

    const loanValueText = document.getElementById("loan-value");
    const rateValueText = document.getElementById("rate-value");
    const tenureValueText = document.getElementById("tenure-value");

    // const offerDropdownContainer = document.getElementById("offer-dropdown-container");
    // const offerDropdown = document.getElementById("offer-options");
    const premiumAmount = document.getElementById("premium-amount");

    const emi_cover_rate = 0.03;
    const gst_rate = 0.18;
    let emiMonthly = 0;

    function calculateEMI() {
        emiMonthly = 0;
        const loanAmount = parseInt(loanAmountText.value, 10);
        const tenure = parseInt(tenureSlider.value, 10);
        const annualInterestRate = parseFloat(interestRateSlider.value);

        const monthlyInterestRate = annualInterestRate / 12 / 100;
        emiMonthly = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenure) / (Math.pow(1 + monthlyInterestRate, tenure) - 1);    
    }

    function syncValues(slider, text) {
        const value = parseFloat(text.value);
        if (isNaN(value) || value < parseFloat(slider.min) || value > parseFloat(slider.max)) {
            // Reject input if out of bounds
            text.value = slider.value; // Reset to slider's current value
            alert(`Please enter a value between ${slider.min} and ${slider.max}.`);
        } else {
            // Sync slider with valid input
            slider.value = value;
            calculateEMI();
        }
    }

    function updateSliders() {
        loanAmountText.value = loanAmountSlider.value;
        tenureText.value = tenureSlider.value;
        interestRateText.value = interestRateSlider.value;
        calculateEMI();
    }

    loanAmountSlider.addEventListener("input", updateSliders);
    tenureSlider.addEventListener("input", updateSliders);
    interestRateSlider.addEventListener("input", updateSliders);

    loanAmountText.addEventListener("change", () => {
        syncValues(loanAmountSlider, loanAmountText);
    });
    tenureText.addEventListener("change", () => {
        syncValues(tenureSlider, tenureText);
    });
    interestRateText.addEventListener("change", () => {
        syncValues(interestRateSlider, interestRateText)
    });
    
    const offerTypeRadios = document.querySelectorAll("input[name='offer-type']");
    
    function calculatePremium() {
        const loanAmount = parseInt(loanAmountText.value, 10);
        const tenureInYears = parseInt(tenureSlider.value, 10) / 12; // Convert months to years
        const slabTenure = Math.ceil(tenureInYears);
        const tenureExcessMonths = parseInt(tenureSlider.value, 10) % 12;
        const offerType = document.querySelector("input[name='offer-type']:checked").value;


        loanValueText.textContent = loanAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        if(Math.floor(tenureInYears) === 0)
            tenureValueText.textContent = `${tenureExcessMonths} Month(s)`;
        else
            tenureValueText.textContent = `${Math.floor(tenureInYears)} Year(s), ${tenureExcessMonths} Month(s)`;
        rateValueText.textContent = interestRateSlider.value.toString();

        const hospicash_amount = 1750; // excudes gst, accounted for it later
        let ff_value = 0;
        let emiCoverAmount = 0;
        let finalPremium = 0;

        // Base premium logic, excluding gst
        if (offerType === "ff-hospicash") {
           if(loanAmount <= 500000) {
            ff_value = 8475;
           } else if(loanAmount <= 800000) {
            ff_value = 14000;
           } else if(loanAmount <= 1000000) {
            ff_value = 15000;
           } else {
            ff_value = 18000;
           }
           finalPremium = ff_value + hospicash_amount;

        } else if (offerType === "ff-hospicash-emi") {
            emiCoverAmount = (emiMonthly * emi_cover_rate * tenureInYears);  
            if(loanAmount <= 500000) {
            ff_value = 8475;
            } else if(loanAmount <= 800000) {
            ff_value = 14000;
            } else if(loanAmount <= 1000000) {
            ff_value = 15000;
            } else {
            ff_value = 18000;
            }
            finalPremium = ff_value + hospicash_amount + emiCoverAmount;
        }
        
        // adding gst
        finalPremium = (1 + gst_rate) * finalPremium;

        // Final premium calculation
        if(loanAmount === 0) finalPremium = 0;
        
        // left side box
        premiumAmount.textContent = `Total Premium : ₹ ${finalPremium.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/-`;
        // right side box
        emiDisplay.textContent = (emiMonthly).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    // Event Listeners
    loanAmountSlider.addEventListener("input", () => {
        calculateEMI();
        calculatePremium();
    });
    loanAmountText.addEventListener("change", () => {
        calculateEMI();
        calculatePremium();
    });
    tenureSlider.addEventListener("input", () => {
        calculateEMI();
        calculatePremium();
    });
    tenureText.addEventListener("change", () => {
        calculateEMI();
        calculatePremium();
    });

    interestRateSlider.addEventListener("input", () => {
        calculateEMI();
        calculatePremium();
    });
    
    interestRateText.addEventListener("change", () => {
        calculateEMI();
        calculatePremium();
    });
    
    // offerDropdown.addEventListener("change", () => {
    //     calculateEMI();
    //     calculatePremium();
    // });

    offerTypeRadios.forEach(radio => radio.addEventListener("change", () => {
        calculateEMI();
        calculatePremium();
    }));

    // Initialize
    calculateEMI();
    calculatePremium();
});

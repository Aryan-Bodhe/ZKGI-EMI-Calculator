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

    const offerDropdownContainer = document.getElementById("offer-dropdown-container");
    const offerDropdown = document.getElementById("offer-options");
    const premiumAmount = document.getElementById("premium-amount");

    const hospi_individual = 1610;
    const emicoverRate = 0.096;
    let emiMonthly = 0;

    function calculateEMI() {
        emiMonthly = 0;
        interestAmount = 0;
        const loanAmount = parseInt(loanAmountSlider.value, 10);
        const tenure = parseInt(tenureSlider.value, 10);
        const annualInterestRate = parseFloat(interestRateSlider.value);

        const monthlyInterestRate = annualInterestRate / 12 / 100;
        emiMonthly = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenure) / (Math.pow(1 + monthlyInterestRate, tenure) - 1);
        const totalAmount = emiMonthly * tenure;
        interestAmount = totalAmount - loanAmount;  
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
        const loanAmount = parseInt(loanAmountSlider.value, 10);
        const tenureInYears = parseInt(tenureSlider.value, 10) / 12; // Convert months to years
        const tenureExcessMonths = parseInt(tenureSlider.value, 10) % 12;
        const slabTenure = Math.ceil(tenureInYears);
        const offerType = document.querySelector("input[name='offer-type']:checked").value;


        loanValueText.textContent = loanAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        if(Math.floor(tenureInYears) === 0)
            tenureValueText.textContent = `${tenureExcessMonths} Month(s)`;
        else
            tenureValueText.textContent = `${Math.floor(tenureInYears)} Year(s), ${tenureExcessMonths} Month(s)`;
        rateValueText.textContent = interestRateSlider.value.toString();

        let premium = 0;
        let finalPremium = 0;
        let additionalPrice = 0; 
        // Base premium logic
        if (offerType === "hospicash") {

            if (loanAmount >= 500000) {
                offerDropdownContainer.style.display = "block";
                const selectedOption = offerDropdown.value;
                premium = { A2: 2576, A2C1: 3381, A2C2: 4057, A1C1: 2415 }[selectedOption] || 0;
                additionalPrice = {A2: 16, A2C1: 21, A2C2: 26, A1C1: 15}[selectedOption] || 0; // only when tenure is between 1 and 2 yrs

                if(tenureInYears > 5) 
                    finalPremium = (premium) * (5) + additionalPrice;
                else if(2 < tenureInYears)
                    finalPremium = (premium) * (slabTenure) + additionalPrice;
                else if(tenureInYears <= 1)
                    finalPremium = premium
                else
                    finalPremium = premium * (slabTenure);

            } else {
                additionalPrice = 10;
                if(tenureInYears > 5) 
                    finalPremium = hospi_individual * (5) + additionalPrice;
                else if(2 < tenureInYears)
                    finalPremium = (hospi_individual) * slabTenure + additionalPrice;
                else if(tenureInYears <= 1)
                    finalPremium = hospi_individual
                else
                    finalPremium = hospi_individual * (slabTenure);
                offerDropdownContainer.style.display = "none";
            }
        } else if (offerType === "hospicash-emi") {
            if (loanAmount >= 500000) {
                offerDropdownContainer.style.display = "block";
                const selectedOption = offerDropdown.value;
                console.log('Offer dropdown value',selectedOption);
                premium = { A2: 2576, A2C1: 3381, A2C2: 4057, A1C1: 2415 }[selectedOption] || 0;
                additionalPrice = {A2: 16, A2C1: 21, A2C2: 26, A1C1: 15}[selectedOption] || 0; 

                if(tenureInYears > 5) 
                    finalPremium = (emiMonthly * emicoverRate * 5) + (premium * 5) + additionalPrice;
                else if(2 < tenureInYears)
                    finalPremium = (emiMonthly * emicoverRate * slabTenure) + (premium * slabTenure + additionalPrice);
                else if(tenureInYears <= 1)
                    finalPremium = (emiMonthly * emicoverRate) + premium;
                else
                    finalPremium = (emiMonthly * emicoverRate * slabTenure) + (premium * slabTenure); 

            } else {
                additionalPrice = 10;
                if(tenureInYears > 5) 
                    finalPremium = (emiMonthly * emicoverRate * 5) + (hospi_individual * 5) + additionalPrice;
                else if(2 < tenureInYears)
                    finalPremium = (emiMonthly * emicoverRate * slabTenure) + (hospi_individual * slabTenure + additionalPrice);
                else if(tenureInYears <= 1)
                    finalPremium = (emiMonthly * emicoverRate) + hospi_individual;
                else
                    finalPremium = (emiMonthly * emicoverRate * slabTenure) + (hospi_individual * slabTenure);

                offerDropdownContainer.style.display = "none";
            }
        }
        
        // Final premium calculation
        if(loanAmount === 0) finalPremium = 0;
        
        emiDisplay.textContent = (emiMonthly).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        premiumAmount.textContent = `Total Premium : ₹ ${finalPremium.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/-`;
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
    
    offerDropdown.addEventListener("change", () => {
        calculateEMI();
        calculatePremium();
    });

    offerTypeRadios.forEach(radio => radio.addEventListener("change", () => {
        calculateEMI();
        calculatePremium();
    }));

    // Initialize
    calculateEMI();
    calculatePremium();
});

function addSubdomain() {
    const subdomainsContainer = document.getElementById('subdomains-container');
    const newSubdomainInput = document.createElement('input');
    newSubdomainInput.type = 'text';
    newSubdomainInput.className = 'sub_domain';
    newSubdomainInput.placeholder = 'New Subdomain..';
    subdomainsContainer.appendChild(newSubdomainInput);
}

function handleRadioChange(selectedValue) {
    const additionalOptionContainer = document.querySelector('.additional-option');
    if (selectedValue === 'a:') {
        additionalOptionContainer.style.display = 'none';
    } else {
        additionalOptionContainer.style.display = 'block';
    }
}

function processDomains() {
    // const inputDomains = document.getElementById('domains').value.split('\n').map(domain => domain.trim());
    let inputDomains = document.getElementById('domains').value.split('\n').map(domain => domain.trim());
    inputDomains = inputDomains.filter(domain => domain !== '');
    inputDomains = [...new Set(inputDomains)];

    const spf_domain = document.getElementById('spf_domain').value;
    const sub_domains = document.querySelectorAll('.sub_domain');
    const groupSize = parseInt(document.getElementById('groupSize').value, 10);
    const allType = document.getElementById('allType').value;
    const ipClassInput = document.getElementById('ipClass');
    const ipClass = ipClassInput ? ipClassInput.value : '';
    const selectedRadio = document.querySelector('input[name="switch"]:checked');
    const finalRS = document.querySelector('.final');

    if (!inputDomains || !spf_domain ||
        (!ipClassInput && (selectedRadio && (selectedRadio.id === 'ip4' || selectedRadio.id === '+ip4'))) ||
        Array.from(sub_domains).some(sub_domain => !sub_domain.value.trim())
    ) {
        showAlert('Please fill in all required fields.');
        return;
    }

    if (ipClassInput && !ipClassInput.checkValidity()) {
        showAlert('Please enter a valid IP class (e.g., 8)');
        return;
    }

    if ((selectedRadio && (selectedRadio.id === 'ip4' || selectedRadio.id === '+ip4')) && !ipClass) {
        showAlert('Please enter IP class for ip4 or +ip4');
        return;
    }

    if (Array.from(sub_domains).some(sub_domain => !sub_domain.value.trim())) {
        showAlert('Please fill in all subdomains.');
        return;
    }

    let result = '';
    let generated_doms = '';
    let generated_doms_include = '';
    var cc = document.getElementById("inc");

    for (let i = 0, count = 1; i < inputDomains.length; i += groupSize, count++) {
        const domainGroup = inputDomains.slice(i, i + groupSize);

        if (domainGroup.length === 0) {
            continue;
        }

        if (i > 0) {
            result += '\n';
        }

        let subdomainsString = '';

        if (sub_domains.length > 0) {
            sub_domains.forEach((sub_domain, index) => {
                if (index > 0) {
                    subdomainsString += '.';
                }
                subdomainsString += `${sub_domain.value}${count}`;
            });
        }

        let aPart = 'a:';
        if (selectedRadio && (selectedRadio.id === 'ip4' || selectedRadio.id === '+ip4')) {
            aPart = selectedRadio.id;
        }

        if (ipClass && (selectedRadio && (selectedRadio.id === 'ip4' || selectedRadio.id === '+ip4'))) {
            result += `${subdomainsString}.${spf_domain},v=spf,${domainGroup.map(domain => ` ${aPart}:${domain}/${ipClass}`).join('')} ${allType} \n`;
            generated_doms += `${subdomainsString}.${spf_domain}\n`;
            generated_doms_include += `include:${subdomainsString}.${spf_domain}\n`;
        } else {
            result += `${subdomainsString}.${spf_domain},v=spf,${domainGroup.map(domain => ` ${aPart}${domain}`).join('')} ${allType}\n`;
            generated_doms += `${subdomainsString}.${spf_domain}\n`;
            generated_doms_include += `include:${subdomainsString}.${spf_domain}\n`;
        }
    }

    document.getElementById('result').value = result;

    finalRS.style.display = 'block';
    updateGeneratedDomains(generated_doms);
    updateGeneratedDomainsInc2(generated_doms_include);
        inc.textContent = `With include: ${generated_doms.split('\n').filter(line => line.trim() !== '').length}`;


}

function updateGeneratedDomains(generatedDomains) {
    const newRecordsTextarea = document.getElementById('new_records');
    newRecordsTextarea.value = generatedDomains;
 
}
function updateGeneratedDomainsInc2(generated_doms_include) {
   
    const newRecordsTextarea2 = document.getElementById('new_records2');
  
    newRecordsTextarea2.value = generated_doms_include;
}

function showAlert(message) {
    $('.custom-alert').addClass("show");
    $('.custom-alert').removeClass("hide");
    $('.custom-alert').addClass("showAlert");
    $('.custom-alert .msg').text(message);
    setTimeout(function () {
        $('.custom-alert').removeClass("show");
        $('.custom-alert').addClass("hide");
    }, 5000);
}

$('.close-btn').click(function () {
    $('.custom-alert').removeClass("show");
    $('.custom-alert').addClass("hide");
});

$('.alert-button').click(function () {
    showAlert('This is a custom alert message.');
});

document.querySelector('.copy.result').addEventListener('click', function () {
    const resultTextarea = document.getElementById('result');
    resultTextarea.select();
    document.execCommand('copy');

    const tooltip = this.querySelector('.tooltip');
    tooltip.textContent = tooltip.getAttribute('data-text-end');

    setTimeout(function () {
        tooltip.textContent = tooltip.getAttribute('data-text-initial');
    }, 2000);
});


// chang
document.addEventListener('focusin', function (event) {
    if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
        event.target.style.transition = 'background 0.3s ease-in-out';
        event.target.style.background = 'linear-gradient(to bottom, #2c2c2c, #252525)';
    }
});

document.addEventListener('focusout', function (event) {
    if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
        event.target.style.transition = '';
        event.target.style.background = '';
    }
});

// change


// copy2
document.querySelector('.copy.new-records').addEventListener('click', function () {
    const newRecordsTextarea = document.getElementById('new_records');
    newRecordsTextarea.select();
    document.execCommand('copy');

    const tooltip = this.querySelector('.tooltip');
    tooltip.textContent = tooltip.getAttribute('data-text-end');

    setTimeout(function () {
        tooltip.textContent = tooltip.getAttribute('data-text-initial');
    }, 2000);
});

// copy2
document.querySelector('.copy.new-records2').addEventListener('click', function () {
    const newRecordsTextarea2 = document.getElementById('new_records2');
    newRecordsTextarea2.select();
    document.execCommand('copy');

    const tooltip = this.querySelector('.tooltip');
    tooltip.textContent = tooltip.getAttribute('data-text-end');

    setTimeout(function () {
        tooltip.textContent = tooltip.getAttribute('data-text-initial');
    }, 2000);
});
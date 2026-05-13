let currentViewDate = new Date();

// This ensures we always target the Tuesday of the week we are looking at
function getTuesday(d) {
    const date = new Date(d);
    const day = date.getDay(); 
    // If today is Sunday(0) or Monday(1), go forward to Tuesday.
    // Otherwise, go forward to the next Tuesday.
    const diff = (day <= 2) ? (2 - day) : (2 - day + 7);
    date.setDate(date.getDate() + diff);
    return date;
}

async function updateUI() {
    const response = await fetch('bins.json');
    const binData = await response.json();
    
    const targetTuesday = getTuesday(currentViewDate);
    const dateKey = targetTuesday.toLocaleDateString('en-CA'); // Gets YYYY-MM-DD reliably
    const binType = binData[dateKey];

    document.getElementById('date-text').innerText = targetTuesday.toLocaleDateString('en-GB', { 
        weekday: 'long', day: 'numeric', month: 'long' 
    });

    const nameElem = document.getElementById('bin-name');
    const colorElem = document.getElementById('bin-color');

    if (binType) {
        nameElem.innerText = binType;
        let cssClass = binType === "Cardboard" ? "blue" : 
                       binType === "Bottles/Cans" ? "light-green" : "dark-green";
        colorElem.className = "bin-display " + cssClass;
    } else {
        nameElem.innerText = "No Data";
        colorElem.className = "bin-display";
    }
}

async function renderYearView() {
    const response = await fetch('bins.json');
    const binData = await response.json();
    const container = document.getElementById('months-container');
    container.innerHTML = '';

    const months = [
        { name: "April", year: 2026, index: 3 },
        { name: "May", year: 2026, index: 4 },
        { name: "June", year: 2026, index: 5 },
        { name: "July", year: 2026, index: 6 },
        { name: "August", year: 2026, index: 7 },
        { name: "September", year: 2026, index: 8 },
        { name: "October", year: 2026, index: 9 },
        { name: "November", year: 2026, index: 10 },
        { name: "December", year: 2026, index: 11 },
        { name: "January", year: 2027, index: 0 },
        { name: "February", year: 2027, index: 1 },
        { name: "March", year: 2027, index: 2 }
    ];

    months.forEach(m => {
        const monthDiv = document.createElement('div');
        monthDiv.className = 'month-card';
        monthDiv.innerHTML = `<div class="month-name">${m.name} ${m.year}</div>`;
        
        const daysGrid = document.createElement('div');
        daysGrid.className = 'days-grid';
        ['M','T','W','T','F','S','S'].forEach(d => daysGrid.innerHTML += `<div class="day-label">${d}</div>`);

        // Find what day of the week the 1st is
        const firstDayDate = new Date(m.year, m.index, 1);
        let firstDay = firstDayDate.getDay(); 
        
        // Convert Sunday=0 to Sunday=6, Monday=0
        let offset = (firstDay === 0) ? 6 : firstDay - 1;

        // Add empty spaces for the start of the month
        for(let i=0; i < offset; i++) {
            daysGrid.innerHTML += `<div></div>`;
        }

        const daysInMonth = new Date(m.year, m.index + 1, 0).getDate();

        for(let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(m.year, m.index, day);
            const dateKey = dateObj.toLocaleDateString('en-CA');
            const type = binData[dateKey];
            
            let colorClass = "";
            if (type === "Cardboard") colorClass = "cal-blue";
            if (type === "Bottles/Cans") colorClass = "cal-light-green";
            if (type === "General Waste") colorClass = "cal-dark-green";

            daysGrid.innerHTML += `<div class="day-cell ${colorClass}">${day}</div>`;
        }
        monthDiv.appendChild(daysGrid);
        container.appendChild(monthDiv);
    });
}

function toggleCalendar() {
    const view = document.getElementById('year-view');
    view.classList.toggle('hidden');
    if (!view.classList.contains('hidden')) renderYearView();
}

function changeDate(days) { currentViewDate.setDate(currentViewDate.getDate() + days); updateUI(); }
function jumpToNow() { currentViewDate = new Date(); updateUI(); }

updateUI();
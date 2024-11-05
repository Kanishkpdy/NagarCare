// contractor.js

document.addEventListener("DOMContentLoaded", () => {
    const contractorForm = document.getElementById("contractorForm");
    const contractorResults = document.getElementById("contractorResults");

    // Handle form submission
    contractorForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const location = document.getElementById("location").value; // Get the value from the location input

        // Clear previous results
        contractorResults.innerHTML = '';

        // Show a loading message
        contractorResults.innerHTML = "<li>Searching for contractors...</li>";

        try {
            // Fetch contractors based on the user's location
            const response = await fetch(`/api/contractors?location=${encodeURIComponent(location)}`);
            const contractors = await response.json(); // Parse the response as JSON

            // Check if any contractors were found
            if (contractors.length === 0) {
                contractorResults.innerHTML = "<li>No contractors found in this area.</li>";
                return;
            }

            // Loop through the contractors and display them
            contractors.forEach(contractor => {
                const listItem = document.createElement('li');
                listItem.textContent = `${contractor.name} - Contact: ${contractor.contact} - Charges: $${contractor.charges}`;
                contractorResults.appendChild(listItem); // Add the contractor info to the list
            });
        } catch (error) {
            console.error('Error fetching contractors:', error); // Log error to console
            contractorResults.innerHTML = "<li>Error fetching contractors. Please try again.</li>"; // Display error message
        }
    });
});

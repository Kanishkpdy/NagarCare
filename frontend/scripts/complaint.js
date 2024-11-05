// complaint.js

document.addEventListener("DOMContentLoaded", () => {
  const complaintForm = document.getElementById("complaintForm");
  const statusMessage = document.getElementById("statusMessage");

  // Handle form submission
  complaintForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form submission

    // Gather form data
    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("contactNumber", document.getElementById("contactNumber").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("problemType", document.getElementById("problemType").value);
    formData.append("location", document.getElementById("location").value);
    formData.append("description", document.getElementById("description").value);
    
    // Handling photo upload
    const photoInput = document.getElementById("photo");
    if (photoInput.files.length > 0) {
      formData.append("photo", photoInput.files[0]);
    }

    // Show a loading message
    statusMessage.innerText = "Submitting complaint...";
    statusMessage.style.color = "blue";

    try {
      // Send complaint data to the server
      const response = await fetch("/api/complaints", {
        method: "POST",
        body: formData
      });

      // Handle the response from the server
      if (response.ok) {
        const data = await response.json();
        statusMessage.innerText = `Complaint submitted successfully! Reference ID: ${data.referenceId}`;
        statusMessage.style.color = "green";

        // Clear the form
        complaintForm.reset();
      } else {
        throw new Error("Failed to submit complaint");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      statusMessage.innerText = "Error submitting complaint. Please try again.";
      statusMessage.style.color = "red";
    }
  });
});

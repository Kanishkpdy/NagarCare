// scripts/complaint.js
document.getElementById('complaintForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const email = document.getElementById('email').value;
    const type = document.getElementById('type').value;
    const location = document.getElementById('location').value;
    const photo = document.getElementById('photo').files[0];

    const formData = new FormData();
    formData.append('name', name);
    formData.append('contact', contact);
    formData.append('email', email);
    formData.append('type', type);
    formData.append('location', location);
    if (photo) {
        formData.append('photo', photo);
    }

    try {
        const response = await fetch('/api/complaints', {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error submitting complaint:', error);
        alert('Error submitting complaint');
    }
});

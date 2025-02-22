document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Default form submission को रोकें

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('image', document.getElementById('image').files[0]);

    try {
        const response = await fetch('http://mrghazipur.in/api/profile', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok) {
            
            if (result.data && result.data.image && result.data.name) {
                
                document.getElementById('profileImage').src = result.data.image; 
                document.getElementById('profileImage').style.display = 'block'; 
                document.getElementById('profileName').innerText = 'Name: ' + result.data.name; 
                document.getElementById('profileInfo').style.display = 'block'; 
            } else {
                console.error('Invalid API response structure:', result);
                alert('Invalid API response structure. Please check the server response.');
            }
        } else {
            console.error('API Error:', result);
            alert(result.errors ? JSON.stringify(result.errors) : 'Failed to upload profile. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while uploading the profile.');
    }
});

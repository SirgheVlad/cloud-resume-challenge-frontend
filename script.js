document.addEventListener('DOMContentLoaded', () => {
    const darkModeBtn = document.getElementById('dark-mode-btn');
    const visitorCountSpan = document.getElementById('visitor-count');

    darkModeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      console.log('Dark mode toggled');
    });

    fetch('https://o1ck7ephj0.execute-api.us-east-1.amazonaws.com/Prod/count', {
      method: 'GET',
      mode: 'cors'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.text(); // Get raw response for debugging
      })
      .then(text => {
        console.log('Raw response:', text); // Log raw response
        let data;
        try {
          data = JSON.parse(text);
          // Check if the response is wrapped by API Gateway
          if (data.body) {
            const innerData = JSON.parse(data.body);
            if (innerData.count !== undefined) {
              visitorCountSpan.textContent = innerData.count;
              return;
            }
          }
          if (data.count !== undefined) {
            visitorCountSpan.textContent = data.count;
          } else {
            throw new Error('No count field in response');
          }
        } catch (e) {
          throw new Error('Invalid JSON response: ' + e.message);
        }
      })
      .catch(error => {
        console.error('Error fetching visitor count:', error);
        visitorCountSpan.textContent = 'Error: ' + error.message;
      });
});
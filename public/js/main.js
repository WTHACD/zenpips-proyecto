import { getNews, getTestimonials } from './apiService.js';

// --- FUNCTION TO RENDER NEWS (CORRECTED) ---
function renderNews(articles, container) {
  container.innerHTML = '';
  articles.slice(0, 6).forEach(article => {
    const articleElement = document.createElement('div');    
    articleElement.className = 'card news-card';

    const imageUrl = article.urlToImage || '/images/default-news.jpg';
   
    articleElement.innerHTML = `
      <img src="${imageUrl}" alt="" class="card-image">
      <div class="card-content">
        <h3 class="font-bold text-lg mb-2">${article.title}</h3>
        <p class="text-gray-600 text-sm mb-4">${article.description || ''}</p>
        <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="read-more-link">Read more</a>
      </div>
    `;

    const img = articleElement.querySelector('.card-image');
    img.addEventListener('error', () => { 
      img.src = '/images/default-news.jpg'; 
      img.alt = 'Default news image';
    });
    img.alt = article.title;

    container.appendChild(articleElement);
  });
}

// --- FUNCTION TO RENDER TESTIMONIALS (IMPROVED) ---
function renderTestimonials(testimonials, container) {
  container.innerHTML = '';
  testimonials.forEach(testimonial => {
    const testimonialElement = document.createElement('div');   
    testimonialElement.className = 'card testimonial-card';
    
    testimonialElement.innerHTML = `
      <p class="text-gray-700 italic">"${testimonial.body}"</p>
      <h4 class="font-bold text-right mt-4">- Anonymous Investor</h4>
    `;
    container.appendChild(testimonialElement);
  });
}


// --- MAIN CODE THAT RUNS WHEN THE PAGE IS READY ---
document.addEventListener('DOMContentLoaded', () => {

  // Logic for dynamic sections
  const newsContainer = document.getElementById('news-container');
  if (newsContainer) {
    getNews()
      .then(articles => renderNews(articles, newsContainer))
      .catch(error => {
        console.error('Error fetching news:', error);
        newsContainer.innerHTML = '<p>Sorry, we could not load the news at this moment.</p>';
      });
  }

  const testimonialsContainer = document.getElementById('testimonials-container');
  if (testimonialsContainer) {
    getTestimonials()
      .then(testimonials => renderTestimonials(testimonials, testimonialsContainer))
      .catch(error => {
        console.error('Error fetching testimonials:', error);
        testimonialsContainer.innerHTML = '<p>Could not load testimonials.</p>';
      });
  }
  
  // Logic for the mobile menu
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  const mobileNavMenu = document.getElementById('mobileNavMenu');
  if (mobileMenuButton && mobileNavMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileNavMenu.classList.toggle('is-active');
    });
  }

  // Logic for the theme switcher
  const themeSwitcher = document.getElementById('theme-switcher');
  const body = document.body;

  function applyTheme(theme) {
    body.classList.remove('theme-light', 'theme-dark');
    body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
  }

  if (themeSwitcher) {
    themeSwitcher.addEventListener('click', () => {
      const currentTheme = localStorage.getItem('theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
    });
  }

  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  // --- LOGIC FOR THE PERFORMANCE SIMULATOR ---
  const simulatorForm = document.getElementById('simulator-form');
  
  if (simulatorForm) {
    const amountInput = document.getElementById('investment-amount');
    const resultsContainer = document.getElementById('simulation-results');

    simulatorForm.addEventListener('submit', (event) => {
      event.preventDefault(); 

      const initialAmount = parseFloat(amountInput.value);
      if (isNaN(initialAmount) || initialAmount <= 0) {
        resultsContainer.innerHTML = '<p class="error-msg">Please enter a valid positive amount.</p>';
        return;
      }

      let currentBalance = initialAmount;
      const results = [];

      for (let month = 1; month <= 12; month++) {
        // Generates a random return between -8% and +15%
        const monthlyReturnPercent = Math.random() * (15 - (-8)) + (-8);
        const gainLoss = currentBalance * (monthlyReturnPercent / 100);
        const endBalance = currentBalance + gainLoss;

        results.push({
          month,
          startBalance: currentBalance,
          percent: monthlyReturnPercent,
          gainLoss,
          endBalance
        });

        currentBalance = endBalance; // The final balance is the initial balance for the next month
      }

      renderSimulationResults(results, resultsContainer, initialAmount);
    });

    // Clears the results if the user changes the value
    amountInput.addEventListener('input', () => {
      resultsContainer.innerHTML = '';
    });
  }

  function renderSimulationResults(results, container, initialAmount) {
    let tableHTML = `
      <h3 class="text-xl font-bold mb-4">Simulation Results</h3>
      <table class="results-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Return</th>
            <th>Gain/Loss</th>
            <th>End Balance</th>
          </tr>
        </thead>
        <tbody>
    `;

    results.forEach(res => {
      const isLoss = res.gainLoss < 0;
      tableHTML += `
        <tr>
          <td>${res.month}</td>
          <td class="${isLoss ? 'text-loss' : 'text-gain'}">${res.percent.toFixed(2)}%</td>
          <td class="${isLoss ? 'text-loss' : 'text-gain'}">${res.gainLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
          <td>${res.endBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
        </tr>
      `;
    });

    const finalBalance = results[results.length - 1].endBalance;
    const totalGain = finalBalance - initialAmount;
    const totalReturn = (totalGain / initialAmount) * 100;

    tableHTML += `
        </tbody>
      </table>
      <div class="summary mt-6">
        <h4 class="text-lg font-bold">Total Summary</h4>
        <p><strong>Total Return:</strong> <span class="${totalGain < 0 ? 'text-loss' : 'text-gain'}">${totalReturn.toFixed(2)}%</span></p>
        <p><strong>Final Balance:</strong> ${finalBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
      </div>
    `;
    
    container.innerHTML = tableHTML;
  }

   // --- LOGIC FOR THE CONTACT FORM ---
   const contactForm = document.getElementById('contact-form');
  
   if (contactForm) {
     const formStatus = document.getElementById('form-status');
 
     contactForm.addEventListener('submit', (event) => {
       event.preventDefault(); // Prevents the page from reloading
 
       // Successful submission simulation
       formStatus.innerHTML = '<p class="success-msg">Thank you for your message! We will get back to you shortly.</p>';
       formStatus.style.display = 'block';
 
       // Clear the form
       contactForm.reset();
 
       // Optional: Hide the message after a few seconds
       setTimeout(() => {
         formStatus.style.display = 'none';
       }, 5000); // 5 seconds
     });
   }


});
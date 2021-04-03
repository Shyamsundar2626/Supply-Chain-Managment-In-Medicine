function logSubmit(event) {
    window.alert("Account Created Sucessfully!!");
    event.preventDefault();
  }
  
  const form = document.getElementById('form');
  const log = document.getElementById('log');
  form.addEventListener('submit', logSubmit);
 
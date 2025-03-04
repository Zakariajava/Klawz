function doRegister(event) {
  event.preventDefault();

  const name = document.getElementById('regName').value.trim();
  const lastname = document.getElementById('regLastname').value.trim();
  const address = document.getElementById('regAddress').value.trim();
  const city = document.getElementById('regCity').value.trim();
  const province = document.getElementById('regProvince').value.trim();
  const zip = document.getElementById('regZip').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPassword').value.trim();
  const pass2 = document.getElementById('regPassword2').value.trim();

  if (!name || !lastname || !email || !pass) {
    alert('Faltan campos obligatorios');
    return;
  }
  if (pass !== pass2) {
    alert('Las contraseñas no coinciden');
    return;
  }

  let users = JSON.parse(localStorage.getItem('users')) || [];
  let exists = users.some(u => u.email === email);
  if (exists) {
    alert('Ese email ya está registrado');
    return;
  }

  const newUser = {
    name,
    lastname,
    address,
    city,
    province,
    zip,
    phone,
    email,
    password: pass,
    orders: []
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  alert('Usuario registrado con éxito. Ahora puedes iniciar sesión.');
  window.location.href = '../html/login.html';
}

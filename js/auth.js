const signupForm =document.querySelector('#signup');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signupForm['signup-email'].value;
    const name = signupForm['signup-fullname'].value;
    const password = signupForm['signup-password'].value;
    const profile = signupForm['signup-profile'].files;

    console.log();(email, password,)

})
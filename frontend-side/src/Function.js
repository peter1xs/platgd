 






































 
        // Tab switching functionality
        const loginTab = document.getElementById('login-tab');
        const signupTab = document.getElementById('signup-tab');
        const loginForm = document.getElementById('login');
        const signupForm = document.getElementById('signup');

        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            
            loginForm.classList.remove('inactive');
            loginForm.classList.add('active');
            
            signupForm.classList.remove('active');
            signupForm.classList.add('inactive');
            
            document.querySelector('h1').textContent = 'Welcome Back! 👋';
        });

        signupTab.addEventListener('click', () => {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            
            signupForm.classList.remove('inactive');
            signupForm.classList.add('active');
            
            loginForm.classList.remove('active');
            loginForm.classList.add('inactive');
            
            document.querySelector('h1').textContent = 'Join the Fun! 🎉';
        });

        // Form submission with confetti effect
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');

        function createConfetti() {
            const colors = ['#ff9aa2', '#ffb7b2', '#ffdfba', '#b5ead7', '#c7ceea', '#a2d2ff'];
            const container = document.querySelector('.container');
            
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = -10 + 'px';
                confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
                confetti.style.width = Math.random() * 10 + 5 + 'px';
                confetti.style.height = Math.random() * 10 + 5 + 'px';
                container.appendChild(confetti);
                
                const animationDuration = Math.random() * 3 + 2;
                
                confetti.animate([
                    { top: '-10px', opacity: 1, transform: `rotate(0deg) translateX(${Math.random() * 100 - 50}px)` },
                    { top: '100%', opacity: 0, transform: `rotate(${Math.random() * 360}deg) translateX(${Math.random() * 100 - 50}px)` }
                ], {
                    duration: animationDuration * 1000,
                    easing: 'cubic-bezier(0.1, 0.8, 0.9, 1)'
                });
                
                setTimeout(() => {
                    confetti.remove();
                }, animationDuration * 1000);
            }
        }

        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            createConfetti();
            // Add your login logic here
        });

        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            createConfetti();
            // Add your signup logic here
        });

        // Add floating animation to social buttons
        const socialBtns = document.querySelectorAll('.social-btn');
        socialBtns.forEach(btn => {
            btn.addEventListener('mouseover', () => {
                btn.style.transform = 'translateY(-5px)';
            });
            
            btn.addEventListener('mouseout', () => {
                btn.style.transform = 'translateY(0)';
            });
        });
    